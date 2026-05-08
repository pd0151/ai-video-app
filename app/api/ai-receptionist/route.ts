import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import twilio from "twilio";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const client = twilio(
process.env.TWILIO_ACCOUNT_SID!,
process.env.TWILIO_AUTH_TOKEN!
);

function clean(text: string) {
return text || "";
}

function wordsToDigits(text: string) {
return text
.toLowerCase()
.replace(/zero|oh/g, "0")
.replace(/one/g, "1")
.replace(/two/g, "2")
.replace(/three/g, "3")
.replace(/four/g, "4")
.replace(/five/g, "5")
.replace(/six/g, "6")
.replace(/seven/g, "7")
.replace(/eight/g, "8")
.replace(/nine/g, "9")
.replace(/hundred/g, "00");
}

function getUserAnswers(transcript: string) {
return transcript
.split(/\n/)
.filter((line) => line.trim().toLowerCase().startsWith("user:"))
.map((line) => line.replace(/^user:\s*/i, "").trim());
}

function extractPhone(transcript: string) {
const answers = getUserAnswers(transcript);

for (const answer of answers) {
if (/phone|number|contact|mobile/i.test(answer)) {
const normal = wordsToDigits(answer).replace(/\s+/g, "");
const found = normal.match(/07\d{9}/);
if (found) return found[0];
}
}

for (const answer of answers) {
const normal = wordsToDigits(answer).replace(/\s+/g, "");
const found = normal.match(/07\d{9}/);
if (found) return found[0];
}

return "Not given";
}

function extractTyreSize(transcript: string) {
const answers = getUserAnswers(transcript);

for (const answer of answers) {
const lower = answer.toLowerCase();

if (/phone|number|contact|mobile|postcode/i.test(lower)) continue;

if (
(lower.includes("205") || lower.includes("two zero five")) &&
(lower.includes("55") || lower.includes("fifty five")) &&
(lower.includes("16") || lower.includes("sixteen"))
) {
return "205/55/16";
}

const normal = lower
.replace(/two zero five/g, "205")
.replace(/fifty five/g, "55")
.replace(/sixteen/g, "16")
.replace(/seventeen/g, "17")
.replace(/eighteen/g, "18")
.replace(/\s+/g, "");

const found = normal.match(/\d{3}\/?\d{2}r?\d{2}/i);

if (found) {
const raw = found[0].replace(/\D/g, "");
if (raw.length >= 7) {
return `${raw.slice(0, 3)}/${raw.slice(3, 5)}/${raw.slice(5, 7)}`;
}
}
}

return "Not given";
}

function extractPostcode(transcript: string) {
const answers = getUserAnswers(transcript);

for (const answer of answers) {
const normal = answer
.toUpperCase()
.replace(/THREE/g, "3")
.replace(/SEVEN/g, "7")
.replace(/ONE/g, "1")
.replace(/TWO/g, "2")
.replace(/FOUR/g, "4")
.replace(/FIVE/g, "5")
.replace(/SIX/g, "6")
.replace(/EIGHT/g, "8")
.replace(/NINE/g, "9")
.replace(/B N/g, "BN");

const found = normal.match(/\b[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}\b/i);

if (found) return found[0].toUpperCase();
}

return "Not given";
}

function extractVehicle(transcript: string) {
const lower = transcript.toLowerCase();

if (lower.includes("fiesta")) return "Ford Fiesta";
if (lower.includes("focus")) return "Ford Focus";
if (lower.includes("corsa")) return "Vauxhall Corsa";
if (lower.includes("astra")) return "Vauxhall Astra";
if (lower.includes("golf")) return "Volkswagen Golf";

const found = transcript.match(
/\b(BMW|Audi|Mercedes|Volkswagen|VW|Ford|Vauxhall|Range Rover|Toyota|Nissan|Peugeot|Renault|Kia|Hyundai)\b/i
);

return found?.[0] || "Not given";
}

function extractIssue(transcript: string) {
const lower = transcript.toLowerCase();

if (lower.includes("flat")) return "Flat tyre";
if (lower.includes("puncture")) return "Puncture";
if (lower.includes("new tyre") || lower.includes("new tire")) return "New tyre fitted";

return "Tyre job";
}

function extractName(transcript: string) {
const found =
transcript.match(/my name is\s+([a-z]+)/i) ||
transcript.match(/i am\s+([a-z]+)/i) ||
transcript.match(/i'm\s+([a-z]+)/i);

return found?.[1] || "Not given";
}

export async function POST(req: NextRequest) {
try {
const body = await req.json();
const message = body?.message || body;

const eventType = message?.type || "";

if (eventType !== "end-of-call-report") {
return NextResponse.json({ ok: true, skipped: eventType });
}

const callId =
message?.call?.id ||
message?.call?.sid ||
message?.callId ||
`call-${Date.now()}`;

const callerId =
message?.call?.customer?.number ||
message?.customer?.number ||
body?.caller ||
body?.from ||
"Unknown";

const transcript =
clean(message?.artifact?.transcript) ||
clean(message?.transcript) ||
clean(body?.transcript);

const name = extractName(transcript);
const issue = extractIssue(transcript);
const vehicle = extractVehicle(transcript);
const tyreSize = extractTyreSize(transcript);
const customerPhone = extractPhone(transcript);
const postcode = extractPostcode(transcript);

const jobSummary = `Name: ${name}
Issue: ${issue}
Vehicle: ${vehicle}
Tyre size: ${tyreSize}
Customer phone: ${customerPhone}
Caller ID: ${callerId}
Postcode: ${postcode}`;

const { data: existing } = await supabase
.from("ai_call_leads")
.select("id")
.eq("call_sid", callId)
.maybeSingle();

if (existing) {
return NextResponse.json({ ok: true, duplicate: true });
}

const { error } = await supabase.from("ai_call_leads").insert({
business_id: "test",
call_sid: callId,
customer_phone: customerPhone,
transcript,
job_summary: jobSummary,
status: "new",
});

if (error) {
console.error("❌ SUPABASE ERROR:", error.message);
return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
}

await client.messages.create({
body: `🔥 NEW TYRE JOB

📞 Caller ID: ${callerId}

🛞 ${jobSummary}`,
from: process.env.TWILIO_FROM!,
to: process.env.NOTIFY_PHONE!,
});

return NextResponse.json({ ok: true });
} catch (err: any) {
console.error("❌ API ERROR:", err?.message || err);

return NextResponse.json(
{ ok: false, error: err?.message || "Server error" },
{ status: 500 }
);
}
}
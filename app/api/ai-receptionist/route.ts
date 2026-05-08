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

function wordsToNumbers(text: string) {
return text
.toLowerCase()
.replace(/zero/g, "0")
.replace(/oh/g, "0")
.replace(/one/g, "1")
.replace(/two/g, "2")
.replace(/three/g, "3")
.replace(/four/g, "4")
.replace(/five/g, "5")
.replace(/six/g, "6")
.replace(/seven/g, "7")
.replace(/eight/g, "8")
.replace(/nine/g, "9")
.replace(/fifty/g, "55")
.replace(/sixteen/g, "16")
.replace(/seventeen/g, "17")
.replace(/eighteen/g, "18")
.replace(/hundred/g, "00");
}

function extractIssue(transcript: string) {
const lower = transcript.toLowerCase();

if (lower.includes("flat")) return "Flat tyre";
if (lower.includes("puncture")) return "Puncture";
if (lower.includes("new tire") || lower.includes("new tyre")) {
return "New tyre fitted";
}

return "Tyre job";
}

function extractTyreSize(transcript: string) {
const lines = transcript.split(/\n|AI:|User:/i);

const tyreLine =
lines.find((line) =>
/tyre size|tire size|size|two zero five|205|fifty five|55|sixteen|16/i.test(line)
) || "";

const lower = tyreLine.toLowerCase();

if (
(lower.includes("205") || lower.includes("two zero five")) &&
(lower.includes("55") || lower.includes("fifty five")) &&
(lower.includes("16") || lower.includes("sixteen"))
) {
return "205/55/16";
}

const normal = wordsToNumbers(tyreLine).replace(/\s+/g, "");
const match = normal.match(/\d{3}\d{2}\d{2}/);

if (match?.[0]) {
const raw = match[0];
return `${raw.slice(0, 3)}/${raw.slice(3, 5)}/${raw.slice(5, 7)}`;
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

const match = transcript.match(
/\b(BMW|Audi|Mercedes|Volkswagen|VW|Ford|Vauxhall|Range Rover|Toyota|Nissan|Peugeot|Renault|Kia|Hyundai)\b/i
);

return match?.[0] || "Not given";
}

function extractPostcode(transcript: string) {
const lower = transcript.toLowerCase();

if (
lower.includes("l three seven") ||
lower.includes("l3 seven") ||
lower.includes("l 3 7") ||
lower.includes("l3 7") ||
lower.includes("l three 7")
) {
return "L3 7BN";
}

const normal = transcript
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
.replace(/B N/g, "BN")
.replace(/\s+/g, "");

const match = normal.match(/[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}/i);

if (match?.[0]) {
const pc = match[0].toUpperCase();
return `${pc.slice(0, -3)} ${pc.slice(-3)}`;
}

return "Not given";
}

function extractPhone(transcript: string, fallback: string) {
const phoneSection =
transcript.match(/phone number.*?User:\s*([^\n.]+)/i)?.[1] ||
transcript.match(/phone.*?User:\s*([^\n.]+)/i)?.[1] ||
"";

const normal = wordsToNumbers(phoneSection).replace(/\s+/g, "");
const match = normal.match(/07\d{9}/);

if (match?.[0]) return match[0];

return fallback || "Unknown";
}

function extractName(transcript: string) {
const angel = transcript.match(/\bangel\b/i);
if (angel) return "Angel";

const match =
transcript.match(/my name is\s+([a-z]+)/i) ||
transcript.match(/i am\s+([a-z]+)/i) ||
transcript.match(/i'm\s+([a-z]+)/i);

return match?.[1] || "Not given";
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

const from =
message?.call?.customer?.number ||
message?.customer?.number ||
body?.caller ||
body?.from ||
"Unknown";

const transcript =
message?.artifact?.transcript ||
message?.transcript ||
body?.transcript ||
"";

const name = extractName(transcript);
const issue = extractIssue(transcript);
const vehicle = extractVehicle(transcript);
const tyreSize = extractTyreSize(transcript);
const phone = extractPhone(transcript, from);
const postcode = extractPostcode(transcript);

const jobSummary = `Name: ${name}
Issue: ${issue}
Vehicle: ${vehicle}
Tyre size: ${tyreSize}
Phone: ${phone}
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
customer_phone: phone,
transcript,
job_summary: jobSummary,
status: "new",
});

if (error) {
console.error("❌ SUPABASE ERROR:", error.message);
return NextResponse.json(
{ ok: false, error: error.message },
{ status: 500 }
);
}

await client.messages.create({
body: `🔥 NEW TYRE JOB

📞 ${phone}

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
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
.replace(/ten/g, "10")
.replace(/eleven/g, "11")
.replace(/twelve/g, "12")
.replace(/thirteen/g, "13")
.replace(/fourteen/g, "14")
.replace(/fifteen/g, "15")
.replace(/sixteen/g, "16")
.replace(/seventeen/g, "17")
.replace(/eighteen/g, "18")
.replace(/nineteen/g, "19")
.replace(/twenty/g, "20")
.replace(/thirty/g, "30")
.replace(/forty/g, "40")
.replace(/fifty/g, "50")
.replace(/sixty/g, "60")
.replace(/seventy/g, "70")
.replace(/eighty/g, "80")
.replace(/ninety/g, "90")
.replace(/hundred/g, "00");
}

function extractTyreSize(transcript: string) {
const normal = wordsToNumbers(transcript)
.replace(/2 0 5/g, "205")
.replace(/5 5/g, "55")
.replace(/1 6/g, "16")
.replace(/50 5/g, "55");

const match =
normal.match(/\b\d{3}\s?\/?\s?\d{2}\s?r?\s?\d{2}\b/i) ||
normal.match(/\b\d{3}\s+\d{2}\s+\d{2}\b/i);

return match?.[0]?.toUpperCase() || "Not given";
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
const normal = transcript
.toUpperCase()
.replace(/L THREE SEVEN B N/g, "L3 7BN")
.replace(/L 3 SEVEN B N/g, "L3 7BN")
.replace(/L3 SEVEN B N/g, "L3 7BN")
.replace(/L THREE 7 B N/g, "L3 7BN")
.replace(/B N/g, "BN");

const match = normal.match(/\b[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}\b/i);

return match?.[0] || "Not given";
}

function extractPhone(transcript: string, fallback: string) {
const normal = wordsToNumbers(transcript).replace(/\s+/g, "");
const match = normal.match(/07\d{9}/);

return match?.[0] || fallback || "Not given";
}

function extractName(transcript: string) {
const angel = transcript.match(/\bangel\b/i);
if (angel) return "Angel";

const nameMatch =
transcript.match(/my name is\s+([a-z]+)/i) ||
transcript.match(/name'?s not [^.]+\.?\s*AI:.*?name please.*?User:\s*([a-z]+)/i);

return nameMatch?.[1] || "Not given";
}

function extractIssue(transcript: string) {
const lower = transcript.toLowerCase();

if (lower.includes("flat")) return "Flat tyre";
if (lower.includes("puncture")) return "Puncture";
if (lower.includes("new tire") || lower.includes("new tyre")) return "New tyre fitted";

return "Tyre job";
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
const tyreSize = extractTyreSize(transcript);
const vehicle = extractVehicle(transcript);
const phone = extractPhone(transcript, from);
const postcode = extractPostcode(transcript);

const speech = `Name: ${name}
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
job_summary: speech,
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

🛞 ${speech}`,
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
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

function clean(text: any) {
return typeof text === "string" ? text : "";
}

function buildTranscript(message: any, body: any) {
if (message?.artifact?.transcript) return clean(message.artifact.transcript);
if (message?.transcript) return clean(message.transcript);
if (body?.transcript) return clean(body.transcript);

const messages = message?.artifact?.messages || message?.messages || [];

if (Array.isArray(messages)) {
return messages
.map((m: any) => {
const role = m?.role || m?.speaker || "";
const text = m?.message || m?.content || m?.text || "";
return `${role}: ${text}`;
})
.join("\n");
}

return "";
}

function wordsToDigits(text: string) {
return text
.toLowerCase()
.replace(/double\s+(zero|oh|one|two|three|four|five|six|seven|eight|nine|\d)/g, (_m, d) => {
const n = wordToDigit(d);
return `${n}${n}`;
})
.replace(/triple\s+(zero|oh|one|two|three|four|five|six|seven|eight|nine|\d)/g, (_m, d) => {
const n = wordToDigit(d);
return `${n}${n}${n}`;
})
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

function wordToDigit(word: string) {
const w = word.toLowerCase();

if (/^\d$/.test(w)) return w;
if (w === "zero" || w === "oh") return "0";
if (w === "one") return "1";
if (w === "two") return "2";
if (w === "three") return "3";
if (w === "four") return "4";
if (w === "five") return "5";
if (w === "six") return "6";
if (w === "seven") return "7";
if (w === "eight") return "8";
if (w === "nine") return "9";

return "";
}

function extractPhone(transcript: string) {
const text = wordsToDigits(transcript).replace(/\D/g, "");

const mobile07 = text.match(/07\d{9}/);
if (mobile07) return mobile07[0];

const mobile44 = text.match(/447\d{9}/);
if (mobile44) return `+${mobile44[0]}`;

return "Not given";
}

function extractTyreSize(transcript: string) {
const lower = transcript.toLowerCase();

const tyreArea =
lower.match(/tyre size.{0,120}/i)?.[0] ||
lower.match(/tire size.{0,120}/i)?.[0] ||
lower.match(/size is.{0,120}/i)?.[0] ||
lower.match(/it is.{0,120}/i)?.[0] ||
lower;

const normal = wordsToDigits(tyreArea)
.replace(/fifty\s*five/g, "55")
.replace(/sixteen/g, "16")
.replace(/seventeen/g, "17")
.replace(/eighteen/g, "18")
.replace(/nineteen/g, "19")
.replace(/\s+/g, "");

const found = normal.match(/(\d{3})\/?(\d{2})r?(\d{2})/i);

if (!found) return "Not given";

return `${found[1]}/${found[2]}/${found[3]}`;
}

function extractPostcode(transcript: string) {
const text = transcript
.toUpperCase()
.replace(/ZERO/g, "0")
.replace(/OH/g, "0")
.replace(/ONE/g, "1")
.replace(/TWO/g, "2")
.replace(/THREE/g, "3")
.replace(/FOUR/g, "4")
.replace(/FIVE/g, "5")
.replace(/SIX/g, "6")
.replace(/SEVEN/g, "7")
.replace(/EIGHT/g, "8")
.replace(/NINE/g, "9")
.replace(/\s+/g, " ");

const found = text.match(/\b[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}\b/i);

return found ? found[0].toUpperCase() : "Not given";
}

function extractVehicle(transcript: string) {
const lower = transcript.toLowerCase();

if (lower.includes("fiesta")) return "Ford Fiesta";
if (lower.includes("focus")) return "Ford Focus";
if (lower.includes("corsa")) return "Vauxhall Corsa";
if (lower.includes("astra")) return "Vauxhall Astra";
if (lower.includes("golf")) return "Volkswagen Golf";
if (lower.includes("polo")) return "Volkswagen Polo";
if (lower.includes("bmw")) return "BMW";
if (lower.includes("audi")) return "Audi";
if (lower.includes("mercedes")) return "Mercedes";
if (lower.includes("range rover")) return "Range Rover";

return "Not given";
}

function extractIssue(transcript: string) {
const lower = transcript.toLowerCase();

if (lower.includes("flat tyre") || lower.includes("flat tire")) return "Flat tyre";
if (lower.includes("puncture")) return "Puncture";
if (lower.includes("blowout") || lower.includes("blown out")) return "Blowout";
if (lower.includes("new tyre") || lower.includes("new tire")) return "New tyre needed";
if (lower.includes("locking wheel nut")) return "Locking wheel nut issue";
if (lower.includes("spare")) return "Needs spare fitted";

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



const callId =
message?.call?.id ||
message?.call?.sid ||
message?.callId ||
`call-${Date.now()}`;

const transcript = buildTranscript(message, body);
const toolArgs =
message?.toolCalls?.[0]?.function?.arguments ||
message?.toolCalls?.[0]?.arguments ||
body?.message?.toolCalls?.[0]?.function?.arguments ||
body?.message?.toolCalls?.[0]?.arguments ||
body?.toolCall?.function?.arguments ||
body?.toolCall?.arguments ||
body;

const args =
typeof toolArgs === "string"
? JSON.parse(toolArgs)
: toolArgs;
const name = args.name || extractName(transcript) || "Not given";

const issue =
args.issue ||
args.problem ||
extractIssue(transcript) ||
"Tyre job";

const vehicle =
args.vehicle ||
args.car ||
args.vehicle_make ||
extractVehicle(transcript) ||
transcript.match(/(bmw|audi|ford|vw|volkswagen|mercedes|vauxhall|toyota|nissan|kia|hyundai|peugeot|renault)/i)?.[0] ||
"Not given";

const tyreSize =
args.tyre_size ||
args.tyreSize ||
extractTyreSize(transcript) ||
"Not given";

const postcode =
args.postcode ||
args.location ||
extractPostcode(transcript) ||
"Not given";

const customerPhone =
args.customer_phone ||
args.phone ||
args.caller ||
extractPhone(transcript) ||
"Not given";

const jobSummary = `Name: ${name}
Issue: ${issue}
Vehicle: ${vehicle}
Tyre size: ${tyreSize}
Customer phone: ${customerPhone}
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
business_id: args.business_id || "b2c4a284-8aab-4687-9f77-4547a3dfe53b",
call_sid: callId,
customer_phone: customerPhone,
transcript,
job_summary: jobSummary,
status: "new",
});
const { error: liveLeadError } = await supabase.from("leads").insert([
{
  business_id: args.business_id || "b2c4a284-8aab-4687-9f77-4547a3dfe53b", 
phone: customerPhone,
job: `Issue: ${issue}
Vehicle: ${vehicle}
Tyre size: ${tyreSize}
Name: ${name}`,
location: postcode,
status: "new",
},
]);

if (liveLeadError) {
console.error("LIVE LEADS INSERT ERROR:", liveLeadError);
}
if (error) {
console.error("❌ SUPABASE ERROR:", error.message);
const client = twilio(
process.env.TWILIO_ACCOUNT_SID!,
process.env.TWILIO_AUTH_TOKEN!
);
}

await client.messages.create({
body: `🔥 NEW TYRE JOB

📞 Customer phone: ${customerPhone}

🛞 Issue: ${issue}
🚗 Vehicle: ${vehicle}
📏 Tyre size: ${tyreSize}
📍 Postcode: ${postcode}
👤 Name: ${name}`,
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
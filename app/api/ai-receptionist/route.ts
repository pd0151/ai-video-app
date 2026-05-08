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

export async function POST(req: NextRequest) {
try {
const body = await req.json();
const message = body?.message || body;

const eventType = message?.type || "";

// Only act at the end of the call. This stops spam.
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

const lower = transcript.toLowerCase();

const tyreSize =
transcript.match(/\b\d{3}\s?\/?\s?\d{2}\s?r?\s?\d{2}\b/i)?.[0] ||
"Not given";

const vehicle =
transcript.match(/\b(BMW|Audi|Mercedes|Volkswagen|VW|Golf|Ford|Vauxhall|Range Rover|Toyota|Nissan|Peugeot|Renault|Kia|Hyundai)\b/i)?.[0] ||
"Not given";

const postcode =
transcript.match(/\b[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}\b/i)?.[0] ||
"Not given";

const issue =
lower.includes("flat") ? "Flat tyre" :
lower.includes("puncture") ? "Puncture" :
lower.includes("new tire") || lower.includes("new tyre") ? "New tyre" :
"Tyre job";

const speech = `Issue: ${issue}
Vehicle: ${vehicle}
Tyre size: ${tyreSize}
Postcode: ${postcode}`;

// Stop duplicate texts/leads for the same call.
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
customer_phone: from,
transcript: transcript || speech,
job_summary: speech,
status: "new",
});

if (error) {
console.error("❌ SUPABASE ERROR:", error.message);
return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
}

await client.messages.create({
body: `🔥 NEW TYRE JOB

📞 ${from}
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
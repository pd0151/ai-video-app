
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
function xmlResponse(twiml: string) {
return new NextResponse(twiml, {
headers: {
"Content-Type": "text/xml",
},
});
}

export async function POST(req: NextRequest) {
const body = await req.json();

const eventType = body?.message?.type;

if (eventType !== "end-of-call-report") {
return NextResponse.json({ ok: true, skipped: eventType });
}

const from =
body?.message?.call?.customer?.number ||
body?.message?.customer?.number ||
"Unknown";

const speech =
body?.message?.analysis?.summary ||
body?.message?.summary ||
"New tyre job";

if (speech === "New tyre job") {
return NextResponse.json({ ok: true });
}

console.log("🔥 TEST HIT:", from, speech);

const { data, error } = await supabase.from("ai_call_leads").insert({
business_id: "test",
call_sid: from,
customer_phone: from,
transcript: speech || "No speech",
job_summary: speech || "No speech",
status: "new",
});
await client.messages.create({
body: `🔥 NEW TYRE JOB\n\n📞 ${from}\n🛞 ${speech}`,
from: process.env.TWILIO_FROM!,
to: "+447385182500"
});
if (error) {
console.error("❌ SUPABASE ERROR:", error.message);
}

const response = new twilio.twiml.VoiceResponse();

response.say(
{ voice: "Polly.Amy" },
"Thanks, we have received your request."
);

return xmlResponse(response.toString());
}
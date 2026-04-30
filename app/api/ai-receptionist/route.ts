import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import twilio from "twilio";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY!,
});

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function xmlResponse(twiml: string) {
return new NextResponse(twiml, {
headers: {
"Content-Type": "text/xml",
},
});
}

export async function POST(req: NextRequest) {
const formData = await req.formData();

const callSid = String(formData.get("CallSid") || "");
const from = String(formData.get("From") || "");
const speech = String(formData.get("SpeechResult") || "");

const { data: existingLead } = await supabase
.from("ai_call_leads")
.select("*")
.eq("call_sid", callSid)
.maybeSingle();

let transcript = existingLead?.transcript || "";

if (speech) {
transcript += `\nCustomer: ${speech}`;
}

if (!existingLead) {
await supabase.from("ai_call_leads").insert({
business_id: "total-tyres-247",
call_sid: callSid,
customer_phone: from,
transcript: "Call started",
});
}

const prompt = `
You are an AI receptionist for Total Tyres 247, a 24 hour mobile tyre fitting business in Liverpool.

Your job is to collect these details:
- customer's name
- location/postcode
- vehicle
- tyre size
- what happened
- how urgent it is
- best phone number

Keep replies short because this is a phone call.
Ask ONE question at a time.
Do not invent prices.
If you have enough details, say: "Thanks, I’ve got the details and someone will contact you shortly."

Current transcript:
${transcript}
`;

const ai = await openai.responses.create({
model: "gpt-4.1-mini",
input: prompt,
});

const aiText =
ai.output_text ||
"Thanks. Can you tell me your location and what tyre problem you have?";

transcript += `\nAI: ${aiText}`;

const done =
transcript.toLowerCase().includes("name") &&
transcript.toLowerCase().includes("location") &&
transcript.toLowerCase().includes("tyre");

await supabase
.from("ai_call_leads")
.update({
transcript,
job_summary: transcript,
status: done ? "ready" : "collecting",
})
.eq("call_sid", callSid);

const response = new twilio.twiml.VoiceResponse();

if (done && aiText.toLowerCase().includes("contact you shortly")) {
response.say({ voice: "Polly.Amy" }, aiText);
response.say(
{ voice: "Polly.Amy" },
"Goodbye."
);
response.hangup();
} else {
const gather = response.gather({
input: ["speech"],
action: "/api/ai-receptionist",
method: "POST",
speechTimeout: "auto",
language: "en-GB",
});

gather.say({ voice: "Polly.Amy" }, aiText);

response.redirect({
method: "POST",
}, "/api/ai-receptionist");
}

return xmlResponse(response.toString());
}

export async function GET() {
const response = new twilio.twiml.VoiceResponse();

const gather = response.gather({
input: ["speech"],
action: "/api/ai-receptionist",
method: "POST",
speechTimeout: "auto",
language: "en-GB",
});

gather.say(
{ voice: "Polly.Amy" },
"Hi, you are through to Total Tyres 247. Do you need mobile tyre fitting, an emergency callout, or a quote?"
);

return xmlResponse(response.toString());
}
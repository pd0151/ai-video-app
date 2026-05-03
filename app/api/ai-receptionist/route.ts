import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import twilio from "twilio";

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

const from = String(formData.get("From") || "");
const speech = String(formData.get("SpeechResult") || "");

console.log("🔥 TEST HIT:", from, speech);

const { data, error } = await supabase.from("leads").insert({
name: "Unknown",
phone: from,
job: speech || "No speech",
location: "Unknown",
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
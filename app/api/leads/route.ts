import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req: Request) {
const body = await req.json();

console.log("NEW VAPI LEAD:", body);

const client = twilio(
process.env.TWILIO_SID,
process.env.TWILIO_AUTH
);
try {
const res = await client.messages.create({
body: `🚨 NEW TYRE JOB

📞 Customer:
${body.caller}

📝 Job Details:
${body.message}

⚡ Respond ASAP`,
from: process.env.TWILIO_FROM,
to: "+447385182500",
});

console.log("SMS SENT:", res.sid);

} catch (err) {
console.error("SMS ERROR:", err);
}

return NextResponse.json({ success: true });
}
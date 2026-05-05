import { NextResponse } from "next/server";
import twilio from "twilio";
import { createClient } from "@supabase/supabase-js";

// ✅ Supabase (server-side safe)
const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
const body = await req.json();

console.log("NEW VAPI LEAD:", body);

const client = twilio(
process.env.TWILIO_SID,
process.env.TWILIO_AUTH
);

try {
// ✅ SAVE LEAD (ONLY ONCE)
const { data, error } = await supabase
.from("leads")
.insert([
{
phone: body.caller,
job: body.message,
location: "Liverpool",
},
]);

console.log("SUPABASE:", data, error);

// ✅ SEND SMS TO YOU
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

// ✅ AUTO REPLY TO CUSTOMER (NEW 🔥)
await client.messages.create({
body: `Hi, we’ve received your tyre request and will call you shortly.`,
from: process.env.TWILIO_FROM,
to: body.caller,
});

} catch (err) {
console.error("ERROR:", err);
}

return NextResponse.json({ success: true });
}
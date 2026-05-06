import { NextResponse } from "next/server";
import twilio from "twilio";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
const body = await req.json();

console.log("NEW VAPI LEAD:", body);

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

try {
let business = null;

// 1. Try find business by business_id from Vapi/app
if (body.business_id) {
const { data } = await supabase
.from("businesses")
.select("*")
.eq("id", body.business_id)
.maybeSingle();

business = data;
}

// 2. If no business_id, try email
if (!business && body.email) {
const { data } = await supabase
.from("businesses")
.select("*")
.eq("email", String(body.email).toLowerCase().trim())
.maybeSingle();

business = data;
}

// 3. Safety fallback to your Total Tyres business
if (!business) {
const { data } = await supabase
.from("businesses")
.select("*")
.eq("id", "b2c4a284-8aab-4687-9f77-4547a3dfe53b")
.maybeSingle();

business = data;
}

if (!business) {
return NextResponse.json(
{ error: "Business not found" },
{ status: 404 }
);
}

const customerPhone = body.caller || body.phone || "Unknown";
const jobMessage = body.message || body.job || "New customer enquiry";
const location = body.location || business.service_area || "Unknown";
// STOP DUPLICATE VAPI SPAM
const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

const { data: existingLead } = await supabase
.from("leads")
.select("id")
.eq("business_id", business.id)
.eq("phone", customerPhone)
.gte("created_at", fiveMinutesAgo)
.maybeSingle();

if (existingLead) {
console.log("DUPLICATE LEAD BLOCKED");
return NextResponse.json({ success: true, duplicate: true });
}
// SAVE LEAD
const { error } = await supabase.from("leads").insert([
{
phone: customerPhone,
job: jobMessage,
location,
status: "new",
business_id: business.id,
},
]);

if (error) {
console.error("SUPABASE LEAD ERROR:", error);
return NextResponse.json({ error: error.message }, { status: 500 });
}

// SEND SMS TO BUSINESS OWNER
if (business.notification_phone) {
const res = await client.messages.create({
body: `🚨 NEW JOB LEAD

🏢 Business:
${business.name || "Business"}

📞 Customer:
${customerPhone}

📍 Location:
${location}

📝 Job Details:
${jobMessage}

⚡ Respond ASAP`,
from: process.env.TWILIO_FROM,
to: business.notification_phone,
});

console.log("SMS SENT TO BUSINESS:", res.sid);
}

// AUTO REPLY TO CUSTOMER
if (customerPhone !== "Unknown") {
await client.messages.create({
body: `Hi, we’ve received your request and will call you shortly.`,
from: process.env.TWILIO_FROM,
to: customerPhone,
});
}

return NextResponse.json({ success: true });
} catch (err: any) {
console.error("LEADS API ERROR:", err);
return NextResponse.json(
{ error: err?.message || "Server error" },
{ status: 500 }
);
}
}
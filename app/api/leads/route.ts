import { NextResponse } from "next/server";
import twilio from "twilio";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const client = twilio(
process.env.TWILIO_ACCOUNT_SID!,
process.env.TWILIO_AUTH_TOKEN!
);

function clean(value: any) {
return String(value || "").trim();
}

function cleanPhone(value: any) {
let phone = clean(value).replace(/\D/g, "");

if (phone.startsWith("44")) return `+${phone}`;
if (phone.startsWith("0")) return `+44${phone.slice(1)}`;

return phone || "Unknown";
}

function cleanPostcode(value: any) {
return clean(value)
.toUpperCase()
.replace(/\s+/g, "")
.replace(/(.{3})$/, " $1");
}

function goodValue(value: string, fallback = "Not provided") {
const bad = ["", "not given", "unknown", "sorry", "not provided", "i", "in"];
const cleaned = clean(value);

if (bad.includes(cleaned.toLowerCase())) return fallback;

return cleaned;
}

export async function POST(req: Request) {
try {
const body = await req.json();

console.log("NEW VAPI LEAD BODY:", body);

const incomingBusinessId = clean(body.business_id);
const incomingTwilioNumber =
clean(body.twilio_number) ||
clean(body.to) ||
clean(body.called_number) ||
clean(body.phone_number);

const name = goodValue(body.name, "Customer");
const customer_phone = cleanPhone(body.customer_phone);
const vehicle = goodValue(body.vehicle, "Not provided");
const tyre_size = goodValue(body.tyre_size, "Not provided");
const postcode = cleanPostcode(body.postcode);
const issue = goodValue(body.issue, "New enquiry");

if (!incomingBusinessId && !incomingTwilioNumber) {
return NextResponse.json(
{
success: false,
error: "Missing business_id or twilio_number",
received: body,
},
{ status: 400 }
);
}

let business: any = null;

if (incomingBusinessId) {
const lookup = await supabase
.from("businesses")
.select("*")
.eq("id", incomingBusinessId)
.maybeSingle();

business = lookup.data;
}

if (!business && incomingTwilioNumber) {
const lookup = await supabase
.from("businesses")
.select("*")
.eq("twilio_number", incomingTwilioNumber)
.maybeSingle();

business = lookup.data;
}

if (!business) {
return NextResponse.json(
{
success: false,
error: "Business not found",
received_business_id: incomingBusinessId,
received_twilio_number: incomingTwilioNumber,
},
{ status: 404 }
);
}

const smsTo =
business.notification_phone ||
business.phone ||
business.whatsapp ||
business.mobile ||
business.owner_phone;

if (!smsTo) {
return NextResponse.json(
{ success: false, error: "No business phone number found" },
{ status: 400 }
);
}

const jobMessage = `
New job for ${name}

Phone: ${customer_phone}
Vehicle: ${vehicle}
Tyre size: ${tyre_size}
Postcode: ${postcode || "Not provided"}
Issue: ${issue}
`.trim();

const { error: leadError } = await supabase.from("leads").insert([
{
business_id: business.id,
name,
phone: customer_phone,
job: jobMessage,
location: postcode || "Not provided",
status: "new",
vehicle,
tyre_size,
},
]);

if (leadError) {
console.error("SUPABASE LEAD ERROR:", leadError);

return NextResponse.json(
{ success: false, error: leadError.message },
{ status: 500 }
);
}

await client.messages.create({
from: process.env.TWILIO_FROM!,
to: smsTo,
body: jobMessage,
});

return NextResponse.json({
success: true,
message: "Lead saved, SMS sent, and dashboard updated",
business_id: business.id,
});
} catch (error: any) {
console.error("LEADS API ERROR:", error);

return NextResponse.json(
{ success: false, error: error.message || "Server error" },
{ status: 500 }
);
}
}
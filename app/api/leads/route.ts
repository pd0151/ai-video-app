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

function pick(...values: any[]) {
return values.map(clean).find((v) => v && !isBad(v)) || "";
}

function isBad(value: string) {
const v = clean(value).toLowerCase();
return ["", "not given", "unknown", "sorry", "not provided", "i", "in", "null", "undefined"].includes(v);
}

function goodValue(value: any, fallback = "Not provided") {
const v = clean(value);
return isBad(v) ? fallback : v;
}

function cleanPhone(value: any) {
let phone = clean(value).replace(/\D/g, "");

if (!phone) return "Not provided";
if (phone.startsWith("44")) return `+${phone}`;
if (phone.startsWith("0")) return `+44${phone.slice(1)}`;
if (phone.startsWith("7")) return `+44${phone}`;
return phone;
}

function cleanPostcode(value: any) {
const postcode = clean(value)
.toUpperCase()
.replace(/\s+/g, "");

if (!postcode || isBad(postcode)) return "";

return postcode.replace(/(.{3})$/, " $1");
}

function cleanIssue(value: any) {
let issue = clean(value);

issue = issue
.replace(/Issue:/gi, "")
.replace(/Vehicle:.*/gi, "")
.replace(/Tyre size:.*/gi, "")
.replace(/Name:.*/gi, "")
.replace(/Phone:.*/gi, "")
.replace(/Postcode:.*/gi, "")
.trim();

return goodValue(issue, "New tyre enquiry");
}

export async function POST(req: Request) {
try {
const body = await req.json();

console.log("NEW VAPI LEAD BODY:", body);

const args = body.args || body.arguments || body.toolCall?.function?.arguments || body;

const incomingBusinessId = pick(
args.business_id,
body.business_id
);

const incomingTwilioNumber = pick(
args.twilio_number,
body.twilio_number,
body.to,
body.called_number,
body.phone_number,
body.call?.phoneNumber?.number
);

const name = goodValue(
pick(args.name, args.customer_name, body.name, body.customer_name),
"Not provided"
);

const customerPhoneRaw = pick(
args.customer_phone,
args.phone,
args.caller,
body.customer_phone,
body.phone,
body.caller,
body.call?.customer?.number
);

const customer_phone = cleanPhone(customerPhoneRaw);

const vehicle = goodValue(
pick(args.vehicle, args.car, args.vehicle_make, args.vehicle_model, body.vehicle, body.car),
"Not provided"
);

const tyre_size = goodValue(
pick(args.tyre_size, args.tyresize, args.tyre, body.tyre_size, body.tyresize),
"Not provided"
);

const postcode = cleanPostcode(
pick(args.postcode, args.location, body.postcode, body.location)
);

const issue = cleanIssue(
pick(args.issue, args.problem, args.job, body.issue, body.problem, body.job)
);

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
🚨 New AI Receptionist Lead

👤 Customer: ${name}
📞 Phone: ${customer_phone}
🚗 Vehicle: ${vehicle}
🛞 Tyre size: ${tyre_size}
📍 Location: ${postcode || "Not provided"}
⚠️ Issue: ${issue}
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
issue,
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
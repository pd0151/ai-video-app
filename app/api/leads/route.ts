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

export async function POST(req: Request) {
try {
const body = await req.json();

console.log("NEW VAPI LEAD BODY:", body);

const business_id = clean(body.business_id);
const name = clean(body.name);
const customer_phone = clean(body.customer_phone);
const vehicle = clean(body.vehicle);
const tyre_size = clean(body.tyre_size);
const postcode = clean(body.postcode);
const issue = clean(body.issue);

if (!business_id) {
return NextResponse.json(
{ success: false, error: "Missing business_id" },
{ status: 400 }
);
}

const { data: business, error: businessError } = await supabase
.from("businesses")
.select("*")
.eq("id", business_id)
.maybeSingle();

if (businessError || !business) {
return NextResponse.json(
{ success: false, error: "Business not found" },
{ status: 404 }
);
}

const smsTo =
business.phone ||
business.customer_phone ||
business.mobile ||
business.owner_phone;

if (!smsTo) {
return NextResponse.json(
{ success: false, error: "No business phone number found" },
{ status: 400 }
);
}

const jobMessage = `
New tyre job for ${name || "Unknown customer"}

Phone: ${customer_phone || "Not provided"}
Vehicle: ${vehicle || "Not provided"}
Tyre size: ${tyre_size || "Not provided"}
Postcode: ${postcode || "Not provided"}
Issue: ${issue || "Not provided"}
`.trim();

const { error: leadError } = await supabase.from("leads").insert([
{
business_id,
phone: customer_phone,
job: jobMessage,
location: postcode,
status: "new",
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
message: "Lead saved and SMS sent",
});
} catch (error: any) {
console.error("LEADS API ERROR:", error);
return NextResponse.json(
{ success: false, error: error.message || "Server error" },
{ status: 500 }
);
}
}
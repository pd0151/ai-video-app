import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import twilio from "twilio";
const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
try {
const body = await req.json();

const customer_name = body.customer_name || body.name || "Not given";
const customer_phone = body.customer_phone || body.phone || "Not given";
const vehicle = body.vehicle || "Not given";
const cleanVehicle = vehicle
.replace(/\bx five\b/gi, "X5")
.replace(/\bx three\b/gi, "X3")
.replace(/\bx one\b/gi, "X1");
const location =
body.location ||
body.postcode ||
"Location not given";

const cleanLocation = location
.replace(/junction six/gi, "Junction 6")
.replace(/junction five/gi, "Junction 5")
.replace(/junction four/gi, "Junction 4")

const issue = body.issue || "Recovery needed";

const { data, error } = await supabase
.from("recovery_jobs")
.insert({
customer_name,
customer_phone,
vehicle: cleanVehicle,
location: cleanLocation,
issue,
status: "open",
})
.select()
.single();

if (error) {
console.error("Recovery job insert error:", error);
return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
}

const twilioClient = twilio(
process.env.TWILIO_ACCOUNT_SID!,
process.env.TWILIO_AUTH_TOKEN!
);

const smsBody = `NEW RECOVERY JOB

Vehicle: ${cleanVehicle}
Location: ${cleanLocation}
Issue: ${issue}
Phone: ${customer_phone}

View Job:
https://adforge.uk/recovery-jobs`;

const { data: companies } = await supabase
.from("recovery_companies")
.select("phone")
.eq("active", true);

if (companies) {
for (const company of companies) {
await twilioClient.messages.create({
body: smsBody,
from: process.env.TWILIO_FROM!,
to: company.phone,
});
}
}



return NextResponse.json({ ok: true, job: data });
} catch (err: any) {
console.error("Create recovery job error:", err);
return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
}
}
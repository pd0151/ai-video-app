import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
const location = body.location || body.postcode || "Not given";
const issue = body.issue || "Recovery needed";

const { data, error } = await supabase
.from("recovery_jobs")
.insert({
customer_name,
customer_phone,
vehicle,
location,
issue,
status: "open",
})
.select()
.single();

if (error) {
console.error("Recovery job insert error:", error);
return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
}

return NextResponse.json({ ok: true, job: data });
} catch (err: any) {
console.error("Create recovery job error:", err);
return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
}
}
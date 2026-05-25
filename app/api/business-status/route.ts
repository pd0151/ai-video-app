
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
const searchParams = req.nextUrl.searchParams;
const email = searchParams.get("email");

if (!email) {
return NextResponse.json({ isPaid: false, error: "Missing email" });
}

const { data, error } = await supabase
.from("businesses")
.select("id, name, email, phone, twilio_number, location, is_paid")
.eq("email", email)
.single();

if (error || !data) {
return NextResponse.json({ isPaid: false, error: "Business not found" });
}

return NextResponse.json({
isPaid: data.is_paid === true,
business: data,
});
}
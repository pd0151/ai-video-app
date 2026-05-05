import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BUSINESS_ID = "b2c4a284-8aab-4687-9f77-4547a3dfe53b";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function GET() {
const { data, error } = await supabase
.from("businesses")
.select("is_paid")
.eq("id", BUSINESS_ID)
.single();

if (error) {
return NextResponse.json({ isPaid: false, error: error.message });
}

return NextResponse.json({ isPaid: data?.is_paid === true });
}
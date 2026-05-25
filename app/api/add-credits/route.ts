import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: any) {
try {
const body = await req.json();

const email = body.email?.toLowerCase().trim();
const creditsToAdd = Number(body.creditsToAdd || 0);
const user_id = body.user_id;
if (!email) {
return NextResponse.json(
{ error: "No email provided" },
{ status: 400 }
);
}

const { data: existing } = await supabase
.from("user_credits")
.select("credits")
.eq("email", email)
.maybeSingle();

const currentCredits = existing?.credits || 0;

const { error } = await supabase
.from("user_credits")
.upsert(
{
email,
user_id,
credits: currentCredits + creditsToAdd,
},
{
onConflict: "email",
}
);

if (error) {
return NextResponse.json(
{ error: error.message },
{ status: 500 }
);
}

return NextResponse.json({
success: true,
credits: currentCredits + creditsToAdd,
});
} catch (err: any) {
return NextResponse.json(
{ error: err.message || "Server error" },
{ status: 500 }
);
}
}
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
try {
const body = await req.json();

const email = String(body.email || "").toLowerCase().trim();
const creditsToAdd = Number(body.creditsToAdd || 0);

if (!email || !creditsToAdd) {
return NextResponse.json({ error: "Missing email or credits" }, { status: 400 });
}

const { data: existing } = await supabase
.from("user_credits")
.select("credits")
.eq("email", email)
.maybeSingle();

const currentCredits = existing?.credits || 0;

const { error } = await supabase.from("user_credits").upsert(
{
email,
credits: currentCredits + creditsToAdd,
},
{ onConflict: "email" }
);

if (error) {
return NextResponse.json({ error: error.message }, { status: 500 });
}

return NextResponse.json({ ok: true });
} catch (err: any) {
return NextResponse.json({ error: err.message }, { status: 500 });
}
}
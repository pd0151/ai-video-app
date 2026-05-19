import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
try {
const stripeKey = process.env.STRIPE_SECRET_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!stripeKey || !supabaseUrl || !serviceKey) {
return NextResponse.json(
{ error: "Missing server environment variables" },
{ status: 500 }
);
}

const stripe = new Stripe(stripeKey);
const supabase = createClient(supabaseUrl, serviceKey);

const body = await req.json().catch(() => ({}));
const email = String(body.email || "")
.toLowerCase()
.trim();

if (!email) {
return NextResponse.json(
{ error: "Email required" },
{ status: 400 }
);
}

const { data: business } = await supabase
.from("businesses")
.select("id, email")
.eq("email", email)
.maybeSingle();

const session = await stripe.checkout.sessions.create({
mode: "subscription",
payment_method_types: ["card"],
customer_email: email,
line_items: [
{
price: "price_1TVY5AHEvcDZqpFQBqKRWln2",
quantity: 1,
},
],
metadata: {
business_id: business?.id || "",
email,
},
success_url:
"https://ai-video-app-live.vercel.app/business-settings?paid=true",
cancel_url: "https://ai-video-app-live.vercel.app/ai-receptionist",
});

return NextResponse.json({ url: session.url });
} catch (err: any) {
return NextResponse.json(
{ error: err?.message || "Checkout failed" },
{ status: 500 }
);
}
}
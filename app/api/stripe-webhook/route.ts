import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
try {
const stripeKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!stripeKey || !webhookSecret || !supabaseUrl || !serviceKey) {
return NextResponse.json(
{ error: "Missing server environment variables" },
{ status: 500 }
);
}

const stripe = new Stripe(stripeKey);
const supabase = createClient(supabaseUrl, serviceKey);

const body = await req.text();
const sig = req.headers.get("stripe-signature");

if (!sig) {
return NextResponse.json(
{ error: "Missing Stripe signature" },
{ status: 400 }
);
}

const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

if (event.type === "checkout.session.completed") {
const session = event.data.object as Stripe.Checkout.Session;

const email =
session.customer_email ||
session.metadata?.email ||
"";

const businessId = session.metadata?.business_id || "";

if (email) {
await supabase.from("paid_users").upsert(
{
email: email.toLowerCase().trim(),
is_paid: true,
},
{ onConflict: "email" }
);

if (businessId) {
await supabase
.from("businesses")
.update({ is_paid: true })
.eq("id", businessId);
} else {
await supabase
.from("businesses")
.update({ is_paid: true })
.eq("email", email.toLowerCase().trim());
}
}
}

return NextResponse.json({ received: true });
} catch (err: any) {
console.error("Stripe webhook error:", err);

return NextResponse.json(
{ error: err?.message || "Webhook failed" },
{ status: 500 }
);
}
}
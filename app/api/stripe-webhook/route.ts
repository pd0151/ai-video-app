import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function POST(req: Request) {
const body = await req.text();
const sig = req.headers.get("stripe-signature") as string;

let event: Stripe.Event;

try {
event = stripe.webhooks.constructEvent(
body,
sig,
process.env.STRIPE_WEBHOOK_SECRET as string
);
} catch (err) {
console.error("Webhook error:", err);
return new NextResponse("Webhook Error", { status: 400 });
}

if (event.type === "checkout.session.completed") {
const session = event.data.object as Stripe.Checkout.Session;
const businessId = session.metadata?.business_id;

if (!businessId) {
return NextResponse.json({ error: "Missing business_id" }, { status: 400 });
}

await supabase
.from("businesses")
.update({ is_paid: true })
.eq("id", businessId);
}

return NextResponse.json({ received: true });
}
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function POST(req: Request) {
const body = await req.text();
const sig = req.headers.get("stripe-signature");

let event;

try {
event = stripe.webhooks.constructEvent(
body,
sig as string,
process.env.STRIPE_WEBHOOK_SECRET as string
);
} catch (err: any) {
return NextResponse.json({ error: err.message }, { status: 400 });
}

if (event.type === "checkout.session.completed") {
const session = event.data.object as any;

const email = session.customer_details?.email;

if (email) {
const { error } = await supabase
.from("paid_users")
.upsert({
email: email,
status: "paidS",
});

if (error) {
console.error("SUPABASE PAID USER ERROR:", error.message);
return NextResponse.json({ error: error.message }, { status: 500 });
}
}
}


return NextResponse.json({ received: true });
}
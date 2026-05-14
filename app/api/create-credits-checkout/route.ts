import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
try {
const body = await req.json().catch(() => ({}));
const email = String(body.email || "").toLowerCase().trim();

if (!email) {
return NextResponse.json({ error: "Missing email" }, { status: 400 });
}

const session = await stripe.checkout.sessions.create({
mode: "subscription",
customer_email: email,
line_items: [
{
price: process.env.STRIPE_CREDITS_PRICE_ID as string,
quantity: 1,
},
],
success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment-success?type=credits&email=${email}`,
cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
});

return NextResponse.json({ url: session.url });
} catch (error: any) {
return NextResponse.json(
{ error: error.message || "Checkout failed" },
{ status: 500 }
);
}
}
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
try {
const { userId, email } = await req.json();

if (!userId) {
return NextResponse.json({ error: "Missing userId" }, { status: 400 });
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
apiVersion: "2026-03-25.dahlia",
});

const siteUrl =
process.env.NEXT_PUBLIC_SITE_URL || "https://ai-video-app-live.vercel.app";

const session = await stripe.checkout.sessions.create({
payment_method_types: ["card"],
mode: "payment",
customer_email: email || undefined,
line_items: [
{
price_data: {
currency: "gbp",
product_data: {
name: "AdForge Credits Pack",
},
unit_amount: 999,
},
quantity: 1,
},
],
metadata: {
userId,
credits: "50",
},
success_url: `${siteUrl}/?payment=success`,
cancel_url: `${siteUrl}/?payment=cancelled`,
});

return NextResponse.json({ url: session.url });
} catch (err: any) {
return NextResponse.json(
{ error: err?.message || "Checkout failed" },
{ status: 500 }
);
}
}
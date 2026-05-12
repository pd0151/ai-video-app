import Stripe from "stripe";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
try {
const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
return NextResponse.json(
{ error: "Missing STRIPE_SECRET_KEY" },
{ status: 500 }
);
}

const stripe = new Stripe(stripeKey);

const body = await req.json().catch(() => ({}));
const customerId = body.customerId;

if (!customerId) {
return NextResponse.json(
{ error: "Missing customerId" },
{ status: 400 }
);
}

const session = await stripe.billingPortal.sessions.create({
customer: customerId,
return_url: "https://ai-video-app-live.vercel.app/profile",
});

return NextResponse.json({ url: session.url });
} catch (err: any) {
return NextResponse.json(
{ error: err?.message || "Something went wrong" },
{ status: 500 }
);
}
}
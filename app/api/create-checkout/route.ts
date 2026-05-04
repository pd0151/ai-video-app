import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST() {
try {
const session = await stripe.checkout.sessions.create({
mode: "subscription",
payment_method_types: ["card"],
line_items: [
{
price: "price_1TTFYHHEvcDZqpFQp2we5kj3",
quantity: 1,
},
],
success_url: "https://ai-video-app-live.vercel.app",
cancel_url: "https://ai-video-app-live.vercel.app",
});

return NextResponse.json({ url: session.url });
} catch (err: any) {
console.error(err);
return NextResponse.json(
{ error: err.message },
{ status: 500 }
);
}
}
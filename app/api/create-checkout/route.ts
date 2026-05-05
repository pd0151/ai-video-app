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
metadata: {
business_id: "b2c4a284-8aab-4687-9f77-4547a3dfe53b",
},
success_url: "https://ai-video-app-live.vercel.app/ai-receptionist",
cancel_url: "https://ai-video-app-live.vercel.app/ai-receptionist",
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
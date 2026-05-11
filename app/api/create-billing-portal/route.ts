import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function POST(req: Request) {
try {
const { email } = await req.json();

if (!email) {
return NextResponse.json({ error: "Missing email" }, { status: 400 });
}

const customers = await stripe.customers.list({
email,
limit: 1,
});

const customer = customers.data[0];

if (!customer) {
return NextResponse.json(
{ error: "Stripe customer not found" },
{ status: 404 }
);
}

const portalSession = await stripe.billingPortal.sessions.create({
customer: customer.id,
return_url: "https://ai-video-app-live.vercel.app/ai-receptionist",
});

return NextResponse.json({ url: portalSession.url });
} catch (err: any) {
console.error(err);
return NextResponse.json({ error: err.message }, { status: 500 });
}
}
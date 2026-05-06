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

const { data: business, error } = await supabase
.from("businesses")
.select("id, email")
.eq("email", email)
.single();

if (error || !business) {
return NextResponse.json(
{ error: "Business not found" },
{ status: 404 }
);
}

const session = await stripe.checkout.sessions.create({
mode: "subscription",
payment_method_types: ["card"],
customer_email: email,
line_items: [
{
price: "price_1TTFYHHEvcDZqpFQp2we5kj3",
quantity: 1,
},
],
metadata: {
business_id: business.id,
email,
},
success_url: "https://ai-video-app-live.vercel.app/ai-receptionist?paid=true",
cancel_url: "https://ai-video-app-live.vercel.app/ai-receptionist",
});

return NextResponse.json({ url: session.url });
} catch (err: any) {
console.error(err);
return NextResponse.json({ error: err.message }, { status: 500 });
}
}

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
apiVersion: "2026-03-25.dahlia",
});

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
const body = await req.text();
const signature = req.headers.get("stripe-signature");

if (!signature) {
return new Response("Missing stripe-signature header", { status: 400 });
}

let event: Stripe.Event;

try {
event = stripe.webhooks.constructEvent(
body,
signature,
process.env.STRIPE_WEBHOOK_SECRET!
);
} catch (error: any) {
return new Response(`Webhook error: ${error.message}`, { status: 400 });
}

try {
if (event.type === "checkout.session.completed") {
const session = event.data.object as Stripe.Checkout.Session;

const userId = session.metadata?.userId;
const creditsToAdd = Number(session.metadata?.credits || 50);

if (!userId) {
return new Response("Missing userId metadata", { status: 400 });
}

const { data: profile, error: loadError } = await supabase
.from("profiles")
.select("credits")
.eq("id", userId)
.single();

if (loadError) throw new Error(loadError.message);

const currentCredits = profile?.credits || 0;

const { error: updateError } = await supabase
.from("profiles")
.update({
credits: currentCredits + creditsToAdd,
})
.eq("id", userId);

if (updateError) throw new Error(updateError.message);
}

return NextResponse.json({ received: true });
} catch (error: any) {
return new Response(`Webhook handler error: ${error.message}`, {
status: 500,
});
}
}
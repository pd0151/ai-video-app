"use client";

import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function PaymentSuccessPage() {
const router = useRouter();

useEffect(() => {
async function unlockUser() {
const {
data: { user },
} = await supabase.auth.getUser();

if (!user?.email) {
router.push("/login");
return;
}

const params = new URLSearchParams(window.location.search);
const type = params.get("type");
const packageType = params.get("packageType");
const urlEmail = params.get("email");

const email =
user?.email?.toLowerCase().trim() ||
urlEmail?.toLowerCase().trim();

if (!email) {
router.push("/login");
return;
}
if (type === "credits") {
let creditsToAdd = 50;

if (packageType === "150") {
creditsToAdd = 150;
}

if (packageType === "pro") {
creditsToAdd = 500;
}

const { data: existing } = await supabase
.from("user_credits")
.select("credits")
.eq("email", email)
.maybeSingle();

const currentCredits = existing?.credits || 0;

await supabase.from("user_credits").upsert(
{
email,
credits: currentCredits + creditsToAdd,
},
{ onConflict: "email" }
);

router.push("/");
return;
}

await supabase.from("paid_users").upsert({
email,
is_paid: true,
});

await supabase
.from("businesses")
.update({
is_paid: true,
})
.eq("email", email);

router.push("/business-settings");
}

unlockUser();
}, [router]);

return (
<main
style={{
minHeight: "100vh",
background: "#050011",
color: "white",
display: "flex",
alignItems: "center",
justifyContent: "center",
textAlign: "center",
padding: 24,
fontFamily: "Arial, sans-serif",
}}
>
<div>
<h1>✅ Payment successful</h1>
<p>Finalising your purchase...</p>
</div>
</main>
);
}
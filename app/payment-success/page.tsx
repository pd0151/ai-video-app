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

const email = user.email.toLowerCase().trim();

await supabase.from("paid_users").upsert({
email,
is_paid: true,
});

await supabase
.from("businesses")
.update({ is_paid: true })
.eq("email", email);

router.push("/business-setup");
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
<p>Setting up your AI receptionist...</p>
</div>
</main>
); 
}
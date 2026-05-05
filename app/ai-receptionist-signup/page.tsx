"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AIReceptionistSignupPage() {
const router = useRouter();

const [businessName, setBusinessName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

async function signupCustomer() {
if (!businessName || !email || !password) {
alert("Fill everything in");
return;
}

const { data, error } = await supabase.auth.signUp({
email,
password,
});

if (error) {
alert(error.message);
return;
}

if (!data.user) {
alert("Signup failed");
return;
}

const { error: businessError } = await supabase.from("businesses").insert({
id: data.user.id,
name: businessName,
is_paid: false,
});

if (businessError) {
alert(businessError.message);
return;
}

router.push("/ai-receptionist");
}

return (
<main style={page}>
<section style={card}>
<h1 style={title}>AI Receptionist Signup</h1>
<p style={sub}>Create your business account and unlock after payment.</p>

<input style={input} placeholder="Business name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
<input style={input} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
<input style={input} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

<button style={btn} onClick={signupCustomer}>Create Account</button>
</section>
</main>
);
}

const page = {
minHeight: "100vh",
padding: 24,
background: "radial-gradient(circle at top, #4c1d95 0%, #16072f 40%, #020617 100%)",
color: "white",
fontFamily: "Arial",
};

const card = {
marginTop: 70,
padding: 24,
borderRadius: 28,
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.15)",
};

const title = { fontSize: 38, margin: 0, fontWeight: 900 };
const sub = { opacity: 0.75, fontSize: 17 };
const input = {
width: "100%",
padding: 16,
marginTop: 12,
borderRadius: 14,
border: "0",
fontSize: 16,
};
const btn = {
width: "100%",
marginTop: 16,
padding: 16,
borderRadius: 18,
border: "0",
background: "linear-gradient(90deg,#22c55e,#86efac)",
fontWeight: 900,
fontSize: 17,
};

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SignupPage() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [businessName, setBusinessName] = useState("");
const router = useRouter();

async function handleSignup() {
if (!email || !password || !businessName) {
alert("Fill all fields");
return;
}

// ✅ CREATE USER
const { data, error } = await supabase.auth.signUp({
email,
password,
});

if (error) {
alert(error.message);
return;
}

const user = data.user;
if (!user) return;

// ✅ CREATE BUSINESS FOR USER
await supabase.from("businesses").insert({
id: user.id,
name: businessName,
is_paid: false,
});

alert("Account created");

router.push("/ai-receptionist");
}

return (
<main className="create-page">
<div className="create-card">
<h1 className="create-title">Create Account</h1>

<input
className="create-input"
placeholder="Business name"
value={businessName}
onChange={(e) => setBusinessName(e.target.value)}
/>

<input
className="create-input"
placeholder="Email"
value={email}
onChange={(e) => setEmail(e.target.value)}
/>

<input
className="create-input"
placeholder="Password"
type="password"
value={password}
onChange={(e) => setPassword(e.target.value)}
/>

<button className="create-btn primary" onClick={handleSignup}>
Sign Up
</button>
</div>
</main>
);
}
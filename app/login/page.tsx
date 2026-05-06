"use client";

import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function LoginPage() {
const [mode, setMode] = useState<"login" | "signup">("login");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [message, setMessage] = useState("");
const [loading, setLoading] = useState(false);

async function handleSubmit(e: React.FormEvent) {
e.preventDefault();
setLoading(true);
setMessage("");

if (!email.trim() || !password.trim()) {
setMessage("Enter email and password");
setLoading(false);
return;
}

try {
if (mode === "signup") {
const { error } = await supabase.auth.signUp({
email: email.trim(),
password: password.trim(),
});

if (error) {
setMessage(error.message);
setLoading(false);
return;
}

setMessage("Account created. Now log in.");
setMode("login");
setPassword("");
setLoading(false);
return;
}

const { error } = await supabase.auth.signInWithPassword({
email: email.trim(),
password: password.trim(),
});

if (error) {
setMessage(error.message);
setLoading(false);
return;
}

localStorage.setItem("user", email.trim());
window.location.href = "/";
} catch {
setMessage("Something went wrong");
setLoading(false);
}
}

return (
<main
style={{
minHeight: "100vh",
background:
"radial-gradient(circle at top, #1e3a8a 0%, #08142f 44%, #020617 100%)",
display: "flex",
alignItems: "center",
justifyContent: "center",
padding: 20,
}}
>
<form
onSubmit={handleSubmit}
style={{
width: "100%",
maxWidth: 460,
background: "rgba(16,34,74,0.92)",
padding: 28,
borderRadius: 24,
display: "flex",
flexDirection: "column",
gap: 16,
color: "white",
border: "1px solid rgba(255,255,255,0.12)",
boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
}}
>
<h1 style={{ margin: 0, fontSize: 44, fontWeight: 900 }}>
AdForge Login
</h1>

<p style={{ margin: 0, fontSize: 18, opacity: 0.85 }}>
Login or create an account to use the app
</p>

<div style={{ display: "flex", gap: 12 }}>
<button
type="button"
onClick={() => {
setMode("login");
setMessage("");
}}
style={{
flex: 1,
height: 54,
borderRadius: 16,
border: "none",
fontSize: 22,
fontWeight: 800,
cursor: "pointer",
background: mode === "login" ? "#7c3aed" : "#334155",
color: "white",
}}
>
Login
</button>

<button
type="button"
onClick={() => {
setMode("signup");
setMessage("");
}}
style={{
flex: 1,
height: 54,
borderRadius: 16,
border: "none",
fontSize: 22,
fontWeight: 800,
cursor: "pointer",
background: mode === "signup" ? "#7c3aed" : "#334155",
color: "white",
}}
>
Sign up
</button>
</div>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e) => setEmail(e.target.value)}
style={{
height: 58,
borderRadius: 16,
border: "1px solid rgba(255,255,255,0.12)",
padding: "0 18px",
fontSize: 18,
outline: "none",
background: "#1a2f5f",
color: "white",
}}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e) => setPassword(e.target.value)}
style={{
height: 58,
borderRadius: 16,
border: "1px solid rgba(255,255,255,0.12)",
padding: "0 18px",
fontSize: 18,
outline: "none",
background: "#1a2f5f",
color: "white",
}}
/>

<button
type="submit"
disabled={loading}
style={{
height: 58,
borderRadius: 16,
border: "none",
background: "linear-gradient(135deg, #7c3aed, #a855f7)",
color: "white",
fontSize: 22,
fontWeight: 900,
cursor: "pointer",
opacity: loading ? 0.7 : 1,
}}
>
{loading
? "Please wait..."
: mode === "login"
? "Login"
: "Create account"}
</button>

{!!message && (
<div style={{ fontSize: 18, fontWeight: 700 }}>{message}</div>
)}
</form>
</main>
);
}
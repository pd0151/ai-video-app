"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
const router = useRouter();

const [mode, setMode] = useState<"login" | "signup">("login");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");

async function handleSubmit(e: React.FormEvent) {
e.preventDefault();
setLoading(true);
setMessage("");

if (!email.trim() || !password.trim()) {
setMessage("Enter email and password");
setLoading(false);
return;
}

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

const loginResult = await supabase.auth.signInWithPassword({
email: email.trim(),
password: password.trim(),
});

if (loginResult.error) {
setMessage(loginResult.error.message);
setLoading(false);
return;
}

const {
data: { session },
} = await supabase.auth.getSession();

if (!session) {
setMessage("Signup worked but session not found");
setLoading(false);
return;
}

setMessage("Logged in!");
setLoading(false);

window.location.href = "/feed";
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

const {
data: { session },
} = await supabase.auth.getSession();

if (!session) {
setMessage("Login worked but session not found");
setLoading(false);
return;
}

setMessage("Logged in!");
setLoading(false);

window.location.href = "/feed";
}

return (
<main
style={{
minHeight: "100vh",
background: "#07152f",
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
background: "#10224a",
padding: 28,
borderRadius: 24,
display: "flex",
flexDirection: "column",
gap: 16,
color: "white",
boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
}}
>
<h1 style={{ margin: 0, fontSize: 44, fontWeight: 900 }}>
AI App Login
</h1>

<p style={{ margin: 0, fontSize: 18, opacity: 0.95 }}>
Login or create an account to use your app
</p>

<div style={{ display: "flex", gap: 12 }}>
<button
type="button"
onClick={() => setMode("login")}
style={{
flex: 1,
height: 54,
borderRadius: 16,
border: "none",
fontSize: 22,
fontWeight: 800,
cursor: "pointer",
background: mode === "login" ? "#1ea0ff" : "#5b6f96",
color: "white",
}}
>
Login
</button>

<button
type="button"
onClick={() => setMode("signup")}
style={{
flex: 1,
height: 54,
borderRadius: 16,
border: "none",
fontSize: 22,
fontWeight: 800,
cursor: "pointer",
background: mode === "signup" ? "#1ea0ff" : "#5b6f96",
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
background: "#1ea0ff",
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
<div
style={{
fontSize: 18,
fontWeight: 700,
color:
message === "Logged in!" ? "#8dffb1" : "rgba(255,255,255,0.95)",
}}
>
{message}
</div>
)}
</form>
</main>
);
}
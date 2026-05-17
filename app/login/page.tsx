"use client";

import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function LoginPage() {
const [mode, setMode] = useState<"login" | "signup">("login");

const [businessName, setBusinessName] = useState("");
const [location, setLocation] = useState("");
const [phone, setPhone] = useState("");
const [whatsapp, setWhatsapp] = useState("");
const [website, setWebsite] = useState("");

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const [message, setMessage] = useState("");
const [loading, setLoading] = useState(false);

async function resetPassword() {
const cleanEmail = email.toLowerCase().trim();

if (!cleanEmail) {
setMessage("Enter your email first, then press Forgot password.");
return;
}

const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
redirectTo: "https://ai-video-app-live.vercel.app/reset-password",
});

if (error) {
setMessage(error.message);
return;
}

setMessage("Password reset email sent. Check your inbox.");
}

async function handleSubmit(e: React.FormEvent) {
e.preventDefault();
setLoading(true);
setMessage("");

const cleanEmail = email.toLowerCase().trim();

if (!cleanEmail || !password.trim()) {
setMessage("Enter email and password");
setLoading(false);
return;
}

try {
if (mode === "signup") {
if (!businessName.trim() || !location.trim() || !phone.trim()) {
setMessage("Enter business name, location and phone number");
setLoading(false);
return;
}

const { error: signupError } = await supabase.auth.signUp({
email: cleanEmail,
password: password.trim(),
});

if (signupError) {
setMessage(signupError.message);
setLoading(false);
return;
}

const { error: businessError } = await supabase.from("businesses").insert({
name: businessName.trim(),
location: location.trim(),
phone: phone.trim(),
whatsapp: whatsapp.trim(),
website: website.trim(),
email: cleanEmail,
is_paid: false,
});

if (businessError) {
setMessage(businessError.message);
setLoading(false);
return;
}

setMessage("Account created. Now log in.");
setMode("login");
setPassword("");
setLoading(false);
return;
}

const { error: loginError } = await supabase.auth.signInWithPassword({
email: cleanEmail,
password: password.trim(),
});

if (loginError) {
setMessage(loginError.message);
setLoading(false);
return;
}

localStorage.setItem("user", cleanEmail);
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
"radial-gradient(circle at top, #063b1f 0%, #03100c 42%, #020204 100%)",
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
Login or create your business account
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
background: mode === "login" ? "#22ff7f" : "#102018",
color: mode === "login" ? "#001b0b" : "white",
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
background: mode === "signup" ? "#22ff7f" : "#102018",
color: mode === "signup" ? "#001b0b" : "white",
}}
>
Sign up
</button>
</div>

{mode === "signup" && (
<>
<input placeholder="Business name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} style={inputStyle} />
<input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle} />
<input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
<input placeholder="WhatsApp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} style={inputStyle} />
<input placeholder="Website" value={website} onChange={(e) => setWebsite(e.target.value)} style={inputStyle} />
</>
)}

<input
type="email"
placeholder="Email"
value={email}
onChange={(e) => setEmail(e.target.value)}
style={inputStyle}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e) => setPassword(e.target.value)}
style={inputStyle}
/>

<button
type="submit"
disabled={loading}
style={{
height: 58,
borderRadius: 16,
border: "none",
background: "linear-gradient(135deg, #22ff7f, #7dff9e)",
color: "#001b0b",
boxShadow: "0 24px 80px rgba(0,0,0,0.55), 0 0 55px rgba(34,255,127,0.08)",
fontSize: 22,
fontWeight: 900,
cursor: "pointer",
opacity: loading ? 0.7 : 1,
}}
>
{loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
</button>

{mode === "login" && (
<button
type="button"
onClick={resetPassword}
style={{
background: "transparent",
border: "none",
color: "#22ff7f",
fontWeight: 800,
fontSize: 16,
cursor: "pointer",
}}
>
Forgot password?
</button>
)}

{!!message && <div style={{ fontSize: 18, fontWeight: 700 }}>{message}</div>}
</form>
</main>
);
}

const inputStyle: React.CSSProperties = {
height: 58,
borderRadius: 16,
border: "1px solid rgba(34,255,127,0.22)",
padding: "0 18px",
fontSize: 18,
outline: "none",
background: "rgba(2, 20, 12, 0.86)",
color: "white",
};
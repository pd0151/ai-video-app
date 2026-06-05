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
redirectTo: "https://adforge.uk/reset-password"
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
<main style={page}>
<form onSubmit={handleSubmit} style={card}>
<div style={badge}>
AI <span style={{ color: "#32ff7e" }}>ADVERTISING</span> PLATFORM
</div>

<h1 style={title}>
Ad<span style={{ color: "#34f57d" }}>Forge</span> Login
</h1>

<p style={subtitle}>Login or create your business account</p>

<div style={tabRow}>
<button
type="button"
onClick={() => {
setMode("login");
setMessage("");
}}
style={mode === "login" ? activeTab : tab}
>
Login
</button>

<button
type="button"
onClick={() => {
setMode("signup");
setMessage("");
}}
style={mode === "signup" ? activeTab : tab}
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

<input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
<input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />

<button type="submit" disabled={loading} style={submitBtn}>
{loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
</button>

{mode === "login" && (
<button type="button" onClick={resetPassword} style={forgotBtn}>
Forgot password?
</button>
)}

{!!message && <div style={messageBox}>{message}</div>}
</form>
</main>
);
}

const xeonBorder = "1px solid rgba(220,235,255,0.28)";
const xeonGlow =
"0 0 3px rgba(255,255,255,0.55), 0 0 22px rgba(220,235,255,0.28), 0 0 60px rgba(120,160,255,0.16)";
const xeonGlowStrong =
"0 0 6px rgba(255,255,255,0.85), 0 0 30px rgba(220,235,255,0.45), 0 0 75px rgba(120,160,255,0.22)";
const glassBg = "rgba(8,12,22,0.78)";
const cardBg = "rgba(10,14,24,0.92)";
const whiteBtn = "linear-gradient(180deg,#ffffff,#eaf0ff)";

const page: React.CSSProperties = {
minHeight: "100vh",
background:
"radial-gradient(circle at 72% 0%, rgba(220,235,255,0.10), transparent 34%), radial-gradient(circle at 28% 35%, rgba(120,160,255,0.10), transparent 32%), #05070d",
display: "flex",
alignItems: "center",
justifyContent: "center",
padding: 20,
fontFamily: "Inter, Arial, sans-serif",
};

const card: React.CSSProperties = {
width: "100%",
maxWidth: 460,
background: cardBg,
padding: 28,
borderRadius: 28,
display: "flex",
flexDirection: "column",
gap: 16,
color: "white",
border: xeonBorder,
boxShadow: xeonGlowStrong,
backdropFilter: "blur(18px)",
};

const badge: React.CSSProperties = {
fontSize: 12,
letterSpacing: 4,
color: "rgba(255,255,255,0.55)",
fontWeight: 900,
};

const title: React.CSSProperties = {
margin: 0,
fontSize: 42,
lineHeight: 1,
fontWeight: 950,
};

const subtitle: React.CSSProperties = {
margin: 0,
fontSize: 17,
color: "rgba(255,255,255,0.72)",
};

const tabRow: React.CSSProperties = {
display: "flex",
gap: 12,
};

const tab: React.CSSProperties = {
flex: 1,
height: 58,
borderRadius: 18,
border: xeonBorder,
fontSize: 21,
fontWeight: 900,
cursor: "pointer",
background: glassBg,
color: "white",
boxShadow: xeonGlow,
};

const activeTab: React.CSSProperties = {
...tab,
background: whiteBtn,
color: "#05070d",
boxShadow: xeonGlowStrong,
};

const inputStyle: React.CSSProperties = {
height: 58,
borderRadius: 18,
border: xeonBorder,
padding: "0 18px",
fontSize: 18,
outline: "none",
background: glassBg,
color: "white",
boxShadow: xeonGlow,
};

const submitBtn: React.CSSProperties = {
height: 60,
borderRadius: 18,
border: "1px solid rgba(255,255,255,0.78)",
background: whiteBtn,
color: "#05070d",
fontSize: 22,
fontWeight: 950,
cursor: "pointer",
boxShadow: xeonGlowStrong,
};

const forgotBtn: React.CSSProperties = {
background: "transparent",
border: xeonBorder,
color: "#ffffff",
fontWeight: 900,
fontSize: 16,
cursor: "pointer",
borderRadius: 14,
padding: "12px 16px",
boxShadow: xeonGlow,
};

const messageBox: React.CSSProperties = {
fontSize: 16,
fontWeight: 800,
color: "#ffffff",
background: glassBg,
border: xeonBorder,
borderRadius: 14,
padding: 12,
boxShadow: xeonGlow,
};
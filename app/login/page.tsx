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
<main style={page}>
<form onSubmit={handleSubmit} style={card}>
<div style={badge}>AI ADVERTISING PLATFORM</div>

<h1 style={title}>
Ad<span style={{ color: "#22ff7f" }}>Forge</span> Login
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

const page: React.CSSProperties = {
minHeight: "100vh",
background:
"radial-gradient(circle at top, #063b1f 0%, #03100c 42%, #020204 100%)",
display: "flex",
alignItems: "center",
justifyContent: "center",
padding: 20,
fontFamily: "Inter, Arial, sans-serif",
};

const card: React.CSSProperties = {
width: "100%",
maxWidth: 460,
background: "rgba(2,20,12,0.88)",
padding: 28,
borderRadius: 28,
display: "flex",
flexDirection: "column",
gap: 16,
color: "white",
border: "1px solid rgba(34,255,127,0.2)",
boxShadow:
"0 0 70px rgba(34,255,127,0.1), 0 24px 90px rgba(0,0,0,0.65)",
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
border: "1px solid rgba(34,255,127,0.14)",
fontSize: 21,
fontWeight: 900,
cursor: "pointer",
background: "rgba(0,0,0,0.32)",
color: "white",
};

const activeTab: React.CSSProperties = {
...tab,
background: "linear-gradient(135deg, #22ff7f, #7dff9e)",
color: "#001b0b",
boxShadow: "0 0 30px rgba(34,255,127,0.25)",
};

const inputStyle: React.CSSProperties = {
height: 58,
borderRadius: 18,
border: "1px solid rgba(34,255,127,0.2)",
padding: "0 18px",
fontSize: 18,
outline: "none",
background: "rgba(0,0,0,0.35)",
color: "white",
};

const submitBtn: React.CSSProperties = {
height: 60,
borderRadius: 18,
border: "none",
background: "linear-gradient(135deg, #22ff7f, #7dff9e)",
color: "#001b0b",
fontSize: 22,
fontWeight: 950,
cursor: "pointer",
boxShadow: "0 0 35px rgba(34,255,127,0.35)",
};

const forgotBtn: React.CSSProperties = {
background: "transparent",
border: "none",
color: "#22ff7f",
fontWeight: 900,
fontSize: 16,
cursor: "pointer",
};

const messageBox: React.CSSProperties = {
fontSize: 16,
fontWeight: 800,
color: "#22ff7f",
};
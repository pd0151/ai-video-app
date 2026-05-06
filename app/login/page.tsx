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

const [businessName, setBusinessName] = useState("");
const [location, setLocation] = useState("");
const [phone, setPhone] = useState("");
const [whatsapp, setWhatsapp] = useState("");
const [website, setWebsite] = useState("");

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
if (!businessName.trim()) {
setMessage("Enter your business name");
setLoading(false);
return;
}

const { error } = await supabase.auth.signUp({
email: email.trim(),
password: password.trim(),
});

if (error) {
setMessage(error.message);
setLoading(false);
return;
}

await supabase.from("businesses").insert({
email: email.trim(),
name: businessName.trim(),
location: location.trim(),
phone: phone.trim(),
whatsapp: whatsapp.trim(),
website: website.trim(),
tagline: "Mobile service • Fast response • Local business",
});

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
<main style={{
minHeight: "100vh",
background: "radial-gradient(circle at top, #1e3a8a 0%, #08142f 44%, #020617 100%)",
display: "flex",
alignItems: "center",
justifyContent: "center",
padding: 20,
}}>
<form onSubmit={handleSubmit} style={{
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
}}>
<h1 style={{ margin: 0, fontSize: 42 }}>AdForge Login</h1>

<div style={{ display: "flex", gap: 12 }}>
<button type="button" onClick={() => setMode("login")} style={mode === "login" ? tabOn : tabOff}>Login</button>
<button type="button" onClick={() => setMode("signup")} style={mode === "signup" ? tabOn : tabOff}>Sign up</button>
</div>

{mode === "signup" && (
<>
<input placeholder="Business name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} style={input} />
<input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} style={input} />
<input placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} style={input} />
<input placeholder="WhatsApp number" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} style={input} />
<input placeholder="Website" value={website} onChange={(e) => setWebsite(e.target.value)} style={input} />
</>
)}

<input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={input} />
<input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={input} />

<button type="submit" disabled={loading} style={submitBtn}>
{loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
</button>

{!!message && <div style={{ fontSize: 16, fontWeight: 700 }}>{message}</div>}
</form>
</main>
);
}

const input = {
height: 58,
borderRadius: 16,
border: "1px solid rgba(255,255,255,0.12)",
padding: "0 18px",
fontSize: 18,
background: "#1a2f5f",
color: "white",
};

const tabOn = {
flex: 1,
height: 54,
borderRadius: 16,
border: "none",
fontSize: 22,
fontWeight: 800,
background: "#7c3aed",
color: "white",
};

const tabOff = {
...tabOn,
background: "#334155",
};

const submitBtn = {
height: 58,
borderRadius: 16,
border: "none",
background: "linear-gradient(135deg, #7c3aed, #a855f7)",
color: "white",
fontSize: 22,
fontWeight: 900,
};
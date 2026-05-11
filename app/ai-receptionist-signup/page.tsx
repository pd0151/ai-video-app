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
const [phone, setPhone] = useState("");
const [whatsapp, setWhatsapp] = useState("");
const [loading, setLoading] = useState(false);

async function signupCustomer() {
if (!businessName || !email || !password) {
alert("Fill everything in");
return;
}

setLoading(true);

const cleanEmail = email.toLowerCase().trim();

const { data, error } = await supabase.auth.signUp({
email: cleanEmail,
password,
});

if (error) {
alert(error.message);
setLoading(false);
return;
}

if (!data.user) {
alert("Signup failed");
setLoading(false);
return;
}

const { error: businessError } = await supabase.from("businesses").upsert(
{
id: data.user.id,
email: cleanEmail,
name: businessName,
business_name: businessName,
phone,
whatsapp,
is_paid: false,
setup_complete: false,
ai_activated: false,
},
{ onConflict: "id" }
);

if (businessError) {
alert(businessError.message);
setLoading(false);
return;
}

router.push("/ai-receptionist");
}

return (
<main style={page}>
<button onClick={() => router.push("/")} style={backBtn}>
‹
</button>

<section style={card}>
<div style={topPill}>● AI RECEPTIONIST SETUP</div>

<h1 style={title}>
Never miss
<span style={purple}> another job</span>
</h1>

<p style={sub}>
Create your business account, then subscribe to activate your AI call
system and live leads dashboard.
</p>

<div style={priceBox}>
<div>
<p style={small}>AI Receptionist</p>
<h2 style={price}>£99/mo</h2>
<p style={muted}>24/7 call answering • SMS alerts • live leads</p>
</div>
<span style={badge}>POPULAR</span>
</div>

<div style={form}>
<input
style={input}
placeholder="Business name"
value={businessName}
onChange={(e) => setBusinessName(e.target.value)}
/>

<input
style={input}
placeholder="Business phone number"
value={phone}
onChange={(e) => setPhone(e.target.value)}
/>

<input
style={input}
placeholder="WhatsApp number"
value={whatsapp}
onChange={(e) => setWhatsapp(e.target.value)}
/>

<input
style={input}
placeholder="Email"
value={email}
onChange={(e) => setEmail(e.target.value)}
/>

<input
style={input}
placeholder="Password"
type="password"
value={password}
onChange={(e) => setPassword(e.target.value)}
/>

<button style={btn} onClick={signupCustomer}>
{loading ? "Creating..." : "Create AI Account"}
</button>
</div>

<div style={features}>
<div style={feature}>◉ Answers missed calls</div>
<div style={feature}>◎ Captures customer details</div>
<div style={feature}>ϟ Sends instant alerts</div>
<div style={feature}>⬡ Live leads dashboard</div>
</div>
</section>
</main>
);
}

const page: React.CSSProperties = {
minHeight: "100vh",
padding: "88px 20px 150px",
background:
"radial-gradient(circle at 50% -10%, rgba(168,85,247,0.45), transparent 35%), linear-gradient(180deg,#08001f,#020617)",
color: "white",
fontFamily: "Inter, Arial, sans-serif",
};

const backBtn: React.CSSProperties = {
position: "absolute",
top: 26,
left: 20,
width: 48,
height: 48,
borderRadius: 16,
border: "1px solid rgba(255,255,255,0.14)",
background: "rgba(255,255,255,0.08)",
color: "white",
fontSize: 34,
};

const card: React.CSSProperties = {
borderRadius: 32,
padding: 22,
background:
"radial-gradient(circle at 80% 20%, rgba(168,85,247,0.25), transparent 34%), linear-gradient(145deg, rgba(67,15,130,0.72), rgba(8,7,30,0.98))",
border: "1px solid rgba(168,85,247,0.65)",
boxShadow: "0 0 40px rgba(126,34,206,0.28)",
};

const topPill: React.CSSProperties = {
display: "inline-block",
padding: "9px 13px",
borderRadius: 999,
background: "rgba(255,255,255,0.08)",
color: "#4ade80",
fontSize: 12,
fontWeight: 950,
};

const title: React.CSSProperties = {
margin: "24px 0 0",
fontSize: 44,
lineHeight: 0.95,
fontWeight: 950,
letterSpacing: -2,
};

const purple: React.CSSProperties = {
display: "block",
color: "#9b4dff",
};

const sub: React.CSSProperties = {
color: "rgba(255,255,255,0.72)",
fontSize: 15,
lineHeight: 1.5,
};

const priceBox: React.CSSProperties = {
marginTop: 20,
padding: 18,
borderRadius: 22,
background: "rgba(8,13,35,0.82)",
border: "1px solid rgba(168,85,247,0.18)",
display: "flex",
justifyContent: "space-between",
gap: 12,
};

const small: React.CSSProperties = {
margin: 0,
opacity: 0.65,
fontWeight: 800,
};

const price: React.CSSProperties = {
margin: "6px 0",
fontSize: 38,
fontWeight: 950,
};

const muted: React.CSSProperties = {
margin: 0,
color: "rgba(255,255,255,0.62)",
};

const badge: React.CSSProperties = {
height: 32,
padding: "8px 10px",
borderRadius: 999,
background: "rgba(34,197,94,0.18)",
color: "#86efac",
fontSize: 11,
fontWeight: 950,
};

const form: React.CSSProperties = {
display: "grid",
gap: 12,
marginTop: 20,
};

const input: React.CSSProperties = {
width: "100%",
boxSizing: "border-box",
padding: "16px 14px",
borderRadius: 16,
border: "1px solid rgba(255,255,255,0.12)",
background: "rgba(0,0,0,0.25)",
color: "white",
fontSize: 15,
outline: "none",
};

const btn: React.CSSProperties = {
width: "100%",
marginTop: 8,
padding: "17px 18px",
borderRadius: 18,
border: "none",
background: "linear-gradient(90deg,#22c55e,#86efac)",
color: "#04130a",
fontSize: 17,
fontWeight: 950,
};

const features: React.CSSProperties = {
marginTop: 22,
display: "grid",
gap: 10,
};

const feature: React.CSSProperties = {
padding: 13,
borderRadius: 16,
background: "rgba(8,13,35,0.72)",
border: "1px solid rgba(255,255,255,0.07)",
color: "rgba(255,255,255,0.86)",
fontWeight: 800,
};
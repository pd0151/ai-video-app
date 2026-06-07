"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

export default function AiDemoPage() {
const demoNumber = "tel:+447576590378"; // change to your AI demo number
const demoVideo = "https://vm.tiktok.com/ZNRvmTSS8/"; // change to your video link

return (
<main style={page}>
<section style={hero}>
<div style={badge}>LIVE AI RECEPTIONIST</div>

<h1 style={title}>
Never Miss
<br />
Another Lead.
</h1>

<p style={sub}>
AI answers every call, captures customer details and sends instant SMS
alerts straight to your phone.
</p>

<div style={buttonStack}>
<a href={demoVideo} target="_blank" style={darkBtn}>
WATCH REAL DEMO
</a>

<a href={demoNumber} style={greenBtn}>
TEST THE AI NOW
</a>

<Link href="/signup" style={whiteBtn}>
START FREE SETUP →
</Link>
</div>

<div style={phone}>
<div style={island} />
<div style={screen}>
<div style={small}>INCOMING CALL</div>
<div style={caller}>Customer Call</div>
<div style={area}>Liverpool L1</div>

<div style={line} />
<div style={listening}>AI LISTENING</div>
<div style={line} />

<div style={pill}>Lead Captured</div>
<div style={pill}>SMS Sent</div>
</div>
</div>
</section>

<section style={flowCard}>
<h2 style={sectionTitle}>How It Works</h2>

<div style={flow}>
<div style={step}>Customer Calls</div>
<div style={arrow}>↓</div>
<div style={step}>AI Answers</div>
<div style={arrow}>↓</div>
<div style={step}>Lead Captured</div>
<div style={arrow}>↓</div>
<div style={step}>SMS Sent</div>
<div style={arrow}>↓</div>
<div style={step}>Job Booked</div>
</div>
</section>

<section style={proofGrid}>
<div style={proofCard}>
<b>24/7 Answering</b>
<span>Never lose jobs because you missed a call.</span>
</div>

<div style={proofCard}>
<b>Instant SMS Alerts</b>
<span>Customer details sent straight to your mobile.</span>
</div>

<div style={proofCard}>
<b>Setup Included</b>
<span>We help get your AI receptionist live fast.</span>
</div>
</section>

<section style={priceCard}>
<div style={price}>£99/month</div>
<p style={priceText}>AI Receptionist • Lead Capture • SMS Alerts</p>

<Link href="/login" style={greenBtn}>
GET STARTED →
</Link>
</section>
</main>
);
}

const page: CSSProperties = {
minHeight: "100vh",
background:
"radial-gradient(circle at top right, rgba(49,255,126,0.14), transparent 35%), #020305",
color: "white",
padding: "26px 16px 120px",
fontFamily: "Arial, sans-serif",
};

const hero: CSSProperties = {
position: "relative",
overflow: "hidden",
borderRadius: 36,
padding: "30px 20px 330px",
background:
"linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))",
border: "1px solid rgba(255,255,255,0.14)",
boxShadow: "0 0 60px rgba(255,255,255,0.08)",
};

const badge: CSSProperties = {
display: "inline-block",
padding: "10px 14px",
borderRadius: 999,
fontSize: 11,
fontWeight: 900,
letterSpacing: 2,
background: "rgba(49,255,126,0.12)",
border: "1px solid rgba(49,255,126,0.35)",
color: "#31ff7e",
};

const title: CSSProperties = {
fontSize: 56,
lineHeight: 0.9,
margin: "24px 0 16px",
fontWeight: 950,
letterSpacing: -2,
};

const sub: CSSProperties = {
fontSize: 17,
lineHeight: 1.45,
color: "rgba(255,255,255,0.74)",
maxWidth: 420,
};

const buttonStack: CSSProperties = {
display: "grid",
gap: 12,
marginTop: 24,
};

const greenBtn: CSSProperties = {
display: "block",
textAlign: "center",
textDecoration: "none",
padding: "18px 20px",
borderRadius: 999,
background: "linear-gradient(135deg,#31ff7e,#16c957)",
color: "#041006",
fontWeight: 950,
fontSize: 16,
boxShadow: "0 0 35px rgba(49,255,126,0.28)",
};

const darkBtn: CSSProperties = {
display: "block",
textAlign: "center",
textDecoration: "none",
padding: "17px 20px",
borderRadius: 999,
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.16)",
color: "white",
fontWeight: 900,
fontSize: 15,
};

const whiteBtn: CSSProperties = {
display: "block",
textAlign: "center",
textDecoration: "none",
padding: "17px 20px",
borderRadius: 999,
background: "white",
color: "#05070d",
fontWeight: 950,
fontSize: 15,
};

const phone: CSSProperties = {
position: "absolute",
right: 28,
bottom: -24,
width: 185,
height: 370,
borderRadius: 44,
padding: 8,
background: "linear-gradient(180deg,#20242d,#050609)",
border: "1px solid rgba(255,255,255,0.22)",
boxShadow:
"0 0 50px rgba(49,255,126,0.2), 0 25px 70px rgba(0,0,0,0.75)",
transform: "rotate(8deg)",
};

const island: CSSProperties = {
position: "absolute",
top: 18,
left: "50%",
transform: "translateX(-50%)",
width: 72,
height: 22,
borderRadius: 999,
background: "#000",
zIndex: 2,
};

const screen: CSSProperties = {
height: "100%",
borderRadius: 36,
padding: "64px 16px 16px",
textAlign: "center",
overflow: "hidden",
background:
"radial-gradient(circle at top, rgba(49,255,126,0.18), transparent 38%), #05070d",
};

const small: CSSProperties = {
fontSize: 9,
letterSpacing: 2,
opacity: 0.55,
fontWeight: 900,
};

const caller: CSSProperties = {
marginTop: 18,
fontSize: 24,
fontWeight: 950,
};

const area: CSSProperties = {
marginTop: 6,
fontSize: 12,
opacity: 0.65,
};

const line: CSSProperties = {
height: 2,
borderRadius: 999,
margin: "22px 0",
background: "linear-gradient(90deg,transparent,#31ff7e,transparent)",
boxShadow: "0 0 14px rgba(49,255,126,0.6)",
};

const listening: CSSProperties = {
fontSize: 12,
fontWeight: 950,
letterSpacing: 2,
color: "#31ff7e",
};

const pill: CSSProperties = {
marginTop: 10,
padding: "9px 10px",
borderRadius: 999,
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.12)",
fontSize: 11,
fontWeight: 800,
};

const flowCard: CSSProperties = {
marginTop: 18,
borderRadius: 32,
padding: 22,
background: "rgba(255,255,255,0.06)",
border: "1px solid rgba(255,255,255,0.12)",
};

const sectionTitle: CSSProperties = {
fontSize: 26,
margin: "0 0 18px",
fontWeight: 950,
};

const flow: CSSProperties = {
display: "grid",
gap: 8,
};

const step: CSSProperties = {
padding: "15px 16px",
borderRadius: 18,
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.1)",
fontWeight: 900,
};

const arrow: CSSProperties = {
textAlign: "center",
color: "#31ff7e",
fontSize: 20,
fontWeight: 900,
};

const proofGrid: CSSProperties = {
display: "grid",
gap: 12,
marginTop: 18,
};

const proofCard: CSSProperties = {
display: "grid",
gap: 8,
padding: 20,
borderRadius: 26,
background: "rgba(255,255,255,0.06)",
border: "1px solid rgba(255,255,255,0.12)",
color: "rgba(255,255,255,0.7)",
};

const priceCard: CSSProperties = {
marginTop: 18,
padding: 24,
borderRadius: 32,
background:
"linear-gradient(145deg, rgba(49,255,126,0.13), rgba(255,255,255,0.05))",
border: "1px solid rgba(49,255,126,0.25)",
textAlign: "center",
};

const price: CSSProperties = {
fontSize: 44,
fontWeight: 950,
};

const priceText: CSSProperties = {
color: "rgba(255,255,255,0.7)",
marginBottom: 18,
};
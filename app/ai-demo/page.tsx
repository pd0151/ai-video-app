"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

export default function AiDemoPage() {
const demoNumber = "tel:+447576590378";
const demoVideo = "https://vm.tiktok.com/ZNRvmTSS8/";

return (
<main style={page}>
<section style={hero}>
<div style={topRow}>
<div>
<div style={brandSmall}>ADFORGE AI</div>
<h1 style={title}>
Never Miss
<br />A Lead.
</h1>
</div>

<div style={phone}>
<div style={island} />
<div style={phoneText}>INCOMING CALL</div>
<div style={caller}>Customer</div>
<div style={subCaller}>AI answering...</div>
<div style={pulseLine} />
</div>
</div>

<p style={sub}>
Let customers test your AI receptionist live. It answers, captures
details, and sends instant SMS proof.
</p>

<div style={buttons}>
<a href={demoNumber} style={greenBtn}>
TEST THE AI NOW
</a>

<a href={demoVideo} target="_blank" style={darkBtn}>
WATCH DEMO
</a>
</div>

<div style={miniFlow}>
<span>Call answered</span>
<span>Lead captured</span>
<span>SMS sent</span>
</div>
</section>

<section style={proof}>
<div style={proofItem}>
<b>24/7 Answering</b>
<span>Never lose a customer call.</span>
</div>

<div style={proofItem}>
<b>Instant SMS</b>
<span>Customer gets proof straight away.</span>
</div>

<div style={proofItem}>
<b>Setup Included</b>
<span>We help get it live fast.</span>
</div>
</section>

<section style={priceCard}>
<div>
<div style={price}>£99/month</div>
<p style={priceText}>AI Receptionist • Lead Capture • SMS Alerts</p>
</div>

<Link href="/login" style={whiteBtn}>
GET STARTED →
</Link>
</section>
</main>
);
}

const page: CSSProperties = {
minHeight: "100vh",
background:
"radial-gradient(circle at top right, rgba(49,255,126,0.16), transparent 34%), #020305",
color: "white",
padding: "22px 16px 110px",
fontFamily: "Arial, sans-serif",
};

const hero: CSSProperties = {
borderRadius: 34,
padding: 22,
background:
"linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))",
border: "1px solid rgba(255,255,255,0.14)",
boxShadow: "0 0 50px rgba(49,255,126,0.08)",
overflow: "hidden",
};

const topRow: CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "flex-start",
gap: 12,
};

const brandSmall: CSSProperties = {
color: "#31ff7e",
fontSize: 12,
fontWeight: 950,
letterSpacing: 2,
marginBottom: 14,
};

const title: CSSProperties = {
fontSize: 48,
lineHeight: 0.9,
margin: 0,
fontWeight: 950,
letterSpacing: -2,
};

const sub: CSSProperties = {
margin: "18px 0 0",
fontSize: 16,
lineHeight: 1.45,
color: "rgba(255,255,255,0.72)",
};

const phone: CSSProperties = {
position: "relative",
flex: "0 0 118px",
height: 220,
borderRadius: 30,
padding: "48px 12px 12px",
background:
"radial-gradient(circle at top, rgba(49,255,126,0.18), transparent 44%), #05070d",
border: "1px solid rgba(255,255,255,0.18)",
boxShadow: "0 0 34px rgba(49,255,126,0.18)",
transform: "rotate(7deg)",
textAlign: "center",
};

const island: CSSProperties = {
position: "absolute",
top: 14,
left: "50%",
transform: "translateX(-50%)",
width: 58,
height: 17,
borderRadius: 999,
background: "#000",
};

const phoneText: CSSProperties = {
fontSize: 8,
letterSpacing: 2,
opacity: 0.65,
fontWeight: 900,
};

const caller: CSSProperties = {
marginTop: 16,
fontSize: 18,
fontWeight: 950,
};

const subCaller: CSSProperties = {
marginTop: 8,
fontSize: 10,
color: "#31ff7e",
fontWeight: 900,
};

const pulseLine: CSSProperties = {
height: 3,
borderRadius: 999,
marginTop: 28,
background: "linear-gradient(90deg,transparent,#31ff7e,transparent)",
boxShadow: "0 0 16px rgba(49,255,126,0.7)",
};

const buttons: CSSProperties = {
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: 10,
marginTop: 20,
};

const greenBtn: CSSProperties = {
display: "block",
textAlign: "center",
textDecoration: "none",
padding: "15px 12px",
borderRadius: 999,
background: "linear-gradient(135deg,#31ff7e,#16c957)",
color: "#041006",
fontWeight: 950,
fontSize: 13,
boxShadow: "0 0 30px rgba(49,255,126,0.28)",
};

const darkBtn: CSSProperties = {
display: "block",
textAlign: "center",
textDecoration: "none",
padding: "15px 12px",
borderRadius: 999,
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.15)",
color: "white",
fontWeight: 900,
fontSize: 13,
};

const miniFlow: CSSProperties = {
display: "grid",
gridTemplateColumns: "1fr 1fr 1fr",
gap: 8,
marginTop: 18,
};

const proof: CSSProperties = {
display: "grid",
gap: 10,
marginTop: 14,
};

const proofItem: CSSProperties = {
display: "grid",
gap: 5,
padding: 16,
borderRadius: 24,
background: "rgba(255,255,255,0.06)",
border: "1px solid rgba(255,255,255,0.12)",
color: "rgba(255,255,255,0.68)",
};

const priceCard: CSSProperties = {
marginTop: 14,
padding: 20,
borderRadius: 28,
background:
"linear-gradient(145deg, rgba(49,255,126,0.13), rgba(255,255,255,0.05))",
border: "1px solid rgba(49,255,126,0.25)",
textAlign: "center",
};

const price: CSSProperties = {
fontSize: 38,
fontWeight: 950,
};

const priceText: CSSProperties = {
color: "rgba(255,255,255,0.68)",
margin: "8px 0 16px",
};

const whiteBtn: CSSProperties = {
display: "block",
textAlign: "center",
textDecoration: "none",
padding: "16px 18px",
borderRadius: 999,
background: "white",
color: "#05070d",
fontWeight: 950,
fontSize: 15,
};
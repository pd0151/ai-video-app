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

<section style={leadCard}>
<div style={leadTitle}>LIVE DEMO LEAD</div>

<div style={leadRow}>
<b>Name</b>
<span>Customer Captured</span>
</div>

<div style={leadRow}>
<b>Business</b>
<span>Captured Automatically</span>
</div>

<div style={leadRow}>
<b>SMS</b>
<span>Sent Instantly</span>
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
<div style={price}>£99/month</div>
<p style={priceText}>AI Receptionist • Lead Capture • SMS Alerts</p>

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
"radial-gradient(circle at top, rgba(255,255,255,0.08), transparent 32%), #020305",
color: "white",
padding: "22px 16px 110px",
fontFamily: "Arial, sans-serif",
};

const hero: CSSProperties = {
borderRadius: 34,
padding: 22,
background:
"linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025))",
border: "1px solid rgba(255,255,255,0.16)",
boxShadow:
"0 0 34px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,0.08)",
overflow: "hidden",
};

const topRow: CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "flex-start",
gap: 12,
};

const brandSmall: CSSProperties = {
color: "rgba(255,255,255,0.72)",
fontSize: 12,
fontWeight: 950,
letterSpacing: 3,
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
color: "rgba(255,255,255,0.7)",
};

const phone: CSSProperties = {
position: "relative",
flex: "0 0 104px",
height: 194,
borderRadius: 30,
padding: "44px 10px 12px",
background:
"radial-gradient(circle at top, rgba(49,255,126,0.14), transparent 42%), #05070d",
border: "1px solid rgba(255,255,255,0.18)",
boxShadow:
"0 0 26px rgba(255,255,255,0.12), 0 0 28px rgba(49,255,126,0.12)",
transform: "rotate(7deg) translateY(-4px)",
textAlign: "center",
};

const island: CSSProperties = {
position: "absolute",
top: 14,
left: "50%",
transform: "translateX(-50%)",
width: 54,
height: 16,
borderRadius: 999,
background: "#000",
};

const phoneText: CSSProperties = {
fontSize: 7,
letterSpacing: 2,
opacity: 0.65,
fontWeight: 900,
};

const caller: CSSProperties = {
marginTop: 14,
fontSize: 17,
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
marginTop: 24,
background: "linear-gradient(90deg,transparent,#31ff7e,transparent)",
boxShadow: "0 0 14px rgba(49,255,126,0.55)",
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
background: "linear-gradient(135deg,#7CFF9B,#31ff7e)",
color: "#041006",
fontWeight: 950,
fontSize: 13,
boxShadow: "0 0 28px rgba(49,255,126,0.3)",
};

const darkBtn: CSSProperties = {
display: "block",
textAlign: "center",
textDecoration: "none",
padding: "15px 12px",
borderRadius: 999,
background: "rgba(255,255,255,0.055)",
border: "1px solid rgba(255,255,255,0.18)",
color: "white",
fontWeight: 900,
fontSize: 13,
boxShadow: "0 0 18px rgba(255,255,255,0.08)",
};

const miniFlow: CSSProperties = {
display: "grid",
gridTemplateColumns: "1fr 1fr 1fr",
gap: 8,
marginTop: 18,
color: "rgba(255,255,255,0.82)",
};

const leadCard: CSSProperties = {
display: "grid",
gap: 10,
marginTop: 14,
padding: 18,
borderRadius: 28,
background: "rgba(255,255,255,0.045)",
border: "1px solid rgba(255,255,255,0.14)",
boxShadow:
"0 0 26px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
};

const leadTitle: CSSProperties = {
fontSize: 14,
fontWeight: 950,
letterSpacing: 1,
marginBottom: 2,
};

const leadRow: CSSProperties = {
display: "flex",
justifyContent: "space-between",
gap: 10,
padding: "11px 12px",
borderRadius: 18,
background: "rgba(255,255,255,0.05)",
border: "1px solid rgba(255,255,255,0.09)",
color: "rgba(255,255,255,0.7)",
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
background: "rgba(255,255,255,0.045)",
border: "1px solid rgba(255,255,255,0.13)",
color: "rgba(255,255,255,0.68)",
boxShadow: "0 0 20px rgba(255,255,255,0.06)",
};

const priceCard: CSSProperties = {
marginTop: 14,
padding: 20,
borderRadius: 28,
background: "rgba(255,255,255,0.045)",
border: "1px solid rgba(255,255,255,0.14)",
textAlign: "center",
boxShadow:
"0 0 28px rgba(255,255,255,0.09), inset 0 1px 0 rgba(255,255,255,0.06)",
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
background: "linear-gradient(180deg,#ffffff,#e9edf5)",
color: "#05070d",
fontWeight: 950,
fontSize: 15,
boxShadow: "0 0 26px rgba(255,255,255,0.28)",
};
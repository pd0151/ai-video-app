"use client";
import { useState } from "react";

export default function Home() {
const [business, setBusiness] = useState("");
const [product, setProduct] = useState("");
const [offer, setOffer] = useState("");
const [customer, setCustomer] = useState("");
const [platform, setPlatform] = useState("Instagram");
const [tone, setTone] = useState("Bold");
const [result, setResult] = useState("");

async function generateAd() {
const prompt = `
Create a business ad for:
Business: ${business}
Product: ${product}
Offer: ${offer}
Customer: ${customer}
Platform: ${platform}
Tone: ${tone}

Return exactly in this format:

CAPTIONS
---
VIDEO IDEAS
---
REEL SCRIPT
---
SHOT LIST
---
CALL TO ACTION
`;

const res = await fetch("/api/generate", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ prompt }),
});

const data = await res.json();
setResult(data.result || data.text || data.output || "");
}

function section(title: string, start: string, end: string | null) {
if (!result.includes(start)) return null;

let content = result.split(start)[1];
if (end && content.includes(end)) {
content = content.split(end)[0];
}

return (
<div style={card}>
<h3 style={{ marginTop: 0 }}>{title}</h3>
<pre style={text}>{content.trim()}</pre>
</div>
);
}

return (
<main style={container}>
<div style={wrapper}>
<h1 style={title}>Business Ad Creator AI 🚀</h1>
<p style={subtitle}>
Create captions, video ideas, scripts, and ad plans in seconds 🔥
</p>

<input
placeholder="Business name"
value={business}
onChange={(e) => setBusiness(e.target.value)}
style={input}
/>

<textarea
placeholder="What do you sell?"
value={product}
onChange={(e) => setProduct(e.target.value)}
style={{ ...input, minHeight: "100px", resize: "vertical" }}
/>

<input
placeholder="Special offer"
value={offer}
onChange={(e) => setOffer(e.target.value)}
style={input}
/>

<input
placeholder="Target customer"
value={customer}
onChange={(e) => setCustomer(e.target.value)}
style={input}
/>

<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
<select value={platform} onChange={(e) => setPlatform(e.target.value)} style={input}>
<option>Instagram</option>
<option>TikTok</option>
<option>Facebook</option>
<option>YouTube Shorts</option>
</select>

<select value={tone} onChange={(e) => setTone(e.target.value)} style={input}>
<option>Bold</option>
<option>Luxury</option>
<option>Friendly</option>
<option>Urgent</option>
<option>Professional</option>
</select>
</div>

<button onClick={generateAd} style={button}>
Generate Business Ad
</button>

{result && (
<div style={{ marginTop: "24px" }}>
{section("📦 Captions", "CAPTIONS", "---")}

<div style={card}>
<h3 style={{ marginTop: 0 }}>🎥 Example Ad Video</h3>
<video
controls
style={{ width: "100%", borderRadius: "12px" }}
src="https://www.w3schools.com/html/mov_bbb.mp4"
/>
<p style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
Example preview of how your ad could look
</p>
</div>

{section("🎬 Video Ideas", "VIDEO IDEAS", "---")}
{section("🎥 Reel Script", "REEL SCRIPT", "---")}
{section("🎯 Shot List", "SHOT LIST", "---")}
{section("🚀 Call To Action", "CALL TO ACTION", null)}
</div>
)}
</div>
</main>
);
}

const container: React.CSSProperties = {
minHeight: "100vh",
background: "#eef2ff",
padding: "24px",
fontFamily: "Arial, sans-serif",
};

const wrapper: React.CSSProperties = {
maxWidth: "900px",
margin: "40px auto",
background: "white",
borderRadius: "24px",
padding: "32px",
boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
};

const title: React.CSSProperties = {
fontSize: "48px",
fontWeight: "bold",
marginBottom: "10px",
color: "#111827",
};

const subtitle: React.CSSProperties = {
fontSize: "20px",
color: "#4b5563",
marginBottom: "24px",
};

const input: React.CSSProperties = {
width: "100%",
padding: "16px",
fontSize: "17px",
border: "1px solid #d1d5db",
borderRadius: "14px",
boxSizing: "border-box",
marginBottom: "14px",
};

const button: React.CSSProperties = {
width: "100%",
padding: "18px",
background: "#111827",
color: "white",
border: "none",
borderRadius: "16px",
fontSize: "22px",
fontWeight: "bold",
cursor: "pointer",
};

const card: React.CSSProperties = {
background: "#f9fafb",
padding: "18px",
borderRadius: "16px",
marginBottom: "16px",
border: "1px solid #e5e7eb",
};

const text: React.CSSProperties = {
whiteSpace: "pre-wrap",
lineHeight: 1.7,
fontSize: "16px",
};
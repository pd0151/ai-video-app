"use client";

import { useState } from "react";

export default function Home() {
const [businessName, setBusinessName] = useState("");
const [product, setProduct] = useState("");
const [offer, setOffer] = useState("");
const [customer, setCustomer] = useState("");
const [platform, setPlatform] = useState("Instagram");
const [tone, setTone] = useState("Bold");
const [result, setResult] = useState("");
const [loading, setLoading] = useState(false);

const generateContent = async () => {
if (!businessName.trim() || !product.trim()) return;

setLoading(true);
setResult("");

const fullPrompt = `You are an expert direct-response marketer and social media ad creator.

Create ad content for this business:

Business name: ${businessName}
What they sell: ${product}
Special offer: ${offer || "No special offer provided"}
Target customer: ${customer || "General audience"}
Platform: ${platform}
Tone: ${tone}

Generate:

1. 3 high-converting ad captions
2. 3 short video ad ideas
3. 1 short reel ad script
4. 1 shot list for filming the ad
5. 1 strong call to action

Use this format exactly. Do NOT use bold, stars, or markdown formatting:

CAPTIONS
1.
2.
3.

VIDEO IDEAS
1.
2.
3.

REEL SCRIPT
Hook:
Scene 1:
Scene 2:
Scene 3:
Ending:

SHOT LIST
1.
2.
3.
4.
5.

CALL TO ACTIONs
`;

try {
const res = await fetch("/api/generate", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ prompt: fullPrompt }),
});

const data = await res.json();
setResult(data.result || data.text || data.output || "No result returned.");
} catch (error) {
setResult("Something went wrong. Please try again.");
}

setLoading(false);
};

return (
<main style={mainStyle}>
<div style={containerStyle}>
<h1 style={titleStyle}>Business Ad Creator AI 🚀</h1>
<p style={subtitleStyle}>
Create captions, video ideas, scripts, and ad plans in seconds 🔥
</p>

<div style={{ display: "grid", gap: "14px", marginBottom: "20px" }}>
<input
placeholder="Business name"
value={businessName}
onChange={(e) => setBusinessName(e.target.value)}
style={inputStyle}
/>

<textarea
placeholder="What do you sell?"
value={product}
onChange={(e) => setProduct(e.target.value)}
style={{ ...inputStyle, minHeight: "90px" }}
/>

<input
placeholder="Special offer (optional)"
value={offer}
onChange={(e) => setOffer(e.target.value)}
style={inputStyle}
/>

<input
placeholder="Target customer (optional)"
value={customer}
onChange={(e) => setCustomer(e.target.value)}
style={inputStyle}
/>

<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
<select value={platform} onChange={(e) => setPlatform(e.target.value)} style={inputStyle}>
<option>Instagram</option>
<option>TikTok</option>
<option>Facebook</option>
<option>YouTube Shorts</option>
</select>

<select value={tone} onChange={(e) => setTone(e.target.value)} style={inputStyle}>
<option>Bold</option>
<option>Luxury</option>
<option>Friendly</option>
<option>Urgent</option>
<option>Professional</option>
</select>
</div>
</div>

<button onClick={generateContent} disabled={loading} style={buttonStyle}>
{loading ? "Generating..." : "Generate Business Ad"}
</button>

{result && (
<div style={{ marginTop: "24px" }}>
{renderSection(result, "CAPTIONS", "VIDEO IDEAS", "📦 Captions")}
{renderSection(result, "VIDEO IDEAS", "REEL SCRIPT", "🎬 Video Ideas")}
{renderSection(result, "REEL SCRIPT", "SHOT LIST", "🎥 Reel Script")}
{renderSection(result, "SHOT LIST", "CALL TO ACTION", "🎯 Shot List")}
{renderSection(result, "CALL TO ACTION", null, "🚀 Call To Action")}
</div>
)}
</div>
</main>
);
}

/* ---------- SECTION RENDER FUNCTION ---------- */

 {function renderSection(text: string, start: string, end: string | null, title: string) {
const cleanText = text.replace(/\*\*/g, "");

if (!cleanText.includes(start)) return null;

let content = cleanText.split(start)[1];

if (end && content.includes(end)) {
content = content.split(end)[0];
}

const finalText = content.trim();

return (
<div style={cardStyle}>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
<h3 style={{ marginBottom: "10px" }}>{title}</h3>

<button
onClick={() => navigator.clipboard.writeText(finalText)}
style={{
padding: "6px 10px",
fontSize: "12px",
borderRadius: "8px",
border: "1px solid #ddd",
cursor: "pointer",
background: "white",
}}
>
Copy
</button>
</div>

<pre style={textStyle}>{finalText}</pre>
</div>
);
}
// 🔥 remove ** automatically
const cleanText = text.replace(/\*\*/g, "");

if (!cleanText.includes(start)) return null;

let content = cleanText.split(start)[1];

if (end && content.includes(end)) {
content = content.split(end)[0];
}

return (
<div style={cardStyle}>
<h3 style={{ marginBottom: "10px" }}>{title}</h3>
<pre style={textStyle}>{content.trim()}</pre>
</div>
);
} {
if (!text.includes(start)) return null;

let content = text.split(start)[1];
if (end && content.includes(end)) {
content = content.split(end)[0];
}

return (
<div style={cardStyle}>
<h3 style={{ marginBottom: "10px" }}>{title}</h3>
<pre style={textStyle}>{content.trim()}</pre>
</div>
);
}

/* ---------- STYLES ---------- */

const mainStyle: React.CSSProperties = {
minHeight: "100vh",
background: "#eef2ff",
padding: "24px",
fontFamily: "Arial",
};

const containerStyle: React.CSSProperties = {
maxWidth: "900px",
margin: "40px auto",
background: "white",
borderRadius: "20px",
padding: "30px",
boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
};

const titleStyle: React.CSSProperties = {
fontSize: "42px",
fontWeight: "bold",
marginBottom: "10px",
};

const subtitleStyle: React.CSSProperties = {
fontSize: "18px",
marginBottom: "20px",
color: "#555",
};

const inputStyle: React.CSSProperties = {
padding: "14px",
fontSize: "16px",
borderRadius: "10px",
border: "1px solid #ddd",
};

const buttonStyle: React.CSSProperties = {
width: "100%",
padding: "16px",
background: "#111827",
color: "white",
border: "none",
borderRadius: "12px",
fontSize: "18px",
fontWeight: "bold",
cursor: "pointer",
};

const cardStyle: React.CSSProperties = {
background: "#f9fafb",
padding: "16px",
borderRadius: "14px",
marginBottom: "14px",
border: "1px solid #e5e7eb",
};

const textStyle: React.CSSProperties = {
whiteSpace: "pre-wrap",
lineHeight: 1.6,
fontSize: "15px",
};
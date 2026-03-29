"use client";

import { useState } from "react";

export default function FeedPage() {
const [prompt, setPrompt] = useState("");
const [image, setImage] = useState<string | null>(null);
const [loading, setLoading] = useState(false);

function generateAd() {
setLoading(true);

const text = prompt || "AdForge Test";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800">
<rect width="100%" height="100%" fill="#0f172a"/>
<text x="50%" y="40%" text-anchor="middle" fill="white" font-size="40">
AdForge
</text>
<text x="50%" y="55%" text-anchor="middle" fill="#38bdf8" font-size="24">
${text}
</text>
</svg>
`;

const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

setTimeout(() => {
setImage(dataUrl);
setLoading(false);
}, 500);
}

return (
<main
style={{
minHeight: "100vh",
padding: "40px",
background: "linear-gradient(to bottom, #1e293b, #0f172a)",
color: "white",
}}
>
<h1 style={{ fontSize: "28px", fontWeight: "bold" }}>Ad Feed</h1>

<div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
<input
type="text"
placeholder="Describe your ad..."
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
style={{
padding: "12px",
borderRadius: "8px",
width: "300px",
border: "none",
}}
/>

<button
onClick={generateAd}
disabled={loading}
style={{
padding: "12px 16px",
borderRadius: "8px",
border: "none",
cursor: "pointer",
}}
>
{loading ? "Generating..." : "Generate Ad"}
</button>
</div>

{image && (
<div style={{ marginTop: "30px" }}>
<img
src={image}
alt="Generated ad"
style={{ width: "320px", borderRadius: "12px" }}
/>
</div>
)}
</main>
);
}
"use client";

import { useState } from "react";

export default function FeedPage() {
const [prompt, setPrompt] = useState("");
const [image, setImage] = useState<string | null>(null);
const [loading, setLoading] = useState(false);

async function generateAd() {
setLoading(true);

try {
const res = await fetch("/api/generate-image", {
method: "POST",
});

const data = await res.json();

console.log("RESPONSE:", data);

if (!data.image) {
alert("No image returned");
return;
}

setImage(data.image);
} catch (err) {
console.error(err);
alert("Error generating image");
} finally {
setLoading(false);
}
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
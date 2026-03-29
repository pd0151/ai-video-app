"use client";

import { useState } from "react";

export default function FeedPage() {
const [prompt, setPrompt] = useState("");
const [image, setImage] = useState<string | null>(null);
const [loading, setLoading] = useState(false);

async function generateAd() {
if (!prompt) return;

setLoading(true);

try {
const res = await fetch("/api/generate-image", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ prompt }),
});

const data = await res.json();
setImage(data.image || null);
} catch (error) {
console.error(error);
alert("Failed to generate ad");
} finally {
setLoading(false);
}
}

return (
<main
style={{
minHeight: "100vh",
background: "#0f172a",
color: "white",
padding: "30px",
fontFamily: "Arial",
}}
>
<h1>Ad Feed</h1>

<div style={{ marginTop: "20px" }}>
<input
placeholder="Describe your ad..."
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
style={{
padding: "12px",
width: "320px",
marginRight: "10px",
borderRadius: "8px",
border: "none",
}}
/>

<button
onClick={generateAd}
style={{
padding: "12px 18px",
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

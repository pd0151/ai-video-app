"use client";

import { useState } from "react";

export default function FeedPage() {
const [prompt, setPrompt] = useState("");
const [image, setImage] = useState<string | null>(null);
const [loading, setLoading] = useState(false);

async function generateAd() {
if (!prompt.trim()) {
alert("Type something first");
return;
}

setLoading(true);
setImage(null);

try {
const res = await fetch("/api/generate-image", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ prompt }),
});

const data = await res.json();

if (!res.ok) {
alert(data.error);
return;
}

setImage(data.image);
} catch (err) {
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
<h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
Ad Feed
</h1>

<div style={{ display: "flex", gap: "10px" }}>
<input
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Describe your ad..."
style={{
padding: "12px",
borderRadius: "8px",
width: "400px",
border: "none",
}}
/>

<button
onClick={generateAd}
disabled={loading}
style={{
padding: "12px",
borderRadius: "8px",
border: "none",
}}
>
{loading ? "Generating..." : "Generate Ad"}
</button>
</div>

{image && (
<div style={{ marginTop: "30px" }}>
<img
src={image}
alt="Generated"
style={{
width: "400px",
borderRadius: "12px",
border: "2px solid white",
}}
/>
</div>
)}
</main>
);
}
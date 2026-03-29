"use client";

import { useState } from "react";

export default function FeedPage() {
const [prompt, setPrompt] = useState("");
const [image, setImage] = useState<string | null>(null);
const [loading, setLoading] = useState(false);

async function generateAd() {
if (!prompt) return;

setLoading(true);

const res = await fetch("/api/generate-image", {
method: "POST",
body: JSON.stringify({ prompt }),
});

const data = await res.json();
setImage(data.image);
setLoading(false);
}

return (
<main style={{ padding: "20px", color: "white" }}>
<h1>Ad Feed</h1>

<input
placeholder="Describe your ad..."
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
style={{
padding: "10px",
width: "300px",
marginRight: "10px",
}}
/>

<button onClick={generateAd}>
{loading ? "Generating..." : "Generate Ad"}
</button>

{image && (
<div style={{ marginTop: "20px" }}>
<img src={image} alt="Generated Ad" width="300" />
</div>
)}
</main>
);
}
"use client";

import { useState } from "react";

export default function FeedPage() {
const [prompt, setPrompt] = useState("");
const [image, setImage] = useState("");
const [loading, setLoading] = useState(false);
const [likes, setLikes] = useState(0);

const generateImage = async () => {
if (!prompt) return;
setLoading(true);

const res = await fetch("/api/generate-image", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ prompt }),
});

const data = await res.json();
setImage(data.image);
setLikes(0);
setLoading(false);
};

return (
<div style={{ padding: 20, background: "#0f172a", minHeight: "100vh", color: "white" }}>
<h1 style={{ fontSize: 28 }}>AdForge</h1>

<div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
<input
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Create an ad..."
style={{ flex: 1, padding: 10 }}
/>
<button onClick={generateImage}>
{loading ? "Generating..." : "Generate"}
</button>
</div>

{image && (
<div style={{ background: "#111", padding: 10 }}>
<img src={image} style={{ width: "100%" }} />

<h3>{prompt}</h3>

<button onClick={() => setLikes(likes + 1)}>
❤️ {likes}
</button>
</div>
)}
</div>
);
}
"use client";

import { useState } from "react";

export default function FeedPage() {
const [prompt, setPrompt] = useState("");
const [image, setImage] = useState("");
const [loading, setLoading] = useState(false);

const generateImage = async () => {
if (!prompt) return;

setLoading(true);

try {
const res = await fetch("/api/generate-image", {
method: "POST",
body: JSON.stringify({ prompt }),
});

const data = await res.json();

console.log("RESPONSE:", data); // 👈 helps debug

if (data.image) {
setImage(data.image);
} else {
alert("No image returned");
}
} catch (err) {
console.error(err);
alert("Error generating image");
}

setLoading(false);
};

return (
<div style={{ padding: 20 }}>
<h1>AdForge</h1>

<input
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Enter your ad idea..."
style={{ width: "70%", padding: 10 }}
/>

<button onClick={generateImage} style={{ padding: 10 }}>
{loading ? "Generating..." : "Generate"}
</button>

{image && (
<div style={{ marginTop: 20 }}>
<img src={image} alt="Generated" style={{ width: 400 }} />
</div>
)}
</div>
);
}
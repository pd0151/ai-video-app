"use client";
import { useState } from "react";

export default function FeedPage() {
const [prompt, setPrompt] = useState("");
const [image, setImage] = useState("");
const [loading, setLoading] = useState(false);

const generateAd = async () => {
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

if (data.image) {
setImage(data.image);
}
} catch (err) {
console.error(err);
}

setLoading(false);
};

return (
<div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">

<input
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Create an ad..."
className="p-3 rounded-lg bg-white/10 w-full max-w-md mb-4"
/>

<button
onClick={generateAd}
className="bg-blue-600 p-3 rounded-lg mb-4"
>
Generate
</button>

{loading && <p>Generating...</p>}

{image && (
<img src={image} className="rounded-lg max-w-md" />
)}
</div>
);
}
"use client";
import { useState } from "react";

export default function FeedPage() {
const [prompt, setPrompt] = useState("");
const [brand, setBrand] = useState("");
const [cta, setCta] = useState("");
const [image, setImage] = useState("");
const [loading, setLoading] = useState(false);

const generateAd = async () => {
if (!prompt) return;

setLoading(true);

try {
const res = await fetch("/api/generate-image", {
method: "POST",
body: JSON.stringify({ prompt }),
});

const data = await res.json();
setImage(data.image);
} catch (err) {
console.error(err);
}

setLoading(false);
};

return (
<div className="min-h-screen bg-black text-white p-4 flex flex-col items-center">

{/* INPUT SECTION */}
<div className="w-full max-w-md flex flex-col gap-3 mb-6">
<input
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Describe your ad (e.g. luxury black watch)"
className="p-3 rounded-lg bg-white/10"
/>

<input
value={brand}
onChange={(e) => setBrand(e.target.value)}
placeholder="Brand name (e.g. ONTREK)"
className="p-3 rounded-lg bg-white/10"
/>

<input
value={cta}
onChange={(e) => setCta(e.target.value)}
placeholder="Call to action (e.g. Shop now)"
className="p-3 rounded-lg bg-white/10"
/>

<button
onClick={generateAd}
className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg"
>
Generate Ad
</button>
</div>

{/* LOADING */}
{loading && (
<div className="text-center text-gray-300">
Generating premium ad...
</div>
)}

{/* RESULT */}
{image && !loading && (
<div className="w-full max-w-md bg-white/5 p-4 rounded-xl">
<img src={image} className="rounded-lg mb-3" />

<h2 className="text-xl font-bold">
{brand || "Ad Campaign"}
</h2>

<p className="text-gray-300">{prompt}</p>

<p className="text-blue-400 font-semibold mt-2">
{cta}
</p>
</div>
)}
</div>
);
}
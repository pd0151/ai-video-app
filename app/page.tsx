"use client";

import { useState } from "react";

export default function Home() {
const [prompt, setPrompt] = useState("");
const [image, setImage] = useState("");
const [loading, setLoading] = useState(false);

const handleGenerate = async () => {
if (!prompt) return;

setLoading(true);
setImage("");

try {
const res = await fetch("/api/generate-image", {
method: "POST",
body: JSON.stringify({ prompt }),
});

const data = await res.json();

if (data.image) {
setImage(data.image);
} else {
alert("Failed to generate image");
}
} catch (err) {
console.error(err);
alert("Something went wrong");
}

setLoading(false);
};

return (
<main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
<div className="max-w-xl w-full bg-white p-6 rounded-2xl shadow-lg space-y-4">

<h1 className="text-2xl font-bold text-center">
AI Image Generator
</h1>

<input
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Describe your image..."
className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
/>

<button
onClick={handleGenerate}
className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-all"
>
{loading ? "Generating..." : "Generate Image"}
</button>

{image && (
<img
src={image}
alt="Generated"
className="mt-4 rounded-xl shadow-md"
/>
)}
</div>
</main>
);
}
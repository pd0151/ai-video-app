"use client";

import { useEffect, useState } from "react";

type SavedAd = {
id: number;
prompt: string;
image: string;
};

export default function FeedPage() {
const [prompt, setPrompt] = useState("");
const [image, setImage] = useState<string | null>(null);
const [loading, setLoading] = useState(false);
const [savedAds, setSavedAds] = useState<SavedAd[]>([]);

useEffect(() => {
const stored = localStorage.getItem("ads");

if (stored) {
try {
const ads: SavedAd[] = JSON.parse(stored);
setSavedAds(ads);

if (ads.length > 0) {
setImage(ads[0].image);
}
} catch {
setSavedAds([]);
setImage(null);
}
}
}, []);

function saveAds(ads: SavedAd[]) {
setSavedAds(ads);
localStorage.setItem("ads", JSON.stringify(ads));
}

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
alert(data.error || "Failed to generate");
return;
}

if (!data.image) {
alert("No image returned");
return;
}

setImage(data.image);

const newAd: SavedAd = {
id: Date.now(),
prompt,
image: data.image,
};

const nextAds = [newAd, ...savedAds];
saveAds(nextAds);
} catch (err) {
alert("Error generating ad");
} finally {
setLoading(false);
}
}

function downloadImage(src: string) {
const a = document.createElement("a");
a.href = src;
a.download = "ad.png";
a.click();
}

function clearAds() {
localStorage.removeItem("ads");
setSavedAds([]);
setImage(null);
}

return (
<main
style={{
minHeight: "100vh",
padding: "40px",
background: "linear-gradient(#1e293b, #0f172a)",
color: "white",
fontFamily: "Arial",
}}
>
<h1 style={{ fontSize: "40px", marginBottom: "20px" }}>Ad Feed</h1>

<div
style={{
display: "flex",
gap: "10px",
marginBottom: "20px",
flexWrap: "wrap",
}}
>
<input
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Describe your ad..."
style={{
padding: "12px",
borderRadius: "10px",
width: "400px",
border: "none",
fontSize: "16px",
}}
/>

<button
onClick={generateAd}
disabled={loading}
style={{
padding: "12px 20px",
borderRadius: "10px",
border: "none",
cursor: "pointer",
fontWeight: "bold",
}}
>
{loading ? "Generating..." : "Generate Ad"}
</button>

{savedAds.length > 0 && (
<button
onClick={clearAds}
style={{
padding: "12px 20px",
borderRadius: "10px",
border: "none",
cursor: "pointer",
fontWeight: "bold",
background: "#ef4444",
color: "white",
}}
>
Clear Ads
</button>
)}
</div>

{loading && <p style={{ marginBottom: "20px" }}>Generating image...</p>}

{image && (
<div style={{ marginBottom: "30px" }}>
<img
src={image}
alt="Generated ad"
style={{
width: "420px",
maxWidth: "100%",
borderRadius: "12px",
marginBottom: "10px",
border: "2px solid white",
display: "block",
}}
/>

<button
onClick={() => downloadImage(image)}
style={{
padding: "10px",
borderRadius: "8px",
border: "none",
cursor: "pointer",
fontWeight: "bold",
}}
>
Download
</button>
</div>
)}

<h2 style={{ marginBottom: "15px" }}>Previous Ads</h2>

{savedAds.length === 0 ? (
<p>No saved ads yet.</p>
) : (
<div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
{savedAds.map((ad) => (
<div key={ad.id} style={{ width: "200px" }}>
<img
src={ad.image}
alt={ad.prompt}
style={{
width: "200px",
borderRadius: "10px",
marginBottom: "8px",
border: "2px solid rgba(255,255,255,0.4)",
}}
/>
<p style={{ fontSize: "12px", marginBottom: "8px" }}>{ad.prompt}</p>
<button
onClick={() => setImage(ad.image)}
style={{
padding: "8px 10px",
borderRadius: "8px",
border: "none",
cursor: "pointer",
fontWeight: "bold",
}}
>
View
</button>
</div>
))}
</div>
)}
</main>
);
}
"use client";

import { useState } from "react";

export default function Home() {
const [prompt, setPrompt] = useState("");
const [videoUrl, setVideoUrl] = useState("");
const [loading, setLoading] = useState(false);

async function generateVideo() {
setLoading(true);
setVideoUrl("");

try {
const res = await fetch("/api/generate-video", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ prompt }),
});

if (!res.ok) {
const text = await res.text();
alert(text);
setLoading(false);
return;
}

const data = await res.json();

if (data.videoUrl) {
setVideoUrl(data.videoUrl);
} else {
alert("No video returned");
}
} catch (error: any) {
alert(error?.message || "Video generation failed");
}

setLoading(false);
}

return (
<main
style={{
minHeight: "100vh",
background: "#07152f",
color: "white",
padding: 20,
fontFamily: "Arial, sans-serif",
}}
>
<div style={{ maxWidth: 900, margin: "0 auto" }}>
<h1 style={{ fontSize: 56, fontWeight: 900, marginBottom: 10 }}>
AdForge
</h1>

<textarea
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Enter prompt..."
style={{
width: "100%",
minHeight: 120,
padding: 18,
fontSize: 28,
borderRadius: 20,
border: "none",
outline: "none",
resize: "vertical",
marginBottom: 20,
}}
/>

<div
style={{
display: "flex",
gap: 16,
flexWrap: "wrap",
marginBottom: 20,
}}
>
<button
onClick={generateVideo}
disabled={loading}
style={{
minWidth: 220,
padding: "18px 24px",
borderRadius: 20,
border: "none",
background: "white",
color: "#07152f",
fontSize: 22,
fontWeight: 800,
cursor: "pointer",
}}
>
{loading ? "Generating video..." : "Generate video"}
</button>

<button
onClick={() => {
setPrompt("");
setVideoUrl("");
}}
style={{
minWidth: 220,
padding: "18px 24px",
borderRadius: 20,
border: "none",
background: "#18376d",
color: "white",
fontSize: 22,
fontWeight: 800,
cursor: "pointer",
}}
>
Clear
</button>
</div>

<div
style={{
background: "#0b1d3f",
borderRadius: 24,
padding: 20,
minHeight: 320,
}}
>
{videoUrl ? (
<video
src={videoUrl}
controls
autoPlay
loop
style={{
width: "100%",
borderRadius: 18,
display: "block",
}}
/>
) : (
<div
style={{
minHeight: 280,
display: "flex",
alignItems: "center",
justifyContent: "center",
fontSize: 28,
fontWeight: 800,
opacity: 0.8,
textAlign: "center",
}}
>
Your video preview will appear here
</div>
)}
</div>
</div>
</main>
);
}
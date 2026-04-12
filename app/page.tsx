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

const text = await res.text();

if (!res.ok) {
alert(text);
setLoading(false);
return;
}

const data = JSON.parse(text);

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
<div style={{ maxWidth: 980, margin: "0 auto" }}>
<h1 style={{ fontSize: 72, fontWeight: 900, marginBottom: 20 }}>
AdForge
</h1>

<textarea
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Enter prompt..."
style={{
width: "100%",
minHeight: 140,
padding: 22,
fontSize: 28,
borderRadius: 24,
border: "none",
outline: "none",
resize: "vertical",
marginBottom: 20,
boxSizing: "border-box",
}}
/>

<div style={{ display: "flex", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
<button
onClick={generateVideo}
disabled={loading}
style={{
minWidth: 280,
padding: "20px 24px",
borderRadius: 24,
border: "none",
background: "white",
color: "#07152f",
fontSize: 24,
fontWeight: 900,
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
minWidth: 280,
padding: "20px 24px",
borderRadius: 24,
border: "none",
background: "#18376d",
color: "white",
fontSize: 24,
fontWeight: 900,
cursor: "pointer",
}}
>
Clear
</button>
</div>

<div
style={{
background: "#0b1d3f",
borderRadius: 28,
padding: 20,
minHeight: 420,
}}
>
{videoUrl ? (
<>
<video
key={videoUrl}
src={videoUrl}
controls
autoPlay
loop
muted
playsInline
preload="auto"
style={{
width: "100%",
height: "420px",
objectFit: "contain",
background: "black",
borderRadius: 18,
display: "block",
}}
/>
<div
style={{
marginTop: 12,
fontSize: 14,
opacity: 0.9,
wordBreak: "break-all",
background: "#061127",
padding: 12,
borderRadius: 12,
}}
>
{videoUrl}
</div>
</>
) : (
<div
style={{
minHeight: 380,
display: "flex",
alignItems: "center",
justifyContent: "center",
fontSize: 28,
fontWeight: 800,
opacity: 0.85,
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
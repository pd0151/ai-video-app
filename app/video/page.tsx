"use client";

import { useEffect, useRef, useState } from "react";

export default function VideoPage() {
const [prompt, setPrompt] = useState("");
const [videoUrl, setVideoUrl] = useState<string | null>(null);
const [status, setStatus] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const pollRef = useRef<NodeJS.Timeout | null>(null);

function stopPolling() {
if (pollRef.current) {
clearInterval(pollRef.current);
pollRef.current = null;
}
}

async function checkStatus(id: string) {
const res = await fetch(`/api/generate-video?id=${id}`);
const data = await res.json();

setStatus(data.status || "");

if (data.videoUrl) {
setVideoUrl(data.videoUrl);
setLoading(false);
stopPolling();
}

if (data.status === "failed" || data.status === "canceled") {
setError(data.error || "Video failed");
setLoading(false);
stopPolling();
}
}

async function generateVideo() {
if (!prompt.trim()) {
alert("Enter something");
return;
}

setLoading(true);
setVideoUrl(null);
setError("");
setStatus("starting");

const res = await fetch("/api/generate-video", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ prompt }),
});

const data = await res.json();

if (!res.ok) {
setError(data.error || "Failed to start video");
setLoading(false);
return;
}

const id = data.id;
setStatus(data.status || "processing");

await checkStatus(id);

pollRef.current = setInterval(() => {
checkStatus(id);
}, 4000);
}

useEffect(() => {
return () => stopPolling();
}, []);

return (
<main style={{ padding: 20, color: "white" }}>
<h1>AI Video Generator</h1>

<textarea
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Describe your video advert..."
style={{
width: "100%",
height: 120,
marginBottom: 10,
}}
/>

<button onClick={generateVideo}>
{loading ? "Generating..." : "Generate Video"}
</button>

{status && <p>Status: {status}</p>}

{error && <p style={{ color: "red" }}>{error}</p>}

{videoUrl && (
<video
src={videoUrl}
controls
autoPlay
style={{ width: "100%", marginTop: 20 }}
/>
)}
</main>
);
}
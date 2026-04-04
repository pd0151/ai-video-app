"use client";

import { useEffect, useRef, useState } from "react";

export default function VideoPage() {
const [prompt, setPrompt] = useState(
"A premium 24 hour mobile tyre fitting advert, a clean branded van parked at a suburban roadside, a tyre technician kneels by a car changing a wheel, cinematic lighting, smooth camera motion, bold advertising feel, realistic, high quality"
);
const [predictionId, setPredictionId] = useState<string | null>(null);
const [status, setStatus] = useState<string>("");
const [videoUrl, setVideoUrl] = useState<string | null>(null);
const [error, setError] = useState<string>("");
const [starting, setStarting] = useState(false);

const pollRef = useRef<NodeJS.Timeout | null>(null);

const clearPoll = () => {
if (pollRef.current) {
clearInterval(pollRef.current);
pollRef.current = null;
}
};

const checkStatus = async (id: string) => {
try {
const res = await fetch(`/api/generate-video?id=${id}`);
const data = await res.json();

if (!res.ok) {
setError(data?.error || "Failed to check status");
clearPoll();
return;
}

setStatus(data.status || "");

if (data.status === "succeeded") {
setVideoUrl(data.videoUrl || null);
clearPoll();
}

if (data.status === "failed" || data.status === "canceled") {
setError(data?.error || "Video generation failed");
clearPoll();
}
} catch (err) {
console.error(err);
setError("Status check failed");
clearPoll();
}
};

const handleGenerate = async () => {
try {
clearPoll();
setStarting(true);
setError("");
setPredictionId(null);
setVideoUrl(null);
setStatus("");

const res = await fetch("/api/generate-video", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ prompt }),
});

const data = await res.json();

if (!res.ok) {
setError(data?.error || "Failed to start video generation");
setStarting(false);
return;
}

const id = data.id;
setPredictionId(id);
setStatus(data.status || "starting");
setStarting(false);

await checkStatus(id);

pollRef.current = setInterval(() => {
checkStatus(id);
}, 4000);
} catch (err) {
console.error(err);
setError("Video generation failed");
setStarting(false);
}
};

useEffect(() => {
return () => clearPoll();
}, []);

return (
<main style={styles.page}>
<div style={styles.wrap}>
<h1 style={styles.title}>AI Video Generator</h1>

<textarea
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
style={styles.textarea}
placeholder="Describe the ad video..."
/>

<button onClick={handleGenerate} style={styles.button}>
{starting ? "Starting..." : "Generate Video"}
</button>

{predictionId ? (
<div style={styles.info}>Prediction: {predictionId}</div>
) : null}

{status ? <div style={styles.info}>Status: {status}</div> : null}

{error ? <div style={styles.error}>{error}</div> : null}

{videoUrl ? (
<div style={styles.videoWrap}>
<video
src={videoUrl}
controls
autoPlay
loop
playsInline
style={styles.video}
/>
</div>
) : (
<div style={styles.placeholder}>Your video will appear here</div>
)}
</div>
</main>
);
}

const styles: Record<string, React.CSSProperties> = {
page: {
minHeight: "100vh",
background: "linear-gradient(180deg, #16234a 0%, #0f1730 100%)",
padding: "24px",
boxSizing: "border-box",
color: "white",
},
wrap: {
maxWidth: "900px",
margin: "0 auto",
},
title: {
fontSize: "32px",
fontWeight: 800,
marginBottom: "18px",
},
textarea: {
width: "100%",
minHeight: "140px",
borderRadius: "16px",
border: "none",
padding: "16px",
fontSize: "16px",
boxSizing: "border-box",
marginBottom: "14px",
},
button: {
height: "52px",
borderRadius: "16px",
border: "none",
padding: "0 20px",
background: "#4da3ff",
color: "white",
fontWeight: 800,
fontSize: "15px",
cursor: "pointer",
marginBottom: "16px",
},
info: {
marginBottom: "10px",
fontSize: "14px",
},
error: {
marginBottom: "14px",
background: "rgba(255,0,0,0.18)",
color: "#ffdada",
padding: "12px 14px",
borderRadius: "12px",
},
placeholder: {
height: "420px",
borderRadius: "20px",
background: "rgba(255,255,255,0.06)",
display: "flex",
alignItems: "center",
justifyContent: "center",
color: "rgba(255,255,255,0.75)",
},
videoWrap: {
marginTop: "10px",
},
video: {
width: "100%",
maxWidth: "420px",
borderRadius: "20px",
display: "block",
background: "black",
},
};
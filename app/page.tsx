"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
const [prompt, setPrompt] = useState("");
const [imageUrl, setImageUrl] = useState("");
const [videoUrl, setVideoUrl] = useState("");
const [uploadUrl, setUploadUrl] = useState("");
const [uploadType, setUploadType] = useState<"image" | "video" | "">("");
const [loadingImage, setLoadingImage] = useState(false);
const [loadingVideo, setLoadingVideo] = useState(false);
const [posting, setPosting] = useState(false);

const activeType = useMemo(() => {
if (uploadUrl && uploadType === "video") return "video";
if (uploadUrl && uploadType === "image") return "image";
if (videoUrl) return "video";
if (imageUrl) return "image";
return "";
}, [uploadUrl, uploadType, videoUrl, imageUrl]);

const activeUrl = useMemo(() => {
if (uploadUrl) return uploadUrl;
if (videoUrl) return videoUrl;
if (imageUrl) return imageUrl;
return "";
}, [uploadUrl, videoUrl, imageUrl]);

const generateImage = async () => {
if (!prompt.trim()) {
alert("Type a prompt first");
return;
}

setLoadingImage(true);

try {
const res = await fetch("/api/generate-image", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ prompt }),
});

const data = await res.json();

if (!res.ok) {
throw new Error(data.error || "Failed to generate image");
}

if (!data.image) {
throw new Error("No image returned");
}

setImageUrl(data.image);
setVideoUrl("");
setUploadUrl("");
setUploadType("");
} catch (error: any) {
alert(error.message || "Error generating image");
} finally {
setLoadingImage(false);
}
};

const generateVideo = async () => {
if (!prompt.trim()) {
alert("Type a prompt first");
return;
}

setLoadingVideo(true);

try {
const res = await fetch("/api/generate-video", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ prompt }),
});

const data = await res.json();

if (!res.ok) {
throw new Error(data.error || "Failed to generate video");
}

const returnedUrl = data.video || data.url || "";

if (!returnedUrl) {
throw new Error("No video returned");
}

setVideoUrl(returnedUrl);
setImageUrl("");
setUploadUrl("");
setUploadType("");
} catch (error: any) {
alert(error.message || "Error generating video");
} finally {
setLoadingVideo(false);
}
};

const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
const file = e.target.files?.[0];
if (!file) return;

const objectUrl = URL.createObjectURL(file);
setUploadUrl(objectUrl);
setUploadType("image");
setImageUrl("");
setVideoUrl("");
};

const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
const file = e.target.files?.[0];
if (!file) return;

const objectUrl = URL.createObjectURL(file);
setUploadUrl(objectUrl);
setUploadType("video");
setImageUrl("");
setVideoUrl("");
};

const clearAll = () => {
setImageUrl("");
setVideoUrl("");
setUploadUrl("");
setUploadType("");
};

const postToFeed = async () => {
if (!activeUrl) {
alert("No image or video to post");
return;
}

setPosting(true);

try {
const isVideo = activeType === "video";

const { error } = await supabase.from("Posts").insert([
{
caption: prompt || "AI post",
image_url: isVideo ? null : activeUrl,
video_url: isVideo ? activeUrl : null,
likes: 0,
},
]);

if (error) {
throw error;
}

alert("Posted!");
} catch (error: any) {
alert(error.message || "Failed to post");
} finally {
setPosting(false);
}
};

return (
<main style={styles.page}>
<div style={styles.header}>
<div>
<h1 style={styles.title}>AI Image & Video Generator</h1>
<p style={styles.subtitle}>
Create AI ads, upload your own media, then post straight to your feed
</p>
</div>

<a href="/feed" style={styles.feedButton}>
Open Feed
</a>
</div>

<div style={styles.panel}>
<input
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Describe your ad..."
style={styles.input}
/>

<div style={styles.buttonRow}>
<button onClick={generateImage} style={styles.whiteButton}>
{loadingImage ? "Generating Image..." : "Generate Image"}
</button>

<button onClick={generateVideo} style={styles.blueButton}>
{loadingVideo ? "Generating Video..." : "Generate Video"}
</button>

<button onClick={postToFeed} style={styles.blueButton}>
{posting ? "Posting..." : "Post to Feed"}
</button>
</div>

<div style={{ marginBottom: 18 }}>
<button onClick={clearAll} style={styles.darkButton}>
Clear
</button>
</div>

<div style={styles.uploadGrid}>
<label style={styles.uploadCard}>
<span style={styles.uploadTitle}>Upload your own image</span>
<span style={styles.uploadText}>JPG, PNG, WEBP</span>
<input
type="file"
accept="image/*"
onChange={handleImageUpload}
style={styles.hiddenInput}
/>
</label>

<label style={styles.uploadCard}>
<span style={styles.uploadTitle}>Upload your own video</span>
<span style={styles.uploadText}>MP4, MOV, WEBM</span>
<input
type="file"
accept="video/*"
onChange={handleVideoUpload}
style={styles.hiddenInput}
/>
</label>
</div>
</div>

<div style={styles.previewWrap}>
{activeType === "image" && activeUrl ? (
<img src={activeUrl} alt="Preview" style={styles.media} />
) : null}

{activeType === "video" && activeUrl ? (
<video
key={activeUrl}
src={activeUrl}
controls
autoPlay
muted
playsInline
style={styles.media}
/>
) : null}

{!activeType ? (
<div style={styles.emptyBox}>
<div style={styles.emptyTitle}>Your preview will show here</div>
<div style={styles.emptyText}>
Generate an image, generate a video, or upload your own file
</div>
</div>
) : null}
</div>
</main>
);
}

const styles: Record<string, React.CSSProperties> = {
page: {
minHeight: "100vh",
padding: "28px",
background: "linear-gradient(180deg, #0f172a 0%, #1d4ed8 100%)",
color: "white",
},
header: {
display: "flex",
justifyContent: "space-between",
alignItems: "flex-start",
gap: "16px",
marginBottom: "24px",
flexWrap: "wrap",
},
title: {
fontSize: "64px",
lineHeight: 1,
fontWeight: 900,
margin: 0,
},
subtitle: {
marginTop: "10px",
marginBottom: 0,
fontSize: "18px",
color: "rgba(255,255,255,0.82)",
},
feedButton: {
textDecoration: "none",
color: "white",
background: "rgba(255,255,255,0.12)",
border: "1px solid rgba(255,255,255,0.22)",
padding: "14px 18px",
borderRadius: "16px",
fontWeight: 800,
},
panel: {
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.12)",
borderRadius: "28px",
padding: "20px",
marginBottom: "24px",
backdropFilter: "blur(8px)",
},
input: {
width: "100%",
padding: "18px 20px",
borderRadius: "18px",
border: "none",
outline: "none",
fontSize: "20px",
marginBottom: "16px",
},
buttonRow: {
display: "flex",
gap: "12px",
flexWrap: "wrap",
marginBottom: "18px",
},
whiteButton: {
border: "none",
borderRadius: "18px",
padding: "16px 22px",
fontSize: "18px",
fontWeight: 800,
background: "white",
color: "#111827",
cursor: "pointer",
},
blueButton: {
border: "1px solid rgba(255,255,255,0.25)",
borderRadius: "18px",
padding: "16px 22px",
fontSize: "18px",
fontWeight: 800,
background: "rgba(255,255,255,0.12)",
color: "white",
cursor: "pointer",
},
darkButton: {
border: "1px solid rgba(255,255,255,0.18)",
borderRadius: "18px",
padding: "16px 22px",
fontSize: "18px",
fontWeight: 800,
background: "rgba(0,0,0,0.18)",
color: "white",
cursor: "pointer",
},
uploadGrid: {
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
gap: "14px",
},
uploadCard: {
background: "rgba(255,255,255,0.08)",
border: "1px dashed rgba(255,255,255,0.25)",
borderRadius: "22px",
padding: "18px",
cursor: "pointer",
display: "flex",
flexDirection: "column",
gap: "8px",
},
uploadTitle: {
fontSize: "20px",
fontWeight: 800,
},
uploadText: {
fontSize: "15px",
color: "rgba(255,255,255,0.78)",
},
hiddenInput: {
display: "none",
},
previewWrap: {
width: "100%",
maxWidth: "860px",
margin: "0 auto",
},
media: {
width: "100%",
display: "block",
borderRadius: "28px",
background: "#0b1220",
boxShadow: "0 14px 40px rgba(0,0,0,0.25)",
},
emptyBox: {
width: "100%",
minHeight: "460px",
borderRadius: "28px",
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.12)",
display: "flex",
flexDirection: "column",
alignItems: "center",
justifyContent: "center",
textAlign: "center",
padding: "20px",
},
emptyTitle: {
fontSize: "28px",
fontWeight: 900,
marginBottom: "8px",
},
emptyText: {
fontSize: "18px",
color: "rgba(255,255,255,0.78)",
},
};
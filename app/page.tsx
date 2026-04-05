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

const [uploadedImage, setUploadedImage] = useState("");
const [uploadedVideo, setUploadedVideo] = useState("");

const [loadingImage, setLoadingImage] = useState(false);
const [loadingVideo, setLoadingVideo] = useState(false);
const [posting, setPosting] = useState(false);

const activePreviewType = useMemo(() => {
if (uploadedVideo) return "uploaded-video";
if (videoUrl) return "ai-video";
if (uploadedImage) return "uploaded-image";
if (imageUrl) return "ai-image";
return "none";
}, [uploadedVideo, videoUrl, uploadedImage, imageUrl]);

const activeMediaUrl = useMemo(() => {
if (uploadedVideo) return uploadedVideo;
if (videoUrl) return videoUrl;
if (uploadedImage) return uploadedImage;
if (imageUrl) return imageUrl;
return "";
}, [uploadedVideo, videoUrl, uploadedImage, imageUrl]);

const generateImage = async () => {
if (!prompt.trim()) {
alert("Type a prompt first");
return;
}

setLoadingImage(true);

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
throw new Error(data.error || "Failed to generate image");
}

setImageUrl(data.image || "");
setVideoUrl("");
setUploadedImage("");
setUploadedVideo("");
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
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ prompt }),
});

const data = await res.json();

if (!res.ok) {
throw new Error(data.error || "Failed to generate video");
}

setVideoUrl(data.video || data.url || "");
setImageUrl("");
setUploadedImage("");
setUploadedVideo("");
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
setUploadedImage(objectUrl);
setUploadedVideo("");
setImageUrl("");
setVideoUrl("");
};

const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
const file = e.target.files?.[0];
if (!file) return;

const objectUrl = URL.createObjectURL(file);
setUploadedVideo(objectUrl);
setUploadedImage("");
setImageUrl("");
setVideoUrl("");
};

const clearPreview = () => {
setImageUrl("");
setVideoUrl("");
setUploadedImage("");
setUploadedVideo("");
};

const postToFeed = async () => {
if (!activeMediaUrl) {
alert("No image or video to post");
return;
}

setPosting(true);

const isVideo =
activePreviewType === "uploaded-video" || activePreviewType === "ai-video";

const payload = {
caption: prompt || "AI post",
image_url: isVideo ? null : activeMediaUrl,
video_url: isVideo ? activeMediaUrl : null,
likes: 0,
};

let { error } = await supabase.from("Posts").insert([payload]);

if (error) {
const fallbackPayload = {
Caption: prompt || "AI post",
Image_url: isVideo ? null : activeMediaUrl,
Video_url: isVideo ? activeMediaUrl : null,
Likes: 0,
};

const fallback = await supabase.from("Posts").insert([fallbackPayload]);
error = fallback.error || null;
}

setPosting(false);

if (error) {
console.log(error);
alert(error.message);
return;
}

alert("Posted!");
};

return (
<main style={styles.page}>
<div style={styles.topBar}>
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

<div style={styles.controlPanel}>
<input
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Describe your ad..."
style={styles.input}
/>

<div style={styles.buttonRow}>
<button onClick={generateImage} style={styles.primaryButton}>
{loadingImage ? "Generating Image..." : "Generate Image"}
</button>

<button onClick={generateVideo} style={styles.secondaryButton}>
{loadingVideo ? "Generating Video..." : "Generate Video"}
</button>

<button onClick={postToFeed} style={styles.secondaryButton}>
{posting ? "Posting..." : "Post to Feed"}
</button>

<button onClick={clearPreview} style={styles.clearButton}>
Clear
</button>
</div>

<div style={styles.uploadRow}>
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
{activePreviewType === "ai-image" || activePreviewType === "uploaded-image" ? (
<img src={activeMediaUrl} alt="Preview" style={styles.imagePreview} />
) : null}

{activePreviewType === "ai-video" || activePreviewType === "uploaded-video" ? (
<video
src={activeMediaUrl}
controls
autoPlay={activePreviewType === "ai-video"}
loop={activePreviewType === "ai-video"}
muted={activePreviewType === "ai-video"}
style={styles.videoPreview}
/>
) : null}

{activePreviewType === "none" ? (
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
topBar: {
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
controlPanel: {
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
primaryButton: {
border: "none",
borderRadius: "18px",
padding: "16px 22px",
fontSize: "18px",
fontWeight: 800,
background: "white",
color: "#111827",
cursor: "pointer",
},
secondaryButton: {
border: "1px solid rgba(255,255,255,0.25)",
borderRadius: "18px",
padding: "16px 22px",
fontSize: "18px",
fontWeight: 800,
background: "rgba(255,255,255,0.12)",
color: "white",
cursor: "pointer",
},
clearButton: {
border: "1px solid rgba(255,255,255,0.18)",
borderRadius: "18px",
padding: "16px 22px",
fontSize: "18px",
fontWeight: 800,
background: "rgba(0,0,0,0.18)",
color: "white",
cursor: "pointer",
},
uploadRow: {
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
imagePreview: {
width: "100%",
display: "block",
borderRadius: "28px",
background: "#0b1220",
boxShadow: "0 14px 40px rgba(0,0,0,0.25)",
},
videoPreview: {
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
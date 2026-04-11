"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function HomePage() {
const [user, setUser] = useState<any>(null);

const [prompt, setPrompt] = useState("");
const [loadingImage, setLoadingImage] = useState(false);
const [loadingVideo, setLoadingVideo] = useState(false);

const [generatedImage, setGeneratedImage] = useState<string | null>(null);
const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);

const [uploadedImage, setUploadedImage] = useState<string | null>(null);
const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);

useEffect(() => {
loadUser();

const {
data: { subscription },
} = supabase.auth.onAuthStateChange((_event, session) => {
setUser(session?.user ?? null);
});

return () => {
subscription.unsubscribe();
};
}, []);

async function loadUser() {
const {
data: { user },
} = await supabase.auth.getUser();

setUser(user ?? null);
}

async function generateImage() {
if (!prompt.trim()) {
alert("Type a prompt first");
return;
}

setLoadingImage(true);
setGeneratedImage(null);
setGeneratedVideo(null);

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
alert(data.error || "Image generation failed");
setLoadingImage(false);
return;
}

const imageUrl =
data.imageUrl || data.image_url || data.url || data.data || null;

if (!imageUrl) {
alert("No image returned");
setLoadingImage(false);
return;
}

setGeneratedImage(imageUrl);
} catch (error) {
alert("Image generation failed");
}

setLoadingImage(false);
}

async function generateVideo() {
if (!prompt.trim()) {
alert("Type a prompt first");
return;
}

setLoadingVideo(true);
setGeneratedVideo(null);
setGeneratedImage(null);

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
alert(data.error || "Video generation failed");
setLoadingVideo(false);
return;
}

const videoUrl =
data.videoUrl || data.video_url || data.url || data.output || null;

if (!videoUrl) {
alert("No video returned");
setLoadingVideo(false);
return;
}

setGeneratedVideo(videoUrl);
} catch (error) {
alert("Video generation failed");
}

setLoadingVideo(false);
}

function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
const file = e.target.files?.[0];
if (!file) return;

const localUrl = URL.createObjectURL(file);
setUploadedImage(localUrl);
setUploadedVideo(null);
setGeneratedImage(null);
setGeneratedVideo(null);
}

function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
const file = e.target.files?.[0];
if (!file) return;

const localUrl = URL.createObjectURL(file);
setUploadedVideo(localUrl);
setUploadedImage(null);
setGeneratedImage(null);
setGeneratedVideo(null);
}

function clearAll() {
setPrompt("");
setGeneratedImage(null);
setGeneratedVideo(null);
setUploadedImage(null);
setUploadedVideo(null);
}

async function shareToFeed() {
const {
data: { user },
error: userError,
} = await supabase.auth.getUser();

if (userError || !user) {
alert("Please log in first");
return;
}

const imageUrl = uploadedImage || generatedImage || null;
const videoUrl = uploadedVideo || generatedVideo || null;

if (!imageUrl && !videoUrl) {
alert("No image or video to post");
return;
}

const captionText = prompt.trim() || "New post";

const { error } = await supabase.from("Posts").insert({
caption: captionText,
image_url: imageUrl,
video_url: videoUrl,
user_id: user.id,
});

if (error) {
alert("Post error: " + error.message);
return;
}

alert("Posted!");
}

async function logout() {
await supabase.auth.signOut();
setUser(null);
alert("Logged out");
}

const previewImage = uploadedImage || generatedImage;
const previewVideo = uploadedVideo || generatedVideo;

return (
<main style={pageStyle}>
<div style={containerStyle}>
<div style={headerRowStyle}>
<div>
<h1 style={titleStyle}>AdForge</h1>
<p style={subTextStyle}>
{user ? `Logged in as ${user.email}` : "Not logged in"}
</p>
</div>

<div style={topButtonsWrapStyle}>
<Link href="/feed" style={topBtnStyle}>
Feed
</Link>

{!user ? (
<Link href="/login" style={topBtnStyle}>
Login
</Link>
) : (
<button onClick={logout} style={topBtnButtonStyle}>
Logout
</button>
)}
</div>
</div>

<div style={cardStyle}>
<textarea
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Describe your ad..."
style={textareaStyle}
/>

<div style={buttonGridStyle}>
<button
onClick={generateImage}
style={bigBtnStyle}
disabled={loadingImage}
>
{loadingImage ? "Generating image..." : "Generate image"}
</button>

<button
onClick={generateVideo}
style={bigBtnStyle}
disabled={loadingVideo}
>
{loadingVideo ? "Generating video..." : "Generate video"}
</button>

<button onClick={clearAll} style={darkBtnStyle}>
Clear
</button>

<button onClick={shareToFeed} style={greenBtnStyle}>
Share to Feed
</button>
</div>

<div style={uploadGridStyle}>
<label style={uploadCardStyle}>
<div style={uploadTitleStyle}>Upload your own image</div>
<div style={uploadSubStyle}>JPG, PNG, WEBP</div>
<input
type="file"
accept="image/*"
onChange={handleImageUpload}
style={{ display: "none" }}
/>
</label>

<label style={uploadCardStyle}>
<div style={uploadTitleStyle}>Upload your own video</div>
<div style={uploadSubStyle}>MP4, MOV, WEBM</div>
<input
type="file"
accept="video/*"
onChange={handleVideoUpload}
style={{ display: "none" }}
/>
</label>
</div>

<div style={previewWrapStyle}>
{previewVideo ? (
<video
src={previewVideo}
controls
playsInline
style={videoStyle}
/>
) : previewImage ? (
<img src={previewImage} alt="Preview" style={imageStyle} />
) : (
<div style={emptyStateStyle}>
<div style={emptyTitleStyle}>Your ad preview will appear here</div>
<div style={emptySubStyle}>
Generate or upload an image/video, then share it to feed
</div>
</div>
)}
</div>
</div>
</div>
</main>
);
}

const pageStyle: React.CSSProperties = {
minHeight: "100vh",
background: "linear-gradient(180deg, #0b1d4b 0%, #102c78 50%, #12398e 100%)",
color: "white",
padding: 20,
fontFamily: "Arial, sans-serif",
};

const containerStyle: React.CSSProperties = {
maxWidth: 900,
margin: "0 auto",
};

const headerRowStyle: React.CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: 20,
gap: 12,
flexWrap: "wrap",
};

const titleStyle: React.CSSProperties = {
margin: 0,
fontSize: 54,
fontWeight: 900,
lineHeight: 1,
};

const subTextStyle: React.CSSProperties = {
margin: "8px 0 0 0",
fontSize: 18,
};

const topButtonsWrapStyle: React.CSSProperties = {
display: "flex",
gap: 10,
flexWrap: "wrap",
};

const topBtnStyle: React.CSSProperties = {
display: "inline-flex",
alignItems: "center",
justifyContent: "center",
height: 50,
padding: "0 18px",
borderRadius: 16,
background: "#1b2f63",
color: "white",
textDecoration: "none",
fontSize: 18,
fontWeight: 800,
};

const topBtnButtonStyle: React.CSSProperties = {
height: 50,
padding: "0 18px",
borderRadius: 16,
background: "#1b2f63",
color: "white",
border: "none",
fontSize: 18,
fontWeight: 800,
cursor: "pointer",
};

const cardStyle: React.CSSProperties = {
background: "rgba(255,255,255,0.08)",
borderRadius: 30,
padding: 20,
boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
};

const textareaStyle: React.CSSProperties = {
width: "100%",
minHeight: 110,
borderRadius: 22,
border: "none",
padding: 18,
fontSize: 20,
outline: "none",
resize: "vertical",
boxSizing: "border-box",
marginBottom: 16,
};

const buttonGridStyle: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
gap: 14,
marginBottom: 16,
};

const bigBtnStyle: React.CSSProperties = {
height: 64,
borderRadius: 20,
border: "none",
background: "white",
color: "#102c78",
fontSize: 20,
fontWeight: 900,
cursor: "pointer",
};

const darkBtnStyle: React.CSSProperties = {
height: 64,
borderRadius: 20,
border: "none",
background: "#17305f",
color: "white",
fontSize: 20,
fontWeight: 900,
cursor: "pointer",
};

const greenBtnStyle: React.CSSProperties = {
height: 64,
borderRadius: 20,
border: "none",
background: "#20c76d",
color: "white",
fontSize: 20,
fontWeight: 900,
cursor: "pointer",
};

const uploadGridStyle: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
gap: 14,
marginBottom: 18,
};

const uploadCardStyle: React.CSSProperties = {
display: "block",
background: "rgba(39, 108, 255, 0.35)",
borderRadius: 22,
padding: 22,
cursor: "pointer",
};

const uploadTitleStyle: React.CSSProperties = {
fontSize: 22,
fontWeight: 900,
marginBottom: 6,
};

const uploadSubStyle: React.CSSProperties = {
fontSize: 16,
opacity: 0.9,
};

const previewWrapStyle: React.CSSProperties = {
background: "rgba(0,0,0,0.18)",
borderRadius: 28,
padding: 14,
minHeight: 320,
display: "flex",
alignItems: "center",
justifyContent: "center",
overflow: "hidden",
};

const videoStyle: React.CSSProperties = {
width: "100%",
maxHeight: 520,
borderRadius: 22,
objectFit: "contain",
background: "black",
};

const imageStyle: React.CSSProperties = {
width: "100%",
maxHeight: 520,
borderRadius: 22,
objectFit: "contain",
};

const emptyStateStyle: React.CSSProperties = {
textAlign: "center",
opacity: 0.9,
padding: 40,
};

const emptyTitleStyle: React.CSSProperties = {
fontSize: 28,
fontWeight: 900,
marginBottom: 10,
};

const emptySubStyle: React.CSSProperties = {
fontSize: 18,
};
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
} = supabase.auth.onAuthStateChange(async (_event, session) => {
setUser(session?.user ?? null);
});

return () => subscription.unsubscribe();
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
setGeneratedVideo(null);
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
setGeneratedImage(null);
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
setGeneratedVideo(null);
}

function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
const file = e.target.files?.[0];
if (!file) return;

const localUrl = URL.createObjectURL(file);
setUploadedVideo(localUrl);
setUploadedImage(null);
setGeneratedImage(null);
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
<main
style={{
minHeight: "100vh",
background:
"linear-gradient(180deg, #0b1d4b 0%, #102c78 50%, #12398e 100%)",
color: "white",
padding: 20,
fontFamily: "Arial, sans-serif",
}}
>
<div
style={{
maxWidth: 900,
margin: "0 auto",
}}
>
<div
style={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: 20,
gap: 12,
flexWrap: "wrap",
}}
>
<div>
<h1
style={{
margin: 0,
fontSize: 54,
fontWeight: 900,
lineHeight: 1,
}}
>
AdForge
</h1>
<p style={{ margin: "8px 0 0 0", fontSize: 18 }}>
{user ? `Logged in as ${user.email}` : "Not logged in"}
</p>
</div>

<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
<Link href="/feed" style={topBtn}>
Feed
</Link>

{!user ? (
<Link href="/login" style={topBtn}>
Login
</Link>
) : (
<button onClick={logout} style={topBtnButton}>
Logout
</button>
)}
</div>
</div>

<div
style={{
background: "rgba(255,255,255,0.08)",
borderRadius: 30,
padding: 20,
boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
}}
>
<textarea
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Describe your ad..."
style={{
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
}}
/>

<div
style={{
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
gap: 14,
marginBottom: 16,
}}
>
<button onClick={generateImage} style={bigBtn} disabled={loadingImage}>
{loadingImage ? "Generating image..." : "Generate image"}
</button>

<button onClick={generateVideo} style={bigBtn} disabled={loadingVideo}>
{loadingVideo ? "Generating video..." : "Generate video"}
</button>

<button onClick={clearAll} style={bigBtnDark}>
Clear
</button>

<button onClick={shareToFeed} style={bigBtnGreen}>
Share to Feed
</button>
</div>

<div
style={{
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
gap: 14,
marginBottom: 18,
}}
>
<label style={uploadCard}>
<div style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>
Upload your own image
</div>
<div style={{ fontSize: 16, opacity: 0.9 }}>JPG, PNG, WEBP</div>
<input
type="file"
accept="image/*"
onChange={handleImageUpload}
style={{ display: "none" }}
/>
</label>

<label style={uploadCard}>
<div style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>
Upload your own video
</div>
<div style={{ fontSize: 16, opacity: 0.9 }}>MP4, MOV, WEBM</div>
<input
type="file"
accept="video/*"
onChange={handleVideoUpload}
style={{ display: "none" }}
/>
</label>
</div>

<div
style={{
background: "rgba(0,0,0,0.18)",
borderRadius: 28,
padding: 14,
minHeight: 320,
display: "flex",
alignItems: "center",
justifyContent: "center",
overflow: "hidden",
}}
>
{previewVideo ? (
<video
src={previewVideo}
controls
playsInline
style={{
width: "100%",
maxHeight: 520,
borderRadius: 22,
objectFit: "contain",
background: "black",
}}
/>
) : previewImage ? (
<img
src={previewImage}
alt="Preview"
style={{
width: "100%",
maxHeight: 520,
borderRadius: 22,
objectFit: "contain",
}}
/>
) : (
<div
style={{
textAlign: "center",
opacity: 0.9,
padding: 40,
}}
>
<div style={{ fontSize: 28, fontWeight: 900, marginBottom: 10 }}>
Your ad preview will appear here
</div>
<div style={{ fontSize: 18 }}>
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

const topBtn: React.CSSProperties = {
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

const topBtnButton: React.CSSProperties = {
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

const bigBtn: React.CSSProperties = {
height: 64,
borderRadius: 20,
border: "none",
background: "white",
color: "#102c78",
fontSize: 20,
fontWeight: 900,
cursor: "pointer",
};

const bigBtnDark: React.CSSProperties = {
height: 64,
borderRadius: 20,
border: "none",
background: "#17305f",
color: "white",
fontSize: 20,
fontWeight: 900,
cursor: "pointer",
};

const bigBtnGreen: React.CSSProperties = {
height: 64,
borderRadius: 20,
border: "none",
background: "#20c76d",
color: "white",
fontSize: 20,
fontWeight: 900,
cursor: "pointer",
};

const uploadCard: React.CSSProperties = {
display: "block",
background: "rgba(39, 108, 255, 0.35)",
borderRadius: 22,
padding: 22,
cursor: "pointer",
};
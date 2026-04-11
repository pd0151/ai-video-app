"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function Home() {
const [user, setUser] = useState<any>(null);
const [prompt, setPrompt] = useState("");
const [generatedImage, setGeneratedImage] = useState<string | null>(null);
const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
const [uploadedImage, setUploadedImage] = useState<string | null>(null);
const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
const [loadingImage, setLoadingImage] = useState(false);
const [loadingVideo, setLoadingVideo] = useState(false);

useEffect(() => {
loadUser();

const {
data: { subscription },
} = supabase.auth.onAuthStateChange((_event, session) => {
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
setGeneratedVideo(null);

try {
const res = await fetch("/api/generate-image", {
method: "POST",
headers: { "Content-Type": "application/json" },
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
} catch {
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
headers: { "Content-Type": "application/json" },
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
} catch {
alert("Video generation failed");
}

setLoadingVideo(false);
}

function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
const file = e.target.files?.[0];
if (!file) return;

const url = URL.createObjectURL(file);
setUploadedImage(url);
setUploadedVideo(null);
setGeneratedImage(null);
setGeneratedVideo(null);
}

function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
const file = e.target.files?.[0];
if (!file) return;

const url = URL.createObjectURL(file);
setUploadedVideo(url);
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
error,
} = await supabase.auth.getUser();

if (error || !user) {
alert("Please log in first");
return;
}

const imageUrl = uploadedImage || generatedImage || null;
const videoUrl = uploadedVideo || generatedVideo || null;

if (!imageUrl && !videoUrl) {
alert("No image or video to post");
return;
}

const { error: postError } = await supabase.from("Posts").insert({
caption: prompt.trim() || "New post",
image_url: imageUrl,
video_url: videoUrl,
user_id: user.id,
});

if (postError) {
alert("Post error: " + postError.message);
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
background: "linear-gradient(180deg, #0b1d4b 0%, #102c78 50%, #12398e 100%)",
color: "white",
padding: "20px",
fontFamily: "Arial, sans-serif",
}}
>
<div style={{ maxWidth: "900px", margin: "0 auto" }}>
<div
style={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
gap: "12px",
flexWrap: "wrap",
marginBottom: "20px",
}}
>
<div>
<h1 style={{ margin: 0, fontSize: "54px", fontWeight: 900 }}>AdForge</h1>
<p style={{ margin: "8px 0 0 0", fontSize: "18px" }}>
{user ? `Logged in as ${user.email}` : "Not logged in"}
</p>
</div>

<div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
<Link
href="/feed"
style={{
display: "inline-flex",
alignItems: "center",
justifyContent: "center",
height: "50px",
padding: "0 18px",
borderRadius: "16px",
background: "#1b2f63",
color: "white",
textDecoration: "none",
fontSize: "18px",
fontWeight: 800,
}}
>
Feed
</Link>

{!user ? (
<Link
href="/login"
style={{
display: "inline-flex",
alignItems: "center",
justifyContent: "center",
height: "50px",
padding: "0 18px",
borderRadius: "16px",
background: "#1b2f63",
color: "white",
textDecoration: "none",
fontSize: "18px",
fontWeight: 800,
}}
>
Login
</Link>
) : (
<button
onClick={logout}
style={{
height: "50px",
padding: "0 18px",
borderRadius: "16px",
background: "#1b2f63",
color: "white",
border: "none",
fontSize: "18px",
fontWeight: 800,
cursor: "pointer",
}}
>
Logout
</button>
)}
</div>
</div>

<div
style={{
background: "rgba(255,255,255,0.08)",
borderRadius: "30px",
padding: "20px",
boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
}}
>
<textarea
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Describe your ad..."
style={{
width: "100%",
minHeight: "110px",
borderRadius: "22px",
border: "none",
padding: "18px",
fontSize: "20px",
outline: "none",
resize: "vertical",
boxSizing: "border-box",
marginBottom: "16px",
}}
/>

<div
style={{
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
gap: "14px",
marginBottom: "16px",
}}
>
<button
onClick={generateImage}
disabled={loadingImage}
style={{
height: "64px",
borderRadius: "20px",
border: "none",
background: "white",
color: "#102c78",
fontSize: "20px",
fontWeight: 900,
cursor: "pointer",
}}
>
{loadingImage ? "Generating image..." : "Generate image"}
</button>

<button
onClick={generateVideo}
disabled={loadingVideo}
style={{
height: "64px",
borderRadius: "20px",
border: "none",
background: "white",
color: "#102c78",
fontSize: "20px",
fontWeight: 900,
cursor: "pointer",
}}
>
{loadingVideo ? "Generating video..." : "Generate video"}
</button>

<button
onClick={clearAll}
style={{
height: "64px",
borderRadius: "20px",
border: "none",
background: "#17305f",
color: "white",
fontSize: "20px",
fontWeight: 900,
cursor: "pointer",
}}
>
Clear
</button>

<button
onClick={shareToFeed}
style={{
height: "64px",
borderRadius: "20px",
border: "none",
background: "#20c76d",
color: "white",
fontSize: "20px",
fontWeight: 900,
cursor: "pointer",
}}
>
Share to Feed
</button>
</div>

<div
style={{
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
gap: "14px",
marginBottom: "18px",
}}
>
<label
style={{
display: "block",
background: "rgba(39, 108, 255, 0.35)",
borderRadius: "22px",
padding: "22px",
cursor: "pointer",
}}
>
<div style={{ fontSize: "22px", fontWeight: 900, marginBottom: "6px" }}>
Upload your own image
</div>
<div style={{ fontSize: "16px", opacity: 0.9 }}>JPG, PNG, WEBP</div>
<input
type="file"
accept="image/*"
onChange={handleImageUpload}
style={{ display: "none" }}
/>
</label>

<label
style={{
display: "block",
background: "rgba(39, 108, 255, 0.35)",
borderRadius: "22px",
padding: "22px",
cursor: "pointer",
}}
>
<div style={{ fontSize: "22px", fontWeight: 900, marginBottom: "6px" }}>
Upload your own video
</div>
<div style={{ fontSize: "16px", opacity: 0.9 }}>MP4, MOV, WEBM</div>
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
borderRadius: "28px",
padding: "14px",
minHeight: "320px",
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
maxHeight: "520px",
borderRadius: "22px",
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
maxHeight: "520px",
borderRadius: "22px",
objectFit: "contain",
}}
/>
) : (
<div style={{ textAlign: "center", opacity: 0.9, padding: "40px" }}>
<div style={{ fontSize: "28px", fontWeight: 900, marginBottom: "10px" }}>
Your ad preview will appear here
</div>
<div style={{ fontSize: "18px" }}>
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
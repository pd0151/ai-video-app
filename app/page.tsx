"use client";

import { useState } from "react";
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

const generateImage = async () => {
const res = await fetch("/api/generate-image", {
method: "POST",
body: JSON.stringify({ prompt }),
});
const data = await res.json();
setImageUrl(data.image);
setVideoUrl("");
setUploadUrl("");
};

const generateVideo = async () => {
const res = await fetch("/api/generate-video", {
method: "POST",
body: JSON.stringify({ prompt }),
});
const data = await res.json();
setVideoUrl(data.video || data.url);
setImageUrl("");
setUploadUrl("");
};

const handleUpload = (e: any) => {
const file = e.target.files[0];
if (!file) return;
const url = URL.createObjectURL(file);
setUploadUrl(url);
setImageUrl("");
setVideoUrl("");
};

const getMedia = () => {
return uploadUrl || videoUrl || imageUrl;
};

const isVideo = () => {
return !!videoUrl;
};

const postToFeed = async () => {
const media = getMedia();
if (!media) {
alert("No media to post");
return;
}

const { error } = await supabase.from("Posts").insert([
{
caption: prompt,
image_url: isVideo() ? null : media,
video_url: isVideo() ? media : null,
likes: 0,
},
]);

if (error) {
alert(error.message);
} else {
alert("Posted!");
}
};

return (
<main style={styles.page}>
<h1 style={styles.title}>AI Image & Video Generator</h1>

<input
style={styles.input}
placeholder="Describe your ad..."
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
/>

<div style={styles.row}>
<button onClick={generateImage} style={styles.btn}>
Generate Image
</button>

<button onClick={generateVideo} style={styles.btn}>
Generate Video
</button>

<button onClick={postToFeed} style={styles.btn}>
Post to Feed
</button>
</div>

<div style={styles.upload}>
<input type="file" accept="image/*,video/*" onChange={handleUpload} />
</div>

<div style={styles.preview}>
{uploadUrl && uploadUrl.includes("video") && (
<video src={uploadUrl} controls style={styles.media} />
)}

{videoUrl && <video src={videoUrl} controls style={styles.media} />}

{imageUrl && <img src={imageUrl} style={styles.media} />}
</div>

<a href="/feed" style={styles.feedBtn}>
Go to Feed
</a>
</main>
);
}

const styles: any = {
page: {
minHeight: "100vh",
padding: 40,
background: "#0f172a",
color: "white",
},
title: {
fontSize: 50,
fontWeight: 900,
},
input: {
width: "100%",
padding: 15,
borderRadius: 10,
marginTop: 20,
marginBottom: 20,
fontSize: 18,
},
row: {
display: "flex",
gap: 10,
marginBottom: 20,
},
btn: {
padding: "12px 18px",
borderRadius: 10,
border: "none",
cursor: "pointer",
fontWeight: 700,
},
upload: {
marginBottom: 20,
},
preview: {
marginTop: 20,
},
media: {
width: "100%",
maxWidth: 600,
borderRadius: 20,
},
feedBtn: {
display: "inline-block",
marginTop: 30,
padding: 12,
background: "#2563eb",
borderRadius: 10,
color: "white",
textDecoration: "none",
},
};
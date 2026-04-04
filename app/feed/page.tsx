"use client";

import { useState } from "react";
import { createClient } from "@/lib/client";

export default function HomePage() {
const supabase = createClient();

const [prompt, setPrompt] = useState("");
const [image, setImage] = useState("");
const [loading, setLoading] = useState(false);
const [posting, setPosting] = useState(false);
const [message, setMessage] = useState("");

async function generateImage() {
try {
setLoading(true);
setMessage("");
setImage("");

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

setImage(data.image);
} catch (error: any) {
setMessage(error.message || "Failed to generate image");
} finally {
setLoading(false);
}
}

async function postToFeed() {
try {
setPosting(true);
setMessage("");

if (!image) {
throw new Error("Generate an image first");
}

const { error } = await supabase.from("posts").insert([
{
image_url: image,
prompt: prompt || "AI image",
caption: prompt || "AI image",
likes_count: 0,
comments_count: 0,
},
]);

if (error) {
throw error;
}

setMessage("Posted to feed successfully");
setPrompt("");
setImage("");
} catch (error: any) {
setMessage(error.message || "Failed to post to feed");
} finally {
setPosting(false);
}
}

return (
<main style={styles.page}>
<div style={styles.container}>
<h1 style={styles.title}>AI Image Generator</h1>

<div style={styles.form}>
<input
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Describe your image..."
style={styles.input}
/>

<button
onClick={generateImage}
disabled={loading || !prompt.trim()}
style={styles.primaryButton}
>
{loading ? "Generating..." : "Generate Image"}
</button>

<button
onClick={postToFeed}
disabled={posting || !image}
style={styles.secondaryButton}
>
{posting ? "Posting..." : "Post to Feed"}
</button>
</div>

{message && <p style={styles.message}>{message}</p>}

{image ? (
<div style={styles.previewCard}>
<img src={image} alt="Generated" style={styles.previewImage} />
</div>
) : (
<div style={styles.emptyBox}>Your image preview will show here</div>
)}
</div>
</main>
);
}

const styles: Record<string, React.CSSProperties> = {
page: {
minHeight: "100vh",
background: "linear-gradient(180deg, #0f172a 0%, #1d4ed8 100%)",
padding: "24px",
color: "white",
},
container: {
maxWidth: "900px",
margin: "0 auto",
},
title: {
fontSize: "56px",
fontWeight: 900,
margin: "0 0 24px 0",
},
form: {
display: "flex",
flexWrap: "wrap",
gap: "12px",
marginBottom: "20px",
},
input: {
flex: 1,
minWidth: "280px",
height: "52px",
borderRadius: "14px",
border: "none",
padding: "0 16px",
fontSize: "16px",
outline: "none",
},
primaryButton: {
height: "52px",
padding: "0 18px",
borderRadius: "14px",
border: "none",
background: "#ffffff",
color: "#111827",
fontWeight: 800,
cursor: "pointer",
},
secondaryButton: {
height: "52px",
padding: "0 18px",
borderRadius: "14px",
border: "1px solid rgba(255,255,255,0.25)",
background: "rgba(255,255,255,0.12)",
color: "#ffffff",
fontWeight: 800,
cursor: "pointer",
},
message: {
fontSize: "18px",
fontWeight: 700,
margin: "0 0 18px 0",
},
previewCard: {
width: "100%",
maxWidth: "520px",
borderRadius: "24px",
overflow: "hidden",
background: "#111827",
boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
},
previewImage: {
width: "100%",
display: "block",
objectFit: "cover",
},
emptyBox: {
width: "100%",
maxWidth: "520px",
minHeight: "520px",
borderRadius: "24px",
background: "rgba(255,255,255,0.08)",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontSize: "22px",
fontWeight: 700,
color: "rgba(255,255,255,0.75)",
},
};
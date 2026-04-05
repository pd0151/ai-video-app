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
const [loading, setLoading] = useState(false);

const generateImage = async () => {
if (!prompt) return;

setLoading(true);

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

setImageUrl(data.image);
} catch (err: any) {
alert(err.message || "Error generating image");
} finally {
setLoading(false);
}
};

const postToFeed = async () => {
if (!imageUrl) {
alert("No image");
return;
}

const { error } = await supabase.from("Posts").insert([
{
caption: prompt || "AI image",
image_url: imageUrl,
likes: 0,
},
]);

if (error) {
console.log(error);
alert(error.message);
} else {
alert("Posted!");
}
};

return (
<main style={styles.page}>
<h1 style={styles.title}>AI Image Generator</h1>

<div style={styles.row}>
<input
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Describe your image..."
style={styles.input}
/>

<button onClick={generateImage} style={styles.button}>
{loading ? "Generating..." : "Generate Image"}
</button>

<button onClick={postToFeed} style={styles.postButton}>
Post to Feed
</button>
</div>

{imageUrl ? (
<img src={imageUrl} alt="AI" style={styles.image} />
) : (
<div style={styles.emptyBox}>Your image preview will show here</div>
)}
</main>
);
}

const styles: Record<string, React.CSSProperties> = {
page: {
minHeight: "100vh",
padding: 30,
background: "linear-gradient(180deg, #182848 0%, #1d4ed8 100%)",
color: "white",
},
title: {
fontSize: "72px",
fontWeight: 900,
marginBottom: 30,
},
row: {
display: "flex",
gap: 14,
alignItems: "center",
marginBottom: 20,
flexWrap: "wrap",
},
input: {
width: "560px",
maxWidth: "100%",
padding: "16px 20px",
borderRadius: "18px",
border: "none",
fontSize: "18px",
outline: "none",
},
button: {
padding: "16px 24px",
borderRadius: "18px",
border: "none",
background: "white",
color: "#222",
fontWeight: 700,
fontSize: "18px",
cursor: "pointer",
},
postButton: {
padding: "16px 24px",
borderRadius: "18px",
border: "1px solid rgba(255,255,255,0.25)",
background: "rgba(255,255,255,0.10)",
color: "white",
fontWeight: 700,
fontSize: "18px",
cursor: "pointer",
},
image: {
width: "100%",
maxWidth: "650px",
borderRadius: "24px",
display: "block",
},
emptyBox: {
width: "650px",
maxWidth: "100%",
minHeight: "420px",
borderRadius: "24px",
background: "rgba(255,255,255,0.08)",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontSize: "24px",
fontWeight: 700,
color: "rgba(255,255,255,0.75)",
},
};
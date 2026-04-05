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

const generateImage = async () => {
const res = await fetch("/api/image", {
method: "POST",
body: JSON.stringify({ prompt }),
});

const data = await res.json();
setImageUrl(data.image);
};

// ✅ FIXED POST FUNCTION (NO RLS ERROR)
const postToFeed = async () => {
if (!imageUrl) return alert("No image");

const { error } = await supabase
.from("posts")
.insert([{ image_url: imageUrl }]);

if (error) {
console.error(error);
alert(error.message);
} else {
alert("Posted!");
}
};

return (
<main style={{ padding: 40 }}>
<h1 style={{ fontSize: 40, fontWeight: "bold" }}>
AI Image Generator
</h1>

<div style={{ display: "flex", gap: 10, marginTop: 20 }}>
<input
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Describe your image..."
style={{
padding: 10,
width: 300,
borderRadius: 10,
border: "1px solid #ccc",
}}
/>

<button
onClick={generateImage}
style={{
padding: "10px 20px",
borderRadius: 10,
border: "none",
background: "#fff",
cursor: "pointer",
}}
>
Generate Image
</button>

<button
onClick={postToFeed}
style={{
padding: "10px 20px",
borderRadius: 10,
border: "none",
background: "#4f46e5",
color: "#fff",
cursor: "pointer",
}}
>
Post to Feed
</button>
</div>

<div style={{ marginTop: 30 }}>
{imageUrl ? (
<img
src={imageUrl}
alt="Generated"
style={{
width: "100%",
maxWidth: 500,
borderRadius: 20,
}}
/>
) : (
<div
style={{
width: 500,
height: 300,
borderRadius: 20,
background: "#eee",
display: "flex",
alignItems: "center",
justifyContent: "center",
}}
>
Your image preview will show here
</div>
)}
</div>
</main>
);
}
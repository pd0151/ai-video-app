"use client";

import { useEffect, useState } from "react";

type AdPost = {
id: number;
prompt: string;
image: string;
likes: number;
comments: number;
};

export default function FeedPage() {
const [prompt, setPrompt] = useState("");
const [loading, setLoading] = useState(false);
const [posts, setPosts] = useState<AdPost[]>([]);

// Load from localStorage
useEffect(() => {
const stored = localStorage.getItem("ads-feed");
if (stored) {
try {
setPosts(JSON.parse(stored));
} catch {
setPosts([]);
}
}
}, []);

function savePosts(newPosts: AdPost[]) {
setPosts(newPosts);
localStorage.setItem("ads-feed", JSON.stringify(newPosts));
}

async function generateAd() {
if (!prompt.trim()) return alert("Type something first");

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

if (!res.ok || !data.image) {
alert("Failed to generate");
return;
}

const newPost: AdPost = {
id: Date.now(),
prompt,
image: data.image,
likes: 0,
comments: 0,
};

const updated = [newPost, ...posts];
savePosts(updated);
setPrompt("");
} catch (err) {
console.error(err);
alert("Error generating");
} finally {
setLoading(false);
}
}

function likePost(id: number) {
const updated = posts.map((p) =>
p.id === id ? { ...p, likes: p.likes + 1 } : p
);
savePosts(updated);
}

function commentPost(id: number) {
const updated = posts.map((p) =>
p.id === id ? { ...p, comments: p.comments + 1 } : p
);
savePosts(updated);
}

function sharePost() {
alert("Share feature coming soon 🚀");
}

return (
<main
style={{
minHeight: "100vh",
background: "#0f172a",
color: "white",
padding: "20px",
fontFamily: "Arial",
}}
>
<div style={{ maxWidth: "700px", margin: "0 auto" }}>
<h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
AdForge Feed
</h1>

{/* INPUT */}
<div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
<input
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Create an ad..."
style={{
flex: 1,
padding: "12px",
borderRadius: "10px",
border: "none",
}}
/>

<button
onClick={generateAd}
disabled={loading}
style={{
padding: "12px 18px",
borderRadius: "10px",
border: "none",
fontWeight: "bold",
cursor: "pointer",
}}
>
{loading ? "..." : "Generate"}
</button>
</div>

{/* FEED */}
{posts.length === 0 && <p>No ads yet</p>}

<div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
{posts.map((post) => (
<div
key={post.id}
style={{
background: "#1e293b",
borderRadius: "16px",
overflow: "hidden",
}}
>
<img
src={post.image}
style={{ width: "100%", display: "block" }}
/>

<div style={{ padding: "12px" }}>
<p style={{ marginBottom: "10px" }}>{post.prompt}</p>

<div
style={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
}}
>
<div style={{ display: "flex", gap: "15px" }}>
<button onClick={() => likePost(post.id)}>
❤️ {post.likes}
</button>

<button onClick={() => commentPost(post.id)}>
💬 {post.comments}
</button>

<button onClick={sharePost}>🔗 Share</button>
</div>

<button
onClick={() => {
const a = document.createElement("a");
a.href = post.image;
a.download = "ad.png";
a.click();
}}
>
⬇️
</button>
</div>
</div>
</div>
))}
</div>
</div>
</main>
);
}
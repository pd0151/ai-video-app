"use client";

import { useEffect, useState } from "react";

type Post = {
id: string;
prompt: string;
image: string;
likes: number;
comments: string[];
shares: number;
};

export default function FeedPage() {
const [prompt, setPrompt] = useState("");
const [posts, setPosts] = useState<Post[]>([]);
const [loading, setLoading] = useState(false);
const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
{}
);

useEffect(() => {
const saved = localStorage.getItem("adforge-posts");
if (saved) {
try {
setPosts(JSON.parse(saved));
} catch {
setPosts([]);
}
}
}, []);

useEffect(() => {
localStorage.setItem("adforge-posts", JSON.stringify(posts));
}, [posts]);

async function generateAd() {
if (!prompt.trim()) {
alert("Type something first");
return;
}

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
alert(data.error || "Error generating");
setLoading(false);
return;
}

const newPost: Post = {
id: Date.now().toString(),
prompt,
image: data.image,
likes: 0,
comments: [],
shares: 0,
};

setPosts((prev) => [newPost, ...prev]);
setPrompt("");
} catch (error) {
console.error(error);
alert("Error generating");
} finally {
setLoading(false);
}
}

function likePost(id: string) {
setPosts((prev) =>
prev.map((post) =>
post.id === id ? { ...post, likes: post.likes + 1 } : post
)
);
}

function addComment(id: string) {
const text = (commentInputs[id] || "").trim();
if (!text) return;

setPosts((prev) =>
prev.map((post) =>
post.id === id
? { ...post, comments: [...post.comments, text] }
: post
)
);

setCommentInputs((prev) => ({
...prev,
[id]: "",
}));
}

function sharePost(id: string, image: string) {
navigator.clipboard.writeText(image);
alert("Image link copied");

setPosts((prev) =>
prev.map((post) =>
post.id === id ? { ...post, shares: post.shares + 1 } : post
)
);
}

function downloadImage(src: string, id: string) {
const a = document.createElement("a");
a.href = src;
a.download = `adforge-${id}.png`;
a.click();
}

return (
<main
style={{
minHeight: "100vh",
background: "linear-gradient(to bottom, #1e293b, #0f172a)",
color: "white",
fontFamily: "Arial, sans-serif",
padding: "20px",
}}
>
<div style={{ maxWidth: "700px", margin: "0 auto" }}>
<h1 style={{ fontSize: "40px", marginBottom: "20px" }}>AdForge Feed</h1>

<div
style={{
display: "flex",
gap: "10px",
marginBottom: "20px",
flexWrap: "wrap",
}}
>
<input
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Create an ad..."
style={{
flex: 1,
minWidth: "240px",
padding: "14px",
borderRadius: "12px",
border: "none",
fontSize: "16px",
}}
/>

<button
onClick={generateAd}
disabled={loading}
style={{
padding: "14px 18px",
borderRadius: "12px",
border: "none",
cursor: "pointer",
fontWeight: "bold",
}}
>
{loading ? "Generating..." : "Generate"}
</button>
</div>

{posts.length === 0 && (
<div
style={{
background: "rgba(255,255,255,0.08)",
padding: "20px",
borderRadius: "16px",
}}
>
No ads yet
</div>
)}

<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
{posts.map((post) => (
<div
key={post.id}
style={{
background: "rgba(255,255,255,0.06)",
borderRadius: "20px",
overflow: "hidden",
border: "1px solid rgba(255,255,255,0.08)",
}}
>
<img
src={post.image}
alt={post.prompt}
style={{
width: "100%",
display: "block",
borderBottom: "1px solid rgba(255,255,255,0.08)",
}}
/>

<div style={{ padding: "14px" }}>
<p
style={{
marginBottom: "12px",
fontSize: "15px",
fontWeight: 600,
}}
>
{post.prompt}
</p>

<div
style={{
display: "flex",
gap: "10px",
flexWrap: "wrap",
marginBottom: "14px",
}}
>
<button
onClick={() => likePost(post.id)}
style={buttonStyle}
>
❤️ {post.likes}
</button>

<button style={buttonStyle}>💬 {post.comments.length}</button>

<button
onClick={() => sharePost(post.id, post.image)}
style={buttonStyle}
>
🔗 Share {post.shares > 0 ? post.shares : ""}
</button>

<button
onClick={() => downloadImage(post.image, post.id)}
style={buttonStyle}
>
⬇️ Download
</button>
</div>

<div
style={{
display: "flex",
gap: "10px",
marginBottom: "12px",
flexWrap: "wrap",
}}
>
<input
placeholder="Write a comment..."
value={commentInputs[post.id] || ""}
onChange={(e) =>
setCommentInputs((prev) => ({
...prev,
[post.id]: e.target.value,
}))
}
style={{
flex: 1,
minWidth: "220px",
padding: "10px",
borderRadius: "10px",
border: "none",
}}
/>

<button
onClick={() => addComment(post.id)}
style={buttonStyle}
>
Add Comment
</button>
</div>

<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
{post.comments.map((comment, index) => (
<div
key={`${post.id}-${index}`}
style={{
background: "rgba(255,255,255,0.06)",
padding: "10px 12px",
borderRadius: "10px",
fontSize: "14px",
}}
>
💬 {comment}
</div>
))}
</div>
</div>
</div>
))}
</div>
</div>
</main>
);
}

const buttonStyle: React.CSSProperties = {
padding: "10px 12px",
borderRadius: "10px",
border: "none",
cursor: "pointer",
fontWeight: "bold",
};
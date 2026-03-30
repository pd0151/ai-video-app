"use client";

import { useEffect, useState } from "react";

type Post = {
id: string;
prompt: string;
image: string;
likes: number;
comments: string[];
};

export default function FeedPage() {
const [prompt, setPrompt] = useState("");
const [posts, setPosts] = useState<Post[]>([]);
const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
const [loading, setLoading] = useState(false);

useEffect(() => {
const saved = localStorage.getItem("adforge-posts");
if (saved) setPosts(JSON.parse(saved));
}, []);

useEffect(() => {
localStorage.setItem("adforge-posts", JSON.stringify(posts));
}, [posts]);

const generateAd = async () => {
if (!prompt) return;
setLoading(true);

const res = await fetch("/api/generate-image", {
method: "POST",
body: JSON.stringify({ prompt }),
});

const data = await res.json();

const newPost: Post = {
id: Date.now().toString(),
prompt,
image: data.image,
likes: 0,
comments: [],
};

setPosts([newPost, ...posts]);
setPrompt("");
setLoading(false);
};

const likePost = (id: string) => {
setPosts(posts.map(p =>
p.id === id ? { ...p, likes: p.likes + 1 } : p
));
};

const addComment = (id: string) => {
const text = commentInputs[id];
if (!text) return;

setPosts(posts.map(p =>
p.id === id
? { ...p, comments: [...p.comments, text] }
: p
));

setCommentInputs({ ...commentInputs, [id]: "" });
};

return (
<main style={{ height: "100vh", overflowY: "scroll", scrollSnapType: "y mandatory" }}>

{/* TOP BAR */}
<div style={{
position: "fixed",
top: 0,
width: "100%",
padding: "10px",
background: "rgba(0,0,0,0.5)",
zIndex: 10
}}>
<input
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Create ad..."
style={{ padding: "8px", width: "70%" }}
/>
<button onClick={generateAd}>
{loading ? "..." : "Generate"}
</button>
</div>

{/* POSTS */}
{posts.map(post => (
<div
key={post.id}
style={{
height: "100vh",
position: "relative",
scrollSnapAlign: "start"
}}
>
{/* IMAGE */}
<img
src={post.image}
style={{
width: "100%",
height: "100%",
objectFit: "cover"
}}
/>

{/* OVERLAY LEFT (caption) */}
<div style={{
position: "absolute",
bottom: "80px",
left: "10px",
color: "white"
}}>
<h3>@adforge_user</h3>
<p>{post.prompt}</p>

{/* COMMENTS */}
<div>
{post.comments.map((c, i) => (
<p key={i}>💬 {c}</p>
))}
</div>

<input
placeholder="Comment..."
value={commentInputs[post.id] || ""}
onChange={(e) =>
setCommentInputs({
...commentInputs,
[post.id]: e.target.value
})
}
/>
<button onClick={() => addComment(post.id)}>Send</button>
</div>

{/* RIGHT SIDE BUTTONS */}
<div style={{
position: "absolute",
right: "10px",
bottom: "100px",
display: "flex",
flexDirection: "column",
gap: "20px",
color: "white"
}}>
<button onClick={() => likePost(post.id)}>
❤️ {post.likes}
</button>

<button>
💬 {post.comments.length}
</button>

<button
onClick={() => navigator.clipboard.writeText(post.image)}
>
🔗
</button>
</div>
</div>
))}
</main>
);
}
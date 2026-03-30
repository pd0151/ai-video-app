"use client";

import { useEffect, useState } from "react";

type Post = {
id: string;
prompt: string;
image: string;
likes: number;
};

export default function FeedPage() {
const [prompt, setPrompt] = useState("");
const [posts, setPosts] = useState<Post[]>([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
const saved = localStorage.getItem("posts");
if (saved) {
try {
setPosts(JSON.parse(saved));
} catch {
setPosts([]);
}
}
}, []);

useEffect(() => {
localStorage.setItem("posts", JSON.stringify(posts));
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
alert(data.error || "Error generating image");
return;
}

const newPost: Post = {
id: Date.now().toString(),
prompt,
image: data.image,
likes: 0,
};

setPosts((prev) => [newPost, ...prev]);
setPrompt("");
} catch (error) {
console.error(error);
alert("Error generating image");
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

function sharePost(image: string) {
navigator.clipboard.writeText(image);
alert("Copied image link");
}

function downloadImage(src: string, id: string) {
const a = document.createElement("a");
a.href = src;
a.download = `adforge-${id}.png`;
a.click();
}

return (
<main style={styles.container}>
<div style={styles.topBar}>
<input
style={styles.input}
placeholder="Create an ad..."
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
/>
<button style={styles.button} onClick={generateAd} disabled={loading}>
{loading ? "Generating..." : "Generate"}
</button>
</div>

<div style={styles.feed}>
{posts.length === 0 && (
<div style={styles.emptyState}>No ads yet</div>
)}

{posts.map((post) => (
<div key={post.id} style={styles.card}>
<img src={post.image} alt={post.prompt} style={styles.image} />

<div style={styles.overlay}>
<div style={styles.prompt}>{post.prompt}</div>

<div style={styles.actions}>
<button style={styles.actionBtn} onClick={() => likePost(post.id)}>
❤️ {post.likes}
</button>

<button style={styles.actionBtn} onClick={() => sharePost(post.image)}>
🔗 Share
</button>

<button
style={styles.actionBtn}
onClick={() => downloadImage(post.image, post.id)}
>
⬇️ Download
</button>
</div>
</div>
</div>
))}
</div>
</main>
);
}

const styles: Record<string, React.CSSProperties> = {
container: {
background: "#0f172a",
color: "white",
minHeight: "100vh",
overflow: "hidden",
fontFamily: "Arial, sans-serif",
},
topBar: {
display: "flex",
gap: "10px",
padding: "12px",
position: "fixed",
top: 0,
left: 0,
right: 0,
zIndex: 10,
background: "#0f172a",
},
input: {
flex: 1,
padding: "12px",
borderRadius: "12px",
border: "none",
outline: "none",
fontSize: "16px",
},
button: {
padding: "12px 16px",
borderRadius: "12px",
border: "none",
cursor: "pointer",
fontWeight: 700,
},
feed: {
marginTop: "72px",
height: "calc(100vh - 72px)",
overflowY: "auto",
scrollSnapType: "y mandatory",
},
emptyState: {
padding: "24px",
textAlign: "center",
opacity: 0.8,
},
card: {
height: "calc(100vh - 72px)",
position: "relative",
scrollSnapAlign: "start",
background: "#0f172a",
},
image: {
width: "100%",
height: "100%",
objectFit: "cover",
display: "block",
},
overlay: {
position: "absolute",
bottom: 0,
left: 0,
width: "100%",
padding: "20px",
background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
boxSizing: "border-box",
},
prompt: {
fontSize: "20px",
fontWeight: 800,
marginBottom: "10px",
textTransform: "capitalize",
},
actions: {
display: "flex",
gap: "10px",
flexWrap: "wrap",
},
actionBtn: {
padding: "10px 14px",
borderRadius: "12px",
border: "none",
cursor: "pointer",
fontWeight: 700,
},
};
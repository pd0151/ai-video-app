"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";

type Post = {
id: string;
caption: string | null;
image_url: string | null;
likes: number | null;
created_at: string | null;
};

export default function FeedPage() {
const supabase = createClient();

const [posts, setPosts] = useState<Post[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
const loadPosts = async () => {
setLoading(true);
setError("");

const { data, error } = await supabase
.from("Posts")
.select("*")
.order("created_at", { ascending: false });

if (error) {
console.error("FEED LOAD ERROR:", error);
setError(error.message);
setPosts([]);
} else {
setPosts((data as Post[]) || []);
}

setLoading(false);
};

loadPosts();
}, [supabase]);

return (
<main style={styles.page}>
<h1 style={styles.title}>AdForge Feed</h1>

{loading && <p style={styles.message}>Loading posts...</p>}

{!loading && error && (
<p style={styles.error}>Error loading posts: {error}</p>
)}

{!loading && !error && posts.length === 0 && (
<p style={styles.message}>No posts yet</p>
)}

{!loading && !error && posts.length > 0 && (
<div style={styles.feed}>
{posts.map((post) => (
<div key={post.id} style={styles.card}>
<div style={styles.mediaWrap}>
{post.image_url ? (
<img
src={post.image_url}
alt={post.caption || "Post image"}
style={styles.image}
/>
) : (
<div style={styles.noImage}>No image</div>
)}

<div style={styles.overlay}>
<p style={styles.caption}>{post.caption || "No caption"}</p>
<div style={styles.actions}>
<div style={styles.actionButton}>❤️ {post.likes ?? 0}</div>
<div style={styles.actionButton}>💬 0</div>
<div style={styles.actionButton}>↗ Share</div>
</div>
</div>
</div>
</div>
))}
</div>
)}
</main>
);
}

const styles: Record<string, React.CSSProperties> = {
page: {
minHeight: "100vh",
background:
"linear-gradient(180deg, #081226 0%, #0d1b3a 50%, #0a1630 100%)",
padding: "20px",
color: "white",
},
title: {
fontSize: "40px",
fontWeight: 900,
marginBottom: "20px",
},
message: {
textAlign: "center",
fontSize: "28px",
fontWeight: 800,
marginTop: "120px",
},
error: {
textAlign: "center",
fontSize: "20px",
fontWeight: 700,
color: "#ff8a8a",
marginTop: "80px",
},
feed: {
display: "flex",
flexDirection: "column",
gap: "24px",
maxWidth: "700px",
margin: "0 auto",
},
card: {
borderRadius: "24px",
overflow: "hidden",
background: "rgba(255,255,255,0.06)",
border: "1px solid rgba(255,255,255,0.08)",
boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
},
mediaWrap: {
position: "relative",
minHeight: "500px",
background: "#111827",
},
image: {
width: "100%",
height: "100%",
maxHeight: "700px",
objectFit: "cover",
display: "block",
},
noImage: {
height: "500px",
display: "flex",
alignItems: "center",
justifyContent: "center",
color: "rgba(255,255,255,0.7)",
fontSize: "24px",
fontWeight: 700,
},
overlay: {
position: "absolute",
left: 0,
right: 0,
bottom: 0,
padding: "24px",
background:
"linear-gradient(to top, rgba(0,0,0,0.82), rgba(0,0,0,0.28), transparent)",
},
caption: {
margin: 0,
fontSize: "22px",
fontWeight: 800,
lineHeight: 1.4,
maxWidth: "80%",
},
actions: {
display: "flex",
gap: "12px",
marginTop: "18px",
flexWrap: "wrap",
},
actionButton: {
background: "rgba(255,255,255,0.14)",
border: "1px solid rgba(255,255,255,0.14)",
borderRadius: "14px",
padding: "10px 14px",
fontSize: "15px",
fontWeight: 700,
},
};
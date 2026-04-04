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
const [posts, setPosts] = useState<Post[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
const loadPosts = async () => {
try {
setLoading(true);
setError("");

const supabase = createClient();

const { data, error } = await supabase
.from("posts")
.select("id, caption, image_url, likes, created_at")
.order("created_at", { ascending: false });

if (error) {
throw error;
}

setPosts(data || []);
} catch (err: any) {
setError(err?.message || "Failed to load posts");
} finally {
setLoading(false);
}
};

loadPosts();
}, []);

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
<p style={styles.likes}>❤️ {post.likes ?? 0}</p>
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
background: "linear-gradient(180deg, #0f172a 0%, #1e3a8a 100%)",
padding: "24px",
color: "white",
},
title: {
fontSize: "56px",
fontWeight: 900,
margin: "0 0 24px 0",
lineHeight: 1,
},
message: {
textAlign: "center",
fontSize: "42px",
fontWeight: 800,
marginTop: "120px",
},
error: {
textAlign: "center",
fontSize: "28px",
fontWeight: 700,
color: "#fca5a5",
marginTop: "120px",
},
feed: {
display: "flex",
flexDirection: "column",
gap: "24px",
alignItems: "center",
},
card: {
position: "relative",
width: "100%",
maxWidth: "520px",
minHeight: "720px",
background: "#111827",
borderRadius: "24px",
overflow: "hidden",
boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
border: "1px solid rgba(255,255,255,0.08)",
},
image: {
width: "100%",
height: "720px",
objectFit: "cover",
display: "block",
},
noImage: {
width: "100%",
height: "720px",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontSize: "28px",
fontWeight: 700,
color: "rgba(255,255,255,0.7)",
background: "rgba(255,255,255,0.04)",
},
overlay: {
position: "absolute",
left: 0,
right: 0,
bottom: 0,
padding: "24px",
background:
"linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)",
},
caption: {
margin: 0,
fontSize: "24px",
fontWeight: 800,
},
likes: {
margin: "10px 0 0 0",
fontSize: "18px",
fontWeight: 700,
color: "rgba(255,255,255,0.85)",
},
};
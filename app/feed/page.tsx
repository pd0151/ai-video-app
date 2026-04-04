"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";

type Post = {
id: string;
prompt?: string;
image_url?: string;
video_url?: string;
created_at?: string;
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
.from("posts")
.select("*")
.order("created_at", { ascending: false });

if (error) {
setError(error.message);
} else {
setPosts((data as Post[]) || []);
}

setLoading(false);
};

loadPosts();
}, [supabase]);

return (
<main style={styles.page}>
<div style={styles.header}>
<h1 style={styles.title}>Premium AI Feed</h1>
<a href="/video" style={styles.linkButton}>
Video
</a>
</div>

{loading ? <p style={styles.info}>Loading feed...</p> : null}
{error ? <p style={styles.error}>{error}</p> : null}
{!loading && !error && posts.length === 0 ? (
<p style={styles.info}>No posts yet.</p>
) : null}

<div style={styles.feedWrap}>
{posts.map((post) => (
<div key={post.id} style={styles.card}>
<div style={styles.mediaWrap}>
{post.video_url ? (
<video
src={post.video_url}
controls
playsInline
style={styles.media}
/>
) : post.image_url ? (
<img src={post.image_url} alt="post" style={styles.media} />
) : (
<div style={styles.emptyMedia}>No media</div>
)}
</div>

<div style={styles.cardBody}>
<p style={styles.prompt}>{post.prompt || "Untitled post"}</p>
<p style={styles.date}>
{post.created_at
? new Date(post.created_at).toLocaleString()
: ""}
</p>
</div>
</div>
))}
</div>
</main>
);
}

const styles: Record<string, React.CSSProperties> = {
page: {
minHeight: "100vh",
background:
"linear-gradient(180deg, #0f172a 0%, #142850 45%, #1e3a8a 100%)",
padding: "24px",
},
header: {
maxWidth: "1100px",
margin: "0 auto 24px",
display: "flex",
alignItems: "center",
justifyContent: "space-between",
gap: "16px",
},
title: {
color: "white",
fontSize: "42px",
fontWeight: 900,
margin: 0,
},
linkButton: {
textDecoration: "none",
background: "linear-gradient(135deg, #60a5fa, #2563eb)",
color: "white",
fontWeight: 800,
padding: "12px 20px",
borderRadius: "14px",
},
info: {
maxWidth: "1100px",
margin: "0 auto 16px",
color: "white",
fontSize: "16px",
},
error: {
maxWidth: "1100px",
margin: "0 auto 16px",
color: "#fecaca",
background: "rgba(127,29,29,0.4)",
padding: "12px 14px",
borderRadius: "12px",
},
feedWrap: {
maxWidth: "1100px",
margin: "0 auto",
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
gap: "20px",
},
card: {
background: "rgba(15,23,42,0.85)",
border: "1px solid rgba(255,255,255,0.12)",
borderRadius: "22px",
overflow: "hidden",
boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
},
mediaWrap: {
width: "100%",
aspectRatio: "9 / 16",
background: "#0b1120",
display: "flex",
alignItems: "center",
justifyContent: "center",
},
media: {
width: "100%",
height: "100%",
objectFit: "cover",
display: "block",
},
emptyMedia: {
color: "rgba(255,255,255,0.55)",
fontSize: "15px",
},
cardBody: {
padding: "16px",
},
prompt: {
color: "white",
fontSize: "16px",
fontWeight: 700,
margin: "0 0 8px",
lineHeight: 1.4,
},
date: {
color: "rgba(255,255,255,0.65)",
fontSize: "13px",
margin: 0,
},
};
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Post = {
id: string;
caption?: string | null;
image_url?: string | null;
video_url?: string | null;
likes?: number | null;
created_at?: string | null;
};

export default function FeedPage() {
const [posts, setPosts] = useState<Post[]>([]);
const [loading, setLoading] = useState(true);

const loadPosts = async () => {
setLoading(true);

let { data, error } = await supabase
.from("Posts")
.select("*")
.order("created_at", { ascending: false });

if (error || !data) {
const fallback = await supabase
.from("Posts")
.select("*");

data = fallback.data || [];
}

setPosts(data || []);
setLoading(false);
};

useEffect(() => {
loadPosts();
}, []);

const likePost = async (post: Post) => {
const currentLikes = post.likes || 0;
const newLikes = currentLikes + 1;

let { error } = await supabase
.from("Posts")
.update({ likes: newLikes })
.eq("id", post.id);

if (error) {
await supabase
.from("Posts")
.update({ Likes: newLikes })
.eq("id", post.id);
}

setPosts((prev) =>
prev.map((p) =>
p.id === post.id ? { ...p, likes: newLikes } : p
)
);
};

return (
<main style={styles.page}>
<div style={styles.topBar}>
<div>
<h1 style={styles.title}>AdForge Feed</h1>
<p style={styles.subtitle}>Swipe up and down through your AI posts</p>
</div>

<a href="/" style={styles.backButton}>
Back to Generator
</a>
</div>

{loading ? (
<div style={styles.loadingWrap}>
<div style={styles.loadingText}>Loading feed...</div>
</div>
) : posts.length === 0 ? (
<div style={styles.loadingWrap}>
<div style={styles.loadingText}>No posts yet. Generate one and post it.</div>
</div>
) : (
<div style={styles.feedWrap}>
{posts.map((post) => {
const imageUrl =
post.image_url ||
(post as any).Image_url ||
null;

const videoUrl =
post.video_url ||
(post as any).Video_url ||
null;

const caption =
post.caption ||
(post as any).Caption ||
"AI post";

const likes =
post.likes ??
(post as any).Likes ??
0;

return (
<section key={post.id} style={styles.card}>
<div style={styles.mediaWrap}>
{videoUrl ? (
<video
src={videoUrl}
controls
playsInline
autoPlay
muted
loop
style={styles.media}
/>
) : imageUrl ? (
<img
src={imageUrl}
alt={caption}
style={styles.media}
/>
) : (
<div style={styles.emptyMedia}>No media found</div>
)}

<div style={styles.overlay}>
<div style={styles.captionWrap}>
<h2 style={styles.caption}>{caption}</h2>

<div style={styles.actions}>
<button
onClick={() => likePost(post)}
style={styles.actionButton}
>
❤️ {likes}
</button>

<button style={styles.actionButton}>
💬 0
</button>
</div>
</div>
</div>
</div>
</section>
);
})}
</div>
)}
</main>
);
}

const styles: Record<string, React.CSSProperties> = {
page: {
minHeight: "100vh",
background: "linear-gradient(180deg, #0f172a 0%, #1d4ed8 100%)",
color: "white",
padding: "20px",
},
topBar: {
display: "flex",
justifyContent: "space-between",
alignItems: "flex-start",
gap: "16px",
flexWrap: "wrap",
marginBottom: "18px",
},
title: {
fontSize: "58px",
lineHeight: 1,
margin: 0,
fontWeight: 900,
},
subtitle: {
marginTop: "8px",
marginBottom: 0,
fontSize: "18px",
color: "rgba(255,255,255,0.82)",
},
backButton: {
textDecoration: "none",
color: "white",
background: "rgba(255,255,255,0.12)",
border: "1px solid rgba(255,255,255,0.2)",
borderRadius: "18px",
padding: "14px 18px",
fontWeight: 800,
display: "inline-block",
},
loadingWrap: {
minHeight: "60vh",
display: "flex",
alignItems: "center",
justifyContent: "center",
},
loadingText: {
fontSize: "24px",
fontWeight: 800,
},
feedWrap: {
height: "calc(100vh - 150px)",
overflowY: "auto",
scrollSnapType: "y mandatory",
borderRadius: "24px",
},
card: {
height: "calc(100vh - 150px)",
scrollSnapAlign: "start",
paddingBottom: "18px",
},
mediaWrap: {
position: "relative",
width: "100%",
height: "100%",
borderRadius: "28px",
overflow: "hidden",
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.12)",
},
media: {
width: "100%",
height: "100%",
objectFit: "cover",
display: "block",
background: "#0b1220",
},
emptyMedia: {
width: "100%",
height: "100%",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontSize: "24px",
fontWeight: 800,
},
overlay: {
position: "absolute",
left: 0,
right: 0,
bottom: 0,
padding: "26px 20px 24px",
background:
"linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.75) 100%)",
},
captionWrap: {
maxWidth: "700px",
},
caption: {
margin: 0,
fontSize: "46px",
lineHeight: 1,
fontWeight: 900,
textShadow: "0 3px 10px rgba(0,0,0,0.5)",
},
actions: {
display: "flex",
gap: "12px",
marginTop: "18px",
flexWrap: "wrap",
},
actionButton: {
border: "none",
background: "rgba(255,255,255,0.14)",
color: "white",
borderRadius: "999px",
padding: "12px 18px",
fontSize: "20px",
fontWeight: 800,
cursor: "pointer",
},
};
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type PostRow = {
id?: string;
Id?: string;
caption?: string;
Caption?: string;
image_url?: string;
Image_url?: string;
likes?: number;
Likes?: number;
created_at?: string;
};

type CommentRow = {
id?: string;
post_id?: string;
body?: string;
created_at?: string;
};

export default function FeedPage() {
const [posts, setPosts] = useState<PostRow[]>([]);
const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
const [loading, setLoading] = useState(true);
const [likingId, setLikingId] = useState<string | null>(null);
const [errorMessage, setErrorMessage] = useState("");

const loadPosts = async () => {
setLoading(true);
setErrorMessage("");

const { data, error } = await supabase
.from("Posts")
.select("*")
.order("created_at", { ascending: false });

if (error) {
setErrorMessage(error.message);
setPosts([]);
setLoading(false);
return;
}

const safePosts = data || [];
setPosts(safePosts);
await loadCommentCounts(safePosts);
setLoading(false);
};

const loadCommentCounts = async (postRows: PostRow[]) => {
const { data, error } = await supabase.from("comments").select("post_id");

if (error || !data) {
setCommentCounts({});
return;
}

const counts: Record<string, number> = {};

for (const row of data as CommentRow[]) {
if (!row.post_id) continue;
counts[row.post_id] = (counts[row.post_id] || 0) + 1;
}

const normalized: Record<string, number> = {};

for (const post of postRows) {
const postId = getPostId(post);
if (!postId) continue;
normalized[postId] = counts[postId] || 0;
}

setCommentCounts(normalized);
};

useEffect(() => {
loadPosts();
}, []);

const handleLike = async (post: PostRow) => {
const postId = getPostId(post);
if (!postId) return;

const currentLikes = getPostLikes(post);
const newLikes = currentLikes + 1;

setLikingId(postId);

const { error } = await supabase
.from("Posts")
.update({ likes: newLikes })
.eq("id", postId);

if (error) {
const retryError = await supabase
.from("Posts")
.update({ Likes: newLikes })
.eq("id", postId);

if (retryError.error) {
alert(retryError.error.message);
setLikingId(null);
return;
}
}

setPosts((prev) =>
prev.map((item) => {
const itemId = getPostId(item);
if (itemId !== postId) return item;

return {
...item,
likes: newLikes,
Likes: newLikes,
};
})
);

setLikingId(null);
};

return (
<main style={styles.page}>
<div style={styles.headerRow}>
<div>
<h1 style={styles.title}>AdForge Feed</h1>
<p style={styles.subtitle}>Your saved AI posts, live in one premium feed</p>
</div>

<a href="/" style={styles.backButton}>
Back to Generator
</a>
</div>

{loading ? (
<div style={styles.statusBox}>Loading feed...</div>
) : errorMessage ? (
<div style={styles.errorBox}>Error loading posts: {errorMessage}</div>
) : posts.length === 0 ? (
<div style={styles.statusBox}>No posts yet. Go back and post your first image.</div>
) : (
<div style={styles.feedWrap}>
{posts.map((post) => {
const postId = getPostId(post);
const caption = getPostCaption(post);
const imageUrl = getPostImage(post);
const likes = getPostLikes(post);
const comments = postId ? commentCounts[postId] || 0 : 0;

return (
<div key={postId || Math.random()} style={styles.card}>
{imageUrl ? (
<img src={imageUrl} alt={caption} style={styles.cardImage} />
) : (
<div style={styles.noImage}>No image</div>
)}

<div style={styles.overlay}>
<div style={styles.caption}>{caption || "No caption"}</div>

<div style={styles.metaRow}>
<button
onClick={() => handleLike(post)}
style={styles.iconButton}
disabled={likingId === postId}
>
❤️ {likes}
</button>

<div style={styles.metaPill}>💬 {comments}</div>
</div>
</div>
</div>
);
})}
</div>
)}
</main>
);
}

function getPostId(post: PostRow) {
return post.id || post.Id || "";
}

function getPostCaption(post: PostRow) {
return post.caption || post.Caption || "";
}

function getPostImage(post: PostRow) {
return post.image_url || post.Image_url || "";
}

function getPostLikes(post: PostRow) {
if (typeof post.likes === "number") return post.likes;
if (typeof post.Likes === "number") return post.Likes;
return 0;
}

const styles: Record<string, React.CSSProperties> = {
page: {
minHeight: "100vh",
background: "linear-gradient(180deg, #0f172a 0%, #1d4ed8 100%)",
padding: "24px",
color: "white",
},
headerRow: {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
gap: "16px",
marginBottom: "24px",
flexWrap: "wrap",
},
title: {
fontSize: "58px",
fontWeight: 900,
margin: 0,
lineHeight: 1,
},
subtitle: {
marginTop: "8px",
marginBottom: 0,
fontSize: "18px",
opacity: 0.85,
},
backButton: {
textDecoration: "none",
color: "white",
background: "rgba(255,255,255,0.12)",
border: "1px solid rgba(255,255,255,0.18)",
borderRadius: "16px",
padding: "14px 18px",
fontWeight: 700,
},
feedWrap: {
display: "flex",
flexDirection: "column",
gap: "26px",
alignItems: "center",
},
card: {
width: "100%",
maxWidth: "720px",
borderRadius: "28px",
overflow: "hidden",
position: "relative",
background: "rgba(255,255,255,0.08)",
boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
},
cardImage: {
width: "100%",
display: "block",
maxHeight: "900px",
objectFit: "cover",
background: "#111827",
},
overlay: {
position: "absolute",
left: 0,
right: 0,
bottom: 0,
padding: "22px",
background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.75) 100%)",
},
caption: {
fontSize: "30px",
fontWeight: 800,
marginBottom: "12px",
textShadow: "0 2px 10px rgba(0,0,0,0.35)",
},
metaRow: {
display: "flex",
gap: "12px",
alignItems: "center",
},
iconButton: {
border: "none",
borderRadius: "999px",
padding: "10px 16px",
fontSize: "18px",
fontWeight: 700,
cursor: "pointer",
background: "rgba(255,255,255,0.15)",
color: "white",
},
metaPill: {
borderRadius: "999px",
padding: "10px 16px",
fontSize: "18px",
fontWeight: 700,
background: "rgba(255,255,255,0.15)",
color: "white",
},
statusBox: {
maxWidth: "720px",
margin: "40px auto 0 auto",
background: "rgba(255,255,255,0.08)",
borderRadius: "24px",
padding: "30px",
fontSize: "24px",
fontWeight: 700,
textAlign: "center",
},
errorBox: {
maxWidth: "720px",
margin: "40px auto 0 auto",
background: "rgba(255,255,255,0.08)",
borderRadius: "24px",
padding: "30px",
fontSize: "22px",
fontWeight: 700,
textAlign: "center",
color: "#fecaca",
},
noImage: {
minHeight: "520px",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontSize: "28px",
fontWeight: 700,
background: "rgba(255,255,255,0.08)",
},
};
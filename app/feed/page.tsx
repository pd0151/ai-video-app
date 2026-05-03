"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

type Post = {
id: string;
content: string | null;
image_url: string | null;
video_url: string | null;
business_name: string | null;
phone: string | null;
whatsapp: string | null;
website: string | null;
location: string | null;
created_at: string | null;
};

type Comment = {
id: string;
post_id: string;
content: string;
created_at: string | null;
};

export default function FeedPage() {
const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
const [posts, setPosts] = useState<Post[]>([]);
const [loading, setLoading] = useState(true);
const [liked, setLiked] = useState<Record<string, boolean>>({});
const [activeVideo, setActiveVideo] = useState<string | null>(null);

const [commentPost, setCommentPost] = useState<Post | null>(null);
const [comments, setComments] = useState<Comment[]>([]);
const [commentText, setCommentText] = useState("");

async function loadPosts() {
const { data, error } = await supabase
.from("posts")
.select("id, content, image_url, video_url, business_name, phone, whatsapp, website, location, created_at")
.order("created_at", { ascending: false })
.limit(20);

if (error) {
console.log("Feed error:", error.message);
setPosts([]);
setLoading(false);
return;
}

setPosts((data || []).filter((p) => p.image_url || p.video_url || p.content));
setLoading(false);
}

async function loadComments(postId: string) {
const { data } = await supabase
.from("comments")
.select("id, post_id, content, created_at")
.eq("post_id", postId)
.order("created_at", { ascending: false });

setComments(data || []);
}

async function openComments(post: Post) {
setCommentPost(post);
await loadComments(post.id);
}

async function sendComment() {
if (!commentPost || !commentText.trim()) return;

const { error } = await supabase.from("comments").insert({
post_id: commentPost.id,
content: commentText.trim(),
created_at: new Date().toISOString(),
});

if (error) {
alert(error.message);
return;
}

setCommentText("");
await loadComments(commentPost.id);
alert("comment posted");
}

useEffect(() => {
loadPosts();
}, []);

useEffect(() => {
const observer = new IntersectionObserver(
(entries) => {
entries.forEach((entry) => {
const video = entry.target as HTMLVideoElement;
const id = video.dataset.id;

if (entry.isIntersecting) {
setActiveVideo(id || null);
video.play().catch(() => {});
} else {
video.pause();
}
});
},
{ threshold: 0.7 }
);

Object.entries(videoRefs.current).forEach(([id, video]) => {
if (video) {
video.dataset.id = id;
observer.observe(video);
}
});

return () => observer.disconnect();
}, [posts]);

function sharePost(post: Post) {
if (navigator.share) {
navigator.share({
title: post.business_name || "AdForge",
text: post.content || "Check this out",
url: window.location.href,
});
} else {
navigator.clipboard.writeText(window.location.href);
alert("Link copied");
}
}

if (loading) {
return <main style={empty}><h1>Loading feed...</h1></main>;
}

if (posts.length === 0) {
return <main style={empty}><h1>No posts yet</h1><p>Create or upload an ad and share it to the feed.</p></main>;
}

return (
<main style={page}>
<div style={topTabs}>
<button style={activeTab}>For You</button>
<button style={tab}>Following</button>
</div>

{posts.map((post) => {
const phone = post.phone || post.whatsapp || "";
const whatsapp = phone.replace("+", "").replace(/\s/g, "");

return (
<section key={post.id} style={slide}>
{post.video_url ? (
<video
ref={(el) => {
videoRefs.current[post.id] = el;
}}
src={post.video_url}
autoPlay
muted={activeVideo !== post.id}
loop
playsInline
preload="auto"
style={media}
onClick={(e) => {
e.currentTarget.muted = !e.currentTarget.muted;
}}
/>
) : (
<img src={post.image_url || ""} style={media} />
)}

<div style={overlay} />

<div style={content}>
<h1 style={headline}>
PREMIUM TYRE <span style={purple}>FITTING</span>
<br />
AT YOUR DOORSTEP
</h1>

<div style={checks}>
<p>✓ Fast Service</p>
<p>✓ Expert Fitters</p>
<p>✓ Best Prices</p>
</div>

<div style={businessRow}>
<div style={avatar}>T</div>
<div>
<b>{post.business_name || "Total Tyres 247"}</b>
<p style={small}>{post.location || "Liverpool"}</p>
</div>
</div>

<p style={caption}>{post.content || "Uploaded media"}</p>

{phone && <a href={`tel:${phone}`} style={bookBtn}>Book Now</a>}
</div>

<div style={rightActions}>
<button
onClick={() => setLiked((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
style={circleBtn}
>
{liked[post.id] ? "❤️" : "🤍"}
</button>
<span style={count}>{liked[post.id] ? "1.3K" : "1.2K"}</span>

<button onClick={() => openComments(post)} style={circleBtn}>💬</button>
<span style={count}>Comments</span>

<button onClick={() => sharePost(post)} style={circleBtn}>↗</button>
<span style={count}>Share</span>

{whatsapp && (
<a href={`https://wa.me/${whatsapp}`} target="_blank" style={musicBtn}>💬</a>
)}
</div>
</section>
);
})}

{commentPost && (
<div style={commentOverlay}>
<div style={commentBox}>
<button onClick={() => setCommentPost(null)} style={closeBtn}>×</button>
<h2>Comments</h2>

<div style={commentList}>
{comments.length === 0 ? (
<p style={{ opacity: 0.7 }}>No comments yet.</p>
) : (
comments.map((c) => (
<div key={c.id} style={commentCard}>
<b>User</b>
<p>{c.content}</p>
</div>
))
)}
</div>

<div style={commentInputRow}>
<input
value={commentText}
onChange={(e) => setCommentText(e.target.value)}
placeholder="Write a comment..."
style={commentInput}
/>
<button onClick={sendComment} style={sendBtn}>Send</button>
</div>
</div>
</div>
)}
</main>
);
}

const page: React.CSSProperties = {
height: "100vh",
overflowY: "scroll",
scrollSnapType: "y mandatory",
background: "#020617",
color: "white",
fontFamily: "Arial, sans-serif",
};

const empty: React.CSSProperties = {
height: "100vh",
display: "flex",
flexDirection: "column",
justifyContent: "center",
alignItems: "center",
color: "white",
background: "#020617",
textAlign: "center",
padding: 30,
};

const topTabs: React.CSSProperties = {
position: "fixed",
top: 48,
left: 0,
right: 0,
zIndex: 20,
display: "flex",
justifyContent: "center",
gap: 34,
};

const tab: React.CSSProperties = {
background: "transparent",
border: "none",
color: "rgba(255,255,255,0.55)",
fontSize: 17,
fontWeight: 800,
};

const activeTab: React.CSSProperties = {
...tab,
color: "white",
borderBottom: "2px solid white",
paddingBottom: 8,
};

const slide: React.CSSProperties = {
height: "100vh",
scrollSnapAlign: "start",
position: "relative",
overflow: "hidden",
};

const media: React.CSSProperties = {
width: "100%",
height: "100%",
objectFit: "contain",
background: "#000",
};

const overlay: React.CSSProperties = {
position: "absolute",
inset: 0,
background: "linear-gradient(to top, rgba(0,0,0,0.92), rgba(0,0,0,0.18), rgba(0,0,0,0.55))",
};

const content: React.CSSProperties = {
position: "absolute",
left: 24,
right: 92,
bottom: 135,
zIndex: 5,
};

const headline: React.CSSProperties = {
fontSize: 34,
lineHeight: 1.05,
fontWeight: 950,
margin: 0,
};

const purple: React.CSSProperties = {
color: "#a855f7",
};

const checks: React.CSSProperties = {
marginTop: 18,
fontSize: 15,
lineHeight: 1.4,
};

const businessRow: React.CSSProperties = {
display: "flex",
alignItems: "center",
gap: 10,
marginTop: 20,
};

const avatar: React.CSSProperties = {
width: 36,
height: 36,
borderRadius: "50%",
background: "linear-gradient(135deg,#6366f1,#a855f7)",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontWeight: 900,
};

const small: React.CSSProperties = {
margin: 0,
opacity: 0.75,
fontSize: 13,
};

const caption: React.CSSProperties = {
fontSize: 15,
lineHeight: 1.35,
maxWidth: 280,
};

const bookBtn: React.CSSProperties = {
display: "inline-block",
marginTop: 6,
padding: "12px 28px",
borderRadius: 10,
background: "linear-gradient(90deg,#7c3aed,#a855f7)",
color: "white",
textDecoration: "none",
fontWeight: 900,
};

const rightActions: React.CSSProperties = {
position: "absolute",
right: 16,
bottom: 145,
zIndex: 7,
display: "flex",
flexDirection: "column",
alignItems: "center",
gap: 8,
};

const circleBtn: React.CSSProperties = {
width: 54,
height: 54,
borderRadius: "50%",
border: "1px solid rgba(255,255,255,0.12)",
background: "rgba(0,0,0,0.45)",
color: "white",
fontSize: 24,
backdropFilter: "blur(10px)",
};

const musicBtn: React.CSSProperties = {
...circleBtn,
marginTop: 8,
background: "rgba(124,58,237,0.45)",
display: "flex",
alignItems: "center",
justifyContent: "center",
textDecoration: "none",
};

const count: React.CSSProperties = {
fontSize: 12,
fontWeight: 800,
};

const commentOverlay: React.CSSProperties = {
position: "fixed",
inset: 0,
zIndex: 99999,
background: "rgba(0,0,0,0.55)",
display: "flex",
alignItems: "block",
};

const commentBox: React.CSSProperties = {
width: "100%",
height: "60vh",
bottom: 0,
left: 0,
right: 0,
position: "fixed", // IMPORTANT
display: "flex",
flexDirection: "column",
borderTopLeftRadius: 28,
borderTopRightRadius: 28,
background: "#111827",
padding: 22,
color: "white",
borderTop: "1px solid rgba(255,255,255,0.15)",
};

const closeBtn: React.CSSProperties = {
float: "right",
background: "rgba(255,255,255,0.12)",
color: "white",
border: "none",
borderRadius: 999,
width: 34,
height: 34,
fontSize: 24,
};

const commentList: React.CSSProperties = {
flex: 1,
overflowY: "auto",
marginTop: 14,
paddingBottom: 120, // space for input
};

const commentCard: React.CSSProperties = {
padding: 14,
borderRadius: 16,
background: "rgba(255,255,255,0.08)",
marginBottom: 10,
};

const commentInputRow: React.CSSProperties = {
position: "absolute",
left: 16,
right: 16,
bottom: 16,
display: "flex",
gap: 10,
};


const commentInput: React.CSSProperties = {
flex: 1,
borderRadius: 16,
border: "1px solid rgba(255,255,255,0.15)",
background: "rgba(255,255,255,0.08)",
color: "white",
padding: 14,
};

const sendBtn: React.CSSProperties = {
border: "none",
borderRadius: 16,
background: "linear-gradient(90deg,#7c3aed,#a855f7)",
color: "white",
padding: "0 18px",
fontWeight: 900,
};
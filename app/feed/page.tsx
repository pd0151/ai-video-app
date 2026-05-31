"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

type Post = {
id: string;
user_id?: string | null;
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

const green = "#45ff8a";
const glass = "rgba(4,8,14,0.72)";
const border = "1px solid rgba(255,255,255,0.16)";
const glow = "0 0 24px rgba(69,255,138,0.28)";

export default function FeedPage() {
const router = useRouter();
const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

const [posts, setPosts] = useState<Post[]>(() => {
if (typeof window === "undefined") return [];
try {
return JSON.parse(localStorage.getItem("cached_feed_posts") || "[]");
} catch {
return [];
}
});

const [fetched, setFetched] = useState(false);
const [liked, setLiked] = useState<Record<string, boolean>>({});
const [openMedia, setOpenMedia] = useState<string | null>(null);
const [commentPost, setCommentPost] = useState<Post | null>(null);
const [comments, setComments] = useState<Comment[]>([]);
const [commentText, setCommentText] = useState("");
const [loadingPosts, setLoadingPosts] = useState(true);
const [loading, setLoading] = useState(true);

async function loadPosts() {
try {
setLoadingPosts(true);

const { data, error } = await supabase
.from("posts")
.select(
"id,user_id,content,image_url,video_url,business_name,phone,whatsapp,website,location,created_at"
)
.order("created_at", { ascending: false })
.limit(6);

if (error) {
alert("Feed error: " + error.message);
setPosts([]);
setLoadingPosts(false);
return;
}

const freshPosts = (data || []).filter((p) => p.image_url || p.video_url);
setPosts(freshPosts);
setLoadingPosts(false);

try {
localStorage.setItem(
"cached_feed_posts",
JSON.stringify(
freshPosts.map((p) => ({
...p,
image_url: p.image_url?.startsWith("data:") ? null : p.image_url,
}))
)
);
} catch {
console.log("Feed cache skipped");
}

setFetched(true);
} catch (err) {
console.log("LOAD POSTS CRASH:", err);
alert("Feed crashed. Check console.");
setPosts([]);
} finally {
setLoading(false);
}
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

if (!loading && posts.length === 0 && fetched) {
return (
<main style={empty}>
<h1 style={{ margin: 0 }}>No posts yet</h1>
<p style={{ opacity: 0.7 }}>Create or upload an ad and share it to the feed.</p>
</main>
);
}

return (
<main style={page}>
<header style={topHeader}>
<div style={brandLabel}>AI ADVERTISING PLATFORM</div>
<h1 style={logo}>AdForge</h1>
</header>

{posts.map((post) => {
const phone = post.phone || post.whatsapp || "";
const whatsapp = phone.replace("+", "").replace(/\s/g, "");
const mediaUrl = post.video_url || post.image_url || "";

return (
<section key={post.id} style={slide}>
<div style={postFrame}>
{post.video_url && !post.image_url ? (
<video
ref={(el) => {
videoRefs.current[post.id] = el;
}}
src={post.video_url}
autoPlay
muted
loop
playsInline
preload="auto"
onClick={() => mediaUrl && setOpenMedia(mediaUrl)}
style={media}
/>
) : (
<img
src={post.image_url || ""}
alt="post"
onClick={() => post.image_url && setOpenMedia(post.image_url)}
loading="eager"
decoding="async"
style={media}
/>
)}

<div style={darkOverlay} />
<div style={bottomFade} />

<div style={advertContent}>
<div style={businessMini}>
<div style={miniAvatar}>
{(post.business_name || "A").charAt(0).toUpperCase()}
</div>
<div>
<b>{post.business_name || "AdForge Business"}</b>
<p style={small}>{post.location || "Local area"}</p>
</div>
</div>

<h2 style={headline}>
MOBILE TYRE FITTING
<span> AT YOUR DOORSTEP</span>
</h2>

<div style={checks}>
<p>✓ Fast Service</p>
<p>✓ Expert Fitters</p>
<p>✓ Best Prices</p>
</div>

<p style={caption}>{post.content || "Uploaded media"}</p>

{phone && (
<a href={`tel:${phone}`} style={bookBtn}>
Book Now
</a>
)}
</div>

<div
style={{ ...businessTap, cursor: "pointer" }}
onClick={() => {
if (post.user_id) router.push(`/profile/${post.user_id}`);
}}
/>

<div style={rightActions}>
<button
onClick={() =>
setLiked((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
}
style={circleBtn}
>
♥
</button>
<span style={count}>{liked[post.id] ? "1.3K" : "1.2K"}</span>

<button onClick={() => openComments(post)} style={circleBtn}>
●●●
</button>
<span style={count}>Comments</span>

<button onClick={() => sharePost(post)} style={circleBtn}>
↗
</button>
<span style={count}>Share</span>

{whatsapp && (
<a href={`https://wa.me/${whatsapp}`} target="_blank" style={musicBtn}>
☎
</a>
)}
</div>
</div>
</section>
);
})}

{openMedia && (
<div onClick={() => setOpenMedia(null)} style={mediaPopup}>
<button
onClick={(e) => {
e.stopPropagation();
setOpenMedia(null);
}}
style={mediaCloseBtn}
>
×
</button>
<img src={openMedia} style={mediaPopupImg} />
</div>
)}

{commentPost && (
<div style={commentOverlay}>
<div style={commentBox}>
<button onClick={() => setCommentPost(null)} style={closeBtn}>
×
</button>

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
<button onClick={sendComment} style={sendBtn}>
Send
</button>
</div>
</div>
</div>
)}

<nav style={bottomNav}>
<button style={navBtn}>⌂<br />Home</button>
<button style={navActive}>▣<br />Feed</button>
<button style={plusBtn}>+</button>
<button style={navBtn}>✧<br />AI</button>
<button style={navBtn}>◎<br />Profile</button>
</nav>
</main>
);
}

const page: CSSProperties = {
height: "100dvh",
overflowY: "scroll",
scrollSnapType: "y mandatory",
scrollBehavior: "smooth",
WebkitOverflowScrolling: "touch",
background: "#05070d",
color: "white",
fontFamily: "Inter, Arial, sans-serif",
position: "relative",
};

const topHeader: CSSProperties = {
position: "fixed",
top: 26,
left: 28,
zIndex: 100,
pointerEvents: "none",
};

const brandLabel: CSSProperties = {
fontSize: 10,
letterSpacing: 3.5,
color: "rgba(255,255,255,0.50)",
fontWeight: 900,
};

const logo: CSSProperties = {
margin: "4px 0 0",
fontSize: 30,
fontWeight: 950,
letterSpacing: -2,
};

const slide: CSSProperties = {
height: "100dvh",
width: "100vw",
position: "relative",
overflow: "hidden",
scrollSnapAlign: "start",
margin: 0,
padding: 0,
};

const postFrame: CSSProperties = {
position: "absolute",
inset: 0,
height: "100%",
width: "100%",
overflow: "hidden",
background: "#05070d",
};

const media: CSSProperties = {
position: "absolute",
inset: 0,
width: "100%",
height: "100%",
objectFit: "cover",
objectPosition: "center",
zIndex: 1,
};

const darkOverlay: CSSProperties = {
position: "absolute",
inset: 0,
background:
"linear-gradient(90deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.18) 48%, rgba(0,0,0,0.45) 100%)",
zIndex: 2,
pointerEvents: "none",
};

const bottomFade: CSSProperties = {
position: "absolute",
left: 0,
right: 0,
bottom: 0,
height: "48%",
background:
"linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.72) 36%, rgba(0,0,0,0.18) 72%, transparent 100%)",
zIndex: 3,
pointerEvents: "none",
};

const advertContent: CSSProperties = {
position: "absolute",
left: 24,
right: 92,
bottom: 118,
zIndex: 8,
};

const businessMini: CSSProperties = {
display: "flex",
alignItems: "center",
gap: 10,
marginBottom: 12,
};

const miniAvatar: CSSProperties = {
width: 34,
height: 34,
borderRadius: "50%",
background: "linear-gradient(135deg,#162033,#05070d)",
border,
display: "flex",
alignItems: "center",
justifyContent: "center",
fontWeight: 950,
boxShadow: glow,
};

const small: CSSProperties = {
margin: "2px 0 0",
color: "rgba(255,255,255,0.72)",
fontSize: 13,
};

const headline: CSSProperties = {
margin: "0 0 12px",
fontSize: 26,
lineHeight: 1.02,
fontWeight: 1000,
letterSpacing: -0.8,
textTransform: "uppercase",
textShadow: "0 3px 18px rgba(0,0,0,0.7)",
};

const checks: CSSProperties = {
display: "grid",
gap: 7,
marginBottom: 12,
fontSize: 14,
fontWeight: 750,
};

const caption: CSSProperties = {
fontSize: 14,
lineHeight: 1.35,
maxWidth: 280,
margin: "0 0 12px",
color: "rgba(255,255,255,0.92)",
display: "-webkit-box",
WebkitLineClamp: 2,
WebkitBoxOrient: "vertical",
overflow: "hidden",
};

const bookBtn: CSSProperties = {
display: "inline-block",
padding: "11px 26px",
borderRadius: 12,
background: `linear-gradient(135deg, ${green}, #9bffbf)`,
color: "#031006",
textDecoration: "none",
fontWeight: 950,
border: "1px solid rgba(255,255,255,0.55)",
boxShadow: glow,
};

const businessTap: CSSProperties = {
position: "absolute",
left: 20,
bottom: 118,
width: 260,
height: 190,
zIndex: 9,
background: "transparent",
};

const rightActions: CSSProperties = {
position: "absolute",
right: 17,
bottom: 160,
zIndex: 12,
display: "flex",
flexDirection: "column",
alignItems: "center",
gap: 7,
};

const circleBtn: CSSProperties = {
width: 48,
height: 48,
borderRadius: "50%",
border,
background: glass,
color: "white",
fontSize: 23,
fontWeight: 950,
backdropFilter: "blur(14px)",
boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
};

const musicBtn: CSSProperties = {
...circleBtn,
marginTop: 8,
color: "white",
display: "flex",
alignItems: "center",
justifyContent: "center",
textDecoration: "none",
};

const count: CSSProperties = {
fontSize: 12,
fontWeight: 900,
textShadow: "0 2px 8px rgba(0,0,0,0.7)",
};

const empty: CSSProperties = {
height: "100vh",
display: "flex",
flexDirection: "column",
justifyContent: "center",
alignItems: "center",
color: "white",
background: "#05070d",
textAlign: "center",
padding: 30,
};

const mediaPopup: CSSProperties = {
position: "fixed",
inset: 0,
zIndex: 999999,
background: "black",
display: "flex",
alignItems: "center",
justifyContent: "center",
padding: 10,
};

const mediaPopupImg: CSSProperties = {
maxWidth: "100%",
maxHeight: "100%",
objectFit: "contain",
};

const mediaCloseBtn: CSSProperties = {
position: "absolute",
top: 28,
right: 22,
zIndex: 1000000,
width: 44,
height: 44,
borderRadius: "50%",
border,
background: glass,
color: "white",
fontSize: 30,
fontWeight: 900,
};

const commentOverlay: CSSProperties = {
position: "fixed",
inset: 0,
zIndex: 99999,
background: "rgba(0,0,0,0.55)",
display: "flex",
alignItems: "flex-end",
};

const commentBox: CSSProperties = {
width: "100%",
height: "58vh",
display: "flex",
flexDirection: "column",
borderTopLeftRadius: 28,
borderTopRightRadius: 28,
background: "rgba(8,12,22,0.96)",
padding: 22,
color: "white",
borderTop: border,
};

const closeBtn: CSSProperties = {
background: glass,
color: "white",
border,
borderRadius: 999,
width: 34,
height: 34,
fontSize: 24,
};

const commentList: CSSProperties = {
flex: 1,
overflowY: "auto",
marginTop: 14,
paddingBottom: 100,
};

const commentCard: CSSProperties = {
padding: 14,
borderRadius: 16,
background: glass,
border,
marginBottom: 10,
};

const commentInputRow: CSSProperties = {
display: "flex",
gap: 10,
marginTop: "auto",
paddingTop: 10,
background: "rgba(8,12,22,0.96)",
};

const commentInput: CSSProperties = {
flex: 1,
borderRadius: 16,
border,
background: glass,
color: "white",
padding: 14,
};

const sendBtn: CSSProperties = {
border: "none",
borderRadius: 16,
background: green,
color: "#031006",
padding: "0 18px",
fontWeight: 950,
};

const bottomNav: CSSProperties = {
position: "fixed",
bottom: 10,
left: 22,
right: 22,
height: 64,
display: "flex",
justifyContent: "space-around",
alignItems: "center",
background: "rgba(4,9,18,0.80)",
border: "1px solid rgba(69,255,138,0.22)",
borderRadius: 26,
backdropFilter: "blur(18px)",
boxShadow: "0 0 26px rgba(69,255,138,0.18)",
zIndex: 999,
};

const navBtn: CSSProperties = {
border: "none",
background: "transparent",
color: "rgba(255,255,255,0.62)",
fontWeight: 850,
fontSize: 12,
};

const navActive: CSSProperties = {
...navBtn,
color: "white",
};

const plusBtn: CSSProperties = {
width: 72,
height: 72,
borderRadius: "50%",
border: `2px solid ${green}`,
background: "linear-gradient(180deg,#ffffff,#eaf0ff)",
color: "#05070d",
fontSize: 42,
fontWeight: 400,
marginTop: -42,
boxShadow: `0 0 30px rgba(69,255,138,0.65)`,
display: "flex",
alignItems: "center",
justifyContent: "center",
};
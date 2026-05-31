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

const xeonBorder = "1px solid rgba(220,235,255,0.28)";
const xeonGlow =
"0 0 3px rgba(255,255,255,0.55), 0 0 22px rgba(220,235,255,0.28), 0 0 60px rgba(120,160,255,0.16)";
const glassBg = "rgba(8,12,22,0.78)";

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
const [activeVideo, setActiveVideo] = useState<string | null>(null);
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

if (!loading && posts.length === 0 && fetched) {
return (
<main style={empty}>
<div>
<h1 style={{ margin: 0 }}>No posts yet</h1>
<p style={{ opacity: 0.7 }}>Create or upload an ad and share it to the feed.</p>
</div>
</main>
);
}

return (
<main style={page}>
<div style={bgGlow1} />
<div style={bgGlow2} />

<header style={topHeader}>
<div>
<div style={brandLabel}>AI ADVERTISING PLATFORM</div>
<h1 style={logo}>AdForge</h1>
</div>
</header>



{posts.map((post) => {
const phone = post.phone || post.whatsapp || "";
const whatsapp = phone.replace("+", "").replace(/\s/g, "");

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
muted={openMedia ? false : true}
loop
playsInline
webKit-playsinline="true"
preload="auto"
onClick={() => {
const url = post.video_url || post.image_url;
if (url) setOpenMedia(url);
}}
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
)



<div style={bottomFade} />

<div style={content}>
<div style={checks}>
<p>✓ Fast Service</p>
<p>✓ Expert Fitters</p>
<p>✓ Best Prices</p>
</div>

<div
style={{ ...businessRow, cursor: "pointer" }}
onClick={() => {
if (post.user_id) router.push(`/profile/${post.user_id}`);
}}
>
<div style={avatar}>
{(post.business_name || "A").charAt(0).toUpperCase()}
</div>

<div>
<b>{post.business_name || "AdForge Business"}</b>
<p style={small}>{post.location || "Local area"}</p>
</div>
</div>

<p style={caption}>{post.content || "Uploaded media"}</p>

{phone && (
<a href={`tel:${phone}`} style={bookBtn}>
Book Now
</a>
)}
</div>

<div style={rightActions}>
<button
onClick={() =>
setLiked((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
}
style={{
...circleBtn,
color: liked[post.id] ? "#ffffff" : "white",
}}
>
♥
</button>
<span style={count}>{liked[post.id] ? "1.3K" : "1.2K"}</span>

<button onClick={() => openComments(post)} style={circleBtn}>
💬
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

const page: React.CSSProperties = {
height: "100dvh",
overflowY: "scroll",
scrollSnapType: "y mandatory",
scrollBehavior: "smooth",
WebkitOverflowScrolling: "touch",
background:
"radial-gradient(circle at 72% 0%, rgba(220,235,255,0.10), transparent 34%), radial-gradient(circle at 28% 35%, rgba(120,160,255,0.10), transparent 32%), #05070d",
color: "white",
fontFamily: "Inter, Arial, sans-serif",
position: "relative",
};

const bgGlow1: React.CSSProperties = {
position: "fixed",
width: 340,
height: 340,
borderRadius: "50%",
background: "rgba(220,235,255,0.10)",
top: -120,
right: -120,
filter: "blur(95px)",
pointerEvents: "none",
zIndex: 0,
};

const bgGlow2: React.CSSProperties = {
position: "fixed",
width: 280,
height: 280,
borderRadius: "50%",
background: "rgba(120,160,255,0.08)",
bottom: 110,
left: -110,
filter: "blur(95px)",
pointerEvents: "none",
zIndex: 0,
};

const topHeader: CSSProperties = {
position: "fixed",
top: 18,
left: 18,
zIndex: 100,
transform: "scale(0.8)",
transformOrigin: "top left",
};

const brandLabel: React.CSSProperties = {
fontSize: 10,
letterSpacing: 3,
color: "rgba(255,255,255,0.45)",
fontWeight: 900,
};

const logo: React.CSSProperties = {
margin: 0,
fontSize: 28,
fontWeight: 950,
letterSpacing: -2,
};

const topTabs: CSSProperties = {
position: "fixed",
top: 95,
left: "50%",
transform: "translateX(-50%)",
zIndex: 100,
display: "flex",
gap: 55,
};
const tab: React.CSSProperties = {
background: "transparent",
border: "none",
color: "rgba(255,255,255,0.48)",
fontSize: 22,
whiteSpace: "nowrap",
fontWeight: 900,
};

const activeTab: React.CSSProperties = {
...tab,
color: "white",
whiteSpace: "nowrap",
fontSize: 22,
borderBottom: "3px solid #ffffff",
paddingBottom: 10,
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
height: "100%",
width: "100%",
position: "relative",
overflow: "hidden",
borderRadius: 0,
margin: 0,
padding: 0,
top: 0,
left: 0,
right: 0,
bottom: 0,
display: "flex",
alignItems:  "center",
justifyContent: "center",
};








const media: CSSProperties = {
position: "absolute",
inset: 0,
width: "100%",
height: "100%",
transform: "fill",
objectFit: "fill",
objectPosition: "center",
};




const viewerBadge: React.CSSProperties = {
position: "absolute",
top: 18,
left: 18,
zIndex: 20,
display: "flex",
alignItems: "center",
gap: 8,
padding: "9px 13px",
borderRadius: 999,
background: "rgba(255,255,255,0.14)",
border: xeonBorder,
color: "white",
fontSize: 13,
fontWeight: 800,
backdropFilter: "blur(14px)",
boxShadow: xeonGlow,
};

const liveDot: React.CSSProperties = {
width: 8,
height: 8,
borderRadius: 999,
background: "#ffffff",
boxShadow: "0 0 14px rgba(220,235,255,0.9)",
};

const bottomFade: React.CSSProperties = {
position: "absolute",
left: 0,
right: 0,
bottom: 0,
height: "22%",
background:
"linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0.45), transparent)",
zIndex: 3,
pointerEvents: "none",
};

const content: React.CSSProperties = {
position: "absolute",
left: 20,
right: 96,
bottom: 165,
zIndex: 5,
};

const checks: React.CSSProperties = {
fontSize: 16,
lineHeight: 1.25,
color: "white",
marginBottom: 16,
};

const businessRow: React.CSSProperties = {
display: "flex",
alignItems: "center",
gap: 12,
};

const avatar: React.CSSProperties = {
width: 46,
height: 46,
borderRadius: "50%",
background: glassBg,
border: xeonBorder,
display: "flex",
alignItems: "center",
justifyContent: "center",
fontWeight: 950,
color: "#ffffff",
boxShadow: xeonGlow,
};

const small: React.CSSProperties = {
margin: "3px 0 0",
color: "rgba(255,255,255,0.72)",
fontSize: 14,
};

const caption: React.CSSProperties = {
fontSize: 15,
lineHeight: 1.35,
maxWidth: 270,
display: "-webkit-box",
WebkitLineClamp: 2,
WebkitBoxOrient: "vertical",
overflow: "hidden",
};

const bookBtn: React.CSSProperties = {
display: "inline-block",
marginTop: 8,
padding: "12px 24px",
borderRadius: 999,
background: "linear-gradient(180deg,#ffffff,#eaf0ff)",
color: "#05070d",
textDecoration: "none",
fontWeight: 950,
border: "1px solid rgba(255,255,255,0.78)",
boxShadow: xeonGlow,
};

const rightActions: React.CSSProperties = {
position: "absolute",
right: 16,
bottom: 195,
zIndex: 7,
display: "flex",
flexDirection: "column",
alignItems: "center",
gap: 8,
};

const circleBtn: React.CSSProperties = {
width: 37,
height: 37,
borderRadius: "50%",
border: xeonBorder,
background: glassBg,
color: "white",
fontSize: 28,
backdropFilter: "blur(12px)",
boxShadow: xeonGlow,
};

const musicBtn: React.CSSProperties = {
...circleBtn,
marginTop: 8,
color: "#ffffff",
display: "flex",
alignItems: "center",
justifyContent: "center",
textDecoration: "none",
};

const count: React.CSSProperties = {
fontSize: 12,
fontWeight: 900,
};

const empty: React.CSSProperties = {
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

const mediaPopup: React.CSSProperties = {
position: "fixed",
inset: 0,
zIndex: 999999,
background: "black",
display: "flex",
alignItems: "center",
justifyContent: "center",
padding: 10,
};

const mediaPopupImg: React.CSSProperties = {
maxWidth: "100%",
maxHeight: "100%",
objectFit: "contain",
};

const mediaCloseBtn: React.CSSProperties = {
position: "absolute",
top: 28,
right: 22,
zIndex: 1000000,
width: 44,
height: 44,
borderRadius: "50%",
border: xeonBorder,
background: glassBg,
color: "white",
fontSize: 30,
fontWeight: 900,
boxShadow: xeonGlow,
};

const commentOverlay: React.CSSProperties = {
position: "fixed",
inset: 0,
zIndex: 99999,
background: "rgba(0,0,0,0.55)",
display: "flex",
alignItems: "flex-end",
};

const commentBox: React.CSSProperties = {
width: "100%",
height: "58vh",
display: "flex",
flexDirection: "column",
borderTopLeftRadius: 28,
borderTopRightRadius: 28,
background: "rgba(8,12,22,0.96)",
padding: 22,
color: "white",
borderTop: xeonBorder,
boxShadow: xeonGlow,
};

const closeBtn: React.CSSProperties = {
float: "right",
background: glassBg,
color: "white",
border: xeonBorder,
borderRadius: 999,
width: 34,
height: 34,
fontSize: 24,
boxShadow: xeonGlow,
};

const commentList: React.CSSProperties = {
flex: 1,
overflowY: "auto",
marginTop: 14,
paddingBottom: 100,
};

const commentCard: React.CSSProperties = {
padding: 14,
borderRadius: 16,
background: glassBg,
border: xeonBorder,
marginBottom: 10,
boxShadow: xeonGlow,
};

const commentInputRow: React.CSSProperties = {
display: "flex",
gap: 10,
marginTop: "auto",
paddingTop: 10,
background: "rgba(8,12,22,0.96)",
};

const commentInput: React.CSSProperties = {
flex: 1,
borderRadius: 16,
border: xeonBorder,
background: glassBg,
color: "white",
padding: 14,
boxShadow: xeonGlow,
};

const sendBtn: React.CSSProperties = {
border: "1px solid rgba(255,255,255,0.78)",
borderRadius: 16,
background: "linear-gradient(180deg,#ffffff,#eaf0ff)",
color: "#05070d",
padding: "0 18px",
fontWeight: 950,
boxShadow: xeonGlow,
};

const bottomNav: React.CSSProperties = {
position: "fixed",
bottom: 8,
left: 20,
right: 20,
height: 58,
display: "flex",
justifyContent: "space-around",
alignItems: "center",
background: "rgba(4,9,18,0.72)",
border: xeonBorder,
borderRadius: 22,
backdropFilter: "blur(16px)",
boxShadow: xeonGlow,
zIndex: 999,
};
const navBtn: React.CSSProperties = {
border: "none",
background: "transparent",
color: "rgba(255,255,255,0.62)",
fontWeight: 850,
};

const navActive: React.CSSProperties = {
...navBtn,
color: "#ffffff",
};

const plusBtn: React.CSSProperties = {
width: 72,
height: 72,
borderRadius: "50%",
border: "1px solid rgba(255,255,255,0.82)",
background: "linear-gradient(180deg,#ffffff,#eaf0ff)",
color: "#05070d",
fontSize: 42,
fontWeight: 400,
marginTop: -42,
boxShadow:
"0 0 6px rgba(255,255,255,0.9), 0 0 28px rgba(220,235,255,0.55), 0 0 70px rgba(120,160,255,0.20)",
display: "flex",
alignItems: "center",
justifyContent: "center",
};
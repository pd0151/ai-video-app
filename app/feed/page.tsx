"use client";

import { useEffect, useRef, useState } from "react";
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

export default function FeedPage() {
    const router = useRouter();
const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
const [posts, setPosts] = useState<Post[]>([]);
const [loading, setLoading] = useState(true);
const [fetched, setFetched] = useState(false);
const [liked, setLiked] = useState<Record<string, boolean>>({});
const [activeVideo, setActiveVideo] = useState<string | null>(null);
const [openMedia, setOpenMedia] = useState<string | null>(null);

const [commentPost, setCommentPost] = useState<Post | null>(null);
const [comments, setComments] = useState<Comment[]>([]);
const [commentText, setCommentText] = useState("");

async function loadPosts() {
try {
setLoading(true);

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
return;
}

setPosts((data || []).filter((p) => p.image_url || p.video_url || p.content));
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
<h1 style={logo}>
Ad<span style={{ color: "#22ff7f" }}>Forge</span>
</h1>
</div>


</header>

<div style={topTabs}>
<button style={activeTab}>For You</button>
<button style={tab}>Following</button>
</div>

{posts.map((post) => {
const phone = post.phone || post.whatsapp || "";
const whatsapp = phone.replace("+", "").replace(/\s/g, "");

return (
<section key={post.id} style={slide}>
<div style={postFrame}>
{post.video_url ? (
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
loading="lazy"
style={imageMedia}
onClick={() => {
const url = post.image_url || post.video_url;
if (url) setOpenMedia(url);
}}
/>
)}
<div style={viewerBadge}>
<span style={liveDot}></span>
{Math.floor(24 + Math.random() * 180)} watching
</div>
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
if (post.user_id) {
router.push(`/profile/${post.user_id}`);
}
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
color: liked[post.id] ? "#22ff7f" : "white",
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
<a
href={`https://wa.me/${whatsapp}`}
target="_blank"
style={musicBtn}
>
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
height: "100vh",
overflowY: "scroll",
scrollSnapType: "y mandatory",
background:
"radial-gradient(circle at top,#081812 0%,#03100c 35%,#020204 100%)",
color: "white",
fontFamily: "Inter, Arial, sans-serif",
position: "relative",
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
background: "rgba(0,0,0,0.48)",
border: "1px solid rgba(34,255,127,0.28)",
color: "white",
fontSize: 13,
fontWeight: 800,
backdropFilter: "blur(14px)",
};

const liveDot: React.CSSProperties = {
width: 8,
height: 8,
borderRadius: 999,
background: "#22ff7f",
boxShadow: "0 0 14px rgba(34,255,127,0.9)",
};
const bgGlow1: React.CSSProperties = {
position: "fixed",
width: 320,
height: 320,
borderRadius: "50%",
background: "rgba(34,255,127,0.14)",
top: -120,
right: -120,
filter: "blur(90px)",
pointerEvents: "none",
zIndex: 0,
};

const bgGlow2: React.CSSProperties = {
position: "fixed",
width: 260,
height: 260,
borderRadius: "50%",
background: "rgba(34,255,127,0.08)",
bottom: 110,
left: -110,
filter: "blur(90px)",
pointerEvents: "none",
zIndex: 0,
};

const topHeader: React.CSSProperties = {
position: "fixed",
top: 18,
left: 18,
right: 18,
zIndex: 30,
display: "flex",
justifyContent: "space-between",
alignItems: "center",
};

const brandLabel: React.CSSProperties = {
fontSize: 10,
letterSpacing: 3,
color: "rgba(255,255,255,0.45)",
fontWeight: 900,
};

const logo: React.CSSProperties = {
margin: 0,
fontSize: 32,
fontWeight: 950,
letterSpacing: -2,
};

const logoutBtn: React.CSSProperties = {
border: "1px solid rgba(34,255,127,0.25)",
background: "rgba(0,0,0,0.45)",
color: "white",
borderRadius: 18,
padding: "12px 18px",
fontWeight: 900,
backdropFilter: "blur(14px)",
};

const topTabs: React.CSSProperties = {
position: "fixed",
top: 116,
left: 0,
right: 0,
zIndex: 25,
display: "flex",
justifyContent: "center",
gap: 58,
};

const tab: React.CSSProperties = {
background: "transparent",
border: "none",
color: "rgba(255,255,255,0.48)",
fontSize: 18,
fontWeight: 900,
};

const activeTab: React.CSSProperties = {
...tab,
color: "white",
borderBottom: "3px solid #22ff7f",
paddingBottom: 10,
};

const slide: React.CSSProperties = {
height: "100vh",
scrollSnapAlign: "start",
position: "relative",
display: "flex",
alignItems: "center",
justifyContent: "center",
padding: "170px 12px 118px",
boxSizing: "border-box",
};

const postFrame: React.CSSProperties = {
position: "relative",
width: "100%",
height: "100%",
maxWidth: 560,
borderRadius: 24,
overflow: "hidden",
border: "1px solid rgba(34,255,127,0.24)",
background: "rgba(0,0,0,0.42)",
boxShadow: "0 0 44px rgba(34,255,127,0.08)",
};
const imageMedia: React.CSSProperties = {
width: "100%",
height: "100%",
objectFit: "contain",
objectPosition: "center",
background: "#020617",
display: "block",
};
const media: React.CSSProperties = {
width: "100%",
height: "100%",
objectFit: "cover",
objectPosition: "center",
background: "#020617",
display: "block",
};

const bottomFade: React.CSSProperties = {
position: "absolute",
left: 0,
right: 0,
bottom: 0,
height: "42%",
background:
"linear-gradient(to top, rgba(0,0,0,0.92), rgba(0,0,0,0.38), transparent)",
zIndex: 3,
pointerEvents: "none",
};

const content: React.CSSProperties = {
position: "absolute",
left: 20,
right: 96,
bottom: 34,
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
background: "rgba(34,255,127,0.10)",
border: "1px solid rgba(34,255,127,0.55)",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontWeight: 950,
color: "#22ff7f",
};

const small: React.CSSProperties = {
margin: "3px 0 0",
color: "#22ff7f",
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
background: "linear-gradient(135deg,#22ff7f,#16a34a)",
color: "#04140c",
textDecoration: "none",
fontWeight: 950,
};

const rightActions: React.CSSProperties = {
position: "absolute",
right: 16,
bottom: 110,
zIndex: 7,
display: "flex",
flexDirection: "column",
alignItems: "center",
gap: 8,
};

const circleBtn: React.CSSProperties = {
width: 58,
height: 58,
borderRadius: "50%",
border: "1px solid rgba(34,255,127,0.25)",
background: "rgba(0,0,0,0.42)",
color: "white",
fontSize: 28,
backdropFilter: "blur(12px)",
};

const musicBtn: React.CSSProperties = {
...circleBtn,
marginTop: 8,
color: "#22ff7f",
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
background: "#020617",
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
border: "1px solid rgba(255,255,255,0.25)",
background: "rgba(255,255,255,0.12)",
color: "white",
fontSize: 30,
fontWeight: 900,
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
background: "#06120d",
padding: 22,
color: "white",
borderTop: "1px solid rgba(34,255,127,0.20)",
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
paddingBottom: 100,
};

const commentCard: React.CSSProperties = {
padding: 14,
borderRadius: 16,
background: "rgba(255,255,255,0.08)",
marginBottom: 10,
};

const commentInputRow: React.CSSProperties = {
display: "flex",
gap: 10,
marginTop: "auto",
paddingTop: 10,
background: "#06120d",
};

const commentInput: React.CSSProperties = {
flex: 1,
borderRadius: 16,
border: "1px solid rgba(34,255,127,0.18)",
background: "rgba(255,255,255,0.08)",
color: "white",
padding: 14,
};

const sendBtn: React.CSSProperties = {
border: "none",
borderRadius: 16,
background: "linear-gradient(135deg,#22ff7f,#16a34a)",
color: "#04140c",
padding: "0 18px",
fontWeight: 950,
};

const bottomNav: React.CSSProperties = {
position: "fixed",
bottom: 0,
left: 0,
right: 0,
height: 88,
display: "flex",
justifyContent: "space-around",
alignItems: "center",
background: "rgba(2, 6, 23, 0.96)",
borderTop: "1px solid rgba(34,255,127,0.18)",
backdropFilter: "blur(20px)",
boxShadow: "0 -20px 60px rgba(34,255,127,0.08)",
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
color: "#22ff7f",
};

const plusBtn: React.CSSProperties = {
width: 72,
height: 72,
borderRadius: "50%",
border: "none",
background: "linear-gradient(135deg,#22ff7f,#16a34a)",
color: "#04140c",
fontSize: 42,
fontWeight: 950,
boxShadow: "0 0 34px rgba(34,255,127,0.42)",
};
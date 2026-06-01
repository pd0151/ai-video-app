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
business?: any;
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

/* XZEON WHITE THEME */
const xeonWhite = "#f4f7ff";
const xeonGreen = "#45ff8a";
const cardBg = "rgba(7,11,20,0.86)";
const darkBg = "#05070d";
const xeonBorder = "1px solid rgba(235,242,255,0.28)";
const xeonGlow =
"0 0 4px rgba(255,255,255,0.75), 0 0 22px rgba(220,235,255,0.32), 0 0 65px rgba(140,170,255,0.18)";
const softGlow =
"0 0 3px rgba(255,255,255,0.65), 0 0 18px rgba(220,235,255,0.24)";

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
const [editingPost, setEditingPost] = useState<Post | null>(null);
const [editText, setEditText] = useState("");
const [selectedPost, setSelectedPost] = useState<Post | null>(null);
const [showPostMenu, setShowPostMenu] = useState(false);



async function loadPosts() {
try {
setLoadingPosts(true);

const { data, error } = await supabase
.from("posts")
.select(
"id,user_id,content,image_url,video_url,business_name,phone,whatsapp,website,location,created_at"
)
.order("created_at", { ascending: false })
.limit(20);

if (error) {
alert("Feed error: " + error.message);
setPosts([]);
setLoadingPosts(false);
return;
}

const freshPosts = (data || []).filter((p) => p.image_url || p.video_url);

const userIds = freshPosts
.map((p) => p.user_id)
.filter(Boolean) as string[];

const { data: businesses } = await supabase
.from("businesses")
.select("id,name,location,whatsapp,phone,notification_phone")
.in("id", userIds);

console.log("BUSINESSES:", businesses);
console.log("USER IDS:", userIds);
const postsWithBusiness = freshPosts.map((post) => {
const business = businesses?.find(
(b) => b.id === post.user_id
);

return {
...post,
business,
};
});

setPosts(postsWithBusiness);
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

if (entry.isIntersecting) {
video.play().catch(() => {});
} else {
video.pause();
}
});
},
{ threshold: 0.5 }
);

Object.entries(videoRefs.current).forEach(([id, video]) => {
if (video) {
video.dataset.id = id;
observer.observe(video);
}
});

return () => observer.disconnect();
}, [posts]);


async function deletePost(postId: string) {
if (!confirm("Delete this post?")) return;

const { error } = await supabase
.from("posts")
.delete()
.eq("id", postId);

if (error) {
alert("Delete failed: " + error.message);
return;
}

async function savePostEdit() {
if (!editingPost) return;

const { error } = await supabase
.from("posts")
.update({ content: editText })
.eq("id", editingPost.id);

if (error) {
alert(error.message);
return;
}

setPosts((prev) =>
prev.map((p) =>
p.id === editingPost.id
? { ...p, content: editText }
: p
)
);

setEditingPost(null);
setEditText("");
}



setPosts((prev) => prev.filter((p) => p.id !== postId));
}

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
<p style={{ opacity: 0.7 }}>
Create or upload an advert and it will appear here.
</p>
</main>
);
}

return (
<main style={page}>
<header style={topHeader}>
<div>
<div style={brandLabel}>AI ADVERTISING PLATFORM</div>
<h1 style={logo}>AdForge</h1>
</div>
</header>

<div style={tabs}>
<button style={activeTab}>For You</button>
<button style={tab}>Following</button>
<button style={tab}>Nearby</button>
</div>

<div style={feedWrap}>
{posts.map((post) => {
const business = post.business;



const displayName =
business?.name ||
post.business_name ||
"Business";

const displayLocation =
business?.location ||
post.location ||
"Location not set";

const phone =
business?.phone ||
business?.notification_phone ||
post.phone ||
"";

const whatsapp = String(
business?.whatsapp ||
business?.phone ||
business?.notification_phone ||
post.whatsapp ||
""
)
.replace("+", "")
.replace(/\s/g, "");




const mediaUrl = post.video_url || post.image_url || "";

return (
<section key={post.id} style={postCard}>
<div style={cardTop}>
<div
style={businessRow}
onClick={() => {
if (post.user_id) router.push(`/profile/${post.user_id}`);
}}
>
<div style={avatar}>
{displayName.charAt(0).toUpperCase()}
</div>

<div>
<div style={businessName}>
{displayName}{" "}
<span style={verifiedDot}>●</span>
</div>


<p style={small}>⌖ {displayLocation}</p>
</div>
</div>

<button
type="button"
onClick={(e) => {
e.stopPropagation();
setSelectedPost(post);
setShowPostMenu(true);
}}
style={menuBtn}
>
•••
</button>
</div>

<div style={mediaBox}>
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

{post.video_url && !post.image_url && (
<div style={playBadge}>▶</div>
)}
</div>

<div style={cardBody}>
<h2 style={title}>
{post.content && post.content !== "Uploaded media"
? post.content.split(".")[0]
: `${displayName} Service`}
</h2>


<p style={caption}>
{post.content && post.content !== "Uploaded media"
? post.content
: "24 Hour Mobile Tyre Fitting • Emergency Callouts • Fast Response"}
</p>

<div style={checks}>
<span>✓ Fast Service</span>
<span>✓ Expert Fitters</span>
<span>✓ Best Prices</span>
</div>

<div style={ctaRow}>
<a href={`tel:${phone}`} style={callBtn}>
☎ Call Now
</a>

<a
href={`https://wa.me/${whatsapp}`}
target="_blank"
style={whatsappBtn}
>
WhatsApp
</a>
</div>
</div>

<div style={actionRow}>
<button
onClick={() =>
setLiked((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
}
style={actionBtn}
>
♥ {liked[post.id] ? "1.3K" : "1.2K"}
</button>

<button onClick={() => openComments(post)} style={actionBtn}>
💬 Comments
</button>

<button onClick={() => sharePost(post)} style={actionBtn}>
↗ Share
</button>
</div>
</section>
);
})}
</div>

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

{openMedia.includes(".mp4") || openMedia.includes("video") ? (
<video src={openMedia} controls autoPlay style={mediaPopupImg} />
) : (
<img src={openMedia} style={mediaPopupImg} />
)}
</div>
)}

{showPostMenu && selectedPost && (
<div style={postMenuOverlay} onClick={() => setShowPostMenu(false)}>
<div style={postMenuBox} onClick={(e) => e.stopPropagation()}>
<button
style={postMenuItem}
onClick={() => {
setEditingPost(selectedPost);
setEditText(selectedPost.content || "");
setShowPostMenu(false);
}}
>
Edit Post
</button>

<button
style={postMenuDelete}
onClick={() => {
deletePost(selectedPost.id);
setShowPostMenu(false);
}}
>
Delete Post
</button>

<button
style={postMenuCancel}
onClick={() => setShowPostMenu(false)}
>
Cancel
</button>
</div>
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
minHeight: "100dvh",
overflowY: "auto",
background:
"radial-gradient(circle at 78% -8%, rgba(220,235,255,0.12), transparent 34%), radial-gradient(circle at 15% 18%, rgba(120,160,255,0.10), transparent 28%), #05070d",
color: xeonWhite,
fontFamily: "Inter, Arial, sans-serif",
position: "relative",
padding: "26px 14px 108px",
};

const topHeader: CSSProperties = {
marginBottom: 18,
};

const brandLabel: CSSProperties = {
fontSize: 10,
letterSpacing: 4,
color: "rgba(244,247,255,0.52)",
fontWeight: 900,
};

const logo: CSSProperties = {
margin: "4px 0 0",
fontSize: 36,
fontWeight: 950,
letterSpacing: -2,
color: xeonWhite,
textShadow: "0 0 18px rgba(255,255,255,0.22)",
};

const tabs: CSSProperties = {
top: 56,
display: "flex",
gap: 28,
padding: "0 4px 10px",
background:
"linear-gradient(to bottom, rgba(5,7,13,0.96), rgba(5,7,13,0.70), transparent)",
};

const tab: CSSProperties = {
border: "none",
background: "transparent",
color: "rgba(244,247,255,0.48)",
fontSize: 16,
fontWeight: 900,
};

const activeTab: CSSProperties = {
...tab,
color: xeonWhite,
borderBottom: `3px solid ${xeonWhite}`,
paddingBottom: 8,
textShadow: "0 0 14px rgba(255,255,255,0.7)",
};

const feedWrap: CSSProperties = {
display: "flex",
flexDirection: "column",
gap: 18,
};

const postCard: CSSProperties = {
width: "100%",
borderRadius: 26,
overflow: "hidden",
background: cardBg,
border: xeonBorder,
boxShadow: xeonGlow,
backdropFilter: "blur(18px)",
};

const cardTop: CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
padding: "18px 18px 14px",
};

const businessRow: CSSProperties = {
display: "flex",
alignItems: "center",
gap: 12,
cursor: "pointer",
};

const avatar: CSSProperties = {
width: 48,
height: 48,
borderRadius: "50%",
background: "rgba(5,7,13,0.82)",
border: xeonBorder,
display: "flex",
alignItems: "center",
justifyContent: "center",
fontWeight: 950,
color: xeonWhite,
boxShadow: softGlow,
};

const businessName: CSSProperties = {
fontSize: 18,
fontWeight: 950,
color: xeonWhite,
};

const verifiedDot: CSSProperties = {
color: xeonGreen,
textShadow: `0 0 12px ${xeonGreen}`,
};

const small: CSSProperties = {
margin: "3px 0 0",
color: "rgba(244,247,255,0.68)",
fontSize: 14,
};

const menuBtn: CSSProperties = {
border: "none",
background: "transparent",
color: xeonWhite,
fontSize: 24,
fontWeight: 900,
};

const mediaBox: CSSProperties = {
width: "calc(100% - 32px)",
height: 285,
margin: "0 16px",
background: "#02040a",
overflow: "hidden",
position: "relative",
borderRadius: 18,
border: "1px solid rgba(244,247,255,0.14)",
};

const media: CSSProperties = {
width: "100%",
height: "100%",
objectFit: "cover",
objectPosition: "center",
background: "#02040a",
display: "block",
filter: "brightness(0.78)",
};

const playBadge: CSSProperties = {
position: "absolute",
right: 14,
bottom: 14,
width: 46,
height: 46,
borderRadius: "50%",
background: "rgba(5,7,13,0.74)",
border: xeonBorder,
display: "flex",
alignItems: "center",
justifyContent: "center",
boxShadow: softGlow,
fontWeight: 950,
};

const cardBody: CSSProperties = {
padding: "12px 16px 10px",
};

const title: CSSProperties = {
margin: "0 0 8px",
fontSize: 17,
lineHeight: 1.1,
fontWeight: 950,
letterSpacing: -0.4,
color: xeonWhite,
};

const caption: CSSProperties = {
margin: "0 0 14px",
color: "rgba(244,247,255,0.72)",
fontSize: 13,
lineHeight: 1.35,
};

const checks: CSSProperties = {
display: "flex",
flexWrap: "wrap",
gap: 13,
marginBottom: 16,
color: xeonWhite,
fontSize: 12,
fontWeight: 750,
};

const ctaRow: CSSProperties = {
display: "flex",
gap: 12,
marginTop: 12,
marginBottom: 4,
};

const callBtn: CSSProperties = {
flex: 1,
height: 46,
borderRadius: 16,
display: "flex",
alignItems: "center",
justifyContent: "center",
textDecoration: "none",
fontWeight: 900,
fontSize: 16,
color: "#f4f7ff",
background: "rgba(8,12,22,0.82)",
border: "1px solid rgba(244,247,255,0.32)",
boxShadow:
"0 0 4px rgba(255,255,255,0.55), 0 0 18px rgba(220,235,255,0.20)",
};

const whatsappBtn: CSSProperties = {
flex: 1,
height: 46,
borderRadius: 16,
display: "flex",
alignItems: "center",
justifyContent: "center",
textDecoration: "none",
fontWeight: 900,
fontSize: 16,
color: xeonGreen,
background: "rgba(8,12,22,0.82)",
border: "1px solid rgba(69,255,138,0.42)",
boxShadow: "0 0 18px rgba(69,255,138,0.22)",
};

const actionRow: CSSProperties = {
display: "flex",
justifyContent: "space-between",
borderTop: "1px solid rgba(244,247,255,0.12)",
padding: "13px 18px 16px",
};

const actionBtn: CSSProperties = {
border: "none",
background: "transparent",
color: "rgba(244,247,255,0.88)",
fontSize: 14,
fontWeight: 900,
};

const empty: CSSProperties = {
height: "100vh",
display: "flex",
flexDirection: "column",
justifyContent: "center",
alignItems: "center",
color: xeonWhite,
background: darkBg,
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
border: xeonBorder,
background: cardBg,
color: xeonWhite,
fontSize: 30,
fontWeight: 900,
boxShadow: softGlow,
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
color: xeonWhite,
borderTop: xeonBorder,
boxShadow: xeonGlow,
};

const closeBtn: CSSProperties = {
background: cardBg,
color: xeonWhite,
border: xeonBorder,
borderRadius: 999,
width: 34,
height: 34,
fontSize: 24,
boxShadow: softGlow,
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
background: cardBg,
border: xeonBorder,
marginBottom: 10,
boxShadow: softGlow,
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
border: xeonBorder,
background: cardBg,
color: xeonWhite,
padding: 14,
boxShadow: softGlow,
};

const sendBtn: CSSProperties = {
border: "none",
borderRadius: 16,
background: "linear-gradient(180deg,#ffffff,#eaf0ff)",
color: "#05070d",
padding: "0 18px",
fontWeight: 950,
boxShadow: xeonGlow,
};

const bottomNav: CSSProperties = {
position: "fixed",
bottom: 10,
left: 18,
right: 18,
height: 66,
display: "flex",
justifyContent: "space-around",
alignItems: "center",
background: "rgba(4,9,18,0.84)",
border: `1px solid rgba(69,255,138,0.22)`,
borderRadius: 24,
backdropFilter: "blur(18px)",
boxShadow: "0 0 18px rgba(255,255,255,0.18), 0 0 24px rgba(69,255,138,0.18)",
zIndex: 999,
};

const navBtn: CSSProperties = {
border: "none",
background: "transparent",
color: "rgba(244,247,255,0.62)",
fontWeight: 850,
fontSize: 12,
};

const navActive: CSSProperties = {
...navBtn,
color: xeonWhite,
textShadow: "0 0 12px rgba(255,255,255,0.65)",
};

const plusBtn: CSSProperties = {
width: 72,
height: 72,
borderRadius: "50%",
border: `2px solid ${xeonGreen}`,
background: "linear-gradient(180deg,#ffffff,#eaf0ff)",
color: "#05070d",
fontSize: 42,
fontWeight: 400,
marginTop: -42,
boxShadow: `0 0 6px rgba(255,255,255,0.9), 0 0 30px rgba(69,255,138,0.65)`,
display: "flex",
alignItems: "center",
justifyContent: "center",
};


const postMenuOverlay: CSSProperties = {
position: "fixed",
inset: 0,
background: "rgba(0,0,0,0.6)",
display: "flex",
alignItems: "center",
justifyContent: "center",
zIndex: 9999,
};

const postMenuBox: CSSProperties = {
width: 320,
borderRadius: 24,
background: "#050712",
padding: 16,
display: "flex",
flexDirection: "column",
gap: 10,
};

const postMenuItem: CSSProperties = {
border: 0,
borderRadius: 16,
padding: 16,
fontWeight: 800,
fontSize: 16,
cursor: "pointer",
};

const postMenuDelete: CSSProperties = {
border: 0,
borderRadius: 16,
padding: 16,
fontWeight: 800,
fontSize: 16,
background: "#dc2626",
color: "#fff",
cursor: "pointer",
};

const postMenuCancel: CSSProperties = {
border: 0,
borderRadius: 16,
padding: 16,
fontWeight: 800,
fontSize: 16,
background: "#111827",
color: "#fff",
cursor: "pointer",
};


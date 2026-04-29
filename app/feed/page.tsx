"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

type Post = {
id: string;
content: string | null;
image_url: string | null;
video_url: string | null;
created_at: string;
user_id: string | null;
business_name: string | null;
phone: string | null;
whatsapp: string | null;
website: string | null;
location: string | null;
};

type Comment = {
id: string;
post_id: string;
user_id: string;
content: string;
created_at: string;
};

function formatUserTag(userId: string | null) {
if (!userId) return "@creator";
return `@${userId.slice(0, 8)}`;
}

function formatDate(dateString: string) {
try {
return new Date(dateString).toLocaleString("en-GB", {
day: "2-digit",
month: "2-digit",
year: "numeric",
hour: "2-digit",
minute: "2-digit",
});
} catch {
return dateString;
}
}

function normaliseWebsite(url: string | null) {
if (!url || !url.trim()) return "";
const trimmed = url.trim();
if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
return trimmed;
}
return `https://${trimmed}`;
}

function normalisePhone(phone: string | null) {
if (!phone) return "";
return phone.replace(/[^\d+]/g, "");
}

function normaliseWhatsapp(value: string | null) {
if (!value) return "";
let cleaned = value.replace(/[^\d]/g, "");
if (cleaned.startsWith("00")) cleaned = cleaned.slice(2);
return cleaned;
}

function isVideoUrl(url: string) {
const lower = url.toLowerCase();
return (
lower.includes(".mp4") ||
lower.includes(".mov") ||
lower.includes(".webm") ||
lower.includes("video")
);
}

export default function FeedPage() {
const router = useRouter();

const [posts, setPosts] = useState<Post[]>([]);
const [user, setUser] = useState<any>(null);
const [loading, setLoading] = useState(true);
const [fullscreenMedia, setFullscreenMedia] = useState<string | null>(null);
const [activePostId, setActivePostId] = useState<string | null>(null);

const [likesCount, setLikesCount] = useState<Record<string, number>>({});
const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
const [openCommentsPost, setOpenCommentsPost] = useState<Post | null>(null);
const [comments, setComments] = useState<Comment[]>([]);
const [commentText, setCommentText] = useState("");

const [followingUsers, setFollowingUsers] = useState<Record<string, boolean>>({});
const [followerCounts, setFollowerCounts] = useState<Record<string, number>>({});
const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

const visiblePosts = useMemo(() => posts, [posts]);

useEffect(() => {
loadFeed();
}, []);

useEffect(() => {
const observer = new IntersectionObserver(
(entries) => {
entries.forEach((entry) => {
const postId = entry.target.getAttribute("data-post-id");

if (entry.isIntersecting && postId) {
setActivePostId(postId);
}
});
},
{ threshold: 0.75 }
);

const cards = document.querySelectorAll("[data-post-id]");
cards.forEach((card) => observer.observe(card));

return () => observer.disconnect();
}, [visiblePosts]);

useEffect(() => {
Object.entries(videoRefs.current).forEach(([postId, video]) => {
if (!video) return;

if (postId === activePostId && !fullscreenMedia) {
video.play().catch(() => {});
} else {
video.pause();
video.muted = true;
}
});
}, [activePostId, fullscreenMedia]);

async function loadFeed() {
setLoading(true);

const {
data: { user },
} = await supabase.auth.getUser();

setUser(user);

const { data, error } = await supabase
.from("posts")
.select("*")
.order("created_at", { ascending: false })
.limit(10);

if (error) {
alert("Feed error: " + error.message);
setLoading(false);
return;
}

const postsData = (data || []) as Post[];
setPosts(postsData);

const postIds = postsData.map((p) => p.id);

if (postIds.length > 0) {
const { data: likes } = await supabase
.from("likes")
.select("post_id, user_id")
.in("post_id", postIds);

if (likes) {
const counts: Record<string, number> = {};
const userLikes: Record<string, boolean> = {};

likes.forEach((like: any) => {
counts[like.post_id] = (counts[like.post_id] || 0) + 1;
if (like.user_id === user?.id) {
userLikes[like.post_id] = true;
}
});

setLikesCount(counts);
setLikedPosts(userLikes);
}

const { data: commentRows } = await supabase
.from("comments")
.select("post_id")
.in("post_id", postIds);

if (commentRows) {
const counts: Record<string, number> = {};

commentRows.forEach((comment: any) => {
counts[comment.post_id] = (counts[comment.post_id] || 0) + 1;
});

setCommentCounts(counts);
}
}

if (user?.id) {
const { data: follows } = await supabase
.from("follows")
.select("following_id")
.eq("follower_id", user.id);

if (follows) {
const following: Record<string, boolean> = {};

follows.forEach((follow: any) => {
following[follow.following_id] = true;
});

setFollowingUsers(following);
}
}
const userIds = postsData
.map((post) => post.user_id)
.filter(Boolean) as string[];

if (userIds.length > 0) {
const { data: followerRows } = await supabase
.from("follows")
.select("following_id")
.in("following_id", userIds);

if (followerRows) {
const counts: Record<string, number> = {};

followerRows.forEach((follow: any) => {
counts[follow.following_id] = (counts[follow.following_id] || 0) + 1;
});

setFollowerCounts(counts);
}
}
setLoading(false);
}

async function toggleLike(postId: string) {
if (!user?.id) {
alert("Please log in first");
return;
}

const liked = likedPosts[postId];

if (liked) {
const { error } = await supabase
.from("likes")
.delete()
.eq("post_id", postId)
.eq("user_id", user.id);

if (error) {
alert(error.message);
return;
}

setLikedPosts((prev) => ({ ...prev, [postId]: false }));
setLikesCount((prev) => ({
...prev,
[postId]: Math.max((prev[postId] || 1) - 1, 0),
}));
} else {
const { error } = await supabase.from("likes").insert({
post_id: postId,
user_id: user.id,
});

if (error) {
alert(error.message);
return;
}

setLikedPosts((prev) => ({ ...prev, [postId]: true }));
setLikesCount((prev) => ({
...prev,
[postId]: (prev[postId] || 0) + 1,
}));
}
}

async function openComments(post: Post) {
setOpenCommentsPost(post);
setCommentText("");

const { data, error } = await supabase
.from("comments")
.select("*")
.eq("post_id", post.id)
.order("created_at", { ascending: true });

if (error) {
alert(error.message);
return;
}

setComments((data || []) as Comment[]);
}

async function addComment() {
if (!user?.id) {
alert("Please log in first");
return;
}

if (!openCommentsPost || !commentText.trim()) return;

const { data, error } = await supabase
.from("comments")
.insert({
post_id: openCommentsPost.id,
user_id: user.id,
content: commentText.trim(),
})
.select()
.single();

if (error) {
alert(error.message);
return;
}

setComments((prev) => [...prev, data as Comment]);
setCommentCounts((prev) => ({
...prev,
[openCommentsPost.id]: (prev[openCommentsPost.id] || 0) + 1,
}));
setCommentText("");
}

async function toggleFollow(targetUserId: string | null) {
if (!user?.id) {
alert("Please log in first");
return;
}

if (!targetUserId) return;

if (targetUserId === user.id) {
alert("You cannot follow yourself");
return;
}

const alreadyFollowing = !!followingUsers[targetUserId];

if (alreadyFollowing) {
const { error } = await supabase
.from("follows")
.delete()
.eq("follower_id", user.id)
.eq("following_id", targetUserId);

if (error) {
alert(error.message);
return;
}

setFollowingUsers((prev) => ({ ...prev, [targetUserId]: false }));
} else {
const { error } = await supabase.from("follows").insert({
follower_id: user.id,
following_id: targetUserId,
});

if (error) {
alert(error.message);
return;
}

setFollowingUsers((prev) => ({ ...prev, [targetUserId]: true }));
}
}

return (
<main style={page}>
<div style={topBar}>
<div>
<div style={logo}>AdForge</div>
<div style={subText}>
{user?.email ? `Logged in as ${user.email}` : "Not logged in"}
</div>
</div>

<button onClick={() => router.push("/")} style={backBtn}>
Back
</button>
</div>

{loading ? (
<div style={emptyBox}>Loading premium feed...</div>
) : visiblePosts.length === 0 ? (
<div style={emptyBox}>No posts yet</div>
) : (
<section style={feedScroller}>
{visiblePosts.map((post) => {
const hasImage = !!post.image_url;
const hasVideo = !!post.video_url;

const phoneHref = normalisePhone(post.phone)
? `tel:${normalisePhone(post.phone)}`
: "";

const whatsappHref = normaliseWhatsapp(post.whatsapp)
? `https://wa.me/${normaliseWhatsapp(post.whatsapp)}`
: "";

const websiteHref = normaliseWebsite(post.website);

const followed = !!followingUsers[post.user_id || ""];
const liked = !!likedPosts[post.id];

return (
<article key={post.id} data-post-id={post.id} style={card}>
{hasImage && (
<img
src={post.image_url as string}
alt="Post"
style={media}
onClick={() => setFullscreenMedia(post.image_url)}
/>
)}

{hasVideo && (
<video
ref={(el) => {
videoRefs.current[post.id] = el;
}}
src={post.video_url as string}
autoPlay
loop
muted
playsInline
preload="auto"
style={media}
onClick={(e) => {
const vid = e.currentTarget;
vid.muted = !vid.muted;
vid.play().catch(() => {});
}}
/>
)}

{hasVideo && (
<button
onClick={() => setFullscreenMedia(post.video_url)}
style={fullscreenBtn}
>
⛶
</button>
)}

{!hasImage && !hasVideo && <div style={blankMedia} />}

<div style={darkOverlay} />

<div style={rightActions}>
<button
onClick={() => toggleLike(post.id)}
style={{
...roundIcon,
background: liked
? "rgba(239,68,68,0.86)"
: "rgba(0,0,0,0.50)",
}}
>
❤️
</button>
<div style={iconCount}>{likesCount[post.id] || 0}</div>

<button style={roundIcon} onClick={() => openComments(post)}>
💬
</button>
<div style={iconCount}>{commentCounts[post.id] || 0}</div>

<button style={roundIcon}>↗</button>
</div>

<div style={contentWrap}>
<div
style={{ ...businessName, cursor: "pointer", }}

onClick={() => {
if (post.user_id) router.push(`/profile/${post.user_id}`);
}}
>
{post.business_name?.trim()
? post.business_name
: formatUserTag(post.user_id)}
</div>


{post.location?.trim() && (
<div style={location}>📍 {post.location}</div>
)}

{post.content?.trim() && (
<div style={caption}>{post.content}</div>
)}

<div style={date}>{formatDate(post.created_at)}</div>

<div style={buttonRow}>
{phoneHref && (
<a href={phoneHref} style={linkStyle}>
<button style={businessBtn}>📞 Call</button>
</a>
)}

{whatsappHref && (
<a
href={whatsappHref}
target="_blank"
rel="noreferrer"
style={linkStyle}
>
<button style={businessBtn}>💬 WhatsApp</button>
</a>
)}

{websiteHref && (
<a
href={websiteHref}
target="_blank"
rel="noreferrer"
style={linkStyle}
>
<button style={businessBtn}>🌐 Website</button>
</a>
)}
<button
style={businessBtn}
onClick={() => toggleFollow(post.user_id)}
>
{followed ? "Following" : "Follow"} {followerCounts[post.user_id || ""] || 0}
</button>

</div>
</div>
</article>
);
})}
</section>
)}

{fullscreenMedia && (
<div style={fullscreenOverlay}>
<button
onClick={() => setFullscreenMedia(null)}
style={closeFullscreenBtn}
>
✕
</button>

{isVideoUrl(fullscreenMedia) ? (
<video
src={fullscreenMedia}
controls
autoPlay
playsInline
style={fullscreenMediaStyle}
/>
) : (
<img
src={fullscreenMedia}
alt="Fullscreen"
style={fullscreenMediaStyle}
/>
)}
</div>
)}

{openCommentsPost && (
<div style={commentsOverlay}>
<div style={commentsPanel}>
<div style={commentsHeader}>
<strong>Comments</strong>
<button
style={commentsClose}
onClick={() => setOpenCommentsPost(null)}
>
✕
</button>
</div>

<div style={commentsList}>
{comments.length === 0 ? (
<div style={{ opacity: 0.7 }}>No comments yet</div>
) : (
comments.map((comment) => (
<div key={comment.id} style={commentItem}>
<strong>{formatUserTag(comment.user_id)}</strong>
<div>{comment.content}</div>
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
<button onClick={addComment} style={commentSend}>
Send
</button>
</div>
</div>
</div>
)}
</main>
);
}

const page: React.CSSProperties = {
minHeight: "100vh",
background:
"radial-gradient(circle at top, #1e3a8a 0%, #08142f 44%, #020617 100%)",
color: "white",
fontFamily: "Inter, Arial, sans-serif",
padding: "22px 16px 34px",
};

const topBar: React.CSSProperties = {
maxWidth: 560,
margin: "0 auto 18px",
display: "flex",
justifyContent: "space-between",
alignItems: "center",
gap: 12,
};

const logo: React.CSSProperties = {
fontSize: 34,
fontWeight: 950,
letterSpacing: -1,
};

const subText: React.CSSProperties = {
marginTop: 4,
fontSize: 14,
opacity: 0.8,
fontWeight: 700,
};

const backBtn: React.CSSProperties = {
border: "1px solid rgba(255,255,255,0.12)",
background: "rgba(255,255,255,0.10)",
color: "white",
padding: "14px 22px",
borderRadius: 999,
fontSize: 16,
fontWeight: 900,
cursor: "pointer",
backdropFilter: "blur(18px)",
};

const feedScroller: React.CSSProperties = {
maxWidth: 560,
height: "82vh",
margin: "0 auto",
overflowY: "auto",
scrollSnapType: "y mandatory",
scrollBehavior: "smooth",
display: "flex",
flexDirection: "column",
gap: 18,
paddingBottom: 40,
WebkitOverflowScrolling: "touch",
};

const card: React.CSSProperties = {
position: "relative",
width: "100%",
height: "78vh",
minHeight: 620,
borderRadius: 36,
overflow: "hidden",
background: "#020617",
scrollSnapAlign: "start",
flexShrink: 0,
border: "1px solid rgba(255,255,255,0.10)",
boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
};

const media: React.CSSProperties = {
position: "absolute",
inset: 0,
width: "100%",
height: "100%",
objectFit: "cover",
background: "#020617",
};

const blankMedia: React.CSSProperties = {
position: "absolute",
inset: 0,
background:
"linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(10,20,60,0.35) 40%, rgba(0,0,0,0.85) 100%)",
};

const darkOverlay: React.CSSProperties = {
position: "absolute",
inset: 0,
pointerEvents: "none",
background:
"linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(10,20,60,0.35) 40%, rgba(0,0,0,0.85) 100%)",
};

const fullscreenBtn: React.CSSProperties = {
position: "absolute",
top: 16,
right: 16,
zIndex: 30,
border: "none",
borderRadius: 999,
padding: "10px 14px",
background: "rgba(0,0,0,0.65)",
color: "white",
fontWeight: 900,
fontSize: 20,
cursor: "pointer",
backdropFilter: "blur(14px)",
};

const rightActions: React.CSSProperties = {
position: "absolute",
right: 18,
bottom: 210,
display: "flex",
flexDirection: "column",
alignItems: "center",
gap: 8,
zIndex: 3,
};

const roundIcon: React.CSSProperties = {
width: 44,
height: 44,
borderRadius: 999,
border: "1px solid rgba(255,255,255,0.14)",
background: "rgba(0,0,0,0.50)",
color: "white",
fontSize: 18,
cursor: "pointer",
backdropFilter: "blur(16px)",
};

const iconCount: React.CSSProperties = {
fontSize: 14,
fontWeight: 900,
marginBottom: 8,
};

const contentWrap: React.CSSProperties = {
position: "absolute",
left: 24,
right: 24,
bottom: 16,
zIndex: 2,
pointerEvents: "auto",
};

const businessName: React.CSSProperties = {
fontSize: 26,
fontWeight: 900,
marginBottom: 10,
letterSpacing: "-0.5px",
textShadow: "0 6px 24px rgba(0,0,0,0.7)",
};

const location: React.CSSProperties = {
fontSize: 16,
fontWeight: 800,
opacity: 0.95,
marginBottom: 12,
};

const caption: React.CSSProperties = {
fontSize: 22,
lineHeight: 1.02,
fontWeight: 800,
letterSpacing: -0.7,
marginBottom: 14,
whiteSpace: "pre-wrap",
maxWidth: "78%",
textShadow: "0 5px 25px rgba(0,0,0,0.65)",
};

const date: React.CSSProperties = {
fontSize: 14,
opacity: 0.8,
fontWeight: 700,
marginBottom: 16,
};

const buttonRow: React.CSSProperties = {
display: "flex",
gap: 8,
flexWrap: "wrap",
pointerEvents: "auto",
};

const businessBtn: React.CSSProperties = {
border: "none",
background: "rgba(0,0,0,0.45)",
color: "white",
padding: "8px 12px",
borderRadius: 999,
fontSize: 12,
fontWeight: 700,
cursor: "pointer",
backdropFilter: "blur(8px)",
};

const linkStyle: React.CSSProperties = {
textDecoration: "none",
};

const emptyBox: React.CSSProperties = {
maxWidth: 560,
margin: "80px auto",
padding: 30,
borderRadius: 28,
border: "1px solid rgba(255,255,255,0.14)",
background: "rgba(255,255,255,0.06)",
fontSize: 22,
fontWeight: 900,
};

const fullscreenOverlay: React.CSSProperties = {
position: "fixed",
inset: 0,
background: "black",
zIndex: 9999,
display: "flex",
alignItems: "center",
justifyContent: "center",
};

const closeFullscreenBtn: React.CSSProperties = {
position: "fixed",
top: 20,
right: 20,
zIndex: 10000,
width: 48,
height: 48,
borderRadius: 999,
border: "none",
background: "rgba(255,255,255,0.18)",
color: "white",
fontSize: 24,
fontWeight: 900,
cursor: "pointer",
};

const fullscreenMediaStyle: React.CSSProperties = {
width: "100%",
height: "100%",
objectFit: "contain",
background: "black",
};

const commentsOverlay: React.CSSProperties = {
position: "fixed",
inset: 0,
background: "rgba(0,0,0,0.55)",
zIndex: 9998,
display: "flex",
alignItems: "flex-end",
justifyContent: "center",
};

const commentsPanel: React.CSSProperties = {
width: "100%",
maxWidth: 560,
maxHeight: "75vh",
background: "#071226",
borderTopLeftRadius: 28,
borderTopRightRadius: 28,
padding: 18,
border: "1px solid rgba(255,255,255,0.12)",
};

const commentsHeader: React.CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: 16,
fontSize: 20,
};

const commentsClose: React.CSSProperties = {
border: "none",
background: "rgba(255,255,255,0.12)",
color: "white",
borderRadius: 999,
width: 36,
height: 36,
fontWeight: 900,
cursor: "pointer",
};

const commentsList: React.CSSProperties = {
display: "flex",
flexDirection: "column",
gap: 12,
maxHeight: "45vh",
overflowY: "auto",
marginBottom: 14,
};

const commentItem: React.CSSProperties = {
background: "rgba(255,255,255,0.07)",
borderRadius: 16,
padding: 12,
};

const commentInputRow: React.CSSProperties = {
display: "flex",
gap: 10,
};

const commentInput: React.CSSProperties = {
flex: 1,
border: "1px solid rgba(255,255,255,0.16)",
background: "rgba(255,255,255,0.08)",
color: "white",
borderRadius: 999,
padding: "13px 16px",
outline: "none",
};

const commentSend: React.CSSProperties = {
border: "none",
background: "linear-gradient(135deg, #38bdf8, #6366f1)",
color: "white",
borderRadius: 999,
padding: "13px 18px",
fontWeight: 900,
cursor: "pointer",
};
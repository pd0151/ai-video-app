"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/client";

type Post = {
id: string;
user_id?: string;
caption?: string;
image_url?: string;
video_url?: string;
likes?: number;
created_at?: string;
};

type Comment = {
id: string;
post_id: string;
text: string;
created_at?: string;
};

export default function FeedPage() {
const supabase = useMemo(() => createClient(), []);
const [posts, setPosts] = useState<Post[]>([]);
const [commentsByPost, setCommentsByPost] = useState<Record<string, Comment[]>>({});
const [activePostId, setActivePostId] = useState<string | null>(null);
const [commentText, setCommentText] = useState("");
const [loading, setLoading] = useState(true);
const [user, setUser] = useState<any>(null);

useEffect(() => {
loadEverything();
getUser();
}, []);

async function getUser() {
const { data } = await supabase.auth.getUser();
setUser(data?.user ?? null);
}

async function loadEverything() {
setLoading(true);

const { data: postsData, error: postsError } = await supabase
.from("posts")
.select("*")
.order("created_at", { ascending: false });

if (postsError) {
console.error("POSTS ERROR:", postsError);
setLoading(false);
return;
}

const safePosts = (postsData || []) as Post[];
setPosts(safePosts);

const { data: commentsData, error: commentsError } = await supabase
.from("comments")
.select("*")
.order("created_at", { ascending: true });

if (commentsError) {
console.error("COMMENTS ERROR:", commentsError);
setLoading(false);
return;
}

const grouped: Record<string, Comment[]> = {};
for (const comment of (commentsData || []) as Comment[]) {
if (!grouped[comment.post_id]) grouped[comment.post_id] = [];
grouped[comment.post_id].push(comment);
}

setCommentsByPost(grouped);
setLoading(false);
}

async function handleLike(postId: string, currentLikes: number) {
const nextLikes = (currentLikes || 0) + 1;

const { error } = await supabase
.from("posts")
.update({ likes: nextLikes })
.eq("id", postId);

if (error) {
console.error("LIKE ERROR:", error);
return;
}

setPosts((prev) =>
prev.map((post) =>
post.id === postId ? { ...post, likes: nextLikes } : post
)
);
}

async function handleAddComment(postId: string) {
if (!commentText.trim()) return;

const text = commentText.trim();

const { data, error } = await supabase
.from("comments")
.insert([{ post_id: postId, text }])
.select()
.single();

if (error) {
console.error("ADD COMMENT ERROR:", error);
return;
}

setCommentsByPost((prev) => ({
...prev,
[postId]: [...(prev[postId] || []), data as Comment],
}));

setCommentText("");
}

async function handleShare(post: Post) {
const shareUrl =
typeof window !== "undefined"
? `${window.location.origin}/feed`
: "/feed";

const text = post.caption || "Check out this post";

try {
if (navigator.share) {
await navigator.share({
title: "AI Post",
text,
url: shareUrl,
});
} else {
await navigator.clipboard.writeText(shareUrl);
alert("Link copied");
}
} catch (error) {
console.error("SHARE ERROR:", error);
}
}

function openComments(postId: string) {
setActivePostId(postId);
setCommentText("");
}

function closeComments() {
setActivePostId(null);
setCommentText("");
}

if (loading) {
return (
<main style={styles.page}>
<div style={styles.centerBox}>Loading feed...</div>
</main>
);
}

return (
<main style={styles.page}>
{posts.length === 0 ? (
<div style={styles.centerBox}>No posts yet</div>
) : (
<div style={styles.snapWrap}>
{posts.map((post) => {
const comments = commentsByPost[post.id] || [];
const mediaUrl = post.video_url || post.image_url;

return (
<section key={post.id} style={styles.card}>
<div style={styles.mediaWrap}>
{post.video_url ? (
<video
src={post.video_url}
style={styles.media}
controls
autoPlay
muted
loop
playsInline
/>
) : post.image_url ? (
<img
src={post.image_url}
alt={post.caption || "Post image"}
style={styles.media}
/>
) : (
<div style={styles.emptyMedia}>No media</div>
)}

<div style={styles.overlay} />
<div style={styles.bottomGlow} />

<div style={styles.rightBar}>
<button
style={styles.actionButton}
onClick={() => handleLike(post.id, post.likes || 0)}
>
<span style={styles.icon}>♡</span>
</button>
<span style={styles.actionCount}>{post.likes || 0}</span>

<button
style={styles.actionButton}
onClick={() => openComments(post.id)}
>
<span style={styles.icon}>💬</span>
</button>
<span style={styles.actionCount}>{comments.length}</span>

<button
style={styles.actionButton}
onClick={() => handleShare(post)}
>
<span style={styles.icon}>↗</span>
</button>
<span style={styles.actionLabel}>Share</span>
</div>

<div style={styles.bottomInfo}>
<div style={styles.userRow}>
<div style={styles.avatar}>
{(user?.email?.[0] || "U").toUpperCase()}
</div>
<div>
<div style={styles.username}>
@{user?.email?.split("@")[0] || "user"}
</div>
<div style={styles.meta}>
{(comments.length || 0)} comments • {(post.likes || 0)} likes
</div>
</div>
</div>

<div style={styles.caption}>
{post.caption || "AI generated post"}
</div>
</div>
</div>
</section>
);
})}
</div>
)}

{activePostId && (
<div style={styles.modalBackdrop} onClick={closeComments}>
<div style={styles.modal} onClick={(e) => e.stopPropagation()}>
<div style={styles.modalHeader}>
<h3 style={styles.modalTitle}>Comments</h3>
<button style={styles.closeBtn} onClick={closeComments}>
✕
</button>
</div>

<div style={styles.commentList}>
{(commentsByPost[activePostId] || []).length === 0 ? (
<p style={styles.noComments}>No comments yet</p>
) : (
(commentsByPost[activePostId] || []).map((comment) => (
<div key={comment.id} style={styles.commentItem}>
<div style={styles.commentBubble}>{comment.text}</div>
</div>
))
)}
</div>

<div style={styles.commentComposer}>
<input
value={commentText}
onChange={(e) => setCommentText(e.target.value)}
placeholder="Write a comment..."
style={styles.commentInput}
/>
<button
style={styles.postCommentButton}
onClick={() => handleAddComment(activePostId)}
>
Post
</button>
</div>
</div>
</div>
)}
</main>
);
}

const styles: Record<string, React.CSSProperties> = {
page: {
minHeight: "100vh",
background:
"linear-gradient(180deg, #08142f 0%, #0d1f47 50%, #09162f 100%)",
color: "white",
overflow: "hidden",
},
centerBox: {
minHeight: "100vh",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontSize: "20px",
fontWeight: 700,
},
snapWrap: {
height: "100vh",
overflowY: "auto",
scrollSnapType: "y mandatory",
},
card: {
height: "100vh",
width: "100%",
scrollSnapAlign: "start",
display: "flex",
alignItems: "center",
justifyContent: "center",
padding: "14px",
boxSizing: "border-box",
},
mediaWrap: {
position: "relative",
width: "100%",
maxWidth: "460px",
height: "92vh",
borderRadius: "28px",
overflow: "hidden",
background: "#09111f",
boxShadow: "0 20px 80px rgba(0,0,0,0.45)",
border: "1px solid rgba(255,255,255,0.08)",
},
media: {
width: "100%",
height: "100%",
objectFit: "cover",
display: "block",
background: "black",
},
emptyMedia: {
width: "100%",
height: "100%",
display: "flex",
alignItems: "center",
justifyContent: "center",
color: "rgba(255,255,255,0.65)",
fontSize: "18px",
fontWeight: 700,
background: "#111827",
},
overlay: {
position: "absolute",
inset: 0,
background:
"linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 32%, rgba(0,0,0,0.05) 55%, rgba(0,0,0,0.2) 100%)",
pointerEvents: "none",
},
bottomGlow: {
position: "absolute",
left: 0,
right: 0,
bottom: 0,
height: "35%",
background:
"linear-gradient(to top, rgba(8,20,47,0.9), rgba(8,20,47,0.2), transparent)",
pointerEvents: "none",
},
rightBar: {
position: "absolute",
right: "12px",
bottom: "130px",
display: "flex",
flexDirection: "column",
alignItems: "center",
gap: "8px",
zIndex: 2,
},
actionButton: {
width: "58px",
height: "58px",
borderRadius: "18px",
border: "1px solid rgba(255,255,255,0.18)",
background: "rgba(255,255,255,0.14)",
backdropFilter: "blur(10px)",
WebkitBackdropFilter: "blur(10px)",
color: "white",
display: "flex",
alignItems: "center",
justifyContent: "center",
cursor: "pointer",
boxShadow: "0 8px 25px rgba(0,0,0,0.18)",
},
icon: {
fontSize: "24px",
lineHeight: 1,
},
actionCount: {
fontSize: "14px",
fontWeight: 800,
color: "white",
marginBottom: "6px",
textShadow: "0 2px 12px rgba(0,0,0,0.5)",
},
actionLabel: {
fontSize: "13px",
fontWeight: 800,
color: "white",
textShadow: "0 2px 12px rgba(0,0,0,0.5)",
},
bottomInfo: {
position: "absolute",
left: "16px",
right: "88px",
bottom: "18px",
zIndex: 2,
},
userRow: {
display: "flex",
alignItems: "center",
gap: "12px",
marginBottom: "12px",
},
avatar: {
width: "46px",
height: "46px",
borderRadius: "50%",
background: "rgba(255,255,255,0.16)",
border: "1px solid rgba(255,255,255,0.2)",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontWeight: 900,
fontSize: "18px",
color: "white",
backdropFilter: "blur(10px)",
},
username: {
fontSize: "20px",
fontWeight: 900,
color: "white",
marginBottom: "4px",
textShadow: "0 2px 16px rgba(0,0,0,0.45)",
},
meta: {
fontSize: "13px",
color: "rgba(255,255,255,0.75)",
fontWeight: 600,
},
caption: {
fontSize: "24px",
lineHeight: 1.12,
fontWeight: 900,
color: "white",
maxWidth: "100%",
textShadow: "0 3px 18px rgba(0,0,0,0.45)",
},
modalBackdrop: {
position: "fixed",
inset: 0,
background: "rgba(0,0,0,0.6)",
display: "flex",
alignItems: "flex-end",
justifyContent: "center",
zIndex: 20,
},
modal: {
width: "100%",
maxWidth: "520px",
height: "72vh",
background: "#0c1733",
borderTopLeftRadius: "24px",
borderTopRightRadius: "24px",
border: "1px solid rgba(255,255,255,0.08)",
display: "flex",
flexDirection: "column",
overflow: "hidden",
},
modalHeader: {
display: "flex",
alignItems: "center",
justifyContent: "space-between",
padding: "16px 18px",
borderBottom: "1px solid rgba(255,255,255,0.08)",
},
modalTitle: {
margin: 0,
fontSize: "20px",
fontWeight: 900,
},
closeBtn: {
width: "38px",
height: "38px",
borderRadius: "12px",
border: "none",
background: "rgba(255,255,255,0.12)",
color: "white",
fontSize: "18px",
cursor: "pointer",
},
commentList: {
flex: 1,
overflowY: "auto",
padding: "14px",
},
noComments: {
color: "rgba(255,255,255,0.65)",
textAlign: "center",
marginTop: "22px",
},
commentItem: {
marginBottom: "10px",
},
commentBubble: {
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.08)",
borderRadius: "16px",
padding: "12px 14px",
color: "white",
fontSize: "15px",
lineHeight: 1.4,
},
commentComposer: {
display: "flex",
gap: "10px",
padding: "14px",
borderTop: "1px solid rgba(255,255,255,0.08)",
},
commentInput: {
flex: 1,
height: "48px",
borderRadius: "14px",
border: "1px solid rgba(255,255,255,0.12)",
background: "rgba(255,255,255,0.08)",
color: "white",
padding: "0 14px",
outline: "none",
fontSize: "15px",
},
postCommentButton: {
height: "48px",
padding: "0 18px",
borderRadius: "14px",
border: "none",
background: "linear-gradient(135deg, #45a3ff, #6cc3ff)",
color: "#041227",
fontWeight: 900,
cursor: "pointer",
},
};
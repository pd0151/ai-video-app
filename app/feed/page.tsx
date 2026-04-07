"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Post = {
id?: string;
Id?: string;
caption?: string | null;
Caption?: string | null;
image_url?: string | null;
Image_url?: string | null;
video_url?: string | null;
Video_url?: string | null;
likes?: number | null;
Likes?: number | null;
user_id?: string | null;
User_id?: string | null;
created_at?: string | null;
};

type Comment = {
id: string;
post_id: string;
user_id: string | null;
body: string;
created_at: string;
};

type Like = {
id: string;
post_id: string;
user_id: string;
};

type Follow = {
id: string;
follower_id: string;
following_id: string;
};

export default function FeedPage() {
const [posts, setPosts] = useState<Post[]>([]);
const [commentsByPost, setCommentsByPost] = useState<Record<string, Comment[]>>({});
const [likesByPost, setLikesByPost] = useState<Record<string, number>>({});
const [follows, setFollows] = useState<Follow[]>([]);
const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
const [newComment, setNewComment] = useState("");
const [currentUserId, setCurrentUserId] = useState<string>("demo-user");
const [loading, setLoading] = useState(true);

const getPostId = (post: Post) => post.id || post.Id || "";
const getCaption = (post: Post) => post.caption || post.Caption || "AI post";
const getImage = (post: Post) => post.image_url || post.Image_url || "";
const getVideo = (post: Post) => post.video_url || post.Video_url || "";
const getPostOwnerId = (post: Post) => post.user_id || post.User_id || "demo-owner";

useEffect(() => {
loadAll();
}, []);

const loadAll = async () => {
setLoading(true);

const authResult = await supabase.auth.getUser();
const authUserId = authResult.data?.user?.id;
if (authUserId) {
setCurrentUserId(authUserId);
}

const postsResult = await supabase
.from("Posts")
.select("*")
.order("created_at", { ascending: false });

const commentsResult = await supabase
.from("comments")
.select("*")
.order("created_at", { ascending: true });

const likesResult = await supabase.from("likes").select("*");
const followsResult = await supabase.from("follows").select("*");

const loadedPosts = postsResult.data || [];
const loadedComments = (commentsResult.data || []) as Comment[];
const loadedLikes = (likesResult.data || []) as Like[];
const loadedFollows = (followsResult.data || []) as Follow[];

const groupedComments: Record<string, Comment[]> = {};
for (const comment of loadedComments) {
if (!groupedComments[comment.post_id]) groupedComments[comment.post_id] = [];
groupedComments[comment.post_id].push(comment);
}

const groupedLikes: Record<string, number> = {};
for (const like of loadedLikes) {
groupedLikes[like.post_id] = (groupedLikes[like.post_id] || 0) + 1;
}

setPosts(loadedPosts);
setCommentsByPost(groupedComments);
setLikesByPost(groupedLikes);
setFollows(loadedFollows);
setLoading(false);
};

const hasLiked = (postId: string) => {
return false;
};

const isFollowing = (ownerId: string) => {
return follows.some(
(f) => f.follower_id === currentUserId && f.following_id === ownerId
);
};

const toggleLike = async (post: Post) => {
const postId = getPostId(post);
if (!postId) return;

const { data: existing } = await supabase
.from("likes")
.select("*")
.eq("post_id", postId)
.eq("user_id", currentUserId)
.maybeSingle();

if (existing) {
await supabase.from("likes").delete().eq("id", existing.id);
setLikesByPost((prev) => ({
...prev,
[postId]: Math.max((prev[postId] || 1) - 1, 0),
}));
} else {
await supabase.from("likes").insert([
{
post_id: postId,
user_id: currentUserId,
},
]);
setLikesByPost((prev) => ({
...prev,
[postId]: (prev[postId] || 0) + 1,
}));
}
};

const toggleFollow = async (post: Post) => {
const ownerId = getPostOwnerId(post);
if (!ownerId || ownerId === currentUserId) return;

const existing = follows.find(
(f) => f.follower_id === currentUserId && f.following_id === ownerId
);

if (existing) {
await supabase.from("follows").delete().eq("id", existing.id);
setFollows((prev) => prev.filter((f) => f.id !== existing.id));
} else {
const { data } = await supabase
.from("follows")
.insert([
{
follower_id: currentUserId,
following_id: ownerId,
},
])
.select()
.single();

if (data) {
setFollows((prev) => [...prev, data as Follow]);
}
}
};

const addComment = async () => {
if (!activeCommentsPostId || !newComment.trim()) return;

const { data, error } = await supabase
.from("comments")
.insert([
{
post_id: activeCommentsPostId,
user_id: currentUserId,
body: newComment.trim(),
},
])
.select()
.single();

if (!error && data) {
setCommentsByPost((prev) => ({
...prev,
[activeCommentsPostId]: [...(prev[activeCommentsPostId] || []), data as Comment],
}));
setNewComment("");
}
};

return (
<main style={styles.page}>
<div style={styles.header}>
<div>
<h1 style={styles.title}>AdForge Feed</h1>
<p style={styles.subtitle}>Swipe posts, like, comment, follow</p>
</div>

<a href="/" style={styles.backButton}>
Back
</a>
</div>

{loading ? (
<div style={styles.centerBox}>Loading feed...</div>
) : posts.length === 0 ? (
<div style={styles.centerBox}>No posts yet</div>
) : (
<div style={styles.feedWrap}>
{posts.map((post) => {
const postId = getPostId(post);
const imageUrl = getImage(post);
const videoUrl = getVideo(post);
const caption = getCaption(post);
const ownerId = getPostOwnerId(post);

return (
<section key={postId} style={styles.card}>
<div style={styles.mediaWrap}>
{videoUrl ? (
<video
src={videoUrl}
controls
autoPlay
muted
loop
playsInline
style={styles.media}
/>
) : imageUrl ? (
<img src={imageUrl} alt={caption} style={styles.media} />
) : (
<div style={styles.emptyMedia}>No media</div>
)}

<div style={styles.overlay}>
<div style={styles.bottomLeft}>
<div style={styles.username}>@{ownerId.slice(0, 8)}</div>
<div style={styles.caption}>{caption}</div>
</div>

<div style={styles.rightActions}>
<button
style={styles.actionButton}
onClick={() => toggleLike(post)}
>
❤️ {likesByPost[postId] || 0}
</button>

<button
style={styles.actionButton}
onClick={() => setActiveCommentsPostId(postId)}
>
💬 {(commentsByPost[postId] || []).length}
</button>

<button
style={styles.actionButton}
onClick={() => toggleFollow(post)}
>
{ownerId === currentUserId
? "You"
: isFollowing(ownerId)
? "Following"
: "Follow"}
</button>
</div>
</div>
</div>
</section>
);
})}
</div>
)}

{activeCommentsPostId && (
<div style={styles.commentsOverlay} onClick={() => setActiveCommentsPostId(null)}>
<div style={styles.commentsPanel} onClick={(e) => e.stopPropagation()}>
<div style={styles.commentsHeader}>
<h2 style={styles.commentsTitle}>Comments</h2>
<button
style={styles.closeButton}
onClick={() => setActiveCommentsPostId(null)}
>
✕
</button>
</div>

<div style={styles.commentsList}>
{(commentsByPost[activeCommentsPostId] || []).length === 0 ? (
<div style={styles.noComments}>No comments yet</div>
) : (
(commentsByPost[activeCommentsPostId] || []).map((comment) => (
<div key={comment.id} style={styles.commentCard}>
<div style={styles.commentUser}>
@{(comment.user_id || "user").slice(0, 8)}
</div>
<div style={styles.commentBody}>{comment.body}</div>
</div>
))
)}
</div>

<div style={styles.commentInputRow}>
<input
value={newComment}
onChange={(e) => setNewComment(e.target.value)}
placeholder="Write a comment..."
style={styles.commentInput}
/>
<button onClick={addComment} style={styles.sendButton}>
Send
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
background: "linear-gradient(180deg, #0f172a 0%, #1d4ed8 100%)",
color: "white",
padding: "20px",
},
header: {
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
centerBox: {
minHeight: "60vh",
display: "flex",
alignItems: "center",
justifyContent: "center",
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
padding: "24px 18px",
background:
"linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.82) 100%)",
display: "flex",
justifyContent: "space-between",
alignItems: "flex-end",
gap: "16px",
},
bottomLeft: {
maxWidth: "70%",
},
username: {
fontSize: "18px",
fontWeight: 800,
marginBottom: "8px",
},
caption: {
fontSize: "34px",
lineHeight: 1.02,
fontWeight: 900,
textShadow: "0 3px 10px rgba(0,0,0,0.5)",
},
rightActions: {
display: "flex",
flexDirection: "column",
gap: "10px",
alignItems: "flex-end",
},
actionButton: {
border: "none",
background: "rgba(255,255,255,0.14)",
color: "white",
borderRadius: "999px",
padding: "12px 18px",
fontSize: "18px",
fontWeight: 800,
cursor: "pointer",
},
commentsOverlay: {
position: "fixed",
inset: 0,
background: "rgba(0,0,0,0.6)",
display: "flex",
alignItems: "flex-end",
justifyContent: "center",
zIndex: 50,
},
commentsPanel: {
width: "100%",
maxWidth: "700px",
background: "#0f172a",
borderTopLeftRadius: "24px",
borderTopRightRadius: "24px",
padding: "18px",
maxHeight: "70vh",
display: "flex",
flexDirection: "column",
},
commentsHeader: {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: "14px",
},
commentsTitle: {
margin: 0,
fontSize: "28px",
fontWeight: 900,
},
closeButton: {
border: "none",
background: "rgba(255,255,255,0.12)",
color: "white",
borderRadius: "12px",
padding: "10px 12px",
cursor: "pointer",
fontWeight: 800,
},
commentsList: {
flex: 1,
overflowY: "auto",
marginBottom: "14px",
},
noComments: {
fontSize: "18px",
opacity: 0.8,
},
commentCard: {
background: "rgba(255,255,255,0.08)",
borderRadius: "16px",
padding: "12px",
marginBottom: "10px",
},
commentUser: {
fontSize: "14px",
fontWeight: 800,
opacity: 0.85,
marginBottom: "4px",
},
commentBody: {
fontSize: "16px",
lineHeight: 1.4,
},
commentInputRow: {
display: "flex",
gap: "10px",
},
commentInput: {
flex: 1,
borderRadius: "14px",
border: "none",
padding: "14px",
fontSize: "16px",
outline: "none",
},
sendButton: {
border: "none",
borderRadius: "14px",
padding: "14px 18px",
fontWeight: 800,
cursor: "pointer",
background: "white",
color: "#111827",
},
};
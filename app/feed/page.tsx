"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

type Post = {
Id: string;
caption: string | null;
image_url: string | null;
video_url: string | null;
created_at: string;
user_id: string | null;
};

type Comment = {
id: string;
post_id: string;
user_id: string;
text: string;
created_at: string;
};

export default function FeedPage() {
const router = useRouter();

const [posts, setPosts] = useState<Post[]>([]);
const [user, setUser] = useState<any>(null);
const [loading, setLoading] = useState(true);

const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
const [followingUsers, setFollowingUsers] = useState<Record<string, boolean>>(
{}
);

const [openCommentsFor, setOpenCommentsFor] = useState<string | null>(null);
const [commentsByPost, setCommentsByPost] = useState<Record<string, Comment[]>>(
{}
);
const [commentText, setCommentText] = useState("");

useEffect(() => {
loadFeed();

const {
data: { subscription },
} = supabase.auth.onAuthStateChange((_event, session) => {
setUser(session?.user ?? null);
});

return () => {
subscription.unsubscribe();
};
}, []);

async function getCurrentUser() {
const {
data: { user },
} = await supabase.auth.getUser();

return user ?? null;
}

async function loadFeed() {
setLoading(true);

const currentUser = await getCurrentUser();
setUser(currentUser);

const { data, error } = await supabase
.from("Posts")
.select("*")
.order("created_at", { ascending: false });

if (error) {
alert("Feed error: " + error.message);
setLoading(false);
return;
}

const safePosts = (data || []) as Post[];
setPosts(safePosts);

await loadLikeCounts(safePosts);
await loadCommentCounts(safePosts);

if (currentUser) {
await loadFollowing(safePosts, currentUser.id);
}

setLoading(false);
}

async function loadLikeCounts(allPosts: Post[]) {
const counts: Record<string, number> = {};

for (const post of allPosts) {
const { count } = await supabase
.from("likes")
.select("*", { count: "exact", head: true })
.eq("post_id", post.Id);

counts[post.Id] = count || 0;
}

setLikeCounts(counts);
}

async function loadCommentCounts(allPosts: Post[]) {
const counts: Record<string, number> = {};

for (const post of allPosts) {
const { count } = await supabase
.from("comments")
.select("*", { count: "exact", head: true })
.eq("post_id", post.Id);

counts[post.Id] = count || 0;
}

setCommentCounts(counts);
}

async function loadFollowing(allPosts: Post[], currentUserId: string) {
const map: Record<string, boolean> = {};

for (const post of allPosts) {
if (!post.user_id || post.user_id === currentUserId) continue;

const { data } = await supabase
.from("follows")
.select("id")
.eq("follower_id", currentUserId)
.eq("following_id", post.user_id)
.maybeSingle();

map[post.user_id] = !!data;
}

setFollowingUsers(map);
}

async function handleLike(postId: string) {
const currentUser = await getCurrentUser();

if (!currentUser) {
alert("Please log in first");
return;
}

const { data: existingLike } = await supabase
.from("likes")
.select("id")
.eq("post_id", postId)
.eq("user_id", currentUser.id)
.maybeSingle();

if (existingLike) {
const { error } = await supabase
.from("likes")
.delete()
.eq("post_id", postId)
.eq("user_id", currentUser.id);

if (error) {
alert("Like error: " + error.message);
return;
}

setLikeCounts((prev) => ({
...prev,
[postId]: Math.max((prev[postId] || 1) - 1, 0),
}));
} else {
const { error } = await supabase.from("likes").insert({
post_id: postId,
user_id: currentUser.id,
});

if (error) {
alert("Like error: " + error.message);
return;
}

setLikeCounts((prev) => ({
...prev,
[postId]: (prev[postId] || 0) + 1,
}));
}
}

async function openComments(postId: string) {
setOpenCommentsFor(postId);
setCommentText("");

const { data, error } = await supabase
.from("comments")
.select("*")
.eq("post_id", postId)
.order("created_at", { ascending: true });

if (error) {
alert("Comments error: " + error.message);
return;
}

setCommentsByPost((prev) => ({
...prev,
[postId]: (data || []) as Comment[],
}));
}

async function handleSendComment() {
const currentUser = await getCurrentUser();

if (!currentUser) {
alert("Please log in first");
return;
}

if (!openCommentsFor) {
alert("No post selected");
return;
}

const cleanText = commentText.trim();

if (!cleanText) {
alert("Type a comment first");
return;
}

const { data, error } = await supabase
.from("comments")
.insert({
post_id: openCommentsFor,
user_id: currentUser.id,
text: cleanText,
})
.select()
.single();

if (error) {
alert("Comment error: " + error.message);
return;
}

setCommentsByPost((prev) => ({
...prev,
[openCommentsFor]: [...(prev[openCommentsFor] || []), data as Comment],
}));

setCommentCounts((prev) => ({
...prev,
[openCommentsFor]: (prev[openCommentsFor] || 0) + 1,
}));

setCommentText("");
}

async function handleFollow(postUserId: string | null) {
const currentUser = await getCurrentUser();

if (!currentUser) {
alert("Please log in first");
return;
}

if (!postUserId) {
alert("This post has no owner");
return;
}

if (postUserId === currentUser.id) {
alert("You cannot follow yourself");
return;
}

const alreadyFollowing = followingUsers[postUserId];

if (alreadyFollowing) {
const { error } = await supabase
.from("follows")
.delete()
.eq("follower_id", currentUser.id)
.eq("following_id", postUserId);

if (error) {
alert("Follow error: " + error.message);
return;
}

setFollowingUsers((prev) => ({
...prev,
[postUserId]: false,
}));
} else {
const { error } = await supabase.from("follows").insert({
follower_id: currentUser.id,
following_id: postUserId,
});

if (error) {
alert("Follow error: " + error.message);
return;
}

setFollowingUsers((prev) => ({
...prev,
[postUserId]: true,
}));
}
}

if (loading) {
return (
<main
style={{
minHeight: "100vh",
background: "#07152f",
color: "white",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontSize: 24,
fontWeight: 800,
}}
>
Loading feed...
</main>
);
}

return (
<main
style={{
minHeight: "100vh",
background: "#07152f",
color: "white",
padding: 20,
}}
>
<div
style={{
display: "flex",
justifyContent: "space-between",
alignItems: "flex-start",
marginBottom: 20,
}}
>
<div>
<h1 style={{ fontSize: 64, fontWeight: 900, lineHeight: 1, margin: 0 }}>
AdForge Feed
</h1>

<p style={{ marginTop: 6, fontSize: 18 }}>
{user ? `Logged in as ${user.email}` : "Not logged in"}
</p>

<p style={{ marginTop: 6, fontSize: 18 }}>
Swipe posts, like, comment, follow
</p>
</div>

<button
onClick={() => router.push("/")}
style={{
background: "#18294f",
color: "white",
border: "none",
borderRadius: 18,
padding: "14px 20px",
fontSize: 18,
fontWeight: 700,
cursor: "pointer",
}}
>
Back
</button>
</div>

<div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
{posts.map((post) => (
<div
key={post.Id}
style={{
position: "relative",
width: "100%",
maxWidth: 950,
margin: "0 auto",
borderRadius: 28,
overflow: "hidden",
background: "#0d1f45",
}}
>
{post.video_url ? (
<video
src={post.video_url}
controls
playsInline
style={{
width: "100%",
maxHeight: "78vh",
objectFit: "cover",
display: "block",
background: "black",
}}
/>
) : post.image_url ? (
<img
src={post.image_url}
alt="Post"
style={{
width: "100%",
maxHeight: "78vh",
objectFit: "cover",
display: "block",
}}
/>
) : (
<div
style={{
height: 500,
display: "flex",
alignItems: "center",
justifyContent: "center",
color: "#ccc",
fontSize: 22,
}}
>
No media found
</div>
)}

<div
style={{
position: "absolute",
left: 24,
bottom: 24,
right: 120,
textShadow: "0 2px 10px rgba(0,0,0,0.7)",
}}
>
<div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
@{post.user_id ? post.user_id.slice(0, 8) : "demo-own"}
</div>

<div
style={{
fontSize: 30,
fontWeight: 900,
lineHeight: 1.02,
whiteSpace: "pre-wrap",
}}
>
{post.caption || ""}
</div>
</div>

<div
style={{
position: "absolute",
right: 16,
bottom: 24,
display: "flex",
flexDirection: "column",
gap: 14,
alignItems: "center",
}}
>
<button onClick={() => handleLike(post.Id)} style={actionBtnStyle}>
❤️ {likeCounts[post.Id] || 0}
</button>

<button onClick={() => openComments(post.Id)} style={actionBtnStyle}>
💬 {commentCounts[post.Id] || 0}
</button>

<button
onClick={() => handleFollow(post.user_id)}
style={actionBtnStyle}
>
{post.user_id && followingUsers[post.user_id]
? "Following"
: "Follow"}
</button>
</div>
</div>
))}
</div>

{openCommentsFor && (
<div
style={{
position: "fixed",
left: 0,
right: 0,
bottom: 0,
background: "#10224a",
borderTopLeftRadius: 24,
borderTopRightRadius: 24,
padding: 20,
boxShadow: "0 -10px 30px rgba(0,0,0,0.35)",
zIndex: 9999,
maxHeight: "45vh",
overflowY: "auto",
}}
>
<div
style={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: 14,
}}
>
<h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Comments</h2>

<button
onClick={() => {
setOpenCommentsFor(null);
setCommentText("");
}}
style={{
width: 42,
height: 42,
borderRadius: 999,
border: "none",
background: "#5a6787",
color: "white",
fontSize: 24,
cursor: "pointer",
}}
>
×
</button>
</div>

<div style={{ marginBottom: 16 }}>
{(commentsByPost[openCommentsFor] || []).length === 0 ? (
<p style={{ margin: 0, color: "#d7dcef", fontSize: 18 }}>No comments yet</p>
) : (
(commentsByPost[openCommentsFor] || []).map((comment) => (
<div
key={comment.id}
style={{
background: "#0b1836",
borderRadius: 14,
padding: 12,
marginBottom: 10,
}}
>
<div style={{ fontSize: 14, opacity: 0.8, marginBottom: 4 }}>
{comment.user_id}
</div>
<div style={{ fontSize: 17, fontWeight: 600 }}>{comment.text}</div>
</div>
))
)}
</div>

<div style={{ display: "flex", gap: 10, alignItems: "center" }}>
<input
value={commentText}
onChange={(e) => setCommentText(e.target.value)}
placeholder="Write a comment..."
style={{
flex: 1,
height: 54,
borderRadius: 14,
border: "none",
outline: "none",
padding: "0 16px",
fontSize: 18,
}}
/>

<button
onClick={handleSendComment}
style={{
height: 54,
borderRadius: 14,
border: "none",
padding: "0 18px",
background: "white",
color: "#10224a",
fontWeight: 800,
fontSize: 18,
cursor: "pointer",
}}
>
Send
</button>
</div>
</div>
)}
</main>
);
}

const actionBtnStyle: React.CSSProperties = {
minWidth: 88,
padding: "12px 14px",
borderRadius: 999,
border: "none",
background: "rgba(20,20,20,0.45)",
color: "white",
fontWeight: 800,
fontSize: 18,
cursor: "pointer",
backdropFilter: "blur(8px)",
};
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
const [posts, setPosts] = useState<any[]>([]);
const [user, setUser] = useState<any>(null);

useEffect(() => {
getUser();
fetchPosts();
}, []);

async function getUser() {
const { data } = await supabase.auth.getUser();
setUser(data.user);
}

async function fetchPosts() {
const { data } = await supabase
.from("posts")
.select("*")
.order("created_at", { ascending: false });

setPosts(data || []);
}

async function likePost(postId: string) {
if (!user) return;

await supabase.from("likes").insert({
post_id: postId,
user_id: user.id,
});
}

async function commentPost(postId: string, text: string) {
if (!user) return;

await supabase.from("comments").insert({
post_id: postId,
user_id: user.id,
text,
});
}

async function followUser(userId: string) {
if (!user) return;

await supabase.from("follows").insert({
follower_id: user.id,
following_id: userId,
});
}

return (
<main style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
{posts.map((post) => (
<div
key={post.id}
style={{
height: "100vh",
display: "flex",
flexDirection: "column",
justifyContent: "center",
alignItems: "center",
borderBottom: "1px solid #222",
}}
>
{/* IMAGE */}
{post.image_url && (
<img
src={post.image_url}
style={{ maxHeight: "60%", objectFit: "contain" }}
/>
)}

{/* VIDEO */}
{post.video_url && (
<video
src={post.video_url}
controls
style={{ maxHeight: "60%" }}
/>
)}

<p>{post.content}</p>

{/* ACTIONS */}
<div style={{ display: "flex", gap: 10 }}>
<button onClick={() => likePost(post.id)}>❤️ Like</button>

<button
onClick={() =>
commentPost(post.id, prompt("Comment:") || "")
}
>
💬 Comment
</button>

<button onClick={() => followUser(post.user_id)}>
➕ Follow
</button>
</div>
</div>
))}
</main>
);
}
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProfilePage() {
const router = useRouter();
const [business, setBusiness] = useState<any>(null);
const [posts, setPosts] = useState<any[]>([]);

async function loadProfile() {
const email = localStorage.getItem("user");

if (!email) {
router.push("/login");
return;
}

// get business
const { data } = await supabase
.from("businesses")
.select("*")
.eq("email", email)
.single();

setBusiness(data);

// get posts for this business
const { data: postsData } = await supabase
.from("posts")
.select("*")
.eq("business_name", data?.name)
.order("created_at", { ascending: false });

setPosts(postsData || []);
}

useEffect(() => {
loadProfile();
}, []);

if (!business) {
return <p style={{ color: "white", padding: 20 }}>Loading...</p>;
}

return (
<main style={{ padding: 20, color: "white" }}>
<button onClick={() => router.push("/feed")}>← Back</button>

<h1>{business.name}</h1>
<p>📍 {business.location}</p>
<p>📞 {business.phone}</p>

{business.whatsapp && (
<a href={`https://wa.me/${business.whatsapp}`}>💬 WhatsApp</a>
)}

{business.website && (
<a href={business.website}>🌐 Website</a>
)}

<h2 style={{ marginTop: 30 }}>Posts</h2>

{posts.length === 0 ? (
<p>No posts yet</p>
) : (
posts.map((p) => (
<div key={p.id} style={{ marginBottom: 20 }}>
{p.image_url && (
<img src={p.image_url} style={{ width: "100%" }} />
)}
{p.video_url && (
<video src={p.video_url} controls style={{ width: "100%" }} />
)}
<p>{p.content}</p>
</div>
))
)}
</main>
);
}
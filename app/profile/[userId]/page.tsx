"use client";

import { useEffect, useState } from "react";
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
business_name: string | null;
location: string | null;
created_at: string | null;
};

export default function ProfilePage() {
const router = useRouter();
const [posts, setPosts] = useState<Post[]>([]);
const [following, setFollowing] = useState(false);

async function loadPosts() {
const { data } = await supabase
.from("posts")
.select("id, content, image_url, video_url, business_name, location, created_at")
.order("created_at", { ascending: false })
.limit(12);

setPosts((data || []).filter((p) => p.image_url || p.video_url || p.content));
}

useEffect(() => {
loadPosts();
}, []);

return (
<main style={page}>
<button onClick={() => router.push("/feed")} style={backBtn}>← Back</button>

<section style={heroCard}>
<div style={avatar}>T</div>
<h1 style={title}>Total Tyres 247</h1>
<p style={sub}>📍 Liverpool</p>
<p style={tagline}>Mobile tyre fitting • Emergency call-outs • 24/7</p>

<div style={stats}>
<Stat value={String(posts.length)} label="Posts" />
<Stat value={following ? "1" : "0"} label="Followers" />
<Stat value="0" label="Following" />
</div>

<button onClick={() => setFollowing(!following)} style={followBtn}>
{following ? "Following ✓" : "Follow"}
</button>
</section>

<section style={quickActions}>
<button onClick={() => router.push("/feed")} style={actionBtn}>📺 View Feed</button>
<a href="tel:07385182500" style={actionBtn}>📞 Call</a>
<a href="https://wa.me/447385182500" style={actionBtn}>💬 WhatsApp</a>
</section>

<div style={postsHeader}>
<h2 style={sectionTitle}>Posts</h2>
<button onClick={() => router.push("/feed")} style={viewAll}>View all</button>
</div>

{posts.length === 0 ? (
<div style={emptyCard}>
<h3>No posts yet</h3>
<p>Share an advert to the feed and it will show here.</p>
</div>
) : (
<section style={grid}>
{posts.map((post) => (
<button key={post.id} style={postCard} onClick={() => router.push("/feed")}>
{post.video_url ? (
<video src={post.video_url} muted playsInline style={media} />
) : post.image_url ? (
<img src={post.image_url} style={media} />
) : (
<div style={textOnly}>{post.content}</div>
)}

<div style={postShade} />

<div style={postBadge}>
{post.video_url ? "▶ Video" : "🖼 Ad"}
</div>

<div style={postOverlay}>
<b>{post.business_name || "Total Tyres 247"}</b>
<span>{post.location || "Liverpool"}</span>
</div>
</button>
))}
</section>
)}
</main>
);
}

function Stat({ value, label }: { value: string; label: string }) {
return (
<div style={statCard}>
<b style={statNumber}>{value}</b>
<span style={statLabel}>{label}</span>
</div>
);
}

const page: React.CSSProperties = {
minHeight: "100vh",
padding: 26,
paddingBottom: 130,
color: "white",
fontFamily: "Arial, sans-serif",
background: "radial-gradient(circle at top, #5b21b6 0%, #240b4a 38%, #05010f 100%)",
};

const backBtn: React.CSSProperties = {
marginTop: 18,
padding: "12px 18px",
borderRadius: 999,
border: "1px solid rgba(255,255,255,0.15)",
background: "rgba(255,255,255,0.08)",
color: "white",
fontWeight: 900,
fontSize: 16,
};

const heroCard: React.CSSProperties = {
marginTop: 32,
borderRadius: 34,
padding: 28,
background: "linear-gradient(145deg, rgba(168,85,247,0.28), rgba(15,23,42,0.85))",
border: "1px solid rgba(255,255,255,0.16)",
boxShadow: "0 30px 90px rgba(168,85,247,0.25)",
};

const avatar: React.CSSProperties = {
width: 110,
height: 110,
borderRadius: 30,
background: "linear-gradient(135deg,#a855f7,#7c3aed)",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontSize: 58,
fontWeight: 950,
boxShadow: "0 0 45px rgba(168,85,247,0.7)",
};

const title: React.CSSProperties = {
fontSize: 46,
margin: "26px 0 8px",
lineHeight: 1,
};

const sub: React.CSSProperties = {
fontSize: 22,
fontWeight: 800,
opacity: 0.9,
};

const tagline: React.CSSProperties = {
fontSize: 16,
opacity: 0.7,
};

const stats: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "repeat(3, 1fr)",
gap: 12,
marginTop: 24,
};

const statCard: React.CSSProperties = {
padding: 16,
borderRadius: 20,
textAlign: "center",
background: "rgba(0,0,0,0.3)",
border: "1px solid rgba(255,255,255,0.12)",
};

const statNumber: React.CSSProperties = { fontSize: 28 };

const statLabel: React.CSSProperties = {
display: "block",
marginTop: 6,
opacity: 0.85,
fontWeight: 800,
};

const followBtn: React.CSSProperties = {
marginTop: 28,
padding: "16px 34px",
borderRadius: 20,
border: "none",
background: "linear-gradient(90deg,#7c3aed,#c084fc)",
color: "white",
fontWeight: 950,
fontSize: 18,
boxShadow: "0 0 35px rgba(168,85,247,0.5)",
};

const quickActions: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "repeat(3, 1fr)",
gap: 12,
marginTop: 20,
};

const actionBtn: React.CSSProperties = {
padding: "14px 10px",
borderRadius: 18,
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.14)",
color: "white",
textDecoration: "none",
textAlign: "center",
fontWeight: 900,
};

const postsHeader: React.CSSProperties = {
marginTop: 34,
display: "flex",
justifyContent: "space-between",
alignItems: "center",
};

const sectionTitle: React.CSSProperties = {
fontSize: 38,
margin: 0,
};

const viewAll: React.CSSProperties = {
border: "none",
background: "rgba(255,255,255,0.1)",
color: "white",
borderRadius: 999,
padding: "10px 16px",
fontWeight: 900,
};

const emptyCard: React.CSSProperties = {
marginTop: 18,
padding: 24,
borderRadius: 26,
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.1)",
};

const grid: React.CSSProperties = {
marginTop: 18,
display: "grid",
gridTemplateColumns: "repeat(2, 1fr)",
gap: 14,
};

const postCard: React.CSSProperties = {
height: 245,
borderRadius: 26,
overflow: "hidden",
position: "relative",
background: "#020617",
border: "1px solid rgba(255,255,255,0.12)",
padding: 0,
textAlign: "left",
boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
};

const media: React.CSSProperties = {
width: "100%",
height: "100%",
objectFit: "cover",
};

const textOnly: React.CSSProperties = {
height: "100%",
padding: 18,
display: "flex",
alignItems: "center",
justifyContent: "center",
color: "white",
fontWeight: 900,
background: "linear-gradient(145deg,#1e1b4b,#581c87)",
};

const postShade: React.CSSProperties = {
position: "absolute",
inset: 0,
background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent 55%)",
};

const postBadge: React.CSSProperties = {
position: "absolute",
top: 12,
right: 12,
padding: "7px 10px",
borderRadius: 999,
background: "rgba(0,0,0,0.45)",
color: "white",
fontSize: 12,
fontWeight: 900,
backdropFilter: "blur(10px)",
};

const postOverlay: React.CSSProperties = {
position: "absolute",
left: 12,
right: 12,
bottom: 12,
display: "flex",
flexDirection: "column",
gap: 4,
color: "white",
textShadow: "0 2px 10px black",
};
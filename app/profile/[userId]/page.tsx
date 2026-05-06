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

const { data } = await supabase
.from("businesses")
.select("*")
.eq("email", email.toLowerCase().trim())
.maybeSingle();

setBusiness(data);

if (!data?.business_name) return;

const { data: postsData } = await supabase
.from("posts")
.select("*")
.eq("business_name", data.business_name)
.order("created_at", { ascending: false });

setPosts(postsData || []);
}

useEffect(() => {
loadProfile();
}, []);

if (!business) {
return <main style={page}><p style={{ color: "white" }}>Loading...</p></main>;
}

return (
<main style={page}>
<section style={card}>
<button onClick={() => router.push("/feed")} style={backBtn}>
← Back
</button>

<div style={avatar}>🏢</div>

<h1 style={title}>
{business.business_name || "Business Profile"}
</h1>

<div style={infoGrid}>
<div style={infoCard}>📍 {business.location || "No location"}</div>
<div style={infoCard}>📞 {business.phone || "No phone"}</div>
</div>

<div style={buttonRow}>
{business.whatsapp && (
<a
href={`https://wa.me/${String(business.whatsapp).replace(/\D/g, "")}`}
style={greenBtn}
>
💬 WhatsApp
</a>
)}

{business.website && (
<a
href={
String(business.website).startsWith("http")
? business.website
: `https://${business.website}`
}
style={purpleBtn}
>
🌐 Website
</a>
)}
</div>
</section>

<section style={section}>
<h2 style={sectionTitle}>Posts</h2>

{posts.length === 0 ? (
<div style={emptyBox}>No posts yet</div>
) : (
<div style={grid}>
{posts.map((p) => (
<article key={p.id} style={postCard}>
{p.image_url && (
<img src={p.image_url} style={media} alt="post" />
)}

{p.video_url && (
<video
src={p.video_url}
controls
playsInline
style={media}
/>
)}

{p.content && <p style={caption}>{p.content}</p>}
</article>
))}
</div>
)}
</section>
</main>
);
}

const page: React.CSSProperties = {
minHeight: "100vh",
padding: "24px 20px 120px",
color: "white",
background:
"radial-gradient(circle at top, #1e3a8a 0%, #1b0b3a 42%, #020617 100%)",
};

const card: React.CSSProperties = {
position: "relative",
maxWidth: 760,
margin: "0 auto 24px",
padding: 24,
borderRadius: 28,
background: "rgba(15,23,42,0.72)",
border: "1px solid rgba(255,255,255,0.12)",
boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
};

const backBtn: React.CSSProperties = {
border: "1px solid rgba(255,255,255,0.18)",
background: "rgba(255,255,255,0.1)",
color: "white",
padding: "10px 16px",
borderRadius: 999,
fontWeight: 800,
cursor: "pointer",
};

const avatar: React.CSSProperties = {
width: 86,
height: 86,
borderRadius: 28,
display: "flex",
alignItems: "center",
justifyContent: "center",
fontSize: 42,
marginTop: 24,
background: "linear-gradient(135deg,#7c3aed,#2563eb)",
boxShadow: "0 0 35px rgba(124,58,237,0.5)",
};

const title: React.CSSProperties = {
fontSize: 46,
lineHeight: 1,
margin: "22px 0 20px",
fontWeight: 900,
letterSpacing: "-1px",
};

const infoGrid: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "1fr",
gap: 12,
};

const infoCard: React.CSSProperties = {
padding: 16,
borderRadius: 18,
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.1)",
fontSize: 18,
fontWeight: 700,
};

const buttonRow: React.CSSProperties = {
display: "flex",
gap: 12,
flexWrap: "wrap",
marginTop: 18,
};

const greenBtn: React.CSSProperties = {
flex: 1,
minWidth: 150,
textAlign: "center",
textDecoration: "none",
padding: "16px 18px",
borderRadius: 18,
background: "linear-gradient(135deg,#22c55e,#86efac)",
color: "#07111f",
fontWeight: 900,
fontSize: 18,
};

const purpleBtn: React.CSSProperties = {
flex: 1,
minWidth: 150,
textAlign: "center",
textDecoration: "none",
padding: "16px 18px",
borderRadius: 18,
background: "linear-gradient(135deg,#7c3aed,#c084fc)",
color: "white",
fontWeight: 900,
fontSize: 18,
};

const section: React.CSSProperties = {
maxWidth: 760,
margin: "0 auto",
};

const sectionTitle: React.CSSProperties = {
fontSize: 36,
margin: "12px 0 18px",
};

const emptyBox: React.CSSProperties = {
padding: 28,
borderRadius: 24,
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.1)",
color: "rgba(255,255,255,0.72)",
fontSize: 18,
fontWeight: 700,
};

const grid: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "1fr",
gap: 18,
};

const postCard: React.CSSProperties = {
overflow: "hidden",
borderRadius: 24,
background: "rgba(15,23,42,0.74)",
border: "1px solid rgba(255,255,255,0.12)",
boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
};

const media: React.CSSProperties = {
width: "100%",
display: "block",
maxHeight: 520,
objectFit: "contain",
background: "#020617",
};

const caption: React.CSSProperties = {
padding: 16,
margin: 0,
fontSize: 17,
lineHeight: 1.5,
};
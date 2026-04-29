"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams, useRouter } from "next/navigation";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

type Post = {
id: string;
content: string | null;
image_url: string | null;
video_url: string | null;
created_at: string | null;
user_id: string | null;
business_name: string | null;
phone: string | null;
whatsapp: string | null;
website: string | null;
location: string | null;
};

function cleanPhone(phone: string | null) {
if (!phone) return "";
return phone.replace(/[^\d+]/g, "");
}

function cleanWhatsapp(value: string | null) {
if (!value) return "";
let cleaned = value.replace(/[^\d]/g, "");
if (cleaned.startsWith("0")) cleaned = `44${cleaned.slice(1)}`;
if (cleaned.startsWith("00")) cleaned = cleaned.slice(2);
return cleaned;
}

function cleanWebsite(url: string | null) {
if (!url || !url.trim()) return "";
const trimmed = url.trim();
if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
return trimmed;
}
return `https://${trimmed}`;
}

export default function ProfilePage() {
const router = useRouter();
const params = useParams();
const userId = String(params?.userId || "");

const [posts, setPosts] = useState<Post[]>([]);
const [loading, setLoading] = useState(true);
const [fullscreenPost, setFullscreenPost] = useState<Post | null>(null);

useEffect(() => {
async function loadProfile() {
setLoading(true);

let query = supabase
.from("posts")
.select(
"id,content,image_url,video_url,created_at,user_id,business_name,phone,whatsapp,website,location"
)
.order("created_at", { ascending: false })
.limit(12);

if (userId) {
query = query.eq("user_id", userId);
}

let { data, error } = await query;

// fallback so page still loads if old posts/user_id are wrong
if (!error && (!data || data.length === 0)) {
const fallback = await supabase
.from("posts")
.select(
"id,content,image_url,video_url,created_at,user_id,business_name,phone,whatsapp,website,location"
)
.order("created_at", { ascending: false })
.limit(12);

data = fallback.data;
error = fallback.error;
}

if (error) {
console.error("PROFILE ERROR:", error.message);
setPosts([]);
setLoading(false);
return;
}

setPosts((data || []) as Post[]);
setLoading(false);
}

loadProfile();
}, [userId]);

const firstPost = posts[0];

const businessName =
firstPost?.business_name?.trim() || "Business Profile";

const location =
firstPost?.location?.trim() || "Location not added";

const phoneHref = cleanPhone(firstPost?.phone || null)
? `tel:${cleanPhone(firstPost?.phone || null)}`
: "";

const whatsappHref = cleanWhatsapp(firstPost?.whatsapp || null)
? `https://wa.me/${cleanWhatsapp(firstPost?.whatsapp || null)}`
: "";

const websiteHref = cleanWebsite(firstPost?.website || null);

return (
<main style={page}>
<button style={backBtn} onClick={() => router.push("/feed")}>
← Back
</button>

<section style={profileCard}>
<div style={avatar}>{businessName.charAt(0).toUpperCase()}</div>

<h1 style={title}>{businessName}</h1>
<div style={locationText}>📍 {location}</div>

<div style={statsRow}>
<div style={statBox}>
<strong>{posts.length}</strong>
<span>Posts</span>
</div>

<div style={statBox}>
<strong>0</strong>
<span>Followers</span>
</div>

<div style={statBox}>
<strong>0</strong>
<span>Following</span>
</div>
</div>

<div style={buttonRow}>
{phoneHref && (
<a href={phoneHref} style={linkStyle}>
<button style={darkBtn}>📞 Call</button>
</a>
)}

{whatsappHref && (
<a
href={whatsappHref}
target="_blank"
rel="noreferrer"
style={linkStyle}
>
<button style={darkBtn}>💬 WhatsApp</button>
</a>
)}

{websiteHref && (
<a
href={websiteHref}
target="_blank"
rel="noreferrer"
style={linkStyle}
>
<button style={darkBtn}>🌐 Website</button>
</a>
)}

<button style={followBtn}>Follow</button>
</div>
</section>

<h2 style={postsTitle}>Posts</h2>

{loading ? (
<div style={emptyBox}>Loading posts...</div>
) : posts.length === 0 ? (
<div style={emptyBox}>No posts yet</div>
) : (
<section style={grid}>
{posts.map((post) => (
<article
key={post.id}
style={postCard}
onClick={() => setFullscreenPost(post)}
>
{post.video_url ? (
<video
src={post.video_url}
muted
autoPlay
loop
playsInline
preload="auto"
style={media}
/>
) : post.image_url ? (
<img
src={post.image_url}
alt="Post"
loading="lazy"
style={media}
/>
) : (
<div style={blankMedia}>No media</div>
)}

<div style={caption}>
{post.content || post.location || "Business post"}
</div>
</article>
))}
</section>
)}

{fullscreenPost && (
<div style={fullscreenOverlay} onClick={() => setFullscreenPost(null)}>
{fullscreenPost.video_url ? (
<video
src={fullscreenPost.video_url}
controls
autoPlay
playsInline
style={fullscreenMedia}
/>
) : (
<img
src={fullscreenPost.image_url || ""}
alt="Fullscreen"
style={fullscreenMedia}
/>
)}
</div>
)}
</main>
);
}

const page: CSSProperties = {
minHeight: "100vh",
background:
"radial-gradient(circle at top, #1e3a8a 0%, #08142f 50%, #020617 100%)",
color: "white",
fontFamily: "Arial, sans-serif",
padding: "22px 16px 60px",
};

const backBtn: CSSProperties = {
border: "1px solid rgba(255,255,255,0.18)",
background: "rgba(255,255,255,0.12)",
color: "white",
padding: "12px 18px",
borderRadius: 999,
fontSize: 16,
fontWeight: 900,
cursor: "pointer",
};

const profileCard: CSSProperties = {
margin: "28px auto 30px",
maxWidth: 760,
borderRadius: 34,
padding: 28,
background: "rgba(255,255,255,0.10)",
border: "1px solid rgba(255,255,255,0.16)",
boxShadow: "0 25px 80px rgba(0,0,0,0.35)",
};

const avatar: CSSProperties = {
width: 92,
height: 92,
borderRadius: 28,
background: "linear-gradient(135deg, #60a5fa, #6366f1)",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontSize: 44,
fontWeight: 950,
marginBottom: 24,
};

const title: CSSProperties = {
fontSize: 40,
lineHeight: 1,
margin: 0,
fontWeight: 950,
};

const locationText: CSSProperties = {
marginTop: 14,
fontSize: 18,
fontWeight: 800,
opacity: 0.85,
};

const statsRow: CSSProperties = {
marginTop: 26,
display: "grid",
gridTemplateColumns: "repeat(3, 1fr)",
gap: 12,
};

const statBox: CSSProperties = {
background: "rgba(0,0,0,0.28)",
border: "1px solid rgba(255,255,255,0.12)",
borderRadius: 20,
padding: 14,
textAlign: "center",
display: "flex",
flexDirection: "column",
gap: 6,
fontWeight: 900,
};

const buttonRow: CSSProperties = {
display: "flex",
flexWrap: "wrap",
gap: 10,
marginTop: 24,
};

const darkBtn: CSSProperties = {
border: "none",
background: "rgba(0,0,0,0.48)",
color: "white",
padding: "11px 15px",
borderRadius: 999,
fontSize: 14,
fontWeight: 900,
cursor: "pointer",
};

const followBtn: CSSProperties = {
border: "none",
background: "linear-gradient(135deg, #60a5fa, #6366f1)",
color: "white",
padding: "12px 22px",
borderRadius: 999,
fontSize: 15,
fontWeight: 950,
cursor: "pointer",
};

const linkStyle: CSSProperties = {
textDecoration: "none",
};

const postsTitle: CSSProperties = {
maxWidth: 760,
margin: "0 auto 18px",
fontSize: 30,
};

const grid: CSSProperties = {
maxWidth: 760,
margin: "0 auto",
display: "grid",
gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
gap: 16,
};

const postCard: CSSProperties = {
borderRadius: 24,
overflow: "hidden",
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.14)",
cursor: "pointer",
};

const media: CSSProperties = {
width: "100%",
height: 230,
objectFit: "cover",
display: "block",
background: "#020617",
};

const blankMedia: CSSProperties = {
height: 230,
display: "flex",
alignItems: "center",
justifyContent: "center",
fontWeight: 900,
background: "rgba(0,0,0,0.3)",
};

const caption: CSSProperties = {
padding: 14,
fontWeight: 900,
fontSize: 15,
};

const emptyBox: CSSProperties = {
maxWidth: 760,
margin: "40px auto",
padding: 26,
borderRadius: 24,
background: "rgba(255,255,255,0.08)",
fontWeight: 900,
};

const fullscreenOverlay: CSSProperties = {
position: "fixed",
inset: 0,
background: "black",
zIndex: 9999,
display: "flex",
alignItems: "center",
justifyContent: "center",
};

const fullscreenMedia: CSSProperties = {
width: "100%",
height: "100%",
objectFit: "contain",
};
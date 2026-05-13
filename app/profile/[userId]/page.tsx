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
const [profileImage, setProfileImage] = useState<string | null>(null);

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

const businessName = data?.business_name || data?.name;

if (!businessName) return;

const { data: postsData } = await supabase
.from("posts")
.select("*")
.eq("business_name", businessName)
.order("created_at", { ascending: false });

setPosts(postsData || []);
}

useEffect(() => {
loadProfile();
}, []);

function handleProfileImage(file: File) {
const url = URL.createObjectURL(file);
setProfileImage(url);
}

if (!business) {
return (
<main style={empty}>
<div style={loaderCard}>
<div style={loaderDot} />
<h1>Loading profile...</h1>
</div>
</main>
);
}

return (
<main style={page}>
<div style={bgGlow1} />
<div style={bgGlow2} />

<header style={topHeader}>
<div>
<div style={brandLabel}>AI ADVERTISING PLATFORM</div>
<h1 style={logo}>
Ad<span style={{ color: "#22ff7f" }}>Forge</span>
</h1>
</div>

<button onClick={() => router.push("/login")} style={logoutBtn}>
Logout
</button>
</header>

<button onClick={() => router.push("/feed")} style={backBtn}>
← Back
</button>

<section style={profileCard}>
<div style={profileTop}>
<div style={avatarWrap}>
<div style={avatar}>
{profileImage ? (
<img src={profileImage} style={avatarImg} alt="profile" />
) : (
<span>{(business.business_name || "B").charAt(0).toUpperCase()}</span>
)}
</div>

<label style={cameraBtn}>
📷
<input
type="file"
accept="image/*"
onChange={(e) => {
const file = e.target.files?.[0];
if (file) handleProfileImage(file);
}}
style={{ display: "none" }}
/>
</label>
</div>

<div style={profileCopy}>
<div style={livePill}>
<span style={greenDot} />
BUSINESS PROFILE
</div>

<h1 style={title}>
{business.business_name || "Business Profile"}
</h1>
</div>
</div>

<div style={infoGrid}>
<div style={infoCard}>
<span style={infoIcon}>⌖</span>
<div>
<b>{business.location || "No location"}</b>
<small>Location</small>
</div>
</div>

<div style={infoCard}>
<span style={infoIcon}>☎</span>
<div>
<b>{business.phone || "No phone"}</b>
<small>Phone</small>
</div>
</div>
</div>

<div style={buttonRow}>
{business.whatsapp && (
<a
href={`https://wa.me/${String(business.whatsapp).replace(/\D/g, "")}`}
style={greenBtn}
>
WhatsApp
</a>
)}

{business.website && (
<a
href={
String(business.website).startsWith("http")
? business.website
: `https://${business.website}`
}
style={outlineBtn}
>
Website
</a>
)}
</div>
</section>

<section style={section}>
<div style={sectionHeader}>
<h2 style={sectionTitle}>Posts</h2>
<button onClick={() => router.push("/feed")} style={viewBtn}>
View all →
</button>
</div>

{posts.length === 0 ? (
<div style={emptyBox}>
<b>No posts yet</b>
<p>Create or upload an advert and it will appear here.</p>
</div>
) : (
<div style={grid}>
{posts.map((p) => (
<article key={p.id} style={postCard}>
<div style={mediaWrap}>
{p.image_url && <img src={p.image_url} style={media} alt="post" />}

{p.video_url && (
<>
<video src={p.video_url} playsInline style={media} />
<div style={playBadge}>▶</div>
</>
)}
</div>

<div style={postBody}>
<b>{p.content || "Premium advert"}</b>
<small>{p.location || business.location || "Live campaign"}</small>
</div>
</article>
))}
</div>
)}
</section>

<nav style={bottomNav}>
<button style={navBtn} onClick={() => router.push("/")}>
⌂<br />Home
</button>

<button style={navBtn} onClick={() => router.push("/feed")}>
▣<br />Feed
</button>

<button style={plusBtn} onClick={() => router.push("/")}>
+
</button>

<button style={navBtn} onClick={() => router.push("/ai-receptionist")}>
✧<br />AI
</button>

<button style={navActive}>
◎<br />Profile
</button>
</nav>
</main>
);
}

const page: React.CSSProperties = {
minHeight: "100vh",
padding: "118px 16px 130px",
color: "white",
background:
"radial-gradient(circle at top,#081812 0%,#03100c 35%,#020204 100%)",
fontFamily: "Inter, Arial, sans-serif",
position: "relative",
overflowX: "hidden",
};

const bgGlow1: React.CSSProperties = {
position: "fixed",
width: 320,
height: 320,
borderRadius: "50%",
background: "rgba(34,255,127,0.14)",
top: -120,
right: -120,
filter: "blur(90px)",
pointerEvents: "none",
zIndex: 0,
};

const bgGlow2: React.CSSProperties = {
position: "fixed",
width: 260,
height: 260,
borderRadius: "50%",
background: "rgba(34,255,127,0.08)",
bottom: 110,
left: -110,
filter: "blur(90px)",
pointerEvents: "none",
zIndex: 0,
};

const topHeader: React.CSSProperties = {
position: "fixed",
top: 18,
left: 18,
right: 18,
zIndex: 30,
display: "flex",
justifyContent: "space-between",
alignItems: "center",
};

const brandLabel: React.CSSProperties = {
fontSize: 10,
letterSpacing: 3,
color: "rgba(255,255,255,0.45)",
fontWeight: 900,
};

const logo: React.CSSProperties = {
margin: 0,
fontSize: 32,
fontWeight: 950,
letterSpacing: -2,
};

const logoutBtn: React.CSSProperties = {
border: "1px solid rgba(34,255,127,0.25)",
background: "rgba(0,0,0,0.45)",
color: "white",
borderRadius: 18,
padding: "12px 18px",
fontWeight: 900,
backdropFilter: "blur(14px)",
};

const backBtn: React.CSSProperties = {
position: "relative",
zIndex: 2,
border: "1px solid rgba(34,255,127,0.25)",
background: "rgba(0,0,0,0.32)",
color: "white",
padding: "12px 18px",
borderRadius: 18,
fontWeight: 900,
marginBottom: 18,
};

const profileCard: React.CSSProperties = {
position: "relative",
zIndex: 2,
borderRadius: 30,
padding: 22,
background:
"linear-gradient(145deg, rgba(255,255,255,0.065), rgba(255,255,255,0.025))",
border: "1px solid rgba(34,255,127,0.20)",
boxShadow: "0 25px 70px rgba(0,0,0,0.38)",
marginBottom: 26,
};

const profileTop: React.CSSProperties = {
display: "flex",
gap: 18,
alignItems: "center",
marginBottom: 22,
};

const avatarWrap: React.CSSProperties = {
position: "relative",
flexShrink: 0,
};

const avatar: React.CSSProperties = {
width: 104,
height: 104,
borderRadius: "50%",
background: "rgba(34,255,127,0.10)",
border: "2px solid rgba(34,255,127,0.8)",
display: "flex",
alignItems: "center",
justifyContent: "center",
color: "#22ff7f",
fontSize: 42,
fontWeight: 950,
boxShadow: "0 0 38px rgba(34,255,127,0.22)",
overflow: "hidden",
};

const avatarImg: React.CSSProperties = {
width: "100%",
height: "100%",
objectFit: "cover",
};

const cameraBtn: React.CSSProperties = {
position: "absolute",
right: -6,
bottom: -4,
width: 42,
height: 42,
borderRadius: "50%",
background: "linear-gradient(135deg,#22ff7f,#16a34a)",
color: "#04140c",
display: "grid",
placeItems: "center",
fontWeight: 950,
boxShadow: "0 0 25px rgba(34,255,127,0.45)",
cursor: "pointer",
};

const profileCopy: React.CSSProperties = {
minWidth: 0,
};

const livePill: React.CSSProperties = {
display: "inline-flex",
alignItems: "center",
gap: 8,
padding: "8px 12px",
borderRadius: 999,
background: "rgba(34,255,127,0.08)",
border: "1px solid rgba(34,255,127,0.22)",
color: "#22ff7f",
fontWeight: 900,
fontSize: 11,
marginBottom: 12,
};

const greenDot: React.CSSProperties = {
width: 8,
height: 8,
borderRadius: "50%",
background: "#22ff7f",
boxShadow: "0 0 12px #22ff7f",
};

const title: React.CSSProperties = {
margin: 0,
fontSize: 34,
lineHeight: 1,
fontWeight: 950,
letterSpacing: -1.5,
};

const infoGrid: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "1fr",
gap: 12,
};

const infoCard: React.CSSProperties = {
padding: 16,
borderRadius: 20,
background: "rgba(0,0,0,0.28)",
border: "1px solid rgba(34,255,127,0.16)",
display: "flex",
alignItems: "center",
gap: 14,
};

const infoIcon: React.CSSProperties = {
color: "#22ff7f",
fontSize: 24,
};

const buttonRow: React.CSSProperties = {
display: "flex",
gap: 12,
flexWrap: "wrap",
marginTop: 18,
};

const greenBtn: React.CSSProperties = {
flex: 1,
minWidth: 145,
textAlign: "center",
textDecoration: "none",
padding: "15px 18px",
borderRadius: 18,
background: "linear-gradient(135deg,#22ff7f,#16a34a)",
color: "#04140c",
fontWeight: 950,
fontSize: 16,
};

const outlineBtn: React.CSSProperties = {
flex: 1,
minWidth: 145,
textAlign: "center",
textDecoration: "none",
padding: "15px 18px",
borderRadius: 18,
border: "1px solid rgba(34,255,127,0.35)",
background: "rgba(34,255,127,0.06)",
color: "white",
fontWeight: 950,
fontSize: 16,
};

const section: React.CSSProperties = {
position: "relative",
zIndex: 2,
};

const sectionHeader: React.CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: 16,
};

const sectionTitle: React.CSSProperties = {
fontSize: 32,
margin: 0,
fontWeight: 950,
};

const viewBtn: React.CSSProperties = {
border: "1px solid rgba(34,255,127,0.25)",
background: "rgba(0,0,0,0.25)",
color: "#22ff7f",
borderRadius: 999,
padding: "10px 14px",
fontWeight: 900,
};

const emptyBox: React.CSSProperties = {
padding: 24,
borderRadius: 24,
background: "rgba(255,255,255,0.045)",
border: "1px solid rgba(34,255,127,0.14)",
color: "rgba(255,255,255,0.78)",
};

const grid: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: 12,
};

const postCard: React.CSSProperties = {
overflow: "hidden",
borderRadius: 22,
background: "rgba(255,255,255,0.045)",
border: "1px solid rgba(34,255,127,0.18)",
boxShadow: "0 18px 60px rgba(0,0,0,0.30)",
};

const mediaWrap: React.CSSProperties = {
height: 150,
position: "relative",
background: "#020617",
};

const media: React.CSSProperties = {
width: "100%",
height: "100%",
objectFit: "cover",
display: "block",
};

const playBadge: React.CSSProperties = {
position: "absolute",
inset: 0,
display: "grid",
placeItems: "center",
fontSize: 34,
color: "white",
background: "rgba(0,0,0,0.18)",
};

const postBody: React.CSSProperties = {
padding: 12,
display: "flex",
flexDirection: "column",
gap: 6,
};

const empty: React.CSSProperties = {
height: "100vh",
display: "flex",
justifyContent: "center",
alignItems: "center",
color: "white",
background: "#020617",
textAlign: "center",
padding: 30,
};

const loaderCard: React.CSSProperties = {
padding: 28,
borderRadius: 28,
background: "rgba(34,255,127,0.06)",
border: "1px solid rgba(34,255,127,0.18)",
boxShadow: "0 0 40px rgba(34,255,127,0.12)",
};

const loaderDot: React.CSSProperties = {
width: 18,
height: 18,
borderRadius: "50%",
background: "#22ff7f",
margin: "0 auto 16px",
boxShadow: "0 0 24px rgba(34,255,127,0.8)",
};

const bottomNav: React.CSSProperties = {
position: "fixed",
left: 0,
right: 0,
bottom: 0,
height: 96,
background: "rgba(2,7,5,0.96)",
borderTop: "1px solid rgba(34,255,127,0.14)",
display: "flex",
justifyContent: "space-around",
alignItems: "center",
zIndex: 50,
backdropFilter: "blur(18px)",
};

const navBtn: React.CSSProperties = {
border: "none",
background: "transparent",
color: "rgba(255,255,255,0.62)",
fontWeight: 850,
};

const navActive: React.CSSProperties = {
...navBtn,
color: "#22ff7f",
};

const plusBtn: React.CSSProperties = {
width: 72,
height: 72,
borderRadius: "50%",
border: "none",
background: "linear-gradient(135deg,#22ff7f,#16a34a)",
color: "#04140c",
fontSize: 42,
fontWeight: 950,
boxShadow: "0 0 34px rgba(34,255,127,0.42)",
};
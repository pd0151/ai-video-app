"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useParams } from "next/navigation";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProfilePage() {
const router = useRouter();
const params = useParams();
const profileUserId = String(params.userId || "");

const [business, setBusiness] = useState<any>(() => {
if (typeof window === "undefined") return null;

try {
return JSON.parse(localStorage.getItem("cached_profile_business") || "null");
} catch {
return null;
}
});

const [posts, setPosts] = useState<any[]>(() => {
if (typeof window === "undefined") return [];

try {
return JSON.parse(localStorage.getItem("cached_profile_posts") || "[]");
} catch {
return [];
}
});
const [profileImage, setProfileImage] = useState<string | null>(null);
const [isFollowing, setIsFollowing] = useState(false);
const [followersCount, setFollowersCount] = useState(0);
const [followingCount, setFollowingCount] = useState(0);
const [loading, setLoading] = useState(true);

async function getCurrentUser() {
const {
data: { user },
} = await supabase.auth.getUser();

return user;
}

async function toggleFollow() {
const user = await getCurrentUser();
const myEmail = user?.email?.toLowerCase().trim();
const targetEmail = business?.email?.toLowerCase().trim();

if (!myEmail || !targetEmail) return;
if (myEmail === targetEmail) return;

if (isFollowing) {
await supabase
.from("follows")
.delete()
.eq("follower_email", myEmail)
.eq("following_email", targetEmail);

setIsFollowing(false);
setFollowersCount((n) => Math.max(0, n - 1));
} else {
await supabase.from("follows").insert({
follower_email: myEmail,
following_email: targetEmail,
});

setIsFollowing(true);
setFollowersCount((n) => n + 1);
}
}

async function loadProfile() {
setLoading(false);

const user = await getCurrentUser();

const isMe = profileUserId === "me";
const userId = isMe ? user?.id : profileUserId;
const email = user?.email?.toLowerCase().trim() || "";

if (!email || !userId) {
setLoading(false);
return;
}

const { data: businessData } = await supabase
.from("businesses")
.select("*")
.eq(isMe ? "email" : "id", isMe ? email : userId)
.maybeSingle();

if (!businessData) {
setLoading(false);
return;
}

setBusiness(businessData);
try {
localStorage.setItem(
"cached_profile_business",
JSON.stringify(businessData)
);
} catch {}
if (businessData.profile_image_url) {
setProfileImage(businessData.profile_image_url);
}

const businessEmail = businessData.email?.toLowerCase().trim();

const { count: followers } = await supabase
.from("follows")
.select("*", { count: "exact", head: true })
.eq("following_email", businessEmail);

setFollowersCount(followers || 0);

const { count: following } = await supabase
.from("follows")
.select("*", { count: "exact", head: true })
.eq("follower_email", businessEmail);

setFollowingCount(following || 0);

const { data: followData } = await supabase
.from("follows")
.select("*")
.eq("follower_email", email)
.eq("following_email", businessEmail)
.maybeSingle();

setIsFollowing(!!followData);

const { data: userPosts } = await supabase
.from("posts")
.select("*")
.eq("user_id", userId)
.order("created_at", { ascending: false });

setPosts(userPosts || []);

setLoading(false);
}

useEffect(() => {
loadProfile();
}, []);

async function handleProfileImage(file: File) {
const user = await getCurrentUser();
const email = user?.email?.toLowerCase().trim();

if (!email) return;

const ext = file.name.split(".").pop();
const fileName = `profiles/${email}-${Date.now()}.${ext}`;

const { error: uploadError } = await supabase.storage
.from("posts")
.upload(fileName, file, { upsert: true });

if (uploadError) {
alert(uploadError.message);
return;
}

const {
data: { publicUrl },
} = supabase.storage.from("posts").getPublicUrl(fileName);

setProfileImage(publicUrl);

await supabase
.from("businesses")
.update({ profile_image_url: publicUrl })
.eq("email", email);
}

async function logout() {
await supabase.auth.signOut();
localStorage.removeItem("user");
router.push("/login");
}

if (loading || !business) {
return null;
}

return (
<main style={page}>
<div style={bgGlow1} />
<div style={bgGlow2} />

<header style={topHeader}>
<div>
<div style={brandLabel}>AI ADVERTISING PLATFORM</div>
<h1 style={logo}>
Ad<span style={{ color: "#FFFFFF" }}>Forge</span>
</h1>
</div>

<button onClick={logout} style={logoutBtn}>
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
<span>
{(business.business_name || business.name || "B")
.charAt(0)
.toUpperCase()}
</span>
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
{business.business_name || business.name || "Business Profile"}
</h1>

<div style={actionRow}>
<button onClick={toggleFollow} style={followBtn(isFollowing)}>
{isFollowing ? "Following" : "Follow"} • {followersCount}
</button>

<button
onClick={() => router.push("/business-settings")}
style={editBtn}
>
Edit Profile
</button>
</div>

<div style={statsRow}>
<div style={statBox}>
<b>{followersCount}</b>
<span>Followers</span>
</div>

<div style={statBox}>
<b>{followingCount}</b>
<span>Following</span>
</div>

<div style={statBox}>
<b>{posts.length}</b>
<span>Posts</span>
</div>
</div>
</div>
</div>

<div style={infoGrid}>
<div style={infoCard}>
<span style={infoIcon}>⌖</span>
<div>
{business.location || business.service_area || "No location"}
<small>Location</small>
</div>
</div>

<div style={infoCard}>
<span style={infoIcon}>☎</span>
<div>
{business.phone || business.notification_phone || "No phone"}
<small>Phone</small>
</div>
</div>
</div>

<div style={buttonRow}>
{business.whatsapp && (
<a
href={`https://wa.me/${String(business.whatsapp).replace(
/\D/g,
""
)}`}
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
{p.image_url && (
<img src={p.image_url} style={media} alt="post" />
)}

{p.video_url && (
<>
<video src={p.video_url} playsInline style={media} />
<div style={playBadge}>▶</div>
</>
)}
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

const xeonBorder = "1px solid rgba(220,235,255,0.28)";
const xeonGlow =
"0 0 3px rgba(255,255,255,0.55), 0 0 22px rgba(220,235,255,0.28), 0 0 60px rgba(120,160,255,0.16)";
const xeonGlowStrong =
"0 0 6px rgba(255,255,255,0.85), 0 0 30px rgba(220,235,255,0.45), 0 0 75px rgba(120,160,255,0.22)";
const glassBg = "rgba(8,12,22,0.78)";
const cardBg = "rgba(10,14,24,0.92)";
const whiteBtn = "linear-gradient(180deg,#ffffff,#eaf0ff)";

const followBtn = (active: boolean): React.CSSProperties => ({
padding: "10px 18px",
borderRadius: 999,
border: active ? xeonBorder : "1px solid rgba(255,255,255,0.78)",
background: active ? glassBg : whiteBtn,
color: active ? "#ffffff" : "#05070d",
fontWeight: 900,
cursor: "pointer",
boxShadow: active ? xeonGlow : xeonGlowStrong,
});

const page: React.CSSProperties = {
minHeight: "100vh",
padding: "118px 16px 130px",
color: "white",
background:
"radial-gradient(circle at 72% 0%, rgba(220,235,255,0.10), transparent 34%), radial-gradient(circle at 28% 35%, rgba(120,160,255,0.10), transparent 32%), #05070d",
fontFamily: "Inter, Arial, sans-serif",
position: "relative",
overflowX: "hidden",
};

const bgGlow1: React.CSSProperties = {
position: "fixed",
width: 320,
height: 320,
borderRadius: "50%",
background: "rgba(220,235,255,0.10)",
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
background: "rgba(120,160,255,0.08)",
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
border: xeonBorder,
background: glassBg,
color: "white",
borderRadius: 18,
padding: "12px 18px",
fontWeight: 900,
backdropFilter: "blur(14px)",
boxShadow: xeonGlow,
};

const backBtn: React.CSSProperties = {
position: "relative",
zIndex: 2,
border: xeonBorder,
background: glassBg,
color: "white",
padding: "12px 18px",
borderRadius: 18,
fontWeight: 900,
marginBottom: 18,
boxShadow: xeonGlow,
};

const profileCard: React.CSSProperties = {
position: "relative",
zIndex: 2,
borderRadius: 30,
padding: 22,
background: cardBg,
border: xeonBorder,
boxShadow: xeonGlowStrong,
marginBottom: 26,
backdropFilter: "blur(16px)",
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
background: glassBg,
border: "2px solid rgba(255,255,255,0.82)",
display: "flex",
alignItems: "center",
justifyContent: "center",
color: "#ffffff",
fontSize: 42,
fontWeight: 950,
boxShadow: xeonGlowStrong,
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
background: whiteBtn,
color: "#05070d",
display: "grid",
placeItems: "center",
fontWeight: 950,
boxShadow: xeonGlowStrong,
cursor: "pointer",
border: "1px solid rgba(255,255,255,0.78)",
};

const profileCopy: React.CSSProperties = {
minWidth: 0,
flex: 1,
};

const livePill: React.CSSProperties = {
display: "inline-flex",
alignItems: "center",
gap: 8,
padding: "8px 12px",
borderRadius: 999,
background: glassBg,
border: xeonBorder,
color: "#ffffff",
fontWeight: 900,
fontSize: 11,
marginBottom: 12,
boxShadow: xeonGlow,
};

const greenDot: React.CSSProperties = {
width: 8,
height: 8,
borderRadius: "50%",
background: "#ffffff",
boxShadow: "0 0 12px rgba(220,235,255,0.9)",
};

const title: React.CSSProperties = {
margin: 0,
fontSize: 34,
lineHeight: 1,
fontWeight: 950,
letterSpacing: -1.5,
};

const actionRow: React.CSSProperties = {
display: "flex",
gap: 10,
flexWrap: "wrap",
marginTop: 14,
};

const editBtn: React.CSSProperties = {
padding: "10px 18px",
borderRadius: 999,
border: xeonBorder,
background: glassBg,
color: "#ffffff",
fontWeight: 900,
cursor: "pointer",
boxShadow: xeonGlow,
};

const statsRow: React.CSSProperties = {
display: "flex",
gap: 14,
marginTop: 18,
flexWrap: "nowrap",
width: "100%",
};

const statBox: React.CSSProperties = {
minWidth: 0,
flex: 1,
padding: "12px 14px",
borderRadius: 18,
background: glassBg,
border: xeonBorder,
color: "white",
display: "flex",
flexDirection: "column",
gap: 3,
fontSize: 12,
boxShadow: xeonGlow,
};

const infoGrid: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "1fr",
gap: 12,
};

const infoCard: React.CSSProperties = {
padding: 16,
borderRadius: 20,
background: glassBg,
border: xeonBorder,
display: "flex",
alignItems: "center",
gap: 14,
boxShadow: xeonGlow,
};

const infoIcon: React.CSSProperties = {
color: "#ffffff",
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
background: whiteBtn,
color: "#05070d",
fontWeight: 950,
fontSize: 16,
border: "1px solid rgba(255,255,255,0.78)",
boxShadow: xeonGlowStrong,
};

const outlineBtn: React.CSSProperties = {
flex: 1,
minWidth: 145,
textAlign: "center",
textDecoration: "none",
padding: "15px 18px",
borderRadius: 18,
border: xeonBorder,
background: glassBg,
color: "white",
fontWeight: 950,
fontSize: 16,
boxShadow: xeonGlow,
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
border: xeonBorder,
background: glassBg,
color: "#ffffff",
borderRadius: 999,
padding: "10px 14px",
fontWeight: 900,
boxShadow: xeonGlow,
};

const emptyBox: React.CSSProperties = {
padding: 24,
borderRadius: 24,
background: cardBg,
border: xeonBorder,
color: "rgba(255,255,255,0.78)",
boxShadow: xeonGlow,
};

const grid: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "repeat(3, 1fr)",
gap: 8,
marginTop: 20,
};

const postCard: React.CSSProperties = {
overflow: "hidden",
borderRadius: 16,
background: glassBg,
border: xeonBorder,
boxShadow: xeonGlow,
};

const mediaWrap: React.CSSProperties = {
aspectRatio: "1 / 1",
overflow: "hidden",
borderRadius: 16,
position: "relative",
background: "#020617",
};

const media: React.CSSProperties = {
width: "100%",
height: "100%",
objectFit: "cover",
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

const empty: React.CSSProperties = {
height: "100vh",
display: "flex",
justifyContent: "center",
alignItems: "center",
color: "white",
background: "#05070d",
textAlign: "center",
padding: 30,
};

const loaderCard: React.CSSProperties = {
padding: 28,
borderRadius: 28,
background: cardBg,
border: xeonBorder,
boxShadow: xeonGlow,
};

const loaderDot: React.CSSProperties = {
width: 18,
height: 18,
borderRadius: "50%",
background: "#ffffff",
margin: "0 auto 16px",
boxShadow: "0 0 24px rgba(220,235,255,0.8)",
};

const bottomNav: React.CSSProperties = {
position: "fixed",
bottom: 0,
left: 0,
right: 0,
height: 96,
background: "rgba(4,9,18,0.88)",
borderTop: xeonBorder,
display: "flex",
justifyContent: "space-around",
alignItems: "center",
zIndex: 50,
backdropFilter: "blur(18px)",
boxShadow: xeonGlow,
};

const navBtn: React.CSSProperties = {
border: "none",
background: "transparent",
color: "rgba(255,255,255,0.62)",
fontWeight: 850,
};

const navActive: React.CSSProperties = {
...navBtn,
color: "#ffffff",
};

const plusBtn: React.CSSProperties = {
width: 72,
height: 72,
borderRadius: "50%",
border: "1px solid rgba(255,255,255,0.82)",
background: whiteBtn,
color: "#05070d",
fontSize: 42,
fontWeight: 950,
boxShadow: xeonGlowStrong,
};
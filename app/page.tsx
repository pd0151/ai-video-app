"use client";

import { CSSProperties, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type ChatMessage = {
role: "user" | "assistant";
content: string;
};

export default function Home() {
const router = useRouter();
const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
const [chatLoading, setChatLoading] = useState(false);
const [chatInput, setChatInput] = useState("");
const [prompt, setPrompt] = useState("");
const [businessName, setBusinessName] = useState("");
const [image, setImage] = useState<string | null>(null);
const [loadingImage, setLoadingImage] = useState(false);
const [isPro, setIsPro] = useState(false);
const [credits, setCredits] = useState(0);

useEffect(() => {
async function loadUser() {
const { data } = await supabase.auth.getUser();

if (!data.user) {
router.push("/login");
return;
}

const user = data.user;

const { data: paid } = await supabase
.from("paid_users")
.select("*")
.eq("email", user.email?.toLowerCase().trim())
.eq("is_paid", true)
.maybeSingle();

if (paid) setIsPro(true);

const { data: business } = await supabase
.from("businesses")
.select("name")
.eq("email", user.email?.toLowerCase().trim())
.single();

if (business?.name) setBusinessName(business.name);

const { data: creditsRow } = await supabase
.from("user_credits")
.select("*")
.eq("user_id", user.id)
.single();

if (creditsRow) {
setCredits(creditsRow.credits || 0);
} else {
const { data: inserted } = await supabase
.from("user_credits")
.insert({
user_id: user.id,
email: user.email,
credits: 3,
})
.select()
.single();

setCredits(inserted?.credits || 3);
}
}

loadUser();
}, [router]);

async function logout() {
await supabase.auth.signOut();
router.push("/login");
}

async function upgradeUser() {
const res = await fetch("/api/create-checkout", {
method: "POST",
});

const data = await res.json();

if (data.url) {
window.location.href = data.url;
}
}

async function generateAd() {
if (!isPro && credits <= 0) {
alert("No credits left");
return;
}

if (!prompt.trim()) {
alert("Enter prompt");
return;
}

setLoadingImage(true);

try {
const res = await fetch("/api/generate-image", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
prompt: `
Create a premium luxury advert for ${businessName || "this business"}.

Business:
${prompt}

Cinematic lighting.
Modern social media advert.
Professional branding.
`,
}),
});

const data = await res.json();

const imageUrl =
data.image || data.url || data.image_url || data.output?.[0];

if (imageUrl) {
setImage(imageUrl);
}

if (!isPro) {
const newCredits = Math.max(credits - 1, 0);

setCredits(newCredits);

const { data } = await supabase.auth.getUser();

if (data.user) {
await supabase.from("user_credits").upsert(
{
user_id: data.user.id,
email: data.user.email,
credits: newCredits,
},
{ onConflict: "user_id" }
);
}
}
} catch {
alert("Generation failed");
} finally {
setLoadingImage(false);
}
}
async function sendChatMessage() {
if (!chatInput.trim()) return;

const newMessage = {
role: "user" as const,
content: chatInput,
};

setChatMessages((prev) => [...prev, newMessage]);
setChatInput("");
setChatLoading(true);

setTimeout(() => {
setChatMessages((prev) => [
...prev,
{
role: "assistant",
content:
"Try adding urgency, location and an offer to improve conversions.",
},
]);

setChatLoading(false);
}, 1000);
}
return (
<main style={page}>
<header style={topBar}>
<h1 style={logo}>
Ad<span style={{ color: "#a855f7" }}>Forge</span>
</h1>

<div style={topRight}>
<div style={creditBox}>
<span style={coin}>S</span>

<div>
<b>{isPro ? "∞" : credits}</b>
<div style={small}>Credits</div>
</div>
</div>

{isPro ? (
<div style={upgrade}>✅ Pro</div>
) : (
<button style={upgrade} onClick={upgradeUser}>
🚀 Upgrade
</button>
)}
</div>
</header>

<section
style={aiHero}
onClick={() => router.push("/ai-receptionist")}
>
<button
onClick={(e) => {
e.stopPropagation();
logout();
}}
style={logoutBtn}
>
Logout
</button>

<div style={aiGlow} />

<div style={aiPill}>
<span style={greenDot} />
LIVE AI RECEPTIONIST
</div>

<h2 style={aiTitle}>
Never miss
<br />
another call
</h2>

<p style={aiText}>
AI answers calls, captures leads and updates your dashboard instantly.
</p>

<div style={aiFeatureGrid}>
<div style={aiFeature}>📞 24/7 Calls</div>
<div style={aiFeature}>👤 Lead Capture</div>
<div style={aiFeature}>💬 SMS Alerts</div>
<div style={aiFeature}>📊 Live Dashboard</div>
</div>

<div style={aiLeadCard}>
<div style={aiLeadTop}>
<span>🟢 AI Online</span>
<b>LIVE</b>
</div>

<div style={aiLeadInner}>
<small>NEW LEAD</small>

<h3>Mobile tyre job</h3>

<p>BMW 1 Series • Liverpool</p>
</div>
</div>

<button style={aiCta}>
🔥 Activate AI Receptionist
</button>
</section>

<section style={heroCard}>
<h2 style={heroTitle}>
Create high-converting ads in seconds 🚀
</h2>

<p style={heroSub}>
Describe your business and let AI create premium adverts.
</p>

<div style={promptBox}>
<textarea
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="What do you want to advertise?"
style={promptInput}
/>

<div style={toolRow}>
<button style={chip}>
✨ AI Prompt
</button>

<button style={chip}>
🔥 Viral Style
</button>

<button style={arrowBtn} onClick={generateAd}>
{loadingImage ? "..." : "↑"}
</button>
</div>
</div>
</section>
{image && (
<section style={heroCard}>
<div style={sectionTop}>
<b style={{ color: "#c084fc" }}>Your AI Generated Ad</b>

<button style={smallDarkBtn} onClick={generateAd}>
Regenerate
</button>
</div>

<div style={generatedWrap}>
<img src={image} style={generatedImg} alt="Generated advert" />

<button style={useBtn} onClick={useThisAd}>
Post to Feed
</button>
</div>
</section>
)}

<section style={heroCard}>
<h3 style={sectionTitle}>Quick Actions</h3>

<div style={actionGrid}>
<button style={actionCard} onClick={generateAd}>
<span>🖼️</span>
<b>Generate Image</b>
</button>

<button style={actionCard} onClick={() => router.push("/video")}>
<span>🎬</span>
<b>Generate Video</b>
</button>

<label style={actionCard}>
<span>📤</span>
<b>Upload Media</b>
<input
type="file"
accept="image/*,video/*"
onChange={(e) => {
const file = e.target.files?.[0];
if (file) uploadMedia(file);
}}
style={{ display: "none" }}
/>
</label>

<button style={actionCard} onClick={() => router.push("/feed")}>
<span>📊</span>
<b>View Feed</b>
</button>
</div>
</section>

<section style={heroCard}>
<h3 style={sectionTitle}>ChatGPT Ad Assistant</h3>

<div style={messages}>
{chatMessages.map((msg, i) => (
<div
key={i}
style={{
...bubble,
alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
background:
msg.role === "user"
? "linear-gradient(135deg,#7c3aed,#a855f7)"
: "rgba(255,255,255,0.08)",
}}
>
{msg.content}
</div>
))}

{chatLoading && <p style={heroSub}>AI is typing...</p>}
</div>

<input
value={chatInput}
onChange={(e) => setChatInput(e.target.value)}
placeholder="Ask AI to improve your advert..."
style={chatInputStyle}
onKeyDown={(e) => {
if (e.key === "Enter") sendChatMessage();
}}
/>

<button style={sendBtn} onClick={sendChatMessage}>
Send Chat
</button>
</section>

<nav style={bottomNav}>
<button style={navActive} onClick={() => router.push("/")}>
Home
</button>

<button style={navBtn} onClick={() => router.push("/feed")}>
Feed
</button>

<button style={plusBtn} onClick={generateAd}>
+
</button>

<button style={navBtn} onClick={() => router.push("/video")}>
Create
</button>

<button style={navBtn} onClick={() => router.push("/profile")}>
Profile
</button>
</nav>
</main>
);
}

async function uploadMedia(file: File) {
const { data } = await supabase.auth.getUser();
const user = data.user;

if (!user) {
alert("Login first");
return;
}

const filePath = `${user.id}/${Date.now()}-${file.name}`;

const { error: uploadError } = await supabase.storage
.from("posts")
.upload(filePath, file);

if (uploadError) {
alert(uploadError.message);
return;
}

const { data: urlData } = supabase.storage
.from("posts")
.getPublicUrl(filePath);

const publicUrl = urlData.publicUrl;
const isVideo = file.type.startsWith("video");

const { error } = await supabase.from("posts").insert({
user_id: user.id,
content: "Uploaded media",
image_url: isVideo ? null : publicUrl,
video_url: isVideo ? publicUrl : null,
business_name: "Total Tyres 247",
location: "Liverpool",
});

if (error) {
alert(error.message);
return;
}

window.location.href = "/feed";
}

async function useThisAd() {
alert("Use This Ad button is connected in the main component version.");
}

const page: CSSProperties = {
minHeight: "100vh",
maxWidth: 430,
margin: "0 auto",
background:
"radial-gradient(circle at top,#2d0a51 0%,#13051f 35%,#050507 75%,#020202 100%)",
color: "white",
fontFamily: "Arial, sans-serif",
padding: "18px 16px 120px",
boxSizing: "border-box",
overflowX: "hidden",
};

const topBar: CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: 14,
};

const logo: CSSProperties = {
margin: 0,
fontSize: 30,
fontWeight: 950,
letterSpacing: -1,
};

const topRight: CSSProperties = {
display: "flex",
gap: 8,
alignItems: "center",
};

const creditBox: CSSProperties = {
display: "flex",
alignItems: "center",
gap: 8,
padding: "8px 11px",
borderRadius: 18,
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.1)",
};

const coin: CSSProperties = {
width: 31,
height: 31,
borderRadius: 999,
display: "grid",
placeItems: "center",
background: "linear-gradient(135deg,#c084fc,#7c3aed)",
fontWeight: 950,
};

const small: CSSProperties = {
fontSize: 11,
opacity: 0.65,
};

const upgrade: CSSProperties = {
border: "none",
borderRadius: 18,
padding: "12px 14px",
color: "white",
fontWeight: 950,
background: "linear-gradient(135deg,#a855f7,#7c3aed)",
boxShadow: "0 0 22px rgba(168,85,247,0.35)",
};

const heroCard: CSSProperties = {
marginTop: 14,
padding: 18,
borderRadius: 26,
background:
"linear-gradient(145deg,rgba(20,10,38,0.96),rgba(7,7,18,0.98))",
border: "1px solid rgba(168,85,247,0.18)",
boxShadow: "0 0 24px rgba(124,58,237,0.14)",
};

const aiHero: CSSProperties = {
...heroCard,
position: "relative",
overflow: "hidden",
cursor: "pointer",
padding: "16px 16px 14px",
background:
"radial-gradient(circle at 82% 14%, rgba(168,85,247,0.46), transparent 34%), linear-gradient(145deg,rgba(70,20,135,0.96),rgba(10,5,30,0.98))",
border: "1px solid rgba(168,85,247,0.55)",
};

const aiGlow: CSSProperties = {
position: "absolute",
width: 220,
height: 220,
right: -90,
top: 45,
borderRadius: "50%",
background: "radial-gradient(circle, rgba(192,132,252,0.28), transparent 70%)",
filter: "blur(18px)",
};

const logoutBtn: CSSProperties = {
position: "absolute",
top: 10,
right: 10,
zIndex: 10,
border: "1px solid rgba(255,255,255,0.12)",
borderRadius: 999,
padding: "8px 12px",
background: "rgba(0,0,0,0.28)",
color: "white",
fontWeight: 800,
};

const aiPill: CSSProperties = {
position: "relative",
zIndex: 2,
display: "inline-flex",
alignItems: "center",
gap: 7,
padding: "7px 11px",
borderRadius: 999,
background: "rgba(255,255,255,0.09)",
color: "#86efac",
fontSize: 11,
fontWeight: 950,
};

const greenDot: CSSProperties = {
width: 8,
height: 8,
borderRadius: 999,
background: "#4ade80",
};

const aiTitle: CSSProperties = {
position: "relative",
zIndex: 2,
margin: "18px 0 0",
fontSize: 34,
lineHeight: 0.94,
letterSpacing: -1.8,
fontWeight: 950,
};

const aiText: CSSProperties = {
position: "relative",
zIndex: 2,
marginTop: 12,
color: "rgba(255,255,255,0.76)",
fontSize: 14,
lineHeight: 1.4,
};

const aiFeatureGrid: CSSProperties = {
position: "relative",
zIndex: 2,
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: 8,
marginTop: 13,
};

const aiFeature: CSSProperties = {
padding: "10px 10px",
borderRadius: 14,
background: "rgba(5,8,25,0.78)",
border: "1px solid rgba(255,255,255,0.08)",
fontSize: 12,
fontWeight: 900,
};

const aiLeadCard: CSSProperties = {
position: "relative",
zIndex: 2,
marginTop: 12,
padding: 10,
borderRadius: 18,
background: "rgba(5,8,25,0.88)",
border: "1px solid rgba(168,85,247,0.22)",
};

const aiLeadTop: CSSProperties = {
display: "flex",
justifyContent: "space-between",
color: "#86efac",
fontSize: 12,
fontWeight: 900,
};

const aiLeadInner: CSSProperties = {
marginTop: 9,
padding: 10,
borderRadius: 14,
background: "rgba(0,0,0,0.26)",
};

const aiCta: CSSProperties = {
width: "100%",
marginTop: 12,
padding: "13px",
borderRadius: 16,
border: "none",
background: "linear-gradient(90deg,#22c55e,#86efac)",
color: "#04130a",
fontWeight: 950,
};

const heroTitle: CSSProperties = {
margin: 0,
fontSize: 24,
lineHeight: 1.15,
fontWeight: 950,
};

const heroSub: CSSProperties = {
opacity: 0.68,
lineHeight: 1.4,
};

const promptBox: CSSProperties = {
marginTop: 16,
padding: 14,
borderRadius: 22,
background: "rgba(0,0,0,0.28)",
border: "1px solid rgba(168,85,247,0.2)",
};

const promptInput: CSSProperties = {
width: "100%",
height: 90,
background: "transparent",
border: "none",
outline: "none",
resize: "none",
color: "white",
fontSize: 17,
};

const toolRow: CSSProperties = {
display: "flex",
alignItems: "center",
gap: 8,
};

const chip: CSSProperties = {
border: "none",
borderRadius: 999,
padding: "9px 11px",
background: "rgba(255,255,255,0.09)",
color: "white",
fontWeight: 900,
fontSize: 12,
};

const arrowBtn: CSSProperties = {
marginLeft: "auto",
width: 48,
height: 48,
borderRadius: 999,
border: "none",
background: "linear-gradient(135deg,#a855f7,#7c3aed)",
color: "white",
fontSize: 26,
fontWeight: 950,
};

const sectionTop: CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
};

const smallDarkBtn: CSSProperties = {
border: "none",
borderRadius: 999,
padding: "9px 12px",
background: "rgba(255,255,255,0.08)",
color: "white",
fontWeight: 900,
};

const generatedWrap: CSSProperties = {
marginTop: 14,
display: "grid",
gap: 12,
};

const generatedImg: CSSProperties = {
width: "100%",
borderRadius: 18,
maxHeight: 360,
objectFit: "cover",
};

const useBtn: CSSProperties = {
border: "none",
borderRadius: 16,
padding: "13px",
background: "linear-gradient(135deg,#9333ea,#7c3aed)",
color: "white",
fontWeight: 950,
};

const sectionTitle: CSSProperties = {
margin: 0,
fontSize: 21,
fontWeight: 950,
};

const actionGrid: CSSProperties = {
marginTop: 14,
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: 10,
};

const actionCard: CSSProperties = {
minHeight: 115,
borderRadius: 20,
border: "1px solid rgba(168,85,247,0.14)",
background: "rgba(255,255,255,0.05)",
color: "white",
display: "grid",
placeItems: "center",
gap: 6,
fontWeight: 900,
};

const messages: CSSProperties = {
marginTop: 12,
display: "flex",
flexDirection: "column",
gap: 10,
};

const bubble: CSSProperties = {
padding: 12,
borderRadius: 16,
maxWidth: "88%",
whiteSpace: "pre-wrap",
};

const chatInputStyle: CSSProperties = {
width: "100%",
marginTop: 12,
padding: 13,
borderRadius: 16,
border: "none",
outline: "none",
boxSizing: "border-box",
};

const sendBtn: CSSProperties = {
width: "100%",
marginTop: 10,
padding: 13,
borderRadius: 16,
border: "none",
background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
color: "white",
fontWeight: 950,
};

const bottomNav: CSSProperties = {
position: "fixed",
left: 0,
right: 0,
bottom: 0,
height: 86,
maxWidth: 430,
margin: "0 auto",
background: "rgba(5,5,7,0.96)",
borderTop: "1px solid rgba(168,85,247,0.14)",
display: "flex",
justifyContent: "space-around",
alignItems: "center",
zIndex: 50,
};

const navBtn: CSSProperties = {
border: "none",
background: "transparent",
color: "rgba(255,255,255,0.58)",
fontWeight: 900,
};

const navActive: CSSProperties = {
...navBtn,
color: "#a855f7",
};

const plusBtn: CSSProperties = {
width: 62,
height: 62,
borderRadius: 999,
border: "none",
background: "linear-gradient(135deg,#a855f7,#7c3aed)",
color: "white",
fontSize: 34,
fontWeight: 950,
};
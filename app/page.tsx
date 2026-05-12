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

const [prompt, setPrompt] = useState("");
const [businessName, setBusinessName] = useState("");
const [image, setImage] = useState<string | null>(null);
const [loadingImage, setLoadingImage] = useState(false);
const [isPro, setIsPro] = useState(false);
const [user, setUser] = useState<any>(null);
const [credits, setCredits] = useState(0);
const [chatInput, setChatInput] = useState("");
const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
const [chatLoading, setChatLoading] = useState(false);

useEffect(() => {
const loadCredits = async () => {
const { data } = await supabase.auth.getUser();
const currentUser = data.user;

if (!currentUser) {
window.location.href = "/login";
return;
}

setUser(currentUser);
const { data: business } = await supabase
.from("businesses")
.select("name")
.eq("email", currentUser.email?.toLowerCase().trim())
.single();

if (business?.name) {
setBusinessName(business.name);
}


const { data: creditRow } = await supabase
.from("user_credits")
.select("*")
.eq("user_id", currentUser.id)
.single();

if (!creditRow) {
const { data: newCredits } = await supabase
.from("user_credits")
.insert({
user_id: currentUser.id,
email: currentUser.email,
credits: 3,
})
.select()
.single();

setCredits(newCredits?.credits || 3);
} else {
setCredits(creditRow.credits || 0);
}
};

loadCredits();
}, []);

async function upgradeUser() {
const res = await fetch("/api/create-checkout", {
method: "POST",
});

const data = await res.json();

if (data.url) {
window.location.href = data.url;
} else {
alert(data.error || "Checkout failed");
}
}

async function generateAd() {
if (!isPro && credits <= 0) {
alert("You’ve used your free AI credits. Upgrade to continue 🚀");
return;
}

if (!prompt.trim()) {
alert("Enter what you want to advertise");
return;
}

setLoadingImage(true);
setImage(null);

try {
const res = await fetch("/api/generate-image", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
prompt: `
Create a premium social media advertisement for ${businessName}.

Business type: ${prompt}

Modern cinematic marketing image.
Luxury lighting.
Professional branding.
High quality viral advertisement.
`,
}),
});

const data = await res.json();

const newCredits = Math.max(credits - 1, 0);
setCredits(newCredits);

const { data: authData } = await supabase.auth.getUser();
const currentUser = authData.user;

if (currentUser) {
const { error } = await supabase.from("user_credits").upsert(
{
user_id: currentUser.id,
email: currentUser.email,
credits: newCredits,
},
{ onConflict: "user_id" }
);

if (error) {
alert("CREDIT SAVE FAILED: " + error.message);
}
}

if (!res.ok) {
alert(data.error || "Image failed");
return;
}

const imageUrl =
data.image || data.url || data.image_url || data.output?.[0];

if (!imageUrl) {
alert("No image returned");
return;
}

setImage(imageUrl);
} catch (err: any) {
alert(err?.message || "Image failed");
} finally {
setLoadingImage(false);
}
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
content: prompt || "Uploaded media",
image_url: isVideo ? null : publicUrl,
video_url: isVideo ? publicUrl : null,
business_name: "Total Tyres 247",
location: "Liverpool",
});

if (error) {
alert(error.message);
return;
}

alert("Uploaded to feed 🚀");
router.push("/feed");
}

async function useThisAd() {
if (!image) {
alert("Generate an ad first");
return;
}

const { data } = await supabase.auth.getUser();
const user = data.user;

if (!user) {
alert("Login first");
return;
}

const { error } = await supabase.from("posts").insert({
user_id: user.id,
image_url: image,
video_url: null,
content: prompt || "AI generated ad",
business_name: "Total Tyres 247",
location: "Liverpool",
});

if (error) {
alert(error.message);
return;
}

alert("Posted to feed 🚀");
router.push("/feed");
}

async function sendChatMessage() {
if (!chatInput.trim()) return;

const nextMessages: ChatMessage[] = [
...chatMessages,
{ role: "user", content: chatInput.trim() },
];

setChatMessages(nextMessages);
setChatInput("");
setChatLoading(true);

try {
const res = await fetch("/api/chat", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ messages: nextMessages }),
});

const data = await res.json();

setChatMessages([
...nextMessages,
{ role: "assistant", content: data.reply || "No reply" },
]);
} catch {
setChatMessages([
...nextMessages,
{ role: "assistant", content: "Chat failed. Try again." },
]);
} finally {
setChatLoading(false);
}
}

return (
<main style={page}>
<header style={topBar}>
<h1 style={logo}>
Ad<span style={{ color: "#a855f7" }}>Forge</span>✦
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
<div style={upgrade}>✅ Pro Active</div>
) : (
<button onClick={upgradeUser} style={upgrade}>
🚀 Upgrade – Unlimited Ads
</button>
)}
</div>
</header>

<section onClick={() => router.push("/ai-receptionist")} style={aiHero}>
<div style={aiGlow}></div>

<div style={aiPill}>
<span style={greenDot}></span>
LIVE AI RECEPTIONIST
</div>

<h2 style={aiTitle}>
Never miss
<br />
<span>another call</span>
</h2>

<p style={aiText}>
AI answers missed calls, captures customer details, sends instant SMS alerts
and updates your live leads dashboard.
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
<b>Live</b>
</div>

<div style={aiLeadInner}>
<small>NEW LEAD</small>
<h3>Mobile tyre job</h3>
<p>BMW 1 Series • L3 postcode</p>
</div>
</div>

<button style={aiCta}>
🔥 Activate AI Receptionist <span>›</span>
</button>
</section>

<section style={heroCard}>
<h2 style={heroTitle}>Create high-converting ads in seconds with AI 🚀</h2>
<p style={heroSub}>Describe your product or business</p>
<p style={{ opacity: 0.8, marginBottom: 10 }}>
Free users get limited access. Upgrade to unlock unlimited AI ads.
</p>

<div style={promptBox}>
<textarea
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="What do you want to advertise?"
style={promptInput}
/>

<div style={toolRow}>
<button
style={chip}
onClick={() => setPrompt("Mobile tyre fitting Liverpool 24/7")}
>
☷ Examples
</button>

<button
style={chip}
onClick={() => setPrompt(`${prompt} make this advert better`)}
>
✧ Improve
</button>

<button
style={chip}
onClick={() => setPrompt(`${prompt} make this shorter`)}
>
✂ Shorten
</button>

<button style={arrowBtn} onClick={generateAd}>
{loadingImage ? "…" : "↑"}
</button>

<label style={uploadBubble}>
📤
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
</div>
</div>
</section>

<section style={generatedCard}>
<div style={sectionTop}>
<b style={{ color: "#b36bff" }}>Your AI Generated Ad</b>
<button style={smallDarkBtn} onClick={generateAd}>
⟳ Regenerate
</button>
</div>

<div style={adPreview}>
<div>
<h2 style={adHeading}>
{businessName || "Your Business"} <br />
<span style={{ color: "#8b5cf6" }}>
{prompt || "AI Generated Ad"}
</span>
</h2>

<p style={adText}>
Professional AI advertising for your business.
<br />
Generate viral ads in seconds.
</p>

<button style={useBtn} onClick={useThisAd}>
◎ Use This Ad
</button>
</div>

<div style={poster}>
{image ? (
<img src={image} alt="Generated ad" style={posterImg} />
) : (
<>
<img
src={image || "https://images.unsplash.com/photo-1556745757-8d76bdb6984b"}
style={posterImg}
/>
<div style={posterShade} />
<div style={posterWords}>
WE COME
<br />
TO YOU
</div>
<div style={posterBadge}>FAST & RELIABLE</div>
</>
)}
</div>
</div>
</section>

<section style={trendingCard}>
<div style={sectionTop}>
<h3 style={sectionTitle}>Trending Ads 🔥</h3>
<button style={seeAll} onClick={() => router.push("/feed")}>
See all ›
</button>
</div>

<div style={trendRow}>
<Trend
badge="Popular"
title="COFFEE MADE BETTER"
img="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&q=80"
likes="248"
views="12.5K"
/>
<Trend
badge="New"
title="Fresh looks for every occasion."
img="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80"
likes="192"
views="9.8K"
/>
<Trend
badge="Hot"
title="Healthy meals, happy life."
img="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80"
likes="315"
views="15.2K"
/>
</div>
</section>

<section style={actionsCard}>
<h3 style={sectionTitle}>Quick Actions</h3>

<div style={actionGrid}>
<ActionCard
title="Generate Image"
text="Create stunning images with AI"
icon="🖼️"
img="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80"
onClick={generateAd}
/>

<ActionCard
title="Generate Video"
text="Create advert videos"
icon="🎬"
img="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80"
onClick={() => router.push("/video")}
/>

<label style={actionCardBase}>
<img
src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
style={actionBg}
alt=""
/>
<div style={actionOverlay} />
<div style={actionContent}>
<div style={actionIcon}>📤</div>
<b>Upload Media</b>
<span>Upload your own images or videos</span>
</div>
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

<ActionCard
title="My Ads"
text="View and manage all your ads"
icon="📊"
img="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
onClick={() => router.push("/feed")}
/>
</div>
</section>

<section style={chatBox}>
<h3 style={chatTitle}>💬 ChatGPT Ad Assistant</h3>
<p style={chatSub}>Ask AI to write, improve, shorten or create advert ideas.</p>

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
{chatLoading && <div style={typing}>AI is typing...</div>}
</div>

<input
value={chatInput}
onChange={(e) => setChatInput(e.target.value)}
placeholder="Ask AI to write or improve your ad..."
style={chatInputStyle}
onKeyDown={(e) => {
if (e.key === "Enter") sendChatMessage();
}}
/>

<button style={sendBtn} onClick={sendChatMessage}>
💬 Send Chat
</button>
</section>

<nav style={bottomNav}>
<button style={navActive} onClick={() => router.push("/")}>
⌂
<br />
Home
</button>
<button style={navBtn} onClick={() => router.push("/feed")}>
▦
<br />
Feed
</button>
<button style={plusBtn} onClick={generateAd}>
＋
</button>
<button style={navBtn} onClick={() => router.push("/video")}>
✧
<br />
Create
</button>
<button style={navBtn} onClick={() => router.push("/profile")}>
♙
<br />
Profile
</button>
</nav>
</main>
);
}

function Trend({
badge,
title,
img,
likes,
views,
}: {
badge: string;
title: string;
img: string;
likes: string;
views: string;
}) {
return (
<div style={trendCard}>
<img src={img} style={trendImg} alt="" />
<div style={trendShade} />
<span style={trendBadge}>{badge}</span>
<b style={trendTitle}>{title}</b>
<button style={playBtn}>▶</button>
<div style={trendStats}>
♡ {likes} &nbsp;&nbsp; ◉ {views}
</div>
</div>
);
}

function ActionCard({
title,
text,
icon,
img,
onClick,
}: {
title: string;
text: string;
icon: string;
img: string;
onClick: () => void;
}) {
return (
<button style={actionCardBase} onClick={onClick}>
<img src={img} style={actionBg} alt="" />
<div style={actionOverlay} />
<div style={actionContent}>
<div style={actionIcon}>{icon}</div>
<b>{title}</b>
<span>{text}</span>
</div>
</button>
);
}

const page: CSSProperties = {
minHeight: "100vh",
background:
"radial-gradient(circle at top,#160828 0%,#050507 55%,#000 100%)",
color: "white",
padding: "20px 16px 120px",
fontFamily: "Arial, sans-serif",
};

const topBar: CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: 18,
};

const logo: CSSProperties = {
margin: 0,
fontSize: 34,
fontWeight: 950,
};

const topRight: CSSProperties = {
display: "flex",
gap: 10,
alignItems: "center",
};

const creditBox: CSSProperties = {
display: "flex",
alignItems: "center",
gap: 10,
padding: "10px 14px",
borderRadius: 22,
background: "rgba(255,255,255,0.08)",
};

const coin: CSSProperties = {
width: 36,
height: 36,
borderRadius: "50%",
background:
"linear-gradient(135deg,#a855f7,#7c3aed)",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontWeight: 900,
};

const small: CSSProperties = {
fontSize: 12,
opacity: 0.7,
};

const upgrade: CSSProperties = {
border: "none",
borderRadius: 22,
padding: "14px 18px",
background:
"linear-gradient(135deg,#a855f7,#7c3aed)",
color: "white",
fontWeight: 900,
};

const aiHero: CSSProperties = {
position: "relative",
overflow: "hidden",
borderRadius: 34,
padding: "22px",
marginTop: 18,
background:
"radial-gradient(circle at top right, rgba(168,85,247,0.4), transparent 30%), linear-gradient(145deg,#2a0050,#090114)",
border: "1px solid rgba(168,85,247,0.7)",
boxShadow:
"0 0 50px rgba(168,85,247,0.25)",
};

const aiGlow: CSSProperties = {
position: "absolute",
inset: 0,
background:
"radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08), transparent 30%)",
};

const aiPill: CSSProperties = {
display: "inline-flex",
alignItems: "center",
gap: 8,
padding: "10px 16px",
borderRadius: 999,
background: "rgba(255,255,255,0.08)",
color: "#a7f3d0",
fontWeight: 900,
};

const greenDot: CSSProperties = {
width: 10,
height: 10,
borderRadius: "50%",
background: "#4ade80",
};

const aiTitle: CSSProperties = {
marginTop: 24,
fontSize: 72,
lineHeight: 0.88,
letterSpacing: -4,
fontWeight: 950,
};

const aiText: CSSProperties = {
marginTop: 24,
fontSize: 18,
lineHeight: 1.5,
color: "rgba(255,255,255,0.8)",
};

const aiFeatureGrid: CSSProperties = {
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: 14,
marginTop: 28,
};

const aiFeature: CSSProperties = {
background: "rgba(5,5,20,0.75)",
borderRadius: 22,
padding: "22px 18px",
fontWeight: 900,
border: "1px solid rgba(168,85,247,0.2)",
};

const aiLeadCard: CSSProperties = {
marginTop: 24,
borderRadius: 28,
padding: 20,
background: "rgba(3,4,18,0.92)",
};

const aiLeadTop: CSSProperties = {
display: "flex",
justifyContent: "space-between",
color: "#86efac",
fontWeight: 900,
};

const aiLeadInner: CSSProperties = {
marginTop: 18,
borderRadius: 20,
padding: 22,
background: "rgba(0,0,0,0.35)",
};

const aiCta: CSSProperties = {
width: "100%",
marginTop: 24,
border: "none",
borderRadius: 24,
padding: "22px",
background:
"linear-gradient(90deg,#22c55e,#86efac)",
color: "#04130a",
fontSize: 22,
fontWeight: 950,
};

const heroCard: CSSProperties = {
marginTop: 18,
padding: 24,
borderRadius: 30,
background:
"linear-gradient(145deg,#0c0918,#05050c)",
border: "1px solid rgba(255,255,255,0.08)",
};

const heroTitle: CSSProperties = {
fontSize: 26,
fontWeight: 950,
};

const heroSub: CSSProperties = {
opacity: 0.7,
};

const promptBox: CSSProperties = {
marginTop: 18,
borderRadius: 24,
padding: 18,
background: "rgba(0,0,0,0.28)",
};

const promptInput: CSSProperties = {
width: "100%",
height: 120,
background: "transparent",
border: "none",
color: "white",
fontSize: 20,
outline: "none",
};

const toolRow: CSSProperties = {
display: "flex",
gap: 10,
marginTop: 18,
};

const chip: CSSProperties = {
border: "none",
borderRadius: 18,
padding: "12px 16px",
background: "rgba(255,255,255,0.08)",
color: "white",
fontWeight: 900,
};

const arrowBtn: CSSProperties = {
marginLeft: "auto",
width: 60,
height: 60,
borderRadius: "50%",
border: "none",
background:
"linear-gradient(135deg,#a855f7,#7c3aed)",
color: "white",
fontSize: 34,
};

const uploadBubble: CSSProperties = {
width: 60,
height: 60,
borderRadius: "50%",
display: "flex",
alignItems: "center",
justifyContent: "center",
background: "rgba(255,255,255,0.08)",
};

const generatedCard: CSSProperties = {
marginTop: 18,
padding: 24,
borderRadius: 30,
background:
"linear-gradient(145deg,#0c0918,#05050c)",
};

const sectionTop: CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
};

const smallDarkBtn: CSSProperties = {
border: "none",
borderRadius: 18,
padding: "12px 16px",
background: "rgba(255,255,255,0.08)",
color: "white",
};

const adPreview: CSSProperties = {
marginTop: 20,
display: "grid",
gridTemplateColumns: "1fr 180px",
gap: 20,
};

const adHeading: CSSProperties = {
fontSize: 42,
fontWeight: 950,
};

const adText: CSSProperties = {
opacity: 0.75,
lineHeight: 1.5,
};

const useBtn: CSSProperties = {
marginTop: 18,
border: "none",
borderRadius: 18,
padding: "16px 22px",
background:
"linear-gradient(135deg,#9333ea,#7c3aed)",
color: "white",
fontWeight: 900,
};

const poster: CSSProperties = {
height: 260,
borderRadius: 24,
overflow: "hidden",
};

const posterImg: CSSProperties = {
width: "100%",
height: "100%",
objectFit: "cover",
};

const posterShade: CSSProperties = {};
const posterWords: CSSProperties = {};
const posterBadge: CSSProperties = {};

const trendingCard: CSSProperties = {
marginTop: 18,
};

const sectionTitle: CSSProperties = {
fontSize: 24,
fontWeight: 950,
};

const seeAll: CSSProperties = {
background: "transparent",
border: "none",
color: "#a855f7",
};

const trendRow: CSSProperties = {
display: "flex",
gap: 14,
overflowX: "auto",
};

const trendCard: CSSProperties = {
minWidth: 180,
};

const trendImg: CSSProperties = {
width: "100%",
height: 220,
borderRadius: 24,
objectFit: "cover",
};

const trendShade: CSSProperties = {};
const trendBadge: CSSProperties = {};
const trendTitle: CSSProperties = {};
const playBtn: CSSProperties = {};
const trendStats: CSSProperties = {};

const actionsCard: CSSProperties = {
marginTop: 18,
};

const actionGrid: CSSProperties = {
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: 14,
};

const actionCardBase: CSSProperties = {
height: 120,
borderRadius: 24,
border: "1px solid rgba(255,255,255,0.08)",
background: "rgba(255,255,255,0.03)",
};

const actionBg: CSSProperties = {};
const actionOverlay: CSSProperties = {};

const actionContent: CSSProperties = {
height: "100%",
display: "flex",
flexDirection: "column",
gap: 12,
alignItems: "center",
justifyContent: "center",
};

const actionIcon: CSSProperties = {
fontSize: 28,
};

const chatBox: CSSProperties = {
marginTop: 18,
};

const chatTitle: CSSProperties = {
fontSize: 24,
fontWeight: 950,
};

const chatSub: CSSProperties = {
opacity: 0.7,
};

const messages: CSSProperties = {
display: "flex",
flexDirection: "column",
gap: 10,
};

const bubble: CSSProperties = {
padding: 14,
borderRadius: 18,
};

const typing: CSSProperties = {};

const chatInputStyle: CSSProperties = {
width: "100%",
marginTop: 14,
padding: 16,
borderRadius: 18,
border: "none",
};

const sendBtn: CSSProperties = {
width: "100%",
marginTop: 14,
padding: 16,
borderRadius: 18,
border: "none",
background:
"linear-gradient(135deg,#6366f1,#8b5cf6)",
color: "white",
fontWeight: 900,
};

const bottomNav: CSSProperties = {
position: "fixed",
left: 0,
right: 0,
bottom: 0,
height: 90,
background: "rgba(5,5,7,0.95)",
borderTop:
"1px solid rgba(255,255,255,0.08)",
display: "flex",
justifyContent: "space-around",
alignItems: "center",
};

const navBtn: CSSProperties = {
background: "transparent",
border: "none",
color: "rgba(255,255,255,0.6)",
};

const navActive: CSSProperties = {
background: "transparent",
border: "none",
color: "#a855f7",
fontWeight: 900,
};

const plusBtn: CSSProperties = {
width: 70,
height: 70,
borderRadius: "50%",
border: "none",
background:
"linear-gradient(135deg,#a855f7,#7c3aed)",
color: "white",
fontSize: 40,
};
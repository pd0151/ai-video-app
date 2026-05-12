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
maxWidth: 430,
margin: "0 auto",
background:
"radial-gradient(circle at 50% -10%, rgba(168,85,247,0.45), transparent 28%), linear-gradient(180deg,#12051f 0%,#07030d 45%,#020202 100%)",
color: "white",
fontFamily: "Arial, sans-serif",
padding: "22px 16px 120px",
boxSizing: "border-box",
overflowX: "hidden",
};

const topBar: CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
gap: 10,
marginBottom: 18,
};
const logo: CSSProperties = {
margin: 0,
fontSize: 28,
fontWeight: 950,
letterSpacing: -1.5,
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
padding: "8px 12px",
borderRadius: 18,
background: "rgba(255,255,255,0.06)",
border: "1px solid rgba(255,255,255,0.08)",
backdropFilter: "blur(14px)",
};

const coin: CSSProperties = {
width: 32,
height: 32,
borderRadius: 999,
display: "grid",
placeItems: "center",
background: "linear-gradient(135deg,#c084fc,#7c3aed)",
boxShadow: "0 0 18px rgba(168,85,247,0.45)",
fontWeight: 950,
};

const small: CSSProperties = {
fontSize: 12,
opacity: 0.64,
};

const upgrade: CSSProperties = {
border: "none",
borderRadius: 18,
padding: "12px 16px",
color: "white",
fontWeight: 900,
fontSize: 13,
background: "linear-gradient(135deg,#a855f7,#7c3aed)",
boxShadow: "0 8px 24px rgba(124,58,237,0.35)",
};

const glassCard: CSSProperties = {
marginTop: 16,
padding: 18,
borderRadius: 28,
background:
"linear-gradient(145deg,rgba(21,13,39,0.92),rgba(7,5,16,0.98))",
border: "1px solid rgba(168,85,247,0.18)",
boxShadow:
"0 18px 45px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.05)",
};

const aiHero: CSSProperties = {
position: "relative",
overflow: "hidden",
borderRadius: 28,
padding: "18px 18px 10px",
minHeight: 470,
marginTop: 10,
background:
"radial-gradient(circle at top right,#9333ea 0%,#3b0764 45%,#050816 100%)",
border: "1px solid rgba(168,85,247,0.25)",
boxShadow: "0 0 40px rgba(147,51,234,0.32)",
};
const aiGlow: CSSProperties = {
position: "absolute",
width: 260,
height: 260,
right: -100,
top: 40,
borderRadius: "50%",
background: "radial-gradient(circle, rgba(192,132,252,0.35), transparent 70%)",
filter: "blur(20px)",
};

const aiPill: CSSProperties = {
position: "relative",
zIndex: 2,
display: "inline-flex",
alignItems: "center",
gap: 8,
padding: "8px 12px",
borderRadius: 999,
background: "rgba(255,255,255,0.1)",
color: "#86efac",
fontSize: 12,
fontWeight: 950,
};

const greenDot: CSSProperties = {
width: 8,
height: 8,
borderRadius: "50%",
background: "#4ade80",
boxShadow: "0 0 14px rgba(74,222,128,0.95)",
};

const aiTitle: CSSProperties = {
position: "relative",
zIndex: 2,
margin: "20px 0 0",
fontSize: 34,
lineHeight: 0.95,
letterSpacing: -1.5,
fontWeight: 950,
maxWidth: 260,
};

const aiText: CSSProperties = {
position: "relative",
zIndex: 2,
maxWidth: 300,
marginTop: 14,
color: "rgba(255,255,255,0.78)",
fontSize: 15,
lineHeight: 1.45,
};
const aiFeatureGrid: CSSProperties = {
position: "relative",
zIndex: 2,
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: 8,
marginTop: 14,
};

const aiFeature: CSSProperties = {
padding: "10px 10px",
borderRadius: 14,
background: "rgba(8,13,35,0.82)",
border: "1px solid rgba(168,85,247,0.18)",
fontSize: 12,
fontWeight: 900,
};

const aiLeadCard: CSSProperties = {
position: "relative",
zIndex: 2,
marginTop: 8,
padding: 10,
borderRadius: 18,
background: "rgba(7,10,28,0.9)",
border: "1px solid rgba(168,85,247,0.22)",
};

const aiLeadTop: CSSProperties = {
display: "flex",
justifyContent: "space-between",
color: "#86efac",
fontSize: 13,
fontWeight: 900,
};

const aiLeadInner: CSSProperties = {
marginTop: 10,
padding: 14,
borderRadius: 16,
background: "rgba(0,0,0,0.26)",
};

const aiCta: CSSProperties = {
position: "relative",
zIndex: 2,
width: "100%",
marginTop: 14,
padding: "13px",
borderRadius: 18,
border: "none",
background: "linear-gradient(90deg,#22c55e,#86efac)",
color: "#04130a",
fontSize: 16,
fontWeight: 950,
};

const heroCard: CSSProperties = {
...glassCard,
};

const heroTitle: CSSProperties = {
margin: 0,
fontSize: 26,
lineHeight: 1.13,
fontWeight: 950,
letterSpacing: -0.8,
};

const heroSub: CSSProperties = {
opacity: 0.68,
fontSize: 16,
};

const promptBox: CSSProperties = {
marginTop: 18,
padding: 15,
borderRadius: 22,
border: "1px solid rgba(168,85,247,0.24)",
background:
"linear-gradient(145deg,rgba(12,8,25,0.96),rgba(5,5,12,0.98))",
boxShadow: "inset 0 0 22px rgba(168,85,247,0.07)",
};

const promptInput: CSSProperties = {
width: "100%",
height: 100,
background: "transparent",
border: "none",
outline: "none",
color: "white",
fontSize: 18,
resize: "none",
lineHeight: 1.4,
};

const toolRow: CSSProperties = {
display: "flex",
gap: 7,
alignItems: "center",
};

const chip: CSSProperties = {
border: "none",
borderRadius: 999,
padding: "10px 10px",
color: "white",
background: "rgba(255,255,255,0.09)",
fontWeight: 900,
fontSize: 11,
};

const arrowBtn: CSSProperties = {
marginLeft: "auto",
width: 50,
height: 50,
borderRadius: 999,
border: "none",
background: "linear-gradient(135deg,#a855f7,#7c3aed)",
color: "white",
fontSize: 28,
fontWeight: 950,
boxShadow: "0 0 20px rgba(168,85,247,0.42)",
};

const uploadBubble: CSSProperties = {
width: 48,
height: 48,
borderRadius: 999,
display: "grid",
placeItems: "center",
border: "1px solid rgba(255,255,255,0.14)",
background: "rgba(255,255,255,0.08)",
cursor: "pointer",
};

const generatedCard: CSSProperties = {
marginTop: 14,
padding: 18,
borderRadius: 26,
background:
"linear-gradient(145deg, rgba(12,10,26,0.98), rgba(5,5,14,0.98))",
border: "1px solid rgba(168,85,247,0.18)",
boxShadow: "0 0 24px rgba(124,58,237,0.12)",
};

const sectionTop: CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
};

const smallDarkBtn: CSSProperties = {
border: "none",
borderRadius: 999,
padding: "10px 13px",
color: "white",
background: "rgba(255,255,255,0.08)",
fontWeight: 900,
};

const adPreview: CSSProperties = {
marginTop: 16,
display: "grid",
gridTemplateColumns: "1fr 145px",
gap: 12,
alignItems: "center",
};

const adHeading: CSSProperties = {
margin: 0,
fontSize: 22,
lineHeight: 1.12,
fontWeight: 950,
};

const adText: CSSProperties = {
opacity: 0.7,
lineHeight: 1.42,
};

const useBtn: CSSProperties = {
border: "none",
borderRadius: 16,
padding: "13px 16px",
background: "linear-gradient(135deg,#9333ea,#7c3aed)",
color: "white",
fontWeight: 950,
boxShadow: "0 0 18px rgba(147,51,234,0.34)",
};

const poster: CSSProperties = {
height: 171,
borderRadius: 20,
overflow: "hidden",
position: "relative",
background: "#111",
boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
};

const posterImg: CSSProperties = {
width: "100%",
height: "100%",
objectFit: "cover",
};

const posterShade: CSSProperties = {
position: "absolute",
inset: 0,
background: "linear-gradient(180deg,transparent,rgba(0,0,0,0.72))",
};

const posterWords: CSSProperties = {
position: "absolute",
left: 10,
bottom: 38,
fontWeight: 950,
fontSize: 22,
lineHeight: 0.95,
};

const posterBadge: CSSProperties = {
position: "absolute",
left: 10,
bottom: 12,
background: "#7c3aed",
padding: "5px 7px",
fontSize: 10,
fontWeight: 950,
};

const trendingCard: CSSProperties = {
...glassCard,
padding: 14,
};

const sectionTitle: CSSProperties = {
margin: 0,
fontSize: 21,
fontWeight: 950,
};

const seeAll: CSSProperties = {
border: "none",
background: "transparent",
color: "#c084fc",
fontWeight: 950,
};

const trendRow: CSSProperties = {
marginTop: 14,
display: "flex",
gap: 10,
overflowX: "auto",
paddingBottom: 2,
};

const trendCard: CSSProperties = {
minWidth: 135,
height: 210,
borderRadius: 17,
overflow: "hidden",
position: "relative",
background: "#111",
border: "1px solid rgba(255,255,255,0.08)",
};

const trendImg: CSSProperties = {
width: "100%",
height: "100%",
objectFit: "cover",
};

const trendShade: CSSProperties = {
position: "absolute",
inset: 0,
background: "linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.78))",
};

const trendBadge: CSSProperties = {
position: "absolute",
top: 8,
left: 8,
background: "#7c3aed",
padding: "4px 7px",
borderRadius: 999,
fontSize: 10,
fontWeight: 900,
};

const trendTitle: CSSProperties = {
position: "absolute",
left: 10,
top: 42,
right: 8,
fontSize: 18,
lineHeight: 1.05,
};

const playBtn: CSSProperties = {
position: "absolute",
right: 9,
bottom: 38,
width: 34,
height: 34,
borderRadius: 999,
border: "none",
};

const trendStats: CSSProperties = {
position: "absolute",
left: 9,
right: 9,
bottom: 10,
fontSize: 12,
opacity: 0.9,
};

const actionsCard: CSSProperties = {
...glassCard,
padding: 14,
};

const actionGrid: CSSProperties = {
marginTop: 14,
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: 10,
};

const actionCardBase: CSSProperties = {
height: 165,
borderRadius: 24,
overflow: "hidden",
position: "relative",
border: "1px solid rgba(255,255,255,0.08)",
padding: 0,
background: "rgba(10,10,18,0.96)",
color: "white",
textAlign: "left",
cursor: "pointer",
boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
};
const actionBg: CSSProperties = {
position: "absolute",
inset: 0,
width: "100%",
height: "100%",
objectFit: "cover",
};

const actionOverlay: CSSProperties = {
position: "absolute",
inset: 0,
background:
"linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.82))",
};
const actionContent: CSSProperties = {
position: "absolute",
inset: 14,
display: "flex",
flexDirection: "column",
justifyContent: "flex-end",
gap: 5,
};

const actionIcon: CSSProperties = {
width: 54,
height: 54,
borderRadius: 18,
background: "linear-gradient(135deg,#a855f7,#7c3aed)",
display: "grid",
placeItems: "center",
marginBottom: 10,
fontSize: 24,
boxShadow: "0 0 24px rgba(168,85,247,0.45)",
};

const chatBox: CSSProperties = {
...glassCard,
padding: 16,
};

const chatTitle: CSSProperties = {
margin: 0,
color: "#c084fc",
fontSize: 22,
fontWeight: 950,
};

const chatSub: CSSProperties = {
opacity: 0.65,
lineHeight: 1.35,
};

const messages: CSSProperties = {
display: "flex",
flexDirection: "column",
gap: 10,
maxHeight: 160,
overflowY: "auto",
};

const bubble: CSSProperties = {
padding: 12,
borderRadius: 16,
maxWidth: "88%",
whiteSpace: "pre-wrap",
};

const typing: CSSProperties = {
opacity: 0.6,
};

const chatInputStyle: CSSProperties = {
width: "100%",
marginTop: 12,
padding: 14,
borderRadius: 16,
border: "none",
outline: "none",
boxSizing: "border-box",
};

const sendBtn: CSSProperties = {
width: "100%",
marginTop: 10,
padding: 14,
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
height: 88,
maxWidth: 430,
margin: "0 auto",
background: "rgba(5,5,7,0.96)",
borderTop: "1px solid rgba(168,85,247,0.14)",
display: "flex",
justifyContent: "space-around",
alignItems: "center",
zIndex: 50,
backdropFilter: "blur(16px)",
};

const navBtn: CSSProperties = {
border: "none",
background: "transparent",
color: "rgba(255,255,255,0.58)",
fontWeight: 900,
};

const navActive: CSSProperties = {
border: "none",
background: "transparent",
color: "#a855f7",
fontWeight: 950,
};

const plusBtn: CSSProperties = {
width: 64,
height: 64,
borderRadius: 999,
border: "none",
background: "linear-gradient(135deg,#a855f7,#7c3aed)",
color: "white",
fontSize: 38,
fontWeight: 950,
boxShadow: "0 0 30px rgba(168,85,247,0.45)",
};
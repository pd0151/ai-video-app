"use client";

import { CSSProperties, useState } from "react";
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
const [image, setImage] = useState<string | null>(null);
const [loadingImage, setLoadingImage] = useState(false);

const [chatInput, setChatInput] = useState("");
const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
const [chatLoading, setChatLoading] = useState(false);
async function upgradeUser() {
const res = await fetch("/api/create-checkout", {
method: "POST",
});

const data = await res.json();

if (data.url) {
window.location.href = data.url;
} else {
alert("Checkout failed");
}
}
async function generateAd() {
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
body: JSON.stringify({ prompt }),
});

const data = await res.json();

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
<div style={credits}>
<span style={coin}>S</span>
<div>
<b>2,450</b>
<div style={small}>Credits</div>
</div>
</div>

<button onClick={upgradeUser} style={upgrade}>♛ Upgrade</button>
</div>
</header>

<section style={heroCard}>
<h2 style={heroTitle}>Create winning ads with AI ⚡</h2>
<p style={heroSub}>Describe your product or business</p>

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
<button style={smallDarkBtn} onClick={generateAd}>⟳ Regenerate</button>
</div>

<div style={adPreview}>
<div>
<h2 style={adHeading}>
Premium Tyre Fitting <br />
at <span style={{ color: "#8b5cf6" }}>Your Doorstep</span>
</h2>

<p style={adText}>
Fast. Reliable. Professional.
<br />
We come to you, so you can stay on the move.
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
src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80"
alt="Preview"
style={posterImg}
/>
<div style={posterShade} />
<div style={posterWords}>WE COME<br />TO YOU</div>
<div style={posterBadge}>FAST & RELIABLE</div>
</>
)}
</div>
</div>
</section>

<section style={trendingCard}>
<div style={sectionTop}>
<h3 style={sectionTitle}>Trending Ads 🔥</h3>
<button style={seeAll} onClick={() => router.push("/feed")}>See all ›</button>
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

<section style={receptionistCard} onClick={() => router.push("/ai-receptionist")}>
<div style={phoneGlow}>☎</div>
<div style={{ flex: 1 }}>
<div style={receptionistTitle}>
AI Receptionist <span style={newBadge}>New</span>
</div>
<p style={receptionistText}>
Never miss a call again. AI answers, books jobs and captures leads 24/7.
</p>
<span style={activeDot}>● Active</span>
</div>
<span style={arrowRight}>›</span>
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
<button style={navActive} onClick={() => router.push("/")}>⌂<br />Home</button>
<button style={navBtn} onClick={() => router.push("/feed")}>▦<br />Feed</button>
<button style={plusBtn} onClick={generateAd}>＋</button>
<button style={navBtn} onClick={() => router.push("/video")}>✧<br />Create</button>
<button style={navBtn} onClick={() => router.push("/profile")}>♙<br />Profile</button>
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
<div style={trendStats}>♡ {likes} &nbsp;&nbsp; ◉ {views}</div>
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
background: "radial-gradient(circle at top,#141027 0%,#050507 48%,#020202 100%)",
color: "white",
fontFamily: "Arial, sans-serif",
padding: "24px 16px 120px",
};

const topBar: CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: 22,
};

const logo: CSSProperties = { margin: 0, fontSize: 34, fontWeight: 950 };

const topRight: CSSProperties = { display: "flex", gap: 10, alignItems: "center" };

const credits: CSSProperties = {
display: "flex",
alignItems: "center",
gap: 9,
padding: "10px 13px",
borderRadius: 18,
background: "rgba(255,255,255,0.07)",
border: "1px solid rgba(255,255,255,0.12)",
};

const coin: CSSProperties = {
width: 32,
height: 32,
borderRadius: 999,
display: "grid",
placeItems: "center",
background: "linear-gradient(135deg,#a855f7,#6d28d9)",
fontWeight: 950,
};

const small: CSSProperties = { fontSize: 12, opacity: 0.65 };

const upgrade: CSSProperties = {
border: "none",
borderRadius: 20,
padding: "17px 20px",
color: "white",
fontWeight: 950,
background: "linear-gradient(135deg,#a855f7,#7c3aed)",
};

const heroCard: CSSProperties = {
padding: 18,
borderRadius: 24,
background: "rgba(255,255,255,0.045)",
border: "1px solid rgba(255,255,255,0.1)",
};

const heroTitle: CSSProperties = { margin: 0, fontSize: 25, fontWeight: 950 };
const heroSub: CSSProperties = { opacity: 0.65, fontSize: 16 };

const promptBox: CSSProperties = {
marginTop: 18,
padding: 15,
borderRadius: 22,
border: "2px solid #8b5cf6",
background: "linear-gradient(135deg,rgba(139,92,246,0.12),rgba(0,0,0,0.45))",
};

const promptInput: CSSProperties = {
width: "100%",
height: 92,
background: "transparent",
border: "none",
outline: "none",
color: "white",
fontSize: 18,
resize: "none",
};

const toolRow: CSSProperties = { display: "flex", gap: 8, alignItems: "center" };

const chip: CSSProperties = {
border: "none",
borderRadius: 999,
padding: "11px 12px",
color: "white",
background: "rgba(255,255,255,0.1)",
fontWeight: 900,
fontSize: 12,
};

const arrowBtn: CSSProperties = {
marginLeft: "auto",
width: 56,
height: 56,
borderRadius: 999,
border: "none",
background: "linear-gradient(135deg,#a855f7,#7c3aed)",
color: "white",
fontSize: 32,
fontWeight: 950,
};

const uploadBubble: CSSProperties = {
width: 52,
height: 52,
borderRadius: 999,
display: "grid",
placeItems: "center",
border: "1px solid rgba(255,255,255,0.18)",
background: "rgba(255,255,255,0.08)",
cursor: "pointer",
};

const generatedCard: CSSProperties = {
marginTop: 18,
padding: 16,
borderRadius: 24,
background: "rgba(255,255,255,0.045)",
border: "1px solid rgba(255,255,255,0.1)",
};

const sectionTop: CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
};

const smallDarkBtn: CSSProperties = {
border: "none",
borderRadius: 999,
padding: "10px 14px",
color: "white",
background: "rgba(255,255,255,0.08)",
fontWeight: 900,
};

const adPreview: CSSProperties = {
marginTop: 18,
display: "grid",
gridTemplateColumns: "1fr 165px",
gap: 14,
alignItems: "center",
};

const adHeading: CSSProperties = { margin: 0, fontSize: 23, lineHeight: 1.15, fontWeight: 950 };
const adText: CSSProperties = { opacity: 0.72, lineHeight: 1.45 };

const useBtn: CSSProperties = {
border: "none",
borderRadius: 16,
padding: "14px 18px",
background: "linear-gradient(135deg,#9333ea,#7c3aed)",
color: "white",
fontWeight: 950,
};

const poster: CSSProperties = {
height: 190,
borderRadius: 18,
overflow: "hidden",
position: "relative",
background: "#111",
};

const posterImg: CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
const posterShade: CSSProperties = { position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent,rgba(0,0,0,0.7))" };
const posterWords: CSSProperties = { position: "absolute", left: 10, bottom: 40, fontWeight: 950, fontSize: 24, lineHeight: 0.95 };
const posterBadge: CSSProperties = { position: "absolute", left: 10, bottom: 12, background: "#7c3aed", padding: "5px 7px", fontSize: 10, fontWeight: 950 };

const trendingCard: CSSProperties = {
marginTop: 18,
padding: 14,
borderRadius: 22,
background: "rgba(255,255,255,0.035)",
border: "1px solid rgba(255,255,255,0.09)",
};

const sectionTitle: CSSProperties = { margin: 0, fontSize: 20, fontWeight: 950 };
const seeAll: CSSProperties = { border: "none", background: "transparent", color: "#a855f7", fontWeight: 950 };

const trendRow: CSSProperties = { marginTop: 14, display: "flex", gap: 10, overflowX: "auto" };
const trendCard: CSSProperties = { minWidth: 135, height: 210, borderRadius: 16, overflow: "hidden", position: "relative", background: "#111" };
const trendImg: CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
const trendShade: CSSProperties = { position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0.15),rgba(0,0,0,0.75))" };
const trendBadge: CSSProperties = { position: "absolute", top: 8, left: 8, background: "#7c3aed", padding: "4px 7px", borderRadius: 999, fontSize: 10, fontWeight: 900 };
const trendTitle: CSSProperties = { position: "absolute", left: 10, top: 42, right: 8, fontSize: 18, lineHeight: 1.05 };
const playBtn: CSSProperties = { position: "absolute", right: 9, bottom: 38, width: 34, height: 34, borderRadius: 999, border: "none" };
const trendStats: CSSProperties = { position: "absolute", left: 9, right: 9, bottom: 10, fontSize: 12, opacity: 0.9 };

const actionsCard: CSSProperties = {
marginTop: 18,
padding: 14,
borderRadius: 22,
background: "rgba(255,255,255,0.035)",
border: "1px solid rgba(255,255,255,0.09)",
};

const actionGrid: CSSProperties = {
marginTop: 14,
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: 10,
};

const actionCardBase: CSSProperties = {
height: 145,
borderRadius: 18,
overflow: "hidden",
position: "relative",
border: "1px solid rgba(255,255,255,0.1)",
padding: 0,
background: "#111",
color: "white",
textAlign: "left",
cursor: "pointer",
};

const actionBg: CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" };
const actionOverlay: CSSProperties = { position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0.25),rgba(0,0,0,0.82))" };
const actionContent: CSSProperties = { position: "absolute", inset: 14, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 5 };
const actionIcon: CSSProperties = { width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg,#a855f7,#6d28d9)", display: "grid", placeItems: "center", marginBottom: 8 };

const receptionistCard: CSSProperties = {
marginTop: 18,
padding: 16,
borderRadius: 22,
display: "flex",
gap: 14,
alignItems: "center",
background: "linear-gradient(135deg,rgba(139,92,246,0.2),rgba(0,0,0,0.45))",
border: "1px solid #8b5cf6",
cursor: "pointer",
};

const phoneGlow: CSSProperties = { width: 60, height: 60, borderRadius: 999, background: "linear-gradient(135deg,#a855f7,#7c3aed)", display: "grid", placeItems: "center", fontSize: 28 };
const receptionistTitle: CSSProperties = { fontSize: 20, fontWeight: 950 };
const newBadge: CSSProperties = { marginLeft: 8, background: "#a855f7", borderRadius: 999, padding: "4px 8px", fontSize: 11 };
const receptionistText: CSSProperties = { opacity: 0.75, lineHeight: 1.35 };
const activeDot: CSSProperties = { color: "#22c55e", fontWeight: 900 };
const arrowRight: CSSProperties = { fontSize: 38, color: "#a855f7" };

const chatBox: CSSProperties = {
marginTop: 18,
padding: 16,
borderRadius: 22,
background: "rgba(255,255,255,0.045)",
border: "1px solid rgba(255,255,255,0.1)",
};

const chatTitle: CSSProperties = { margin: 0, color: "#b36bff", fontSize: 22, fontWeight: 950 };
const chatSub: CSSProperties = { opacity: 0.65, lineHeight: 1.35 };
const messages: CSSProperties = { display: "flex", flexDirection: "column", gap: 10, maxHeight: 160, overflowY: "auto" };
const bubble: CSSProperties = { padding: 12, borderRadius: 16, maxWidth: "88%", whiteSpace: "pre-wrap" };
const typing: CSSProperties = { opacity: 0.6 };

const chatInputStyle: CSSProperties = {
width: "100%",
marginTop: 12,
padding: 14,
borderRadius: 16,
border: "none",
outline: "none",
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
background: "rgba(5,5,7,0.96)",
borderTop: "1px solid rgba(255,255,255,0.08)",
display: "flex",
justifyContent: "space-around",
alignItems: "center",
zIndex: 50,
};

const navBtn: CSSProperties = { border: "none", background: "transparent", color: "rgba(255,255,255,0.58)", fontWeight: 900 };
const navActive: CSSProperties = { border: "none", background: "transparent", color: "#a855f7", fontWeight: 950 };
const plusBtn: CSSProperties = { width: 64, height: 64, borderRadius: 999, border: "none", background: "linear-gradient(135deg,#a855f7,#7c3aed)", color: "white", fontSize: 38, fontWeight: 950 };
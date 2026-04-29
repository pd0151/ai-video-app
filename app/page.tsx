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

const imageUrl =
data.image || data.url || data.image_url || data.output?.[0];

if (!imageUrl) {
alert(data.error || "No image returned");
return;
}

setImage(imageUrl);
} catch {
alert("Image failed");
} finally {
setLoadingImage(false);
}
}

async function sendChatMessage() {
if (!chatInput.trim()) return;

const newMessages: ChatMessage[] = [
...chatMessages,
{ role: "user", content: chatInput.trim() },
];

setChatMessages(newMessages);
setChatInput("");
setChatLoading(true);

try {
const res = await fetch("/api/chat", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ messages: newMessages }),
});

const data = await res.json();

setChatMessages([
...newMessages,
{
role: "assistant",
content: data.reply || data.error || "No reply",
},
]);
} catch {
setChatMessages([
...newMessages,
{ role: "assistant", content: "Chat failed. Try again." },
]);
} finally {
setChatLoading(false);
}
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
});

if (error) {
alert(error.message);
return;
}

alert("Posted to feed 🚀");
router.push("/feed");
}

return (
<main style={page}>
<header style={header}>
<h1 style={logo}>
Ad<span style={{ color: "#a855f7" }}>Forge</span> ✨
</h1>

<div style={headerRight}>
<div style={creditsPill}>
<span style={coin}>S</span>
<div>
<b>2,450</b>
<div style={creditSmall}>Credits</div>
</div>
</div>

<button style={upgradeBtn}>♕ Upgrade</button>
</div>
</header>

<section style={mainCard}>
<h2 style={mainTitle}>Create winning ads with AI ⚡</h2>
<p style={mainSub}>Describe your product or business</p>

<div style={promptBox}>
<textarea
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="What do you want to advertise?"
style={promptInput}
/>

<div style={promptBottom}>
<button
style={chip}
onClick={() => setPrompt("Mobile tyre fitting Liverpool 24/7")}
>
☷ Examples
</button>
<button
style={chip}
onClick={() => setPrompt(`${prompt} make this better`)}
>
✧ Improve
</button>
<button
style={chip}
onClick={() => setPrompt(`${prompt} make this shorter`)}
>
✂ Shorten
</button>

<button onClick={generateAd} style={arrowBtn}>
{loadingImage ? "…" : "↑"}
</button>
</div>
</div>

<div style={chatBox}>
<div style={chatTitle}>💬 ChatGPT Ad Assistant</div>
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
: "rgba(255,255,255,0.1)",
}}
>
{msg.content}
</div>
))}
{chatLoading && <div style={emptyChat}>AI is typing...</div>}
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

<button onClick={sendChatMessage} style={chatSend}>
💬 Send Chat
</button>
</div>

<section style={generatedCard}>
<div style={generatedTop}>
<b style={{ color: "#b36bff" }}>Your AI Generated Ad</b>
<button onClick={generateAd} style={regenerateBtn}>
⟳ Regenerate
</button>
</div>

<div style={generatedBody}>
<div>
<h2 style={adHeading}>
Premium Tyre Fitting <br />
at <span style={{ color: "#8b5cf6" }}>Your Doorstep</span>
</h2>

<p style={adText}>
Fast. Reliable. Professional.
<br />
We come to you, so you can
<br />
stay on the move.
</p>

<div style={{ display: "flex", gap: 10 }}>
<button onClick={useThisAd} style={useAdBtn}>
◎ Use This Ad
</button>
<button style={copyBtn}>⧉</button>
</div>
</div>

<div style={poster}>
{image ? (
<img src={image} alt="Generated ad" style={posterImg} />
) : (
<>
<img
src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=700&q=80"
alt="Tyre ad"
style={posterImg}
/>
<div style={posterOverlay} />
<div style={posterText}>
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
</section>

<section style={trendingSection}>
<div style={sectionHeader}>
<h2 style={{ margin: 0 }}>Trending Ads 🔥</h2>
<button onClick={() => router.push("/feed")} style={seeAll}>
See all ›
</button>
</div>

<div style={trendRow}>
<Trend
badge="Popular"
title="COFFEE MADE BETTER"
likes="248"
views="12.5K"
img="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=700&q=80"
/>
<Trend
badge="New"
title="Fresh looks for every occasion."
likes="192"
views="9.8K"
img="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"
/>
<Trend
badge="Hot"
title="Healthy meals, happy life."
likes="315"
views="15.2K"
img="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80"
/>
</div>
</section>

<section style={quickActions}>
<Quick icon="▧" label="Generate Image" onClick={generateAd} />
<Quick icon="▣" label="Generate Video" onClick={() => router.push("/video")} />
<Quick icon="▤" label="My Ads" onClick={() => router.push("/feed")} />
<Quick icon="◌" label="Requests" onClick={() => router.push("/requests")} />
</section>

<nav style={nav}>
<button onClick={() => router.push("/")} style={navActive}>
⌂<br />Home
</button>
<button onClick={() => router.push("/feed")} style={navBtn}>
▦<br />Feed
</button>
<button onClick={generateAd} style={plusBtn}>
＋
</button>
<button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={navBtn}>
✧<br />Create
</button>
<button onClick={() => router.push("/profile")} style={navBtn}>
♙<br />Profile
</button>
</nav>
</main>
);
}

function Quick({
icon,
label,
onClick,
}: {
icon: string;
label: string;
onClick: () => void;
}) {
return (
<button onClick={onClick} style={quickBtn}>
<div style={quickIcon}>{icon}</div>
<span>{label}</span>
</button>
);
}

function Trend({
badge,
title,
likes,
views,
img,
}: {
badge: string;
title: string;
likes: string;
views: string;
img: string;
}) {
return (
<div style={trendCard}>
<img src={img} alt={title} style={trendImg} />
<div style={trendOverlay} />
<div style={badgeStyle}>{badge}</div>
<div style={trendTitle}>{title}</div>
<button style={playBtn}>▶</button>
<div style={trendStats}>♡ {likes} &nbsp;&nbsp; ◉ {views}</div>
</div>
);
}

const page: CSSProperties = {
minHeight: "100vh",
background: "#050507",
color: "white",
fontFamily: "Inter, Arial, sans-serif",
padding: "28px 18px 120px",
};

const header: CSSProperties = {
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

const headerRight: CSSProperties = {
display: "flex",
alignItems: "center",
gap: 10,
};

const creditsPill: CSSProperties = {
display: "flex",
alignItems: "center",
gap: 9,
padding: "10px 14px",
borderRadius: 18,
background: "rgba(255,255,255,0.07)",
border: "1px solid rgba(255,255,255,0.1)",
};

const coin: CSSProperties = {
width: 32,
height: 32,
borderRadius: 999,
display: "grid",
placeItems: "center",
background: "linear-gradient(135deg,#a855f7,#7c3aed)",
fontWeight: 900,
};

const creditSmall: CSSProperties = { fontSize: 12, opacity: 0.65 };

const upgradeBtn: CSSProperties = {
border: "none",
borderRadius: 18,
padding: "16px 20px",
background: "linear-gradient(135deg,#a855f7,#7c3aed)",
color: "white",
fontWeight: 900,
fontSize: 16,
};

const mainCard: CSSProperties = {
padding: 18,
borderRadius: 24,
background: "rgba(255,255,255,0.035)",
border: "1px solid rgba(255,255,255,0.1)",
boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
};

const mainTitle: CSSProperties = { margin: 0, fontSize: 25, fontWeight: 950 };
const mainSub: CSSProperties = { marginTop: 8, opacity: 0.65, fontSize: 16 };

const promptBox: CSSProperties = {
marginTop: 18,
padding: 16,
minHeight: 135,
borderRadius: 22,
border: "2px solid #8b5cf6",
background: "linear-gradient(135deg,rgba(139,92,246,0.12),rgba(0,0,0,0.35))",
boxShadow: "0 0 24px rgba(139,92,246,0.3)",
};

const promptInput: CSSProperties = {
width: "100%",
height: 68,
resize: "none",
border: "none",
outline: "none",
background: "transparent",
color: "white",
fontSize: 17,
};

const promptBottom: CSSProperties = { display: "flex", alignItems: "center", gap: 8 };

const chip: CSSProperties = {
border: "none",
borderRadius: 999,
padding: "10px 13px",
background: "rgba(255,255,255,0.09)",
color: "white",
fontWeight: 800,
};

const arrowBtn: CSSProperties = {
marginLeft: "auto",
width: 58,
height: 58,
borderRadius: 999,
border: "none",
background: "linear-gradient(135deg,#a855f7,#7c3aed)",
color: "white",
fontSize: 30,
fontWeight: 900,
};

const chatBox: CSSProperties = {
marginTop: 18,
padding: 14,
borderRadius: 20,
background: "rgba(255,255,255,0.04)",
border: "1px solid rgba(255,255,255,0.08)",
};

const chatTitle: CSSProperties = { fontWeight: 900, marginBottom: 6, color: "#b36bff" };
const chatSub: CSSProperties = { opacity: 0.65, marginTop: 0 };

const messages: CSSProperties = {
maxHeight: 190,
overflowY: "auto",
display: "flex",
flexDirection: "column",
gap: 10,
};

const emptyChat: CSSProperties = { opacity: 0.65, fontSize: 14 };

const bubble: CSSProperties = {
padding: 12,
borderRadius: 16,
maxWidth: "88%",
whiteSpace: "pre-wrap",
lineHeight: 1.35,
};

const chatInputStyle: CSSProperties = {
width: "100%",
marginTop: 12,
padding: 13,
borderRadius: 14,
border: "none",
outline: "none",
};

const chatSend: CSSProperties = {
width: "100%",
marginTop: 10,
padding: 13,
borderRadius: 14,
border: "none",
background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
color: "white",
fontWeight: 900,
};

const generatedCard: CSSProperties = {
marginTop: 20,
padding: 14,
borderRadius: 22,
background: "rgba(255,255,255,0.045)",
border: "1px solid rgba(255,255,255,0.09)",
};

const generatedTop: CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: 14,
};

const regenerateBtn: CSSProperties = {
border: "none",
borderRadius: 999,
padding: "10px 13px",
background: "rgba(255,255,255,0.08)",
color: "white",
fontWeight: 800,
};

const generatedBody: CSSProperties = {
display: "grid",
gridTemplateColumns: "1fr 170px",
gap: 14,
alignItems: "center",
};

const adHeading: CSSProperties = {
margin: 0,
fontSize: 22,
lineHeight: 1.15,
fontWeight: 950,
};

const adText: CSSProperties = { opacity: 0.72, lineHeight: 1.45, fontSize: 14 };

const useAdBtn: CSSProperties = {
border: "none",
borderRadius: 14,
padding: "13px 16px",
background: "linear-gradient(135deg,#9333ea,#7c3aed)",
color: "white",
fontWeight: 900,
};

const copyBtn: CSSProperties = {
width: 46,
height: 46,
borderRadius: 14,
border: "1px solid rgba(255,255,255,0.1)",
background: "rgba(255,255,255,0.06)",
color: "white",
fontSize: 22,
};

const poster: CSSProperties = {
height: 190,
borderRadius: 16,
overflow: "hidden",
position: "relative",
background: "#111",
};

const posterImg: CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };

const posterOverlay: CSSProperties = {
position: "absolute",
inset: 0,
background: "linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.65))",
};

const posterText: CSSProperties = {
position: "absolute",
left: 12,
bottom: 42,
fontSize: 26,
lineHeight: 0.95,
fontWeight: 950,
};

const posterBadge: CSSProperties = {
position: "absolute",
left: 12,
bottom: 14,
padding: "5px 8px",
background: "#7c3aed",
fontSize: 11,
fontWeight: 900,
};

const trendingSection: CSSProperties = {
marginTop: 18,
padding: 14,
borderRadius: 22,
background: "rgba(255,255,255,0.025)",
border: "1px solid rgba(255,255,255,0.08)",
};

const sectionHeader: CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: 12,
};

const seeAll: CSSProperties = {
border: "none",
background: "transparent",
color: "#b36bff",
fontWeight: 900,
fontSize: 16,
};

const trendRow: CSSProperties = { display: "flex", gap: 12, overflowX: "auto" };

const trendCard: CSSProperties = {
minWidth: 170,
height: 235,
borderRadius: 18,
overflow: "hidden",
position: "relative",
background: "#111",
};

const trendImg: CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };

const trendOverlay: CSSProperties = {
position: "absolute",
inset: 0,
background: "linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.8))",
};

const badgeStyle: CSSProperties = {
position: "absolute",
top: 10,
left: 10,
padding: "5px 9px",
borderRadius: 999,
background: "linear-gradient(135deg,#8b5cf6,#6366f1)",
fontSize: 12,
fontWeight: 900,
};

const trendTitle: CSSProperties = {
position: "absolute",
left: 12,
bottom: 46,
right: 8,
fontSize: 22,
lineHeight: 1,
fontWeight: 950,
};

const playBtn: CSSProperties = {
position: "absolute",
right: 12,
bottom: 34,
width: 42,
height: 42,
borderRadius: 999,
border: "none",
background: "white",
color: "black",
};

const trendStats: CSSProperties = { position: "absolute", left: 12, bottom: 12, fontSize: 13 };

const quickActions: CSSProperties = {
marginTop: 18,
padding: 14,
borderRadius: 22,
background: "rgba(255,255,255,0.035)",
border: "1px solid rgba(255,255,255,0.08)",
display: "grid",
gridTemplateColumns: "repeat(4,1fr)",
gap: 8,
};

const quickBtn: CSSProperties = {
border: "none",
background: "transparent",
color: "white",
fontWeight: 800,
fontSize: 13,
display: "grid",
gap: 8,
placeItems: "center",
};

const quickIcon: CSSProperties = {
width: 54,
height: 54,
borderRadius: 17,
display: "grid",
placeItems: "center",
background: "rgba(255,255,255,0.07)",
color: "#a855f7",
fontSize: 26,
};

const nav: CSSProperties = {
position: "fixed",
left: 0,
right: 0,
bottom: 0,
height: 86,
background: "rgba(5,5,7,0.96)",
borderTop: "1px solid rgba(255,255,255,0.08)",
display: "flex",
justifyContent: "space-around",
alignItems: "center",
zIndex: 50,
};

const navBtn: CSSProperties = {
border: "none",
background: "transparent",
color: "rgba(255,255,255,0.6)",
fontWeight: 800,
};

const navActive: CSSProperties = {
border: "none",
background: "transparent",
color: "#a855f7",
fontWeight: 900,
};

const plusBtn: CSSProperties = {
width: 62,
height: 62,
borderRadius: 999,
border: "none",
background: "linear-gradient(135deg,#a855f7,#7c3aed)",
color: "white",
fontSize: 36,
fontWeight: 900,
};
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

if (business?.name) setBusinessName(business.name);

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
const res = await fetch("/api/create-checkout", { method: "POST" });
const data = await res.json();

if (data.url) window.location.href = data.url;
else alert(data.error || "Checkout failed");
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
await supabase.from("user_credits").upsert(
{
user_id: currentUser.id,
email: currentUser.email,
credits: newCredits,
},
{ onConflict: "user_id" }
);
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
business_name: businessName || "Total Tyres 247",
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
business_name: businessName || "Total Tyres 247",
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
<div style={upgrade}>✅ Pro</div>
) : (
<button onClick={upgradeUser} style={upgrade}>
🚀 Upgrade
</button>
)}
</div>
</header>

<section onClick={() => router.push("/ai-receptionist")} style={aiHero}>
<div style={aiPill}>
<span style={greenDot} />
LIVE AI RECEPTIONIST
</div>

<h2 style={aiTitle}>
Never miss
<br />
<span>another call</span>
</h2>

<p style={aiText}>
AI answers missed calls, captures customer details, sends instant SMS
alerts and updates your live leads dashboard.
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
<h3 style={leadTitle}>Mobile tyre job</h3>
<p style={leadText}>BMW 1 Series • L3 postcode</p>
</div>
</div>

<button style={aiCta}>🔥 Activate AI Receptionist ›</button>
</section>

<section style={card}>
<h2 style={sectionBigTitle}>
Create high-converting ads in seconds with AI 🚀
</h2>
<p style={muted}>Describe your product or business</p>
<p style={muted}>
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
Examples
</button>

<button
style={chip}
onClick={() => setPrompt(`${prompt} make this advert better`)}
>
Improve
</button>

<button
style={chip}
onClick={() => setPrompt(`${prompt} make this shorter`)}
>
Shorten
</button>

<button style={arrowBtn} onClick={generateAd}>
{loadingImage ? "…" : "↑"}
</button>
</div>
</div>
</section>

<section style={card}>
<div style={sectionTop}>
<b style={{ color: "#b36bff" }}>Your AI Generated Ad</b>
<button style={smallDarkBtn} onClick={generateAd}>
⟳ Regenerate
</button>
</div>

<div style={adPreview}>
<div>
<h2 style={adHeading}>
{businessName || "Your Business"}
<br />
<span style={{ color: "#8b5cf6" }}>
{prompt || "AI Generated Ad"}
</span>
</h2>

<p style={muted}>
Professional AI advertising for your business. Generate viral ads
in seconds.
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
src="https://images.unsplash.com/photo-1556745757-8d76bdb6984b"
style={posterImg}
alt=""
/>
<div style={posterOverlay} />
<div style={posterWords}>WE COME<br />TO YOU</div>
</>
)}
</div>
</div>
</section>

<section style={card}>
<h3 style={sectionTitle}>Quick Actions</h3>

<div style={actionGrid}>
<button style={actionBtn} onClick={generateAd}>
🖼️ <span>Generate Image</span>
</button>

<button style={actionBtn} onClick={() => router.push("/video")}>
🎬 <span>Generate Video</span>
</button>

<label style={actionBtn}>
📤 <span>Upload Media</span>
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

<button style={actionBtn} onClick={() => router.push("/feed")}>
📊 <span>My Ads</span>
</button>
</div>
</section>

<section style={card}>
<h3 style={chatTitle}>💬 ChatGPT Ad Assistant</h3>
<p style={muted}>Ask AI to write, improve, shorten or create advert ideas.</p>

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
{chatLoading && <div style={muted}>AI is typing...</div>}
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
<button style={navBtn} onClick={() => router.push("/ai-receptionist")}>◎<br />AI</button>
<button style={navBtn} onClick={() => router.push("/profile")}>♙<br />Profile</button>
</nav>
</main>
);
}

const page: CSSProperties = {
minHeight: "100vh",
width: "100%",
maxWidth: 430,
margin: "0 auto",
background:
"radial-gradient(circle at top,#1b0b34 0%,#070713 46%,#020202 100%)",
color: "white",
fontFamily: "Arial, sans-serif",
padding: "24px 16px 130px",
boxSizing: "border-box",
overflowX: "hidden",
};

const topBar: CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
gap: 8,
marginBottom: 20,
};

const logo: CSSProperties = {
margin: 0,
fontSize: 33,
fontWeight: 950,
letterSpacing: -1,
};

const topRight: CSSProperties = {
display: "flex",
alignItems: "center",
gap: 8,
};

const creditBox: CSSProperties = {
display: "flex",
alignItems: "center",
gap: 8,
padding: "9px 11px",
borderRadius: 18,
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.14)",
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
borderRadius: 18,
padding: "13px 14px",
color: "white",
fontWeight: 950,
background: "linear-gradient(135deg,#a855f7,#7c3aed)",
};

const aiHero: CSSProperties = {
position: "relative",
overflow: "hidden",
cursor: "pointer",
borderRadius: 30,
padding: 22,
background:
"radial-gradient(circle at 80% 18%, rgba(168,85,247,0.42), transparent 36%), linear-gradient(145deg, rgba(58,18,112,0.95), rgba(9,6,25,0.98))",
border: "1px solid rgba(168,85,247,0.72)",
boxShadow: "0 0 42px rgba(126,34,206,0.3)",
};

const aiPill: CSSProperties = {
display: "inline-flex",
alignItems: "center",
gap: 8,
padding: "9px 13px",
borderRadius: 999,
background: "rgba(255,255,255,0.09)",
color: "#86efac",
fontSize: 12,
fontWeight: 950,
};

const greenDot: CSSProperties = {
width: 9,
height: 9,
borderRadius: "50%",
background: "#4ade80",
boxShadow: "0 0 14px rgba(74,222,128,0.9)",
};

const aiTitle: CSSProperties = {
margin: "26px 0 0",
fontSize: 47,
lineHeight: 0.94,
letterSpacing: -2.2,
fontWeight: 950,
};

const aiText: CSSProperties = {
marginTop: 18,
color: "rgba(255,255,255,0.78)",
fontSize: 17,
lineHeight: 1.35,
};

const aiFeatureGrid: CSSProperties = {
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: 10,
marginTop: 22,
};

const aiFeature: CSSProperties = {
padding: "13px 12px",
borderRadius: 16,
background: "rgba(8,13,35,0.78)",
border: "1px solid rgba(255,255,255,0.1)",
fontSize: 14,
fontWeight: 900,
};

const aiLeadCard: CSSProperties = {
marginTop: 18,
padding: 14,
borderRadius: 22,
background: "rgba(7,10,28,0.86)",
border: "1px solid rgba(168,85,247,0.28)",
boxShadow: "0 0 28px rgba(124,58,237,0.24)",
};

const aiLeadTop: CSSProperties = {
display: "flex",
justifyContent: "space-between",
color: "#86efac",
fontSize: 14,
fontWeight: 800,
};

const aiLeadInner: CSSProperties = {
marginTop: 14,
padding: 16,
borderRadius: 18,
background: "rgba(0,0,0,0.28)",
};

const leadTitle: CSSProperties = {
margin: "14px 0 8px",
fontSize: 23,
fontWeight: 950,
};

const leadText: CSSProperties = { margin: 0, opacity: 0.8 };

const aiCta: CSSProperties = {
width: "100%",
marginTop: 18,
padding: "17px 18px",
borderRadius: 18,
border: "none",
background: "linear-gradient(90deg,#22c55e,#86efac)",
color: "#04130a",
fontSize: 17,
fontWeight: 950,
};

const card: CSSProperties = {
marginTop: 18,
padding: 22,
borderRadius: 28,
background:
"linear-gradient(145deg, rgba(18,14,35,0.96), rgba(8,7,20,0.98))",
border: "1px solid rgba(255,255,255,0.1)",
boxShadow: "0 0 26px rgba(124,58,237,0.12)",
};

const sectionBigTitle: CSSProperties = {
margin: 0,
fontSize: 28,
lineHeight: 1.12,
fontWeight: 950,
};

const muted: CSSProperties = {
color: "rgba(255,255,255,0.68)",
lineHeight: 1.4,
};

const promptBox: CSSProperties = {
marginTop: 18,
padding: 16,
borderRadius: 22,
border: "1px solid rgba(168,85,247,0.28)",
background:
"linear-gradient(145deg, rgba(15,12,30,0.96), rgba(7,7,18,0.98))",
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
};

const toolRow: CSSProperties = {
display: "flex",
gap: 7,
alignItems: "center",
};

const chip: CSSProperties = {
border: "none",
borderRadius: 999,
padding: "10px 11px",
color: "white",
background: "rgba(255,255,255,0.1)",
fontWeight: 900,
fontSize: 12,
};

const arrowBtn: CSSProperties = {
marginLeft: "auto",
width: 50,
height: 50,
borderRadius: 999,
border: "none",
background: "linear-gradient(135deg,#a855f7,#7c3aed)",
color: "white",
fontSize: 29,
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
padding: "10px 13px",
color: "white",
background: "rgba(255,255,255,0.08)",
fontWeight: 900,
};

const adPreview: CSSProperties = {
marginTop: 18,
display: "grid",
gridTemplateColumns: "1fr 140px",
gap: 13,
alignItems: "center",
};

const adHeading: CSSProperties = {
margin: 0,
fontSize: 23,
lineHeight: 1.15,
fontWeight: 950,
};

const useBtn: CSSProperties = {
border: "none",
borderRadius: 16,
padding: "13px 17px",
background: "linear-gradient(135deg,#9333ea,#7c3aed)",
color: "white",
fontWeight: 950,
};

const poster: CSSProperties = {
height: 180,
borderRadius: 18,
overflow: "hidden",
position: "relative",
background: "#111",
};

const posterImg: CSSProperties = {
width: "100%",
height: "100%",
objectFit: "cover",
};

const posterOverlay: CSSProperties = {
position: "absolute",
inset: 0,
background: "linear-gradient(180deg,transparent,rgba(0,0,0,0.7))",
};

const posterWords: CSSProperties = {
position: "absolute",
left: 10,
bottom: 18,
fontWeight: 950,
fontSize: 23,
lineHeight: 0.95,
};

const sectionTitle: CSSProperties = {
margin: 0,
fontSize: 22,
fontWeight: 950,
};

const actionGrid: CSSProperties = {
marginTop: 14,
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: 11,
};

const actionBtn: CSSProperties = {
minHeight: 105,
borderRadius: 18,
border: "1px solid rgba(255,255,255,0.1)",
background: "rgba(255,255,255,0.05)",
color: "white",
fontSize: 18,
fontWeight: 900,
display: "flex",
flexDirection: "column",
alignItems: "center",
justifyContent: "center",
gap: 8,
};

const chatTitle: CSSProperties = {
margin: 0,
color: "#b36bff",
fontSize: 23,
fontWeight: 950,
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

const chatInputStyle: CSSProperties = {
width: "100%",
marginTop: 12,
padding: 15,
borderRadius: 16,
border: "none",
outline: "none",
};

const sendBtn: CSSProperties = {
width: "100%",
marginTop: 11,
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
borderTop: "1px solid rgba(255,255,255,0.08)",
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
};
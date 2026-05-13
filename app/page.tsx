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

async function uploadMedia(file: File) {
const isVideo = file.type.startsWith("video");
const fileName = `${Date.now()}-${file.name}`;

const { error } = await supabase.storage
.from("posts")
.upload(fileName, file);

if (error) {
alert(error.message);
return;
}

const {
data: { publicUrl },
} = supabase.storage.from("posts").getPublicUrl(fileName);

const {
data: { user },
} = await supabase.auth.getUser();

await supabase.from("posts").insert({
user_id: user?.id,
content: "Uploaded media",
image_url: isVideo ? null : publicUrl,
video_url: isVideo ? publicUrl : null,
business_name: "Total Tyres 247",
location: "Liverpool",
});

window.location.href = "/feed";
}

async function useThisAd() {
if (!image) return;

const {
data: { user },
} = await supabase.auth.getUser();

await supabase.from("posts").insert({
user_id: user?.id,
content: prompt || "AI generated advert",
image_url: image,
video_url: null,
business_name: businessName || "Total Tyres 247",
location: "Liverpool",
});

window.location.href = "/feed";
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
"Try adding urgency, location and a clear offer to improve conversions.",
},
]);

setChatLoading(false);
}, 1000);
}

return (
<>
<div style={bgGlow1} />
<div style={bgGlow2} />

<main style={page}>
<header style={topBar}>
<div>
<div style={brandLabel}>AI ADVERTISING PLATFORM</div>
<h1 style={logo}>
Ad<span style={{ color: "#a855f7" }}>Forge</span>
</h1>
</div>

<div style={topRight}>
<div style={creditBox}>
<span style={coin}>C</span>
<div>
<b>{isPro ? "∞" : credits}</b>
<div style={small}>Credits</div>
</div>
</div>

{isPro ? (
<div style={proBadge}>PRO</div>
) : (
<button onClick={upgradeUser} style={upgrade}>
Upgrade
</button>
)}
</div>
</header>

<section style={aiHero} onClick={() => router.push("/ai-receptionist")}>
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
Turn missed calls
<br />
into booked jobs
</h2>

<p style={aiText}>
AI answers calls, captures customer details and sends instant job
alerts straight to your dashboard.
</p>

<div style={aiFeatureGrid}>
<div style={aiFeature}>
<b>24/7 Calls</b>
<small>Always available</small>
</div>
<div style={aiFeature}>
<b>Lead Capture</b>
<small>Name, job, location</small>
</div>
<div style={aiFeature}>
<b>SMS Alerts</b>
<small>Instant updates</small>
</div>
<div style={aiFeature}>
<b>Live Dashboard</b>
<small>Track every lead</small>
</div>
</div>

<div style={aiLeadCard}>
<div style={aiLeadTop}>
<span>AI Online</span>
<b>LIVE</b>
</div>

<div style={aiLeadInner}>
<small>NEW LEAD CAPTURED</small>
<h3>Mobile tyre job</h3>
<p>BMW 1 Series • Liverpool • Ready to book</p>
</div>
</div>

<button style={aiCta}>Launch AI Receptionist</button>
</section>

<section style={heroCard}>
<div style={heroPill}>AI CREATIVE STUDIO</div>

<h2 style={heroTitle}>
Create premium adverts
<br />
in seconds
</h2>

<p style={heroSub}>
Describe your business, offer or service. AdForge turns it into a
polished social advert ready for your live feed.
</p>

<div style={promptBox}>
<textarea
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Example: Mobile tyre fitting Liverpool, 24/7 callout, fast response..."
style={promptInput}
/>

<div style={toolRow}>
<button
style={chip}
onClick={() => setPrompt("Mobile tyre fitting Liverpool 24/7")}
>
Use example
</button>

<button
style={chip}
onClick={() => setPrompt(`${prompt} make this advert better`)}
>
Improve prompt
</button>

<label style={uploadBubble}>
Upload
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

<button style={arrowBtn} onClick={generateAd}>
{loadingImage ? "..." : "Create"}
</button>
</div>
</div>
</section>

{image && (
<section style={generatedCard}>
<div style={sectionTop}>
<b style={{ color: "#c084fc" }}>Generated Advert</b>
<button style={smallDarkBtn} onClick={generateAd}>
Regenerate
</button>
</div>

<img src={image} alt="Generated ad" style={generatedImage} />

<button style={useBtn} onClick={useThisAd}>
Post to Feed
</button>
</section>
)}

<section style={actionsCard}>
<div style={sectionTop}>
<h3 style={sectionTitle}>Quick Actions</h3>
<span style={mutedMini}>Built for speed</span>
</div>

<div style={actionGrid}>
<button style={actionCard} onClick={generateAd}>
<span style={actionCode}>01</span>
<b>Generate Viral Ad</b>
<small>Create scroll-stopping content</small>
</button>

<button style={actionCard} onClick={() => router.push("/video")}>
<span style={actionCode}>02</span>
<b>Create AI Video</b>
<small>Turn ideas into short-form video</small>
</button>

<label style={actionCard}>
<span style={actionCode}>03</span>
<b>Upload Media</b>
<small>Add your own photo or video</small>
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
<span style={actionCode}>04</span>
<b>Live Campaign Feed</b>
<small>View your published adverts</small>
</button>
</div>
</section>

<section style={proofGrid}>
<div style={proofCard}>
<b>3 Free Credits</b>
<small>Start creating instantly</small>
</div>
<div style={proofCard}>
<b>AI Ads</b>
<small>Built for social media</small>
</div>
<div style={proofCard}>
<b>Lead System</b>
<small>AI receptionist ready</small>
</div>
</section>

<section style={chatBox}>
<div style={sectionTop}>
<h3 style={chatTitle}>AI Ad Assistant</h3>
<span style={onlinePill}>Online</span>
</div>

<div style={messages}>
{chatMessages.length === 0 && (
<div style={bubble}>
Tell me what you sell and I’ll help sharpen the offer, wording
and advert angle.
</div>
)}

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
placeholder="Ask AI to improve your advert..."
style={chatInputStyle}
onKeyDown={(e) => {
if (e.key === "Enter") sendChatMessage();
}}
/>

<button style={sendBtn} onClick={sendChatMessage}>
Send Message
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
</>
);
}

const page: CSSProperties = {
minHeight: "100vh",
background:
"radial-gradient(circle at top,#24104a 0%,#090312 42%,#020204 100%)",
color: "white",
padding: "18px 16px 140px",
fontFamily: "Inter, sans-serif",
overflowX: "hidden",
position: "relative",
};

const bgGlow1: CSSProperties = {
position: "fixed",
width: 300,
height: 300,
borderRadius: "50%",
background: "rgba(168,85,247,0.22)",
top: -90,
right: -110,
filter: "blur(80px)",
pointerEvents: "none",
zIndex: 0,
};

const bgGlow2: CSSProperties = {
position: "fixed",
width: 260,
height: 260,
borderRadius: "50%",
background: "rgba(0,255,140,0.10)",
bottom: 120,
left: -110,
filter: "blur(90px)",
pointerEvents: "none",
zIndex: 0,
};

const topBar: CSSProperties = {
position: "relative",
zIndex: 2,
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: 18,
};

const brandLabel: CSSProperties = {
fontSize: 10,
letterSpacing: 2,
color: "rgba(255,255,255,0.45)",
fontWeight: 900,
marginBottom: 4,
};

const logo: CSSProperties = {
margin: 0,
fontSize: 34,
fontWeight: 950,
letterSpacing: -2,
};

const topRight: CSSProperties = {
display: "flex",
alignItems: "center",
gap: 10,
};

const creditBox: CSSProperties = {
display: "flex",
alignItems: "center",
gap: 8,
padding: "10px 13px",
borderRadius: 18,
background: "rgba(255,255,255,0.06)",
border: "1px solid rgba(255,255,255,0.10)",
backdropFilter: "blur(12px)",
};

const coin: CSSProperties = {
width: 30,
height: 30,
borderRadius: 999,
display: "grid",
placeItems: "center",
background: "linear-gradient(135deg,#a855f7,#7c3aed)",
fontWeight: 950,
fontSize: 13,
};

const small: CSSProperties = {
fontSize: 11,
opacity: 0.65,
};

const upgrade: CSSProperties = {
border: "none",
borderRadius: 18,
padding: "12px 16px",
color: "white",
fontWeight: 900,
background: "linear-gradient(135deg,#a855f7,#7c3aed)",
boxShadow: "0 0 30px rgba(168,85,247,0.35)",
};

const proBadge: CSSProperties = {
borderRadius: 18,
padding: "12px 16px",
color: "#08140d",
fontWeight: 950,
background: "linear-gradient(135deg,#7dffb3,#22c55e)",
};

const logoutBtn: CSSProperties = {
position: "absolute",
top: 18,
right: 18,
zIndex: 5,
border: "1px solid rgba(255,255,255,0.12)",
background: "rgba(255,255,255,0.07)",
color: "white",
borderRadius: 16,
padding: "10px 13px",
fontWeight: 800,
};

const aiHero: CSSProperties = {
position: "relative",
zIndex: 2,
overflow: "hidden",
borderRadius: 34,
padding: 24,
background:
"radial-gradient(circle at top right, rgba(0,255,140,0.18), transparent 27%), linear-gradient(145deg,#2b1352,#090312)",
border: "1px solid rgba(0,255,140,0.18)",
boxShadow: "0 25px 70px rgba(0,0,0,0.38)",
marginBottom: 22,
cursor: "pointer",
};

const aiGlow: CSSProperties = {
position: "absolute",
width: 240,
height: 240,
borderRadius: "50%",
background: "rgba(168,85,247,0.20)",
top: -80,
right: -60,
filter: "blur(44px)",
};

const aiPill: CSSProperties = {
display: "inline-flex",
alignItems: "center",
gap: 8,
padding: "9px 14px",
borderRadius: 999,
background: "rgba(0,255,140,0.08)",
border: "1px solid rgba(0,255,140,0.18)",
color: "#7dffb3",
fontWeight: 900,
fontSize: 12,
position: "relative",
zIndex: 2,
};

const greenDot: CSSProperties = {
width: 8,
height: 8,
borderRadius: "50%",
background: "#00ff88",
boxShadow: "0 0 12px #00ff88",
};

const aiTitle: CSSProperties = {
fontSize: 46,
lineHeight: 0.92,
fontWeight: 950,
margin: "22px 0 14px",
letterSpacing: -3,
position: "relative",
zIndex: 2,
};

const aiText: CSSProperties = {
fontSize: 16,
lineHeight: 1.5,
opacity: 0.78,
maxWidth: 360,
position: "relative",
zIndex: 2,
};

const aiFeatureGrid: CSSProperties = {
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: 10,
marginTop: 18,
position: "relative",
zIndex: 2,
};

const aiFeature: CSSProperties = {
padding: "13px 12px",
borderRadius: 18,
background: "rgba(255,255,255,0.055)",
border: "1px solid rgba(255,255,255,0.07)",
display: "flex",
flexDirection: "column",
gap: 4,
fontSize: 13,
};

const aiLeadCard: CSSProperties = {
marginTop: 18,
borderRadius: 24,
padding: 16,
background: "rgba(0,0,0,0.34)",
border: "1px solid rgba(255,255,255,0.09)",
position: "relative",
zIndex: 2,
};

const aiLeadTop: CSSProperties = {
display: "flex",
justifyContent: "space-between",
color: "#7dffb3",
fontWeight: 900,
fontSize: 13,
};

const aiLeadInner: CSSProperties = {
marginTop: 12,
};

const aiCta: CSSProperties = {
width: "100%",
marginTop: 18,
padding: "16px",
borderRadius: 18,
border: "none",
background: "linear-gradient(90deg,#00ff88,#2fffaf)",
color: "#04140c",
fontWeight: 950,
fontSize: 16,
};

const heroCard: CSSProperties = {
position: "relative",
zIndex: 2,
borderRadius: 30,
padding: 24,
background:
"linear-gradient(145deg, rgba(255,255,255,0.075), rgba(255,255,255,0.035))",
border: "1px solid rgba(168,85,247,0.22)",
backdropFilter: "blur(16px)",
marginBottom: 22,
boxShadow: "0 18px 60px rgba(0,0,0,0.28)",
};

const heroPill: CSSProperties = {
display: "inline-flex",
padding: "8px 12px",
borderRadius: 999,
background: "rgba(168,85,247,0.13)",
border: "1px solid rgba(168,85,247,0.24)",
color: "#d8b4fe",
fontSize: 11,
fontWeight: 950,
letterSpacing: 1.2,
marginBottom: 16,
};

const heroTitle: CSSProperties = {
margin: 0,
fontSize: 36,
lineHeight: 1,
fontWeight: 950,
letterSpacing: -2,
};

const heroSub: CSSProperties = {
marginTop: 12,
opacity: 0.72,
lineHeight: 1.5,
};

const promptBox: CSSProperties = {
marginTop: 18,
borderRadius: 22,
padding: 18,
background: "rgba(0,0,0,0.30)",
border: "1px solid rgba(255,255,255,0.09)",
};

const promptInput: CSSProperties = {
width: "100%",
height: 108,
background: "transparent",
border: "none",
outline: "none",
color: "white",
resize: "none",
fontSize: 17,
lineHeight: 1.45,
};

const toolRow: CSSProperties = {
display: "flex",
alignItems: "center",
gap: 10,
flexWrap: "wrap",
};

const chip: CSSProperties = {
border: "1px solid rgba(255,255,255,0.08)",
borderRadius: 999,
padding: "10px 14px",
background: "rgba(255,255,255,0.08)",
color: "white",
fontWeight: 800,
};

const arrowBtn: CSSProperties = {
flex: 1,
minWidth: 96,
height: 52,
borderRadius: 999,
border: "none",
background: "linear-gradient(135deg,#a855f7,#7c3aed)",
color: "white",
fontSize: 15,
fontWeight: 950,
boxShadow: "0 0 28px rgba(168,85,247,0.30)",
};

const uploadBubble: CSSProperties = {
height: 52,
borderRadius: 999,
padding: "0 16px",
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.08)",
display: "grid",
placeItems: "center",
cursor: "pointer",
fontWeight: 850,
color: "white",
};

const generatedCard: CSSProperties = {
position: "relative",
zIndex: 2,
borderRadius: 28,
padding: 18,
background: "rgba(255,255,255,0.05)",
border: "1px solid rgba(255,255,255,0.09)",
marginBottom: 22,
};

const generatedImage: CSSProperties = {
width: "100%",
borderRadius: 20,
marginTop: 16,
marginBottom: 16,
};

const useBtn: CSSProperties = {
width: "100%",
padding: "15px",
border: "none",
borderRadius: 18,
background: "linear-gradient(135deg,#9333ea,#7c3aed)",
color: "white",
fontWeight: 950,
};

const sectionTop: CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
gap: 12,
};

const smallDarkBtn: CSSProperties = {
border: "none",
borderRadius: 14,
padding: "10px 14px",
background: "rgba(255,255,255,0.08)",
color: "white",
fontWeight: 800,
};

const actionsCard: CSSProperties = {
position: "relative",
zIndex: 2,
marginBottom: 22,
};

const sectionTitle: CSSProperties = {
fontSize: 28,
fontWeight: 950,
margin: "0 0 16px",
letterSpacing: -1,
};

const mutedMini: CSSProperties = {
color: "rgba(255,255,255,0.48)",
fontSize: 12,
fontWeight: 800,
};

const actionGrid: CSSProperties = {
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: 12,
};

const actionCard: CSSProperties = {
borderRadius: 24,
padding: 18,
background:
"linear-gradient(145deg, rgba(255,255,255,0.075), rgba(255,255,255,0.035))",
border: "1px solid rgba(255,255,255,0.09)",
display: "flex",
flexDirection: "column",
gap: 10,
color: "white",
minHeight: 150,
textAlign: "left",
};

const actionCode: CSSProperties = {
width: 36,
height: 36,
borderRadius: 12,
display: "grid",
placeItems: "center",
background: "rgba(168,85,247,0.16)",
border: "1px solid rgba(168,85,247,0.25)",
color: "#d8b4fe",
fontWeight: 950,
fontSize: 12,
};

const proofGrid: CSSProperties = {
position: "relative",
zIndex: 2,
display: "grid",
gridTemplateColumns: "1fr 1fr 1fr",
gap: 10,
marginBottom: 22,
};

const proofCard: CSSProperties = {
borderRadius: 20,
padding: 14,
background: "rgba(255,255,255,0.05)",
border: "1px solid rgba(255,255,255,0.08)",
display: "flex",
flexDirection: "column",
gap: 6,
minHeight: 84,
};

const chatBox: CSSProperties = {
position: "relative",
zIndex: 2,
borderRadius: 30,
padding: 22,
background:
"linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.035))",
border: "1px solid rgba(168,85,247,0.18)",
marginBottom: 30,
};

const chatTitle: CSSProperties = {
fontSize: 26,
fontWeight: 950,
margin: 0,
};

const onlinePill: CSSProperties = {
color: "#7dffb3",
fontWeight: 900,
};

const messages: CSSProperties = {
display: "flex",
flexDirection: "column",
gap: 12,
marginTop: 18,
};

const bubble: CSSProperties = {
padding: 14,
borderRadius: 18,
background: "rgba(255,255,255,0.08)",
maxWidth: "88%",
lineHeight: 1.45,
};

const typing: CSSProperties = {
opacity: 0.6,
};

const chatInputStyle: CSSProperties = {
width: "100%",
padding: 16,
borderRadius: 18,
border: "1px solid rgba(255,255,255,0.09)",
background: "rgba(255,255,255,0.055)",
color: "white",
marginTop: 16,
outline: "none",
};

const sendBtn: CSSProperties = {
width: "100%",
marginTop: 14,
padding: 16,
border: "none",
borderRadius: 18,
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
backdropFilter: "blur(18px)",
};

const navBtn: CSSProperties = {
border: "none",
background: "transparent",
color: "rgba(255,255,255,0.6)",
fontWeight: 850,
};

const navActive: CSSProperties = {
...navBtn,
color: "#c084fc",
};

const plusBtn: CSSProperties = {
width: 66,
height: 66,
borderRadius: "50%",
border: "none",
background: "linear-gradient(135deg,#a855f7,#7c3aed)",
color: "white",
fontSize: 38,
fontWeight: 950,
boxShadow: "0 0 30px rgba(168,85,247,0.4)",
};
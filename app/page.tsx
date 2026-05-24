"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
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

const setupSlides = [
{
step: "01",
title: "Sign up",
text: "Create your account and choose your AI receptionist plan.",
},

{
step: "02",
title: "Add business details",
text: "Tell the AI your services, opening hours and service area.",
},

{
step: "03",
title: "Forward your number",
text: "Forward missed or out-of-hours calls to your AI receptionist.",
},

{
step: "04",
title: "AI captures jobs",
text: "The AI collects customer details and sends them to your dashboard.",
},

{
step: "05",
title: "Get instant alerts",
text: "Receive new leads by SMS, WhatsApp or inside your app.",
},
];

export default function Home() {
const router = useRouter();

const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
const [chatLoading, setChatLoading] = useState(false);
const [chatInput, setChatInput] = useState("");
const [prompt, setPrompt] = useState("");
const [businessName, setBusinessName] = useState("");
const [businessTheme, setBusinessTheme] = useState("default");
const [image, setImage] = useState<string | null>(null);
const [loadingImage, setLoadingImage] = useState(false);
const [isPro, setIsPro] = useState(false);
const [credits, setCredits] = useState(0);
const [setupSlide, setSetupSlide] = useState(0);
const adScrollerRef = useRef<HTMLDivElement | null>(null);
const [recentPosts, setRecentPosts] = useState<any[]>([]);
function refreshPage() {
window.location.reload();
}

useEffect(() => {
loadRecentPosts();
}, []);

useEffect(() => {
const timer = setInterval(() => {
setSetupSlide((prev) => (
prev + 1
) % setupSlides.length);
}, 2800);

return () => clearInterval(timer);
}, []);

useEffect(() => {
const el = adScrollerRef.current;

if (!el || recentPosts.length === 0) return;

const timer = setInterval(() => {
el.scrollLeft += 1;

if (el.scrollLeft >= el.scrollWidth / 2) {
el.scrollLeft = 0;
}
}, 20);

return () => clearInterval(timer);
}, [recentPosts]);
async function loadRecentPosts() {
const { data } = await supabase
.from("posts")
.select("*")
.order("created_at", { ascending: false })
.limit(6);
 
setRecentPosts(data || []);
}
const businessText = getBusinessText(businessTheme);

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
const name = business?.name?.toLowerCase() || "";

if (name.includes("tyre") || name.includes("tire")) {
setBusinessTheme("tyres");
} else if (name.includes("barber") || name.includes("hair")) {
setBusinessTheme("barber");
} else if (name.includes("recovery") || name.includes("tow")) {
setBusinessTheme("recovery");
} else if (name.includes("gym") || name.includes("fitness")) {
setBusinessTheme("gym");
} else if (name.includes("food") || name.includes("restaurant") || name.includes("pizza")) {
setBusinessTheme("food");
} else {
setBusinessTheme("default");
}
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
async function buyCredits(packageType: string) {
const {
data: { user },
} = await supabase.auth.getUser();

if (!user?.email) {
alert("Please log in first");
return;
}

const res = await fetch("/api/create-credits-checkout", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
email: user.email,
packageType,
}),
});

const data = await res.json();

if (!res.ok || !data.url) {
alert(data.error || "Checkout failed");
return;
}

window.location.href = data.url;
}
async function logout() {
await supabase.auth.signOut();
router.push("/login");
}

async function upgradeUser() {
    const {
data: { user },
} = await supabase.auth.getUser();
try {
const res = await fetch("/api/create-checkout",{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
email: user?.email,
}),
});

const data = await res.json();

if (!res.ok) {
alert(data.error || "Checkout failed");
return;
}

if (data.url) {
window.location.href = data.url;
} else {
alert("No checkout link returned");
}
} catch (err) {
alert("Could not start checkout. Please try again.");
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

if (imageUrl) setImage(imageUrl);

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

const { error } = await supabase.storage.from("posts").upload(fileName, file);

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
business_name: "",
location: "",
});

window.location.href = "/feed";
}

async function useThisAd() {
if (!image) return;

try {
const response = await fetch(image);
const blob = await response.blob();

const fileName = `${Date.now()}.png`;

const { error: uploadError } = await supabase.storage
.from("posts")
.upload(fileName, blob);

if (uploadError) {
alert(uploadError.message);
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
content: prompt || "AI generated advert",
image_url: publicUrl,
video_url: null,
business_name: "",
location: "",
created_at: new Date().toISOString(),
});

alert("Post saved");

window.location.href = "/feed";
} catch (err) {
console.log(err);
alert("Failed to save image");
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

try {
const res = await fetch("/api/chat", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
message: newMessage.content,
}),
});

const data = await res.json();

setChatMessages((prev) => [
...prev,
{
role: "assistant",
content: data.reply,
},
]);
} catch (err) {
setChatMessages((prev) => [
...prev,
{
role: "assistant",
content: "AI failed to respond.",
},
]);
}

setChatLoading(false);
}

return (
<>
<button onClick={refreshPage} style={refreshBtn}>
↻
</button>
<style jsx global>{`
@keyframes premiumFade {
0% {
opacity: 0;
transform: translateY(10px);
filter: blur(5px);
}
@keyframes pulseGlow {
0% {
transform: scale(0.96);
box-shadow: 0 0 18px rgba(34,255,127,0.25);
}

50% {
transform: scale(1);
box-shadow: 0 0 35px rgba(34,255,127,0.55);
}

100% {
transform: scale(0.96);
box-shadow: 0 0 18px rgba(34,255,127,0.25);
}
}
100% {
opacity: 1;
transform: translateY(0);
filter: blur(0);
}
}
`}</style>


<style jsx global>{`
@keyframes floatUp {
0%, 100% { transform: translateY(0px); }
50% { transform: translateY(-10px); }
}
.ad-scroller::-webkit-scrollbar {
display: none;
}
@keyframes autoAds {
from {
transform: translateX(0);
}
@keyframes borderGlow {
0% { opacity: 0.35; transform: translateX(-30%); }
50% { opacity: 1; }
100% { opacity: 0.35; transform: translateX(30%); }
}
@keyframes floatUp {
0% {
transform: translateY(0px);
}

50% {
transform: translateY(-6px);
}

100% {
transform: translateY(0px);
}
}


@keyframes pulseGlow {
0%, 100% { box-shadow: 0 0 24px rgba(34,255,127,0.25); }
50% { box-shadow: 0 0 48px rgba(34,255,127,0.55); }
}


@keyframes greenWave {
0% { transform: translateX(-100%); opacity: 0.2; }
50% { opacity: 1; }
100% { transform: translateX(100%); opacity: 0.2; }
}

.float-card {
animation: floatUp 4s ease-in-out infinite;
}
.hero-particles{
position:absolute;
inset:0;
background-image:
radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px);
background-size:22px 22px;
opacity:.18;
animation:floatParticles 18s linear infinite;
pointer-events:none;
}

.hero-beam{
position:absolute;
top:-120px;
left:50%;
transform:translateX(-50%);
width:420px;
height:420px;
background:
radial-gradient(circle,
rgba(120,170,255,0.22) 0%,
rgba(120,170,255,0.08) 42%,
transparent 75%);
filter:blur(60px);
pointer-events:none;
}

.hero-wave{
position:absolute;
top:0;
left:-40%;
width:180%;
height:2px;
background:linear-gradient(90deg,
transparent,
rgba(255,255,255,0.9),
transparent);
animation:waveMove 4s linear infinite;
opacity:.7;
}

@keyframes waveMove{
0%{transform:translateX(-30%)}
100%{transform:translateX(30%)}
}

@keyframes floatParticles{
0%{transform:translateY(0)}
100%{transform:translateY(-40px)}
}

.green-pulse {
animation: pulseGlow 2.5s ease-in-out infinite;
}


.wave-line {
animation: greenWave 3s ease-in-out infinite;
}
`}</style>

<div style={bgGlow1} />
<div style={bgGlow2} />
<div style={bgGlowLeft} />
<div style={bgGlowRight} />
<div style={bgParticles} />
<main style={page}>
<header style={topBar}>
<div>
<div style={brandLabel}>AI ADVERTISING PLATFORM</div>
<h1 style={logo}>
Ad<span style={{ color: "#FFFFFF" }}>Forge</span>
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

<div style={{ display: "flex", gap: 8, alignItems: "center" }}>
<button
onClick={() => buyCredits("50")}
style={greenBtn}
>
50 Credits
</button>

<button
onClick={() => buyCredits("150")}
style={greenBtn}
>
150 Credits
</button>

{!isPro && (
<button
onClick={() => buyCredits("pro")}
style={greenBtn}
>
PRO
</button>
)}
</div>
</div>
</header>



<section style={aiHero} onClick={() => router.push("/ai-receptionist")}>
<div style={heroPhoneGlow} />

<div style={aiPill}>
<span style={greenDot} />
GET STARTED
</div>

<div style={premiumHeroGrid}>
<div>
<h2 style={aiTitle}>
Set up in minutes.
<br />
Never miss a business
<br />
<span style={{ color: "#cfdcff" }}>call again.</span>
</h2>

<p style={aiText}>
AdForge AI handles calls, captures leads and helps you grow your business
24/7.
</p>
</div>

<div style={phoneMockup}>
<div style={phoneScreen}>
<b>AdForge</b>
<div style={waveFake} />
<span>AI Answering...</span>
</div>
</div>
</div>

<div style={setupPanel}>
{[
["01", "Sign up", "Create your AdForge account in less than a minute."],
["02", "Forward your number", "Forward your business number to AdForge AI."],
["03", "AI answers every call", "AI speaks naturally, captures job details and qualifies leads 24/7."],
["04", "Advertise your business", "Create AI adverts, videos and posts that bring more eyes to you."],
["05", "Get more booked jobs", "Receive WhatsApp + SMS alerts and watch your business grow."],
].map(([num, title, text]) => (
<div key={num} style={setupRow}>
<div style={stepCircle}>{num}</div>

<div style={stepIcon}>●</div>

<div style={{ flex: 1 }}>
<b style={stepTitle}>{title}</b>
<p style={stepText}>{text}</p>
</div>
</div>
))}
</div>

<div style={premiumStats}>
{[
["128", "Calls Answered", "Today"],
["42", "Leads Captured", "Today"],
["19", "Jobs Booked", "Today"],
["24/7", "AI Always On", "Never Miss a Call"],
].map(([num, label, sub]) => (
<div key={label} style={premiumStat}>
<b>{num}</b>
<span>{label}</span>
<small>{sub}</small>
</div>
))}
</div>

<button style={aiCta}>
⚡ Launch AI Receptionist
</button>
</section>
<section style={liveAdsWrap}>
<div style={sectionTop}>
<span style={sectionPill}>AI CREATED ADS</span>
<b style={liveText}>LIVE</b>
</div>

<div style={adsScroll}>
{[
"/videos/15474586_2160_3840_30fps.mp4",
"/videos/video-2.mp4",
"/videos/video-3.mp4",
].map((src, i) => (
<div key={i} style={premiumAdCard}>
<video autoPlay muted loop playsInline style={premiumAdImage}>
<source src={src} type="video/mp4" />
</video>

<div style={premiumAdOverlay}>
<b>{i === 0 ? "Tyre Replacement" : i === 1 ? "Mobile Fitting" : "Business Promo"}</b>
<span>Generated by AdForge AI</span>
</div>
</div>
))}
</div>
</section>

<section style={miniStatsWrap}>
<div style={miniStatBox}>
<b>1.2M+</b>
<span>AI Views Generated</span>
</div>

<div style={miniStatBox}>
<b>24/7</b>
<span>Calls Answered</span>
</div>

<div style={miniStatBox}>
<b>4.9★</b>
<span>Business Rating</span>
</div>
</section>


<section style={studioPanel}>
<div style={studioTop}>
<div>
<span style={studioPill}>AI STUDIO</span>
<h3 style={studioTitle}>Create ads, videos & posts</h3>
<p style={studioText}>
Generate premium content, upload media and promote your business in seconds.
</p>
</div>
</div>

<textarea
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Describe your offer, business or promotion..."
style={studioInput}
/>

{image && (
<div style={studioPreview}>
<img src={image} style={studioPreviewImg} />
<button style={studioPreviewBtn} onClick={() => router.push("/feed")}>
Share to Feed
</button>
</div>
)}

<div style={studioButtons}>
<button
type="button"
style={studioBtn}
disabled={loadingImage}
onClick={(e) => {
e.preventDefault();
e.stopPropagation();

if (!prompt.trim()) {
setPrompt("Create a premium advert for my business");
setTimeout(() => generateAd(), 50);
return;
}

generateAd();
}}
>
{loadingImage ? "Generating..." : "Generate Ad"}
</button>

<button
type="button"
style={studioBtn}
onClick={(e) => {
e.preventDefault();
e.stopPropagation();
router.push("/video");
}}
>
AI Video
</button>

<label style={studioBtn}>
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
</div>
</section>

<section style={premiumAdsSection}>
<div style={studioTop}>
<div>
<span style={studioPill}>LIVE FEED</span>
<h3 style={studioTitle}>Recent AI Generated Ads</h3>
</div>

<button style={viewBtn} onClick={() => router.push("/feed")}>
View all
</button>
</div>

<div style={premiumAdRail}>
{recentPosts.slice(0, 6).map((post, i) => (
<div key={i} style={premiumAdCard}>
<img
src={post.image_url || post.video_url || "/placeholder.png"}
style={premiumAdImage}
/>

<div style={premiumAdOverlay}>
<b>{post.content || "AI Generated Ad"}</b>
<span>Ready to post</span>
</div>
</div>
))}
</div>
</section>

<section style={assistantPanel}>
<div style={studioTop}>
<div>
<span style={studioPill}>AI ASSISTANT</span>
<h3 style={studioTitle}>Improve your advert</h3>
</div>
</div>

<div style={assistantMessages}>
{chatMessages.length === 0 && (
<div style={assistantBubble}>
Tell me what you sell and I’ll sharpen your offer, wording and advert angle.
</div>
)}

{chatMessages.map((msg, i) => (
<div
key={i}
style={{
...assistantBubble,
alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
opacity: msg.role === "user" ? 1 : 0.9,
}}
>
{msg.content}
</div>
))}
</div>

<div style={assistantInputRow}>
<input
value={chatInput}
onChange={(e) => setChatInput(e.target.value)}
placeholder="Ask AI to improve this..."
style={assistantInput}
onKeyDown={(e) => {
if (e.key === "Enter") sendChatMessage();
}}
/>

<button style={assistantSend} onClick={sendChatMessage}>
→
</button>
</div>
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
AI
</button>

<button style={navBtn} onClick={() => router.push("/profile")}>
Profile
</button>
</nav>
</main>
</>
);
}

const WHITE = "#f8fbff";
const SOFT_WHITE = "rgba(248,251,255,0.86)";
const MUTED_WHITE = "rgba(248,251,255,0.58)";
const LINE = "rgba(248,251,255,0.18)";
const LINE_STRONG = "rgba(248,251,255,0.34)";
const GLASS = "rgba(8,10,14,0.72)";
const GLASS_DARK = "rgba(2,3,6,0.92)";
const GLOW = "rgba(220,235,255,0.42)";
const GLOW_SOFT = "rgba(220,235,255,0.16)";
const BLACK = "#020305";

const page: CSSProperties = {
minHeight: "100vh",
padding: "18px 16px 140px",
backgroundColor: "#020305",
background:
"linear-gradient(180deg, #05070b 0%, #020305 100%)",
color: WHITE,
fontFamily: "Inter, sans-serif",
overflowX: "hidden",
position: "relative",
};

const bgGlow1: CSSProperties = {
position: "fixed",
width: 320,
height: 320,
borderRadius: "50%",
background: GLOW_SOFT,
top: -110,
right: -110,
filter: "blur(95px)",
pointerEvents: "none",
zIndex: 0,
};

const getActionImage = (theme: string): CSSProperties => ({
position: "absolute",
inset: 0,
backgroundImage:
theme === "tyres"
? "url('https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop')"
: theme === "barber"
? "url('https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1200&auto=format&fit=crop')"
: theme === "recovery"
? "url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=1200&auto=format&fit=crop')"
: theme === "gym"
? "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop')"
: theme === "food"
? "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop')"
: "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop')",
backgroundSize: "cover",
backgroundPosition: "center",
opacity: 0.16,
filter: "brightness(0.55) grayscale(0.25)",
borderRadius: 22,
});

const getBusinessText = (theme: string) => {
switch (theme) {
case "tyres":
return {
lead: "New customer enquiry",
subtitle: "AI captured lead • Ready to convert",
prompt: "Create a premium advert for your business",
};

case "barber":
return {
lead: "Fresh fade booking",
subtitle: "Skin fade • Beard trim • Ready to book",
prompt: "Modern barber shop Liverpool create a viral advert",
};

case "recovery":
return {
lead: "Vehicle recovery callout",
subtitle: "Breakdown • Fast response • Ready to dispatch",
prompt: "24/7 breakdown recovery Liverpool create an advert",
};

case "gym":
return {
lead: "New fitness enquiry",
subtitle: "Personal training • Membership • Ready to join",
prompt: "Luxury gym Liverpool create a high converting advert",
};

default:
return {
lead: "New customer enquiry",
subtitle: "AI generated lead • Ready to convert",
prompt: "Create a premium advert for my business",
};
}
};

const bgGlow2: CSSProperties = {
position: "fixed",
width: 260,
height: 260,
borderRadius: "50%",
background: "rgba(255,255,255,0.08)",
bottom: 120,
left: -110,
filter: "blur(90px)",
pointerEvents: "none",
zIndex: 0,
};

const topBar: CSSProperties = {
position: "relative",
zIndex: 2,
paddingTop: 28,
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: 18,
};

const brandLabel: CSSProperties = {
fontSize: 10,
letterSpacing: 4,
color: "rgba(255,255,255,0.48)",
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
gap: 8,
flexWrap: "wrap",
justifyContent: "flex-start",
maxWidth: "100%",
};

const creditBox: CSSProperties = {
display: "flex",
alignItems: "center",
gap: 8,
padding: "4px 12px",
borderRadius: 24,
background:
"linear-gradient(145deg, rgba(24,28,36,0.92), rgba(4,5,9,0.96))",
border: "1px solid rgba(220,235,255,0.26)",
backdropFilter: "blur(18px)",
boxShadow:
"0 0 18px rgba(220,235,255,0.22), 0 0 55px rgba(220,235,255,0.10), inset 0 1px 0 rgba(255,255,255,0.14)",
height: 42,
minWidth: 92,
};

const coin: CSSProperties = {
width: 26,
height: 26,
borderRadius: "50%",
background: "linear-gradient(135deg,#ffffff,#bfc8d8)",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontWeight: 900,
fontSize: 16,
color: "#05070b",
boxShadow: `0 0 18px ${GLOW}`,
};

const small: CSSProperties = {
fontSize: 11,
opacity: 0.65,
};

const greenBtn: CSSProperties = {
background: "linear-gradient(135deg,#ffffff,#d9e3f3)",
color: "#05070b",
borderRadius: 18,
boxShadow:
"0 0 18px rgba(220,235,255,0.28), 0 0 60px rgba(220,235,255,0.10)",
border: `1px solid ${LINE_STRONG}`,
transition: "all 0.25s ease",
padding: "8px 12px",
fontWeight: 900,
fontSize: 13,
minWidth: 88,
height: 46,
cursor: "pointer",
};

const proBadge: CSSProperties = {
...greenBtn,
};

const logoutBtn: CSSProperties = {
position: "absolute",
top: 18,
right: 18,
zIndex: 1,
marginLeft: -20,
border: `1px solid ${LINE}`,
background: GLASS,
color: WHITE,
borderRadius: 16,
padding: "10px 13px",
fontWeight: 800,
};



const aiPill: CSSProperties = {
display: "inline-flex",
alignItems: "center",
gap: 8,
padding: "9px 14px",
borderRadius: 999,
background: "rgba(255,255,255,0.07)",
border: `1px solid ${LINE_STRONG}`,
color: WHITE,
fontWeight: 900,
fontSize: 12,
position: "relative",
zIndex: 2,
boxShadow: `0 0 22px ${GLOW_SOFT}`,
};

const greenDot: CSSProperties = {
width: 8,
height: 8,
borderRadius: "50%",
background: WHITE,
boxShadow: `0 0 12px ${GLOW}`,
};

const waveWrap: CSSProperties = {
position: "absolute",
right: -20,
top: 120,
width: 260,
height: 70,
overflow: "hidden",
opacity: 0.45,
};

const waveLine: CSSProperties = {
width: 260,
height: 2,
background: "linear-gradient(90deg,transparent,#ffffff,transparent)",
marginTop: 34,
};







const aiLeadCard: CSSProperties = {
marginTop: 18,
borderRadius: 22,
padding: 16,
background: GLASS,
border: `1px solid ${LINE}`,
position: "relative",
zIndex: 2,
};

const aiLeadTop: CSSProperties = {
display: "flex",
justifyContent: "space-between",
color: WHITE,
fontWeight: 900,
fontSize: 12,
};

const statsStrip: CSSProperties = {
position: "relative",
zIndex: 2,
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: 10,
padding: 12,
borderRadius: 24,
background: "rgba(255,255,255,0.045)",
border: `1px solid ${LINE}`,
marginBottom: 18,
};

const statBox: CSSProperties = {
padding: 12,
borderRadius: 18,
background: "rgba(0,0,0,0.35)",
border: "1px solid rgba(220,235,255,0.14)",
boxShadow:
"0 0 10px rgba(220,235,255,0.10), inset 0 1px 0 rgba(255,255,255,0.08)",
display: "flex",
flexDirection: "column",
gap: 4,
};

const heroCard: CSSProperties = {
position: "relative",
overflow: "hidden",
zIndex: 2,
borderRadius: 28,
padding: 18,
minHeight: 420,
backgroundImage: `
linear-gradient(
to bottom,
rgba(0,0,0,0.10) 0%,
rgba(0,0,0,0.34) 45%,
rgba(0,0,0,0.88) 78%,
#020305 100%
),
url('/hero-bg.jpg')
`,
backgroundSize: "cover",
backgroundPosition: "center top",
backgroundRepeat: "no-repeat",
backdropFilter: "blur(22px)",
border: "1px solid rgba(220,235,255,0.18)",
boxShadow:
"0 0 12px rgba(220,235,255,0.18), 0 0 42px rgba(220,235,255,0.10), inset 0 1px 0 rgba(255,255,255,0.10)",
marginBottom: 18,
};

const heroTop: CSSProperties = {
display: "flex",
justifyContent: "space-between",
gap: 12,
};

const heroPill: CSSProperties = {
display: "inline-flex",
padding: "8px 12px",
borderRadius: 999,
background: "rgba(255,255,255,0.08)",
border: `1px solid ${LINE}`,
color: WHITE,
fontSize: 11,
fontWeight: 950,
letterSpacing: 1.2,
marginBottom: 12,
};

const liveBadge: CSSProperties = {
color: WHITE,
fontWeight: 950,
};

const heroTitle: CSSProperties = {
margin: 0,
fontSize: 26,
lineHeight: 1,
fontWeight: 950,
letterSpacing: -1,
};

const promptBox: CSSProperties = {
marginTop: 14,
borderRadius: 20,
padding: 14,
background: "rgba(0,0,0,0.42)",
border: `1px solid ${LINE}`,
};

const promptInput: CSSProperties = {
width: "100%",
height: 86,
background: "transparent",
border: "none",
outline: "none",
color: WHITE,
resize: "none",
fontSize: 16,
lineHeight: 1.45,
};

const toolRow: CSSProperties = {
display: "flex",
alignItems: "center",
gap: 10,
flexWrap: "wrap",
};

const chip: CSSProperties = {
border: `1px solid ${LINE}`,
borderRadius: 999,
padding: "10px 14px",
background: "rgba(255,255,255,0.07)",
color: WHITE,
fontWeight: 800,
};

const createBtn: CSSProperties = {
flex: 1,
minWidth: 135,
height: 52,
borderRadius: 999,
border: "none",
background: "linear-gradient(135deg,#ffffff,#d9e3f3)",
color: "#05070b",
fontSize: 15,
fontWeight: 950,
};

const showcase: CSSProperties = {
position: "relative",
zIndex: 2,
borderRadius: 24,
padding: 16,
background:
"linear-gradient(145deg, rgba(15,18,25,0.92), rgba(3,5,10,0.96))",
border: "1px solid rgba(220,235,255,0.18)",
marginBottom: 18,
overflow: "hidden",
boxShadow:
"0 0 12px rgba(220,235,255,0.18), 0 0 42px rgba(220,235,255,0.10), inset 0 1px 0 rgba(255,255,255,0.10)",
};

const sectionTop: CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
gap: 12,
};

const sectionTitle: CSSProperties = {
fontSize: 22,
fontWeight: 950,
margin: "0 0 14px",
};

const viewBtn: CSSProperties = {
border: "none",
background: "transparent",
color: WHITE,
fontWeight: 900,
};

const adScroller: CSSProperties = {
overflowX: "auto",
overflowY: "hidden",
scrollBehavior: "auto",
scrollbarWidth: "none",
};

const adTitle: CSSProperties = {
fontSize: 15,
lineHeight: "18px",
maxHeight: 38,
overflow: "hidden",
};

const adSub: CSSProperties = {
fontSize: 12,
opacity: 0.8,
};

const adTrack: CSSProperties = {
display: "flex",
gap: 12,
width: "max-content",
};

const liveAdImage: CSSProperties = {
width: "100%",
height: "100%",
objectFit: "cover",
display: "block",
};

const liveadPreview: CSSProperties = {
width: 160,
minWidth: 160,
height: 215,
padding: 8,
borderRadius: 16,
background: "linear-gradient(145deg,#0b0d12,#030405)",
border: `1px solid ${LINE}`,
display: "flex",
flexDirection: "column",
gap: 6,
overflow: "hidden",
flexShrink: 0,
boxShadow: `0 0 24px ${GLOW_SOFT}`,
};

const adMockImage: CSSProperties = {
height: 72,
borderRadius: 16,
position: "relative",
overflow: "hidden",
background:
"linear-gradient(135deg, rgba(255,255,255,0.12), rgba(0,0,0,0.78)), radial-gradient(circle at 70% 45%, rgba(255,255,255,0.42), transparent 26%), linear-gradient(135deg,#151922,#020305)",
};

const tyreCircle: CSSProperties = {
position: "absolute",
width: 72,
height: 72,
borderRadius: "50%",
border: "11px solid rgba(248,251,255,0.88)",
right: 14,
bottom: -18,
boxShadow: `0 0 25px ${GLOW}`,
};

const adGlow: CSSProperties = {
position: "absolute",
width: 120,
height: 70,
borderRadius: 18,
background: "linear-gradient(135deg, rgba(255,255,255,0.34), rgba(255,255,255,0.06))",
filter: "blur(8px)",
left: 12,
top: 18,
};

const adRoad: CSSProperties = {
position: "absolute",
left: 0,
right: 0,
bottom: 0,
height: 28,
background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.65))",
};

const miniGreen: CSSProperties = {
marginTop: "auto",
color: WHITE,
fontSize: 11,
fontWeight: 950,
};

const generatedCard: CSSProperties = {
position: "relative",
zIndex: 2,
overflow: "hidden",
borderRadius: 24,
padding: 16,
background:
"linear-gradient(145deg, rgba(15,18,25,0.92), rgba(3,5,10,0.96))",
border: "1px solid rgba(220,235,255,0.18)",

marginBottom: 18,
};

const testimonialStrip: CSSProperties = {
marginTop: 22,
padding: 22,
position: "relative",
overflow: "hidden",
borderRadius: 28,
border: "1px solid rgba(220,235,255,0.18)",
background:
"linear-gradient(145deg, rgba(15,18,25,0.92), rgba(3,5,10,0.96))",
boxShadow:
"0 0 12px rgba(220,235,255,0.18), 0 0 42px rgba(220,235,255,0.10), inset 0 1px 0 rgba(255,255,255,0.10)",
};

const stars: CSSProperties = {
color: WHITE,
fontSize: 18,
letterSpacing: 2,
marginBottom: 8,
};

const testimonialTitle: CSSProperties = {
margin: 0,
color: WHITE,
fontSize: 22,
fontWeight: 900,
textShadow: "0 0 24px rgba(255,255,255,0.18)",
};

const testimonialText: CSSProperties = {
marginTop: 8,
color: "rgba(255,255,255,0.72)",
fontSize: 14,
lineHeight: 1.5,
};

const testimonialStats: CSSProperties = {
marginTop: 18,
display: "grid",
gridTemplateColumns: "repeat(3, 1fr)",
gap: 10,
};

const generatedImage: CSSProperties = {
width: "100%",
height: "100%",
objectFit: "cover",
borderRadius: 24,
marginTop: 16,
marginBottom: 16,
display: "block",
};

const smallDarkBtn: CSSProperties = {
border: "none",
borderRadius: 14,
padding: "10px 14px",
background: "rgba(255,255,255,0.08)",
color: WHITE,
fontWeight: 800,
};

const useBtn: CSSProperties = {
width: "100%",
padding: "15px",
border: "none",
borderRadius: 18,
background: "linear-gradient(135deg,#ffffff,#d9e3f3)",
color: "#05070b",
fontWeight: 950,
};

const actionsCard: CSSProperties = {
position: "relative",
zIndex: 2,
marginBottom: 18,
};

const actionGrid: CSSProperties = {
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: 12,
};

const actionCard: CSSProperties = {
position: "relative",
overflow: "hidden",
borderRadius: 28,
padding: 22,
transition: "all 0.3s ease",
transform: "translateY(0px)",
background:
"linear-gradient(145deg, rgba(15,18,25,0.92), rgba(3,5,10,0.96))",
border: "1px solid rgba(220,235,255,0.18)",
minHeight: 120,
boxShadow:
"0 0 12px rgba(220,235,255,0.18), 0 0 42px rgba(220,235,255,0.10), inset 0 1px 0 rgba(255,255,255,0.10)",
backdropFilter: "blur(18px)",
color: WHITE,
};

const actionBgGlow: CSSProperties = {
position: "absolute",
width: 160,
height: 160,
borderRadius: "50%",
background: GLOW_SOFT,
top: -60,
right: -40,
filter: "blur(30px)",
pointerEvents: "none",
};

const actionBgLines: CSSProperties = {
position: "absolute",
inset: 0,
background: "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.06) 45%, transparent 100%)",
opacity: 0.5,
pointerEvents: "none",
};

const actionIcon: CSSProperties = {
width: 38,
height: 38,
borderRadius: 12,
display: "grid",
placeItems: "center",
background: "rgba(255,255,255,0.08)",
border: `1px solid ${LINE_STRONG}`,
color: WHITE,
fontWeight: 950,
fontSize: 12,
};

const bgGlowLeft: CSSProperties = {
position: "fixed",
left: -120,
top: 180,
width: 280,
height: 280,
borderRadius: "50%",
background: "rgba(255,255,255,0.07)",
filter: "blur(80px)",
pointerEvents: "none",
};

const bgGlowRight: CSSProperties = {
position: "fixed",
right: -120,
top: 420,
width: 320,
height: 320,
borderRadius: "50%",
background: "rgba(255,255,255,0.065)",
filter: "blur(90px)",
pointerEvents: "none",
};

const bgParticles: CSSProperties = {
position: "fixed",
inset: 0,
backgroundImage: "radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)",
backgroundSize: "34px 34px",
opacity: 0.14,
pointerEvents: "none",
};

const chatBox: CSSProperties = {
position: "relative",
overflow: "hidden",
marginTop: 34,
padding: 28,
borderRadius: 36,
background:
"linear-gradient(145deg, rgba(15,18,25,0.92), rgba(3,5,10,0.96))",
border: "1px solid rgba(220,235,255,0.18)",
boxShadow:
"0 0 12px rgba(220,235,255,0.18), 0 0 42px rgba(220,235,255,0.10), inset 0 1px 0 rgba(255,255,255,0.10)",
backdropFilter: "blur(28px)",
};

const chatTitle: CSSProperties = {
fontSize: 25,
fontWeight: 950,
margin: 0,
textShadow: "0 0 24px rgba(255,255,255,0.18)",
};

const onlinePill: CSSProperties = {
color: WHITE,
fontWeight: 900,
};

const messages: CSSProperties = {
display: "flex",
flexDirection: "column",
gap: 12,
marginTop: 16,
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

const chatInputWrap: CSSProperties = {
marginTop: 14,
display: "flex",
gap: 10,
alignItems: "center",
borderRadius: 999,
border: `1px solid ${LINE}`,
background: "rgba(255,255,255,0.055)",
padding: 8,
};

const chatInputStyle: CSSProperties = {
flex: 1,
border: "none",
background: "transparent",
color: WHITE,
outline: "none",
padding: "10px 8px",
};

const sendCircle: CSSProperties = {
width: 44,
height: 44,
borderRadius: "50%",
border: "none",
boxShadow:
"0 0 18px rgba(220,235,255,0.28), 0 0 60px rgba(220,235,255,0.10)",
background: "linear-gradient(135deg,#ffffff,#d9e3f3)",
color: "#05070b",
fontWeight: 950,
fontSize: 22,
};

const bottomNav: CSSProperties = {
position: "fixed",
left: 18,
right: 18,
height: 84,
bottom: "calc(16px + env(safe-area-inset-bottom))",

background:
"linear-gradient(180deg, rgba(10,12,18,0.96), rgba(2,3,6,0.98))",

border: "1px solid rgba(255,255,255,0.14)",

borderRadius: 34,

display: "flex",
justifyContent: "space-around",
alignItems: "center",

zIndex: 9999,

backdropFilter: "blur(28px)",


boxShadow:
"0 0 45px rgba(220,235,255,0.12), inset 0 1px 0 rgba(255,255,255,0.08)",
};

const navBtn: CSSProperties = {
border: "none",
background: "transparent",
color: "rgba(255,255,255,0.58)",
fontWeight: 850,
fontSize: 15,
};

const navActive: CSSProperties = {
...navBtn,
color: "#ffffff",
textShadow: "0 0 16px rgba(220,235,255,0.55)",
};

const plusBtn: CSSProperties = {
width: 72,
height: 72,
borderRadius: "50%",

border: "1px solid rgba(255,255,255,0.14)",

background:
"linear-gradient(135deg,#ffffff 0%,#dce6f5 100%)",

color: "#05070b",

fontSize: 42,
fontWeight: 950,

boxShadow:
"0 0 18px rgba(220,235,255,0.28), 0 0 60px rgba(220,235,255,0.10)",

transform: "translateY(-18px)",
};


const setupSliderBox: React.CSSProperties = {
marginTop: 22,
padding: "22px",
borderRadius: 28,
border: `1px solid ${LINE}`,
background: "linear-gradient(135deg, rgba(0,0,0,0.84), rgba(10,12,18,0.96))",
overflow: "hidden",
boxShadow: `0 0 34px ${GLOW_SOFT}`,
};

const setupSlideInner: React.CSSProperties = {
animation: "premiumFade 0.5s ease",
};

const setupTopRow: React.CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: 12,
};

const setupStep: React.CSSProperties = {
color: WHITE,
fontSize: 12,
fontWeight: 900,
letterSpacing: 1.2,
};

const heroGlow: CSSProperties = {
position: "absolute",
top: -160,
left: "50%",
transform: "translateX(-50%)",
width: 480,
height: 480,
borderRadius: "50%",
background:
"radial-gradient(circle, rgba(120,170,255,0.22) 0%, rgba(120,170,255,0.08) 42%, transparent 75%)",
filter: "blur(60px)",
pointerEvents: "none",
zIndex: 0,
};
const setupTime: React.CSSProperties = {
color: WHITE,
fontSize: 12,
fontWeight: 800,
opacity: 0.9,
};

const setupTitle: React.CSSProperties = {
color: WHITE,
fontSize: 24,
fontWeight: 900,
margin: "0 0 8px",
letterSpacing: "-0.8px",
textShadow: "0 0 24px rgba(255,255,255,0.18)",
};

const setupText: React.CSSProperties = {
color: "rgba(255,255,255,0.68)",
fontSize: 15,
lineHeight: 1.45,
margin: 0,
};

const setupDots: React.CSSProperties = {
display: "flex",
gap: 7,
marginTop: 18,
};

const setupDot: React.CSSProperties = {
height: 7,
borderRadius: 999,
background: WHITE,
transition: "all 0.35s ease",
boxShadow: `0 0 12px ${GLOW}`,
};

const refreshBtn: CSSProperties = {
position: "fixed",
top: "calc(78px + env(safe-area-inset-top))",
right: 18,
zIndex: 9999,
width: 42,
height: 42,
borderRadius: "50%",
border: `1px solid ${LINE_STRONG}`,
background: "rgba(0,0,0,0.58)",
color: WHITE,
fontSize: 24,
fontWeight: 900,
boxShadow: `0 0 20px ${GLOW_SOFT}`,
};

const assistantGlow: CSSProperties = {
position: "absolute",
top: -110,
right: -90,
width: 260,
height: 260,
borderRadius: "50%",
background: GLOW_SOFT,
filter: "blur(90px)",
pointerEvents: "none",
};
const heroPhoneGlow: CSSProperties = {
position: "absolute",
top: 20,
right: -80,
width: 260,
height: 260,
borderRadius: "50%",
background: "radial-gradient(circle, rgba(180,210,255,0.22), transparent 70%)",
filter: "blur(45px)",
pointerEvents: "none",
};





const phoneScreen: CSSProperties = {
height: "100%",
borderRadius: 24,
background: "linear-gradient(180deg,#07101d,#020305)",
display: "flex",
flexDirection: "column",
justifyContent: "center",
alignItems: "center",
gap: 14,
color: "white",
};

const waveFake: CSSProperties = {
width: 90,
height: 34,
background:
"linear-gradient(90deg, transparent, rgba(220,235,255,0.9), transparent)",
borderRadius: 999,
boxShadow: "0 0 24px rgba(220,235,255,0.45)",
};

const aiHero: CSSProperties = {
position: "relative",
overflow: "hidden",
padding: "14px 16px 16px",
borderRadius: 28,
background:
"radial-gradient(circle at top right, rgba(120,170,255,0.16), transparent 38%), linear-gradient(180deg, rgba(13,18,28,0.96), rgba(3,5,10,0.98))",
border: "1px solid rgba(220,235,255,0.14)",
boxShadow:
"0 0 35px rgba(220,235,255,0.10), inset 0 1px 0 rgba(255,255,255,0.08)",
zIndex: 2,
marginBottom: 18,
cursor: "pointer",
};

const aiTitle: CSSProperties = {
fontSize: 32,
lineHeight: 0.95,
fontWeight: 950,
letterSpacing: -2,
marginTop: 18,
marginBottom: 14,
color: "white",
textShadow: "0 0 22px rgba(255,255,255,0.14)",
};

const aiText: CSSProperties = {
fontSize: 15,
lineHeight: 1.45,
color: "rgba(255,255,255,0.68)",
maxWidth: 430,
margin: 0,
};



const stepNum: CSSProperties = {
width: 34,
height: 34,
minWidth: 34,
borderRadius: "50%",
display: "grid",
placeItems: "center",
border: "1px solid rgba(220,235,255,0.28)",
boxShadow: "0 0 14px rgba(220,235,255,0.16)",
fontSize: 13,
fontWeight: 950,
};

const stepMain: CSSProperties = {
display: "block",
fontSize: 15,
fontWeight: 950,
marginBottom: 2,
};

const stepSub: CSSProperties = {
margin: 0,
fontSize: 12,
lineHeight: 1.25,
color: "rgba(255,255,255,0.58)",
};


const compactSteps: CSSProperties = {
marginTop: 20,
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: 10,
};

const compactStep: CSSProperties = {
minHeight: 74,
borderRadius: 22,
padding: "14px",
background:
"linear-gradient(145deg, rgba(12,16,24,0.92), rgba(3,5,10,0.98))",
border: "1px solid rgba(220,235,255,0.16)",
boxShadow:
"0 0 20px rgba(220,235,255,0.10), inset 0 1px 0 rgba(255,255,255,0.08)",
display: "flex",
flexDirection: "column",
gap: 7,
color: "white",
};

const premiumHeroGrid: CSSProperties = {
display: "grid",
gridTemplateColumns: "1fr 105px",
gap: 8,
alignItems: "center",
};

const phoneMockup: CSSProperties = {
height: 95,
borderRadius: 24,
background: "linear-gradient(145deg,#101622,#030407)",
border: "1px solid rgba(220,235,255,0.22)",
boxShadow: "0 0 24px rgba(220,235,255,0.13)",
padding: 8,
transform: "rotate(7deg)",
};

const setupPanel: CSSProperties = {
marginTop: 14,
borderRadius: 22,
overflow: "hidden",
background:
"linear-gradient(180deg, rgba(12,16,24,0.88), rgba(3,5,10,0.96))",
border: "1px solid rgba(220,235,255,0.12)",
boxShadow:
"0 0 18px rgba(220,235,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
};

const setupRow: CSSProperties = {
display: "flex",
alignItems: "center",
gap: 10,
padding: "8px 10px",
borderBottom: "1px solid rgba(255,255,255,0.05)",
};

const stepCircle: CSSProperties = {
width: 32,
height: 32,
minWidth: 32,
borderRadius: "50%",
display: "grid",
placeItems: "center",
border: "1px solid rgba(220,235,255,0.38)",
fontSize: 12,
fontWeight: 950,
};

const stepIcon: CSSProperties = {
width: 32,
height: 32,
minWidth: 32,
borderRadius: 12,
display: "grid",
placeItems: "center",
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(220,235,255,0.12)",
color: "#fff",
};
const stepTitle: CSSProperties = {
display: "block",
color: "#fff",
fontSize: 14,
fontWeight: 900,
marginBottom: 1,
};

const stepText: CSSProperties = {
margin: 0,
color: "rgba(255,255,255,0.58)",
fontSize: 11,
lineHeight: 1.15,
};

const premiumStats: CSSProperties = {
marginTop: 12,
display: "grid",
gridTemplateColumns: "repeat(4, 1fr)",
borderRadius: 18,
overflow: "hidden",
background: "linear-gradient(180deg, rgba(14,18,28,0.92), rgba(3,5,10,0.98))",
border: "1px solid rgba(220,235,255,0.18)",
};

const premiumStat: CSSProperties = {
padding: "10px 4px",
textAlign: "center",
borderRight: "1px solid rgba(255,255,255,0.08)",
display: "flex",
flexDirection: "column",
gap: 2,
color: "white",
fontSize: 11,
};

const aiCta: CSSProperties = {
width: "100%",
marginTop: 14,
border: "1px solid rgba(220,235,255,0.28)",
borderRadius: 999,
padding: "14px 16px",
boxShadow:
"0 0 24px rgba(220,235,255,0.24), 0 0 55px rgba(220,235,255,0.10)",
color: "#05070b",
fontSize: 17,
fontWeight: 950,
};
const liveAdsWrap: CSSProperties = {
marginTop: 20,
};

const liveSectionTop: CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: 12,
};

const sectionPill: CSSProperties = {
padding: "8px 14px",
borderRadius: 999,
background: "rgba(255,255,255,0.06)",
border: "1px solid rgba(255,255,255,0.08)",
color: "white",
fontSize: 12,
fontWeight: 800,
letterSpacing: 1,
};

const liveText: CSSProperties = {
color: "#fff",
fontSize: 14,
fontWeight: 900,
};

const adsScroll: CSSProperties = {
display: "flex",
gap: 14,
overflowX: "auto",
paddingBottom: 4,
};

const adCard: CSSProperties = {
minWidth: 230,
height: 300,
borderRadius: 26,
overflow: "hidden",
position: "relative",
border: "1px solid rgba(255,255,255,0.08)",
background: "#05070b",
boxShadow: "0 0 25px rgba(180,210,255,0.10)",
};

const adImage: CSSProperties = {
width: "100%",
height: "100%",
objectFit: "cover",
};

const adOverlay: CSSProperties = {
position: "absolute",
left: 0,
right: 0,
bottom: 0,
padding: 16,
background:
"linear-gradient(180deg, transparent, rgba(0,0,0,0.88))",
display: "flex",
flexDirection: "column",
color: "white",
};

const miniStatsWrap: CSSProperties = {
marginTop: 20,
display: "grid",
gridTemplateColumns: "1fr 1fr 1fr",
gap: 10,
};

const miniStatBox: CSSProperties = {
borderRadius: 20,
padding: "18px 10px",
background:
"linear-gradient(180deg, rgba(12,16,24,0.92), rgba(3,5,10,0.98))",
border: "1px solid rgba(255,255,255,0.08)",
textAlign: "center",
color: "white",
display: "flex",
flexDirection: "column",
gap: 6,
};
const studioPanel: CSSProperties = {
position: "relative",
zIndex: 2,
marginTop: 18,
padding: 18,
borderRadius: 28,
background:
"linear-gradient(180deg, rgba(13,18,28,0.96), rgba(3,5,10,0.98))",
border: "1px solid rgba(220,235,255,0.14)",
boxShadow:
"0 0 35px rgba(220,235,255,0.10), inset 0 1px 0 rgba(255,255,255,0.08)",
};

const studioTop: CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
gap: 12,
marginBottom: 14,
};

const studioPill: CSSProperties = {
display: "inline-flex",
padding: "7px 11px",
borderRadius: 999,
background: "rgba(255,255,255,0.07)",
border: "1px solid rgba(220,235,255,0.14)",
color: "#fff",
fontSize: 11,
fontWeight: 900,
letterSpacing: 1.2,
marginBottom: 8,
};

const studioTitle: CSSProperties = {
margin: 0,
color: "#fff",
fontSize: 24,
fontWeight: 950,
letterSpacing: -1,
};

const studioText: CSSProperties = {
margin: "8px 0 0",
color: "rgba(255,255,255,0.62)",
fontSize: 14,
lineHeight: 1.4,
};

const studioInput: CSSProperties = {
width: "100%",
height: 92,
borderRadius: 22,
padding: 14,
background: "rgba(255,255,255,0.055)",
border: "1px solid rgba(220,235,255,0.12)",
color: "#fff",
outline: "none",
resize: "none",
fontSize: 15,
};

const studioButtons: CSSProperties = {
display: "grid",
gridTemplateColumns: "1fr 1fr 1fr",
gap: 10,
marginTop: 12,
};

const studioBtn: CSSProperties = {
border: "1px solid rgba(220,235,255,0.18)",
borderRadius: 18,
padding: "13px 8px",
background: "linear-gradient(135deg,#ffffff,#dce6f5)",
color: "#05070b",
fontWeight: 950,
textAlign: "center",
};

const premiumAdsSection: CSSProperties = {
position: "relative",
zIndex: 2,
marginTop: 18,
};

const premiumAdRail: CSSProperties = {
display: "flex",
gap: 12,
overflowX: "auto",
paddingBottom: 6,
};

const premiumAdCard: CSSProperties = {
minWidth: 210,
height: 265,
borderRadius: 26,
overflow: "hidden",
position: "relative",
background: "#05070b",
border: "1px solid rgba(220,235,255,0.12)",
boxShadow: "0 0 28px rgba(220,235,255,0.10)",
};

const premiumAdImage: CSSProperties = {
width: "100%",
height: "100%",
objectFit: "cover",
};

const premiumAdOverlay: CSSProperties = {
position: "absolute",
left: 0,
right: 0,
bottom: 0,
padding: 14,
background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.92))",
display: "flex",
flexDirection: "column",
gap: 4,
color: "#fff",
};

const assistantPanel: CSSProperties = {
position: "relative",
zIndex: 2,
marginTop: 18,
padding: 18,
borderRadius: 28,
background:
"linear-gradient(180deg, rgba(13,18,28,0.96), rgba(3,5,10,0.98))",
border: "1px solid rgba(220,235,255,0.14)",
boxShadow: "0 0 35px rgba(220,235,255,0.10)",
};

const assistantMessages: CSSProperties = {
display: "flex",
flexDirection: "column",
gap: 10,
};

const assistantBubble: CSSProperties = {
maxWidth: "88%",
padding: 13,
borderRadius: 18,
background: "rgba(255,255,255,0.07)",
border: "1px solid rgba(220,235,255,0.10)",
color: "#fff",
fontSize: 14,
lineHeight: 1.4,
};

const assistantInputRow: CSSProperties = {
marginTop: 12,
display: "flex",
gap: 10,
padding: 8,
borderRadius: 999,
background: "rgba(255,255,255,0.055)",
border: "1px solid rgba(220,235,255,0.12)",
};

const assistantInput: CSSProperties = {
flex: 1,
border: "none",
outline: "none",
background: "transparent",
color: "#fff",
padding: "9px 8px",
};

const assistantSend: CSSProperties = {
width: 42,
height: 42,
borderRadius: "50%",
border: "none",
background: "linear-gradient(135deg,#ffffff,#dce6f5)",
color: "#05070b",
fontWeight: 950,
fontSize: 22,
};
const studioPreview: CSSProperties = {
marginTop: 14,
borderRadius: 24,
overflow: "hidden",
border: "1px solid rgba(220,235,255,0.14)",
background: "#05070b",
boxShadow: "0 0 28px rgba(220,235,255,0.10)",
};

const studioPreviewImg: CSSProperties = {
width: "100%",
display: "block",
objectFit: "cover",
};

const studioPreviewBtn: CSSProperties = {
width: "100%",
border: "none",
padding: "14px 16px",
background: "linear-gradient(135deg,#ffffff,#dce6f5)",
color: "#05070b",
fontWeight: 950,
fontSize: 16,
};
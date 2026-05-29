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
const [generating, setGenerating] = useState(false);
const [chatInput, setChatInput] = useState("");
const [prompt, setPrompt] = useState("");
const [businessName, setBusinessName] = useState("");
const [businessTheme, setBusinessTheme] = useState("default");
const [image, setImage] = useState<string | null>(null);
const [loadingImage, setLoadingImage] = useState(false);
const [isPro, setIsPro] = useState(false);
const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

useEffect(() => {
const handler = (e: any) => {
e.preventDefault();
setDeferredPrompt(e);
};

window.addEventListener("beforeinstallprompt", handler);

return () =>
window.removeEventListener("beforeinstallprompt", handler);
}, []);

async function installApp() {
if (!deferredPrompt) {
alert("On iPhone press Share → Add to Home Screen");
return;
}

deferredPrompt.prompt();
await deferredPrompt.userChoice;
}
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
    setGenerating(true);
if (!isPro && credits <= 0) {
alert("No credits left");
setGenerating(false);
return;
}

if (!prompt.trim()) {
alert("Enter prompt");
setGenerating(false);
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
console.log("generate-image response", res.status);
const data = await res.json();

const imageUrl =
data.image || data.url || data.image_url || data.output?.[0];

if (imageUrl) setImage(imageUrl);
return;
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
} catch (err) {
console.error(err);
alert(String(err));
} finally {
setLoadingImage(false);
setGenerating(false);
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
alert("Posted to feed");
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
0%, 100% { box-shadow: 0 0 24px rgba(rgba(220,235,255,0,22),0.25); }
50% { box-shadow: 0 0 48px rgba(rgba(220,235,255,0,22),0.55); }
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

.auto-rail {
display: flex !important;
flex-direction: row !important;
flex-wrap: nowrap !important;
align-items: stretch;
gap: 14px;
width: max-content;
animation: railMove 18s linear infinite;
}

.auto-rail > div {
min-width: 210px;
flex-shrink: 0;
}

@keyframes autoSlideAds {
0% {
transform: translateX(0);
}

100% {
transform: translateX(-320px);
}
}


@keyframes railMove {
from {
transform: translateX(0);
}
to {
transform: translateX(-50%);
}
}

@keyframes phoneFloat {
0%, 100% {
transform: rotate(7deg) translateY(0);
}
50% {
transform: rotate(7deg) translateY(-10px);
}
}

@keyframes waveMove {
0%, 100% {
transform: scaleY(0.45);
opacity: 0.55;
}
50% {
transform: scaleY(1.25);
opacity: 1;
}
}

@keyframes pulseDot {
0%, 100% {
transform: scale(1);
opacity: 1;
}
50% {
transform: scale(1.5);
opacity: 0.6;
}
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

<div style={realPhone}>
<div style={phoneGlassGlow} />
<div style={phoneNotch} />

<div style={phoneScreenInner}>
<div style={phoneStatusRow}>
<span style={phoneLiveText}>LIVE</span>
<span style={phoneGreenDot} />
</div>

<div style={callerCircle}>
<span>AI</span>
</div>

<div style={callTitle}>AdForge</div>
<div style={callSub}>Answering customer call</div>

<div style={realWaveWrap}>
<span style={{ ...realWaveBar, height: 10, animationDelay: "0s" }} />
<span style={{ ...realWaveBar, height: 22, animationDelay: "0.1s" }} />
<span style={{ ...realWaveBar, height: 14, animationDelay: "0.2s" }} />
<span style={{ ...realWaveBar, height: 30, animationDelay: "0.3s" }} />
<span style={{ ...realWaveBar, height: 18, animationDelay: "0.4s" }} />
<span style={{ ...realWaveBar, height: 24, animationDelay: "0.5s" }} />
</div>

<div style={callTimer}>00:18</div>

<div style={miniLeadCard}>
<b>Customer enquiry</b>
<span>Tyre replacement</span>
</div>

<div style={miniLeadInfo}>
<span>Lead captured</span>
<span>Liverpool, UK</span>
</div>

<div style={callActions}>
<div style={callButton}>×</div>
<div style={callButtonGreen}>✓</div>
</div>
</div>
</div>

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
 
<div
style={{
overflow: "hidden",
width: "100%",
display: "flex",
flexDirection: "row",
flexWrap: "nowrap",
}}
>
<div
ref={(el) => {
if (!el || (el as any).dataset.started === "true") return;

(el as any).dataset.started = "true";

let x = 0;

const move = () => {
x += 0.5;
el.scrollLeft = x;

if (x >= el.scrollWidth - el.clientWidth) {
x = 0;
el.scrollLeft = 0;
}

requestAnimationFrame(move);
};

requestAnimationFrame(move);
}}
style={{
display: "flex",
flexDirection: "row",
flexWrap: "nowrap",
gap: 14,
overflowX: "hidden",
width: "max-content",
}}
>
{[
"/videos/video-3.mp4",
"/videos/video-4.mp4",
"/videos/video-1.mp4",
"/videos/video-2.mp4",
].map((src, i) => (
<div key={i} style={{ ...premiumAdCard, flex: "0 0 210px" }}>
<video
src={src}
autoPlay
muted
loop
playsInline
style={premiumAdImage}
>
</video>

<div style={premiumAdOverlay}>
<b>
{i === 0
? "Tyre Replacement"
: i === 1
? "Mobile Fitting"
: "Business Promo"}
</b>

<span>Generated by AdForge AI</span>
</div>
</div>
))}
</div>
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


<section style={premiumStudio}>
<div style={studioTopRow}>


<div style={studioVisual}>
<div style={visualCard}>T</div>
<div style={visualImageBox}>
<div style={visualMountain} />
<div style={visualSun} />
</div>
<div style={visualPlay}>▶</div>
</div>
</div>






<div style={studioCards}>
{/* BIG VIDEO HERO */}
<div style={createPanel}>
<div style={createHeader}>
<div>
<span style={studioTag}>CREATE AD</span>
<h2 style={createTitle}>What are we making?</h2>
</div>
</div>

<textarea
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Describe your offer, business or promotion..."
style={studioInput}
/>

<div style={miniPreview}>
{image ? (
<img src={image} alt="Generated advert" style={miniPreviewMedia} />
) : (
<video
src="/videos/ad-video.mp4"
autoPlay
muted
loop
playsInline
style={miniPreviewMedia}
/>
)}
</div>

<button
onClick={async () => {
if (image) {
await useThisAd();
setImage(null);
} else {
generateAd();
}
}}
disabled={generating}
style={createBtn}
>
{image ? "Share To Feed" : generating ? "Generating..." : "Generate Ad →"}
</button>
</div>

<div style={fullHero}>
{image ? (
<img src={image} alt="Generated advert" style={fullHeroMedia} />
) : (
<video
src="/videos/ad-video.mp4"
autoPlay
muted
loop
playsInline
style={fullHeroMedia}
/>
)}

<div style={fullHeroOverlay}>
<span style={studioTag}>CREATE AD</span>

<h2 style={fullHeroTitle}>
Create AI ads
<br />
that convert
</h2>

<textarea
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Describe your offer, business or promotion..."
style={fullHeroInput}
/>

<button
onClick={async () => {
if (image) {
await useThisAd();
setImage(null);
} else {
generateAd();
}
}}
disabled={generating}
style={fullHeroButton}
>
{image ? "Share To Feed" : generating ? "Generating..." : "Create Now"}
</button>
</div>
</div>

{/* UPGRADE PHOTO */}
<button
type="button"
onClick={() => router.push("/upgrade-photo")}
style={studioMediaCard}
>
<div
style={{
...studioMediaImage,
backgroundImage: "url('/images/upgrade-photo1.jpg')",
}}
/>
<div style={studioMediaBottom}>
<div>
<b style={studioMediaTitle}>Upgrade Photo</b>
<small style={studioMediaText}>Turn photos into premium AI ads</small>
</div>
<span style={studioCircleArrow}>›</span>
</div>
</button>

{/* AI VIDEO */}
<button
type="button"
onClick={() => router.push("/video")}
style={studioMediaCard}
>
<div
style={{
...studioMediaImage,
backgroundImage: "url('/images/upgrade-photo2.jpg')",
}}
>
<span style={playBubble}>▶</span>
</div>

<div style={studioMediaBottom}>
<div>
<b style={studioMediaTitle}>AI Video</b>
<small style={studioMediaText}>Create scroll stopping videos</small>
</div>
<span style={studioCircleArrow}>›</span>
</div>
</button>

{/* UPLOAD STRIP */}
<label style={studioUploadStrip}>
<div>
<b style={studioUploadTitle}>Upload Media</b>
<small style={studioUploadText}>
Upload images & videos to generate content
</small>
</div>

<span style={studioUploadBtn}>Upload →</span>

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

<div
ref={(el) => {
if (!el || (el as any).dataset.started === "true") return;

(el as any).dataset.started = "true";

let x = 0;

const move = () => {
x += 0.45;
el.scrollLeft = x;

if (x >= el.scrollWidth - el.clientWidth) {
x = 0;
el.scrollLeft = 0;
}

requestAnimationFrame(move);
};

requestAnimationFrame(move);
}}
style={premiumAdRail}
>
{recentPosts.slice(0, 6).map((post, i) => (
<div
key={i}
style={{
...premiumAdCard,
flex: "0 0 210px",
minWidth: 210,
maxWidth: 210,
}}
>
{post.video_url ? (
<video
src={post.video_url}
style={premiumAdImage}
autoPlay
muted
loop
playsInline
/>
) : post.image_url ? (
<img
src={post.image_url}
style={premiumAdImage}
/>
) : (
<div
style={{
...premiumAdImage,
display: "flex",
alignItems: "center",
justifyContent: "center",
background: "linear-gradient(135deg, #111827, #020617)",
color: "#fff",
fontWeight: 900,
fontSize: 18,
}}
>
No Media
</div>
)}

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
flexDirection: "row",
flexWrap: "nowrap",
overflowX: "auto",
overflowY: "hidden",
gap: 14,
width: "100%",
paddingBottom: 6,
scrollBehavior: "smooth",
WebkitOverflowScrolling: "touch",
};

const autoRail: CSSProperties = {
display: "flex",
flexDirection: "row",
gap: 14,
width: "max-content",
animation: "scrollAds 25s linear infinite",
};

const adCard: CSSProperties = {
position: "relative",
flex: "0 0 180px",
width: 180,
height: 260,
borderRadius: 28,
overflow: "hidden",
background: "#050816",
border: "1px solid rgba(255,255,255,0.08)",
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



const installBtn: React.CSSProperties = {
height: 35,
width: "100%",
borderRadius: 15,
border: "1px solid rgba(255,255,255,0.18)",
background:
"linear-gradient(135deg, rgba(255,255,255,0.95), rgba(210,220,255,0.88))",
color: "#05070d",
fontSize: 15,
fontWeight: 900,
padding: "0 18px",
cursor: "pointer",
boxShadow:
"0 0 10px rgba(255,255,255,0.6), 0 0 40px rgba(180,210,255,0.35)",
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
flexDirection: "row",
flexWrap: "nowrap",
gap: 14,
overflowX: "hidden",
width: "100%",
scrollBehavior: "smooth",
};

const premiumAdCard: CSSProperties = {
width: 210,
flex: "0 0 210px",
minWidth: 210,
maxWidth: 210,
height: 265,
borderRadius: 26,
overflow: "hidden",
position: "relative",
background: "#05070b",
border: "1px solid rgba(220,235,255,0.12)",
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


const premiumPhone: CSSProperties = {
position: "absolute",
right: 24,
top: 125,
width: 135,
height: 145,
borderRadius: 32,
background:
"linear-gradient(160deg, rgba(255,255,255,0.16), rgba(5,10,22,0.96) 45%, rgba(0,0,0,1))",
border: "1px solid rgba(255,255,255,0.18)",
boxShadow:
"0 25px 70px rgba(0,0,0,0.75), 0 0 45px rgba(125,170,255,0.28), inset 0 1px 0 rgba(255,255,255,0.25)",
transform: "rotate(7deg)",
padding: 16,
overflow: "hidden",
zIndex: 3,
animation: "phoneFloat 4s ease-in-out infinite",
};

const phoneGlow: CSSProperties = {
position: "absolute",
inset: -30,
background:
"radial-gradient(circle at 50% 25%, rgba(170,205,255,0.45), transparent 45%)",
filter: "blur(14px)",
opacity: 0.75,
};

const phoneTop: CSSProperties = {
position: "relative",
display: "flex",
justifyContent: "space-between",
alignItems: "center",
zIndex: 2,
};

const phoneBrand: CSSProperties = {
fontSize: 22,
fontWeight: 900,
color: "white",
letterSpacing: -0.6,
};

const liveDot: CSSProperties = {
width: 9,
height: 9,
borderRadius: "50%",
background: "#ffffff",
boxShadow: "0 0 18px rgba(rgba(220,235,255,0,22),0.9)",
animation: "pulseDot 1.5s ease-in-out infinite",
};

const phoneWaveWrap: CSSProperties = {
position: "relative",
zIndex: 2,
marginTop: 28,
height: 42,
display: "flex",
alignItems: "center",
justifyContent: "center",
gap: 7,
};

const waveBar: CSSProperties = {
width: 7,
borderRadius: 999,
background: "linear-gradient(180deg, #ffffff, #9fb8ff)",
boxShadow: "0 0 16px rgba(160,190,255,0.8)",
animation: "waveMove 1s ease-in-out infinite",
};

const phoneText: CSSProperties = {
position: "relative",
zIndex: 2,
marginTop: 16,
fontSize: 15,
fontWeight: 800,
color: "rgba(255,255,255,0.92)",
lineHeight: 1.15,
};








const phoneTime: CSSProperties = {
letterSpacing: 1,
};

const phoneSignal: CSSProperties = {
color: "#ffffff",
textShadow: "0 0 12px rgba(rgba(220,235,255,0,22),1)",
animation: "pulseDot 1.5s ease-in-out infinite",
};
const realPhone: CSSProperties = {
position: "absolute",
right: 35,
top: 70,
width: 88,
height: 150,
borderRadius: 30,
padding: 5,
background:
"linear-gradient(145deg, rgba(255,255,255,0.45), rgba(35,42,62,0.95) 20%, rgba(0,0,0,1) 78%)",
border: "1px solid rgba(255,255,255,0.3)",
boxShadow:
"0 24px 55px rgba(0,0,0,0.75), 0 0 34px rgba(130,170,255,0.25), inset 0 1px 0 rgba(255,255,255,0.35)",
transform: "rotate(4deg)",
zIndex: 5,
overflow: "hidden",
animation: "phoneFloat 4s ease-in-out infinite",
};

const phoneGlassGlow: CSSProperties = {
position: "absolute",
inset: -18,
background:
"radial-gradient(circle at 45% 20%, rgba(207,220,255,0.45), transparent 42%), radial-gradient(circle at 80% 88%, rgba(rgba(220,235,255,0,22),0.3), transparent 45%)",
filter: "blur(13px)",
opacity: 0.85,
};

const phoneNotch: CSSProperties = {
position: "absolute",
top: 8,
left: "50%",
transform: "translateX(-50%)",
width: 36,
height: 8,
borderRadius: 999,
background: "rgba(0,0,0,0.88)",
zIndex: 4,
};

const phoneScreenInner: CSSProperties = {
position: "relative",
width: "100%",
height: "100%",
borderRadius: 25,
overflow: "hidden",
background:
"radial-gradient(circle at 50% 8%, rgba(207,220,255,0.24), transparent 35%), linear-gradient(180deg, rgba(15,24,46,0.98), rgba(2,5,13,1))",
border: "1px solid rgba(255,255,255,0.12)",
padding: "20px 8px 9px",
boxSizing: "border-box",
};

const phoneStatusRow: CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
};

const phoneLiveText: CSSProperties = {
fontSize: 7,
fontWeight: 900,
letterSpacing: 1,
color: "rgba(255,255,255,0.72)",
};

const phoneGreenDot: CSSProperties = {
width: 5,
height: 5,
borderRadius: "50%",
background: "#ffffff",
boxShadow: "0 0 12px rgba(rgba(220,235,255,0,22),1)",
animation: "pulseDot 1.5s ease-in-out infinite",
};

const callerCircle: CSSProperties = {
width: 34,
height: 34,
borderRadius: "50%",
margin: "10px auto 6px",
display: "flex",
alignItems: "center",
justifyContent: "center",
background:
"linear-gradient(180deg, rgba(255,255,255,0.96), rgba(207,220,255,0.72))",
color: "#050814",
fontSize: 13,
fontWeight: 1000,
boxShadow: "0 0 22px rgba(207,220,255,0.38)",
};

const callTitle: CSSProperties = {
textAlign: "center",
fontSize: 15,
fontWeight: 1000,
color: "white",
letterSpacing: -0.4,
};

const callSub: CSSProperties = {
textAlign: "center",
marginTop: 2,
fontSize: 7.5,
lineHeight: 1.1,
color: "rgba(255,255,255,0.62)",
fontWeight: 700,
};

const realWaveWrap: CSSProperties = {
margin: "9px auto 4px",
height: 27,
display: "flex",
justifyContent: "center",
alignItems: "center",
gap: 3,
};

const realWaveBar: CSSProperties = {
width: 3,
borderRadius: 999,
background: "linear-gradient(180deg, #ffffff, #cfdcff, #ffffff)",
boxShadow: "0 0 10px rgba(207,220,255,0.75)",
animation: "waveMove 1s ease-in-out infinite",
};

const callTimer: CSSProperties = {
textAlign: "center",
fontSize: 7,
fontWeight: 900,
color: "rgba(255,255,255,0.55)",
letterSpacing: 1,
};

const miniLeadCard: CSSProperties = {
marginTop: 6,
padding: "5px 6px",
borderRadius: 9,
background: "rgba(255,255,255,0.07)",
border: "1px solid rgba(255,255,255,0.08)",
display: "flex",
flexDirection: "column",
gap: 1,
fontSize: 6.5,
color: "rgba(255,255,255,0.78)",
};

const miniLeadInfo: CSSProperties = {
marginTop: 4,
display: "flex",
flexDirection: "column",
gap: 1,
fontSize: 6,
color: "rgba(207,220,255,0.68)",
};

const callActions: CSSProperties = {
position: "absolute",
left: 9,
right: 9,
bottom: 8,
display: "flex",
justifyContent: "space-between",
};

const callButton: CSSProperties = {
width: 24,
height: 24,
borderRadius: "50%",
display: "flex",
alignItems: "center",
justifyContent: "center",
background: "rgba(255,255,255,0.12)",
color: "white",
fontSize: 13,
fontWeight: 900,
border: "1px solid rgba(255,255,255,0.12)",
};

const callButtonGreen: CSSProperties = {
...callButton,
background: "linear-gradient(180deg, #ffffff, #0fb85b)",
color: "#041008",
boxShadow: "0 0 18px rgba(rgba(220,235,255,0,22),0.65)",
};

const premiumStudio: React.CSSProperties = {
position: "relative",
overflow: "hidden",
borderRadius: 24,
padding: 14,
marginTop: 5,
background:
"radial-gradient(circle at 85% 10%, rgba(80,90,255,0.16), transparent 38%), linear-gradient(180deg, #05070d 0%, #020305 100%)",
border: "1px solid rgba(255,255,255,0.08)",
boxShadow:
"0 0 18px rgba(80,90,255,0.12)",

};

const studioTopRow: React.CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: 10,
};

const studioPill: React.CSSProperties = {
display: "inline-flex",
padding: "9px 14px",
borderRadius: 999,
border: "1px solid rgba(220,235,255,0.24)",
color: "white",
fontSize: 12,
fontWeight: 950,
letterSpacing: 3,
background: "rgba(255,255,255,0.06)",
boxShadow: "0 0 22px rgba(220,235,255,0.18)",
};

const studioMiniPill: React.CSSProperties = {
fontSize: 12,
color: "rgba(255,255,255,0.58)",
fontWeight: 800,
};

const studioHeroRow: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "1.15fr 0.85fr",
gap: 5,
alignItems: "center",
};



const studioAccent: React.CSSProperties = {
color: "#b8c7ff",
textShadow: "0 0 22px rgba(180,200,255,0.55)",
};


const studioVisual: React.CSSProperties = {
position: "relative",
display: "none",
};

const visualImageBox: React.CSSProperties = {
position: "absolute",
right: 12,
top: 12,
width: 118,
height: 92,
borderRadius: 22,
background: "linear-gradient(145deg, rgba(170,180,255,0.38), rgba(60,70,120,0.18))",
border: "1px solid rgba(220,235,255,0.26)",
boxShadow: "0 0 38px rgba(160,170,255,0.32)",
};

const visualMountain: React.CSSProperties = {
position: "absolute",
left: 20,
bottom: 20,
width: 68,
height: 42,
background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(160,170,255,0.45))",
clipPath: "polygon(0 100%, 42% 25%, 65% 62%, 82% 38%, 100% 100%)",
};

const visualSun: React.CSSProperties = {
position: "absolute",
right: 22,
top: 22,
width: 18,
height: 18,
borderRadius: "50%",
background: "white",
boxShadow: "0 0 20px rgba(255,255,255,0.75)",
};

const visualCard: React.CSSProperties = {
position: "absolute",
left: 8,
top: 18,
width: 42,
height: 42,
borderRadius: 12,
display: "grid",
placeItems: "center",
fontWeight: 950,
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(220,235,255,0.22)",
};

const visualPlay: React.CSSProperties = {
position: "absolute",
right: 0,
top: 56,
width: 48,
height: 48,
borderRadius: 15,
display: "grid",
placeItems: "center",
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(220,235,255,0.22)",
};

const studioInputWrap: React.CSSProperties = {
position: "relative",
marginTop: 20,
};

const studioInput: React.CSSProperties = {
width: "100%",
minHeight: 130,
resize: "none",
boxSizing: "border-box",
borderRadius: 24,
padding: "20px 20px 58px",
background: "rgba(5,8,16,0.82)",
border: "1px solid rgba(220,235,255,0.22)",
color: "white",
fontSize: 16,
outline: "none",
boxShadow: "inset 0 0 30px rgba(255,255,255,0.035)",
};



const studioCards: CSSProperties = {
display: "flex",
flexDirection: "column",
gap: 14,
marginTop: 0,
};

const toolCard: React.CSSProperties = {
minHeight: 52,
borderRadius: 22,
padding: 6,
background:
"linear-gradient(145deg, rgba(255,255,255,0.08), rgba(4,7,18,0.96))",
border: "1px solid rgba(220,235,255,0.20)",
color: "white",
display: "flex",
flexDirection: "column",
alignItems: "center",
justifyContent: "center",
gap: 6,
textAlign: "center",
boxShadow:
"inset 0 1px 0 rgba(255,255,255,0.18), 0 10px 28px rgba(0,0,0,0.45)",
};

const toolCardActive: React.CSSProperties = {
...toolCard,
border: "1px solid rgba(220,235,255,0.48)",
boxShadow:
"0 0 4px rgba(255,255,255,0.75), 0 0 28px rgba(220,235,255,0.28), 0 0 55px rgba(120,160,255,0.18)",
};

const toolIcon: React.CSSProperties = {
fontSize: 26,
color: "#dfe8ff",
};

const toolArrow: React.CSSProperties = {
width: 28,
height: 28,
borderRadius: "50%",
display: "grid",
placeItems: "center",
marginTop: 4,
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(220,235,255,0.20)",
fontSize: 24,
};








const studioHeroVideo: React.CSSProperties = {
position: "absolute",
left: 0,
right: 0,
top: 115,
width: "100%",
height: 435,
objectFit: "cover",
borderRadius: 0,
zIndex: 1,
filter: "brightness(1.05) contrast(1.04)",
};





const studioHeroCard: React.CSSProperties = {
position: "relative",
overflow: "hidden",
width: "100%",
minHeight: 650,
borderRadius: 34,
border: "1px solid rgba(255,255,255,0.12)",
background: "#05070b",
boxShadow: "0 18px 60px rgba(0,0,0,0.65)",
};

const studioHeroShade: React.CSSProperties = {
position: "absolute",
inset: 0,
background: "transparent",
zIndex: 2,
pointerEvents: "none",
};

const studioHeroBtn: React.CSSProperties = {
position: "absolute",
left: 24,
right: 24,
bottom: 24,
height: 52,
borderRadius: 999,
background: "linear-gradient(180deg,#ffffff,#dfe4ec)",
color: "#05070b",
fontWeight: 950,
fontSize: 16,
display: "flex",
alignItems: "center",
justifyContent: "center",
boxShadow: "0 0 22px rgba(255,255,255,0.24)",
};

const studioTag: React.CSSProperties = {
color: "rgba(255,255,255,0.72)",
fontSize: 13,
fontWeight: 900,
letterSpacing: 4,
};



const studioHeroContent: React.CSSProperties = {
position: "absolute",
top: 20,
left: 22,
right: 22,
zIndex: 4,
};





const studioHeroTitle: React.CSSProperties = {
margin: "8px 0 0",
color: "#fff",
fontSize: 30,
lineHeight: 1,
fontWeight: 900,
};

const studioHeroText: React.CSSProperties = {
marginTop: 12,
color: "rgba(255,255,255,0.72)",
fontSize: 18,
maxWidth: 320,
};











const studioMediaCard: React.CSSProperties = {
border: "1px solid rgba(255,255,255,0.12)",
background: "rgba(5,7,18,0.94)",
borderRadius: 26,
padding: 10,
color: "white",
textAlign: "left",
overflow: "hidden",
boxShadow: "0 18px 42px rgba(0,0,0,0.38)",
};

const studioMediaImage: React.CSSProperties = {
width: "100%",
height: 120,
borderRadius: 18,
backgroundSize: "cover",
backgroundPosition: "center",
position: "relative",
marginBottom: 14,
};

const studioMediaBottom: React.CSSProperties = {
display: "flex",
alignItems: "center",
justifyContent: "space-between",
gap: 10,
padding: "0 2px 4px",
};

const studioMediaTitle: React.CSSProperties = {
display: "block",
fontSize: 24,
fontWeight: 950,
letterSpacing: -1,
};

const studioMediaText: React.CSSProperties = {
display: "block",
color: "rgba(255,255,255,0.62)",
fontSize: 12,
marginTop: 6,
};

const studioCircleArrow: React.CSSProperties = {
width: 38,
height: 38,
borderRadius: 999,
background: "rgba(255,255,255,0.08)",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontSize: 30,
flexShrink: 0,
};

const playBubble: React.CSSProperties = {
position: "absolute",
inset: 0,
margin: "auto",
width: 54,
height: 54,
borderRadius: 999,
background: "rgba(0,0,0,0.45)",
display: "flex",
alignItems: "center",
justifyContent: "center",
color: "white",
fontSize: 22,
};

const studioUploadStrip: React.CSSProperties = {
gridColumn: "1 / span 2",
borderRadius: 26,
padding: 20,
background:
"linear-gradient(145deg, rgba(18,20,38,0.96), rgba(5,7,18,0.98))",
border: "1px solid rgba(255,255,255,0.12)",
display: "flex",
alignItems: "center",
justifyContent: "space-between",
gap: 14,
color: "white",
};

const studioUploadTitle: React.CSSProperties = {
display: "block",
fontSize: 26,
fontWeight: 950,
};

const studioUploadText: React.CSSProperties = {
display: "block",
color: "rgba(255,255,255,0.62)",
fontSize: 14,
marginTop: 5,
};

const studioUploadBtn: React.CSSProperties = {
padding: "13px 20px",
borderRadius: 999,
background: "linear-gradient(135deg,#8b5cf6,#6d5cff)",
color: "white",
fontWeight: 900,
flexShrink: 0,
};




const studioSection: CSSProperties = {
padding: "6px 14px 18px",
background: "linear-gradient(180deg,#050814,#07040f)",
};

const aiStudioBox: CSSProperties = {
borderRadius: 20,
padding: 8,
background:
"linear-gradient(180deg,rgba(38,34,82,0.92),rgba(5,8,18,0.98))",
border: "1px solid rgba(255,255,255,0.12)",
boxShadow: "0 0 35px rgba(120,80,255,0.28)",
};

const studioTitle: CSSProperties = {
fontSize: 28,
lineHeight: "32px",
fontWeight: 900,
letterSpacing: "-1.5px",
margin: "10px 0 8px",
maxWidth: 520,
};

const studioText: CSSProperties = {
fontSize: 13,
lineHeight: "22px",
color: "rgba(255,255,255,0.68)",
marginBottom: 14,
maxWidth: 420,
};

const promptBox: CSSProperties = {
height: 30,
borderRadius: 10,
padding: "0 8px",
display: "flex",
alignItems: "center",
justifyContent: "space-between",
gap: 8,
background: "rgba(2,6,16,0.82)",
border: "1px solid rgba(255,255,255,0.12)",
};

const promptInput: CSSProperties = {
flex: 1,
background: "transparent",
border: "none",
outline: "none",
color: "white",
fontSize: 14,
};

const enhanceBtn: CSSProperties = {
border: "1px solid rgba(255,255,255,0.18)",
background: "rgba(255,255,255,0.08)",
color: "white",
marginTop: 0,
borderRadius: 999,
padding: "8px 10px",
fontWeight: 800,
fontSize: 10,
whiteSpace: "nowrap",
};

const bigAdCard: CSSProperties = {
marginTop: 14,
height: 190,
borderRadius: 22,
overflow: "hidden",
position: "relative",
backgroundImage: "url('/studio-car.jpg')",
backgroundSize: "cover",
backgroundPosition: "center",
border: "1px solid rgba(255,255,255,0.13)",
};

const bigAdOverlay: CSSProperties = {
position: "absolute",
inset: 0,
padding: 22,
background:
"linear-gradient(90deg,rgba(0,0,0,0.72),rgba(0,0,0,0.2))",
display: "flex",
flexDirection: "column",
justifyContent: "center",
};

const toolGrid: CSSProperties = {
marginTop: 14,
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: 12,
};

const smallToolCard: CSSProperties = {
height: 150,
borderRadius: 18,
overflow: "hidden",
background: "rgba(5,9,20,0.95)",
border: "1px solid rgba(255,255,255,0.12)",
};

const smallToolImg: CSSProperties = {
width: "100%",
height: 85,
objectFit: "cover",
};

const uploadMediaBox: CSSProperties = {
marginTop: 14,
minHeight: 92,
borderRadius: 20,
padding: 16,
background: "rgba(6,10,22,0.94)",
border: "1px solid rgba(255,255,255,0.12)",
display: "flex",
alignItems: "center",
justifyContent: "space-between",
};

const purpleBtn: CSSProperties = {
background: "linear-gradient(135deg,#8f46ff,#6f4cff)",
color: "white",
border: "none",
borderRadius: 999,
padding: "13px 20px",
fontWeight: 900,
fontSize: 15,
};


const studioHeroFull: React.CSSProperties = {
position: "relative",
overflow: "hidden",
width: "100%",
height: 620,
borderRadius: 34,
background: "#02040a",
border: "1px solid rgba(255,255,255,0.12)",
boxShadow: "0 20px 70px rgba(0,0,0,0.7)",
};

const studioHeroMedia: React.CSSProperties = {
position: "absolute",
inset: 0,
width: "100%",
height: "100%",
objectFit: "cover",
zIndex: 1,
filter: "brightness(0.9) contrast(1.05)",
};

const studioHeroOverlay: React.CSSProperties = {
position: "absolute",
inset: 0,
zIndex: 2,
background:
"linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 42%, rgba(0,0,0,0.75) 100%)",
pointerEvents: "none",
};

const studioHeroTopText: React.CSSProperties = {
position: "absolute",
top: 28,
left: 26,
right: 26,
zIndex: 3,
};

const studioHeroFloatingBtn: React.CSSProperties = {
position: "absolute",
left: 26,
right: 26,
bottom: 26,
height: 56,
borderRadius: 999,
border: "0",
background: "linear-gradient(180deg,#ffffff,#dfe4ec)",
color: "#05070b",
fontWeight: 950,
fontSize: 17,
zIndex: 4,
boxShadow: "0 0 28px rgba(255,255,255,0.28)",
};

const createPanel: React.CSSProperties = {
marginTop: 16,
padding: 18,
borderRadius: 28,
background: "rgba(5,7,12,0.96)",
border: "1px solid rgba(255,255,255,0.12)",
boxShadow: "0 18px 60px rgba(0,0,0,0.6)",
};

const createHeader: React.CSSProperties = {
marginBottom: 14,
};

const createTitle: React.CSSProperties = {
margin: "8px 0 0",
color: "#fff",
fontSize: 30,
lineHeight: 1,
fontWeight: 950,
};

const miniPreview: React.CSSProperties = {
marginTop: 14,
borderRadius: 22,
overflow: "hidden",
height: 220,
background: "#02040a",
};

const miniPreviewMedia: React.CSSProperties = {
width: "100%",
height: "100%",
objectFit: "cover",
display: "block",
};

const createBtn: React.CSSProperties = {
marginTop: 14,
width: "100%",
height: 54,
borderRadius: 999,
border: 0,
background: "linear-gradient(180deg,#ffffff,#dfe4ec)",
color: "#05070b",
fontWeight: 950,
fontSize: 16,
};


const fullHero: React.CSSProperties = {
position: "relative",
width: "100%",
height: 700,
borderRadius: 34,
overflow: "hidden",
marginBottom: 30,
};

const fullHeroMedia: React.CSSProperties = {
position: "absolute",
inset: 0,
width: "100%",
height: "100%",
objectFit: "cover",
};

const fullHeroOverlay: React.CSSProperties = {
position: "absolute",
inset: 0,
display: "flex",
flexDirection: "column",
justifyContent: "space-between",
padding: 28,
background:
"linear-gradient(to top, rgba(0,0,0,.82), rgba(0,0,0,.15), rgba(0,0,0,.55))",
};

const fullHeroTitle: React.CSSProperties = {
color: "#fff",
fontSize: 52,
fontWeight: 900,
lineHeight: 1,
marginTop: 12,
marginBottom: 20,
};

const fullHeroInput: React.CSSProperties = {
width: "100%",
minHeight: 120,
borderRadius: 24,
border: "1px solid rgba(255,255,255,.12)",
background: "rgba(0,0,0,.55)",
color: "#fff",
padding: 20,
fontSize: 18,
backdropFilter: "blur(12px)",
};

const fullHeroButton: React.CSSProperties = {
width: "100%",
height: 72,
borderRadius: 999,
border: "none",
background: "#fff",
color: "#000",
fontSize: 22,
fontWeight: 900,
cursor: "pointer",
};
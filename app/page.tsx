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
Ad<span style={{ color: "#22ff7f" }}>Forge</span>
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

<div
className="wave-line"
style={{
position: "absolute",
top: 0,
left: 30,
right: 30,
height: 2,
borderRadius: 999,
background:
"linear-gradient(90deg, transparent, #22ff7f, transparent)",
opacity: 0.9,
animation: "borderGlow 4s ease-in-out infinite",
}}
/>

<div style={aiPill}>
<span style={greenDot} />
LIVE AI RECEPTIONIST
</div>

<div style={waveWrap}>
<div className="wave-line" style={waveLine} />
</div>

<h2 style={aiTitle}>
Turn missed calls
<br />
into <span style={{ color: "#22ff7f" }}>booked jobs</span>
</h2>

<p style={aiText}>
Your AI receptionist answers missed calls instantly, speaks to customers naturally,
captures job details, qualifies leads and sends bookings directly to your dashboard,
SMS or WhatsApp in real time.
</p>

<div
style={{
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: 10,
marginTop: 18,
marginBottom: 18,
}}
>
{[
["24/7 Answering", "Never miss inbound calls"],
["Instant Alerts", "SMS + WhatsApp updates"],
["Lead Capture", "Collects customer details"],
["Books Jobs", "Sends leads to dashboard"],
].map(([title, sub]) => (
<div
key={title}
style={{
position: "relative",
overflow: "hidden",
padding: "8px 9px",
borderRadius: 15,
background:
"linear-gradient(145deg, rgba(8,12,10,0.92), rgba(15,25,20,0.88))",
border: "1px solid rgba(34,255,127,0.16)",
boxShadow:
"0 0 0 1px rgba(255,255,255,0.03), 0 10px 30px rgba(0,0,0,0.35)",
backdropFilter: "blur(14px)",
}}
>
<div
style={{
width: 34,
height: 4,
borderRadius: 999,
background: "#22ff7f",
marginBottom: 7,
boxShadow: "0 0 14px rgba(34,255,127,0.8)",
}}
/>

<div
style={{
color: "white",
fontSize: 12,
fontWeight: 900,
marginBottom: 6,
letterSpacing: -0.3,
}}
>
{title}
</div>

<div
style={{
color: "rgba(255,255,255,0.62)",
fontSize: 12,
lineHeight: 1.5,
}}
>
{sub}
</div>
</div>
))}
</div>

<button
className="green-pulse"
style={{
...aiCta,
padding: "16px 22px",
borderRadius: 22,
fontSize: 17,
fontWeight: 900,
letterSpacing: -0.5,
background:
"linear-gradient(135deg,#22ff7f 0%,#12d96b 100%)",
boxShadow:
"0 0 25px rgba(34,255,127,0.45), inset 0 1px 0 rgba(255,255,255,0.25)",
transform: "scale(0.96)",
animation: "pulseGlow 2s ease-in-out infinite",
}}
>
⚡ Launch AI Receptionist
</button>
<div
style={{
display: "grid",
gridTemplateColumns: "repeat(3,1fr)",
gap: 12,
marginTop: 22,
}}
>
{[
["247+", "Calls Answered"],
["81", "Businesses Live"],
["£18k+", "Jobs Booked"],
].map(([num, label]) => (
<div
key={label}
style={{
padding: 16,
borderRadius: 20,
background: "rgba(255,255,255,0.04)",
border: "1px solid rgba(255,255,255,0.08)",
textAlign: "center",
}}
>
<div
style={{
color: "#22ff7f",
fontSize: 24,
fontWeight: 900,
}}
>
{num}
</div>

<div
style={{
color: "rgba(255,255,255,0.7)",
fontSize: 12,
marginTop: 4,
}}
>
{label}
</div>
</div>
))}
</div>
<div style={setupSliderBox}>
<div key={setupSlide} style={setupSlideInner}>
<div style={setupTopRow}>
<span style={setupStep}>
STEP {setupSlides[setupSlide].step}
</span>

<span style={setupTime}>
5 min setup
</span>
</div>

<h3 style={setupTitle}>
{setupSlides[setupSlide].title}
</h3>

<p style={setupText}>
{setupSlides[setupSlide].text}
</p>

<div style={setupDots}>
{setupSlides.map((_, index) => (
<span
key={index}
style={{
...setupDot,
opacity: index === setupSlide ? 1 : 0.25,
width: index === setupSlide ? 24 : 7,
}}
/>
))}
</div>
</div>
</div>
</section>



<section style={heroCard}>
    <video
autoPlay
muted
loop
playsInline
preload="metadata"
style={{
position: "absolute",
inset: 0,
pointerEvents: "none",
transform: "translateZ(0)",
width: "100%",
height: "100%",
objectFit: "cover",
opacity: 0.22,
zIndex: 0,
}}
>
<source src="/videos/15474586_2160_3840_30fps.mp4" type="video/mp4" />
</video>
<div style={heroTop}>
    <div style={{ position: "relative", zIndex: 2 }}></div>
<div>
<div style={heroPill}>AI CREATIVE STUDIO</div>
<h2 style={heroTitle}>Create high-converting ads</h2>
</div>
<div style={liveBadge}>LIVE</div>
</div>

<div style={promptBox}>
<textarea
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Describe your business, offer or service..."
style={promptInput}
/>

<div style={toolRow}>
<button
style={chip}
onClick={() => setPrompt("{businessText.prompt}")}
>
Use Example
</button>

<button
style={chip}
onClick={() => setPrompt(`${prompt} make this advert better`)}
>
Improve Prompt
</button>

<label style={chip}>
Upload Media
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

<button className="green-pulse" style={createBtn} onClick={generateAd}>
{loadingImage ? "Creating..." : "Generate Ad"}
</button>
</div>
</div>
</section>

<section style={showcase}>
<div style={sectionTop}>
<h3 style={sectionTitle}>Recent AI Generated Ads</h3>
<button style={viewBtn} onClick={() => router.push("/feed")}>
View all
</button>
</div>

<div ref={adScrollerRef} style={adScroller} className="ad-scroller">
<div style={adTrack}>
{[...recentPosts, ...recentPosts].map((post, i) => (
<div key={i} style={adPreview}>
<img
src={post.image_url || post.video_url || "/placeholder.png"}
alt="Ad"
style={adImage}
/>

<b style={adTitle}>
{post.content || "AI Generated Ad"}
</b>

<small style={adSub}>
Premium advert template
</small>

<span style={miniGreen}>
READY TO POST
</span>
</div>
))}
</div>
</div>
</section>

{image && (
<section style={generatedCard}>
<div style={sectionTop}>
<b style={{ color: "#22ff7f" }}>Generated Advert</b>
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
<h3 style={sectionTitle}>Quick Actions</h3>

<div style={actionGrid}>
<button style={actionCard} onClick={generateAd}>
    <div style={actionBgGlow} />
<div style={actionBgLines} />


<div
style={{
position: "absolute",
inset: 0,
backgroundImage: "url('/images/quick-2.jpg')",
backgroundSize: "cover",
backgroundPosition: "center",
opacity: 0.22,
zIndex: 0,
pointerEvents: "none",
}}
/>
<span style={actionIcon}>01</span>
<b>Generate Ad</b>
<small>Create viral ads</small>
</button>

<button style={actionCard} onClick={() => router.push("/video")}>
  <div style={actionBgGlow} />
<div style={actionBgLines} />  



<div
style={{
position: "absolute",
inset: 0,
backgroundImage: "url('/images/quick-1.jpg')",
backgroundSize: "cover",
backgroundPosition: "center",
opacity: 0.22,
zIndex: 0,
pointerEvents: "none",
}}
/>
<span style={actionIcon}>02</span>
<b>Create AI Video</b>
<small>Turn ideas into video</small>
</button>

<label style={actionCard}>
    <div style={actionBgGlow} />
<div style={actionBgLines} />

<div
style={{
position: "absolute",
inset: 0,
backgroundImage: "url('/images/quick-3.jpg')",
backgroundSize: "cover",
backgroundPosition: "center",
opacity: 0.22,
zIndex: 0,
pointerEvents: "none",
}}
/>
<span style={actionIcon}>03</span>
<b>Upload Media</b>
<small>Add your own content</small>
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
    <div style={actionBgGlow} />
<div style={actionBgLines} />


<div
style={{
position: "absolute",
inset: 0,
backgroundImage: "url('/images/quick-4.jpg')",
backgroundSize: "cover",
backgroundPosition: "center",
opacity: 0.22,
zIndex: 0,
pointerEvents: "none",
}}
/>
<span style={actionIcon}>04</span>
<b>Live Feed</b>
<small>View campaigns</small>
</button>
</div>
</section>
<section style={testimonialStrip}>
<div style={stars}>★★★★★</div>

<h3 style={testimonialTitle}>
Businesses are booking more jobs with AdForge
</h3>

<p style={testimonialText}>
“The AI receptionist alone has brought in jobs we would’ve missed overnight.”
</p>

<div style={testimonialStats}>
<div style={actionCard}>
<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
<span style={{ fontSize: 12, color: "#22ff7f", fontWeight: 900 }}>
LIVE
</span>

<b
style={{
fontSize: 26,
lineHeight: 1,
letterSpacing: -1,
fontWeight: 950,
}}
>
24/7
</b>

<small
style={{
fontSize: 14,
opacity: 0.72,
lineHeight: 1.4,
}}
>
AI Calls Answered
</small>
</div>
</div>

<div style={actionCard}>
<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
<span style={{ fontSize: 12, color: "#22ff7f", fontWeight: 900 }}>
LIVE
</span>

<b
style={{
fontSize: 26,
lineHeight: 1,
letterSpacing: -1,
fontWeight: 950,
}}
>
24/7
</b>

<small
style={{
fontSize: 14,
opacity: 0.72,
lineHeight: 1.4,
}}
>
AI Calls Answered
</small>
</div>
</div>

<div style={actionCard}>
<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
<span style={{ fontSize: 12, color: "#22ff7f", fontWeight: 900 }}>
LIVE
</span>

<b
style={{
fontSize: 26,
lineHeight: 1,
letterSpacing: -1,
fontWeight: 950,
}}
>
24/7
</b>

<small
style={{
fontSize: 14,
opacity: 0.72,
lineHeight: 1.4,
}}
>
AI Calls Answered
</small>
</div>
</div>
</div>
</section>
<section style={chatBox}>
    <div style={assistantGlow} />

<div style={sectionTop}>
<h3 style={chatTitle}>AI Ad Assistant</h3>
<span style={onlinePill}>Online ●</span>
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
? "linear-gradient(135deg, rgba(90,140,255,0.22), rgba(255,255,255,0.06))"
: "rgba(255,255,255,0.04)",
border:
msg.role === "user"
? "1px solid rgba(140,180,255,0.18)"
: "1px solid rgba(255,255,255,0.06)",

boxShadow:
msg.role === "user"
? "0 0 25px rgba(120,170,255,0.12)"
: "0 0 12px rgba(255,255,255,0.03)",

backdropFilter: "blur(18px)",

color: "#ffffff",
}}
>
{msg.content}
</div>
))}

{chatLoading && <div style={typing}>AI is typing...</div>}
</div>

<div style={chatInputWrap}>
<input
value={chatInput}
onChange={(e) => setChatInput(e.target.value)}
placeholder="Ask AI to improve your advert..."
style={chatInputStyle}
onKeyDown={(e) => {
if (e.key === "Enter") sendChatMessage();
}}
/>

<button style={sendCircle} onClick={sendChatMessage}>
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
backgroundColor: BLACK,
backgroundImage:
"linear-gradient(to bottom, rgba(0,0,0,0.22), rgba(0,0,0,0.48) 58%, #020305 100%), url('/images/hero-bg.jpg')",
backgroundSize: "auto 68vh",
backgroundPosition: "center top",
backgroundRepeat: "no-repeat",
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
padding: "4px 10px",
borderRadius: 22,
background: "rgba(10,12,16,0.78)",
border: `1px solid ${LINE}`,
backdropFilter: "blur(16px)",
boxShadow: `0 0 24px ${GLOW_SOFT}, inset 0 1px 0 rgba(255,255,255,0.08)`,
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
boxShadow: `0 0 18px ${GLOW}, 0 0 42px ${GLOW_SOFT}`,
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

const aiHero: CSSProperties = {
position: "relative",
padding: "0 26px 22px",
boxShadow: "none",
border: "none",
borderRadius: 0,
zIndex: 2,
overflow: "hidden",
marginBottom: 22,
animation: "floatUp 5s ease-in-out infinite",
cursor: "pointer",
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

const aiTitle: CSSProperties = {
fontSize: 46,
lineHeight: 0.95,
fontWeight: 950,
letterSpacing: -2,
marginTop: 16,
marginBottom: 16,
color: WHITE,
maxWidth: 520,
};

const aiText: CSSProperties = {
fontSize: 16,
lineHeight: 1.5,
opacity: 0.78,
maxWidth: 360,
position: "relative",
zIndex: 2,
};

const aiCta: CSSProperties = {
width: "100%",
border: "none",
borderRadius: 22,
padding: "20px 24px",
background: "linear-gradient(135deg,#ffffff,#d9e3f3)",
color: "#05070b",
fontSize: 22,
fontWeight: 900,
marginTop: 26,
marginBottom: 22,
cursor: "pointer",
boxShadow: `0 0 28px ${GLOW}, 0 0 70px ${GLOW_SOFT}`,
transition: "0.25s",
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
border: `1px solid ${LINE_STRONG}`,
boxShadow: `0 0 0 1px rgba(255,255,255,0.08), 0 0 48px ${GLOW_SOFT}`,
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
background: "rgba(255,255,255,0.045)",
border: `1px solid ${LINE}`,
marginBottom: 18,
overflow: "hidden",
boxShadow: `0 0 34px ${GLOW_SOFT}`,
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

const adImage: CSSProperties = {
width: "100%",
height: 112,
objectFit: "cover",
borderRadius: 14,
};

const adPreview: CSSProperties = {
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
background: "rgba(255,255,255,0.05)",
border: `1px solid ${LINE}`,
marginBottom: 18,
};

const testimonialStrip: CSSProperties = {
marginTop: 22,
padding: 22,
position: "relative",
overflow: "hidden",
borderRadius: 28,
background: "linear-gradient(135deg, rgba(255,255,255,0.10), rgba(2,3,6,0.96))",
border: `1px solid ${LINE_STRONG}`,
boxShadow: `0 24px 80px ${GLOW_SOFT}`,
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
background: "linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.025))",
border: `1px solid ${LINE}`,
minHeight: 120,
boxShadow: `0 10px 35px ${GLOW_SOFT}`,
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
background: "linear-gradient(180deg, rgba(12,14,20,0.96) 0%, rgba(2,3,6,0.98) 100%)",
border: `1px solid ${LINE}`,
boxShadow: `0 0 55px ${GLOW_SOFT}, inset 0 1px 0 rgba(255,255,255,0.08)`,
backdropFilter: "blur(28px)",
};

const chatTitle: CSSProperties = {
fontSize: 25,
fontWeight: 950,
margin: 0,
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
background: "linear-gradient(135deg,#ffffff,#d9e3f3)",
color: "#05070b",
fontWeight: 950,
fontSize: 22,
};

const bottomNav: CSSProperties = {
position: "fixed",
left: 24,
right: 24,
height: 78,
bottom: "calc(18px + env(safe-area-inset-bottom))",
background: "rgba(2,3,6,0.96)",
border: `1px solid ${LINE}`,
borderRadius: 34,
display: "flex",
justifyContent: "space-around",
alignItems: "center",
zIndex: 9999,
backdropFilter: "blur(18px)",
boxShadow: `0 0 34px ${GLOW_SOFT}`,
};

const navBtn: CSSProperties = {
border: "none",
background: "transparent",
color: "rgba(255,255,255,0.58)",
fontWeight: 850,
};

const navActive: CSSProperties = {
...navBtn,
color: WHITE,
textShadow: `0 0 16px ${GLOW}`,
};

const plusBtn: CSSProperties = {
width: 66,
height: 66,
borderRadius: "50%",
border: "none",
background: "linear-gradient(135deg,#ffffff,#d9e3f3)",
color: "#05070b",
fontSize: 38,
fontWeight: 950,
boxShadow: `0 0 34px ${GLOW}`,
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
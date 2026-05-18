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
const [businessTheme, setBusinessTheme] = useState("default");
const [image, setImage] = useState<string | null>(null);
const [loadingImage, setLoadingImage] = useState(false);
const [isPro, setIsPro] = useState(false);
const [credits, setCredits] = useState(0);
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
<style jsx global>{`
@keyframes floatUp {
0%, 100% { transform: translateY(0px); }
50% { transform: translateY(-10px); }
}

@keyframes pulseGlow {
0%, 100% { box-shadow: 0 0 24px rgba(34,255,127,0.25); }
50% { box-shadow: 0 0 48px rgba(34,255,127,0.55); }
}

@keyframes slideAds {
0% { transform: translateX(0); }
100% { transform: translateX(-50%); }
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

.ad-track {
animation: slideAds 18s linear infinite;
}

.wave-line {
animation: greenWave 3s ease-in-out infinite;
}
`}</style>

<div style={bgGlow1} />
<div style={bgGlow2} />

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
<section style={testimonialStrip}>
<div>
<div style={stars}>★★★★★</div>
<h3 style={testimonialTitle}>Trusted by local businesses</h3>
<p style={testimonialText}>
“AdForge makes it easy to create ads, videos and capture more leads without hiring an agency.”
</p>
</div>

<div style={testimonialStats}>
<div>
<b>24/7</b>
<span>AI Receptionist</span>
</div>
<div>
<b>AI</b>
<span>Ads & Videos</span>
</div>
<div>
<b>Fast</b>
<span>Lead Capture</span>
</div>
</div>
</section>
<section style={setupMiniWrap}>
<div style={setupMiniBadge}>⚡ SETUP IN 5 MINUTES</div>

<h2 style={setupMiniTitle}>
Get started in minutes.
<br />
<span style={{ color: "#22c55e" }}>Start capturing more jobs.</span>
</h2>

<p style={setupMiniText}>
No complicated setup. No tech skills needed.
<br />
Just 3 simple steps to activate your AI receptionist.
</p>

<div style={setupMiniSteps}>
<div style={setupMiniStep}>
<div style={setupMiniNumber}>1</div>
<div>
<h3>Connect your number</h3>
<p>Forward your calls to your AI receptionist.</p>
</div>
</div>

<div style={setupMiniStep}>
<div style={setupMiniNumber}>2</div>
<div>
<h3>AI learns your business</h3>
<p>Add your services, hours and business info.</p>
</div>
</div>

<div style={setupMiniStep}>
<div style={setupMiniNumber}>3</div>
<div>
<h3>Start receiving leads</h3>
<p>AI captures details and sends job alerts.</p>
</div>
</div>
</div>

<div style={setupMiniBar}>
<span>✨ AI ACTIVATING...</span>
<b>70%</b>
</div>
</section>

<section style={showcase}>
<div style={sectionTop}>
<h3 style={sectionTitle}>Recent AI Generated Ads</h3>
<button style={viewBtn} onClick={() => router.push("/feed")}>
View all
</button>
</div>

<div style={adScroller}>
<div className="ad-track" style={adTrack}>
{["NEW OFFER LIVE", "BOOKINGS OPEN", "LIMITED TIME DEAL", "GET MORE LEADS", "BOOST YOUR BRAND", "READY TO POST"].map(
(title, i) => (
<div key={i} style={adPreview}>
<div style={adMockImage}>
<div style={adGlow} />
<div style={tyreCircle} />
<div style={adRoad} />
</div>
<b>{title}</b>
<small>Premium advert template</small>
<span style={miniGreen}>READY TO POST</span>
</div>
)
)}
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
backgroundImage:
"url('https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=1200&auto=format&fit=crop')",
backgroundSize: "cover",
backgroundPosition: "center",
opacity: 0.28,
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
backgroundImage:
"url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200&auto=format&fit=crop')",
backgroundSize: "cover",
backgroundPosition: "center",
opacity: 0.28,
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
backgroundImage:
"url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop')",
backgroundSize: "cover",
backgroundPosition: "center",
opacity: 0.28,
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
backgroundImage:
"url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop')",
backgroundSize: "cover",
backgroundPosition: "center",
opacity: 0.28,
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
<b style={{ fontSize: 26 }}>24/7</b>
<small>AI Calls Answered</small>
</div>

<div style={actionCard}>
<b style={{ fontSize: 26 }}>+312%</b>
<small>More Leads</small>
</div>

<div style={actionCard}>
<b style={{ fontSize: 26 }}>4.9★</b>
<small>User Rating</small>
</div>
</div>
</section>
<section style={chatBox}>
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
? "linear-gradient(135deg,#16a34a,#22ff7f)"
: "rgba(255,255,255,0.08)",
color: msg.role === "user" ? "#04140c" : "white",
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

const page: CSSProperties = {
minHeight: "100vh",
background:
"radial-gradient(circle at top,#081812 0%,#03100c 35%,#020204 100%)",
color: "white",
padding: "18px 16px 140px",
fontFamily: "Inter, sans-serif",
overflowX: "hidden",
position: "relative",
};

const bgGlow1: CSSProperties = {
position: "fixed",
width: 320,
height: 320,
borderRadius: "50%",
background: "rgba(34,255,127,0.16)",
top: -110,
right: -110,
filter: "blur(90px)",
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
opacity: 0.2,
filter: "brightness(0.65)",
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
letterSpacing: 4,
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
gap: 8,
flexWrap: "wrap",
justifyContent: "flex-start",
maxWidth: "100%",
};

const creditBox: CSSProperties = {
display: "flex",
alignItems: "center",
gap: 8,
padding: "10px 13px",
borderRadius: 18,
background: "rgba(255,255,255,0.06)",
border: "1px solid rgba(34,255,127,0.20)",
backdropFilter: "blur(12px)",
};

const coin: CSSProperties = {
width: 30,
height: 30,
borderRadius: 999,
display: "grid",
placeItems: "center",
background: "linear-gradient(135deg,#22ff7f,#16a34a)",
color: "#04140c",
fontWeight: 950,
};

const small: CSSProperties = {
fontSize: 11,
opacity: 0.65,
};

const greenBtn: CSSProperties = {
background: "#39ff6a",
color: "#000",
border: "none",
borderRadius: 18,
padding: "10px 16px",
fontWeight: 800,
fontSize: 14,
minWidth: 88,
height: 54,
cursor: "pointer",
boxShadow: "0 0 20px rgba(57,255,106,0.35)",
};

const proBadge: CSSProperties = {
...greenBtn,
};

const logoutBtn: CSSProperties = {
position: "absolute",
top: 18,
right: 18,
positionAnchor: "relative",
zIndex: 1,
marginLeft: -20,
border: "1px solid rgba(255,255,255,0.12)",
background: "rgba(0,0,0,0.35)",
color: "white",
borderRadius: 16,
padding: "10px 13px",
fontWeight: 800,
};

const aiHero: CSSProperties = {
position: "relative",
zIndex: 2,
overflow: "hidden",
borderRadius: 30,
padding: 24,
background:
"radial-gradient(circle at top right, rgba(34,255,127,0.18), transparent 30%), linear-gradient(145deg,#061b15,#020604)",
border: "1px solid rgba(34,255,127,0.28)",
boxShadow: "0 25px 70px rgba(0,0,0,0.38)",
marginBottom: 18,
cursor: "pointer",
};

const aiPill: CSSProperties = {
display: "inline-flex",
alignItems: "center",
gap: 8,
padding: "9px 14px",
borderRadius: 999,
background: "rgba(34,255,127,0.08)",
border: "1px solid rgba(34,255,127,0.22)",
color: "#22ff7f",
fontWeight: 900,
fontSize: 12,
position: "relative",
zIndex: 2,
};

const greenDot: CSSProperties = {
width: 8,
height: 8,
borderRadius: "50%",
background: "#22ff7f",
boxShadow: "0 0 12px #22ff7f",
};

const waveWrap: CSSProperties = {
position: "absolute",
right: -20,
top: 120,
width: 260,
height: 70,
overflow: "hidden",
opacity: 0.6,
};

const waveLine: CSSProperties = {
width: 260,
height: 2,
background: "linear-gradient(90deg,transparent,#22ff7f,transparent)",
marginTop: 34,
};

const aiTitle: CSSProperties = {
fontSize: 42,
lineHeight: 0.95,
fontWeight: 950,
margin: "24px 0 14px",
letterSpacing: -2.5,
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

const aiCta: CSSProperties = {
width: "100%",
marginTop: 18,
padding: "16px",
borderRadius: 18,
border: "none",
background: "linear-gradient(135deg,#22ff7f,#16a34a)",
color: "#04140c",
fontWeight: 950,
fontSize: 16,
};

const aiLeadCard: CSSProperties = {
marginTop: 18,
borderRadius: 22,
padding: 16,
background: "rgba(0,0,0,0.35)",
border: "1px solid rgba(34,255,127,0.22)",
position: "relative",
zIndex: 2,
};

const aiLeadTop: CSSProperties = {
display: "flex",
justifyContent: "space-between",
color: "#22ff7f",
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
background: "rgba(34,255,127,0.055)",
border: "1px solid rgba(34,255,127,0.28)",
marginBottom: 18,
};

const statBox: CSSProperties = {
padding: 12,
borderRadius: 18,
background: "rgba(0,0,0,0.28)",
display: "flex",
flexDirection: "column",
gap: 4,
};

const heroCard: CSSProperties = {
position: "relative",
zIndex: 2,
borderRadius: 28,
padding: 18,
background: "linear-gradient(145deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025))",
border: "1px solid rgba(34,255,127,0.18)",
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
background: "rgba(34,255,127,0.10)",
border: "1px solid rgba(34,255,127,0.24)",
color: "#22ff7f",
fontSize: 11,
fontWeight: 950,
letterSpacing: 1.2,
marginBottom: 12,
};

const liveBadge: CSSProperties = {
color: "#22ff7f",
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
background: "rgba(0,0,0,0.30)",
border: "1px solid rgba(255,255,255,0.09)",
};

const promptInput: CSSProperties = {
width: "100%",
height: 86,
background: "transparent",
border: "none",
outline: "none",
color: "white",
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
border: "1px solid rgba(34,255,127,0.18)",
borderRadius: 999,
padding: "10px 14px",
background: "rgba(255,255,255,0.06)",
color: "white",
fontWeight: 800,
};

const createBtn: CSSProperties = {
flex: 1,
minWidth: 135,
height: 52,
borderRadius: 999,
border: "none",
background: "linear-gradient(135deg,#22ff7f,#16a34a)",
color: "#04140c",
fontSize: 15,
fontWeight: 950,
};

const showcase: CSSProperties = {
position: "relative",
zIndex: 2,
borderRadius: 24,
padding: 16,
background: "rgba(255,255,255,0.04)",
border: "1px solid rgba(34,255,127,0.15)",
marginBottom: 18,
overflow: "hidden",
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
color: "#22ff7f",
fontWeight: 900,
};

const adScroller: CSSProperties = {
overflow: "hidden",
};

const adTrack: CSSProperties = {
display: "flex",
gap: 12,
width: "max-content",
};

const adPreview: CSSProperties = {
width: 180,
minHeight: 210,
borderRadius: 20,
padding: 12,
background: "linear-gradient(145deg,#081c16,#030706)",
border: "1px solid rgba(34,255,127,0.22)",
display: "flex",
flexDirection: "column",
gap: 8,
};

const adMockImage: CSSProperties = {
height: 96,
borderRadius: 16,
position: "relative",
overflow: "hidden",
background:
"linear-gradient(135deg, rgba(0,0,0,0.15), rgba(0,0,0,0.75)), radial-gradient(circle at 70% 45%, rgba(34,255,127,0.55), transparent 26%), linear-gradient(135deg,#10251d,#020604)",
};

const tyreCircle: CSSProperties = {
position: "absolute",
width: 72,
height: 72,
borderRadius: "50%",
border: "11px solid rgba(235,245,240,0.88)",
right: 14,
bottom: -18,
boxShadow: "0 0 25px rgba(34,255,127,0.35)",
};

const adGlow: CSSProperties = {
position: "absolute",
width: 120,
height: 70,
borderRadius: 18,
background:
"linear-gradient(135deg, rgba(34,255,127,0.42), rgba(255,255,255,0.06))",
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
background:
"linear-gradient(180deg, transparent, rgba(0,0,0,0.65))",
};
const miniGreen: CSSProperties = {
marginTop: "auto",
color: "#22ff7f",
fontSize: 11,
fontWeight: 950,
};

const generatedCard: CSSProperties = {
position: "relative",
zIndex: 2,
borderRadius: 24,
padding: 16,
background: "rgba(255,255,255,0.05)",
border: "1px solid rgba(34,255,127,0.16)",
marginBottom: 18,
};

const testimonialStrip: CSSProperties = {
marginTop: 22,
padding: 22,
borderRadius: 28,
background: "linear-gradient(135deg, rgba(34,255,127,0.14), rgba(2,6,23,0.95))",
border: "1px solid rgba(34,255,127,0.25)",
boxShadow: "0 24px 80px rgba(34,255,127,0.10)",
};

const stars: CSSProperties = {
color: "#39ff6a",
fontSize: 18,
letterSpacing: 2,
marginBottom: 8,
};

const testimonialTitle: CSSProperties = {
margin: 0,
color: "#fff",
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
borderRadius: 18,
marginTop: 16,
marginBottom: 16,
};

const smallDarkBtn: CSSProperties = {
border: "none",
borderRadius: 14,
padding: "10px 14px",
background: "rgba(255,255,255,0.08)",
color: "white",
fontWeight: 800,
};

const useBtn: CSSProperties = {
width: "100%",
padding: "15px",
border: "none",
borderRadius: 18,
background: "linear-gradient(135deg,#22ff7f,#16a34a)",
color: "#04140c",
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
background:
"linear-gradient(145deg, rgba(7,18,12,0.98), rgba(3,6,5,0.98))",
border: "1px solid rgba(0,255,140,0.18)",
display: "flex",
flexDirection: "column",
justifyContent: "space-between",
color: "white",
minHeight: 190,
boxShadow: "0 0 40px rgba(0,255,140,0.08)",
backdropFilter: "blur(20px)",
};
const actionBgGlow: CSSProperties = {
position: "absolute",
width: 160,
height: 160,
borderRadius: "50%",
background: "rgba(0,255,140,0.12)",
top: -60,
right: -40,
filter: "blur(30px)",
pointerEvents: "none",
};

const actionBgLines: CSSProperties = {
position: "absolute",
inset: 0,
background:
"linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.03) 45%, transparent 100%)",
opacity: 0.5,
pointerEvents: "none",
};
const actionIcon: CSSProperties = {
width: 38,
height: 38,
borderRadius: 12,
display: "grid",
placeItems: "center",
background: "rgba(34,255,127,0.10)",
border: "1px solid rgba(34,255,127,0.22)",
color: "#22ff7f",
fontWeight: 950,
fontSize: 12,
};

const chatBox: CSSProperties = {
position: "relative",
zIndex: 2,
borderRadius: 26,
padding: 18,
background: "linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))",
border: "1px solid rgba(34,255,127,0.16)",
marginBottom: 30,
};

const chatTitle: CSSProperties = {
fontSize: 25,
fontWeight: 950,
margin: 0,
};

const onlinePill: CSSProperties = {
color: "#22ff7f",
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
border: "1px solid rgba(255,255,255,0.09)",
background: "rgba(255,255,255,0.055)",
padding: 8,
};

const chatInputStyle: CSSProperties = {
flex: 1,
border: "none",
background: "transparent",
color: "white",
outline: "none",
padding: "10px 8px",
};

const sendCircle: CSSProperties = {
width: 44,
height: 44,
borderRadius: "50%",
border: "none",
background: "linear-gradient(135deg,#22ff7f,#16a34a)",
color: "#04140c",
fontWeight: 950,
fontSize: 22,
};

const bottomNav: CSSProperties = {
position: "fixed",
left: 0,
right: 0,
bottom: 0,
height: 88,
background: "rgba(2,7,5,0.96)",
borderTop: "1px solid rgba(34,255,127,0.14)",
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
color: "#22ff7f",
};

const plusBtn: CSSProperties = {
width: 66,
height: 66,
borderRadius: "50%",
border: "none",
background: "linear-gradient(135deg,#22ff7f,#16a34a)",
color: "#04140c",
fontSize: 38,
fontWeight: 950,
boxShadow: "0 0 34px rgba(34,255,127,0.42)",
};
const setupMiniWrap: React.CSSProperties = {
marginTop: 28,
padding: 18,
borderRadius: 24,
border: "1px solid rgba(34,197,94,0.25)",
background: "linear-gradient(180deg,#03110a 0%,#020617 100%)",
boxShadow: "0 0 28px rgba(34,255,127,0.1)",
};

const setupMiniBadge: React.CSSProperties = {
display: "inline-flex",
padding: "7px 14px",
borderRadius: 999,
background: "rgba(34,255,127,0.08)",
border: "1px solid rgba(34,255,127,0.22)",
color: "#4ade80",
fontWeight: 900,
fontSize: 12,
marginBottom: 16,
};

const setupMiniTitle: React.CSSProperties = {
fontSize: 34,
lineHeight: 1.06,
fontWeight: 950,
color: "white",
margin: "0 0 12px",
};

const setupMiniText: React.CSSProperties = {
color: "#a1a1aa",
fontSize: 15,
lineHeight: 1.45,
marginBottom: 18,
};

const setupMiniSteps: React.CSSProperties = {
display: "grid",
gap: 10,
};

const setupMiniStep: React.CSSProperties = {
display: "flex",
gap: 14,
alignItems: "center",
padding: 14,
borderRadius: 18,
background: "rgba(255,255,255,0.035)",
border: "1px solid rgba(255,255,255,0.07)",
};

const setupMiniNumber: React.CSSProperties = {
width: 36,
height: 36,
minWidth: 36,
borderRadius: 999,
background: "#22c55e",
color: "black",
fontWeight: 950,
display: "flex",
alignItems: "center",
justifyContent: "center",
};

const setupMiniBar: React.CSSProperties = {
marginTop: 16,
padding: "10px 12px",
borderRadius: 14,
background: "rgba(34,255,127,0.08)",
color: "#22c55e",
fontSize: 12,
fontWeight: 900,
display: "flex",
justifyContent: "space-between",
};
"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

type Business = {
name: string | null;
location: string | null;
};

export default function VideoPage() {
const router = useRouter();

const [prompt, setPrompt] = useState("");
const [videoUrl, setVideoUrl] = useState<string | null>(null);
const [status, setStatus] = useState("");
const [loading, setLoading] = useState(false);
const [sharing, setSharing] = useState(false);
const [error, setError] = useState("");
const [business, setBusiness] = useState<Business | null>(null);

const pollRef = useRef<NodeJS.Timeout | null>(null);

function stopPolling() {
if (pollRef.current) {
clearInterval(pollRef.current);
pollRef.current = null;
}
}

async function loadBusiness() {
const {
data: { user },
} = await supabase.auth.getUser();

const email = user?.email?.toLowerCase().trim();
if (!email) return;

const { data } = await supabase
.from("businesses")
.select("name, location")
.eq("email", email)
.maybeSingle();

if (data) setBusiness(data);
}

async function checkStatus(id: string) {
const res = await fetch(`/api/generate-video?id=${id}`);
const data = await res.json();

setStatus(data.status || "");

if (data.videoUrl) {
setVideoUrl(data.videoUrl);
setLoading(false);
stopPolling();
}

if (data.status === "failed" || data.status === "canceled") {
setError(data.error || "Video failed");
setLoading(false);
stopPolling();
}
}

async function startVideo(type: "normal" | "animate") {
if (!prompt.trim()) {
alert("Enter something");
return;
}

setLoading(true);
setVideoUrl(null);
setError("");
setStatus("starting");

const businessName = business?.name || "Your business";
const businessLocation = business?.location || "your local area";

const betterPrompt =
type === "animate"
? `
Create a realistic video based on an existing image.

Business: ${businessName}
Location: ${businessLocation}
Scene: ${prompt}

Instructions:
- realistic motion
- smooth camera movement
- UK business advert
- NO text generation
- NO distorted logos
- keep original image structure
- cinematic and professional
`
: `
Create a realistic premium advert video.

Business: ${businessName}
Location: ${businessLocation}
Scene: ${prompt}

Important:
- make it look like a real UK business advert
- realistic lighting
- professional camera movement
- no strange text
- no misspelled words
- cinematic, premium, realistic
`;

const {
data: { user },
} = await supabase.auth.getUser();

if (!user) {
alert("Login required");
setLoading(false);
return;
}

const res = await fetch("/api/generate-video", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
prompt: betterPrompt,
user_id: user.id,
}),
});

const data = await res.json();

if (!res.ok) {
setError(data.error || "Failed to start video");
setLoading(false);
return;
}

const id = data.id;
setStatus(data.status || "processing");

await checkStatus(id);

pollRef.current = setInterval(() => {
checkStatus(id);
}, 4000);
}

async function shareToFeed() {
if (!videoUrl) return;

setSharing(true);

const {
data: { user },
} = await supabase.auth.getUser();

if (!user?.id) {
alert("Please log in first");
setSharing(false);
return;
}

const { error } = await supabase.from("posts").insert({
user_id: user.id,
video_url: videoUrl,
image_url: null,
content: prompt,
business_name: business?.name || "Your business",
location: business?.location || "",
});

setSharing(false);

if (error) {
alert(error.message);
return;
}

alert("Posted to feed");
router.push("/feed");
}

useEffect(() => {
loadBusiness();
return () => stopPolling();
}, []);

return (
<main style={page}>
<div style={bgGlow1} />
<div style={bgGlow2} />

<header style={topHeader}>
<div>
<div style={brandLabel}>AI ADVERTISING PLATFORM</div>
<h1 style={logo}>
Ad<span style={{ color: "#FFFFFF" }}>Forge</span>
</h1>
</div>

<button onClick={() => router.push("/feed")} style={backBtn}>
Back
</button>
</header>

<section style={heroCard}>
<div style={pill}>VIDEO AD STUDIO</div>

<h1 style={title}>AI Video Generator</h1>

<p style={subText}>
Create cinematic business adverts and post them directly to your feed.
</p>

<textarea
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Describe the advert you want to create..."
style={textarea}
/>

<div style={buttonRow}>
<button
disabled={loading}
onClick={() => startVideo("normal")}
style={primaryBtn}
>
{loading ? "Rendering..." : "Generate Video"}
</button>

<button
disabled={loading}
onClick={() => startVideo("animate")}
style={secondaryBtn}
>
Animate Image
</button>
</div>

{status && (
<div style={statusBox}>
<span style={pulseDot} />
<span>
{status === "starting" && "Initializing render engine..."}
{status === "processing" && "Creating cinematic advert..."}
{status === "succeeded" && "Render complete"}
{status !== "starting" &&
status !== "processing" &&
status !== "succeeded" &&
status}
</span>
</div>
)}

{error && <div style={errorBox}>{error}</div>}

{videoUrl && (
<div style={videoWrap}>
<video src={videoUrl} controls autoPlay playsInline style={video} />

<button onClick={shareToFeed} style={shareBtn}>
{sharing ? "Sharing..." : "Share to Feed"}
</button>
</div>
)}
</section>

<nav style={bottomNav}>
<button style={navBtn} onClick={() => router.push("/")}>
Home
</button>
<button style={navBtn} onClick={() => router.push("/feed")}>
Feed
</button>
<button style={plusBtn} onClick={() => router.push("/")}>
+
</button>
<button style={navBtn} onClick={() => router.push("/ai-receptionist")}>
AI
</button>
<button style={navBtn} onClick={() => router.push("/profile")}>
Profile
</button>
</nav>
</main>
);
}

const page: React.CSSProperties = {
minHeight: "100vh",
padding: "116px 16px 130px",
color: "white",
background:
"radial-gradient(circle at top,#081812 0%,#03100c 35%,#020204 100%)",
fontFamily: "Inter, Arial, sans-serif",
position: "relative",
overflowX: "hidden",
};

const bgGlow1: React.CSSProperties = {
position: "fixed",
width: 320,
height: 320,
borderRadius: "50%",
background: "rgba(34,255,127,0.14)",
top: -120,
right: -120,
filter: "blur(90px)",
pointerEvents: "none",
};

const bgGlow2: React.CSSProperties = {
position: "fixed",
width: 260,
height: 260,
borderRadius: "50%",
background: "rgba(124,58,237,0.16)",
bottom: 90,
left: -110,
filter: "blur(90px)",
pointerEvents: "none",
};

const topHeader: React.CSSProperties = {
position: "fixed",
top: 18,
left: 18,
right: 18,
zIndex: 30,
display: "flex",
justifyContent: "space-between",
alignItems: "center",
};

const brandLabel: React.CSSProperties = {
fontSize: 10,
letterSpacing: 3,
color: "rgba(255,255,255,0.45)",
fontWeight: 900,
};

const logo: React.CSSProperties = {
margin: 0,
fontSize: 32,
fontWeight: 950,
letterSpacing: -2,
};

const backBtn: React.CSSProperties = {
border: "1px solid rgba(34,255,127,0.25)",
background: "rgba(0,0,0,0.45)",
color: "white",
borderRadius: 18,
padding: "12px 18px",
fontWeight: 900,
backdropFilter: "blur(14px)",
};

const heroCard: React.CSSProperties = {
position: "relative",
zIndex: 2,
maxWidth: 760,
margin: "0 auto",
padding: 26,
borderRadius: 32,
background:
"linear-gradient(145deg, rgba(255,255,255,0.065), rgba(255,255,255,0.025))",
border: "1px solid rgba(34,255,127,0.20)",
boxShadow: "0 25px 70px rgba(0,0,0,0.38)",
};

const pill: React.CSSProperties = {
display: "inline-flex",
padding: "8px 12px",
borderRadius: 999,
background: "rgba(34,255,127,0.08)",
border: "1px solid rgba(34,255,127,0.22)",
color: "#FFFFFF",
fontWeight: 950,
fontSize: 11,
letterSpacing: 1.6,
marginBottom: 18,
};

const title: React.CSSProperties = {
margin: 0,
fontSize: 46,
lineHeight: 0.95,
fontWeight: 950,
letterSpacing: -2,
};

const subText: React.CSSProperties = {
marginTop: 16,
marginBottom: 22,
color: "rgba(255,255,255,0.68)",
fontSize: 18,
fontWeight: 750,
lineHeight: 1.35,
};

const textarea: React.CSSProperties = {
width: "100%",
minHeight: 170,
borderRadius: 24,
border: "1px solid rgba(34,255,127,0.22)",
background: "rgba(0,0,0,0.32)",
color: "white",
padding: 18,
fontSize: 17,
outline: "none",
resize: "none",
marginBottom: 18,
boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
};

const buttonRow: React.CSSProperties = {
display: "flex",
gap: 12,
flexWrap: "wrap",
};

const primaryBtn: React.CSSProperties = {
border: "none",
background: "linear-gradient(135deg,#FFFFFF,#16a34a)",
color: "#04140c",
padding: "15px 22px",
borderRadius: 999,
fontSize: 16,
fontWeight: 950,
cursor: "pointer",
boxShadow: "0 0 28px rgba(34,255,127,0.28)",
};

const secondaryBtn: React.CSSProperties = {
border: "1px solid rgba(34,255,127,0.32)",
background: "rgba(34,255,127,0.08)",
color: "#8dffb5",
padding: "15px 22px",
borderRadius: 999,
fontSize: 16,
fontWeight: 950,
cursor: "pointer",
};

const statusBox: React.CSSProperties = {
marginTop: 22,
display: "inline-flex",
alignItems: "center",
gap: 10,
padding: "12px 14px",
borderRadius: 999,
background: "rgba(34,255,127,0.08)",
border: "1px solid rgba(34,255,127,0.18)",
color: "#d8ffe5",
fontWeight: 900,
};

const pulseDot: React.CSSProperties = {
width: 9,
height: 9,
borderRadius: "50%",
background: "#FFFFFF",
boxShadow: "0 0 14px #FFFFFF",
};

const errorBox: React.CSSProperties = {
marginTop: 18,
padding: 14,
borderRadius: 18,
background: "rgba(239,68,68,0.12)",
border: "1px solid rgba(239,68,68,0.28)",
color: "#fecaca",
fontWeight: 850,
};

const videoWrap: React.CSSProperties = {
marginTop: 24,
};

const video: React.CSSProperties = {
width: "100%",
borderRadius: 26,
border: "1px solid rgba(34,255,127,0.18)",
boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
background: "#020617",
};

const shareBtn: React.CSSProperties = {
width: "100%",
marginTop: 18,
padding: "17px",
borderRadius: 999,
border: "none",
background: "linear-gradient(135deg,#FFFFFF,#16a34a)",
color: "#04140c",
fontSize: 17,
fontWeight: 950,
boxShadow: "0 0 28px rgba(34,255,127,0.28)",
};

const bottomNav: React.CSSProperties = {
position: "fixed",
bottom: 0,
left: 0,
right: 0,
height: 96,
background: "rgba(2,7,5,0.96)",
borderTop: "1px solid rgba(34,255,127,0.14)",
display: "flex",
justifyContent: "space-around",
alignItems: "center",
zIndex: 50,
backdropFilter: "blur(18px)",
};

const navBtn: React.CSSProperties = {
border: "none",
background: "transparent",
color: "rgba(255,255,255,0.62)",
fontWeight: 850,
};

const plusBtn: React.CSSProperties = {
width: 72,
height: 72,
borderRadius: "50%",
border: "none",
background: "#FFFFFF",
color: "black",
fontSize: 42,
fontWeight: 950,
boxShadow: "0 0 34px rgba(34,255,127,0.42)",
};
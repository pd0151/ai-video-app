"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

type Business = {
name: string | null;
location: string | null;
};

export default function VideoPage() {
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
const email = localStorage.getItem("user");

if (!email) return;

const { data } = await supabase
.from("businesses")
.select("name, location")
.eq("email", email)
.single();

if (data) setBusiness(data);
}

async function useOneCredit() {
const {
data: { user },
} = await supabase.auth.getUser();

if (!user?.id) {
alert("Please log in first");
return false;
}

const { data, error } = await supabase
.from("user_credits")
.select("credits")
.eq("user_id", user.id)
.single();

if (error || !data) {
alert("No credits found. Please upgrade.");
return false;
}

if (data.credits <= 0) {
alert("You have no credits left. Upgrade to create more videos.");
return false;
}

const { error: updateError } = await supabase
.from("user_credits")
.update({ credits: data.credits - 1 })
.eq("user_id", user.id);

if (updateError) {
alert("Could not use credit.");
return false;
}

return true;
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

const creditOk = await useOneCredit();

if (!creditOk) return;

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

const res = await fetch("/api/generate-video", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ prompt: betterPrompt }),
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

alert("Posted to feed ✅");
}

useEffect(() => {
loadBusiness();
return () => stopPolling();
}, []);

return (
<main style={page}>
<section style={card}>
<h1 style={title}>AI Video Generator</h1>
<p style={subText}>Create premium video ads and post them to your feed.</p>

<textarea
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Describe your video advert..."
style={textarea}
/>

<button onClick={() => startVideo("animate")} style={button}>
Animate Image → Video
</button>

<button onClick={() => startVideo("normal")} style={button}>
{loading ? "Generating..." : "Generate Video"}
</button>

{status && <p style={statusText}>Status: {status}</p>}
{error && <p style={errorText}>{error}</p>}

{videoUrl && (
<>
<video src={videoUrl} controls autoPlay playsInline style={video} />

<button
onClick={shareToFeed}
style={{
position: "fixed",
left: 18,
right: 18,
bottom: 90,
zIndex: 9999,
padding: "18px",
borderRadius: 999,
border: "none",
background: "linear-gradient(135deg, #a855f7, #7c3aed)",
color: "white",
fontSize: 18,
fontWeight: 950,
boxShadow: "0 10px 35px rgba(168,85,247,0.45)",
}}
>
{sharing ? "Sharing..." : "🚀 Share to Feed"}
</button>
</>
)}
</section>
</main>
);
}

const page: React.CSSProperties = {
minHeight: "100vh",
background:
"radial-gradient(circle at top, rgba(168,85,247,0.35) 0%, #080818 40%, #000000 100%)",
color: "white",
padding: "26px 16px 80px",
fontFamily: "Inter, Arial, sans-serif",
};

const card: React.CSSProperties = {
maxWidth: 760,
margin: "0 auto",
padding: 26,
borderRadius: 34,
background:
"linear-gradient(135deg, rgba(168,85,247,0.25), rgba(124,58,237,0.12))",
border: "1px solid rgba(255,255,255,0.14)",
boxShadow: "0 0 35px rgba(168,85,247,0.22)",
backdropFilter: "blur(20px)",
};

const title: React.CSSProperties = {
fontSize: 42,
lineHeight: 1,
margin: 0,
fontWeight: 950,
};

const subText: React.CSSProperties = {
marginTop: 12,
marginBottom: 22,
opacity: 0.78,
fontSize: 18,
fontWeight: 700,
};

const textarea: React.CSSProperties = {
width: "100%",
height: 150,
borderRadius: 24,
border: "2px solid rgba(168,85,247,0.55)",
background: "rgba(255,255,255,0.96)",
color: "#111",
padding: 16,
fontSize: 17,
outline: "none",
resize: "none",
marginBottom: 16,
};

const button: React.CSSProperties = {
border: "none",
background: "linear-gradient(135deg, #a855f7, #7c3aed)",
color: "white",
padding: "14px 24px",
borderRadius: 999,
fontSize: 16,
fontWeight: 950,
cursor: "pointer",
boxShadow: "0 10px 30px rgba(168,85,247,0.4)",
marginRight: 10,
marginBottom: 10,
};

const statusText: React.CSSProperties = {
marginTop: 18,
fontSize: 18,
fontWeight: 800,
};

const errorText: React.CSSProperties = {
marginTop: 16,
color: "#fca5a5",
fontWeight: 900,
};

const video: React.CSSProperties = {
width: "100%",
marginTop: 24,
borderRadius: 28,
border: "1px solid rgba(255,255,255,0.14)",
boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
};
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Ad = {
id: number;
image: string;
username: string;
caption: string;
};

export default function FeedPage() {
const router = useRouter();

const [user, setUser] = useState("");
const [ads, setAds] = useState<Ad[]>([]);
const [isPremium, setIsPremium] = useState(false);

useEffect(() => {
const savedUser = localStorage.getItem("user");
if (!savedUser) {
router.push("/login");
return;
}

setUser(savedUser);

const savedAds = localStorage.getItem("ads");
if (savedAds) setAds(JSON.parse(savedAds));

const premium = localStorage.getItem("premium");
if (premium === "true") setIsPremium(true);
}, [router]);

function handleLogout() {
localStorage.removeItem("user");
router.push("/login");
}

function createAd() {
if (!isPremium && ads.length >= 1) {
alert("Upgrade to premium to post more ads 💰");
return;
}

const image = prompt("Paste image URL");
const caption = prompt("Caption");

if (!image || !caption) return;

const newAd: Ad = {
id: Date.now(),
image,
username: user,
caption,
};

const updated = [newAd, ...ads];
setAds(updated);
localStorage.setItem("ads", JSON.stringify(updated));
}

function upgrade() {
localStorage.setItem("premium", "true");
setIsPremium(true);
alert("You are now premium 🚀");
}

return (
<main
style={{
height: "100vh",
overflowY: "scroll",
scrollSnapType: "y mandatory",
background: "#000",
color: "white",
}}
>
{/* HEADER */}
<div
style={{
position: "fixed",
top: 0,
width: "100%",
padding: "16px",
display: "flex",
justifyContent: "space-between",
background: "rgba(0,0,0,0.6)",
zIndex: 10,
}}
>
<h2>Ad Feed</h2>

<div style={{ display: "flex", gap: "10px" }}>
{!isPremium && (
<button onClick={upgrade}>Go Premium 💰</button>
)}
<button onClick={handleLogout}>Logout</button>
</div>
</div>

{/* POSTS */}
{ads.map((ad) => (
<div
key={ad.id}
style={{
height: "100vh",
scrollSnapAlign: "start",
position: "relative",
}}
>
<img
src={ad.image}
style={{
width: "100%",
height: "100%",
objectFit: "cover",
}}
/>

<div
style={{
position: "absolute",
bottom: "40px",
left: "20px",
}}
>
<p>Sponsored</p>
<h2>{ad.username}</h2>
<p>{ad.caption}</p>
</div>
</div>
))}

{/* CREATE BUTTON */}
<button
onClick={createAd}
style={{
position: "fixed",
bottom: "20px",
right: "20px",
width: "60px",
height: "60px",
borderRadius: "50%",
fontSize: "28px",
background: "white",
color: "black",
}}
>
+
</button>
</main>
);
}
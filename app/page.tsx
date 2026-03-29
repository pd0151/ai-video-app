"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
const [username, setUsername] = useState("");
const [business, setBusiness] = useState("");
const [product, setProduct] = useState("");
const [offer, setOffer] = useState("");
const [audience, setAudience] = useState("");
const [location, setLocation] = useState("");
const [imageUrl, setImageUrl] = useState("");

useEffect(() => {
const savedUsername = localStorage.getItem("username") || "";
setUsername(savedUsername);
}, []);

function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
const file = e.target.files?.[0];
if (!file) return;

const reader = new FileReader();
reader.onload = () => {
if (typeof reader.result === "string") {
setImageUrl(reader.result);
}
};
reader.readAsDataURL(file);
}

function generateAd() {
if (!business || !product || !location) {
alert("Fill business, product and location");
return;
}

setOffer(
`🔥 Attention ${location}! ${business} has you covered for ${product}. Get in touch today and don’t miss out!`
);
}

function saveUsername() {
localStorage.setItem("username", username);
alert("Username saved");
}

function publishAd() {
if (!business || !product || !offer) {
alert("Missing fields");
return;
}

let ads = [];

try {
ads = JSON.parse(localStorage.getItem("ads") || "[]");
} catch {
ads = [];
}

const newAd = {
id: Date.now(),
username,
business,
product,
offer,
audience,
location,
imageUrl,
likes: 0,
comments: [],
};

ads.unshift(newAd);
localStorage.setItem("ads", JSON.stringify(ads));

alert("Ad published");

setBusiness("");
setProduct("");
setOffer("");
setAudience("");
setLocation("");
setImageUrl("");
}

return (
<main className="create-page">
<div className="create-card">
<h1 className="create-title">LocalBoost</h1>
<p className="create-subtitle">
Create and publish local business ads.
</p>

<input
className="create-input"
placeholder="Your username"
value={username}
onChange={(e) => setUsername(e.target.value)}
/>

<div className="create-buttons" style={{ marginBottom: 14 }}>
<button className="create-btn ghost" onClick={saveUsername}>
Save Username
</button>
</div>

<input
className="create-input"
placeholder="Business name"
value={business}
onChange={(e) => setBusiness(e.target.value)}
/>

<input
className="create-input"
placeholder="Product or service"
value={product}
onChange={(e) => setProduct(e.target.value)}
/>

<input
className="create-input"
placeholder="Special offer"
value={offer}
onChange={(e) => setOffer(e.target.value)}
/>

<input
className="create-input"
placeholder="Target audience"
value={audience}
onChange={(e) => setAudience(e.target.value)}
/>

<input
className="create-input"
placeholder="Town / area"
value={location}
onChange={(e) => setLocation(e.target.value)}
/>

<input
className="create-input"
type="file"
accept="image/*"
onChange={handleImageUpload}
/>

<div className="create-buttons">
<button
className="create-btn primary"

>
Generate Ad
</button>



<Link href="/feed" className="create-btn ghost">
View Feed
</Link>

<a
href="https://buy.stripe.com/test_28EbJ10U32LmfeI4Hh2wU00"
className="create-btn secondary"
>
Publish to Feed 🔥
</a>

</div>

{imageUrl && (
<img src={imageUrl} alt="preview" className="create-preview" />
)}
</div>
</main>
);
}
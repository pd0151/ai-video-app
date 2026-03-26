"use client";

import { useState } from "react";

export default function Home() {
const [business, setBusiness] = useState("");
const [product, setProduct] = useState("");
const [offer, setOffer] = useState("");
const [customer, setCustomer] = useState("");
const [result, setResult] = useState("");

const generateAd = () => {
const text = `
🚀 Business: ${business}
🛒 Product: ${product}
🎯 Offer: ${offer}
👤 Target: ${customer}

🔥 Captions:
1. Upgrade your ${product} today! ${offer}
2. Don’t miss out – ${offer}
3. Your ${product} deserves better!

🎬 Video Ideas:
- Before & after transformation
- Customer reaction clips
- Fast-paced action shots

🎥 Reel Script:
Hook: “Need better ${product}?”
Scene 1: Problem
Scene 2: Solution
Scene 3: Happy customer
Ending: ${offer}

📣 Call To Action:
Buy now and don’t miss out!
`;

setResult(text);
};

return (
<main style={styles.container}>
{/* FORM */}
<div style={styles.card}>
<h1>Business Ad Creator AI 🚀</h1>
<p>Create captions, video ideas, scripts, and ads in seconds 🔥</p>

<input
placeholder="Business name"
value={business}
onChange={(e) => setBusiness(e.target.value)}
style={styles.input}
/>

<input
placeholder="What do you sell?"
value={product}
onChange={(e) => setProduct(e.target.value)}
style={styles.input}
/>

<input
placeholder="Special offer"
value={offer}
onChange={(e) => setOffer(e.target.value)}
style={styles.input}
/>

<input
placeholder="Target customer"
value={customer}
onChange={(e) => setCustomer(e.target.value)}
style={styles.input}
/>

<button onClick={generateAd} style={styles.button}>
Generate Business Ad
</button>
</div>

{/* VIDEO PREVIEW */}
<div style={styles.card}>
<h3>🎥 Example Ad Video</h3>

<video
controls
autoPlay
loop
muted
style={{ width: "100%", borderRadius: "12px" }}
src={
product.toLowerCase().includes("tyre") ||
product.toLowerCase().includes("car")
? "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
: "https://www.w3schools.com/html/mov_bbb.mp4"
}
/>

<p style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
Example preview of how your ad could look
</p>
</div>

{/* RESULTS */}
{result && (
<div style={styles.card}>
<pre style={{ whiteSpace: "pre-wrap" }}>{result}</pre>
</div>
)}
</main>
);
}

const styles = {
container: {
padding: "40px",
maxWidth: "600px",
margin: "auto",
fontFamily: "Arial",
},
card: {
background: "#fff",
padding: "20px",
borderRadius: "12px",
marginBottom: "20px",
boxShadow: "0 0 10px rgba(0,0,0,0.1)",
},
input: {
width: "100%",
padding: "10px",
marginTop: "10px",
borderRadius: "8px",
border: "1px solid #ccc",
},
button: {
marginTop: "15px",
padding: "12px",
width: "100%",
borderRadius: "8px",
border: "none",
background: "black",
color: "white",
fontWeight: "bold",
cursor: "pointer",
},
};
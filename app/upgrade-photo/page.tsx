"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";



async function convertToPng(file: File): Promise<File> {
const img = new Image();
img.src = URL.createObjectURL(file);

await new Promise((resolve, reject) => {
img.onload = resolve;
img.onerror = reject;
});

const canvas = document.createElement("canvas");
canvas.width = img.width;
canvas.height = img.height;

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("Could not convert image");

ctx.drawImage(img, 0, 0);

const blob = await new Promise<Blob>((resolve, reject) => {
canvas.toBlob((b) => {
if (!b) reject(new Error("PNG conversion failed"));
else resolve(b);
}, "image/png");
});

return new File([blob], "upload.png", { type: "image/png" });
}
export default function UpgradePhotoPage() {
const router = useRouter();
const [file, setFile] = useState<File | null>(null);
const [preview, setPreview] = useState("");
const [generating, setGenerating] = useState(false);
async function generatePremiumAd() {
if (!file) {
alert("Upload a photo first");
return;
}

const textBox = document.querySelector("textarea") as HTMLTextAreaElement;
const userPrompt = textBox?.value || "";

if (!userPrompt.trim()) {
alert("Enter what advert you want");
return;
}

const formData = new FormData();
const pngFile = await convertToPng(file);
formData.append("image", pngFile);
formData.append("prompt", userPrompt);

const res = await fetch("/api/edit-image", {
method: "POST",
body: formData,
});

const data = await res.json();

if (!res.ok) {
alert(data.error || "Image generation failed");
return;
}

setPreview(data.imageUrl);
}

return (
<main style={page}>
<button onClick={() => router.push("/")} style={backBtn}>← Back</button>

<section style={card}>
<span style={pill}>UPGRADE PHOTO</span>

<h1 style={title}>Turn a real photo into a premium advert</h1>

<p style={text}>
Upload your van, shop, product or job photo and AdForge will turn it into a professional business ad.
</p>

<label style={uploadBox}>
{preview ? <img src={preview} style={previewImg} /> : "Tap to upload photo"}
<input
type="file"
accept="image/*"
style={{ display: "none" }}
onChange={(e) => {
const selected = e.target.files?.[0];
if (!selected) return;
setFile(selected);
setPreview(URL.createObjectURL(selected));
}}
/>
</label>

<textarea
placeholder="Example: Make this a premium mobile tyre fitting advert with bold text and a book now call to action..."
style={input}
/>

<button
onClick={generatePremiumAd}
disabled={generating}
style={mainBtn}
>
{generating ? "Generating premium ad..." : "Generate Premium Ad"}
</button>
</section>
</main>
);
}

const page: React.CSSProperties = {
minHeight: "100vh",
padding: "90px 20px 150px",
background: "radial-gradient(circle at top, rgb(18,24,38), rgb(2,4,10))",
color: "white",
fontFamily: "Inter, Arial, sans-serif",
};

const backBtn: React.CSSProperties = {
border: "1px solid rgba(220,235,255,0.22)",
background: "rgba(255,255,255,0.06)",
color: "white",
borderRadius: 18,
padding: "12px 18px",
fontWeight: 900,
};

const card: React.CSSProperties = {
marginTop: 24,
borderRadius: 30,
padding: 22,
background: "rgba(7,10,20,0.92)",
border: "1px solid rgba(220,235,255,0.26)",
boxShadow: "0 0 35px rgba(220,235,255,0.22)",
};

const pill: React.CSSProperties = {
letterSpacing: 3,
fontWeight: 950,
fontSize: 12,
opacity: 0.8,
};

const title: React.CSSProperties = {
fontSize: 38,
lineHeight: 0.95,
margin: "18px 0 12px",
fontWeight: 950,
};

const text: React.CSSProperties = {
color: "rgba(255,255,255,0.68)",
fontSize: 16,
lineHeight: 1.45,
};

const uploadBox: React.CSSProperties = {
marginTop: 20,
height: 260,
borderRadius: 24,
border: "1px dashed rgba(220,235,255,0.32)",
background: "rgba(255,255,255,0.04)",
display: "grid",
placeItems: "center",
overflow: "hidden",
fontWeight: 900,
};

const previewImg: React.CSSProperties = {
width: "100%",
height: "100%",
objectFit: "cover",
};

const input: React.CSSProperties = {
width: "100%",
minHeight: 130,
marginTop: 16,
borderRadius: 22,
padding: 16,
boxSizing: "border-box",
background: "rgba(0,0,0,0.35)",
border: "1px solid rgba(220,235,255,0.22)",
color: "white",
fontSize: 16,
resize: "none",
};

const mainBtn: React.CSSProperties = {
width: "100%",
height: 62,
marginTop: 16,
borderRadius: 22,
border: "none",
background: "linear-gradient(135deg, white, rgb(220,235,255))",
color: "black",
fontSize: 20,
fontWeight: 950,
};
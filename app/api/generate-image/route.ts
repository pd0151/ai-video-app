import { NextResponse } from "next/server";

export async function POST(req: Request) {
try {
const { prompt } = await req.json();

if (!prompt || !prompt.trim()) {
return NextResponse.json(
{ error: "Prompt is required" },
{ status: 400 }
);
}

const cleanPrompt = prompt.trim();

try {
const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
cleanPrompt
)}`;

const imageRes = await fetch(pollinationsUrl, {
cache: "no-store",
});

if (imageRes.ok) {
const contentType = imageRes.headers.get("content-type") || "";

if (contentType.startsWith("image/")) {
const arrayBuffer = await imageRes.arrayBuffer();
const base64 = Buffer.from(arrayBuffer).toString("base64");
const dataUrl = `data:${contentType};base64,${base64}`;

return NextResponse.json({ image: dataUrl });
}
}
} catch (err) {
console.error("Pollinations failed, using fallback:", err);
}

const fallback = `https://placehold.co/900x1600/0f172a/ffffff/png?text=${encodeURIComponent(
cleanPrompt
)}`;

return NextResponse.json({ image: fallback });
} catch (error) {
console.error(error);
return NextResponse.json(
{ error: "Failed to generate image" },
{ status: 500 }
);
}
}
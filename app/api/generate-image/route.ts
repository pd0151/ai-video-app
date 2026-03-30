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

const clean = prompt.trim();

const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(clean)}`;

try {
const res = await fetch(pollinationsUrl, { cache: "no-store" });

if (res.ok) {
const type = res.headers.get("content-type") || "";

// ONLY accept real images
if (type.includes("image")) {
const buffer = await res.arrayBuffer();

// reject tiny / broken responses
if (buffer.byteLength > 5000) {
const base64 = Buffer.from(buffer).toString("base64");
return NextResponse.json({
image: `data:${type};base64,${base64}`,
});
}
}
}
} catch (err) {
console.log("Image failed:", err);
}

// fallback ALWAYS works
const fallback = `https://placehold.co/900x1600/111827/ffffff/png?text=${encodeURIComponent(clean)}`;

return NextResponse.json({ image: fallback });
} catch (error) {
return NextResponse.json(
{ error: "Failed to generate image" },
{ status: 500 }
);
}
}
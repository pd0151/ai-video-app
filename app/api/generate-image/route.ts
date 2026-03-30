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

const seed = encodeURIComponent(prompt.trim());
const image = `https://picsum.photos/seed/${seed}/900/1600`;

return NextResponse.json({ image });
} catch (error) {
console.error(error);
return NextResponse.json(
{ error: "Failed to generate image" },
{ status: 500 }
);
}
}
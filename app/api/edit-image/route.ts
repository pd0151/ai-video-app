import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
try {
const formData = await req.formData();
const image = formData.get("image") as File | null;
const prompt = String(formData.get("prompt") || "");

if (!image) {
return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
}

if (!prompt.trim()) {
return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
}

const result = await openai.images.edit({
model: "gpt-image-1",
image,
prompt: `
Turn this real business photo into a premium AdForge advert.

Style:
dark luxury commercial advertising,
xxeon white glow,
high contrast,
cinematic,
professional local business advert,
clean bold headline,
premium social media campaign,
sharp realistic details.

User request:
${prompt}
`,
size: "1024x1024",
});

const base64 = result.data?.[0]?.b64_json;

if (!base64) {
return NextResponse.json({ error: "No image returned" }, { status: 500 });
}

return NextResponse.json({
imageUrl: `data:image/png;base64,${base64}`,
});
} catch (err: any) {
console.error("EDIT IMAGE ERROR:", err);
return NextResponse.json(
{ error: err?.message || "Image edit failed" },
{ status: 500 }
);
}
}
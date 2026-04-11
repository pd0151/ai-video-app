import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
try {
const body = await req.json();
const prompt = body?.prompt;

if (!prompt || typeof prompt !== "string") {
return NextResponse.json(
{ error: "Prompt is required" },
{ status: 400 }
);
}

const result = await client.images.generate({
model: "gpt-image-1",
prompt,
size: "1024x1024",
});

const imageBase64 = result.data?.[0]?.b64_json;

if (!imageBase64) {
return NextResponse.json(
{ error: "No image returned from OpenAI" },
{ status: 500 }
);
}

const imageUrl = `data:image/png;base64,${imageBase64}`;

return NextResponse.json({ imageUrl });
} catch (error: any) {
return NextResponse.json(
{ error: error?.message || "Image generation failed" },
{ status: 500 }
);
}
}
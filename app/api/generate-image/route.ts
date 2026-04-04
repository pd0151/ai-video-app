import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
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

const result = await openai.images.generate({
model: "gpt-image-1",
prompt,
size: "1024x1024",
});

const b64 = result.data?.[0]?.b64_json;

if (!b64) {
return NextResponse.json(
{ error: "No image returned from OpenAI" },
{ status: 500 }
);
}

return NextResponse.json({
imageUrl: `data:image/png;base64,${b64}`,
});
} catch (error: any) {
console.error("generate-image route error:", error);

return NextResponse.json(
{
error: error?.message || "Image generation failed",
},
{ status: 500 }
);
}
}
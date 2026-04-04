import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
try {
const { prompt } = await req.json();

if (!prompt) {
return NextResponse.json(
{ error: "Prompt is required" },
{ status: 400 }
);
}

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

const result = await openai.images.generate({
model: "gpt-image-1",
prompt,
size: "1024x1024",
});

const imageBase64 = result.data?.[0]?.b64_json;

if (!imageBase64) {
throw new Error("No image returned");
}

return NextResponse.json({
image: `data:image/png;base64,${imageBase64}`,
});
} catch (error: any) {
console.error("IMAGE ERROR:", error);

return NextResponse.json(
{ error: error?.message || "Failed to generate image" },
{ status: 500 }
);
}
}
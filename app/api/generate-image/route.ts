import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
try {
const { prompt } = await req.json();

if (!prompt || !prompt.trim()) {
return NextResponse.json(
{ error: "Prompt is required" },
{ status: 400 }
);
}

const result = await client.images.generate({
model: "gpt-image-1.5",
prompt: prompt.trim(),
size: "1024x1024",
});

const imageBase64 = result.data?.[0]?.b64_json;

if (!imageBase64) {
return NextResponse.json(
{ error: "No image returned" },
{ status: 500 }
);
}

return NextResponse.json({
image: `data:image/png;base64,${imageBase64}`,
});
} catch (error) {
console.error("AI ERROR:", error);

return NextResponse.json(
{ error: "Failed to generate image" },
{ status: 500 }
);
}
}
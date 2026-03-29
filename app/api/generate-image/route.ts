import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
try {
const { prompt } = await req.json();

if (!prompt) {
return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
}

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

const result = await openai.images.generate({
model: "gpt-image-1",
prompt,
size: "1024x1024",
});

const item = result.data?.[0];

if (!item) {
return NextResponse.json({ error: "No image returned" }, { status: 500 });
}

if ("b64_json" in item && item.b64_json) {
return NextResponse.json({
image: `data:image/png;base64,${item.b64_json}`,
});
}

if ("url" in item && item.url) {
return NextResponse.json({
image: item.url,
});
}

return NextResponse.json({ error: "Unexpected image format" }, { status: 500 });
} catch (error: any) {
return NextResponse.json(
{ error: error?.message || "Something went wrong" },
{ status: 500 }
);
}
}
import { NextResponse } from "next/server";

export async function POST(req: Request) {
try {
const { prompt } = await req.json();

if (!prompt || typeof prompt !== "string") {
return NextResponse.json(
{ error: "Prompt is required" },
{ status: 400 }
);
}

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
return NextResponse.json(
{ error: "OPENAI_API_KEY is missing" },
{ status: 500 }
);
}

const response = await fetch("https://api.openai.com/v1/images/generations", {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${apiKey}`,
},
body: JSON.stringify({
model: "gpt-image-1",
prompt,
size: "1024x1024",
}),
});

const data = await response.json();

if (!response.ok) {
console.error("OpenAI image error:", data);
return NextResponse.json(
{ error: data?.error?.message || "OpenAI image generation failed" },
{ status: response.status }
);
}

const imageBase64 = data?.data?.[0]?.b64_json;

if (!imageBase64) {
console.error("No image data returned:", data);
return NextResponse.json(
{ error: "No image data returned from OpenAI" },
{ status: 500 }
);
}

return NextResponse.json({
imageUrl: `data:image/png;base64,${imageBase64}`,
});
} catch (error: any) {
console.error("generate-image route error:", error);
return NextResponse.json(
{ error: error?.message || "Failed to generate image" },
{ status: 500 }
);
}
}
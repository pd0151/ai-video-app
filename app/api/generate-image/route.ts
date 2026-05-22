import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
try {
const { prompt } = await req.json();

const premiumPrompt = `
Create a premium vertical mobile advert for: ${prompt}.

CRITICAL LAYOUT RULES:
- Keep ALL text, logos, headlines, phone numbers and wording fully visible.
- Leave large safe margins around every edge of the canvas.
- Do NOT place text near the top, bottom, left or right edge.
- Do NOT crop any letters, logos, phone numbers or headlines.
- Use a balanced poster layout with the main product centered.
- Make the advert look finished and professional, not cropped.

STYLE:
Ultra realistic cinematic advertising poster.
Luxury commercial advert, modern premium business marketing.
Dark glossy background, neon green accents.
Professional photography, cinematic shadows.
Ultra detailed, expensive looking, viral social media ad creative.
Clean premium typography with strong spacing.
Mobile-first composition.
`;


if (!prompt) {
return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
}

const result = await openai.images.generate({
model: "gpt-image-1",
prompt: premiumPrompt,
size: "1024x1536",
});

const base64 = result.data?.[0]?.b64_json;

if (!base64) {
return NextResponse.json(
{ error: "No image returned from OpenAI" },
{ status: 500 }
);
}

return NextResponse.json({
image: `data:image/png;base64,${base64}`,
});
} catch (error: any) {
return NextResponse.json(
{ error: error?.message || "Image generation failed" },
{ status: 500 }
);
}
}
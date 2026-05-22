import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
try {
const { prompt } = await req.json();

const premiumPrompt = `
Create a premium vertical social media advert for: ${prompt}.

STYLE:
High-end commercial product photography.
Luxury brand advert.
Sharp realistic detail.
Professional studio lighting.
Modern clean layout.
Cinematic shadows.
Expensive glossy finish.
Premium social media campaign quality.

IMPORTANT:
- Do NOT use the same green theme every time.
- Choose colours that match the business type.
- Keep all text, logos and phone numbers fully visible.
- Leave large safe margins around every edge.
- Do not crop any words, letters, logos or headlines.
- Make it look like a finished paid advert, not a template.
- Use a vertical mobile advert layout.

COMPOSITION:
Main product centered.
Clean background.
Readable typography.
Balanced spacing.
No clutter.
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
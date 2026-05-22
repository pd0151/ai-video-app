import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
try {
const { prompt } = await req.json();

const premiumPrompt = `
Create a premium ultra realistic vertical mobile advert for: ${prompt}.

Style:
Luxury commercial photography.
High-end cinematic advertising.
Professional product composition.
Premium social media campaign aesthetic.

Image Quality:
Ultra detailed.
8k realism.
Sharp focus.
Professional lighting.
Natural reflections.
High dynamic range.
Photorealistic textures.
Studio quality rendering.

Composition Rules:
Keep all text fully visible.
Leave safe margins around edges.
Do not crop headlines or logos.
Balanced composition.
Main subject centered correctly.
Designed for mobile feed viewing.
Luxury spacing and typography layout.

Advertising Style:
Make it look like a real paid Facebook / Instagram advert.
Expensive brand identity.
Modern premium marketing campaign.
High conversion commercial design.
Clean professional layout.

Colours:
Use colours that match the business naturally.
Avoid overusing neon green.
Use realistic premium colour grading.

Negative Rules:
No blurry text.
No duplicated objects.
No warped tyres.
No cropped wording.
No clutter.
No low quality graphics.
No template feel.
No cartoon styling.

Final Result:
Generate a world-class premium advert suitable for a real business paying for professional marketing.
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
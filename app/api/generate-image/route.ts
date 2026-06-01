import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
try {
const { prompt } = await req.json();

if (!prompt) {
return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
}

const premiumPrompt = `
Create an elite, ultra-premium vertical mobile advertisement for this business request:

${prompt}

CREATIVE DIRECTION:
Randomly choose ONE premium advertising style for this generation:

1. Luxury brand campaign
2. Cinematic night photography
3. Apple-style minimalist advert
4. Nike-style action campaign
5. High-end magazine cover
6. Hollywood movie poster style
7. Premium 3D product showcase
8. Hyper-real urban advertising
9. Luxury automotive campaign
10. Modern social media viral advert
11. Luxury neon night campaign
12. Premium billboard campaign
13. High-end fashion advert style
14. Dark cinematic product reveal
15. Ultra-clean tech startup campaign

Every generation must look different.
Use a different composition, camera angle, lighting setup, background, colour palette, subject position and typography style every time.
Do not repeat the same advert layout.
Do not always centre the subject.
Do not always use green.
Do not make it look like a generic Canva template.

STYLE:
World-class commercial advertising campaign.
Luxury agency-level creative direction.
Ultra-realistic premium 3D / photorealistic render.
Cinematic lighting.
High-end product photography.
Deep contrast.
Sharp focus.
Expensive materials.
Glossy reflections.
Realistic shadows.
Premium night-time or studio lighting where suitable.
Strong 3D depth and dimension.
Looks like a £100,000 advertising campaign.

QUALITY:
Highest quality.
Clean professional finish.
No cheap template look.
No cartoon style.
No amateur graphics.
No clutter.
No blur.
No messy AI artefacts.
No distorted vehicles, tools, tyres, hands, faces, food, products or logos.

COMPOSITION:
Vertical 9:16 mobile-first advert.
Use the full canvas properly.
Keep the main subject clear, premium and powerful.
Use strong foreground, midground and background depth.
Create a finished advert layout, not just a plain image.
Keep enough breathing space so it works inside a mobile feed card.

TEXT:
Only use text that the user provided or text clearly implied by the business request.
Do not invent random phone numbers.
Do not invent random addresses.
Keep all text fully readable.
Keep all text inside a safe 12% margin from every edge.
Do not crop letters.
Do not let text touch the canvas edge.
Use bold premium typography.
Use fewer words, bigger impact.
Make it look ready to post on a premium social feed.

NEGATIVE RULES:
No blurry text.
No warped text.
No misspelled words.
No fake unreadable small print.
No cropped logos.
No duplicated products.
No stretched vehicles.
No deformed hands or faces.
No cheap flyer design.
No low-resolution look.
No random phone numbers.
No random website URLs.
No messy background.
No boring repeated layout.

FINAL RESULT:
One finished high-end advert image.
Premium, realistic, sharp, expensive, clean and professional.
The advert should look like it came from a top creative agency, not an AI template.
`;

const result = await openai.images.generate({
model: "gpt-image-1",
prompt: premiumPrompt,
size: "1024x1536",
quality: "high",
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
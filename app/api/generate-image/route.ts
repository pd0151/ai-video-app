import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
try {
const { prompt } = await req.json();

const premiumPrompt = `
Create a world-class premium vertical mobile advert for: ${prompt}.

QUALITY LEVEL:
Ultra realistic 3D commercial render.
Luxury product advertising.
High-end agency campaign quality.
Premium cinematic photography.
8K / 16K detail look.
Sharp professional focus.
Studio-grade lighting.
Realistic reflections.
Glossy materials.
Deep shadows.
High dynamic range.
Expensive brand aesthetic.

COMPOSITION:
Vertical mobile-first advert.
Main product perfectly centred.
Strong depth and dimension.
Premium spacing.
Clean luxury layout.
No clutter.
No cheap template look.
No cartoon style.
No low-quality graphics.

TEXT RULES:
Keep ALL text fully visible.
Keep logos, headlines, phone numbers and offers inside safe margins.
Do not crop any letters.
Do not place wording near the image edges.
Use bold readable premium typography.
Make the advert look finished and ready to post.

COLOUR RULES:
Choose colours that match the business.
Do not always use green.
Use premium colour grading.
Use realistic lighting and brand-matching accents.

NEGATIVE RULES:
No blurry text.
No warped text.
No misspelled words.
No cropped logos.
No duplicated products.
No distorted tyres, faces, hands, tools or vehicles.
No messy layout.
No fake unreadable small print.
No amateur design.

FINAL RESULT:
Make this look like a top-tier paid advert from a luxury creative agency.
The result should be premium enough that a real business would pay for it.

All text must fit completely inside the image.

Leave the top 20% empty.

Leave the bottom 30% empty.

Place all advertising text between 25% and 65% of the image height.
dont over strech the image keep all text in side feed and dont add random phone numbers.
make all images premium top quality with no limits.
Do not allow any text to touch the edges of the canvas.

Use smaller professional typography that fits comfortably within the frame.
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
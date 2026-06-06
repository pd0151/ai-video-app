import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

const styles = [
"premium social media advert",
"luxury billboard campaign",
"cinematic brand campaign",
"modern Instagram advert",
"high-end business poster",
"clean Apple-style advert",
"bold agency-style layout",
"real customer problem and solution scene",
"premium local service campaign",
"ultra-realistic commercial photography",
"luxury product or service showcase",
"modern dark premium campaign",
"bright clean professional campaign",
"high-converting local business advert",
"cinematic lifestyle business advert",
];

export async function POST(req: Request) {
try {
const { prompt } = await req.json();

if (!prompt) {
return NextResponse.json(
{ error: "No prompt provided" },
{ status: 400 }
);
}

const randomStyle = styles[Math.floor(Math.random() * styles.length)];
const randomSeed = Math.floor(Math.random() * 999999);

const premiumPrompt = `
Create a premium social media advert for this business/request:

${prompt}

RANDOM CREATIVE STYLE:
${randomStyle}

UNIQUE GENERATION ID:
${randomSeed}

IMPORTANT:
This must work for ANY business type.
Do not assume the business is tyres, recovery, gym, food, barber, car showroom, bike shop, plumber, electrician, beauty salon or anything else unless the user prompt says so.

Read the user prompt carefully and make the advert match that exact business.

BUSINESS MATCHING RULES:
- If it is a gym, show gym equipment, fitness, training, strength, transformation or a premium fitness scene.
- If it is a car showroom, show cars, showroom lighting, dealership, finance, stock or luxury vehicles.
- If it is a bike shop, show bikes, repairs, cycling, workshop or premium retail bike display.
- If it is food, show food, kitchen, takeaway, restaurant, menu items or delivery.
- If it is a barber, show barber chair, clippers, haircut, grooming or clean shop scene.
- If it is beauty, show beauty treatment, salon, skincare, lashes, nails or luxury appointment scene.
- If it is recovery, show vehicle recovery, roadside help, tow truck or emergency service.
- If it is tyres, show tyre fitting, mobile van, roadside service, wheels or garage scene.
- If it is plumbing, show plumbing tools, water repair, bathroom, boiler or emergency local service scene.
- If it is electrical, show electrician tools, lighting, wiring, fuse board or safe professional service scene.
- If it is roofing, show roofing work, house exterior, ladders, roof repair or local trades scene.
- If it is any other business, create a scene that clearly matches that business.

DO NOT:
- Do not default to tyres.
- Do not show a tyre unless the prompt mentions tyres, wheels, cars, recovery or vehicle services.
- Do not reuse the same template.
- Do not invent random phone numbers.
- Do not invent business names.
- Do not add fake details that are not in the prompt.
- Do not make the advert look like a cheap flyer.

QUALITY:
Ultra premium.
Top-of-the-range commercial advert.
Sharp 5K-style detail.
Realistic.
Clean.
High-end.
Modern.
Professional agency design.
Strong cinematic lighting.
Expensive brand look.
Clear subject.
Strong depth.
Premium composition.
Social-media ready.

TEXT:
Use only the important words from the user prompt.
Keep text readable.
Use fewer words.
Use bold premium typography.
Keep all text away from edges.
Do not crop text.
Do not misspell text.
Do not add random extra text.

COLOURS:
Use colours requested by the user.
If no colours are given, choose a premium colour palette that fits the business.
Do not always use green.
Do not always use black and gold.
Make the colour scheme match the industry.

FEED SAFE:
Make the advert fit well inside a mobile feed card.
Keep the subject and text inside the centre safe area.
Do not place important text at the very top or very bottom.
Leave breathing room around the edges.

NEGATIVE:
No blurry text.
No misspelled words.
No cropped letters.
No distorted faces.
No distorted hands.
No distorted vehicles.
No messy layouts.
No fake random details.
No repeated boring template.
No low-quality flyer design.

FINAL:
A finished premium advert that looks like it was made for the exact business in the user prompt.
`;

const result = await openai.images.generate({
model: "gpt-image-1",
prompt: premiumPrompt,
size: "1536x1024",
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
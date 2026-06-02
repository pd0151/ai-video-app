import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

const styles = [
"cinematic roadside emergency scene",
"premium magazine advert",
"luxury billboard campaign",
"urban night photography",
"modern social media advert",
"high-end realistic business poster",
"dramatic action advert",
"clean Apple-style minimal campaign",
"premium local service advert",
"bold graphic agency layout",
"real customer problem/solution scene",
"luxury black and red campaign",
"blue professional service campaign",
"hyper-realistic van on location scene",
"close-up tools and service action scene",
];

export async function POST(req: Request) {
try {
const { prompt } = await req.json();

if (!prompt) {
return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
}

const randomStyle = styles[Math.floor(Math.random() * styles.length)];
const randomSeed = Math.floor(Math.random() * 999999);

const premiumPrompt = `
Create a premium social media advert for:

${prompt}

RANDOM CREATIVE STYLE:
${randomStyle}

UNIQUE GENERATION ID:
${randomSeed}

IMPORTANT:
Do NOT create the same tyre-on-black-background advert again.
Do NOT always show one big tyre in the centre.
Do NOT repeat previous layouts.
Each image must look completely new.

CREATE A DIFFERENT CONCEPT EVERY TIME:
Use different scenes, angles, backgrounds, lighting and layouts.

For tyre businesses, vary between:
- mobile tyre van on a road
- mechanic fitting a tyre
- car on roadside at night
- emergency callout scene
- premium wheel close-up
- city night service advert
- branded service poster
- customer getting help
- dramatic before/after service moment

STYLE:
Ultra premium.
Realistic.
Sharp.
High-end commercial photography.
Luxury advertising finish.
Cinematic lighting.
Professional agency design.
Expensive brand look.
Strong depth.
Clean composition.
No cheap flyer look.

TEXT:
Use only the words from the user prompt.
Do not invent random phone numbers.
Keep text readable.
Keep all text away from the edges.
Do not crop text.
Use bold premium typography.
Use fewer words and stronger layout.

COLOURS:
Use colours requested by the user.
If colours are not given, choose a premium colour palette.
Do not always use green.
Do not always use black and gold.

FEED SAFE:
Make the advert fit well inside a mobile feed card.
Keep important text and subject inside the centre safe area.
Do not place important text at the very top or very bottom.

NEGATIVE:
No blurry text.
No misspelled words.
No cropped letters.
No distorted vehicles.
No weird tyres.
No messy layout.
No repeated boring template.
No fake random details.

FINAL:
A finished premium advert that looks different from the last one.
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
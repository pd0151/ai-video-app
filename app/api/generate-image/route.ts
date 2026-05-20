import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
try {
const { prompt } = await req.json();

const premiumPrompt = `
Ultra realistic cinematic advertising poster for: ${prompt}.

Luxury commercial advert, modern premium business marketing,
high-end social media ad, realistic lighting,
dark glossy background, neon green accents,
professional photography, cinematic shadows,
ultra detailed, expensive looking, viral ad creative,
Instagram story style, mobile-first composition,
premium typography spacing, realistic reflections,
high quality AI generated advertisement.
`;

if (!prompt) {
return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
}

const result = await openai.images.generate({
model: "gpt-image-1",
prompt: premiumPrompt,
size: "1024x1024",
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
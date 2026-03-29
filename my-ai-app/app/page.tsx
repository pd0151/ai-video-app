import OpenAI from "openai";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
try {
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
return Response.json(
{ error: "Missing OPENAI_API_KEY" },
{ status: 500 }
);
}

const { business, product, offer, audience, style } = await req.json();

const prompt = `
Create a high-converting square social media ad image.

Brand: ${business}
Product: ${product}
Offer: ${offer}
Audience: ${audience}

Style: ${style || "modern premium"}

Design:
- clean ad layout
- premium marketing look
- bold headline
- include "SHOP NOW" button
- 1:1 square
- high quality
`;

const openai = new OpenAI({ apiKey });

const result = await openai.images.generate({
model: "gpt-image-1",
prompt,
size: "1024x1024",
});

const image = result.data?.[0]?.b64_json;

if (!image) {
return Response.json(
{ error: "No image generated" },
{ status: 500 }
);
}

return Response.json({
image: `data:image/png;base64,${image}`,
});
} catch (err) {
console.error(err);
return Response.json(
{ error: "Server error" },
{ status: 500 }
);
}
}
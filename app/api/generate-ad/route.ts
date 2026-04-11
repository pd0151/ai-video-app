import { NextResponse } from "next/server";

export async function POST(req: Request) {
try {
const body = await req.json();
const prompt = body?.prompt;

if (!prompt || typeof prompt !== "string") {
return NextResponse.json(
{ error: "Prompt is required" },
{ status: 400 }
);
}

const adCopy = `Ad idea for: ${prompt}

Headline:
${prompt}

Description:
Professional ad concept based on your prompt, ready to use for image or video generation.

CTA:
Book now`;

return NextResponse.json({ adCopy });
} catch (error: any) {
return NextResponse.json(
{ error: error?.message || "Ad generation failed" },
{ status: 500 }
);
}
}
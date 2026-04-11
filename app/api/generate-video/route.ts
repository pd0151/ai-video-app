import { NextResponse } from "next/server";

export async function POST(req: Request) {
try {
const { prompt } = await req.json();

if (!prompt) {
return NextResponse.json(
{ error: "No prompt provided" },
{ status: 400 }
);
}

return NextResponse.json(
{ error: "AI video generation is not connected yet. Use image generation or upload your own video for now." },
{ status: 501 }
);
} catch (err: any) {
return NextResponse.json(
{ error: err.message || "Video generation failed" },
{ status: 500 }
);
}
}
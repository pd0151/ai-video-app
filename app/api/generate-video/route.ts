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

// Simple working video (no errors, no weird rabbit, no crashes)
const videoUrl =
"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

return NextResponse.json({ videoUrl });
} catch (err: any) {
return NextResponse.json(
{ error: err.message || "Video failed" },
{ status: 500 }
);
}
}
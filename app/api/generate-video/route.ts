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

// TEMP demo video (so your app ALWAYS works)
const demoVideo =
"https://www.w3schools.com/html/mov_bbb.mp4";

return NextResponse.json({
videoUrl: demoVideo,
});
} catch (err: any) {
return NextResponse.json(
{ error: err.message || "Video generation failed" },
{ status: 500 }
);
}
}
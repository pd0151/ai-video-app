import { NextResponse } from "next/server";

export async function POST(req: Request) {
try {
const { prompt } = await req.json();

if (!prompt || !prompt.trim()) {
return NextResponse.json(
{ error: "No prompt provided" },
{ status: 400 }
);
}

// TEST REAL VIDEO FILE
// This proves your Generate Video button + video player work properly
return NextResponse.json({
video: "https://www.w3schools.com/html/mov_bbb.mp4",
});
} catch (error: any) {
return NextResponse.json(
{ error: error.message || "Video generation failed" },
{ status: 500 }
);
}
}
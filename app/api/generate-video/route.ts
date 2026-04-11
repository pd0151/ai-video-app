import { NextResponse } from "next/server";
import Replicate from "replicate";

export async function POST(req: Request) {
try {
const { prompt } = await req.json();

if (!prompt) {
return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
}

const replicate = new Replicate({
auth: process.env.REPLICATE_API_TOKEN!,
});

const output = await replicate.run(
"anotherjesse/zeroscope-v2-xl",
{
input: {
prompt: prompt,
num_frames: 24,
fps: 8,
},
}
);

return NextResponse.json({ videoUrl: output });
} catch (err: any) {
return NextResponse.json(
{ error: err.message || "Video failed" },
{ status: 500 }
);
}
}

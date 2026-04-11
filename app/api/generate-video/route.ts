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
"cjwbw/zeroscope-v2-xl:9e4c2e6f1e4e4a2d6c5c4a0a4e0d2f6c0e3f0e0a",
{
input: {
prompt: prompt,
},
}
);

return NextResponse.json({ videoUrl: output });
} catch (err: any) {
return NextResponse.json(
{ error: err.message || "Video generation failed" },
{ status: 500 }
);
}
}
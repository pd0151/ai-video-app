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

const token = process.env.REPLICATE_API_TOKEN;

if (!token) {
return NextResponse.json(
{ error: "Missing REPLICATE_API_TOKEN" },
{ status: 500 }
);
}

const startRes = await fetch("https://api.replicate.com/v1/predictions", {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Token ${token}`,
},
body: JSON.stringify({
version: "3f0457eafc7b5b2413b77fdbaf0dff1fb6ab0b8a2f3167d6d7f5a8c9f1d4a6aa",
input: {
prompt: `${prompt}, cinematic, ultra realistic, 4k, smooth motion, professional advertising style`,
},
}),
});

const startData = await startRes.json();

if (!startRes.ok) {
return NextResponse.json(
{ error: startData.detail || startData.error || "Failed to start video generation" },
{ status: 500 }
);
}

const getUrl = startData?.urls?.get;

if (!getUrl) {
return NextResponse.json(
{ error: "No polling URL returned from Replicate" },
{ status: 500 }
);
}

let outputUrl: string | null = null;

for (let i = 0; i < 60; i++) {
await new Promise((resolve) => setTimeout(resolve, 3000));

const pollRes = await fetch(getUrl, {
headers: {
Authorization: `Token ${token}`,
},
});

const pollData = await pollRes.json();

if (!pollRes.ok) {
return NextResponse.json(
{ error: pollData.detail || pollData.error || "Polling failed" },
{ status: 500 }
);
}

if (pollData.status === "succeeded") {
if (typeof pollData.output === "string") {
outputUrl = pollData.output;
} else if (Array.isArray(pollData.output) && pollData.output.length > 0) {
outputUrl = pollData.output[0];
}
break;
}

if (pollData.status === "failed" || pollData.status === "canceled") {
return NextResponse.json(
{ error: pollData.error || "Video generation failed" },
{ status: 500 }
);
}
}

if (!outputUrl) {
return NextResponse.json(
{ error: "No video returned" },
{ status: 500 }
);
}

return NextResponse.json({ videoUrl: outputUrl });
} catch (error: any) {
return NextResponse.json(
{ error: error?.message || "Video generation failed" },
{ status: 500 }
);
}
}
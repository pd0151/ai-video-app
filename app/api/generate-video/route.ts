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
version:
"8ba52bde11300615f65e9591d7afc58816def12c93c870fa583ff67ae17afdda",
input: {
prompt: `${prompt}, cinematic, ultra realistic, 4k, smooth motion, professional advertising style`,
},
}),
});

const startData = await startRes.json();

if (!startRes.ok) {
return NextResponse.json(
{
error:
startData.detail ||
startData.error ||
JSON.stringify(startData) ||
"Failed to start video generation",
},
{ status: 500 }
);
}

const pollUrl = startData?.urls?.get;

if (!pollUrl) {
return NextResponse.json(
{ error: "No polling URL returned from Replicate" },
{ status: 500 }
);
}

let videoUrl: string | null = null;

for (let i = 0; i < 40; i++) {
await new Promise((resolve) => setTimeout(resolve, 3000));

const pollRes = await fetch(pollUrl, {
headers: {
Authorization: `Token ${token}`,
},
});

const pollData = await pollRes.json();

if (!pollRes.ok) {
return NextResponse.json(
{
error:
pollData.detail ||
pollData.error ||
JSON.stringify(pollData) ||
"Polling failed",
},
{ status: 500 }
);
}

if (pollData.status === "succeeded") {
if (typeof pollData.output === "string") {
videoUrl = pollData.output;
} else if (Array.isArray(pollData.output) && pollData.output.length > 0) {
videoUrl = pollData.output[0];
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

if (!videoUrl) {
return NextResponse.json(
{ error: "No video returned" },
{ status: 500 }
);
}

return NextResponse.json({ videoUrl });
} catch (error: any) {
return NextResponse.json(
{ error: error?.message || "Video generation failed" },
{ status: 500 }
);
}
}
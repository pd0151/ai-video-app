import { NextResponse } from "next/server";

function extractVideoUrl(output: any): string | null {
if (!output) return null;

if (typeof output === "string") return output;

if (Array.isArray(output)) {
for (const item of output) {
const found = extractVideoUrl(item);
if (found) return found;
}
return null;
}

if (typeof output === "object") {
if (typeof output.url === "string") return output.url;
if (typeof output.href === "string") return output.href;
if (typeof output.video === "string") return output.video;
if (typeof output.mp4 === "string") return output.mp4;
if (typeof output.output === "string") return output.output;

for (const key of Object.keys(output)) {
const found = extractVideoUrl(output[key]);
if (found) return found;
}
}

return null;
}

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

for (let i = 0; i < 50; i++) {
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
const videoUrl = extractVideoUrl(pollData.output);

if (!videoUrl) {
return NextResponse.json(
{ error: `No video returned. Raw output: ${JSON.stringify(pollData.output)}` },
{ status: 500 }
);
}

return NextResponse.json({ videoUrl });
}

if (pollData.status === "failed" || pollData.status === "canceled") {
return NextResponse.json(
{ error: pollData.error || "Video generation failed" },
{ status: 500 }
);
}
}

return NextResponse.json(
{ error: "Video generation timed out" },
{ status: 500 }
);
} catch (error: any) {
return NextResponse.json(
{ error: error?.message || "Video generation failed" },
{ status: 500 }
);
}
}
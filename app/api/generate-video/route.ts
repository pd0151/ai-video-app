import { NextResponse } from "next/server";

function getVideoUrl(output: unknown): string | null {
if (!output) return null;

if (typeof output === "string") {
return output.startsWith("http") ? output : null;
}

if (Array.isArray(output)) {
for (const item of output) {
const found = getVideoUrl(item);
if (found) return found;
}
return null;
}

if (typeof output === "object") {
const obj = output as Record<string, unknown>;

if (typeof obj.url === "string") return obj.url;
if (typeof obj.href === "string") return obj.href;
if (typeof obj.video === "string") return obj.video;
if (typeof obj.mp4 === "string") return obj.mp4;

for (const key of Object.keys(obj)) {
const found = getVideoUrl(obj[key]);
if (found) return found;
}
}

return null;
}

export async function POST(req: Request) {
try {
const { prompt } = await req.json();

if (!prompt || typeof prompt !== "string") {
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
Authorization: `Token ${token}`,
"Content-Type": "application/json",
Prefer: "wait=5",
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
startData?.detail ||
startData?.error ||
JSON.stringify(startData) ||
"Failed to start video generation",
},
{ status: 500 }
);
}

let videoUrl = getVideoUrl(startData.output);
if (videoUrl) {
return NextResponse.json({ videoUrl });
}

const pollUrl = startData?.urls?.get;

if (!pollUrl) {
return NextResponse.json(
{ error: "No polling URL returned from Replicate" },
{ status: 500 }
);
}

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
pollData?.detail ||
pollData?.error ||
JSON.stringify(pollData) ||
"Polling failed",
},
{ status: 500 }
);
}

videoUrl = getVideoUrl(pollData.output);
if (videoUrl) {
return NextResponse.json({ videoUrl });
}

if (pollData.status === "failed" || pollData.status === "canceled") {
return NextResponse.json(
{
error:
pollData?.error ||
JSON.stringify(pollData) ||
"Video generation failed",
},
{ status: 500 }
);
}
}

return NextResponse.json(
{ error: "No video returned" },
{ status: 500 }
);
} catch (error: any) {
return NextResponse.json(
{ error: error?.message || "Video generation failed" },
{ status: 500 }
);
}
}
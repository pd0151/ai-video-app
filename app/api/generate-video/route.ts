import { NextResponse } from "next/server";

function findVideoUrl(value: any): string | null {
if (!value) return null;

if (typeof value === "string") {
if (value.startsWith("http")) return value;
return null;
}

if (Array.isArray(value)) {
for (const item of value) {
const found = findVideoUrl(item);
if (found) return found;
}
return null;
}

if (typeof value === "object") {
if (typeof value.url === "string") return value.url;
if (typeof value.href === "string") return value.href;
if (typeof value.mp4 === "string") return value.mp4;
if (typeof value.video === "string") return value.video;

for (const key of Object.keys(value)) {
const found = findVideoUrl(value[key]);
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
"Authorization": `Bearer ${token}`,
"Content-Type": "application/json",
"Prefer": "wait=10"
},
body: JSON.stringify({
version:
"8ba52bde11300615f65e9591d7afc58816def12c93c870fa583ff67ae17afdda",
input: {
prompt: `${prompt}, cinematic, ultra realistic, 4k, smooth motion, professional advertising style`
}
})
});

const startData = await startRes.json();

if (!startRes.ok) {
return NextResponse.json(
{
error:
startData?.detail ||
startData?.error ||
JSON.stringify(startData) ||
"Failed to start video generation"
},
{ status: 500 }
);
}

// Sometimes Replicate already includes output in the first response.
let videoUrl = findVideoUrl(startData.output);
if (videoUrl) {
return NextResponse.json({ videoUrl });
}

const pollUrl = startData?.urls?.get;
if (!pollUrl) {
return NextResponse.json(
{
error: `No polling URL returned. Raw response: ${JSON.stringify(startData)}`
},
{ status: 500 }
);
}

for (let i = 0; i < 50; i++) {
await new Promise((resolve) => setTimeout(resolve, 3000));

const pollRes = await fetch(pollUrl, {
headers: {
"Authorization": `Bearer ${token}`
}
});

const pollData = await pollRes.json();

if (!pollRes.ok) {
return NextResponse.json(
{
error:
pollData?.detail ||
pollData?.error ||
JSON.stringify(pollData) ||
"Polling failed"
},
{ status: 500 }
);
}

// Check output every time, even before "succeeded"
videoUrl = findVideoUrl(pollData.output);
if (videoUrl) {
return NextResponse.json({ videoUrl });
}

if (pollData.status === "failed" || pollData.status === "canceled") {
return NextResponse.json(
{
error:
pollData?.error ||
`Video generation failed. Raw response: ${JSON.stringify(pollData)}`
},
{ status: 500 }
);
}
}

return NextResponse.json(
{
error: `No video returned. Last prediction response had no usable file URL.`
},
{ status: 500 }
);
} catch (error: any) {
return NextResponse.json(
{ error: error?.message || "Video generation failed" },
{ status: 500 }
);
}
} 
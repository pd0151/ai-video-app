import { NextResponse } from "next/server";

function findUrl(value: unknown): string | null {
if (!value) return null;

if (typeof value === "string") {
return value.startsWith("http") ? value : null;
}

if (Array.isArray(value)) {
for (const item of value) {
const found = findUrl(item);
if (found) return found;
}
return null;
}

if (typeof value === "object") {
const obj = value as Record<string, unknown>;

for (const key of ["url", "href", "video", "mp4"]) {
const v = obj[key];
if (typeof v === "string" && v.startsWith("http")) {
return v;
}
}

for (const key of Object.keys(obj)) {
const found = findUrl(obj[key]);
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

// Start prediction on official Replicate model endpoint
const startRes = await fetch(
"https://api.replicate.com/v1/models/minimax/video-01/predictions",
{
method: "POST",
headers: {
Authorization: `Bearer ${token}`,
"Content-Type": "application/json",
Prefer: "wait=5",
},
body: JSON.stringify({
input: {
prompt: `${prompt}, cinematic, ultra realistic, smooth motion, professional advertising style`,
},
}),
}
);

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

let videoUrl = findUrl(startData.output);
if (videoUrl) {
return NextResponse.json({ videoUrl });
}

const pollUrl = startData?.urls?.get;

if (!pollUrl) {
return NextResponse.json(
{ error: "No polling URL returned" },
{ status: 500 }
);
}

// Poll until finished
for (let i = 0; i < 50; i++) {
await new Promise((resolve) => setTimeout(resolve, 3000));

const pollRes = await fetch(pollUrl, {
headers: {
Authorization: `Bearer ${token}`,
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

videoUrl = findUrl(pollData.output);
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
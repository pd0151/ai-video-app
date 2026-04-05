import { NextResponse } from "next/server";

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

export async function POST(req: Request) {
try {
if (!REPLICATE_API_TOKEN) {
return NextResponse.json(
{ error: "Missing REPLICATE_API_TOKEN in environment variables" },
{ status: 500 }
);
}

const { prompt } = await req.json();

if (!prompt || !prompt.trim()) {
return NextResponse.json(
{ error: "No prompt provided" },
{ status: 400 }
);
}

// High-quality text-to-video model on Replicate
const createRes = await fetch(
"https://api.replicate.com/v1/models/vidu/q3-pro/predictions",
{
method: "POST",
headers: {
Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
"Content-Type": "application/json",
},
body: JSON.stringify({
input: {
prompt,
duration: 5,
resolution: "720p",
aspect_ratio: "16:9",
audio: true,
},
}),
}
);

const created = await createRes.json();

if (!createRes.ok) {
return NextResponse.json(
{ error: created.detail || created.error || "Failed to start AI video generation" },
{ status: 500 }
);
}

const predictionId = created.id;
if (!predictionId) {
return NextResponse.json(
{ error: "No prediction ID returned" },
{ status: 500 }
);
}

let result = created;
let attempts = 0;
const maxAttempts = 80; // ~4 minutes

while (
result.status !== "succeeded" &&
result.status !== "failed" &&
result.status !== "canceled" &&
attempts < maxAttempts
) {
await new Promise((resolve) => setTimeout(resolve, 3000));
attempts++;

const pollRes = await fetch(
`https://api.replicate.com/v1/predictions/${predictionId}`,
{
method: "GET",
headers: {
Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
"Content-Type": "application/json",
},
}
);

result = await pollRes.json();

if (!pollRes.ok) {
return NextResponse.json(
{ error: result.detail || result.error || "Failed while polling video generation" },
{ status: 500 }
);
}
}

if (attempts >= maxAttempts) {
return NextResponse.json(
{ error: "Video generation timed out. Try a shorter prompt or try again." },
{ status: 504 }
);
}

if (result.status !== "succeeded") {
return NextResponse.json(
{ error: result.error || "AI video generation failed" },
{ status: 500 }
);
}

let video = "";

if (typeof result.output === "string") {
video = result.output;
} else if (Array.isArray(result.output) && result.output.length > 0) {
video = result.output[0];
} else if (result.output?.video) {
video = result.output.video;
} else if (result.output?.url) {
video = result.output.url;
}

if (!video) {
return NextResponse.json(
{ error: "No video URL returned from the model" },
{ status: 500 }
);
}

return NextResponse.json({ video });
} catch (error: any) {
console.error("Generate video error:", error);
return NextResponse.json(
{ error: error.message || "Something went wrong generating video" },
{ status: 500 }
);
}
}
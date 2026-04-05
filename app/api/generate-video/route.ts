import { NextResponse } from "next/server";

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

export async function POST(req: Request) {
try {
if (!REPLICATE_API_TOKEN) {
return NextResponse.json(
{ error: "Missing REPLICATE_API_TOKEN" },
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

const createRes = await fetch(
"https://api.replicate.com/v1/models/minimax/video-01/predictions",
{
method: "POST",
headers: {
Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
"Content-Type": "application/json",
Prefer: "wait=60",
},
body: JSON.stringify({
input: {
prompt,
},
}),
}
);

const created = await createRes.json();

if (!createRes.ok) {
return NextResponse.json(
{ error: created.detail || created.error || "Failed to start video generation" },
{ status: 500 }
);
}

let prediction = created;

while (
prediction.status !== "succeeded" &&
prediction.status !== "failed" &&
prediction.status !== "canceled"
) {
await new Promise((resolve) => setTimeout(resolve, 3000));

const pollRes = await fetch(
prediction.urls?.get ||
`https://api.replicate.com/v1/predictions/${prediction.id}`,
{
headers: {
Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
"Content-Type": "application/json",
},
}
);

prediction = await pollRes.json();

if (!pollRes.ok) {
return NextResponse.json(
{ error: prediction.detail || prediction.error || "Polling failed" },
{ status: 500 }
);
}
}

if (prediction.status !== "succeeded") {
return NextResponse.json(
{ error: prediction.error || "Video generation failed" },
{ status: 500 }
);
}

let video = "";

if (typeof prediction.output === "string") {
video = prediction.output;
} else if (Array.isArray(prediction.output) && prediction.output.length > 0) {
video = prediction.output[0];
} else if (prediction.output?.video) {
video = prediction.output.video;
} else if (prediction.output?.url) {
video = prediction.output.url;
}

if (!video) {
return NextResponse.json(
{ error: "No video URL returned" },
{ status: 500 }
);
}

return NextResponse.json({ video });
} catch (error: any) {
return NextResponse.json(
{ error: error.message || "Something went wrong generating video" },
{ status: 500 }
);
}
}

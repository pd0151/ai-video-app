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

// STEP 1: Start video generation
const startRes = await fetch("https://api.replicate.com/v1/predictions", {
method: "POST",
headers: {
Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
"Content-Type": "application/json",
},
body: JSON.stringify({
model: "cjwbw/videogen",
input: {
prompt: `${prompt}, cinematic, ultra realistic, 4k, smooth motion, professional advertising style`,
},
}),
});

const startData = await startRes.json();

if (!startData?.urls?.get) {
return NextResponse.json(
{ error: "Failed to start video generation" },
{ status: 500 }
);
}

// STEP 2: Poll until video is ready
let result;
let attempts = 0;

while (attempts < 30) {
await new Promise((r) => setTimeout(r, 2000));

const pollRes = await fetch(startData.urls.get, {
headers: {
Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
},
});

result = await pollRes.json();

if (result.status === "succeeded") break;
if (result.status === "failed") {
return NextResponse.json(
{ error: "Video generation failed" },
{ status: 500 }
);
}

attempts++;
}

// STEP 3: Return video URL
if (!result?.output) {
return NextResponse.json(
{ error: "No video returned" },
{ status: 500 }
);
}

const videoUrl = Array.isArray(result.output)
? result.output[0]
: result.output;

return NextResponse.json({ videoUrl });

} catch (error: any) {
return NextResponse.json(
{ error: error.message || "Video generation failed" },
{ status: 500 }
);
}
}
import { NextResponse } from "next/server";

export async function POST(req: Request) {
try {
const { prompt } = await req.json();

if (!prompt) {
return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
}

const token = process.env.REPLICATE_API_TOKEN;

if (!token) {
return NextResponse.json(
{ error: "Missing REPLICATE_API_TOKEN in environment variables" },
{ status: 500 }
);
}

const createResponse = await fetch("https://api.replicate.com/v1/predictions", {
method: "POST",
headers: {
Authorization: `Token ${token}`,
"Content-Type": "application/json",
},
body: JSON.stringify({
version: "3f0457eaf89b1f12b231dfe41f5379c6f761ab0cda972f3c7d75d1a3d7e9f1f9",
input: {
prompt,
},
}),
});

const prediction = await createResponse.json();

if (!createResponse.ok) {
return NextResponse.json(
{ error: prediction.detail || prediction.error || "Failed to start video generation" },
{ status: 500 }
);
}

let result = prediction;
let status = result.status;

while (status !== "succeeded" && status !== "failed" && status !== "canceled") {
await new Promise((resolve) => setTimeout(resolve, 3000));

const pollResponse = await fetch(
`https://api.replicate.com/v1/predictions/${result.id}`,
{
headers: {
Authorization: `Token ${token}`,
"Content-Type": "application/json",
},
}
);

result = await pollResponse.json();
status = result.status;
}

if (status !== "succeeded") {
return NextResponse.json(
{ error: result.error || "Video generation failed" },
{ status: 500 }
);
}

let video = "";

if (typeof result.output === "string") {
video = result.output;
} else if (Array.isArray(result.output) && result.output.length > 0) {
video = result.output[0];
}

if (!video) {
return NextResponse.json({ error: "No video returned" }, { status: 500 });
}

return NextResponse.json({ video });
} catch (error) {
console.error("Generate video error:", error);
return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
}
}
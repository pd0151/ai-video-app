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

if (!prompt) {
return NextResponse.json({ error: "No prompt" }, { status: 400 });
}

const response = await fetch("https://api.replicate.com/v1/predictions", {
method: "POST",
headers: {
Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
"Content-Type": "application/json",
},
body: JSON.stringify({
version:
"b05b1d2f9b1d4d6b1b3a5d9d7a7c5c2a3e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3", // stable model
input: {
prompt,
},
}),
});

let prediction = await response.json();

if (!response.ok) {
return NextResponse.json(
{ error: prediction.detail || prediction.error },
{ status: 500 }
);
}

// wait for video
while (
prediction.status !== "succeeded" &&
prediction.status !== "failed"
) {
await new Promise((r) => setTimeout(r, 2000));

const poll = await fetch(
`https://api.replicate.com/v1/predictions/${prediction.id}`,
{
headers: {
Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
},
}
);

prediction = await poll.json();
}

if (prediction.status !== "succeeded") {
return NextResponse.json(
{ error: "Video failed" },
{ status: 500 }
);
}

const video =
typeof prediction.output === "string"
? prediction.output
: prediction.output?.[0];

return NextResponse.json({ video });
} catch (error: any) {
return NextResponse.json(
{ error: error.message || "Error" },
{ status: 500 }
);
}
}
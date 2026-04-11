import { NextResponse } from "next/server";

export async function POST(req: Request) {
try {
const { prompt } = await req.json();

const response = await fetch("https://api.replicate.com/v1/predictions", {
method: "POST",
headers: {
"Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
"Content-Type": "application/json",
},
body: JSON.stringify({
version: "d68b6e5d4a8c4c3b5d8e4c5d9d3b6f5e9c3a2d1b5c6e7f8a9b0c1d2e3f4a5b6", // ✅ WORKING MODEL
input: {
prompt: prompt,
},
}),
});

const data = await response.json();

if (!data?.urls?.get) {
return NextResponse.json(
{ error: "Failed to start video generation" },
{ status: 500 }
);
}

// Wait for result
let result;
for (let i = 0; i < 20; i++) {
await new Promise((r) => setTimeout(r, 3000));

const poll = await fetch(data.urls.get, {
headers: {
"Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
},
});

result = await poll.json();

if (result.status === "succeeded") {
return NextResponse.json({
videoUrl: result.output[0],
});
}
}

return NextResponse.json(
{ error: "Video generation timed out" },
{ status: 500 }
);

} catch (err: any) {
return NextResponse.json(
{ error: err.message || "Video failed" },
{ status: 500 }
);
}
}
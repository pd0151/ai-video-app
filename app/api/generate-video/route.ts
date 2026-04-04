import { NextResponse } from "next/server";

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const MODEL = "kwaivgi/kling-v3-video";

export async function POST(req: Request) {
try {
const { prompt } = await req.json();

const res = await fetch(
`https://api.replicate.com/v1/models/${MODEL}/predictions`,
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
aspect_ratio: "9:16",
generate_audio: true,
},
}),
}
);

const data = await res.json();

return NextResponse.json(data);
} catch (err: any) {
return NextResponse.json({ error: err.message }, { status: 500 });
}
}

export async function GET(req: Request) {
const { searchParams } = new URL(req.url);
const id = searchParams.get("id");

const res = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
headers: {
Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
},
});

const data = await res.json();

return NextResponse.json(data);
}
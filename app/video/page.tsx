import { NextResponse } from "next/server";

function findUrl(value: any): string | null {
if (!value) return null;
if (typeof value === "string") return value.startsWith("http") ? value : null;

if (Array.isArray(value)) {
for (const item of value) {
const found = findUrl(item);
if (found) return found;
}
}

if (typeof value === "object") {
for (const key of Object.keys(value)) {
const found = findUrl(value[key]);
if (found) return found;
}
}

return null;
}

export async function POST(req: Request) {
try {
const { prompt } = await req.json();

const token = process.env.REPLICATE_API_TOKEN;
if (!token) {
return NextResponse.json({ error: "Missing REPLICATE_API_TOKEN" }, { status: 500 });
}

const res = await fetch(
"https://api.replicate.com/v1/models/minimax/video-01/predictions",
{
method: "POST",
headers: {
Authorization: `Bearer ${token}`,
"Content-Type": "application/json",
},
body: JSON.stringify({
input: {
prompt: `${prompt}, cinematic, realistic, smooth motion, professional advert`,
},
}),
}
);

const data = await res.json();

if (!res.ok) {
return NextResponse.json({ error: data?.detail || data?.error || "Video failed" }, { status: 500 });
}

return NextResponse.json({
id: data.id,
status: data.status,
});
} catch (error: any) {
return NextResponse.json({ error: error?.message || "Video failed" }, { status: 500 });
}
}

export async function GET(req: Request) {
try {
const token = process.env.REPLICATE_API_TOKEN;
if (!token) {
return NextResponse.json({ error: "Missing REPLICATE_API_TOKEN" }, { status: 500 });
}

const { searchParams } = new URL(req.url);
const id = searchParams.get("id");

if (!id) {
return NextResponse.json({ error: "Missing prediction id" }, { status: 400 });
}

const res = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
headers: {
Authorization: `Bearer ${token}`,
},
});

const data = await res.json();

if (!res.ok) {
return NextResponse.json({ error: data?.detail || data?.error || "Status failed" }, { status: 500 });
}

return NextResponse.json({
status: data.status,
videoUrl: findUrl(data.output),
error: data.error,
});
} catch (error: any) {
return NextResponse.json({ error: error?.message || "Status failed" }, { status: 500 });
}
}
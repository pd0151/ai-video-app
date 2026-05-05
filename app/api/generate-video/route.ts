import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

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
const { prompt, user_id } = await req.json();

if (!user_id) {
return NextResponse.json({ error: "Login required" }, { status: 401 });
}

const { data: creditRow, error: creditError } = await supabase
.from("user_credits")
.select("credits")
.eq("user_id", user_id)
.single();

if (creditError || !creditRow) {
return NextResponse.json({ error: "No credits found. Please upgrade." }, { status: 402 });
}

if (creditRow.credits <= 0) {
return NextResponse.json({ error: "No credits left. Please upgrade." }, { status: 402 });
}

const token = process.env.REPLICATE_API_TOKEN;

if (!token) {
return NextResponse.json({ error: "Missing REPLICATE_API_TOKEN" }, { status: 500 });
}

const res = await fetch(
"https://api.replicate.com/v1/models/luma/ray-2-720p/predictions",
{
method: "POST",
headers: {
Authorization: `Bearer ${token}`,
"Content-Type": "application/json",
},
body: JSON.stringify({
input: {
prompt: `Create a professional vertical advert video.

Scene: ${prompt}

Style: cinematic, realistic, clean commercial advert, smooth camera movement, sharp details, natural lighting.

Camera: slow tracking shot, stable motion, no shaky camera.

Important: make it look like a real business advertisement, not cartoon, not distorted.`,
duration: 9,
aspect_ratio: "9:16",
loop: false,
},
}),
}
);

const data = await res.json();

if (!res.ok) {
return NextResponse.json(
{ error: data?.detail || data?.error || "Video failed" },
{ status: 500 }
);
}

await supabase
.from("user_credits")
.update({ credits: creditRow.credits - 1 })
.eq("user_id", user_id);

return NextResponse.json({
id: data.id,
status: data.status,
creditsLeft: creditRow.credits - 1,
});
} catch (error: any) {
return NextResponse.json(
{ error: error?.message || "Video generation failed" },
{ status: 500 }
);
}
}

export async function GET(req: Request) {
try {
const token = process.env.REPLICATE_API_TOKEN;

const { searchParams } = new URL(req.url);
const id = searchParams.get("id");

const res = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
headers: {
Authorization: `Bearer ${token}`,
},
});

const data = await res.json();

return NextResponse.json({
status: data.status,
videoUrl: findUrl(data.output),
error: data.error,
});
} catch (error: any) {
return NextResponse.json(
{ error: error?.message || "Status failed" },
{ status: 500 }
);
}
}
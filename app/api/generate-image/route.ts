import OpenAI from "openai";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
try {
const { prompt } = await req.json();

if (!prompt || !prompt.trim()) {
return new Response(
JSON.stringify({ error: "No prompt provided" }),
{
status: 400,
headers: { "Content-Type": "application/json" },
}
);
}

const result = await openai.images.generate({
model: "gpt-image-1",
prompt,
size: "1024x1024",
});

const image_base64 = result.data?.[0]?.b64_json;

if (!image_base64) {
return new Response(
JSON.stringify({
error: "No image returned from OpenAI",
}),
{
status: 500,
headers: { "Content-Type": "application/json" },
}
);
}

const image = `data:image/png;base64,${image_base64}`;

return new Response(
JSON.stringify({ image }),
{
status: 200,
headers: { "Content-Type": "application/json" },
}
);
} catch (error: any) {
console.error("FULL ERROR:", error);

return new Response(
JSON.stringify({
error: error?.message || "Failed to generate image",
type: error?.type || null,
code: error?.code || null,
status: error?.status || null,
}),
{
status: 500,
headers: { "Content-Type": "application/json" },
}
);
}
}
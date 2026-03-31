import OpenAI from "openai";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
try {
const { prompt } = await req.json();

if (!prompt) {
return new Response(
JSON.stringify({ error: "No prompt provided" }),
{ status: 400 }
);
}

const result = await openai.images.generate({
model: "gpt-image-1",
prompt: prompt,
size: "1024x1024",
});

const image_base64 = result.data?.[0]?.b64_json;

if (!image_base64) {
return new Response(
JSON.stringify({ error: "No image returned" }),
{ status: 500 }
);
}

const image = `data:image/png;base64,${image_base64}`;

return new Response(JSON.stringify({ image }), {
status: 200,
});
} catch (error) {
console.error("ERROR:", error);

return new Response(
JSON.stringify({ error: "Failed to generate image" }),
{ status: 500 }
);
}
}
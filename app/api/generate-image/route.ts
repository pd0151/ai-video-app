import OpenAI from "openai";

const client = new OpenAI({
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

// 🔒 basic protection (prevents spam)
if (prompt.length > 200) {
return new Response(
JSON.stringify({ error: "Prompt too long" }),
{ status: 400 }
);
}

const image = await client.images.generate({
model: "gpt-image-1",
prompt,
size: "1024x1024",
});

return new Response(
JSON.stringify({
image: image.data[0].url,
}),
{ status: 200 }
);
} catch (err) {
console.error(err);

return new Response(
JSON.stringify({ error: "Failed to generate image" }),
{ status: 500 }
);
}
}
import { NextResponse } from "next/server";

export async function POST(req: Request) {
const body = await req.json();

const { business, product, offer, audience, location } = body;

try {
const response = await fetch("https://api.openai.com/v1/chat/completions", {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
},
body: JSON.stringify({
model: "gpt-4o-mini",
messages: [
{
role: "system",
content: "You are a marketing expert who writes TikTok-style ads.",
},
{
role: "user",
content: `
Create a catchy local business advert.

Business: ${business}
Product: ${product}
Offer: ${offer}
Audience: ${audience}
Location: ${location}

Make it short, punchy, and engaging.
`,
},
],
}),
});

const data = await response.json();

// 🔴 IMPORTANT: show real error in terminal
console.log("OPENAI RESPONSE:", data);

if (!response.ok) {
return NextResponse.json({
error: data.error?.message || "OpenAI error",
});
}

const text = data.choices?.[0]?.message?.content;

return NextResponse.json({ text });
} catch (error) {
console.error("SERVER ERROR:", error);
return NextResponse.json({ error: "Server crashed" });
}
}
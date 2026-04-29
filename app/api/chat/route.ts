import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
try {
const { messages } = await req.json();

const response = await openai.chat.completions.create({
model: "gpt-4o-mini",
messages: [
{
role: "system",
content:
"You are an expert advertising assistant. Help users write short, powerful ads, captions, hooks, and marketing ideas.",
},
...messages,
],
});

return NextResponse.json({
reply: response.choices[0].message.content,
});
} catch (error: any) {
console.error(error);
return NextResponse.json(
{ error: error.message || "Chat failed" },
{ status: 500 }
);
}
}
import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
try {
const body = await req.json();

const response = await openai.chat.completions.create({
model: "gpt-4o-mini",
messages: [
{
role: "system",
content:
"You are a powerful AI assistant inside the AdForge app. You can answer any question naturally, help with business, marketing, ideas, sales, coding, social media, advertising and general conversation. Keep replies clear, smart and useful.",
},
{
role: "user",
content: body.message,
},

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
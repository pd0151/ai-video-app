import { NextResponse } from "next/server";

export async function POST(req: Request) {
const formData = await req.formData();
const speech = formData.get("SpeechResult");

const reply = `
<Response>
<Say voice="alice">
You said: ${speech}.
We can help with that.
Can you tell me your exact location and vehicle type?
</Say>

<Gather input="speech" timeout="5" action="/api/voice-response">
<Say>Please continue.</Say>
</Gather>
</Response>
`;

return new NextResponse(reply, {
headers: { "Content-Type": "text/xml" },
});
}
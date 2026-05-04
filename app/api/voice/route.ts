import { NextResponse } from "next/server";

export async function POST(req: Request) {
const twiml = `
<Response>
<Gather input="speech" timeout="5" action="/api/voice-response">
<Say voice="alice">
Hello, thanks for calling mobile tyre fitting.
Tell me what you need and I will help you.
</Say>
</Gather>

<Say>Sorry, I didn't hear anything. Please call again.</Say>
</Response>
`;

return new NextResponse(twiml, {
headers: { "Content-Type": "text/xml" },
});
}
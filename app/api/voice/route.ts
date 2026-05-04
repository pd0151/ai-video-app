import { NextResponse } from "next/server";

export async function POST() {
const response = `
<Response>
<Say voice="alice">
Hello, thanks for calling. How can I help you today?
</Say>
</Response>
`;

return new NextResponse(response, {
headers: {
"Content-Type": "text/xml",
},
});
}
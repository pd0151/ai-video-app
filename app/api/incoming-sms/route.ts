export async function POST(request: Request) {
try {
const formData = await request.formData();

const from = String(formData.get("From") || "");
const to = String(formData.get("To") || "");
const message = String(formData.get("Body") || "");

console.log("Incoming Twilio SMS:", {
from,
to,
message,
});

return new Response(
`<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>`,
{
status: 200,
headers: {
"Content-Type": "text/xml",
},
}
);
} catch (error) {
console.error("Incoming SMS error:", error);

return new Response("Error", {
status: 500,
});
}
}
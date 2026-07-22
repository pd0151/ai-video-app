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

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const forwardTo = process.env.SMS_FORWARD_TO;

if (!accountSid || !authToken || !forwardTo) {
console.error("Missing Twilio SMS environment variables");

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
}

const params = new URLSearchParams({
From: to,
To: forwardTo,
Body: `New text to AdForge from ${from}:\n\n${message}`,
});

const response = await fetch(
`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
{
method: "POST",
headers: {
Authorization:
"Basic " +
Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
"Content-Type": "application/x-www-form-urlencoded",
},
body: params.toString(),
}
);

if (!response.ok) {
const errorText = await response.text();
console.error("SMS forwarding failed:", errorText);
}

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
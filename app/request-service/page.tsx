"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function RequestServicePage() {
const [service, setService] = useState("");
const [location, setLocation] = useState("");
const [phone, setPhone] = useState("");
const [loading, setLoading] = useState(false);

const submitRequest = async () => {
if (!service || !location) {
alert("Fill in service + location");
return;
}

setLoading(true);

const { error } = await supabase.from("service_requests").insert([
{
service,
location,
phone,
},
]);

setLoading(false);

if (error) {
alert("Error sending request");
console.error(error);
return;
}

alert("Request sent 🚀");

setService("");
setLocation("");
setPhone("");
};

return (
<div style={{ maxWidth: 500, margin: "0 auto", padding: 20 }}>
<h1 style={{ fontSize: 28, fontWeight: 900 }}>
🚨 Request a Service
</h1>

<input
placeholder="What do you need? (e.g tyre repair)"
value={service}
onChange={(e) => setService(e.target.value)}
style={input}
/>

<input
placeholder="Your location"
value={location}
onChange={(e) => setLocation(e.target.value)}
style={input}
/>

<input
placeholder="Phone number"
value={phone}
onChange={(e) => setPhone(e.target.value)}
style={input}
/>

<button onClick={submitRequest} style={btn}>
{loading ? "Sending..." : "Send Request 🚀"}
</button>
</div>
);
}

const input = {
width: "100%",
padding: "14px",
marginTop: "12px",
borderRadius: "12px",
border: "1px solid #ccc",
};

const btn = {
width: "100%",
padding: "16px",
marginTop: "16px",
borderRadius: "14px",
border: "none",
background: "linear-gradient(135deg,#22c55e,#16a34a)",
color: "white",
fontWeight: 900,
fontSize: "16px",
};
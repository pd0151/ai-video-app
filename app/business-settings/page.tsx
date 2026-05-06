"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function BusinessSettingsPage() {
const [loading, setLoading] = useState(false);

const [businessName, setBusinessName] = useState("");
const [notificationPhone, setNotificationPhone] = useState("");
const [serviceArea, setServiceArea] = useState("");
const [openingHours, setOpeningHours] = useState("");
const [aiGreeting, setAiGreeting] = useState("");
const [twilioNumber, setTwilioNumber] = useState("");
const [vapiAssistantId, setVapiAssistantId] = useState("");

useEffect(() => {
loadBusiness();
}, []);

async function loadBusiness() {
const {
data: { user },
} = await supabase.auth.getUser();

if (!user?.email) return;

const { data } = await supabase
.from("businesses")
.select("*")
.eq("email", user.email.toLowerCase().trim())
.maybeSingle();

if (!data) return;


setBusinessName(data.name || "");
setNotificationPhone(data.notification_phone || "");
setServiceArea(data.service_area || "");
setOpeningHours(data.opening_hours || "");
setAiGreeting(data.ai_greeting || "");
setTwilioNumber(data.twilio_number || "");
setVapiAssistantId(data.vapi_assistant_id || "");
}

async function saveSettings() {
setLoading(true);

const {
data: { user },
} = await supabase.auth.getUser();

if (!user?.email) {
alert("Please login");
setLoading(false);
return;
}

const email = user.email.toLowerCase().trim();

const { error } = await supabase
.from("businesses")
.upsert({
email,
name: businessName,
notification_phone: notificationPhone,
service_area: serviceArea,
opening_hours: openingHours,
ai_greeting: aiGreeting,
twilio_number: twilioNumber,
vapi_assistant_id: vapiAssistantId,
setup_complete: true
});

setLoading(false);

if (error) {
console.error(error);
alert(error.message);
return;
}

alert("Business settings saved");
}

return (
<main
style={{
minHeight: "100vh",
padding: 20,
background:
"radial-gradient(circle at top, #1e3a8a 0%, #08142f 44%, #020617 100%)",
color: "white",
}}
>
<div
style={{
maxWidth: 700,
margin: "0 auto",
background: "rgba(16,34,74,0.92)",
padding: 24,
borderRadius: 24,
border: "1px solid rgba(255,255,255,0.1)",
}}
>
<h1
style={{
fontSize: 42,
marginBottom: 10,
fontWeight: 900,
}}
>
AI Receptionist Settings
</h1>

<p
style={{
opacity: 0.8,
marginBottom: 30,
fontSize: 18,
}}
>
Setup your AI receptionist business profile
</p>

<div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
<input
placeholder="Business name"
value={businessName}
onChange={(e) => setBusinessName(e.target.value)}
style={input}
/>

<input
placeholder="Notification phone"
value={notificationPhone}
onChange={(e) => setNotificationPhone(e.target.value)}
style={input}
/>

<input
placeholder="Service area"
value={serviceArea}
onChange={(e) => setServiceArea(e.target.value)}
style={input}
/>

<input
placeholder="Opening hours"
value={openingHours}
onChange={(e) => setOpeningHours(e.target.value)}
style={input}
/>

<textarea
placeholder="AI greeting"
value={aiGreeting}
onChange={(e) => setAiGreeting(e.target.value)}
style={{
...input,
minHeight: 140,
paddingTop: 18,
}}
/>

<input
placeholder="Twilio number"
value={twilioNumber}
onChange={(e) => setTwilioNumber(e.target.value)}
style={input}
/>

<input
placeholder="Vapi assistant ID"
value={vapiAssistantId}
onChange={(e) => setVapiAssistantId(e.target.value)}
style={input}
/>

<button
onClick={saveSettings}
disabled={loading}
style={{
height: 60,
borderRadius: 18,
border: "none",
background: "linear-gradient(135deg,#7c3aed,#a855f7)",
color: "white",
fontSize: 22,
fontWeight: 900,
cursor: "pointer",
marginTop: 10,
}}
>
{loading ? "Saving..." : "Save Settings"}
</button>
</div>
</div>
</main>
);
}

const input = {
width: "100%",
height: 58,
borderRadius: 16,
border: "1px solid rgba(255,255,255,0.12)",
padding: "0 18px",
fontSize: 18,
outline: "none",
background: "#1a2f5f",
color: "white",
} as const;
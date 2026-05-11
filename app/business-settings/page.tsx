"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function BusinessSettingsPage() {
const router = useRouter();

const [loading, setLoading] = useState(false);
const saveTimer = useRef<NodeJS.Timeout | null>(null);
const [autoSaving, setAutoSaving] = useState(false);
const [lastSaved, setLastSaved] = useState("");
const [checkingPayment, setCheckingPayment] = useState(true);

const [businessName, setBusinessName] = useState("");
const [notificationPhone, setNotificationPhone] = useState("");
const [serviceArea, setServiceArea] = useState("");
const [openingHours, setOpeningHours] = useState("");
const [aiGreeting, setAiGreeting] = useState("");
const [twilioNumber, setTwilioNumber] = useState("");
const [vapiAssistantId, setVapiAssistantId] = useState("");

useEffect(() => {
checkPaidAccess();
loadBusiness();
}, []);

async function checkPaidAccess() {
const {
data: { user },
} = await supabase.auth.getUser();

if (!user?.email) {
router.push("/login");
return;
}

const email = user.email.toLowerCase().trim();

const { data } = await supabase
.from("paid_users")
.select("*")
.eq("email", email)
.eq("is_paid", true)
.maybeSingle();

if (!data) {
const paidFromStripe = window.location.search.includes("paid=true");

if (!paidFromStripe) {
router.push("/ai-receptionist");
return;
}
}

setCheckingPayment(false);
}

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

setBusinessName(data.name || data.business_name || "");
setNotificationPhone(data.notification_phone || data.phone || "");
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

const { error } = await supabase.from("businesses").upsert({
email,
name: businessName,

notification_phone: notificationPhone,
phone: notificationPhone,
service_area: serviceArea,
opening_hours: openingHours,
ai_greeting: aiGreeting,
twilio_number: twilioNumber,
vapi_assistant_id: vapiAssistantId,
setup_complete: true,
});

setLoading(false);

if (error) {
console.error(error);
alert(error.message);
return;
}

alert("Business settings saved. We’ll now set up your AI receptionist.");
router.push("/ai-receptionist");
}
async function autoSaveSettings(field: string, value: string) {
if (saveTimer.current) {
clearTimeout(saveTimer.current);
}

setAutoSaving(true);

saveTimer.current = setTimeout(async () => {
const {
data: { user },
} = await supabase.auth.getUser();

if (!user?.email) return;

const email = user.email.toLowerCase().trim();

await supabase
.from("businesses")
.update({
[field]: value,
})
.eq("email", email);

setAutoSaving(false);
setLastSaved(new Date().toLocaleTimeString());
}, 900);
}
if (checkingPayment) {
return (
<main style={page}>
<div style={loadingCard}>Checking your subscription...</div>
</main>
);
}

return (
<main style={page}>
<button onClick={() => router.push("/ai-receptionist")} style={backBtn}>
‹
</button>

<section style={card}>
<div style={pill}>● AI RECEPTIONIST SETUP</div>

<h1 style={title}>
Business
<span style={purple}> settings</span>
</h1>

<p style={sub}>
Add the details your AI receptionist needs to answer calls, capture
leads and send jobs to your dashboard.
</p>

<div style={notice}>
<b>Setup step:</b> Your AI receptionist will be activated after these
details are saved. Twilio + Vapi can then be connected for this
customer.
</div>

<div style={grid}>
<input
placeholder="Business name"
value={businessName}
onChange={(e) => {
setServiceArea(e.target.value);
autoSaveSettings("service_area", e.target.value);
}}
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
style={textarea}
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

<button onClick={saveSettings} disabled={loading} style={btn}>
{loading ? "Saving..." : "Save & Activate"}
</button>
</div>

<div style={steps}>
<div style={step}>◉ Business details saved</div>
<div style={step}>◎ AI dashboard connected</div>
<div style={step}>ϟ SMS alerts ready</div>
<div style={step}>⬡ Secure lead capture</div>
</div>
</section>
</main>
);
}

const page: React.CSSProperties = {
minHeight: "100vh",
padding: "88px 20px 150px",
color: "white",
fontFamily: "Inter, Arial, sans-serif",
background:
"radial-gradient(circle at 50% -10%, rgba(168,85,247,0.45), transparent 35%), linear-gradient(180deg,#08001f,#020617)",
};

const backBtn: React.CSSProperties = {
position: "absolute",
top: 26,
left: 20,
width: 48,
height: 48,
borderRadius: 16,
border: "1px solid rgba(255,255,255,0.14)",
background: "rgba(255,255,255,0.08)",
color: "white",
fontSize: 34,
};

const card: React.CSSProperties = {
borderRadius: 32,
padding: 22,
background:
"radial-gradient(circle at 82% 18%, rgba(168,85,247,0.24), transparent 34%), linear-gradient(145deg, rgba(67,15,130,0.72), rgba(8,7,30,0.98))",
border: "1px solid rgba(168,85,247,0.65)",
boxShadow: "0 0 40px rgba(126,34,206,0.28)",
};

const loadingCard: React.CSSProperties = {
marginTop: 140,
padding: 24,
borderRadius: 24,
background: "rgba(8,13,35,0.82)",
border: "1px solid rgba(168,85,247,0.22)",
textAlign: "center",
fontWeight: 900,
};

const pill: React.CSSProperties = {
display: "inline-block",
padding: "9px 13px",
borderRadius: 999,
background: "rgba(255,255,255,0.08)",
color: "#4ade80",
fontSize: 12,
fontWeight: 950,
};

const title: React.CSSProperties = {
margin: "24px 0 0",
fontSize: 44,
lineHeight: 0.95,
fontWeight: 950,
letterSpacing: -2,
};

const purple: React.CSSProperties = {
display: "block",
color: "#9b4dff",
};

const sub: React.CSSProperties = {
color: "rgba(255,255,255,0.72)",
fontSize: 15,
lineHeight: 1.5,
};

const notice: React.CSSProperties = {
marginTop: 18,
padding: 16,
borderRadius: 18,
background: "rgba(34,197,94,0.12)",
border: "1px solid rgba(34,197,94,0.18)",
color: "rgba(255,255,255,0.86)",
lineHeight: 1.45,
};

const grid: React.CSSProperties = {
display: "grid",
gap: 12,
marginTop: 20,
};

const input: React.CSSProperties = {
width: "100%",
height: 58,
boxSizing: "border-box",
borderRadius: 16,
border: "1px solid rgba(255,255,255,0.12)",
padding: "0 16px",
fontSize: 16,
outline: "none",
background: "rgba(0,0,0,0.25)",
color: "white",
};

const textarea: React.CSSProperties = {
...input,
height: 140,
paddingTop: 16,
resize: "none",
};

const btn: React.CSSProperties = {
height: 60,
borderRadius: 18,
border: "none",
background: "linear-gradient(90deg,#22c55e,#86efac)",
color: "#04130a",
fontSize: 18,
fontWeight: 950,
cursor: "pointer",
marginTop: 6,
};

const steps: React.CSSProperties = {
marginTop: 22,
display: "grid",
gap: 10,
};

const step: React.CSSProperties = {
padding: 13,
borderRadius: 16,
background: "rgba(8,13,35,0.72)",
border: "1px solid rgba(255,255,255,0.07)",
color: "rgba(255,255,255,0.86)",
fontWeight: 800,
};
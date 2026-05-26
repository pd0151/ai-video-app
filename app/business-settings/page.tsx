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
const [businessPhone, setBusinessPhone] = useState("");
const [businessType, setBusinessType] = useState("");
const [servicesOffered, setServicesOffered] = useState("");
const [detailsToCollect, setDetailsToCollect] = useState("");
const [specialInstructions, setSpecialInstructions] = useState("");
const [notificationPhone, setNotificationPhone] = useState("");
const [serviceArea, setServiceArea] = useState("");
const [openingHours, setOpeningHours] = useState("");
const [aiGreeting, setAiGreeting] = useState("");


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
setBusinessName(data.name || "");
setBusinessPhone(data.phone || "");
setNotificationPhone(data.notification_phone || "");
setBusinessType(data.business_type || "");
setServicesOffered(data.services_offered || "");
setDetailsToCollect(data.details_to_collect || "");
setSpecialInstructions(data.special_instructions || "");
setServiceArea(data.service_area || "");
setOpeningHours(data.opening_hours || "");
setAiGreeting(data.ai_greeting || "");
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
is_paid: true,

phone: businessPhone,
notification_phone: notificationPhone,
service_area: serviceArea,
opening_hours: openingHours,
ai_greeting: aiGreeting,
business_type: businessType,
services_offered: servicesOffered,
details_to_collect: detailsToCollect,
special_instructions: specialInstructions,
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
setBusinessName(e.target.value);
autoSaveSettings("name", e.target.value);
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
onChange={(e) => {
setServiceArea(e.target.value);
autoSaveSettings("service_area", e.target.value);
}}
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
placeholder="Business phone number customers call"
value={businessPhone}
onChange={(e) => setBusinessPhone(e.target.value)}
style={input}
/>

<input
placeholder="What type of business are you?"
value={businessType}
onChange={(e) => setBusinessType(e.target.value)}
style={input}
/>

<textarea
placeholder="What services do you offer?"
value={servicesOffered}
onChange={(e) => setServicesOffered(e.target.value)}
style={textarea}
/>

<textarea
placeholder="What details should the AI collect from callers?"
value={detailsToCollect}
onChange={(e) => setDetailsToCollect(e.target.value)}
style={textarea}
/>

<textarea
placeholder="Any special instructions for your AI receptionist?"
value={specialInstructions}
onChange={(e) => setSpecialInstructions(e.target.value)}
style={textarea}
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

const xeonBorder = "1px solid rgba(220,235,255,0.28)";
const xeonGlow =
"0 0 3px rgba(255,255,255,0.55), 0 0 22px rgba(220,235,255,0.28), 0 0 60px rgba(120,160,255,0.16)";
const xeonGlowStrong =
"0 0 6px rgba(255,255,255,0.85), 0 0 30px rgba(220,235,255,0.45), 0 0 75px rgba(120,160,255,0.22)";
const glassBg = "rgba(8,12,22,0.78)";
const cardBg = "rgba(10,14,24,0.92)";
const whiteBtn = "linear-gradient(180deg,#ffffff,#eaf0ff)";

const page: React.CSSProperties = {
minHeight: "100vh",
padding: "88px 20px 150px",
color: "white",
fontFamily: "Inter, Arial, sans-serif",
background:
"radial-gradient(circle at 72% 0%, rgba(220,235,255,0.10), transparent 34%), radial-gradient(circle at 28% 35%, rgba(120,160,255,0.10), transparent 32%), #05070d",
};

const backBtn: React.CSSProperties = {
position: "absolute",
top: 26,
left: 20,
width: 48,
height: 48,
borderRadius: 16,
border: xeonBorder,
background: glassBg,
color: "white",
fontSize: 34,
boxShadow: xeonGlow,
backdropFilter: "blur(16px)",
};

const card: React.CSSProperties = {
borderRadius: 32,
padding: 22,
background: cardBg,
border: xeonBorder,
boxShadow: xeonGlowStrong,
backdropFilter: "blur(18px)",
};

const loadingCard: React.CSSProperties = {
marginTop: 140,
padding: 24,
borderRadius: 24,
background: cardBg,
border: xeonBorder,
textAlign: "center",
fontWeight: 900,
boxShadow: xeonGlowStrong,
};

const pill: React.CSSProperties = {
display: "inline-block",
padding: "9px 13px",
borderRadius: 999,
background: glassBg,
color: "#ffffff",
fontSize: 12,
fontWeight: 950,
border: xeonBorder,
boxShadow: xeonGlow,
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
color: "#ffffff",
textShadow: "0 0 18px rgba(220,235,255,0.45)",
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
background: glassBg,
border: xeonBorder,
color: "rgba(255,255,255,0.86)",
lineHeight: 1.45,
boxShadow: xeonGlow,
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
border: xeonBorder,
padding: "0 16px",
fontSize: 16,
outline: "none",
background: glassBg,
color: "white",
boxShadow: xeonGlow,
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
border: "1px solid rgba(255,255,255,0.78)",
background: whiteBtn,
color: "#05070d",
fontSize: 18,
fontWeight: 950,
cursor: "pointer",
marginTop: 6,
boxShadow: xeonGlowStrong,
};

const steps: React.CSSProperties = {
marginTop: 22,
display: "grid",
gap: 10,
};

const step: React.CSSProperties = {
padding: 13,
borderRadius: 16,
background: glassBg,
border: xeonBorder,
color: "rgba(255,255,255,0.86)",
fontWeight: 800,
boxShadow: xeonGlow,
};
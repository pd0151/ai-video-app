"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

const ADMIN_EMAILS = ["totaltyres247ltd@gmail.com", "peterdillon809@gmail.com"];

export default function AdminAISetupPage() {
const router = useRouter();
const [businesses, setBusinesses] = useState<any[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
checkAdmin();
}, []);

async function checkAdmin() {
const {
data: { user },
} = await supabase.auth.getUser();

const email = user?.email?.toLowerCase().trim();

if (!email || !ADMIN_EMAILS.includes(email)) {
alert("Admin only");
router.push("/");
return;
}

await loadBusinesses();
setLoading(false);
}

async function loadBusinesses() {
const { data, error } = await supabase
.from("businesses")
.select("*")
.eq("is_paid", true)
.eq("setup_complete", true)
.order("created_at", { ascending: false });

if (error) {
alert(error.message);
return;
}

setBusinesses(data || []);
}

function updateLocal(id: string, field: string, value: string) {
setBusinesses((prev) =>
prev.map((b) => (b.id === id ? { ...b, [field]: value } : b))
);
}

async function saveCustomer(b: any) {
const { error } = await supabase
.from("businesses")
.update({
twilio_number: b.twilio_number || "",
vapi_assistant_id: b.vapi_assistant_id || "",
ai_activated: b.ai_activated || false,
setup_complete: true,
})
.eq("id", b.id);

if (error) {
alert(error.message);
return;
}

alert("Customer setup saved");
loadBusinesses();
}

async function markActivated(b: any) {
const { error } = await supabase
.from("businesses")
.update({
twilio_number: b.twilio_number || "",
vapi_assistant_id: b.vapi_assistant_id || "",
ai_activated: true,
setup_complete: true,

name: b.name || "",
is_paid: true,
})
.eq("id", b.id);

if (error) {
alert(error.message);
return;
}

alert("Customer marked activated");
loadBusinesses();
}

if (loading) {
return (
<main style={page}>
<div style={emptyCard}>Checking admin access...</div>
</main>
);
}

const waiting = businesses.filter((b) => !b.ai_activated).length;
const active = businesses.filter((b) => b.ai_activated).length;

return (
<main style={page}>
<button onClick={() => router.push("/ai-receptionist")} style={backBtn}>
‹
</button>

<section style={hero}>
<div style={pill}>● ADMIN AI SETUP</div>

<h1 style={title}>
Customer
<span style={purple}> activation</span>
</h1>

<p style={sub}>
Add Twilio numbers and Vapi assistant IDs, then activate each paid AI
receptionist customer.
</p>

<div style={statsGrid}>
<div style={statCard}>
<h2 style={statNumber}>{businesses.length}</h2>
<p style={statText}>Paid customers</p>
</div>

<div style={statCard}>
<h2 style={statNumber}>{waiting}</h2>
<p style={statText}>Waiting setup</p>
</div>

<div style={statCard}>
<h2 style={statNumber}>{active}</h2>
<p style={statText}>Activated</p>
</div>
</div>
</section>

{businesses.length === 0 ? (
<div style={emptyCard}>No paid customers yet.</div>
) : (
businesses.map((b) => (
<section key={b.id} style={card}>
<div style={cardTop}>
<div>
<p style={mini}>BUSINESS</p>
<h2 style={businessTitle}>{b.name || "Business"}</h2>
</div>

<span style={b.ai_activated ? activeBadge : waitingBadge}>
{b.ai_activated ? "ACTIVE" : "WAITING"}
</span>
</div>

<div style={infoGrid}>
<p>
<b>Email:</b> {b.email || "Not set"}
</p>
<p>
<b>Phone:</b> {b.notification_phone || b.phone || "Not set"}
</p>
<p>
<b>Area:</b> {b.service_area || "Not set"}
</p>
<p>
<b>Opening hours:</b> {b.opening_hours || "Not set"}
</p>
<p>
<b>Greeting:</b> {b.ai_greeting || "Not set"}
</p>
<p>
<b>Business ID:</b> {b.id}
</p>
</div>

<div style={inputGrid}>
<input
style={input}
placeholder="Twilio number"
value={b.twilio_number || ""}
onChange={(e) =>
updateLocal(b.id, "twilio_number", e.target.value)
}
/>

<input
style={input}
placeholder="Vapi assistant ID"
value={b.vapi_assistant_id || ""}
onChange={(e) =>
updateLocal(b.id, "vapi_assistant_id", e.target.value)
}
/>
</div>

<div style={actions}>
<button onClick={() => saveCustomer(b)} style={saveBtn}>
Save
</button>

<button onClick={() => markActivated(b)} style={activateBtn}>
✅ Mark Activated
</button>
</div>
</section>
))
)}
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

const hero: React.CSSProperties = {
borderRadius: 32,
padding: 22,
background:
"radial-gradient(circle at 82% 18%, rgba(168,85,247,0.24), transparent 34%), linear-gradient(145deg, rgba(67,15,130,0.72), rgba(8,7,30,0.98))",
border: "1px solid rgba(168,85,247,0.65)",
boxShadow: "0 0 40px rgba(126,34,206,0.28)",
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

const statsGrid: React.CSSProperties = {
marginTop: 20,
display: "grid",
gridTemplateColumns: "repeat(3, 1fr)",
gap: 10,
};

const statCard: React.CSSProperties = {
padding: 14,
borderRadius: 18,
background: "rgba(8,13,35,0.76)",
border: "1px solid rgba(255,255,255,0.08)",
};

const statNumber: React.CSSProperties = {
margin: 0,
fontSize: 34,
fontWeight: 950,
};

const statText: React.CSSProperties = {
margin: "6px 0 0",
fontSize: 12,
color: "rgba(255,255,255,0.68)",
fontWeight: 800,
};

const card: React.CSSProperties = {
marginTop: 18,
padding: 18,
borderRadius: 26,
background: "rgba(8,13,35,0.82)",
border: "1px solid rgba(168,85,247,0.22)",
boxShadow: "0 0 22px rgba(126,34,206,0.14)",
};

const emptyCard: React.CSSProperties = {
marginTop: 20,
padding: 22,
borderRadius: 24,
background: "rgba(8,13,35,0.82)",
border: "1px solid rgba(255,255,255,0.1)",
textAlign: "center",
fontWeight: 900,
};

const cardTop: React.CSSProperties = {
display: "flex",
justifyContent: "space-between",
gap: 12,
alignItems: "center",
};

const mini: React.CSSProperties = {
margin: 0,
fontSize: 11,
letterSpacing: 1,
opacity: 0.55,
fontWeight: 950,
};

const businessTitle: React.CSSProperties = {
margin: "5px 0 0",
fontSize: 26,
fontWeight: 950,
};

const waitingBadge: React.CSSProperties = {
padding: "8px 11px",
borderRadius: 999,
background: "rgba(245,158,11,0.14)",
color: "#fbbf24",
fontSize: 11,
fontWeight: 950,
};

const activeBadge: React.CSSProperties = {
padding: "8px 11px",
borderRadius: 999,
background: "rgba(34,197,94,0.16)",
color: "#86efac",
fontSize: 11,
fontWeight: 950,
};

const infoGrid: React.CSSProperties = {
marginTop: 16,
padding: 14,
borderRadius: 18,
background: "rgba(0,0,0,0.24)",
lineHeight: 1.6,
color: "rgba(255,255,255,0.82)",
};

const inputGrid: React.CSSProperties = {
display: "grid",
gap: 10,
marginTop: 14,
};

const input: React.CSSProperties = {
width: "100%",
boxSizing: "border-box",
height: 54,
borderRadius: 15,
border: "1px solid rgba(255,255,255,0.12)",
padding: "0 14px",
fontSize: 15,
outline: "none",
background: "rgba(0,0,0,0.25)",
color: "white",
};

const actions: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "1fr 1.4fr",
gap: 10,
marginTop: 14,
};

const saveBtn: React.CSSProperties = {
padding: 15,
borderRadius: 16,
border: "1px solid rgba(255,255,255,0.14)",
background: "rgba(255,255,255,0.08)",
color: "white",
fontWeight: 900,
fontSize: 15,
};

const activateBtn: React.CSSProperties = {
padding: 15,
borderRadius: 16,
border: "none",
background: "linear-gradient(90deg,#22c55e,#86efac)",
color: "#04130a",
fontWeight: 950,
fontSize: 15,
};
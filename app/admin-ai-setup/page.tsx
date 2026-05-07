"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);
const ADMIN_EMAIL = "peterdillon809@gmail.com";
export default function AdminAISetupPage() {
const [businesses, setBusinesses] = useState<any[]>([]);

useEffect(() => {
checkAdmin();
loadBusinesses();
}, []);
async function checkAdmin() {
const {
data: { user },
} = await supabase.auth.getUser();

if (!user || user.email !== ADMIN_EMAIL) {
window.location.href = "/";
return;
}
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

return (
<main style={page}>
<h1 style={title}>AI Customer Setup</h1>
<p style={sub}>Paid customers waiting for Twilio/Vapi activation</p>

{businesses.length === 0 ? (
<div style={card}>No paid customers waiting yet.</div>
) : (
businesses.map((b) => (
<div key={b.id} style={card}>
<h2>{b.name || "Business"}</h2>
<p><b>Email:</b> {b.email}</p>
<p><b>Phone:</b> {b.notification_phone}</p>
<p><b>Area:</b> {b.service_area}</p>
<p><b>Opening hours:</b> {b.opening_hours}</p>
<p><b>Greeting:</b> {b.ai_greeting}</p>
<p><b>Twilio number:</b> {b.twilio_number || "Not added yet"}</p>
<p><b>Vapi assistant ID:</b> {b.vapi_assistant_id || "Not added yet"}</p>
<p><b>Business ID:</b> {b.id}</p>
</div>
))
)}
</main>
);
}

const page: React.CSSProperties = {
minHeight: "100vh",
padding: 24,
color: "white",
background:
"radial-gradient(circle at top, #1e3a8a 0%, #08142f 44%, #020617 100%)",
};

const title: React.CSSProperties = {
fontSize: 42,
fontWeight: 900,
};

const sub: React.CSSProperties = {
fontSize: 18,
opacity: 0.8,
};

const card: React.CSSProperties = {
marginTop: 20,
padding: 22,
borderRadius: 22,
background: "rgba(15,23,42,0.82)",
border: "1px solid rgba(255,255,255,0.12)",
};
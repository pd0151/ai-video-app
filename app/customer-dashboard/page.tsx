"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

type Lead = {
id: string;
phone: string;
job: string;
location: string;
status: string;
created_at: string;
};

const xeonBorder = "1px solid rgba(220,235,255,0.28)";
const xeonGlow =
"0 0 3px rgba(255,255,255,0.55), 0 0 22px rgba(220,235,255,0.28), 0 0 60px rgba(120,160,255,0.16)";
const xeonGlowStrong =
"0 0 6px rgba(255,255,255,0.85), 0 0 30px rgba(220,235,255,0.45), 0 0 75px rgba(120,160,255,0.22)";
const cardBg = "rgba(10,14,24,0.92)";

export default function CustomerDashboard() {
const [leads, setLeads] = useState<Lead[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
loadLeads();
}, []);

async function loadLeads() {
const {
data: { user },
} = await supabase.auth.getUser();

if (!user?.email) return;

const { data: business } = await supabase
.from("businesses")
.select("*")
.eq("email", user.email)
.single();

if (!business) return;

const { data } = await supabase
.from("leads")
.select("*")
.eq("business_id", business.id)
.order("created_at", { ascending: false });

setLeads(data || []);
setLoading(false);
}

return (
<main style={page}>
<h1 style={title}>AI Leads Dashboard</h1>

{loading ? (
<div style={emptyBox}>Loading...</div>
) : leads.length === 0 ? (
<div style={emptyBox}>No leads yet.</div>
) : (
leads.map((lead) => (
<div key={lead.id} style={leadCard}>
<p><b>Customer:</b> {lead.phone}</p>
<p><b>Location:</b> {lead.location}</p>
<p><b>Job:</b> {lead.job}</p>
<p><b>Status:</b> {lead.status}</p>
</div>
))
)}
</main>
);
}

const page: React.CSSProperties = {
minHeight: "100vh",
background:
"radial-gradient(circle at 72% 0%, rgba(220,235,255,0.10), transparent 34%), radial-gradient(circle at 28% 35%, rgba(120,160,255,0.10), transparent 32%), #05070d",
color: "white",
padding: 20,
fontFamily: "Inter, Arial, sans-serif",
};

const title: React.CSSProperties = {
fontSize: 42,
fontWeight: 950,
margin: "0 0 24px",
textShadow: "0 0 22px rgba(220,235,255,0.35)",
};

const leadCard: React.CSSProperties = {
background: cardBg,
padding: 20,
borderRadius: 20,
marginTop: 20,
border: xeonBorder,
boxShadow: xeonGlow,
backdropFilter: "blur(16px)",
};

const emptyBox: React.CSSProperties = {
background: cardBg,
padding: 22,
borderRadius: 20,
border: xeonBorder,
boxShadow: xeonGlowStrong,
color: "rgba(255,255,255,0.82)",
fontWeight: 900,
};
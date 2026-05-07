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
<main
style={{
minHeight: "100vh",
background: "#020617",
color: "white",
padding: 20,
}}
>
<h1 style={{ fontSize: 42, fontWeight: 900 }}>
AI Leads Dashboard
</h1>

{loading ? (
<p>Loading...</p>
) : leads.length === 0 ? (
<p>No leads yet.</p>
) : (
leads.map((lead) => (
<div
key={lead.id}
style={{
background: "#0f172a",
padding: 20,
borderRadius: 20,
marginTop: 20,
border: "1px solid #1e293b",
}}
>
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
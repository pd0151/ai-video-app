"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RecoveryJobsPage() {
const [jobs, setJobs] = useState<any[]>([]);

useEffect(() => {
loadJobs();
}, []);

async function loadJobs() {
const { data } = await supabase
.from("recovery_jobs")
.select("*")
.eq("status", "open")
.order("created_at", { ascending: false });

setJobs(data || []);
}

async function acceptJob(id: string) {
const { error } = await supabase
.from("recovery_jobs")
.update({
status: "accepted",
accepted_by: "Total Recovery",
})
.eq("id", id)
.eq("status", "open");

if (error) {
alert(error.message);
return;
}

loadJobs();
}

return (
<div
style={{
minHeight: "100vh",
background:
"radial-gradient(circle at top, rgba(34,197,94,0.15), transparent 35%), #05070d",
color: "#fff",
padding: "34px 20px 120px",
}}
>
<p
style={{
letterSpacing: 8,
fontSize: 12,
color: "rgba(255,255,255,0.45)",
fontWeight: 900,
marginBottom: 8,
}}
>
TOTAL RECOVERY
</p>

<h1
style={{
fontSize: 44,
lineHeight: 1,
margin: 0,
fontWeight: 950,
}}
>
Live Recovery Jobs
</h1>

<p
style={{
marginTop: 14,
color: "rgba(255,255,255,0.6)",
fontSize: 16,
}}
>
New recovery leads captured by AI.
</p>

<div style={{ marginTop: 28 }}>
{jobs.length === 0 && (
<div
style={{
padding: 24,
borderRadius: 28,
border: "1px solid rgba(255,255,255,0.1)",
background: "rgba(255,255,255,0.04)",
color: "rgba(255,255,255,0.65)",
}}
>
No live recovery jobs right now.
</div>
)}

{jobs.map((job) => {
const phone = String(job.customer_phone || "").replace(/\s/g, "");
const whatsapp = phone.startsWith("0")
? `44${phone.slice(1)}`
: phone;

return (
<div
key={job.id}
style={{
marginBottom: 22,
padding: 24,
borderRadius: 34,
border: "1px solid rgba(255,255,255,0.12)",
background:
"linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025))",
boxShadow: "0 0 40px rgba(34,197,94,0.10)",
}}
>
<div
style={{
display: "inline-block",
padding: "9px 14px",
borderRadius: 999,
background: "rgba(34,197,94,0.18)",
color: "#4ade80",
fontSize: 12,
fontWeight: 950,
letterSpacing: 3,
marginBottom: 18,
}}
>
LIVE JOB
</div>

<h2 style={{ fontSize: 30, margin: "0 0 18px", fontWeight: 950 }}>
{job.vehicle || "Vehicle not given"}
</h2>

<p style={detailStyle}>
<strong>Location</strong>
<br />
{job.location || "Not given"}
</p>

<p style={detailStyle}>
<strong>Issue</strong>
<br />
{job.issue || "Recovery needed"}
</p>

<p style={detailStyle}>
<strong>Customer Phone</strong>
<br />
{job.customer_phone || "Not given"}
</p>

<div
style={{
display: "flex",
flexDirection: "column",
gap: 12,
marginTop: 22,
}}
>
<a href={`tel:${phone}`} style={whiteBtn}>
Call Customer
</a>

<a
href={`https://wa.me/${whatsapp}`}
target="_blank"
style={greenBtn}
>
WhatsApp Customer
</a>

<button onClick={() => acceptJob(job.id)} style={darkBtn}>
Accept Job
</button>
</div>
</div>
);
})}
</div>
</div>
);
}

const detailStyle: React.CSSProperties = {
fontSize: 18,
lineHeight: 1.45,
color: "rgba(255,255,255,0.82)",
margin: "0 0 16px",
};

const whiteBtn: React.CSSProperties = {
display: "block",
textAlign: "center",
padding: "15px 18px",
borderRadius: 999,
background: "#ffffff",
color: "#05070d",
fontWeight: 950,
fontSize: 16,
textDecoration: "none",
};

const greenBtn: React.CSSProperties = {
display: "block",
textAlign: "center",
padding: "15px 18px",
borderRadius: 999,
background: "linear-gradient(135deg,#22c55e,#4ade80)",
color: "#05070d",
fontWeight: 950,
fontSize: 16,
textDecoration: "none",
};

const darkBtn: React.CSSProperties = {
padding: "15px 18px",
borderRadius: 999,
border: "1px solid rgba(255,255,255,0.16)",
background: "rgba(255,255,255,0.06)",
color: "#fff",
fontWeight: 950,
fontSize: 16,
};
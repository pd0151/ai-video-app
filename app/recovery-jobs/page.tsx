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
accepted_by: "AdForge Recovery",
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
<main style={page}>
<div style={brandRow}>
<div>
<div style={smallCaps}>AI RECOVERY PLATFORM</div>
<div style={logo}>
Ad<span style={{ color: "#35ff7a" }}>Forge</span>
</div>
</div>

<div style={livePill}>LIVE JOBS</div>
</div>

<section style={heroCard}>
<div style={statusPill}>• RECOVERY DISPATCH SYSTEM</div>

<h1 style={title}>Live Recovery Jobs</h1>

<p style={subtitle}>
Jobs captured by AdForge AI. Call, WhatsApp or accept the lead
instantly.
</p>

<div style={jobsWrap}>
{jobs.length === 0 && (
<div style={emptyCard}>No live recovery jobs right now.</div>
)}

{jobs.map((job) => {
const phone = String(job.customer_phone || "").replace(/\s/g, "");
const whatsapp = phone.startsWith("0") ? `44${phone.slice(1)}` : phone;

return (
<article key={job.id} style={jobCard}>
<div style={jobTop}>
<span style={jobBadge}>NEW JOB</span>
<span style={jobStatus}>OPEN</span>
</div>

<h2 style={vehicle}>{job.vehicle || "Vehicle not given"}</h2>

<div style={infoBox}>
<p style={label}>Location</p>
<p style={value}>{job.location || "Not given"}</p>

<p style={label}>Issue</p>
<p style={value}>{job.issue || "Recovery needed"}</p>

<p style={label}>Customer Phone</p>
<p style={value}>{job.customer_phone || "Not given"}</p>
</div>

<div style={buttonStack}>
<a href={`tel:${phone}`} style={whiteBtn}>
Call Customer
</a>

<a
href={`https://wa.me/${whatsapp}`}
target="_blank"
style={darkBtn}
>
WhatsApp Customer
</a>

<button onClick={() => acceptJob(job.id)} style={acceptBtn}>
Accept Job
</button>
</div>
</article>
);
})}
</div>
</section>
</main>
);
}

const page: React.CSSProperties = {
minHeight: "100vh",
background: "#05070d",
color: "#fff",
padding: "34px 20px 130px",
};

const brandRow: React.CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
gap: 16,
marginBottom: 26,
};

const smallCaps: React.CSSProperties = {
fontSize: 12,
letterSpacing: 7,
fontWeight: 900,
color: "rgba(255,255,255,0.42)",
};

const logo: React.CSSProperties = {
fontSize: 44,
fontWeight: 950,
letterSpacing: -2,
marginTop: 6,
};

const livePill: React.CSSProperties = {
padding: "12px 16px",
borderRadius: 999,
background: "rgba(255,255,255,0.92)",
color: "#05070d",
fontWeight: 950,
fontSize: 13,
boxShadow: "0 0 28px rgba(255,255,255,0.16)",
};

const heroCard: React.CSSProperties = {
borderRadius: 34,
border: "1px solid rgba(255,255,255,0.12)",
background:
"linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.025))",
padding: 24,
boxShadow: "0 0 46px rgba(255,255,255,0.06)",
};

const statusPill: React.CSSProperties = {
display: "inline-block",
padding: "13px 18px",
borderRadius: 999,
background: "#35ff7a",
color: "#05070d",
fontWeight: 950,
fontSize: 13,
letterSpacing: 3,
marginBottom: 22,
boxShadow: "0 0 28px rgba(53,255,122,0.38)",
};

const title: React.CSSProperties = {
fontSize: 44,
lineHeight: 0.98,
margin: 0,
fontWeight: 950,
letterSpacing: -1,
};

const subtitle: React.CSSProperties = {
color: "rgba(255,255,255,0.62)",
fontSize: 18,
lineHeight: 1.45,
marginTop: 16,
};

const jobsWrap: React.CSSProperties = {
marginTop: 24,
};

const emptyCard: React.CSSProperties = {
padding: 24,
borderRadius: 26,
border: "1px solid rgba(255,255,255,0.12)",
color: "rgba(255,255,255,0.62)",
};

const jobCard: React.CSSProperties = {
padding: 22,
borderRadius: 30,
border: "1px solid rgba(255,255,255,0.12)",
background: "#070a12",
marginBottom: 18,
};

const jobTop: React.CSSProperties = {
display: "flex",
justifyContent: "space-between",
gap: 12,
marginBottom: 18,
};

const jobBadge: React.CSSProperties = {
fontSize: 12,
fontWeight: 950,
letterSpacing: 3,
color: "#35ff7a",
};

const jobStatus: React.CSSProperties = {
fontSize: 12,
fontWeight: 950,
color: "rgba(255,255,255,0.55)",
};

const vehicle: React.CSSProperties = {
fontSize: 30,
margin: "0 0 18px",
fontWeight: 950,
};

const infoBox: React.CSSProperties = {
padding: 18,
borderRadius: 24,
background: "rgba(255,255,255,0.045)",
border: "1px solid rgba(255,255,255,0.08)",
};

const label: React.CSSProperties = {
margin: "0 0 4px",
fontSize: 12,
letterSpacing: 2,
fontWeight: 950,
color: "rgba(255,255,255,0.42)",
textTransform: "uppercase",
};

const value: React.CSSProperties = {
margin: "0 0 16px",
fontSize: 18,
lineHeight: 1.35,
color: "rgba(255,255,255,0.9)",
};

const buttonStack: React.CSSProperties = {
display: "flex",
flexDirection: "column",
gap: 12,
marginTop: 18,
};

const whiteBtn: React.CSSProperties = {
display: "block",
textAlign: "center",
padding: "16px 18px",
borderRadius: 999,
background: "#ffffff",
color: "#05070d",
fontWeight: 950,
fontSize: 16,
textDecoration: "none",
};

const darkBtn: React.CSSProperties = {
display: "block",
textAlign: "center",
padding: "16px 18px",
borderRadius: 999,
background: "rgba(255,255,255,0.08)",
color: "#fff",
fontWeight: 950,
fontSize: 16,
textDecoration: "none",
border: "1px solid rgba(255,255,255,0.14)",
};

const acceptBtn: React.CSSProperties = {
padding: "16px 18px",
borderRadius: 999,
border: "0",
background: "#35ff7a",
color: "#05070d",
fontWeight: 950,
fontSize: 16,
boxShadow: "0 0 26px rgba(53,255,122,0.32)",
};
"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

type Lead = {
id: string;
phone: string | null;
job: string | null;
location: string | null;
created_at: string | null;
status: string | null;
business_id?: string | null;
name?: string | null;
vehicle?: string | null;
tyre_size?: string | null;
issue?: string | null;
};

export default function AIReceptionistPage() {
const router = useRouter();

const [leads, setLeads] = useState<Lead[]>([]);
const [loading, setLoading] = useState(false);
const [isPaid, setIsPaid] = useState(false);
const [setupComplete, setSetupComplete] = useState(false);

async function loadLeads() {
const {
data: { user },
} = await supabase.auth.getUser();

if (!user?.email) return;

const email = user.email.toLowerCase().trim();

const { data: business } = await supabase
.from("businesses")
.select("id")
.eq("email", email)
.maybeSingle();

if (!business?.id) return;

const { data } = await supabase
.from("leads")
.select("*")
.eq("business_id", business.id)
.order("created_at", { ascending: false });

setLeads(data || []);
}

async function checkSubscription() {
const {
data: { user },
} = await supabase.auth.getUser();

if (!user?.email) return;

const email = user.email.toLowerCase().trim();

const { data } = await supabase
.from("businesses")
.select("is_paid,ai_activated")
.eq("email", email)
.eq("is_paid", true)
.maybeSingle();

setIsPaid(!!data);
setSetupComplete(!!data?.ai_activated);
}

async function testLead() {
setLoading(true);

const {
data: { user },
} = await supabase.auth.getUser();

const email = user?.email?.toLowerCase().trim();

const { data: business } = await supabase
.from("businesses")
.select("id")
.eq("email", email)
.maybeSingle();

await fetch("/api/leads", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
business_id: business?.id,
name: "Test Customer",
customer_phone: "07385182500",
vehicle: "BMW 1 Series",
tyre_size: "225/40/18",
postcode: "L1 0AA",
issue: "Puncture repair needed",
}),
});

await loadLeads();
setLoading(false);
}

async function updateStatus(id: string, status: string) {
await supabase.from("leads").update({ status }).eq("id", id);

await loadLeads();
}

useEffect(() => {
loadLeads();
checkSubscription();

const interval = setInterval(() => {
loadLeads();
}, 5000);

return () => clearInterval(interval);
}, []);

const stats = useMemo(() => {
return {
calls: leads.length,
captured: leads.length,
newJobs: leads.filter(
(l) => !l.status || l.status === "new"
).length,
};
}, [leads]);

return (
<main style={page}>
<button onClick={() => router.push("/")} style={backBtn}>
←
</button>

<button style={logoutBtn}>Logout</button>

<section style={hero}>
<div style={heroTop}>
<div style={badge}>● LIVE AI CALL SYSTEM</div>
<div style={onlineBadge}>🟢 AI Online</div>
</div>

<div style={heroGrid}>
<div>
<h1 style={title}>
Never miss
<br />
<span style={purpleText}>another job</span>
</h1>

<div style={setupBox}>
{setupComplete
? "✅ AI Receptionist Setup Complete"
: "⏳ Waiting For Setup"}
</div>

<p style={sub}>
AI answers missed calls, captures customer details and
sends the job straight to your dashboard.
</p>

<button onClick={testLead} style={greenBtn}>
{loading ? "Sending..." : "🔥 Test Lead"}
</button>
</div>

<div style={botWrap}>
<div style={botGlow}></div>

<div style={botHead}>
<div style={botEye}></div>
<div style={botEye}></div>
<div style={botSmile}>⌣</div>
</div>

<div style={botBase}>AI</div>
</div>
</div>

<div style={featureGrid}>
<Feature
icon="📞"
title="AI Online"
text="Always ready to answer"
/>

<Feature
icon="🕘"
title="24/7 Coverage"
text="Never miss a call"
/>

<Feature
icon="⚡"
title="Instant Alerts"
text="SMS as soon as it lands"
/>

<Feature
icon="🔒"
title="Secure & Safe"
text="Your data is protected"
/>
</div>
</section>

<section style={statsRow}>
<Stat value={String(stats.calls)} label="Calls handled" />
<Stat value={String(stats.captured)} label="Leads captured" />
<Stat value={String(stats.newJobs)} label="New jobs" />
</section>

<section style={panel}>
<h2 style={panelTitle}>📋 Live Leads</h2>

{leads.map((lead) => {
const whatsapp = lead.phone?.replace("+", "");

return (
<div key={lead.id} style={leadCard}>
<div style={leadTop}>
<div>
<p style={smallLabel}>PHONE</p>
<h3 style={phone}>
{lead.phone || "Unknown"}
</h3>
</div>

<span style={hotBadge}>
{(lead.status || "new").toUpperCase()}
</span>
</div>

<div style={infoBox}>
<p>
<b>👤 Customer:</b>{" "}
{lead.name || "Not provided"}
</p>

<p>
<b>🚗 Vehicle:</b>{" "}
{lead.vehicle || "Not provided"}
</p>

<p>
<b>🛞 Tyre size:</b>{" "}
{lead.tyre_size || "Not provided"}
</p>

<p>
<b>⚠️ Issue:</b>{" "}
{lead.issue || "No details"}
</p>

<p>
<b>📍 Location:</b>{" "}
{lead.location || "Unknown"}
</p>
</div>

<div style={leadButtons}>
<a href={`tel:${lead.phone}`} style={callBtn}>
📞 Call
</a>

<a
href={`https://wa.me/${whatsapp}`}
target="_blank"
style={waBtn}
>
💬 WhatsApp
</a>
</div>

<div style={statusRow}>
<button
onClick={() =>
updateStatus(lead.id, "new")
}
style={miniBtn}
>
New
</button>

<button
onClick={() =>
updateStatus(lead.id, "contacted")
}
style={miniBtn}
>
Contacted
</button>

<button
onClick={() =>
updateStatus(lead.id, "booked")
}
style={miniBtn}
>
Booked
</button>

<button
onClick={() =>
updateStatus(lead.id, "done")
}
style={miniBtn}
>
Done
</button>
</div>
</div>
);
})}
</section>
</main>
);
}

function Stat({
value,
label,
}: {
value: string;
label: string;
}) {
return (
<div style={statCard}>
<h2 style={statValue}>{value}</h2>
<p style={statLabel}>{label}</p>
</div>
);
}

function Feature({
icon,
title,
text,
}: {
icon: string;
title: string;
text: string;
}) {
return (
<div style={featureCard}>
<div style={featureIcon}>{icon}</div>
<h3>{title}</h3>
<p>{text}</p>
</div>
);
}

const page: React.CSSProperties = {
minHeight: "100vh",
padding: 22,
paddingTop: 70,
paddingBottom: 140,
background:
"radial-gradient(circle at top, #4c1d95 0%, #16072f 35%, #020617 100%)",
color: "white",
fontFamily: "Arial",
};

const backBtn: React.CSSProperties = {
position: "absolute",
top: 20,
left: 20,
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.15)",
color: "white",
borderRadius: 14,
padding: "10px 16px",
};

const logoutBtn: React.CSSProperties = {
position: "absolute",
top: 20,
right: 20,
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.15)",
color: "white",
borderRadius: 14,
padding: "10px 18px",
fontWeight: 700,
};

const hero: React.CSSProperties = {
background:
"linear-gradient(145deg, rgba(126,34,206,0.5), rgba(15,23,42,0.95))",
border: "1px solid rgba(168,85,247,0.45)",
borderRadius: 34,
padding: 28,
marginBottom: 18,
};

const heroTop: React.CSSProperties = {
display: "flex",
justifyContent: "space-between",
marginBottom: 24,
};

const badge: React.CSSProperties = {
background: "rgba(34,197,94,0.16)",
color: "#4ade80",
padding: "10px 14px",
borderRadius: 999,
fontWeight: 900,
fontSize: 13,
};

const onlineBadge: React.CSSProperties = {
background: "rgba(15,23,42,0.7)",
border: "1px solid rgba(255,255,255,0.15)",
padding: "10px 14px",
borderRadius: 999,
fontWeight: 800,
};

const heroGrid: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: 20,
alignItems: "center",
};

const title: React.CSSProperties = {
fontSize: 72,
lineHeight: 0.92,
fontWeight: 950,
marginBottom: 24,
};

const purpleText: React.CSSProperties = {
color: "#a855f7",
};

const setupBox: React.CSSProperties = {
background: "rgba(255,255,255,0.08)",
borderRadius: 18,
padding: 18,
marginBottom: 20,
fontWeight: 800,
};

const sub: React.CSSProperties = {
opacity: 0.8,
lineHeight: 1.6,
fontSize: 18,
};

const greenBtn: React.CSSProperties = {
marginTop: 22,
padding: "18px 30px",
borderRadius: 20,
border: "none",
background: "linear-gradient(90deg,#22c55e,#86efac)",
color: "#02140a",
fontWeight: 900,
fontSize: 18,
};

const botWrap: React.CSSProperties = {
position: "relative",
height: 320,
display: "flex",
justifyContent: "center",
alignItems: "center",
};

const botGlow: React.CSSProperties = {
position: "absolute",
width: 260,
height: 260,
borderRadius: "50%",
background: "radial-gradient(circle,#9333ea,transparent 70%)",
};

const botHead: React.CSSProperties = {
width: 180,
height: 160,
borderRadius: 40,
background: "linear-gradient(145deg,#111827,#020617)",
border: "5px solid #8b5cf6",
display: "flex",
justifyContent: "center",
alignItems: "center",
gap: 24,
position: "relative",
};

const botEye: React.CSSProperties = {
width: 18,
height: 18,
borderRadius: "50%",
background: "#4ade80",
};

const botSmile: React.CSSProperties = {
position: "absolute",
bottom: 24,
color: "#4ade80",
fontSize: 28,
};

const botBase: React.CSSProperties = {
position: "absolute",
bottom: 20,
background: "linear-gradient(90deg,#7c3aed,#c084fc)",
padding: "10px 22px",
borderRadius: 999,
fontWeight: 900,
};

const featureGrid: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "repeat(4,1fr)",
gap: 14,
marginTop: 28,
};

const featureCard: React.CSSProperties = {
background: "rgba(15,23,42,0.78)",
border: "1px solid rgba(255,255,255,0.08)",
borderRadius: 24,
padding: 18,
};

const featureIcon: React.CSSProperties = {
fontSize: 28,
marginBottom: 12,
};

const statsRow: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "repeat(3,1fr)",
gap: 12,
marginBottom: 18,
};

const statCard: React.CSSProperties = {
background: "rgba(15,23,42,0.85)",
border: "1px solid rgba(255,255,255,0.08)",
borderRadius: 24,
padding: 18,
textAlign: "center",
};

const statValue: React.CSSProperties = {
fontSize: 34,
margin: 0,
};

const statLabel: React.CSSProperties = {
opacity: 0.75,
};

const panel: React.CSSProperties = {
background: "rgba(255,255,255,0.05)",
border: "1px solid rgba(255,255,255,0.08)",
borderRadius: 28,
padding: 20,
};

const panelTitle: React.CSSProperties = {
fontSize: 32,
marginTop: 0,
};

const leadCard: React.CSSProperties = {
background:
"linear-gradient(145deg, rgba(15,23,42,0.98), rgba(30,12,60,0.95))",
border: "1px solid rgba(168,85,247,0.28)",
borderRadius: 24,
padding: 18,
marginBottom: 14,
};

const leadTop: React.CSSProperties = {
display: "flex",
justifyContent: "space-between",
};

const smallLabel: React.CSSProperties = {
fontSize: 11,
opacity: 0.55,
};

const phone: React.CSSProperties = {
fontSize: 24,
};

const hotBadge: React.CSSProperties = {
background: "rgba(239,68,68,0.18)",
color: "#fca5a5",
padding: "8px 10px",
borderRadius: 999,
fontSize: 11,
fontWeight: 900,
};

const infoBox: React.CSSProperties = {
marginTop: 14,
background: "rgba(0,0,0,0.28)",
padding: 14,
borderRadius: 16,
};

const leadButtons: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: 10,
marginTop: 14,
};

const callBtn: React.CSSProperties = {
padding: 14,
borderRadius: 16,
background: "linear-gradient(90deg,#7c3aed,#a855f7)",
color: "white",
textDecoration: "none",
textAlign: "center",
fontWeight: 900,
};

const waBtn: React.CSSProperties = {
padding: 14,
borderRadius: 16,
background: "linear-gradient(90deg,#22c55e,#86efac)",
color: "black",
textDecoration: "none",
textAlign: "center",
fontWeight: 900,
};

const statusRow: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "repeat(4,1fr)",
gap: 8,
marginTop: 12,
};

const miniBtn: React.CSSProperties = {
padding: "8px 6px",
borderRadius: 12,
border: "1px solid rgba(255,255,255,0.16)",
background: "rgba(255,255,255,0.08)",
color: "white",
};
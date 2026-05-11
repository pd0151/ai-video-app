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

if (!user?.email) {
setLeads([]);
return;
}

const email = user.email.toLowerCase().trim();

const { data: business } = await supabase
.from("businesses")
.select("id")
.eq("email", email)
.maybeSingle();

if (!business?.id) {
setLeads([]);
return;
}

const { data, error } = await supabase
.from("leads")
.select("*")
.eq("business_id", business.id)
.order("created_at", { ascending: false });

if (error) {
console.error("LOAD LEADS ERROR:", error);
setLeads([]);
return;
}

setLeads(data || []);
}

async function checkSubscription() {
try {
const {
data: { user },
} = await supabase.auth.getUser();

if (!user?.email) {
setIsPaid(false);
return;
}

const email = user.email.toLowerCase().trim();

const { data, error } = await supabase
.from("businesses")
.select("id,email,is_paid,setup_complete,ai_activated")
.eq("email", email)
.eq("is_paid", true)
.maybeSingle();

console.log("PAID CHECK:", { email, data, error });

setIsPaid(!!data);
setSetupComplete(!!data?.ai_activated);
} catch (err) {
console.error("SUBSCRIPTION CHECK ERROR:", err);
setIsPaid(false);
}
}

async function testLead() {
if (!isPaid) {
alert("Upgrade required to use AI receptionist leads.");
return;
}

setLoading(true);

const {
data: { user },
} = await supabase.auth.getUser();

if (!user?.email) {
alert("Please log in again");
setLoading(false);
return;
}

const email = user.email.toLowerCase().trim();

const { data: business, error: businessError } = await supabase
.from("businesses")
.select("id")
.eq("email", email)
.maybeSingle();

if (businessError || !business?.id) {
alert("Business profile not found");
setLoading(false);
return;
}

await fetch("/api/leads", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
business_id: business.id,
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
if (!isPaid) {
alert("Upgrade required to manage AI receptionist leads.");
return;
}

const { error } = await supabase.from("leads").update({ status }).eq("id", id);

if (error) {
alert("Could not update status");
console.error(error);
return;
}

await loadLeads();
}

async function upgrade() {
const email = localStorage.getItem("user");

if (!email) {
alert("Please log in first");
return;
}

const res = await fetch("/api/create-checkout", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ email }),
});

const data = await res.json();

if (data.url) window.location.href = data.url;
else alert(data.error || "Checkout failed");
}

useEffect(() => {
loadLeads();
checkSubscription();

const interval = setInterval(() => {
loadLeads();
checkSubscription();
}, 5000);

return () => clearInterval(interval);
}, []);

const stats = useMemo(() => {
return {
calls: isPaid ? leads.length : 0,
captured: isPaid ? leads.length : 0,
newJobs: isPaid
? leads.filter((l) => !l.status || l.status === "new").length
: 0,
};
}, [leads, isPaid]);

const latestLead = leads[0];

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
AI answers missed calls, captures customer details and sends the job straight to your dashboard.
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
<div style={botRing}></div>
</div>
</div>

<div style={featureGrid}>
<Feature icon="📞" title="AI Online" text="Always ready to answer" />
<Feature icon="☎️" title="24/7 Coverage" text="Never miss a call again" />
<Feature icon="⚡" title="Instant Alerts" text="Get SMS as soon as it lands" />
<Feature icon="🔒" title="Secure & Safe" text="Your data is always protected" />
</div>
</section>

<section style={statsRow}>
<Stat value={String(stats.calls)} label="Calls handled" icon="☎️" />
<Stat value={String(stats.captured)} label="Leads captured" icon="👥" />
<Stat value={String(stats.newJobs)} label="New jobs" icon="💼" />
</section>

<section style={activityRow}>
<div style={activityCard}>
<p style={smallLabel}>LAST LEAD RECEIVED</p>
<h2 style={activityBig}>
{latestLead?.created_at
? new Date(latestLead.created_at).toLocaleTimeString("en-GB", {
hour: "2-digit",
minute: "2-digit",
})
: "No leads"}
</h2>
<p style={muted}>From {latestLead?.phone || "No calls yet"}</p>
</div>

<div style={activityCard}>
<p style={smallLabel}>YOUR AI NUMBER</p>
<h2 style={aiNumber}>07385 182510</h2>
</div>

<div style={activityCard}>
<p style={smallLabel}>AI IS LISTENING</p>
<h2 style={liveText}>{setupComplete ? "Live" : "Waiting"}</h2>
<p style={activeDot}>● All systems active</p>
</div>
</section>

<section style={panel}>
<div style={panelHeader}>
<h2 style={panelTitle}>📋 Live Leads</h2>
<span style={viewAll}>View all ›</span>
</div>

{!isPaid && (
<div style={lockBox}>
<h3>🔒 Upgrade required</h3>
<p>Subscribe to unlock live AI receptionist leads.</p>
<button onClick={upgrade} style={purpleBtn}>
🚀 Upgrade Now
</button>
</div>
)}

{isPaid && leads.length === 0 ? (
<p style={empty}>No leads yet. Press Test Lead.</p>
) : isPaid ? (
leads.map((lead) => {
const whatsapp = lead.phone?.replace("+", "");
const status = lead.status || "new";

return (
<div key={lead.id} style={leadCard}>
<div style={leadTop}>
<div>
<p style={smallLabel}>PHONE</p>
<h3 style={phone}>{lead.phone || "Unknown"}</h3>
</div>

<span style={hotBadge}>{status.toUpperCase()}</span>
</div>

<div style={infoBox}>
<p><b>👤 Customer:</b> {lead.name || "Not provided"}</p>
<p><b>🚗 Vehicle:</b> {lead.vehicle || "Not provided"}</p>
<p><b>🛞 Tyre size:</b> {lead.tyre_size || "Not provided"}</p>
<p><b>⚠️ Issue:</b> {lead.issue || lead.job || "No details"}</p>
<p><b>📍 Location:</b> {lead.location || "Unknown"}</p>

<p style={{ opacity: 0.6, fontSize: 13 }}>
{lead.created_at
? new Date(lead.created_at).toLocaleString("en-GB")
: ""}
</p>
</div>

<div style={leadButtons}>
{lead.phone && (
<a href={`tel:${lead.phone}`} style={callBtn}>
📞 Call
</a>
)}

{whatsapp && (
<a href={`https://wa.me/${whatsapp}`} target="_blank" style={waBtn}>
💬 WhatsApp
</a>
)}
</div>

<div style={statusRow}>
<button onClick={() => updateStatus(lead.id, "new")} style={miniBtn}>New</button>
<button onClick={() => updateStatus(lead.id, "contacted")} style={miniBtn}>Contacted</button>
<button onClick={() => updateStatus(lead.id, "booked")} style={miniBtn}>Booked</button>
<button onClick={() => updateStatus(lead.id, "done")} style={miniBtn}>Done</button>
</div>
</div>
);
})
) : null}
</section>
</main>
);
}

function Stat({ value, label, icon }: { value: string; label: string; icon: string }) {
return (
<div style={statCard}>
<div style={statIcon}>{icon}</div>
<h2 style={statValue}>{value}</h2>
<p style={statLabel}>{label}</p>
<p style={growth}>↑ 33% this week</p>
</div>
);
}

function Feature({ icon, title, text }: { icon: string; title: string; text: string }) {
return (
<div style={featureCard}>
<div style={featureIcon}>{icon}</div>
<h3 style={featureTitle}>{title}</h3>
<p style={featureText}>{text}</p>
</div>
);
}

const page: React.CSSProperties = {
position: "relative",
minHeight: "100vh",
padding: 22,
paddingTop: 86,
paddingBottom: 170,
background:
"radial-gradient(circle at top, #2e1065 0%, #120725 38%, #020617 100%)",
color: "white",
fontFamily: "Arial, sans-serif",
overflowX: "hidden",
};

const backBtn: React.CSSProperties = {
position: "absolute",
top: 20,
left: 20,
zIndex: 10,
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.15)",
color: "white",
borderRadius: 14,
padding: "10px 16px",
fontWeight: 900,
};

const logoutBtn: React.CSSProperties = {
position: "absolute",
top: 20,
right: 20,
zIndex: 10,
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.15)",
color: "white",
borderRadius: 14,
padding: "10px 18px",
fontWeight: 900,
};

const hero: React.CSSProperties = {
position: "relative",
overflow: "hidden",
background:
"linear-gradient(145deg, rgba(126,34,206,0.52), rgba(15,23,42,0.96))",
border: "1px solid rgba(168,85,247,0.55)",
borderRadius: 32,
padding: 26,
boxShadow: "0 25px 90px rgba(124,58,237,0.25)",
marginBottom: 18,
};

const heroTop: React.CSSProperties = {
display: "flex",
justifyContent: "space-between",
gap: 10,
alignItems: "center",
marginBottom: 28,
};

const badge: React.CSSProperties = {
background: "rgba(34,197,94,0.16)",
color: "#4ade80",
padding: "10px 14px",
borderRadius: 999,
fontSize: 13,
fontWeight: 900,
};

const onlineBadge: React.CSSProperties = {
background: "rgba(15,23,42,0.78)",
border: "1px solid rgba(255,255,255,0.15)",
padding: "10px 14px",
borderRadius: 999,
fontSize: 13,
fontWeight: 900,
whiteSpace: "nowrap",
};

const heroGrid: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "1.15fr 0.85fr",
gap: 22,
alignItems: "center",
};

const title: React.CSSProperties = {
fontSize: 64,
lineHeight: 0.92,
fontWeight: 950,
margin: "0 0 24px",
letterSpacing: -2,
};

const purpleText: React.CSSProperties = {
color: "#a855f7",
};

const setupBox: React.CSSProperties = {
background: "rgba(255,255,255,0.1)",
border: "1px solid rgba(255,255,255,0.1)",
borderRadius: 18,
padding: 16,
marginBottom: 20,
fontWeight: 900,
};

const sub: React.CSSProperties = {
opacity: 0.78,
lineHeight: 1.55,
fontSize: 18,
};

const greenBtn: React.CSSProperties = {
marginTop: 22,
padding: "17px 30px",
borderRadius: 18,
border: "none",
background: "linear-gradient(90deg,#22c55e,#86efac)",
color: "#02140a",
fontWeight: 950,
fontSize: 18,
};

const botWrap: React.CSSProperties = {
position: "relative",
height: 270,
display: "flex",
justifyContent: "center",
alignItems: "center",
};

const botGlow: React.CSSProperties = {
position: "absolute",
width: 230,
height: 230,
borderRadius: "50%",
background: "radial-gradient(circle,#9333ea,transparent 70%)",
filter: "blur(14px)",
opacity: 0.75,
};

const botHead: React.CSSProperties = {
position: "relative",
width: 170,
height: 150,
borderRadius: 42,
background: "linear-gradient(145deg,#111827,#020617)",
border: "5px solid #8b5cf6",
display: "flex",
justifyContent: "center",
alignItems: "center",
gap: 22,
boxShadow: "0 0 55px rgba(168,85,247,0.7)",
};

const botEye: React.CSSProperties = {
width: 18,
height: 18,
borderRadius: "50%",
background: "#4ade80",
boxShadow: "0 0 18px #4ade80",
};

const botSmile: React.CSSProperties = {
position: "absolute",
bottom: 28,
color: "#4ade80",
fontSize: 30,
};

const botBase: React.CSSProperties = {
position: "absolute",
bottom: 24,
background: "linear-gradient(90deg,#7c3aed,#c084fc)",
padding: "10px 22px",
borderRadius: 999,
fontWeight: 950,
};

const botRing: React.CSSProperties = {
position: "absolute",
bottom: 2,
width: 190,
height: 42,
borderRadius: "50%",
border: "1px solid rgba(168,85,247,0.55)",
boxShadow: "0 0 30px rgba(168,85,247,0.45)",
};

const featureGrid: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "repeat(4, 1fr)",
gap: 14,
marginTop: 26,
};

const featureCard: React.CSSProperties = {
background: "rgba(15,23,42,0.78)",
border: "1px solid rgba(255,255,255,0.09)",
borderRadius: 22,
padding: 18,
minHeight: 130,
textAlign: "center",
};

const featureIcon: React.CSSProperties = {
fontSize: 34,
marginBottom: 12,
};

const featureTitle: React.CSSProperties = {
fontSize: 17,
margin: "0 0 8px",
};

const featureText: React.CSSProperties = {
opacity: 0.68,
margin: 0,
lineHeight: 1.4,
};

const statsRow: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "repeat(3, 1fr)",
gap: 14,
marginBottom: 18,
};

const statCard: React.CSSProperties = {
background: "rgba(15,23,42,0.85)",
border: "1px solid rgba(255,255,255,0.08)",
borderRadius: 24,
padding: 20,
};

const statIcon: React.CSSProperties = {
fontSize: 28,
marginBottom: 10,
};

const statValue: React.CSSProperties = {
fontSize: 42,
margin: 0,
fontWeight: 950,
};

const statLabel: React.CSSProperties = {
opacity: 0.82,
margin: "8px 0 0",
};

const growth: React.CSSProperties = {
color: "#4ade80",
marginTop: 12,
fontWeight: 800,
fontSize: 13,
};

const activityRow: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "repeat(3, 1fr)",
gap: 14,
marginBottom: 20,
};

const activityCard: React.CSSProperties = {
background: "rgba(15,23,42,0.82)",
border: "1px solid rgba(255,255,255,0.08)",
borderRadius: 24,
padding: 20,
};

const activityBig: React.CSSProperties = {
color: "#4ade80",
margin: "8px 0",
fontSize: 28,
fontWeight: 950,
};

const aiNumber: React.CSSProperties = {
color: "#c084fc",
margin: "8px 0",
fontSize: 26,
fontWeight: 950,
};

const liveText: React.CSSProperties = {
color: "#4ade80",
margin: "8px 0",
fontSize: 30,
fontWeight: 950,
};

const activeDot: React.CSSProperties = {
color: "#4ade80",
margin: 0,
};

const muted: React.CSSProperties = {
opacity: 0.65,
margin: 0,
};

const panel: React.CSSProperties = {
background: "rgba(15,23,42,0.72)",
border: "1px solid rgba(255,255,255,0.09)",
borderRadius: 28,
padding: 20,
};

const panelHeader: React.CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
};

const panelTitle: React.CSSProperties = {
fontSize: 30,
marginTop: 0,
};

const viewAll: React.CSSProperties = {
color: "#c084fc",
fontWeight: 900,
};

const empty: React.CSSProperties = {
opacity: 0.65,
fontSize: 17,
};

const lockBox: React.CSSProperties = {
background: "rgba(0,0,0,0.35)",
border: "1px solid rgba(255,255,255,0.16)",
borderRadius: 18,
padding: 18,
marginBottom: 16,
textAlign: "center",
};

const purpleBtn: React.CSSProperties = {
padding: 16,
borderRadius: 18,
border: "1px solid rgba(255,255,255,0.25)",
background: "linear-gradient(90deg,#7c3aed,#c084fc)",
color: "white",
fontWeight: 900,
fontSize: 16,
};

const leadCard: React.CSSProperties = {
background: "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(30,12,60,0.95))",
border: "1px solid rgba(168,85,247,0.28)",
borderRadius: 24,
padding: 18,
marginBottom: 14,
};

const leadTop: React.CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
};

const smallLabel: React.CSSProperties = {
fontSize: 11,
opacity: 0.55,
fontWeight: 900,
letterSpacing: 1,
margin: 0,
};

const phone: React.CSSProperties = {
fontSize: 24,
margin: "4px 0 0",
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
lineHeight: 1.5,
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
gridTemplateColumns: "repeat(4, 1fr)",
gap: 8,
marginTop: 12,
};

const miniBtn: React.CSSProperties = {
padding: "8px 6px",
borderRadius: 12,
border: "1px solid rgba(255,255,255,0.16)",
background: "rgba(255,255,255,0.08)",
color: "white",
fontWeight: 800,
fontSize: 12,
};
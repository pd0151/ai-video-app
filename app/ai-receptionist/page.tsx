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
vehicle: "BMW",
tyre_size: "215/45/17",
postcode: "L9 7JX",
issue: "Needs a new tyre fitted",
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

<section style={hero}>
<div style={heroTop}>
<div style={badge}>● LIVE AI CALL SYSTEM</div>
<div style={onlineBadge}>🟢 AI Online</div>
</div>

<div style={heroGrid}>
<div>
<h1 style={title}>
Never miss <span style={purpleText}>another job</span>
</h1>

<div style={setupBox}>
{setupComplete
? "✅ AI Receptionist Setup Complete"
: "⏳ Waiting For Setup"}
</div>

<p style={sub}>
AI answers missed calls, captures customer details and sends the
job straight to your dashboard.
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
<Feature icon="📞" title="AI Online" text="Always ready to answer" />
<Feature icon="🕘" title="24/7 Coverage" text="Never miss a call" />
<Feature icon="⚡" title="Instant Alerts" text="SMS as soon as it lands" />
<Feature icon="🔒" title="Secure Leads" text="Stored safely in your app" />
</div>
</section>

<section style={statsRow}>
<Stat value={String(stats.calls)} label="Calls handled" icon="☎️" />
<Stat value={String(stats.captured)} label="Leads captured" icon="👥" />
<Stat value={String(stats.newJobs)} label="New jobs" icon="💼" />
</section>

<section style={systemRow}>
<div style={systemCard}>
<p style={smallLabel}>LAST LEAD</p>
<h3 style={systemValue}>
{latestLead?.created_at
? new Date(latestLead.created_at).toLocaleTimeString("en-GB", {
hour: "2-digit",
minute: "2-digit",
})
: "No leads yet"}
</h3>
</div>

<div style={systemCard}>
<p style={smallLabel}>AI STATUS</p>
<h3 style={{ ...systemValue, color: setupComplete ? "#4ade80" : "#facc15" }}>
{setupComplete ? "Live" : "Waiting"}
</h3>
</div>
</section>

<section style={panel}>
<h2 style={panelTitle}>📋 Live Leads</h2>

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
</div>
);
}

function Feature({ icon, title, text }: { icon: string; title: string; text: string }) {
return (
<div style={featureCard}>
<div style={featureIcon}>{icon}</div>
<b>{title}</b>
<p>{text}</p>
</div>
);
}

const page: React.CSSProperties = {
position: "relative",
minHeight: "100vh",
padding: 22,
paddingBottom: 160,
paddingTop: 70,
background:
"radial-gradient(circle at top, #5b21b6 0%, #16072f 35%, #020617 100%)",
color: "white",
fontFamily: "Arial, sans-serif",
};

const backBtn: React.CSSProperties = {
position: "absolute",
top: 20,
left: 20,
zIndex: 10,
background: "rgba(0,0,0,0.4)",
backdropFilter: "blur(12px)",
border: "1px solid rgba(255,255,255,0.2)",
padding: "8px 14px",
borderRadius: 10,
color: "white",
fontWeight: 600,
};

const hero: React.CSSProperties = {
background:
"linear-gradient(145deg, rgba(126,34,206,0.52), rgba(15,23,42,0.95))",
border: "1px solid rgba(168,85,247,0.55)",
borderRadius: 30,
padding: 24,
boxShadow: "0 25px 90px rgba(124,58,237,0.25)",
marginBottom: 18,
};

const heroTop: React.CSSProperties = {
display: "flex",
justifyContent: "space-between",
gap: 10,
alignItems: "center",
marginBottom: 22,
};

const badge: React.CSSProperties = {
display: "inline-block",
background: "rgba(34,197,94,0.16)",
color: "#4ade80",
padding: "8px 12px",
borderRadius: 999,
fontSize: 12,
fontWeight: 900,
};

const onlineBadge: React.CSSProperties = {
background: "rgba(15,23,42,0.7)",
border: "1px solid rgba(255,255,255,0.14)",
padding: "8px 12px",
borderRadius: 999,
fontSize: 12,
fontWeight: 900,
};

const heroGrid: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "1fr",
gap: 18,
};

const title: React.CSSProperties = {
fontSize: 54,
fontWeight: 950,
lineHeight: 0.95,
margin: "0 0 22px",
color: "white",
};

const purpleText: React.CSSProperties = {
display: "block",
background: "linear-gradient(90deg,#ffffff,#a855f7,#c084fc)",
WebkitBackgroundClip: "text",
color: "transparent",
};

const setupBox: React.CSSProperties = {
background: "rgba(34,197,94,0.18)",
padding: 16,
borderRadius: 16,
marginBottom: 20,
fontWeight: 900,
fontSize: 18,
border: "1px solid rgba(255,255,255,0.08)",
};

const sub: React.CSSProperties = {
fontSize: 18,
lineHeight: 1.45,
opacity: 0.78,
};

const greenBtn: React.CSSProperties = {
padding: "16px 28px",
borderRadius: 18,
border: "1px solid rgba(255,255,255,0.25)",
background: "linear-gradient(90deg,#22c55e,#86efac)",
color: "#06120a",
fontWeight: 900,
fontSize: 16,
minWidth: 190,
};

const botWrap: React.CSSProperties = {
position: "relative",
height: 150,
display: "flex",
justifyContent: "center",
alignItems: "center",
};

const botGlow: React.CSSProperties = {
position: "absolute",
width: 140,
height: 140,
borderRadius: "50%",
background: "radial-gradient(circle,#a855f7,transparent 65%)",
opacity: 0.5,
};

const botHead: React.CSSProperties = {
position: "relative",
width: 110,
height: 88,
borderRadius: 34,
background: "linear-gradient(145deg,#1e1b4b,#050816)",
border: "3px solid #8b5cf6",
boxShadow: "0 0 35px rgba(168,85,247,0.65)",
display: "flex",
justifyContent: "center",
alignItems: "center",
gap: 18,
};

const botEye: React.CSSProperties = {
width: 14,
height: 14,
borderRadius: "50%",
background: "#4ade80",
boxShadow: "0 0 14px #4ade80",
};

const botSmile: React.CSSProperties = {
position: "absolute",
bottom: 12,
color: "#4ade80",
fontSize: 24,
};

const botBase: React.CSSProperties = {
position: "absolute",
bottom: 8,
background: "linear-gradient(135deg,#7c3aed,#c084fc)",
padding: "8px 18px",
borderRadius: 999,
fontWeight: 900,
};

const featureGrid: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "repeat(2, 1fr)",
gap: 10,
marginTop: 18,
};

const featureCard: React.CSSProperties = {
background: "rgba(15,23,42,0.72)",
border: "1px solid rgba(255,255,255,0.1)",
borderRadius: 18,
padding: 14,
minHeight: 105,
};

const featureIcon: React.CSSProperties = {
fontSize: 26,
marginBottom: 8,
};

const statsRow: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "repeat(3, 1fr)",
gap: 12,
marginBottom: 18,
};

const statCard: React.CSSProperties = {
background: "rgba(15,23,42,0.88)",
border: "1px solid rgba(255,255,255,0.1)",
borderRadius: 22,
padding: 16,
textAlign: "center",
};

const statIcon: React.CSSProperties = {
fontSize: 22,
marginBottom: 6,
};

const statValue: React.CSSProperties = {
fontSize: 32,
margin: 0,
fontWeight: 900,
};

const statLabel: React.CSSProperties = {
fontSize: 13,
opacity: 0.75,
marginBottom: 0,
};

const systemRow: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: 12,
marginBottom: 18,
};

const systemCard: React.CSSProperties = {
background: "rgba(15,23,42,0.78)",
border: "1px solid rgba(255,255,255,0.1)",
borderRadius: 20,
padding: 16,
};

const systemValue: React.CSSProperties = {
margin: "6px 0 0",
fontSize: 20,
fontWeight: 900,
};

const panel: React.CSSProperties = {
background: "rgba(255,255,255,0.07)",
border: "1px solid rgba(255,255,255,0.13)",
borderRadius: 28,
padding: 20,
boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
};

const panelTitle: React.CSSProperties = {
fontSize: 30,
marginTop: 0,
};

const empty: React.CSSProperties = {
opacity: 0.65,
fontSize: 17,
};

const leadCard: React.CSSProperties = {
background:
"linear-gradient(145deg, rgba(15,23,42,0.98), rgba(30,12,60,0.95))",
border: "1px solid rgba(168,85,247,0.28)",
borderRadius: 24,
padding: 18,
marginBottom: 14,
boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
};

const leadTop: React.CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
gap: 10,
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
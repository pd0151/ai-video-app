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
‹
</button>

<button style={logoutBtn}>↪ Logout</button>

<section style={hero}>
<div style={topRow}>
<span style={livePill}>● LIVE AI CALL SYSTEM</span>
<span style={onlinePill}>🟢 AI Online</span>
</div>

<div style={heroGrid}>
<div>
<h1 style={title}>
Never miss
<span style={titlePurple}>another job</span>
</h1>

<div style={setupBox}>
{setupComplete
? "✅ AI Receptionist Setup Complete"
: "⏳ Waiting For Setup"}
</div>

<p style={subText}>
AI answers missed calls, captures customer details and sends the
job straight to your dashboard.
</p>

<button onClick={testLead} style={testButton}>
{loading ? "Sending..." : "🔥 Test Lead"}
</button>
</div>

<div style={robotStage}>
<div style={robotGlow}></div>
<div style={robotHalo}></div>
<div style={robotHead}>
<div style={robotEyes}>
<span style={eye}></span>
<span style={eye}></span>
</div>
<div style={smile}>⌣</div>
</div>
<div style={headsetLeft}></div>
<div style={headsetRight}></div>
<div style={mic}></div>
<div style={robotBody}></div>
<div style={baseRing}></div>
</div>
</div>

<div style={featureGrid}>
<Feature icon="📞" title="AI Online" text="Always ready to answer" />
<Feature icon="☎️" title="24/7 Coverage" text="Never miss a call again" />
<Feature icon="⚡" title="Instant Alerts" text="Get SMS as soon as it lands" />
<Feature icon="🛡️" title="Secure & Safe" text="Your data is always protected" />
</div>
</section>

<section style={statsGrid}>
<Stat value={String(stats.calls)} label="Calls handled" icon="☎️" />
<Stat value={String(stats.captured)} label="Leads captured" icon="👥" />
<Stat value={String(stats.newJobs)} label="New jobs" icon="💼" />
</section>

<section style={systemStrip}>
<div style={systemItem}>
<span style={systemIcon}>🕘</span>
<div>
<p style={systemLabel}>Last lead received</p>
<h3 style={greenText}>
{latestLead?.created_at
? new Date(latestLead.created_at).toLocaleTimeString("en-GB", {
hour: "2-digit",
minute: "2-digit",
})
: "No leads"}
</h3>
<p style={muted}>From {latestLead?.phone || "No calls yet"}</p>
</div>
</div>

<div style={divider}></div>

<div style={systemItem}>
<span style={systemIcon}>📱</span>
<div>
<p style={systemLabel}>Your AI number</p>
<h3 style={purpleNumber}>07385 182510</h3>
</div>
</div>

<div style={divider}></div>

<div style={systemItem}>
<span style={systemIcon}>〽️</span>
<div>
<p style={systemLabel}>AI is listening</p>
<h3 style={greenText}>{setupComplete ? "Live" : "Waiting"}</h3>
<p style={activeDot}>● All systems active</p>
</div>
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
<button onClick={upgrade} style={upgradeBtn}>
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
<p style={miniLabel}>PHONE</p>
<h3 style={phone}>{lead.phone || "Unknown"}</h3>
</div>
<span style={statusBadge}>{status.toUpperCase()}</span>
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
<button onClick={() => updateStatus(lead.id, "new")} style={smallBtn}>New</button>
<button onClick={() => updateStatus(lead.id, "contacted")} style={smallBtn}>Contacted</button>
<button onClick={() => updateStatus(lead.id, "booked")} style={smallBtn}>Booked</button>
<button onClick={() => updateStatus(lead.id, "done")} style={smallBtn}>Done</button>
</div>
</div>
);
})
) : null}
</section>
</main>
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

const page: React.CSSProperties = {
position: "relative",
minHeight: "100vh",
padding: 18,
paddingTop: 92,
paddingBottom: 150,
color: "white",
fontFamily: "Arial, sans-serif",
background:
"radial-gradient(circle at top, #170047 0%, #08021d 45%, #020617 100%)",
overflowX: "hidden",
};

const backBtn: React.CSSProperties = {
position: "absolute",
top: 26,
left: 18,
width: 46,
height: 46,
borderRadius: 14,
border: "1px solid rgba(255,255,255,0.14)",
background: "rgba(255,255,255,0.07)",
color: "white",
fontSize: 34,
lineHeight: 0,
fontWeight: 500,
};

const logoutBtn: React.CSSProperties = {
position: "absolute",
top: 26,
right: 18,
borderRadius: 15,
border: "1px solid rgba(255,255,255,0.14)",
background: "rgba(255,255,255,0.07)",
color: "white",
padding: "13px 18px",
fontWeight: 800,
fontSize: 15,
};

const hero: React.CSSProperties = {
background:
"linear-gradient(145deg, rgba(80, 18, 160, 0.55), rgba(10, 8, 35, 0.96))",
border: "1px solid rgba(168,85,247,0.75)",
boxShadow: "0 0 30px rgba(126,34,206,0.28)",
borderRadius: 28,
padding: 20,
marginBottom: 16,
overflow: "hidden",
};

const topRow: React.CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
gap: 10,
marginBottom: 24,
};

const livePill: React.CSSProperties = {
color: "#4ade80",
background: "rgba(34,197,94,0.14)",
padding: "10px 14px",
borderRadius: 999,
fontSize: 12,
fontWeight: 950,
};

const onlinePill: React.CSSProperties = {
background: "rgba(15,23,42,0.72)",
border: "1px solid rgba(255,255,255,0.18)",
borderRadius: 999,
padding: "10px 14px",
fontSize: 12,
fontWeight: 950,
whiteSpace: "nowrap",
};

const heroGrid: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "1.15fr 0.85fr",
gap: 8,
alignItems: "center",
};

const title: React.CSSProperties = {
margin: 0,
fontSize: 54,
lineHeight: 0.88,
fontWeight: 950,
letterSpacing: -2,
};

const titlePurple: React.CSSProperties = {
display: "block",
color: "#9b4dff",
marginTop: 8,
};

const setupBox: React.CSSProperties = {
marginTop: 20,
background: "rgba(255,255,255,0.12)",
border: "1px solid rgba(255,255,255,0.1)",
borderRadius: 15,
padding: "12px 15px",
fontWeight: 900,
fontSize: 16,
width: "fit-content",
};

const subText: React.CSSProperties = {
marginTop: 18,
maxWidth: 440,
color: "rgba(255,255,255,0.78)",
fontSize: 16,
lineHeight: 1.45,
};

const testButton: React.CSSProperties = {
marginTop: 18,
width: 250,
border: "none",
borderRadius: 16,
padding: "18px 20px",
background: "linear-gradient(90deg,#22c55e,#86efac)",
color: "#06120a",
fontSize: 18,
fontWeight: 950,
};

const robotStage: React.CSSProperties = {
position: "relative",
height: 250,
display: "flex",
alignItems: "center",
justifyContent: "center",
};

const robotGlow: React.CSSProperties = {
position: "absolute",
width: 240,
height: 240,
borderRadius: "50%",
background: "radial-gradient(circle,#9333ea,transparent 70%)",
filter: "blur(18px)",
opacity: 0.85,
};

const robotHalo: React.CSSProperties = {
position: "absolute",
width: 210,
height: 70,
borderRadius: "50%",
bottom: 28,
border: "1px solid rgba(168,85,247,0.48)",
boxShadow: "0 0 35px rgba(168,85,247,0.45)",
};

const robotHead: React.CSSProperties = {
position: "relative",
width: 128,
height: 110,
borderRadius: 35,
background: "linear-gradient(145deg,#1e1b4b,#020617)",
border: "5px solid #8b5cf6",
boxShadow: "0 0 50px rgba(168,85,247,0.8)",
zIndex: 3,
};

const robotEyes: React.CSSProperties = {
position: "absolute",
top: 40,
left: 0,
right: 0,
display: "flex",
justifyContent: "center",
gap: 26,
};

const eye: React.CSSProperties = {
width: 17,
height: 17,
borderRadius: "50%",
background: "#4ade80",
boxShadow: "0 0 18px #4ade80",
};

const smile: React.CSSProperties = {
position: "absolute",
left: 0,
right: 0,
bottom: 22,
textAlign: "center",
color: "#4ade80",
fontSize: 30,
};

const headsetLeft: React.CSSProperties = {
position: "absolute",
width: 25,
height: 60,
borderRadius: 20,
background: "linear-gradient(#7c3aed,#4c1d95)",
left: "calc(50% - 85px)",
top: 82,
zIndex: 4,
};

const headsetRight: React.CSSProperties = {
position: "absolute",
width: 25,
height: 60,
borderRadius: 20,
background: "linear-gradient(#7c3aed,#4c1d95)",
right: "calc(50% - 85px)",
top: 82,
zIndex: 4,
};

const mic: React.CSSProperties = {
position: "absolute",
width: 48,
height: 8,
borderRadius: 10,
background: "#8b5cf6",
right: "calc(50% - 82px)",
top: 140,
zIndex: 5,
};

const robotBody: React.CSSProperties = {
position: "absolute",
width: 100,
height: 65,
borderRadius: "50px 50px 30px 30px",
background: "linear-gradient(145deg,#8b5cf6,#4c1d95)",
bottom: 42,
zIndex: 2,
};

const baseRing: React.CSSProperties = {
position: "absolute",
bottom: 18,
width: 180,
height: 42,
borderRadius: "50%",
border: "1px solid rgba(168,85,247,0.55)",
};

const featureGrid: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "repeat(4, 1fr)",
gap: 14,
marginTop: 16,
};

const featureCard: React.CSSProperties = {
background: "rgba(15,23,42,0.72)",
border: "1px solid rgba(255,255,255,0.08)",
borderRadius: 18,
padding: 16,
minHeight: 118,
textAlign: "center",
};

const featureIcon: React.CSSProperties = {
fontSize: 30,
marginBottom: 10,
};

const featureTitle: React.CSSProperties = {
fontSize: 16,
margin: "0 0 8px",
};

const featureText: React.CSSProperties = {
opacity: 0.68,
margin: 0,
lineHeight: 1.3,
fontSize: 13,
};

const statsGrid: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "repeat(3, 1fr)",
gap: 14,
marginBottom: 18,
};

const statCard: React.CSSProperties = {
position: "relative",
background: "rgba(15,23,42,0.82)",
border: "1px solid rgba(255,255,255,0.08)",
borderRadius: 20,
padding: 22,
minHeight: 125,
};

const statIcon: React.CSSProperties = {
position: "absolute",
top: 24,
right: 22,
fontSize: 28,
opacity: 0.9,
};

const statValue: React.CSSProperties = {
fontSize: 42,
margin: 0,
fontWeight: 950,
};

const statLabel: React.CSSProperties = {
opacity: 0.88,
fontSize: 15,
margin: "16px 0 0",
};

const growth: React.CSSProperties = {
color: "#4ade80",
fontSize: 13,
marginTop: 13,
fontWeight: 800,
};

const systemStrip: React.CSSProperties = {
background: "rgba(15,23,42,0.78)",
border: "1px solid rgba(255,255,255,0.08)",
borderRadius: 20,
padding: 20,
display: "grid",
gridTemplateColumns: "1fr 1px 1fr 1px 1fr",
gap: 18,
marginBottom: 18,
};

const systemItem: React.CSSProperties = {
display: "flex",
gap: 14,
alignItems: "flex-start",
};

const divider: React.CSSProperties = {
width: 1,
background: "rgba(255,255,255,0.08)",
};

const systemIcon: React.CSSProperties = {
fontSize: 28,
opacity: 0.8,
};

const systemLabel: React.CSSProperties = {
opacity: 0.65,
margin: 0,
fontSize: 14,
};

const greenText: React.CSSProperties = {
color: "#4ade80",
margin: "6px 0",
fontSize: 26,
fontWeight: 950,
};

const purpleNumber: React.CSSProperties = {
color: "#c084fc",
margin: "6px 0",
fontSize: 25,
fontWeight: 950,
};

const muted: React.CSSProperties = {
opacity: 0.65,
margin: 0,
};

const activeDot: React.CSSProperties = {
color: "#4ade80",
margin: 0,
};

const panel: React.CSSProperties = {
background: "rgba(15,23,42,0.72)",
border: "1px solid rgba(255,255,255,0.09)",
borderRadius: 24,
padding: 18,
};

const panelHeader: React.CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
};

const panelTitle: React.CSSProperties = {
fontSize: 24,
margin: 0,
};

const viewAll: React.CSSProperties = {
color: "#c084fc",
fontWeight: 900,
};

const lockBox: React.CSSProperties = {
background: "rgba(0,0,0,0.35)",
border: "1px solid rgba(255,255,255,0.16)",
borderRadius: 18,
padding: 18,
marginTop: 16,
marginBottom: 16,
textAlign: "center",
};

const upgradeBtn: React.CSSProperties = {
padding: 16,
borderRadius: 18,
border: "1px solid rgba(255,255,255,0.25)",
background: "linear-gradient(90deg,#7c3aed,#c084fc)",
color: "white",
fontWeight: 900,
fontSize: 16,
};

const empty: React.CSSProperties = {
opacity: 0.65,
fontSize: 17,
};

const leadCard: React.CSSProperties = {
background: "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(30,12,60,0.95))",
border: "1px solid rgba(168,85,247,0.28)",
borderRadius: 24,
padding: 16,
marginTop: 14,
};

const leadTop: React.CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
};

const miniLabel: React.CSSProperties = {
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

const statusBadge: React.CSSProperties = {
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

const smallBtn: React.CSSProperties = {
padding: "8px 6px",
borderRadius: 12,
border: "1px solid rgba(255,255,255,0.16)",
background: "rgba(255,255,255,0.08)",
color: "white",
fontWeight: 800,
fontSize: 12,
};
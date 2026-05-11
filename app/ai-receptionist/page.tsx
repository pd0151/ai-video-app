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
<button onClick={() => router.push("/")} style={backBtn}>‹</button>
<button style={logoutBtn}>Logout</button>

<section style={hero}>
<div style={topRow}>
<span style={livePill}><span style={greenDot}></span> LIVE AI CALL SYSTEM</span>
<span style={onlinePill}><span style={bigGreenDot}></span> AI Online</span>
</div>

<div style={heroInner}>
<div style={heroText}>
<h1 style={title}>
Never miss
<span style={titlePurple}>another job</span>
</h1>

<div style={setupBox}>
<span style={tickBox}>✓</span>
{setupComplete ? "AI Receptionist Setup Complete" : "Waiting For Setup"}
</div>

<p style={subText}>
AI answers missed calls, captures customer details and sends the
job straight to your dashboard.
</p>

<button onClick={testLead} style={testButton}>
{loading ? "Sending..." : "🔥 Test Lead"}
</button>
</div>

<div style={robotWrap}>
<div style={orb}></div>
<div style={ring1}></div>
<div style={ring2}></div>

<div style={botHead}>
<div style={botEyes}>
<span style={botEye}></span>
<span style={botEye}></span>
</div>
<div style={botSmile}></div>
</div>

<div style={earLeft}></div>
<div style={earRight}></div>
<div style={micBar}></div>
<div style={botBody}></div>
<div style={floorRing}></div>
</div>
</div>

<div style={featureGrid}>
<Feature icon="☎" title="AI Online" text="Always ready to answer" />
<Feature icon="◔" title="24/7 Coverage" text="Never miss a call again" />
<Feature icon="⚡" title="Instant Alerts" text="Get SMS as soon as it lands" />
<Feature icon="♢" title="Secure & Safe" text="Your data is always protected" />
</div>
</section>

<section style={statsGrid}>
<Stat value={String(stats.calls)} label="Calls handled" icon="☎" />
<Stat value={String(stats.captured)} label="Leads captured" icon="👥" />
<Stat value={String(stats.newJobs)} label="New jobs" icon="▣" />
</section>

<section style={systemStrip}>
<div style={systemItem}>
<span style={systemIcon}>◷</span>
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

<div style={systemItem}>
<span style={systemIcon}>▯</span>
<div>
<p style={systemLabel}>Your AI number</p>
<h3 style={purpleNumber}>07385 182510</h3>
</div>
</div>

<div style={systemItem}>
<span style={systemIcon}>≋</span>
<div>
<p style={systemLabel}>AI is listening</p>
<h3 style={greenText}>{setupComplete ? "Live" : "Waiting"}</h3>
<p style={activeDot}>● All systems active</p>
</div>
</div>
</section>

<section style={panel}>
<div style={panelHeader}>
<h2 style={panelTitle}>▣ Live Leads</h2>
<span style={viewAll}>View all ›</span>
</div>

{!isPaid && (
<div style={lockBox}>
<h3>🔒 Upgrade required</h3>
<p>Subscribe to unlock live AI receptionist leads.</p>
<button onClick={upgrade} style={upgradeBtn}>🚀 Upgrade Now</button>
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
{lead.created_at ? new Date(lead.created_at).toLocaleString("en-GB") : ""}
</p>
</div>

<div style={leadButtons}>
{lead.phone && <a href={`tel:${lead.phone}`} style={callBtn}>📞 Call</a>}
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
minHeight: "100vh",
padding: "86px 18px 150px",
color: "white",
fontFamily: "Inter, Arial, sans-serif",
background:
"radial-gradient(circle at 50% -10%, rgba(168,85,247,0.55), transparent 32%), linear-gradient(180deg,#10002f 0%,#080116 55%,#020617 100%)",
overflowX: "hidden",
};

const backBtn: React.CSSProperties = {
position: "absolute",
top: 28,
left: 18,
width: 54,
height: 54,
borderRadius: 18,
border: "1px solid rgba(255,255,255,0.14)",
background: "rgba(255,255,255,0.08)",
backdropFilter: "blur(18px)",
color: "white",
fontSize: 36,
zIndex: 20,
};

const logoutBtn: React.CSSProperties = {
position: "absolute",
top: 28,
right: 18,
padding: "14px 20px",
borderRadius: 18,
border: "1px solid rgba(255,255,255,0.14)",
background: "rgba(255,255,255,0.08)",
backdropFilter: "blur(18px)",
color: "white",
fontWeight: 900,
zIndex: 20,
};

const hero: React.CSSProperties = {
borderRadius: 34,
padding: 18,
marginBottom: 16,
background:
"linear-gradient(145deg, rgba(111,25,191,0.72), rgba(12,10,35,0.96))",
border: "1px solid rgba(168,85,247,0.65)",
boxShadow: "0 0 40px rgba(126,34,206,0.28), inset 0 0 40px rgba(255,255,255,0.03)",
overflow: "hidden",
};

const topRow: React.CSSProperties = {
display: "flex",
alignItems: "center",
justifyContent: "space-between",
gap: 10,
marginBottom: 18,
};

const livePill: React.CSSProperties = {
display: "inline-flex",
alignItems: "center",
gap: 8,
padding: "10px 14px",
borderRadius: 999,
background: "rgba(255,255,255,0.08)",
color: "#4ade80",
fontSize: 13,
fontWeight: 950,
};

const onlinePill: React.CSSProperties = {
display: "inline-flex",
alignItems: "center",
gap: 8,
padding: "10px 15px",
borderRadius: 999,
background: "rgba(3,7,18,0.7)",
border: "1px solid rgba(255,255,255,0.12)",
fontSize: 13,
fontWeight: 950,
};

const greenDot: React.CSSProperties = {
width: 8,
height: 8,
borderRadius: "50%",
background: "#4ade80",
};

const bigGreenDot: React.CSSProperties = {
width: 18,
height: 18,
borderRadius: "50%",
background: "linear-gradient(135deg,#22c55e,#86efac)",
boxShadow: "0 0 18px rgba(34,197,94,0.8)",
};

const heroInner: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "1.1fr 0.9fr",
alignItems: "center",
gap: 10,
};

const heroText: React.CSSProperties = {
position: "relative",
zIndex: 2,
};

const title: React.CSSProperties = {
margin: 0,
fontSize: 50,
lineHeight: 0.9,
letterSpacing: -2,
fontWeight: 950,
};

const titlePurple: React.CSSProperties = {
display: "block",
marginTop: 6,
color: "#a855f7",
};

const setupBox: React.CSSProperties = {
display: "flex",
alignItems: "center",
gap: 10,
marginTop: 22,
padding: "13px 15px",
borderRadius: 17,
background: "rgba(255,255,255,0.12)",
border: "1px solid rgba(255,255,255,0.12)",
fontWeight: 900,
fontSize: 15,
width: "fit-content",
};

const tickBox: React.CSSProperties = {
width: 25,
height: 25,
borderRadius: 7,
display: "grid",
placeItems: "center",
background: "linear-gradient(135deg,#16a34a,#86efac)",
color: "white",
fontWeight: 950,
};

const subText: React.CSSProperties = {
margin: "18px 0 0",
color: "rgba(255,255,255,0.76)",
fontSize: 16,
lineHeight: 1.45,
maxWidth: 460,
};

const testButton: React.CSSProperties = {
marginTop: 22,
width: 260,
maxWidth: "100%",
padding: "18px 20px",
borderRadius: 18,
border: "none",
background: "linear-gradient(90deg,#22c55e,#86efac)",
color: "#04130a",
fontSize: 18,
fontWeight: 950,
boxShadow: "0 16px 35px rgba(34,197,94,0.22)",
};

const robotWrap: React.CSSProperties = {
position: "relative",
height: 250,
display: "flex",
alignItems: "center",
justifyContent: "center",
};

const orb: React.CSSProperties = {
position: "absolute",
width: 210,
height: 210,
borderRadius: "50%",
background: "radial-gradient(circle, rgba(168,85,247,0.8), transparent 68%)",
filter: "blur(12px)",
};

const ring1: React.CSSProperties = {
position: "absolute",
bottom: 42,
width: 190,
height: 54,
borderRadius: "50%",
border: "1px solid rgba(168,85,247,0.45)",
};

const ring2: React.CSSProperties = {
position: "absolute",
bottom: 54,
width: 128,
height: 36,
borderRadius: "50%",
border: "1px solid rgba(255,255,255,0.1)",
};

const botHead: React.CSSProperties = {
position: "relative",
width: 138,
height: 118,
borderRadius: 38,
background: "linear-gradient(145deg,#111827,#020617)",
border: "5px solid #8b5cf6",
boxShadow: "0 0 38px rgba(168,85,247,0.72)",
zIndex: 5,
};

const botEyes: React.CSSProperties = {
position: "absolute",
top: 42,
left: 0,
right: 0,
display: "flex",
justifyContent: "center",
gap: 28,
};

const botEye: React.CSSProperties = {
width: 18,
height: 18,
borderRadius: "50%",
background: "#5eead4",
boxShadow: "0 0 18px #5eead4",
};

const botSmile: React.CSSProperties = {
position: "absolute",
left: "50%",
bottom: 26,
width: 34,
height: 16,
transform: "translateX(-50%)",
borderBottom: "5px solid #5eead4",
borderRadius: "0 0 30px 30px",
};

const earLeft: React.CSSProperties = {
position: "absolute",
width: 24,
height: 62,
borderRadius: 18,
background: "linear-gradient(#8b5cf6,#4c1d95)",
left: "calc(50% - 92px)",
top: 95,
zIndex: 6,
};

const earRight: React.CSSProperties = {
position: "absolute",
width: 24,
height: 62,
borderRadius: 18,
background: "linear-gradient(#8b5cf6,#4c1d95)",
right: "calc(50% - 92px)",
top: 95,
zIndex: 6,
};

const micBar: React.CSSProperties = {
position: "absolute",
width: 56,
height: 8,
borderRadius: 999,
background: "#8b5cf6",
right: "calc(50% - 96px)",
top: 157,
zIndex: 7,
};

const botBody: React.CSSProperties = {
position: "absolute",
width: 110,
height: 68,
bottom: 45,
borderRadius: "55px 55px 32px 32px",
background: "linear-gradient(145deg,#8b5cf6,#4c1d95)",
zIndex: 3,
};

const floorRing: React.CSSProperties = {
position: "absolute",
bottom: 28,
width: 190,
height: 44,
borderRadius: "50%",
border: "1px solid rgba(168,85,247,0.55)",
boxShadow: "0 0 28px rgba(168,85,247,0.35)",
};

const featureGrid: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "repeat(4, 1fr)",
gap: 14,
marginTop: 14,
};

const featureCard: React.CSSProperties = {
minHeight: 112,
padding: 15,
borderRadius: 20,
background: "rgba(8,13,35,0.78)",
border: "1px solid rgba(255,255,255,0.08)",
boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
textAlign: "center",
};

const featureIcon: React.CSSProperties = {
fontSize: 30,
marginBottom: 10,
color: "#a855f7",
};

const featureTitle: React.CSSProperties = {
margin: "0 0 8px",
fontSize: 16,
fontWeight: 950,
};

const featureText: React.CSSProperties = {
margin: 0,
color: "rgba(255,255,255,0.68)",
fontSize: 13,
lineHeight: 1.35,
};

const statsGrid: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "repeat(3, 1fr)",
gap: 14,
marginBottom: 18,
};

const statCard: React.CSSProperties = {
position: "relative",
minHeight: 130,
padding: 20,
borderRadius: 22,
background: "rgba(8,13,35,0.82)",
border: "1px solid rgba(255,255,255,0.08)",
};

const statIcon: React.CSSProperties = {
position: "absolute",
top: 18,
right: 18,
width: 42,
height: 42,
display: "grid",
placeItems: "center",
borderRadius: 12,
background: "rgba(168,85,247,0.16)",
color: "#c084fc",
fontSize: 22,
};

const statValue: React.CSSProperties = {
margin: 0,
fontSize: 42,
fontWeight: 950,
};

const statLabel: React.CSSProperties = {
margin: "13px 0 0",
color: "rgba(255,255,255,0.82)",
fontSize: 14,
fontWeight: 800,
};

const growth: React.CSSProperties = {
margin: "12px 0 0",
color: "#4ade80",
fontSize: 13,
fontWeight: 900,
};

const systemStrip: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "repeat(3, 1fr)",
gap: 12,
marginBottom: 18,
padding: 16,
borderRadius: 24,
background: "rgba(8,13,35,0.78)",
border: "1px solid rgba(255,255,255,0.08)",
};

const systemItem: React.CSSProperties = {
display: "flex",
gap: 12,
alignItems: "flex-start",
};

const systemIcon: React.CSSProperties = {
color: "#a78bfa",
fontSize: 28,
};

const systemLabel: React.CSSProperties = {
margin: 0,
color: "rgba(255,255,255,0.62)",
fontSize: 13,
};

const greenText: React.CSSProperties = {
margin: "4px 0",
color: "#4ade80",
fontSize: 24,
fontWeight: 950,
};

const purpleNumber: React.CSSProperties = {
margin: "4px 0",
color: "#c084fc",
fontSize: 23,
fontWeight: 950,
};

const muted: React.CSSProperties = {
margin: 0,
color: "rgba(255,255,255,0.62)",
};

const activeDot: React.CSSProperties = {
margin: 0,
color: "#4ade80",
};

const panel: React.CSSProperties = {
borderRadius: 24,
padding: 18,
background: "rgba(8,13,35,0.78)",
border: "1px solid rgba(255,255,255,0.08)",
};

const panelHeader: React.CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
};

const panelTitle: React.CSSProperties = {
margin: 0,
fontSize: 24,
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
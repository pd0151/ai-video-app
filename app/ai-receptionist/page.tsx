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
headers: { "Content-Type": "application/json" },
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
headers: { "Content-Type": "application/json" },
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
newJobs: isPaid ? leads.filter((l) => !l.status || l.status === "new").length : 0,
};
}, [leads, isPaid]);

const latestLead = leads[0];

return (
<main style={page}>
<button onClick={() => router.push("/")} style={backBtn}>
‹
</button>

<section style={hero}>
<div style={topRow}>
<span style={livePill}>
<span style={greenDot}></span> LIVE AI CALL SYSTEM
</span>

<span style={onlinePill}>
<span style={bigGreenDot}></span> AI Online
</span>
</div>

<div style={heroInner}>
<div style={heroText}>
<h1 style={title}>
Never miss
<span style={titlePurple}>another job</span>
</h1>

<div style={setupBox}>
<span style={tickBox}>✓</span>
<span>
{setupComplete ? "AI Receptionist Setup Complete" : "Waiting For Setup"}
</span>
</div>

<p style={subText}>
AI answers missed calls, captures customer details and sends the job
straight to your dashboard.
</p>

<button onClick={testLead} style={testButton}>
{loading ? "Sending..." : "Test Lead"}
</button>
</div>

<div style={robotWrap}>
<div style={robotGlow}></div>
<div style={robotOrbitOne}></div>
<div style={robotOrbitTwo}></div>
<div style={robotBody}></div>
<div style={headsetBand}></div>
<div style={robotHead}>
<span style={eyeLeft}></span>
<span style={eyeRight}></span>
<span style={smile}></span>
</div>
<div style={earLeft}></div>
<div style={earRight}></div>
<div style={mic}></div>
<div style={baseRing}></div>
</div>
</div>

<div style={featureGrid}>
<Feature icon="☎" title="AI Online" text="Always ready to answer" />
<Feature icon="◷" title="24/7 Coverage" text="Never miss a call again" />
<Feature icon="ϟ" title="Instant Alerts" text="Get SMS as soon as it lands" />
<Feature icon="◇" title="Secure & Safe" text="Your data is always protected" />
</div>
</section>

<section style={statsGrid}>
<Stat value={String(stats.calls)} label="Calls handled" icon="☎" />
<Stat value={String(stats.captured)} label="Leads captured" icon="◌" />
<Stat value={String(stats.newJobs)} label="New jobs" icon="□" />
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
padding: "86px 18px 155px",
color: "white",
fontFamily: "Inter, Arial, sans-serif",
background:
"radial-gradient(circle at 50% -8%, rgba(124,58,237,0.34), transparent 34%), linear-gradient(180deg,#07001d 0%,#080116 52%,#020617 100%)",
overflowX: "hidden",
};

const backBtn: React.CSSProperties = {
position: "absolute",
top: 26,
left: 18,
width: 46,
height: 46,
borderRadius: 15,
border: "1px solid rgba(255,255,255,0.14)",
background: "rgba(255,255,255,0.07)",
backdropFilter: "blur(16px)",
color: "white",
fontSize: 34,
lineHeight: 0,
zIndex: 30,
};

const hero: React.CSSProperties = {
position: "relative",
borderRadius: 30,
padding: 16,
marginBottom: 14,
minHeight: 525,
background:
"radial-gradient(circle at 78% 34%, rgba(147,51,234,0.36), transparent 34%), linear-gradient(145deg, rgba(58,13,116,0.72), rgba(7,7,28,0.98))",
border: "1px solid rgba(168,85,247,0.72)",
boxShadow:
"0 0 34px rgba(126,34,206,0.24), inset 0 0 42px rgba(255,255,255,0.025)",
overflow: "hidden",
};

const topRow: React.CSSProperties = {
display: "flex",
alignItems: "center",
justifyContent: "space-between",
gap: 8,
marginBottom: 18,
};

const livePill: React.CSSProperties = {
display: "inline-flex",
alignItems: "center",
gap: 7,
padding: "8px 12px",
borderRadius: 999,
background: "rgba(255,255,255,0.075)",
color: "#4ade80",
fontSize: 12,
fontWeight: 950,
whiteSpace: "nowrap",
};

const onlinePill: React.CSSProperties = {
display: "inline-flex",
alignItems: "center",
gap: 8,
padding: "8px 12px",
borderRadius: 999,
background: "rgba(3,7,18,0.76)",
border: "1px solid rgba(255,255,255,0.12)",
fontSize: 12,
fontWeight: 950,
whiteSpace: "nowrap",
};

const greenDot: React.CSSProperties = {
width: 8,
height: 8,
borderRadius: "50%",
background: "#4ade80",
};

const bigGreenDot: React.CSSProperties = {
width: 17,
height: 17,
borderRadius: "50%",
background: "linear-gradient(135deg,#22c55e,#86efac)",
boxShadow: "0 0 16px rgba(34,197,94,0.8)",
};

const heroInner: React.CSSProperties = {
position: "relative",
minHeight: 315,
};

const heroText: React.CSSProperties = {
position: "relative",
zIndex: 3,
width: "52%",
};

const title: React.CSSProperties = {
margin: 0,
fontSize: "clamp(34px, 8.5vw, 52px)",
lineHeight: 0.9,
letterSpacing: -2,
fontWeight: 950,
};

const titlePurple: React.CSSProperties = {
display: "block",
marginTop: 6,
color: "#9b4dff",
};

const setupBox: React.CSSProperties = {
display: "flex",
alignItems: "center",
gap: 8,
marginTop: 14,
padding: "8px 12px",
borderRadius: 14,
background: "rgba(255,255,255,0.12)",
border: "1px solid rgba(255,255,255,0.1)",
fontWeight: 900,
fontSize: 13,
maxWidth: 270,
};

const tickBox: React.CSSProperties = {
width: 24,
height: 24,
minWidth: 24,
borderRadius: 7,
display: "grid",
placeItems: "center",
background: "linear-gradient(135deg,#16a34a,#86efac)",
color: "white",
fontWeight: 950,
};

const subText: React.CSSProperties = {
margin: "14px 0 0",
color: "rgba(255,255,255,0.76)",
fontSize: 14,
lineHeight: 1.42,
maxWidth: 250,
};

const testButton: React.CSSProperties = {
marginTop: 18,
width: 205,
maxWidth: "100%",
padding: "15px 16px",
borderRadius: 15,
border: "none",
background: "linear-gradient(90deg,#22c55e,#86efac)",
color: "#04130a",
fontSize: 16,
fontWeight: 950,
boxShadow: "0 16px 35px rgba(34,197,94,0.2)",
};

const robotWrap: React.CSSProperties = {
position: "absolute",
right: -18,
top: 52,
width: 215,
height: 240,
display: "flex",
alignItems: "center",
justifyContent: "center",
transform: "scale(0.94)",
transformOrigin: "center",
zIndex: 2,
};

const robotGlow: React.CSSProperties = {
position: "absolute",
width: 232,
height: 232,
borderRadius: "50%",
background: "radial-gradient(circle, rgba(147,51,234,0.85), transparent 66%)",
filter: "blur(14px)",
opacity: 0.82,
};

const robotOrbitOne: React.CSSProperties = {
position: "absolute",
right: 8,
top: 70,
width: 185,
height: 185,
borderRadius: "50%",
border: "1px solid rgba(168,85,247,0.14)",
};

const robotOrbitTwo: React.CSSProperties = {
position: "absolute",
right: 34,
bottom: 28,
width: 168,
height: 44,
borderRadius: "50%",
border: "1px solid rgba(168,85,247,0.45)",
boxShadow: "0 0 26px rgba(168,85,247,0.35)",
};

const headsetBand: React.CSSProperties = {
position: "absolute",
top: 35,
width: 150,
height: 118,
borderRadius: "70px 70px 22px 22px",
borderTop: "9px solid #8b5cf6",
zIndex: 4,
};

const robotHead: React.CSSProperties = {
position: "relative",
width: 130,
height: 110,
borderRadius: 34,
background: "linear-gradient(145deg,#15142f,#020617)",
border: "5px solid #8b5cf6",
boxShadow: "0 0 38px rgba(168,85,247,0.72)",
zIndex: 5,
};

const eyeLeft: React.CSSProperties = {
position: "absolute",
top: 39,
left: 34,
width: 18,
height: 18,
borderRadius: "50%",
background: "#5eead4",
boxShadow: "0 0 18px #5eead4",
};

const eyeRight: React.CSSProperties = {
position: "absolute",
top: 39,
right: 34,
width: 18,
height: 18,
borderRadius: "50%",
background: "#5eead4",
boxShadow: "0 0 18px #5eead4",
};

const smile: React.CSSProperties = {
position: "absolute",
left: "50%",
bottom: 25,
width: 34,
height: 16,
transform: "translateX(-50%)",
borderBottom: "5px solid #5eead4",
borderRadius: "0 0 30px 30px",
};

const earLeft: React.CSSProperties = {
position: "absolute",
width: 26,
height: 64,
borderRadius: 18,
background: "linear-gradient(#8b5cf6,#4c1d95)",
left: 30,
top: 93,
zIndex: 6,
};

const earRight: React.CSSProperties = {
position: "absolute",
width: 26,
height: 64,
borderRadius: 18,
background: "linear-gradient(#8b5cf6,#4c1d95)",
right: 30,
top: 93,
zIndex: 6,
};

const mic: React.CSSProperties = {
position: "absolute",
width: 56,
height: 8,
borderRadius: 999,
background: "#8b5cf6",
right: 22,
top: 156,
zIndex: 7,
};

const robotBody: React.CSSProperties = {
position: "absolute",
width: 108,
height: 66,
bottom: 49,
borderRadius: "50px 50px 32px 32px",
background: "linear-gradient(145deg,#8b5cf6,#4c1d95)",
zIndex: 3,
};

const baseRing: React.CSSProperties = {
position: "absolute",
bottom: 34,
width: 122,
height: 29,
borderRadius: "50%",
border: "1px solid rgba(255,255,255,0.1)",
};

const featureGrid: React.CSSProperties = {
position: "absolute",
left: 16,
right: 16,
bottom: 16,
display: "grid",
gridTemplateColumns: "repeat(4, 1fr)",
gap: 8,
};

const featureCard: React.CSSProperties = {
minHeight: 88,
padding: "10px 6px",
borderRadius: 16,
background: "rgba(8,13,35,0.82)",
border: "1px solid rgba(168,85,247,0.14)",
boxShadow:
"0 0 18px rgba(124,58,237,0.14), inset 0 1px 0 rgba(255,255,255,0.06)",
textAlign: "center",
};

const featureIcon: React.CSSProperties = {
fontSize: 24,
marginBottom: 7,
color: "#a855f7",
};

const featureTitle: React.CSSProperties = {
margin: "0 0 5px",
fontSize: 12,
fontWeight: 950,
};

const featureText: React.CSSProperties = {
margin: 0,
color: "rgba(255,255,255,0.68)",
fontSize: 10.5,
lineHeight: 1.22,
};

const statsGrid: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "repeat(3, 1fr)",
gap: 8,
marginBottom: 14,
};

const statCard: React.CSSProperties = {
position: "relative",
minHeight: 106,
padding: 12,
borderRadius: 18,
background:
"linear-gradient(180deg, rgba(8,13,35,0.92), rgba(15,10,40,0.95))",
border: "1px solid rgba(168,85,247,0.14)",
boxShadow:
"0 0 18px rgba(124,58,237,0.12), inset 0 1px 0 rgba(255,255,255,0.03)",
};

const statIcon: React.CSSProperties = {
position: "absolute",
top: 12,
right: 12,
width: 34,
height: 34,
display: "grid",
placeItems: "center",
borderRadius: 10,
background: "rgba(168,85,247,0.16)",
color: "#c084fc",
fontSize: 18,
};

const statValue: React.CSSProperties = {
margin: 0,
fontSize: 34,
fontWeight: 950,
};

const statLabel: React.CSSProperties = {
margin: "12px 0 0",
color: "rgba(255,255,255,0.82)",
fontSize: 12,
fontWeight: 800,
};

const growth: React.CSSProperties = {
margin: "10px 0 0",
color: "#4ade80",
fontSize: 11,
fontWeight: 900,
};

const systemStrip: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "repeat(3, 1fr)",
gap: 8,
marginBottom: 14,
padding: 13,
borderRadius: 20,
background: "rgba(8,13,35,0.78)",
border: "1px solid rgba(255,255,255,0.08)",
};

const systemItem: React.CSSProperties = {
display: "flex",
gap: 8,
alignItems: "flex-start",
};

const systemIcon: React.CSSProperties = {
color: "#a78bfa",
fontSize: 22,
};

const systemLabel: React.CSSProperties = {
margin: 0,
color: "rgba(255,255,255,0.62)",
fontSize: 11,
};

const greenText: React.CSSProperties = {
margin: "4px 0",
color: "#4ade80",
fontSize: 18,
fontWeight: 950,
};

const purpleNumber: React.CSSProperties = {
margin: "4px 0",
color: "#c084fc",
fontSize: 17,
fontWeight: 950,
};

const muted: React.CSSProperties = {
margin: 0,
color: "rgba(255,255,255,0.62)",
fontSize: 11,
};

const activeDot: React.CSSProperties = {
margin: 0,
color: "#4ade80",
fontSize: 11,
};

const panel: React.CSSProperties = {
borderRadius: 22,
padding: 16,
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
fontSize: 22,
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
position: "relative",
overflow: "hidden",
background:
"linear-gradient(145deg, rgba(10,15,35,0.98), rgba(35,12,70,0.96))",
border: "1px solid rgba(168,85,247,0.24)",
borderRadius: 28,
padding: 18,
marginTop: 16,
boxShadow:
"0 0 24px rgba(124,58,237,0.12), inset 0 1px 0 rgba(255,255,255,0.03)",
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
marginTop: 16,
background: "rgba(0,0,0,0.24)",
padding: 16,
borderRadius: 18,
lineHeight: 1.6,
border: "1px solid rgba(255,255,255,0.04)",
backdropFilter: "blur(10px)",
};

const leadButtons: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: 10,
marginTop: 14,
};

const callBtn: React.CSSProperties = {
padding: 15,
borderRadius: 16,
background: "linear-gradient(90deg,#7c3aed,#a855f7)",
color: "white",
textDecoration: "none",
textAlign: "center",
fontWeight: 900,
boxShadow: "0 10px 25px rgba(124,58,237,0.28)",
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
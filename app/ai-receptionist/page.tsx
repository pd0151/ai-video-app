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


function getJobValue(job: string | null, label: string) {
if (!job) return "";

const match = job.match(new RegExp(`${label}:\\s*([^\\n]+)`, "i"));
return match?.[1]?.trim() || "";
}
export default function AIReceptionistPage() {
const router = useRouter();

const [leads, setLeads] = useState<Lead[]>([]);
const [loading, setLoading] = useState(false);
const [isAdmin] = useState(false);
const [isPaid, setIsPaid] = useState(false);
const [setupComplete, setSetupComplete] = useState(false);
const [business, setBusiness] = useState<any>(null);
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
.select("id, stripe_customer_id")
.eq("email", email)
.maybeSingle();
setBusiness(business);
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
async function manageBilling() {
const email = localStorage.getItem("user");

if (!email) {
alert("Please log in first");
return;
}

const res = await fetch("/api/create-billing-portal", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
customerId: business?.stripe_customer_id,
email,
}),
});

const data = await res.json();

if (data.url) {
window.location.href = data.url;
} else {
alert(data.error || "Billing portal failed");
}
}
useEffect(() => {
loadLeads();
checkSubscription();

const channel = supabase
.channel("realtime-leads")
.on(
"postgres_changes",
{
event: "*",
schema: "public",
table: "leads",
},
() => {
loadLeads();
checkSubscription();
}
)
.subscribe();

return () => {
supabase.removeChannel(channel);
};
}, []);

const stats = useMemo(() => {
return {
calls: isPaid ? leads.length : 0,
captured: isPaid ? leads.length : 0,
newJobs: isPaid ? leads.filter((l) => !l.status || l.status === "new").length : 0,
};
}, [leads, isPaid]);

const latestLead = leads[0];
const setupSteps = [
setupComplete,
isPaid,
leads.length > 0,
];

const completedSteps = setupSteps.filter(Boolean).length;
const progress = (completedSteps / setupSteps.length) * 100;
return (
<main style={page}>
  <div style={progressWrap}>
<div style={progressTop}>
<span>AI Setup Progress</span>
<span>
{progress === 100
? "AI Live"
: progress > 50
? "AI Training"
: "Pending Activation"}
</span>
</div>

<div style={progressBarBg}>
<div
style={{
...progressBar,
width: `${progress}%`,
}}
/>
</div>
</div>  
 <style>{`
@keyframes fadeUp {
from {
opacity: 0;
transform: translateY(18px);
}

to {
opacity: 1;
transform: translateY(0);
}
}
@keyframes floatBot {
0%, 100% {
transform: translateY(0px);
}

50% {
transform: translateY(-10px);
}
}
@keyframes ambientGlow {
0%, 100% {
transform: translate3d(0, 0, 0) scale(1);
opacity: 0.45;
}

50% {
transform: translate3d(-18px, 14px, 0) scale(1.08);
opacity: 0.75;
}
}
@keyframes aiNavGlow {
0%, 100% {
filter: drop-shadow(0 0 5px rgba(168,85,247,0.55));
}

50% {
filter: drop-shadow(0 0 16px rgba(168,85,247,1));
}
}
`}</style>   
<button onClick={() => router.push("/")} style={backBtn}>
‹
</button>

<section style={hero}>
<div style={ambientOne}></div>
<div style={ambientTwo}></div>   
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

{isAdmin && (
<button onClick={testLead} style={testButton}>
{loading ? "Sending..." : "Test Lead"}
</button>
)}
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
<Feature icon="◉" title="AI Online" text="Always ready to answer" />
<Feature icon="◔" title="24/7 Coverage" text="Never miss a call again" />
<Feature icon="⌁" title="Instant Alerts" text="Get SMS as soon as it lands" />
<Feature icon="⬡" title="Secure & Safe" text="Your data is always protected" />
</div>
</section>

<section style={statsGrid}>
<Stat value={String(stats.calls)} label="Calls handled" icon="◉" />
<Stat value={String(stats.captured)} label="Leads captured" icon="◎" />
<Stat value={String(stats.newJobs)} label="New jobs" icon="⬒" />
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
<button
onClick={manageBilling}
style={{
...upgradeBtn,
marginTop: 12,
background: "rgba(rgba(220,235,255,0,22),0.12)",
color: "#fff",
cursor: "pointer",
}}
>
⚙️ Manage Billing
</button>
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
<p><b>👤 Customer:</b> {lead.name || getJobValue(lead.job, "Name") || "Not provided"}</p>
<p><b>🚗 Vehicle:</b> {lead.vehicle || getJobValue(lead.job, "Vehicle") || "Not provided"}</p>
<p><b>🛞 Tyre size:</b> {lead.tyre_size || getJobValue(lead.job, "Tyre size") || "Not provided"}</p>
<p>
<b>⚠️ Issue:</b>{" "}
{lead.issue || lead.job?.split("Phone:")[0] || "No details"}
</p>
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
const green = "#ffffff";
const darkGreen = "#eaf0ff";

const xeonBorder = "1px solid rgba(220,235,255,0.28)";
const xeonGlow =
"0 0 3px rgba(255,255,255,0.55), 0 0 22px rgba(220,235,255,0.28), 0 0 60px rgba(120,160,255,0.16)";
const xeonGlowStrong =
"0 0 6px rgba(255,255,255,0.85), 0 0 30px rgba(220,235,255,0.45), 0 0 75px rgba(120,160,255,0.22)";
const glassBg = "rgba(8,12,22,0.78)";
const cardBg = "rgba(10,14,24,0.92)";
const whiteBtn = "linear-gradient(180deg,#ffffff,#eaf0ff)";

const progressWrap: React.CSSProperties = {
marginBottom: 20,
padding: 16,
borderRadius: 20,
background: cardBg,
border: xeonBorder,
boxShadow: xeonGlow,
backdropFilter: "blur(16px)",
};

const progressTop: React.CSSProperties = {
display: "flex",
justifyContent: "space-between",
marginBottom: 10,
color: "#fff",
fontWeight: 800,
};

const progressBarBg: React.CSSProperties = {
width: "100%",
height: 10,
borderRadius: 999,
background: "rgba(255,255,255,0.08)",
overflow: "hidden",
border: xeonBorder,
};

const progressBar: React.CSSProperties = {
height: "100%",
borderRadius: 999,
background: whiteBtn,
transition: "width 1s ease",
boxShadow: xeonGlowStrong,
};

const page: React.CSSProperties = {
minHeight: "100vh",
padding: "86px 18px 155px",
color: "white",
fontFamily: "Inter, Arial, sans-serif",
background:
"radial-gradient(circle at 72% 0%, rgba(220,235,255,0.10), transparent 34%), radial-gradient(circle at 28% 35%, rgba(120,160,255,0.10), transparent 32%), #05070d",
overflowX: "hidden",
};

const backBtn: React.CSSProperties = {
position: "absolute",
top: 26,
left: 18,
width: 46,
height: 46,
borderRadius: 15,
border: xeonBorder,
background: glassBg,
backdropFilter: "blur(16px)",
color: "white",
fontSize: 34,
lineHeight: 0,
zIndex: 30,
boxShadow: xeonGlow,
};

const hero: React.CSSProperties = {
position: "relative",
animation: "fadeUp 0.55s ease both",
borderRadius: 30,
padding: 16,
marginBottom: 14,
minHeight: 525,
background:
"radial-gradient(circle at 78% 34%, rgba(220,235,255,0.12), transparent 34%), linear-gradient(145deg, rgba(10,14,24,0.96), rgba(0,0,0,0.98))",
border: xeonBorder,
boxShadow: xeonGlowStrong,
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
background: glassBg,
border: xeonBorder,
color: green,
fontSize: 12,
fontWeight: 950,
whiteSpace: "nowrap",
boxShadow: xeonGlow,
};

const onlinePill: React.CSSProperties = {
display: "inline-flex",
alignItems: "center",
gap: 8,
padding: "8px 12px",
borderRadius: 999,
background: "rgba(69,255,138,0.12)",
border: "1px solid rgba(69,255,138,0.25)",
fontSize: 12,
fontWeight: 950,
whiteSpace: "nowrap",
boxShadow: "0 0 18px rgba(69,255,138,0.15)",
};

const greenDot: React.CSSProperties = {
width: 10,
height: 10,
borderRadius: "50%",
background: "#45ff8a",
boxShadow: "0 0 16px rgba(69,255,138,0.9)",
};

const bigGreenDot: React.CSSProperties = {
width: 12,
height: 12,
borderRadius: "50%",
background: whiteBtn,
boxShadow: "0 0 18px rgba(220,235,255,0.85)",
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
color: "#ffffff",
textShadow: "0 0 18px rgba(220,235,255,0.45)",
};

const setupBox: React.CSSProperties = {
display: "flex",
alignItems: "center",
gap: 8,
marginTop: 14,
padding: "8px 12px",
borderRadius: 14,
background: glassBg,
border: xeonBorder,
fontWeight: 900,
fontSize: 13,
maxWidth: 270,
boxShadow: "0 0 18px rgba(69,255,138,0.35)",
};

const tickBox: React.CSSProperties = {
width: 24,
height: 24,
minWidth: 24,
borderRadius: 7,
display: "grid",
placeItems: "center",
background: whiteBtn,
color: "#05070d",
fontWeight: 950,
boxShadow: xeonGlow,
};

const subText: React.CSSProperties = {
margin: "14px 0 0",
color: "rgba(255,255,255,0.76)",
fontSize: 14,
lineHeight: 1.42,
maxWidth: 250,
};

const robotGlow: React.CSSProperties = {
position: "absolute",
width: 232,
height: 232,
borderRadius: "50%",
background: "radial-gradient(circle, rgba(220,235,255,0.35), transparent 66%)",
filter: "blur(14px)",
opacity: 0.82,
};

const robotWrap: React.CSSProperties = {
position: "absolute",
right: -18,
top: 52,
animation: "floatBot 4s ease-in-out infinite",
width: 215,
height: 240,
display: "flex",
alignItems: "center",
justifyContent: "center",
transform: "scale(0.94)",
transformOrigin: "center",
zIndex: 2,
};

const robotOrbitOne: React.CSSProperties = {
position: "absolute",
right: 8,
top: 70,
width: 185,
height: 185,
borderRadius: "50%",
border: xeonBorder,
};

const robotOrbitTwo: React.CSSProperties = {
position: "absolute",
right: 34,
bottom: 28,
width: 168,
height: 44,
borderRadius: "50%",
border: xeonBorder,
boxShadow: xeonGlow,
};

const headsetBand: React.CSSProperties = {
position: "absolute",
top: 35,
width: 150,
height: 118,
borderRadius: "70px 70px 22px 22px",
borderTop: "9px solid #ffffff",
zIndex: 4,
filter: "drop-shadow(0 0 16px rgba(220,235,255,0.55))",
};

const robotHead: React.CSSProperties = {
position: "relative",
width: 130,
height: 110,
borderRadius: 34,
background: "linear-gradient(145deg,#101827,#020617)",
border: "5px solid #ffffff",
boxShadow: xeonGlowStrong,
zIndex: 5,
};

const eyeLeft: React.CSSProperties = {
position: "absolute",
top: 39,
left: 34,
width: 18,
height: 18,
borderRadius: "50%",
background: "#ffffff",
boxShadow: "0 0 18px rgba(220,235,255,0.9)",
};

const eyeRight: React.CSSProperties = {
...eyeLeft,
left: "auto",
right: 34,
};

const smile: React.CSSProperties = {
position: "absolute",
left: "50%",
bottom: 25,
width: 34,
height: 16,
transform: "translateX(-50%)",
borderBottom: "5px solid #ffffff",
borderRadius: "0 0 30px 30px",
};

const earLeft: React.CSSProperties = {
position: "absolute",
width: 26,
height: 64,
borderRadius: 18,
background: whiteBtn,
left: 30,
top: 93,
zIndex: 6,
boxShadow: xeonGlow,
};

const earRight: React.CSSProperties = {
...earLeft,
left: "auto",
right: 30,
};

const mic: React.CSSProperties = {
position: "absolute",
width: 56,
height: 8,
borderRadius: 999,
background: "#ffffff",
right: 22,
top: 156,
zIndex: 7,
boxShadow: xeonGlow,
};

const robotBody: React.CSSProperties = {
position: "absolute",
width: 108,
height: 66,
bottom: 49,
borderRadius: "50px 50px 32px 32px",
background: whiteBtn,
zIndex: 3,
boxShadow: xeonGlow,
};

const baseRing: React.CSSProperties = {
position: "absolute",
bottom: 34,
width: 122,
height: 29,
borderRadius: "50%",
border: xeonBorder,
};

const ambientOne: React.CSSProperties = {
position: "absolute",
width: 320,
height: 320,
borderRadius: "50%",
background: "radial-gradient(circle, rgba(220,235,255,0.16), transparent 70%)",
top: -80,
right: -60,
filter: "blur(20px)",
animation: "ambientGlow 7s ease-in-out infinite",
pointerEvents: "none",
};

const ambientTwo: React.CSSProperties = {
position: "absolute",
width: 260,
height: 260,
borderRadius: "50%",
background: "radial-gradient(circle, rgba(120,160,255,0.12), transparent 70%)",
bottom: 40,
left: -100,
filter: "blur(24px)",
animation: "ambientGlow 9s ease-in-out infinite reverse",
pointerEvents: "none",
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
background: glassBg,
border: xeonBorder,
boxShadow: xeonGlow,
textAlign: "center",
backdropFilter: "blur(10px)",
};

const featureIcon: React.CSSProperties = {
fontSize: 24,
marginBottom: 7,
color: green,
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
minHeight: 102,
padding: 12,
borderRadius: 20,
background: cardBg,
border: xeonBorder,
boxShadow: xeonGlow,
backdropFilter: "blur(14px)",
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
background: glassBg,
border: xeonBorder,
color: green,
fontSize: 18,
boxShadow: xeonGlow,
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
color: green,
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
background: cardBg,
border: xeonBorder,
boxShadow: xeonGlow,
backdropFilter: "blur(14px)",
};

const systemItem: React.CSSProperties = {
display: "flex",
gap: 8,
alignItems: "flex-start",
};

const systemIcon: React.CSSProperties = {
color: green,
fontSize: 22,
};

const systemLabel: React.CSSProperties = {
margin: 0,
color: "rgba(255,255,255,0.62)",
fontSize: 11,
};

const greenText: React.CSSProperties = {
margin: "4px 0",
color: green,
fontSize: 18,
fontWeight: 950,
};

const purpleNumber: React.CSSProperties = {
margin: "4px 0",
color: "#ffffff",
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
color: green,
fontSize: 11,
};

const panel: React.CSSProperties = {
borderRadius: 22,
padding: 16,
background: cardBg,
border: xeonBorder,
boxShadow: xeonGlow,
backdropFilter: "blur(16px)",
};

const panelHeader: React.CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
};

const panelTitle: React.CSSProperties = {
margin: 0,
fontSize: 22,
color: "white",
};

const viewAll: React.CSSProperties = {
color: green,
fontWeight: 900,
};

const lockBox: React.CSSProperties = {
background: glassBg,
border: xeonBorder,
borderRadius: 18,
padding: 18,
marginTop: 16,
marginBottom: 16,
textAlign: "center",
boxShadow: xeonGlow,
};

const upgradeBtn: React.CSSProperties = {
padding: 16,
borderRadius: 18,
border: "1px solid rgba(255,255,255,0.78)",
background: whiteBtn,
color: "#05070d",
fontWeight: 900,
fontSize: 16,
boxShadow: xeonGlowStrong,
};

const empty: React.CSSProperties = {
opacity: 0.65,
fontSize: 17,
};

const leadCard: React.CSSProperties = {
position: "relative",
overflow: "hidden",
background: cardBg,
border: xeonBorder,
borderRadius: 28,
padding: 18,
marginTop: 16,
boxShadow: xeonGlow,
backdropFilter: "blur(14px)",
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
background: glassBg,
color: green,
padding: "9px 13px",
borderRadius: 999,
fontSize: 11,
fontWeight: 950,
border: xeonBorder,
boxShadow: xeonGlow,
};

const infoBox: React.CSSProperties = {
marginTop: 16,
background: glassBg,
padding: 16,
borderRadius: 20,
lineHeight: 1.65,
border: xeonBorder,
boxShadow: xeonGlow,
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
background: whiteBtn,
color: "#05070d",
textDecoration: "none",
textAlign: "center",
fontWeight: 900,
border: "1px solid rgba(255,255,255,0.78)",
boxShadow: xeonGlow,
};

const waBtn: React.CSSProperties = {
padding: 14,
borderRadius: 16,
background: "#05070b",
color: "#45ff8a",
textDecoration: "none",
textAlign: "center",
fontWeight: 900,
border: "1px solid rgba(69,255,138,0.35)",
boxShadow: "0 0 18px rgba(69,255,138,0.18)",
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
border: xeonBorder,
background: glassBg,
color: "white",
fontWeight: 800,
fontSize: 12,
boxShadow: xeonGlow,
};

const testButton: React.CSSProperties = {
marginTop: 18,
width: 205,
maxWidth: "100%",
padding: "15px 16px",
borderRadius: 15,
border: "1px solid rgba(255,255,255,0.78)",
background: whiteBtn,
color: "#05070d",
fontSize: 16,
fontWeight: 950,
boxShadow: xeonGlowStrong,
};
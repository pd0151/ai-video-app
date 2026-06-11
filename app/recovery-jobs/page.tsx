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
const { data, error } = await supabase
.from("recovery_jobs")
.select("*")
.eq("status", "open")
.order("created_at", { ascending: false });




setJobs(data || []);
}

return (
<div
style={{
minHeight: "100vh",
background: "#05070d",
padding: 20,
color: "#fff",
}}
>
<h1>Live Recovery Jobs</h1>

{jobs.map((job) => (
<div
key={job.id}
style={{
padding: 20,
marginTop: 16,
borderRadius: 20,
border: "1px solid rgba(255,255,255,0.1)",
}}
>
<h3>{job.vehicle}</h3>

<p>{job.location}</p>

<p>{job.issue}</p>

<p>{job.customer_phone}</p>
</div>
))}
</div>
);
}
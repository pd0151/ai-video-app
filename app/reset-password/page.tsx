"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResetPasswordPage() {
const router = useRouter();
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);

async function updatePassword() {
if (!password || password.length < 6) {
alert("Password must be at least 6 characters");
return;
}

setLoading(true);

const { error } = await supabase.auth.updateUser({
password,
});

setLoading(false);

if (error) {
alert(error.message);
return;
}

alert("Password updated successfully");
router.push("/login");
}

return (
<main
style={{
minHeight: "100vh",
background: "#04140c",
color: "white",
padding: 24,
display: "flex",
justifyContent: "center",
alignItems: "center",
}}
>
<div style={{ width: "100%", maxWidth: 420 }}>
<h1 style={{ fontSize: 34, marginBottom: 12 }}>Reset Password</h1>

<input
type="password"
placeholder="New password"
value={password}
onChange={(e) => setPassword(e.target.value)}
style={{
width: "100%",
padding: 18,
borderRadius: 16,
border: "1px solid rgba(rgba(220,235,255,0,22),0.35)",
background: "#020b08",
color: "white",
fontSize: 18,
marginBottom: 18,
}}
/>

<button
onClick={updatePassword}
disabled={loading}
style={{
width: "100%",
padding: 18,
borderRadius: 18,
border: "none",
background: "#FFFFFF",
color: "#001b0c",
fontWeight: 900,
fontSize: 20,
}}
>
{loading ? "Updating..." : "Update Password"}
</button>
</div>
</main>
);
}
"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";

export default function LoginPage() {
const supabase = createClient();
const router = useRouter();

const [mode, setMode] = useState<"login" | "signup">("login");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");

const handleSubmit = async () => {
setLoading(true);
setMessage("");

if (!email || !password) {
setMessage("Enter email and password");
setLoading(false);
return;
}

try {
if (mode === "login") {
const { error } = await supabase.auth.signInWithPassword({
email,
password,
});

if (error) {
setMessage(error.message);
} else {
setMessage("Login successful");
router.push("/feed");
router.refresh();
}
} else {
const { error } = await supabase.auth.signUp({
email,
password,
});

if (error) {
setMessage(error.message);
} else {
setMessage("Signup successful. You can now log in.");
setMode("login");
}
}
} catch (error: any) {
setMessage(error?.message || "Something went wrong");
} finally {
setLoading(false);
}
};

return (
<main style={styles.page}>
<div style={styles.card}>
<h1 style={styles.title}>AI App Login</h1>
<p style={styles.subtitle}>
Login or create an account to use your app
</p>

<div style={styles.switchRow}>
<button
onClick={() => setMode("login")}
style={{
...styles.switchButton,
...(mode === "login" ? styles.switchButtonActive : {}),
}}
>
Login
</button>
<button
onClick={() => setMode("signup")}
style={{
...styles.switchButton,
...(mode === "signup" ? styles.switchButtonActive : {}),
}}
>
Sign up
</button>
</div>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e) => setEmail(e.target.value)}
style={styles.input}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e) => setPassword(e.target.value)}
style={styles.input}
/>

<button onClick={handleSubmit} disabled={loading} style={styles.button}>
{loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
</button>

{message ? <p style={styles.message}>{message}</p> : null}
</div>
</main>
);
}

const styles: Record<string, React.CSSProperties> = {
page: {
minHeight: "100vh",
display: "flex",
alignItems: "center",
justifyContent: "center",
background:
"linear-gradient(180deg, #0f172a 0%, #142850 45%, #1e3a8a 100%)",
padding: "24px",
},
card: {
width: "100%",
maxWidth: "420px",
background: "rgba(15, 23, 42, 0.9)",
border: "1px solid rgba(255,255,255,0.12)",
borderRadius: "24px",
padding: "28px",
boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
},
title: {
color: "white",
fontSize: "34px",
fontWeight: 800,
margin: "0 0 8px",
},
subtitle: {
color: "rgba(255,255,255,0.75)",
margin: "0 0 20px",
fontSize: "15px",
},
switchRow: {
display: "flex",
gap: "10px",
marginBottom: "18px",
},
switchButton: {
flex: 1,
border: "none",
borderRadius: "14px",
padding: "12px 16px",
cursor: "pointer",
fontWeight: 700,
background: "rgba(255,255,255,0.12)",
color: "white",
},
switchButtonActive: {
background: "linear-gradient(135deg, #60a5fa, #2563eb)",
},
input: {
width: "100%",
padding: "14px 16px",
marginBottom: "12px",
borderRadius: "14px",
border: "1px solid rgba(255,255,255,0.15)",
background: "rgba(255,255,255,0.08)",
color: "white",
fontSize: "16px",
outline: "none",
boxSizing: "border-box",
},
button: {
width: "100%",
border: "none",
borderRadius: "14px",
padding: "14px 18px",
cursor: "pointer",
fontWeight: 800,
fontSize: "16px",
color: "white",
background: "linear-gradient(135deg, #60a5fa, #2563eb)",
marginTop: "6px",
},
message: {
color: "white",
marginTop: "14px",
fontSize: "14px",
},
};
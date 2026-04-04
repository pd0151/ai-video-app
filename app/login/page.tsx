export const dynamic = "force-dynamic";
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";

export default function LoginPage() {
const supabase = createClient();
const router = useRouter();

const [mode, setMode] = useState<"login" | "signup">("signup");
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

if (mode === "signup") {
const { data, error } = await supabase.auth.signUp({
email,
password,
});

if (error) {
setMessage(error.message);
setLoading(false);
return;
}

if (data.user) {
const username = email.split("@")[0];

await supabase.from("profiles").upsert({
id: data.user.id,
username,
});
}

setMessage("Account created. Now log in.");
setMode("login");
setLoading(false);
return;
}

const { error } = await supabase.auth.signInWithPassword({
email,
password,
});

if (error) {
setMessage(error.message);
setLoading(false);
return;
}

setLoading(false);
router.push("/feed");
router.refresh();
};

return (
<main style={styles.page}>
<div style={styles.card}>
<h1 style={styles.title}>
{mode === "signup" ? "Create account" : "Log in"}
</h1>

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

<button onClick={handleSubmit} style={styles.button} disabled={loading}>
{loading
? "Please wait..."
: mode === "signup"
? "Create account"
: "Log in"}
</button>

<button
onClick={() =>
setMode(mode === "signup" ? "login" : "signup")
}
style={styles.switchButton}
>
{mode === "signup"
? "Already have an account? Log in"
: "Need an account? Sign up"}
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
background: "linear-gradient(180deg, #16234a 0%, #0f1730 100%)",
padding: "20px",
boxSizing: "border-box",
},

card: {
width: "100%",
maxWidth: "380px",
background: "rgba(255,255,255,0.08)",
borderRadius: "20px",
padding: "24px",
boxSizing: "border-box",
backdropFilter: "blur(10px)",
},

title: {
color: "white",
marginTop: 0,
marginBottom: "16px",
fontSize: "28px",
fontWeight: 800,
},

input: {
width: "100%",
height: "48px",
borderRadius: "12px",
border: "none",
padding: "0 14px",
marginBottom: "12px",
fontSize: "15px",
boxSizing: "border-box",
},

button: {
width: "100%",
height: "48px",
borderRadius: "12px",
border: "none",
background: "#4da3ff",
color: "white",
fontSize: "15px",
fontWeight: 700,
cursor: "pointer",
},

switchButton: {
width: "100%",
marginTop: "12px",
background: "transparent",
border: "none",
color: "white",
cursor: "pointer",
fontSize: "14px",
},

message: {
color: "white",
marginTop: "14px",
fontSize: "14px",
},
};
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
const [username, setUsername] = useState("");
const router = useRouter();

function handleLogin() {
const users = JSON.parse(localStorage.getItem("users") || "[]");

if (!users.includes(username.trim())) {
alert("User not found. Sign up first.");
return;
}

localStorage.setItem("user", username.trim());
router.push("/feed");
}

return (
<main className="create-page">
<div className="create-card">
<h1 className="create-title">Login</h1>
<p className="create-subtitle">Enter your username</p>

<input
className="create-input"
placeholder="Username"
value={username}
onChange={(e) => setUsername(e.target.value)}
/>

<div className="create-buttons">
<button className="create-btn primary" onClick={handleLogin}>
Login
</button>
</div>

<p style={{ marginTop: 20 }}>
No account?{" "}
<span
style={{ color: "#4ea1ff", cursor: "pointer" }}
onClick={() => router.push("/signup")}
>
Sign up
</span>
</p>
</div>
</main>
);
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
const [username, setUsername] = useState("");
const router = useRouter();

function handleSignup() {
if (!username.trim()) {
alert("Enter username");
return;
}

// Save user
const users = JSON.parse(localStorage.getItem("users") || "[]");
users.push(username.trim());
localStorage.setItem("users", JSON.stringify(users));

localStorage.setItem("user", username.trim());

router.push("/feed");
}

return (
<main className="create-page">
<div className="create-card">
<h1 className="create-title">Sign Up</h1>
<p className="create-subtitle">Create your account</p>

<input
className="create-input"
placeholder="Username"
value={username}
onChange={(e) => setUsername(e.target.value)}
/>

<div className="create-buttons">
<button className="create-btn primary" onClick={handleSignup}>
Sign Up
</button>
</div>
</div>
</main>
);
}
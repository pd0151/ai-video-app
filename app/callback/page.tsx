"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
const router = useRouter();

useEffect(() => {
router.push("/");
}, []);

return (
<div
style={{
height: "100vh",
background: "#04140c",
display: "flex",
justifyContent: "center",
alignItems: "center",
color: "white",
fontSize: 20,
}}
>
Logging in...
</div>
);
}
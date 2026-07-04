"use client";

//import "./globals.css";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
const pathname = usePathname();
const router = useRouter();
const [ready, setReady] = useState(false);

const openPages = [
"/login",
"/signup",
"/ai-receptionist-signup",
"/seo",
];

useEffect(() => {
    router.prefetch("/feed");
router.prefetch("/profile");
router.prefetch("/ai-receptionist");
const user = localStorage.getItem("user");

if (
!user &&
!openPages.some((page) => pathname.startsWith(page))
) {
router.push("/login");
}


setReady(true);
}, [pathname, router]);

const isActive = (path: string) => {
if (path === "/") return pathname === "/";
return pathname.startsWith(path);
};

function logout() {
localStorage.removeItem("user");
router.push("/login");
}

const showNav = !openPages.includes(pathname);

if (!ready) return null;


return (
<>
<div style={{ minHeight: "100vh", paddingBottom: showNav ? 90 : 0 }}>


{children}

{showNav && (
<nav
style={{
position: "fixed",
bottom: 14,
left: 14,
right: 14,
height: 82,
borderRadius: 30,
background: "rgba(6,10,18,0.82)",
backdropFilter: "blur(22px)",
border: "1px solid rgba(0,255,120,0.14)",
display: "flex",
alignItems: "center",
justifyContent: "space-around",
zIndex: 9999,
boxShadow:
"0 0 40px rgba(0,255,120,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
}}
>
<button
onClick={() => router.push("/")}
style={{
background: "transparent",
border: "none",
color: pathname === "/" ? "#ffffff" : "rgba(255,255,255,0.72)",
display: "flex",
flexDirection: "column",
alignItems: "center",
gap: 4,
fontSize: 13,
fontWeight: 700,
}}
>
<span style={{ fontSize: 24 }}>⌂</span>
Home
</button>

<button
onClick={() => router.push("/feed")}
style={{
background: "transparent",
border: "none",
color: pathname.startsWith("/feed")
? "#ffffff"
: "rgba(255,255,255,0.72)",
display: "flex",
flexDirection: "column",
alignItems: "center",
gap: 4,
fontSize: 13,
fontWeight: 700,
}}
>
<span style={{ fontSize: 22 }}>▤</span>
Feed
</button>

<button
onClick={() => router.push("/video")}
style={{
width: 74,
height: 74,
borderRadius: "50%",
border: "2px solid rgba(57,255,122,0.7)",
background:
"linear-gradient(135deg,#ffffff 0%,#dce6f5 100%)",
color: "#04110a",
fontSize: 42,
fontWeight: 300,
marginTop: -34,
boxShadow:
"0 0 30px rgba(57,255,122,0.55)",
display: "flex",
alignItems: "center",
justifyContent: "center",
}}
>
+
</button>

<button
onClick={() => router.push("/ai-receptionist")}
style={{
background: "transparent",
border: "none",
color: pathname.startsWith("/ai-receptionist")
? "#ffffff"
: "rgba(255,255,255,0.72)",
display: "flex",
flexDirection: "column",
alignItems: "center",
gap: 4,
fontSize: 13,
fontWeight: 700,
}}
>
<span style={{ fontSize: 22 }}>✦</span>
AI
</button>

<button
onClick={() => router.push("/profile/me")}
style={{
background: "transparent",
border: "none",
color: pathname.startsWith("/profile")
? "#ffffff"
: "rgba(255,255,255,0.72)",
display: "flex",
flexDirection: "column",
alignItems: "center",
gap: 4,
fontSize: 13,
fontWeight: 700,
}}
>
<span style={{ fontSize: 22 }}>◉</span>
Profile
</button>
</nav>
)}
</div>
</>
);
}

const item = {
color: "rgba(255,255,255,0.5)",
textDecoration: "none",
fontSize: 11,
display: "flex",
flexDirection: "column" as const,
alignItems: "center",
};

const active = {
...item,
animation: "aiNavGlow 1.8s ease-in-out infinite",
color: "#a855f7",
textShadow: "0 0 12px rgba(168,85,247,0.9)",
};

const plus = {
width: 60,
height: 60,
borderRadius: "50%",
marginTop: -30,
background: "linear-gradient(135deg,#a855f7,#6366f1)",
color: "white",
textDecoration: "none",
fontSize: 28,
fontWeight: "bold",
display: "flex",
alignItems: "center",
justifyContent: "center",
boxShadow: "0 10px 30px rgba(168,85,247,0.6)",
};

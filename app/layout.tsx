"use client";

import "./globals.css";
import { usePathname } from "next/navigation";

export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
const pathname = usePathname();

const isActive = (path: string) => {
if (path === "/") return pathname === "/";
return pathname.startsWith(path);
};

return (
<html lang="en">
<body
style={{
margin: 0,
background:
"radial-gradient(circle at top, #1e3a8a 0%, #08142f 40%, #020617 100%)",
color: "white",
}}
>
<div style={{ minHeight: "100vh", paddingBottom: 90 }}>
{children}

{/* 🔥 FULL NAV */}
<nav
style={{
position: "fixed",
bottom: 0,
left: 0,
right: 0,
height: 75,
background: "rgba(10,10,20,0.9)",
backdropFilter: "blur(15px)",
borderTop: "1px solid rgba(255,255,255,0.1)",
display: "flex",
justifyContent: "space-around",
alignItems: "center",
zIndex: 999,
}}
>
<a href="/" style={isActive("/") ? active : item}>
🏠
<span>Home</span>
</a>

<a href="/feed" style={isActive("/feed") ? active : item}>
📺
<span>Feed</span>
</a>

{/* CENTER BUTTON */}
<a href="/" style={plus}>
+
</a>

<a
href="/ai-receptionist"
style={isActive("/ai-receptionist") ? active : item}
>
🤖
<span>AI</span>
</a>

<a href="/profile/demo" style={isActive("/profile") ? active : item}>
👤
<span>Profile</span>
</a>
</nav>
</div>
</body>
</html>
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
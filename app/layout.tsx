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

const openPages = ["/login", "/signup", "/ai-receptionist-signup"];

useEffect(() => {
const user = localStorage.getItem("user");

if (!user && !openPages.includes(pathname)) {
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

if (!ready) {
return (
<html lang="en">
<body
style={{
margin: 0,
background:
"radial-gradient(circle at top, #1e3a8a 0%, #08142f 40%, #020617 100%)",
color: "white",
}}
/>
</html>
);
}

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
<div style={{ minHeight: "100vh", paddingBottom: showNav ? 90 : 0 }}>
{showNav && (
<button
onClick={logout}
style={{
position: "fixed",
top: 15,
right: 15,
zIndex: 9999,
padding: "9px 13px",
borderRadius: 14,
border: "1px solid rgba(255,255,255,0.15)",
background: "rgba(0,0,0,0.45)",
color: "white",
fontWeight: 800,
}}
>
Logout
</button>
)}

{children}

{showNav && (
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

<a href="/profile" style={isActive("/profile") ? active : item}>
👤
<span>Profile</span>
</a>
</nav>
)}
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

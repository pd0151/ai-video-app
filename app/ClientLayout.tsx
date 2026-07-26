"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  /*
   * Public pages:
   * - No login required
   * - No private app navigation bar
   */
  const publicPages = [
    "/",
    "/login",
    "/signup",
    "/ai-receptionist-signup",
    "/services",
    "/seo",
    "/businesses",
  ];

  const isPublicPage = publicPages.some((page) => {
    if (page === "/") {
      return pathname === "/";
    }

    return pathname === page || pathname.startsWith(`${page}/`);
  });

  /*
   * Pages that should never display the app navigation.
   */
  const hideNavPages = [
    "/",
    "/login",
    "/signup",
    "/ai-receptionist-signup",
    "/services",
    "/seo",
    "/businesses",
  ];

  const shouldHideNav = hideNavPages.some((page) => {
    if (page === "/") {
      return pathname === "/";
    }

    return pathname === page || pathname.startsWith(`${page}/`);
  });

  const showNav = !shouldHideNav;

  useEffect(() => {
    router.prefetch("/home");
    router.prefetch("/feed");
    router.prefetch("/profile/me");
    router.prefetch("/ai-receptionist");

    const user = localStorage.getItem("user");

    /*
     * Only redirect to login when the page is private.
     */
    if (!user && !isPublicPage) {
      router.replace("/login");
      return;
    }

    setReady(true);
  }, [pathname, router, isPublicPage]);

  if (!ready) {
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingBottom: showNav ? 110 : 0,
      }}
    >
      {children}

      {showNav && (
        <nav
          aria-label="App navigation"
          style={{
            position: "fixed",
            bottom: 14,
            left: 14,
            right: 14,
            height: 82,
            borderRadius: 30,
            background: "rgba(6,10,18,0.82)",
            backdropFilter: "blur(22px)",
            WebkitBackdropFilter: "blur(22px)",
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
            type="button"
            onClick={() => router.push("/home")}
            style={{
              background: "transparent",
              border: "none",
              color: pathname === "/home"
                ? "#ffffff"
                : "rgba(255,255,255,0.72)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 24 }}>⌂</span>
            Home
          </button>

          <button
            type="button"
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
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 22 }}>▤</span>
            Feed
          </button>

          <button
            type="button"
            aria-label="Create advert"
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
              boxShadow: "0 0 30px rgba(57,255,122,0.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            +
          </button>

          <button
            type="button"
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
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 22 }}>✦</span>
            AI
          </button>

          <button
            type="button"
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
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 22 }}>◉</span>
            Profile
          </button>
        </nav>
      )}
    </div>
  );
}
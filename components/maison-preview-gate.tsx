"use client";

import React, { useState, useEffect } from "react";
import { KeyRound, ArrowRight, ShieldCheck, Check, LogOut } from "lucide-react";
import { toast } from "sonner";

// Approved Admin Access Passcodes (Case-insensitive)
const VALID_PASSCODES = ["MAH2026", "MAH-VENDOME", "MAH7890", "ADMIN", "MAH1234", "LONDON2026"];
const PRIMARY_PASSCODE = "MAH2026";

export function MaisonPreviewGate({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSent, setNewsletterSent] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlPasscode = urlParams.get("passcode") || urlParams.get("preview") || urlParams.get("access");
      
      if (urlPasscode && VALID_PASSCODES.includes(urlPasscode.trim().toUpperCase())) {
        localStorage.setItem("mah_preview_auth", "granted");
        document.cookie = "mah_preview_auth=granted; path=/; max-age=2592000";
        setIsUnlocked(true);
        toast.success("Maison Access Granted.");
        return;
      }

      const savedAuth = localStorage.getItem("mah_preview_auth");
      const hasCookie = document.cookie.includes("mah_preview_auth=granted");
      
      if (savedAuth === "granted" || hasCookie) {
        setIsUnlocked(true);
      } else {
        setIsUnlocked(false);
      }
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    const trimmed = passcode.trim().toUpperCase();

    if (!trimmed) {
      setErrorMessage("Please enter the Maison access passcode.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (VALID_PASSCODES.includes(trimmed)) {
        localStorage.setItem("mah_preview_auth", "granted");
        document.cookie = "mah_preview_auth=granted; path=/; max-age=2592000";
        setIsUnlocked(true);
        setIsSubmitting(false);
        toast.success("Welcome to MAH Diamonds.");
      } else {
        setIsSubmitting(false);
        setErrorMessage("Invalid passcode.");
        toast.error("Incorrect passcode.");
      }
    }, 350);
  };

  const handleLock = () => {
    localStorage.removeItem("mah_preview_auth");
    document.cookie = "mah_preview_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setIsUnlocked(false);
    setPasscode("");
    toast.info("Maison boutique locked.");
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setNewsletterSent(true);
    toast.success("Your invitation request has been recorded.");
  };

  if (isUnlocked === null) {
    return (
      <div style={{ minHeight: "100vh", background: "#071330", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, border: "2px solid rgba(197, 168, 128, 0.2)", borderTopColor: "#C5A880", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  if (isUnlocked) {
    return (
      <>
        <div className="admin-access-bar" style={{
          position: "sticky",
          top: 0,
          zIndex: 99999,
          background: "linear-gradient(90deg, #071330 0%, #0C1B54 100%)",
          color: "#FAF8F5",
          padding: "6px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "0.7rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          borderBottom: "1px solid rgba(197, 168, 128, 0.25)",
          fontFamily: "var(--font-sans-stack)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80" }} />
            <span>Maison Preview Active</span>
          </div>
          <button
            onClick={handleLock}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(197, 168, 128, 0.35)",
              color: "#FAF8F5",
              padding: "4px 12px",
              borderRadius: "2px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.66rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "rgba(197, 168, 128, 0.2)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)")}
            title="Lock boutique"
          >
            <LogOut size={12} /> Lock Boutique
          </button>
        </div>
        {children}
      </>
    );
  }

  return (
    <div className="coming-soon-container" style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at 50% 25%, #0C1B54 0%, #071330 70%, #040B1C 100%)",
      color: "#FFFFFF",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "48px 24px",
      position: "relative",
      overflow: "hidden",
      fontFamily: "var(--font-sans-stack)"
    }}>
      {/* Decorative Orbits */}
      <div style={{
        position: "absolute",
        width: "700px",
        height: "700px",
        borderRadius: "50%",
        border: "1px solid rgba(197, 168, 128, 0.08)",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none"
      }} />

      {/* Header */}
      <header style={{ textAlign: "center", zIndex: 2 }}>
        <p style={{
          fontSize: "0.65rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "#C5A880",
          marginBottom: "10px",
          fontWeight: 500
        }}>
          Maison de Haute Joaillerie · London
        </p>
        <h2 style={{
          fontFamily: "var(--font-display-stack)",
          fontSize: "2.2rem",
          fontWeight: 300,
          letterSpacing: "0.2em",
          margin: 0,
          color: "#FAF8F5",
          textTransform: "uppercase"
        }}>
          MAH DIAMONDS
        </h2>
        <div style={{
          width: 40,
          height: 1,
          background: "linear-gradient(90deg, transparent, #C5A880, transparent)",
          margin: "12px auto 0"
        }} />
      </header>

      {/* Center Body */}
      <main style={{
        maxWidth: "540px",
        width: "100%",
        textAlign: "center",
        zIndex: 2,
        margin: "auto",
        padding: "40px 0"
      }}>
        <h1 style={{
          fontFamily: "var(--font-display-stack)",
          fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)",
          fontWeight: 300,
          lineHeight: 1.2,
          color: "#FFFFFF",
          marginBottom: "16px",
          letterSpacing: "0.03em"
        }}>
          Private Maison Preview
        </h1>

        <p style={{
          fontSize: "0.92rem",
          lineHeight: 1.7,
          color: "rgba(250, 248, 245, 0.75)",
          marginBottom: "32px",
          fontWeight: 300
        }}>
          The MAH Diamonds boutique is currently reserved for private consultations and patron previews. Enter your access passcode below.
        </p>

        {/* Passcode Form */}
        <div style={{
          background: "rgba(7, 19, 48, 0.8)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(197, 168, 128, 0.3)",
          borderRadius: "3px",
          padding: "28px 24px",
          marginBottom: "32px",
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.45)"
        }}>
          <form onSubmit={handleUnlock} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <input
                type="password"
                placeholder="Enter Access Passcode"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setErrorMessage("");
                }}
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: errorMessage ? "1px solid #ef4444" : "1px solid rgba(197, 168, 128, 0.35)",
                  borderRadius: "2px",
                  color: "#FFFFFF",
                  fontSize: "0.88rem",
                  letterSpacing: "0.15em",
                  textAlign: "center",
                  outline: "none",
                  fontFamily: "var(--font-sans-stack)",
                  transition: "border 0.2s ease"
                }}
                onFocus={(e) => (e.target.style.borderColor = "#C5A880")}
                onBlur={(e) => {
                  if (!errorMessage) e.target.style.borderColor = "rgba(197, 168, 128, 0.35)";
                }}
              />
            </div>

            {errorMessage && (
              <p style={{ margin: 0, fontSize: "0.76rem", color: "#f87171", textAlign: "center" }}>
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "13px 20px",
                background: "#C5A880",
                color: "#071330",
                border: "none",
                borderRadius: "2px",
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#dfc59f")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#C5A880")}
            >
              {isSubmitting ? "Verifying..." : "Enter Boutique"} <ArrowRight size={14} />
            </button>
          </form>
        </div>

        {/* Private Notification Form */}
        <div style={{ textAlign: "center" }}>
          <p style={{
            fontSize: "0.72rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(250, 248, 245, 0.6)",
            marginBottom: "12px"
          }}>
            Request an Invitation for the Public Opening
          </p>

          {newsletterSent ? (
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(74, 222, 128, 0.08)",
              border: "1px solid rgba(74, 222, 128, 0.25)",
              padding: "8px 16px",
              borderRadius: "2px",
              color: "#4ade80",
              fontSize: "0.78rem"
            }}>
              <Check size={15} />
              <span>Your invitation request has been registered.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletter} style={{ display: "flex", maxWidth: "380px", margin: "0 auto", gap: "8px" }}>
              <input
                type="email"
                placeholder="Your email address..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "2px",
                  color: "#FFFFFF",
                  fontSize: "0.8rem",
                  outline: "none"
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "10px 16px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(197, 168, 128, 0.35)",
                  color: "#FAF8F5",
                  borderRadius: "2px",
                  fontSize: "0.68rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  cursor: "pointer"
                }}
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: "center",
        zIndex: 2,
        paddingTop: "16px",
        borderTop: "1px solid rgba(197, 168, 128, 0.1)",
        width: "100%",
        maxWidth: "700px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        fontSize: "0.68rem",
        color: "rgba(250, 248, 245, 0.5)",
        letterSpacing: "0.12em",
        textTransform: "uppercase"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <ShieldCheck size={13} color="#C5A880" />
          <span>London Assay Office &amp; GIA / IGI Certified</span>
        </div>
        <div>
          <span>&copy; 2026 MAH Diamonds London</span>
        </div>
      </footer>
    </div>
  );
}

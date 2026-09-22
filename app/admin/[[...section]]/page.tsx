"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { KeyRound, ArrowRight, ShieldCheck, Lock, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AdminPortal } from "@/components/admin-portal";

const VALID_PASSCODES = ["MAH2026", "MAH-VENDOME", "MAH7890", "ADMIN", "MAH1234", "LONDON2026"];

export default function AdminPage() {
  const params = useParams();
  const router = useRouter();
  const sectionParam = params?.section;
  const initialSection = Array.isArray(sectionParam) ? sectionParam[0] : typeof sectionParam === "string" ? sectionParam : "overview";

  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlPasscode = urlParams.get("passcode") || urlParams.get("pin") || urlParams.get("key");

      if (urlPasscode && VALID_PASSCODES.includes(urlPasscode.trim().toUpperCase())) {
        localStorage.setItem("mah_admin_auth", "granted");
        localStorage.setItem("mah_preview_auth", "granted");
        document.cookie = "mah_admin_auth=granted; path=/; max-age=2592000";
        setIsUnlocked(true);
        toast.success("Maison Admin Access Granted.");
        return;
      }

      const savedAdminAuth = localStorage.getItem("mah_admin_auth");
      const savedPreviewAuth = localStorage.getItem("mah_preview_auth");
      const hasCookie = document.cookie.includes("mah_admin_auth=granted") || document.cookie.includes("mah_preview_auth=granted");

      if (savedAdminAuth === "granted" || savedPreviewAuth === "granted" || hasCookie) {
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
      setErrorMessage("Please enter the administrator passcode.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (VALID_PASSCODES.includes(trimmed)) {
        localStorage.setItem("mah_admin_auth", "granted");
        localStorage.setItem("mah_preview_auth", "granted");
        document.cookie = "mah_admin_auth=granted; path=/; max-age=2592000";
        setIsUnlocked(true);
        setIsSubmitting(false);
        toast.success("Administrator access granted.");
      } else {
        setErrorMessage("Invalid administrator passcode. (Default: MAH2026)");
        setIsSubmitting(false);
      }
    }, 400);
  };

  if (isUnlocked === null) {
    return (
      <div className="min-h-screen bg-[#0C1B54] flex items-center justify-center text-[#FAF8F5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-[#C5A880]">Authenticating MAH Administration...</span>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#0C1B54] flex flex-col justify-between p-6 text-[#FAF8F5] relative overflow-hidden font-sans">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding */}
        <header className="flex justify-between items-center z-10 max-w-5xl mx-auto w-full pt-4">
          <Link href="/" className="flex flex-col items-start text-left group">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880]">Maison de Haute Joaillerie · London</span>
            <span className="font-serif text-xl tracking-[0.18em] text-[#FAF8F5] font-semibold group-hover:text-[#C5A880] transition-colors">MAH DIAMONDS</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-[#C5A880] bg-white/5 border border-[#C5A880]/30 px-3 py-1.5 rounded-full">
            <ShieldCheck size={14} />
            <span>Admin Control Centre</span>
          </div>
        </header>

        {/* Center Admin Login Card */}
        <main className="max-w-md w-full mx-auto my-auto z-10 bg-white/[0.04] backdrop-blur-xl border border-[#C5A880]/40 p-8 sm:p-10 rounded-2xl shadow-2xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#C5A880]/10 border border-[#C5A880] text-[#C5A880] mb-4">
              <Lock size={20} />
            </div>
            <h1 className="font-serif text-2xl text-[#FAF8F5] tracking-tight">MAH Administration</h1>
            <p className="text-xs text-slate-300 mt-2 font-light leading-relaxed">
              Enter your administrator access passcode to manage catalogue pieces, diamond inventory, orders, and salon appointments.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label htmlFor="admin-passcode" className="block text-[11px] uppercase tracking-wider text-[#C5A880] font-semibold mb-2">
                Administrator Passcode
              </label>
              <div className="relative">
                <input
                  id="admin-passcode"
                  type="password"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  placeholder="Enter passcode (e.g. MAH2026)"
                  className="w-full bg-[#08123B] border border-[#C5A880]/40 rounded-lg px-4 py-3.5 text-sm text-[#FAF8F5] placeholder-slate-500 focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all tracking-wider"
                  autoFocus
                />
                <KeyRound size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C5A880]/70 pointer-events-none" />
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded text-center animate-fade-in">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#C5A880] to-[#DFCAAB] hover:from-[#B59870] hover:to-[#C5A880] text-[#0C1B54] font-bold py-3.5 px-6 rounded-lg text-xs uppercase tracking-widest transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg"
            >
              <span>{isSubmitting ? "VERIFYING..." : "ENTER ADMIN PORTAL"}</span>
              <ArrowRight size={14} />
            </button>

            <div className="pt-3 text-center">
              <span className="text-[11px] text-slate-400">
                Default Master Passcode: <strong className="text-[#C5A880] font-mono">MAH2026</strong> or <strong className="text-[#C5A880] font-mono">ADMIN</strong>
              </span>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-[#C5A880] transition-colors">
              ← Return to Storefront
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center text-[10px] text-slate-400 z-10 pb-2">
          <span>MAH Diamonds London · Secure Administration System</span>
        </footer>
      </div>
    );
  }

  return (
    <AdminPortal
      initialSection={initialSection}
      userName="Maison Administrator"
      demoMode={false}
    />
  );
}

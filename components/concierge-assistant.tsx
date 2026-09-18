"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  X,
  Phone,
  Calendar,
  Ruler,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Clock,
  Diamond,
} from "lucide-react";
import { toast } from "sonner";
import { RingSizeGuideModal } from "@/components/ring-size-guide-modal";

export function MaisonConcierge() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showSizeModal, setShowSizeModal] = useState(false);

  // Callback form
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [timePref, setTimePref] = useState("Afternoon (12:00 - 17:00)");
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);

  if (pathname.startsWith("/admin")) return null;

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientContact) {
      toast.error("Please provide your name and contact details.");
      return;
    }
    setCallbackSubmitted(true);
    const ref = "CALL-" + Math.floor(1000 + Math.random() * 9000);
    toast.success("Callback Request Registered", {
      description: `A diamond specialist will contact ${clientName} during ${timePref}. (Ref: ${ref})`,
    });
  };

  const faqs = [
    {
      q: "Can I inspect certified loose diamonds in person?",
      a: "Yes. In our private Bond Street or Hatton Garden salons, our head gemmologist prepares a curated comparison tray of GIA and IGI certified stones for hands-on examination under 10× optical magnification.",
    },
    {
      q: "How does the 90-Day Complimentary Resizing work?",
      a: "Every engagement ring and wedding band includes one complimentary resizing within 90 days of receipt, executed by our Hatton Garden atelier goldsmiths with complimentary fully-insured transit.",
    },
    {
      q: "How are high-value pieces delivered?",
      a: "Deliveries arrive in discreet, tamper-evident unbranded packaging. Every parcel is fully insured by Lloyd's of London until signed for in person by an adult.",
    },
    {
      q: "What is the typical timeframe for a bespoke commission?",
      a: "A custom ring typically requires 3 to 4 weeks from initial pencil and gouache design to London Assay Hallmarking. Urgent deadlines can be accommodated upon request.",
    },
  ];

  return (
    <>
      {/* Floating Concierge Launcher */}
      {!isOpen && (
        <button
          type="button"
          className="concierge-floating-pill facet-oct-sm"
          onClick={() => setIsOpen(true)}
          aria-label="Open Maison Concierge"
        >
          <span className="concierge-pulse-dot" />
          <span className="concierge-crest-icon">
            <Diamond size={15} />
          </span>
          <span className="concierge-pill-text">
            <strong>Maison Concierge</strong>
            <small>Mayfair & Hatton Garden</small>
          </span>
        </button>
      )}

      {/* Concierge Modal / Panel */}
      {isOpen && (
        <div className="concierge-panel-backdrop" onClick={() => setIsOpen(false)}>
          <aside
            className="concierge-panel facet-oct"
            onClick={(e) => e.stopPropagation()}
            aria-label="Maison Concierge Assistant"
          >
            {/* Header */}
            <div className="concierge-head">
              <div className="concierge-head-brand">
                <div className="concierge-emblem facet-oct-sm">
                  <Diamond size={16} />
                </div>
                <div>
                  <h3>Maison Concierge</h3>
                  <div className="concierge-status">
                    <span className="status-live-dot" />
                    <small>London Flagship Salons · Active</small>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="concierge-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close Concierge"
              >
                <X size={18} />
              </button>
            </div>

            <div className="concierge-body">
              {/* Welcome Message */}
              <div className="concierge-welcome-bubble">
                <p>
                  Good day. How may the Maison assist your high jewellery or diamond journey today?
                </p>
              </div>

              {/* Direct Quick Action Grid */}
              <div className="concierge-actions-grid">
                <Link
                  href="/appointments"
                  className="concierge-act-card facet-oct-sm"
                  onClick={() => setIsOpen(false)}
                >
                  <Calendar size={18} />
                  <div>
                    <strong>Book Private Viewing</strong>
                    <small>Bond St & Hatton Garden</small>
                  </div>
                  <ChevronRight size={14} className="act-arrow" />
                </Link>

                <a href="tel:+442079460920" className="concierge-act-card facet-oct-sm">
                  <Phone size={18} />
                  <div>
                    <strong>Call Salon Concierge</strong>
                    <small>+44 (0)20 7946 0920</small>
                  </div>
                  <ChevronRight size={14} className="act-arrow" />
                </a>

                <button
                  type="button"
                  className="concierge-act-card facet-oct-sm"
                  onClick={() => setShowSizeModal(true)}
                >
                  <Ruler size={18} />
                  <div>
                    <strong>Ring Sizing Suite</strong>
                    <small>Interactive gauge & conversion</small>
                  </div>
                  <ChevronRight size={14} className="act-arrow" />
                </button>

                <Link
                  href="/expert"
                  className="concierge-act-card facet-oct-sm"
                  onClick={() => setIsOpen(false)}
                >
                  <MessageSquare size={18} />
                  <div>
                    <strong>Speak to Gemmologist</strong>
                    <small>Private enquiry channel</small>
                  </div>
                  <ChevronRight size={14} className="act-arrow" />
                </Link>
              </div>

              {/* Instant FAQs Accordion */}
              <div className="concierge-faq-section">
                <span className="concierge-section-label">Frequently Clarified</span>
                <div className="concierge-faq-list">
                  {faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className={`concierge-faq-item ${activeFaq === idx ? "open" : ""}`}
                    >
                      <button
                        type="button"
                        className="concierge-faq-q"
                        onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      >
                        <span>{faq.q}</span>
                        <ChevronDown size={14} className="faq-chevron" />
                      </button>
                      {activeFaq === idx && (
                        <div className="concierge-faq-a">
                          <p>{faq.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Request Private Callback */}
              <div className="concierge-callback-box facet-oct-sm">
                <span className="concierge-section-label">Request Private Callback</span>
                {callbackSubmitted ? (
                  <div className="callback-success">
                    <CheckCircle2 size={20} />
                    <p>
                      Thank you. A senior specialist will call you during your requested timeframe.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleCallbackSubmit} className="callback-form">
                    <div className="callback-fields">
                      <input
                        type="text"
                        placeholder="Your Name"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="callback-input"
                      />
                      <input
                        type="text"
                        placeholder="Phone or Email"
                        required
                        value={clientContact}
                        onChange={(e) => setClientContact(e.target.value)}
                        className="callback-input"
                      />
                    </div>
                    <div className="callback-row">
                      <select
                        value={timePref}
                        onChange={(e) => setTimePref(e.target.value)}
                        className="callback-select"
                      >
                        <option>Morning (09:30 - 12:00)</option>
                        <option>Afternoon (12:00 - 17:00)</option>
                        <option>Twilight (17:00 - 19:30)</option>
                      </select>
                      <button type="submit" className="button button-sm button-dark facet-oct-sm">
                        Request
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Concierge Footer Assurance */}
            <div className="concierge-foot">
              <ShieldCheck size={14} />
              <small>Discreet & Confidential · British Hallmarked Standards</small>
            </div>
          </aside>
        </div>
      )}

      {/* Ring Size Guide Integration */}
      {showSizeModal && (
        <RingSizeGuideModal
          isOpen={showSizeModal}
          onClose={() => setShowSizeModal(false)}
        />
      )}
    </>
  );
}

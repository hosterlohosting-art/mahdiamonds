"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, Gem, Loader2, MessageCircle, X } from "lucide-react";
import type { RoutePage } from "@/lib/site-data";
import { toast } from "sonner";

const BESPOKE_STAGES = [
  {
    num: "01",
    title: "DISCOVER",
    desc: "Share your ideas and inspirations.",
  },
  {
    num: "02",
    title: "DESIGN",
    desc: "We explore concepts and refine the design.",
  },
  {
    num: "03",
    title: "CRAFT",
    desc: "The approved design enters production.",
  },
  {
    num: "04",
    title: "YOUR CREATION",
    desc: "Completion of the bespoke commission.",
  },
];

const BESPOKE_CATEGORIES = [
  {
    id: "bespoke-engagement",
    title: "BESPOKE ENGAGEMENT RINGS",
    category: "Bespoke Engagement Rings",
    image: "/images/journal-diamonds.jpg",
    alt: "Bespoke diamond engagement ring catching light on silk",
  },
  {
    id: "bespoke-wedding",
    title: "BESPOKE WEDDING RINGS",
    category: "Bespoke Wedding Rings",
    image: "/images/styles/diamond-band.jpg",
    alt: "Pair of handcrafted bespoke wedding bands",
  },
  {
    id: "bespoke-jewellery",
    title: "BESPOKE JEWELLERY",
    category: "Bespoke Jewellery",
    image: "/images/mah-atelier-sketch.jpg",
    alt: "High jewellery bespoke gouache sketch and drafting stylus",
  },
];

export function BespokeView({ page }: { page?: RoutePage }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Bespoke Engagement Rings");

  // Modal Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedRef, setSubmittedRef] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpenModal = (category: string = "Bespoke Engagement Rings") => {
    setSelectedCategory(category);
    setSubmitted(false);
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "Please enter your full name.";
    if (!email.trim() || !email.includes("@") || !email.includes(".")) {
      errs.email = "Please enter a valid email address.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone: phone || undefined,
          interest: `MAH Bespoke: ${selectedCategory}`,
          message: notes || `Bespoke commission request for ${selectedCategory}.`,
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        enquiryRef?: string;
        message?: string;
        errors?: Record<string, string>;
      };

      if (!response.ok || !data.success) {
        if (data.errors) setErrors(data.errors);
        toast.error(data.message || "Failed to register commission brief. Please try again.");
        return;
      }

      setSubmittedRef(data.enquiryRef || `MAH-BSP-${Math.floor(100000 + Math.random() * 900000)}`);
      setSubmitted(true);
      toast.success("Bespoke commission enquiry registered.");
    } catch (err) {
      console.error("Error submitting bespoke commission:", err);
      toast.error("Network error. Your details have been preserved; please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main id="main-content" className="bespoke-page-14">
      {/* 1. HERO BANNER */}
      <section className="bespoke-hero-14" aria-labelledby="bespoke-hero-title">
        <div className="bespoke-hero-bg-wrap">
          <Image
            src="/images/mah-atelier-concept.png"
            alt="MAH Bespoke - Handcrafted fine diamond design sketch and finished piece"
            fill
            priority
            sizes="100vw"
            className="bespoke-hero-image"
          />
          <div className="bespoke-hero-shade" />
        </div>

        <div className="shell bespoke-hero-inner">
          <div className="bespoke-hero-content-box">
            <p className="bespoke-eyebrow-hero">MAH BESPOKE</p>
            <h1 id="bespoke-hero-title" className="bespoke-hero-heading">
              A DIAMOND
              <br />
              AS INDIVIDUAL
              <br />
              AS YOU
            </h1>
            <div className="bespoke-eyebrow-line" />
            <p className="bespoke-hero-sub">
              Begin a bespoke commission with MAH.
            </p>
            <button
              onClick={() => handleOpenModal("Bespoke Engagement Rings")}
              className="button button-dark bespoke-hero-btn facet-oct-sm"
            >
              START YOUR COMMISSION <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* 2. THE BESPOKE PROCESS */}
      <section className="bespoke-process-section-14">
        <div className="shell">
          <div className="bespoke-process-heading centred">
            <p className="process-eyebrow">THE BESPOKE PROCESS</p>
            <h2 className="process-title">A CONSIDERED PROCESS</h2>
            <div className="process-accent-line" />
            <p className="process-sub">
              Explore the stages of a bespoke commission with MAH.
            </p>
          </div>

          <div className="bespoke-stages-row">
            {BESPOKE_STAGES.map((stage, idx) => (
              <div key={stage.num} className="bespoke-stage-col">
                <span className="stage-num-label">{stage.num}</span>
                <h3 className="stage-title-label">{stage.title}</h3>
                <p className="stage-desc-label">{stage.desc}</p>
                {idx < BESPOKE_STAGES.length - 1 && <div className="stage-col-divider" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BESPOKE CATEGORIES */}
      <section className="bespoke-categories-section-14">
        <div className="shell">
          <div className="bespoke-cats-grid">
            {BESPOKE_CATEGORIES.map((cat) => (
              <article key={cat.id} className="bespoke-cat-card">
                <div
                  className="bespoke-cat-img-box facet-oct-sm"
                  onClick={() => handleOpenModal(cat.category)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter") handleOpenModal(cat.category); }}
                >
                  <Image
                    src={cat.image}
                    alt={cat.alt}
                    fill
                    sizes="(max-width: 900px) 100vw, 33vw"
                    className="bespoke-cat-img"
                  />
                </div>
                <div className="bespoke-cat-footer">
                  <h3 className="bespoke-cat-title">{cat.title}</h3>
                  <button
                    onClick={() => handleOpenModal(cat.category)}
                    className="bespoke-explore-link"
                  >
                    EXPLORE <ArrowRight size={13} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CLIENT ACTIONS (3-PILLAR ROW) */}
      <section className="bespoke-actions-section-14">
        <div className="shell">
          <div className="bespoke-actions-grid">
            {/* PILLAR 1: SPEAK TO AN MAH EXPERT */}
            <Link href="/expert" className="bespoke-action-pillar">
              <div className="action-icon-box">
                <MessageCircle size={22} strokeWidth={1.25} />
              </div>
              <div className="action-text-box">
                <span className="action-title">SPEAK TO AN MAH EXPERT</span>
                <span className="action-sub">Discuss your ideas with our team.</span>
              </div>
            </Link>

            {/* DIVIDER 1 */}
            <div className="action-pillar-divider" />

            {/* PILLAR 2: BOOK AN APPOINTMENT */}
            <Link href="/appointments" className="bespoke-action-pillar">
              <div className="action-icon-box">
                <CalendarDays size={22} strokeWidth={1.25} />
              </div>
              <div className="action-text-box">
                <span className="action-title">BOOK AN APPOINTMENT</span>
                <span className="action-sub">Arrange a consultation with MAH.</span>
              </div>
            </Link>

            {/* DIVIDER 2 */}
            <div className="action-pillar-divider" />

            {/* PILLAR 3: START YOUR COMMISSION */}
            <button
              onClick={() => handleOpenModal("Bespoke Commission")}
              className="bespoke-action-pillar button-reset"
            >
              <div className="action-icon-box">
                <Gem size={22} strokeWidth={1.25} />
              </div>
              <div className="action-text-box">
                <span className="action-title">START YOUR COMMISSION</span>
                <span className="action-sub">Begin a commission with MAH.</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* 5. START YOUR COMMISSION CONSULTATION MODAL */}
      {showModal && (
        <div className="bespoke-modal-backdrop" onClick={handleCloseModal}>
          <div
            className="bespoke-modal-card facet-oct"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              className="modal-close-btn"
              onClick={handleCloseModal}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div className="bespoke-modal-success">
                <div className="success-icon-badge facet-oct-sm">
                  <CheckCircle2 size={36} strokeWidth={1.5} />
                </div>
                <p className="eyebrow">COMMISSION BRIEF RECEIVED</p>
                <h2>Thank you, {fullName}.</h2>
                <div className="ref-code-box">
                  <span>Reference:</span> <strong>{submittedRef}</strong>
                </div>
                <p className="success-body-text">
                  Your bespoke commission request regarding <em>{selectedCategory}</em> has been registered with our London atelier. An MAH bespoke specialist will review your details and connect with you directly at <strong>{email}</strong>.
                </p>
                <div className="modal-success-actions">
                  <button
                    onClick={handleCloseModal}
                    className="button button-dark facet-oct-sm"
                  >
                    Done
                  </button>
                  <Link
                    href="/appointments"
                    className="button button-outline-dark facet-oct-sm"
                  >
                    <CalendarDays size={14} /> Book a Private Salon
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="bespoke-modal-form">
                <p className="eyebrow">MAH BESPOKE</p>
                <h2>Start Your Commission</h2>
                <p className="modal-lead-p">
                  Share your initial ideas to begin a private consultation with our atelier team.
                </p>

                <div className="modal-field-group">
                  <label htmlFor="bsp-category">COMMISSION CATEGORY</label>
                  <div className="bespoke-select-wrap">
                    <select
                      id="bsp-category"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="Bespoke Engagement Rings">Bespoke Engagement Rings</option>
                      <option value="Bespoke Wedding Rings">Bespoke Wedding Rings</option>
                      <option value="Bespoke Jewellery">Bespoke Jewellery</option>
                      <option value="Heirloom Remodelling">Heirloom Remodelling</option>
                      <option value="Rare Diamond Sourcing">Rare Diamond Sourcing</option>
                      <option value="Other Bespoke Piece">Other Bespoke Piece</option>
                    </select>
                  </div>
                </div>

                <div className="modal-field-group">
                  <label htmlFor="bsp-full-name">
                    FULL NAME <span className="req-star">*</span>
                  </label>
                  <input
                    id="bsp-full-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
                    }}
                    placeholder="Your full name"
                    className={errors.fullName ? "modal-input-error" : ""}
                  />
                  {errors.fullName && <p className="modal-error-msg">{errors.fullName}</p>}
                </div>

                <div className="modal-field-group">
                  <label htmlFor="bsp-email-addr">
                    EMAIL ADDRESS <span className="req-star">*</span>
                  </label>
                  <input
                    id="bsp-email-addr"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    placeholder="Your email address"
                    className={errors.email ? "modal-input-error" : ""}
                  />
                  {errors.email && <p className="modal-error-msg">{errors.email}</p>}
                </div>

                <div className="modal-field-group">
                  <label htmlFor="bsp-phone-num">PHONE NUMBER (OPTIONAL)</label>
                  <input
                    id="bsp-phone-num"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your phone number"
                  />
                </div>

                <div className="modal-field-group">
                  <label htmlFor="bsp-notes-text">IDEAS, TARGET DATES OR QUESTIONS (OPTIONAL)</label>
                  <textarea
                    id="bsp-notes-text"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Share preferred diamond shapes, precious metals, milestone dates, or specific ideas..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="button button-dark modal-submit-btn facet-oct-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> SUBMITTING...
                    </>
                  ) : (
                    <>
                      START YOUR COMMISSION <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import type { RoutePage } from "@/lib/site-data";
import { toast } from "sonner";

const INTEREST_OPTIONS = [
  "Engagement Rings",
  "Wedding Rings",
  "Diamonds",
  "Jewellery",
  "MAH Bespoke",
  "Other",
];

export function ExpertView({ page }: { page?: RoutePage }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmedRef, setConfirmedRef] = useState("");

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) {
      errs.fullName = "Please enter your full name.";
    }

    if (!email.trim()) {
      errs.email = "Please enter your email address.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errs.email = "Please enter a valid email address.";
      }
    }

    if (!message.trim()) {
      errs.message = "Please enter your message or question.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please complete all required fields.");
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
          phone,
          interest: interest || undefined,
          message,
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        errors?: Record<string, string>;
        enquiryRef?: string;
        message?: string;
      };
      if (!response.ok || !data.success) {
        if (data.errors) {
          setErrors(data.errors);
        }
        toast.error(data.message || "Failed to submit enquiry. Please try again.");
        return;
      }

      setConfirmedRef(data.enquiryRef || `MAH-ENQ-${Math.floor(100000 + Math.random() * 900000)}`);
      setSubmitted(true);
      toast.success("Thank you. Your message has been sent to our atelier team.");
    } catch (err) {
      console.error("Enquiry submission network error:", err);
      toast.error("Network error. Your details have been preserved; please try submitting again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setMessage("");
    setErrors({});
  };

  return (
    <main id="main-content" className="expert-page-container">
      {/* 1. HERO BANNER */}
      <section className="expert-hero-18" aria-labelledby="expert-hero-title">
        <div className="expert-hero-bg-wrap">
          <Image
            src="/images/mah-expert-hero.jpg"
            alt="MAH fine jewellery presentation box on midnight marble"
            fill
            priority
            sizes="100vw"
            className="expert-hero-image"
          />
          <div className="expert-hero-shade" />
        </div>

        <div className="shell expert-hero-inner">
          <div className="expert-hero-content-box">
            <p className="expert-eyebrow-hero">SPEAK TO AN MAH EXPERT</p>
            <div className="expert-eyebrow-line" />
            <h1 id="expert-hero-title" className="expert-hero-heading">
              Let&apos;s Talk About
              <br />
              What Matters to You
            </h1>
            <p className="expert-hero-lead">
              Whether you have a question, would like guidance or want to discuss a special piece, an MAH expert is here to help.
            </p>
          </div>
        </div>
      </section>

      {/* 2. MAIN TWO-COLUMN BODY */}
      <section className="expert-body-section">
        <div className="shell expert-two-col-grid">
          {/* LEFT COLUMN: ATELIER SKETCH & STORY */}
          <div className="expert-left-column">
            <div className="expert-sketch-frame facet-oct-sm">
              <Image
                src="/images/mah-atelier-sketch.jpg"
                alt="Detailed graphite diamond ring design sketch in MAH leather-bound atelier notebook"
                width={600}
                height={600}
                priority
                className="expert-sketch-img"
              />
            </div>

            <div className="expert-story-block">
              <div className="expert-story-eyebrow">
                <span className="story-dash">—</span> A CONVERSATION, TAILORED TO YOU
              </div>
              <h2 className="expert-story-title">
                We&apos;re Here
                <br />
                to Help
              </h2>
              <p className="expert-story-p">
                Share a few details with us and an MAH expert will be in touch. Whether you&apos;re exploring options, have a specific enquiry or would like guidance, we&apos;re here to listen and assist you.
              </p>
              <p className="expert-story-sub">
                Every conversation is treated with care and discretion.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: FORM & DIRECT ACTIONS */}
          <div className="expert-right-column">
            <div className="expert-form-card facet-oct">
              <div className="expert-form-header">
                <span className="form-eyebrow-text">SEND US A MESSAGE —</span>
              </div>

              {submitted ? (
                <div className="expert-confirmation-box" role="status" aria-live="polite">
                  <div className="expert-confirmation-icon facet-oct-sm">
                    <CheckCircle2 size={36} strokeWidth={1.5} />
                  </div>
                  <p className="expert-conf-eyebrow">MESSAGE RECEIVED</p>
                  <h3 className="expert-conf-title">Thank you, {fullName}.</h3>
                  <div className="expert-conf-ref-badge">
                    <span>Reference:</span> <strong>{confirmedRef}</strong>
                  </div>
                  <p className="expert-conf-msg">
                    Your message has been received with care. An MAH specialist will review your request regarding{" "}
                    <em>{interest || "Jewellery & Diamonds"}</em> and respond directly to <strong>{email}</strong>.
                  </p>
                  <p className="expert-conf-discretion">
                    Every enquiry is handled personally with complete privacy and discretion.
                  </p>

                  <div className="expert-conf-actions">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="button button-outline-dark facet-oct-sm"
                    >
                      Send Another Message
                    </button>
                    <Link
                      href="/appointments"
                      className="button button-dark facet-oct-sm"
                    >
                      <CalendarDays size={15} /> Book an Appointment
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="expert-form-layout">
                  {/* FULL NAME */}
                  <div className="expert-field-group">
                    <label htmlFor="exp-full-name">
                      FULL NAME <span className="req-star">*</span>
                    </label>
                    <input
                      id="exp-full-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
                      }}
                      placeholder="Your full name"
                      className={errors.fullName ? "expert-input-error" : ""}
                      autoComplete="name"
                    />
                    {errors.fullName && <p className="expert-field-error-text">{errors.fullName}</p>}
                  </div>

                  {/* EMAIL ADDRESS */}
                  <div className="expert-field-group">
                    <label htmlFor="exp-email-addr">
                      EMAIL ADDRESS <span className="req-star">*</span>
                    </label>
                    <input
                      id="exp-email-addr"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      placeholder="Your email address"
                      className={errors.email ? "expert-input-error" : ""}
                      autoComplete="email"
                    />
                    {errors.email && <p className="expert-field-error-text">{errors.email}</p>}
                  </div>

                  {/* PHONE NUMBER */}
                  <div className="expert-field-group">
                    <label htmlFor="exp-phone-num">
                      PHONE NUMBER (OPTIONAL)
                    </label>
                    <input
                      id="exp-phone-num"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Your phone number"
                      autoComplete="tel"
                    />
                  </div>

                  {/* I'M INTERESTED IN */}
                  <div className="expert-field-group">
                    <label htmlFor="exp-interest-select">
                      I&apos;M INTERESTED IN (OPTIONAL)
                    </label>
                    <div className="expert-select-wrapper">
                      <select
                        id="exp-interest-select"
                        value={interest}
                        onChange={(e) => setInterest(e.target.value)}
                      >
                        <option value="">Please select</option>
                        {INTEREST_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* HOW CAN WE HELP */}
                  <div className="expert-field-group">
                    <label htmlFor="exp-help-text">
                      HOW CAN WE HELP? <span className="req-star">*</span>
                    </label>
                    <textarea
                      id="exp-help-text"
                      rows={4}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (errors.message) setErrors((prev) => ({ ...prev, message: "" }));
                      }}
                      placeholder="Your message"
                      className={errors.message ? "expert-input-error" : ""}
                    />
                    {errors.message && <p className="expert-field-error-text">{errors.message}</p>}
                  </div>

                  {/* SEND MESSAGE CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="button button-dark expert-submit-btn facet-oct-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> SENDING...
                      </>
                    ) : (
                      <>
                        SEND MESSAGE <ArrowRight size={15} />
                      </>
                    )}
                  </button>

                  {/* DIVIDER OR */}
                  <div className="expert-divider-row">
                    <span className="divider-line" />
                    <span className="divider-label">OR</span>
                    <span className="divider-line" />
                  </div>

                  {/* BOOK AN APPOINTMENT CTA */}
                  <div className="expert-appointment-cta-wrap">
                    <Link
                      href="/appointments"
                      className="button button-outline-dark expert-appointment-btn facet-oct-sm"
                    >
                      BOOK AN APPOINTMENT <CalendarDays size={16} />
                    </Link>
                    <p className="expert-appointment-footnote">
                      Prefer to meet with us? Schedule a time that suits you.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. CLOSING BANNER */}
      <section className="expert-closing-banner">
        <div className="shell expert-closing-inner">
          <p className="expert-closing-eyebrow">WE LOOK FORWARD TO HEARING FROM YOU</p>
          <div className="expert-closing-line" />
          <h2 className="expert-closing-headline">
            Extraordinary Jewellery Begins with a Conversation
          </h2>
        </div>
      </section>
    </main>
  );
}

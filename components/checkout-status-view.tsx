"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Award,
  Check,
  Clock,
  Download,
  Headphones,
  HelpCircle,
  Lock,
  Mail,
  Package,
  ShieldCheck,
  Diamond,
  User,
  Truck,
  CreditCard,
  Eye,
  FileText,
  Sparkles,
} from "lucide-react";
import { useDemoStore } from "@/components/demo-store-provider";
import { money } from "@/lib/demo-data";
import type { RoutePage } from "@/lib/site-data";
import { toast } from "sonner";

export function CheckoutStatusView({
  page,
  verification = false,
}: {
  page: RoutePage;
  verification?: boolean;
}) {
  const store = useDemoStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPassword, setGuestPassword] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);
  const [serverOrder, setServerOrder] = useState<any>(null);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);

  const queryOrderId = searchParams?.get("orderId") || searchParams?.get("id");
  const orderRef = queryOrderId || store.lastOrder || "MAH-78246";

  // Fetch authenticated order record from server
  useEffect(() => {
    if (orderRef) {
      fetch(`/api/orders?id=${encodeURIComponent(orderRef)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data: any) => {
          if (data && (data.id || data.orderNumber)) {
            setServerOrder(data);
          }
        })
        .catch(() => {
          // Offline / local fallback
        });
    }
  }, [orderRef]);

  const orderTotal = serverOrder?.total
    ? serverOrder.total
    : store.bag.reduce((sum, item) => sum + item.price * item.quantity, 0) || 26040;

  const orderItems = serverOrder?.items && serverOrder.items.length > 0
    ? serverOrder.items
    : store.bag;

  const primaryItem = orderItems[0] || {
    id: "mah-classic-emerald",
    key: "mah-classic-emerald",
    name: "Emerald-Cut Engagement Ring",
    productName: "MAH Classic Solitaire",
    metal: "Platinum",
    size: "M (UK)",
    diamondCarat: "2.01",
    diamondShape: "Emerald",
    diamondColor: "F",
    diamondClarity: "VS1",
    diamondCut: "Emerald",
    certNumber: "GIA 2487316207",
    image: "/images/styles/emerald-solitaire.jpg",
    settingPrice: 2950,
    diamondPrice: 18750,
    price: 26040,
    quantity: 1,
  };

  const [verificationStatus, setVerificationStatus] = useState<"in_progress" | "action_required" | "failed" | "success">("in_progress");
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengeMethod, setChallengeMethod] = useState<"app" | "otp">("app");
  const [otpCode, setOtpCode] = useState("849201");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleOpenVerification = () => {
    setShowChallengeModal(true);
  };

  const handleApproveChallenge = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setShowChallengeModal(false);
      setVerificationStatus("success");
      toast.success("Banking & high-value verification approved by issuer.");
      router.push(`/confirmation?orderId=${encodeURIComponent(orderRef)}`);
    }, 1200);
  };

  const handleDeclineChallenge = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setShowChallengeModal(false);
      setVerificationStatus("failed");
      toast.error("Card issuer declined transaction authorization. Please see recovery options below.");
    }, 1000);
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestEmail || !guestPassword) {
      toast.error("Please provide email and password.");
      return;
    }
    setAccountCreated(true);
    toast.success("MAH Maison Account created and linked to your order.");
  };

  // =========================================================================
  // SECTION 08: PAYMENT & HIGH-VALUE VERIFICATION (Wireframe media_1789766227478.png)
  // =========================================================================
  if (verification) {
    return (
      <main id="main-content" className="verification-page-08">
        {/* 1. 5-STEP HORIZONTAL STEPPER BAR WITH ICONS */}
        <section className="shell v8-stepper-section" aria-label="Order Progress">
          <div className="v8-stepper-bar">
            {/* Step 1: Customer Details */}
            <div className="v8-step-item completed">
              <div className="v8-step-circle">
                <User size={15} />
                <span className="v8-step-check">✓</span>
              </div>
              <span className="v8-step-label">CUSTOMER DETAILS</span>
              <div className="v8-step-line" />
            </div>

            {/* Step 2: Delivery / Collection */}
            <div className="v8-step-item completed">
              <div className="v8-step-circle">
                <Truck size={15} />
                <span className="v8-step-check">✓</span>
              </div>
              <span className="v8-step-label">DELIVERY / COLLECTION</span>
              <div className="v8-step-line" />
            </div>

            {/* Step 3: Billing */}
            <div className="v8-step-item completed">
              <div className="v8-step-circle">
                <CreditCard size={15} />
                <span className="v8-step-check">✓</span>
              </div>
              <span className="v8-step-label">BILLING</span>
              <div className="v8-step-line" />
            </div>

            {/* Step 4: Payment (Active Verification) */}
            <div className="v8-step-item active">
              <div className="v8-step-circle active">
                <Lock size={15} />
              </div>
              <span className="v8-step-label">PAYMENT</span>
              <div className="v8-step-line pending" />
            </div>

            {/* Step 5: Review & Confirm */}
            <div className="v8-step-item pending">
              <div className="v8-step-circle">
                <span>5</span>
              </div>
              <span className="v8-step-label">REVIEW & CONFIRM</span>
            </div>
          </div>
        </section>

        {/* 2. HERO HEADLINE */}
        <section className="shell v8-hero-section">
          <span className="v8-eyebrow">SECURE VERIFICATION</span>
          <h1 className="v8-title">
            {verificationStatus === "failed" ? "VERIFICATION UNSUCCESSFUL" : "PAYMENT RECEIVED"}
          </h1>
          <div className="v8-diamond-pip">
            <span className="v8-pip-line" />
            <span className="v8-pip-diamond">◇</span>
            <span className="v8-pip-line" />
          </div>
          <p className="v8-hero-sub">
            {verificationStatus === "failed" ? (
              <>
                Your payment provider was unable to verify this high-value transaction.
                <br />
                Your piece selection and bespoke specifications remain safely preserved. Please choose an option below to proceed.
              </>
            ) : (
              <>
                Your order is being securely verified.
                <br />
                For selected high-value purchases, an additional verification may be required before your order can be confirmed. We will guide you if any further information is needed.
              </>
            )}
          </p>
        </section>

        {/* 3. 3-STEP VERIFICATION PROGRESS CARD */}
        <section className="shell v8-status-strip-section">
          <div className="v8-status-card facet-oct-sm">
            <div className="v8-status-step completed">
              <div className="v8-status-icon">
                <CreditCard size={18} />
              </div>
              <strong>PAYMENT RECEIVED</strong>
              <small className="v8-state-text">Completed <span className="v8-check-inline">✓</span></small>
            </div>

            <div className="v8-status-divider active" />

            <div className={`v8-status-step ${verificationStatus === "failed" ? "failed" : "active"}`}>
              <div className={`v8-status-icon ${verificationStatus === "failed" ? "failed" : "active"}`}>
                <Lock size={18} />
              </div>
              <strong>SECURE VERIFICATION</strong>
              <small className={`v8-state-text ${verificationStatus === "failed" ? "failed" : "active"}`}>
                {verificationStatus === "failed" ? "Action Required" : "In Progress"}
              </small>
            </div>

            <div className="v8-status-divider" />

            <div className="v8-status-step pending">
              <div className="v8-status-icon">
                <Diamond size={18} />
              </div>
              <strong>ORDER CONFIRMED</strong>
              <small className="v8-state-text">Pending</small>
            </div>
          </div>
        </section>

        {/* 4. MAIN VERIFICATION DOSSIER BOX */}
        <section className="shell v8-dossier-section">
          <div className="v8-dossier-box facet-oct-sm">
            {/* ROW 1: ORDER REFERENCE & STATUS */}
            <div className="v8-row-top">
              <div className="v8-cell-ref">
                <span className="v8-cell-label">ORDER REFERENCE</span>
                <strong className="v8-ref-val">{serverOrder?.orderNumber || queryOrderId || store.lastOrder || "MAH-2408-000589"}</strong>
                <p>Please use this reference if you contact us about your order.</p>
              </div>

              <div className="v8-cell-status">
                <span className="v8-cell-label">PAYMENT STATUS</span>
                <strong className="v8-status-val">
                  {verificationStatus === "failed" ? "Authorization Pending" : "Verification in Progress"}
                </strong>
                <p>
                  {verificationStatus === "failed"
                    ? "Additional authentication is required by your card issuer to release funds."
                    : "Additional verification is being completed before your order can be confirmed. You will be updated once verification is complete."}
                </p>
              </div>

              <div className="v8-cell-security">
                <ShieldCheck size={26} className="v8-shield-icon" />
                <p>Your payment and personal information are always secure and protected.</p>
              </div>
            </div>

            <div className="v8-dossier-divider" />

            {/* ROW 2: 3 INFORMATIONAL CARDS */}
            <div className="v8-row-middle-grid">
              <div className="v8-info-card">
                <div className="v8-card-icon-wrap">
                  <ShieldCheck size={20} />
                </div>
                <div className="v8-info-content">
                  <strong>WHAT THIS MEANS</strong>
                  <p>Additional verification is being completed to protect your transaction and ensure the security of your order.</p>
                </div>
              </div>

              <div className="v8-info-card">
                <div className="v8-card-icon-wrap">
                  <Clock size={20} />
                </div>
                <div className="v8-info-content">
                  <strong>WHAT HAPPENS NEXT</strong>
                  <p>Once verification is complete, we will update you using the contact details provided with your order. You can check your order status anytime in your account.</p>
                </div>
              </div>

              <div className="v8-info-card">
                <div className="v8-card-icon-wrap">
                  <Mail size={20} />
                </div>
                <div className="v8-info-content">
                  <strong>WE WILL CONTACT YOU</strong>
                  <p>If we need any further information, our client team will contact you using the details you provided.</p>
                </div>
              </div>
            </div>

            <div className="v8-dossier-divider" />

            {/* ROW 3: ACTION CTA */}
            <div className="v8-row-bottom-actions">
              <div className="v8-action-prompt">
                <strong>NEED TO TAKE ACTION?</strong>
                <p>
                  {verificationStatus === "failed"
                    ? "Retry biometric verification, select an alternative payment method, or contact our Mayfair concierge."
                    : "If additional verification is required from you or you need assistance, our team is here to help."}
                </p>
              </div>

              <div className="v8-action-buttons">
                {verificationStatus === "failed" ? (
                  <>
                    <button
                      type="button"
                      onClick={handleOpenVerification}
                      className="button button-dark v8-btn-complete"
                    >
                      <span>RETRY VERIFICATION</span>
                      <ArrowRight size={15} />
                    </button>
                    <Link
                      href="/checkout"
                      className="button button-outline-dark v8-btn-expert"
                    >
                      <span>USE ALTERNATIVE PAYMENT</span>
                      <ArrowRight size={15} />
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleOpenVerification}
                      className="button button-dark v8-btn-complete"
                    >
                      <span>COMPLETE VERIFICATION</span>
                      <ArrowRight size={15} />
                    </button>
                    <Link href="/expert" className="button button-outline-dark v8-btn-expert">
                      <span>SPEAK TO AN MAH EXPERT</span>
                      <ArrowRight size={15} />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 5. BOTTOM TRUST FOOTER BAR */}
        <section className="shell v8-trust-footer-section">
          <div className="v8-trust-bar facet-oct-sm">
            <div className="v8-trust-left">
              <Lock size={16} />
              <div>
                <strong>SECURE BY DESIGN</strong>
                <p>Advanced encryption. Secure payments. Strict privacy standards.</p>
              </div>
            </div>

            <div className="v8-trust-center">
              <p>Your trust is our highest priority. Thank you for choosing MAH Diamonds.</p>
            </div>

            <div className="v8-trust-right">
              <div className="v8-monogram-badge">M</div>
              <div>
                <strong>TIMELESS CRAFT.</strong>
                <p>MADE FOR GENERATIONS.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. 3DS / HIGH-VALUE BANKING VERIFICATION CHALLENGE MODAL */}
        {showChallengeModal && (
          <div className="v8-challenge-modal-backdrop" onClick={() => setShowChallengeModal(false)}>
            <div className="v8-challenge-modal facet-oct-sm" onClick={(e) => e.stopPropagation()}>
              <div className="v8-challenge-header">
                <div className="v8-challenge-brand">
                  <ShieldCheck size={22} className="v8-challenge-shield" />
                  <div>
                    <strong>MAH SECURE BANKING GATEWAY</strong>
                    <small>3D Secure 2.2 · Verified by Visa / Mastercard ID Check</small>
                  </div>
                </div>
                <span className="v8-challenge-amount">{money(orderTotal)}</span>
              </div>

              <div className="v8-challenge-body">
                <p className="v8-challenge-intro">
                  Your card issuer requires identity authorization for this high-value transaction.
                </p>

                <div className="v8-challenge-tabs">
                  <button
                    type="button"
                    className={`v8-challenge-tab ${challengeMethod === "app" ? "active" : ""}`}
                    onClick={() => setChallengeMethod("app")}
                  >
                    Banking App Notification
                  </button>
                  <button
                    type="button"
                    className={`v8-challenge-tab ${challengeMethod === "otp" ? "active" : ""}`}
                    onClick={() => setChallengeMethod("otp")}
                  >
                    SMS Passcode
                  </button>
                </div>

                {challengeMethod === "app" ? (
                  <div className="v8-challenge-app-box">
                    <Clock size={20} className="v8-pulse-clock" />
                    <div>
                      <strong>Approval Request Sent to Your Device</strong>
                      <p>Please open your banking mobile application and confirm the authentication prompt for {money(orderTotal)}.</p>
                    </div>
                  </div>
                ) : (
                  <div className="v8-challenge-otp-box">
                    <label>
                      <span>Enter 6-Digit One-Time Security Code</span>
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        maxLength={6}
                        className="v8-otp-input"
                      />
                    </label>
                    <small>Sent to verified phone number ending in ••77</small>
                  </div>
                )}

                <div className="v8-challenge-actions">
                  <button
                    type="button"
                    onClick={handleApproveChallenge}
                    disabled={isAuthenticating}
                    className="button button-dark v8-challenge-approve-btn"
                  >
                    {isAuthenticating ? "AUTHORIZING..." : "Approve & Authorise Transaction"}
                  </button>

                  <button
                    type="button"
                    onClick={handleDeclineChallenge}
                    disabled={isAuthenticating}
                    className="v8-challenge-decline-link"
                  >
                    Simulate Issuer Decline / Failure
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }

  // =========================================================================
  // SECTION 09: PURCHASE CONFIRMATION AND CLIENT CARE (Wireframe media_1789766203900.png)
  // =========================================================================
  return (
    <main id="main-content" className="confirmation-page-09">
      {/* 1. TOP HEADER & EXPERT CONTACT */}
      <div className="c9-top-header shell">
        <div className="c9-top-inner">
          <div className="c9-brand-center">
            <Link href="/" className="c9-logo-link" aria-label="MAH Home">
              <span className="c9-logo-text">M A H</span>
              <span className="c9-logo-sub">DIAMONDS</span>
            </Link>
          </div>
          <div className="c9-expert-link-wrap">
            <Link href="/expert" className="c9-expert-btn">
              <Headphones size={15} />
              <span>Speak to an MAH Expert</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. HERO PRESENTATION BANNER WITH RIBBON & BOX */}
      <section className="shell c9-hero-section">
        <div className="c9-hero-banner facet-oct-sm">
          <div className="c9-hero-left-content">
            <div className="c9-check-circle">
              <Check size={20} strokeWidth={2.5} />
            </div>
            <span className="c9-eyebrow">ORDER CONFIRMED</span>
            <h1 className="c9-headline">Yours, by MAH.</h1>
            <p className="c9-hero-sub">
              A piece chosen with intention, crafted to become part of your story. Thank you for entrusting MAH with something so meaningful.
            </p>

            <div className="c9-diamond-pip">
              <span className="c9-pip-line" />
              <span className="c9-pip-diamond">◇</span>
              <span className="c9-pip-line" />
            </div>

            <div className="c9-order-ref-box">
              <strong className="c9-ref-number">Order {serverOrder?.orderNumber || orderRef || "MAH-78246"}</strong>
              <p className="c9-ref-note">
                A confirmation has been sent to {serverOrder?.clientEmail || guestEmail || "hello@example.com"}
              </p>
            </div>
          </div>

          <div className="c9-hero-right-visual">
            <div className="c9-box-visual-wrap">
              <Image
                src="/images/brand/box_ribbon.png"
                alt="MAH Midnight Blue Box with Silk Ribbon"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 420px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. THREE-CARD SECTION GRID */}
      <section className="shell c9-three-cards-section">
        <div className="c9-three-cards-grid">
          {/* CARD 1: YOUR SELECTION */}
          <div className="c9-column-card facet-oct-sm">
            <div className="c9-card-header">
              <h3>YOUR SELECTION</h3>
              <div className="c9-card-header-line" />
            </div>

            <div className="c9-card-body">
              <div className="c9-selection-item">
                <div className="c9-sel-img-wrap">
                  <Image
                    src={primaryItem.image || "/images/styles/emerald-solitaire.jpg"}
                    alt={primaryItem.name || "MAH Ring"}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="c9-sel-details">
                  <h4>{primaryItem.name || "Emerald-Cut Engagement Ring"}</h4>
                  <p className="c9-sel-metal-size">
                    {primaryItem.metal || "Platinum"} • Ring Size {primaryItem.size || "M (UK)"}
                  </p>

                  <div className="c9-sel-diamond-block">
                    <span className="c9-sel-diamond-title">YOUR DIAMOND</span>
                    <div className="c9-sel-specs-row">
                      <div className="c9-spec-col">
                        <span className="c9-spec-lbl">Carat</span>
                        <strong>{primaryItem.diamondCarat || "2.01"} ct</strong>
                      </div>
                      <div className="c9-spec-col">
                        <span className="c9-spec-lbl">Cut</span>
                        <strong>{primaryItem.diamondCut || "Emerald"}</strong>
                      </div>
                      <div className="c9-spec-col">
                        <span className="c9-spec-lbl">Colour</span>
                        <strong>{primaryItem.diamondColor || "F"}</strong>
                      </div>
                      <div className="c9-spec-col">
                        <span className="c9-spec-lbl">Clarity</span>
                        <strong>{primaryItem.diamondClarity || "VS1"}</strong>
                      </div>
                    </div>

                    <div className="c9-gia-badge-row">
                      <Award size={16} className="c9-gia-icon" />
                      <div>
                        <strong>{primaryItem.certNumber || "GIA 2487316207"}</strong>
                        <span>GIA Grading Report</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="c9-sel-total-row">
                <span className="c9-total-lbl">TOTAL PAID</span>
                <div className="c9-total-right">
                  <strong>{money(orderTotal)}</strong>
                  <small>(Incl. VAT)</small>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowOrderDetailsModal(true)}
                className="button button-ghost button-wide c9-btn-view-details"
              >
                <span>VIEW ORDER DETAILS</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* CARD 2: WHAT HAPPENS NEXT */}
          <div className="c9-column-card facet-oct-sm">
            <div className="c9-card-header">
              <h3>WHAT HAPPENS NEXT</h3>
              <div className="c9-card-header-line" />
            </div>

            <div className="c9-card-body">
              <div className="c9-timeline-steps">
                {/* Step 1 */}
                <div className="c9-timeline-step">
                  <div className="c9-tl-icon-circle active">
                    <Check size={16} strokeWidth={2.5} />
                  </div>
                  <div className="c9-tl-text">
                    <strong>ORDER CONFIRMED</strong>
                    <p>Payment received and confirmed</p>
                  </div>
                </div>

                <div className="c9-tl-connector" />

                {/* Step 2 */}
                <div className="c9-timeline-step">
                  <div className="c9-tl-icon-circle">
                    <Diamond size={16} />
                  </div>
                  <div className="c9-tl-text">
                    <strong>PREPARING YOUR ORDER</strong>
                    <p>We are preparing your piece with the utmost care and precision.</p>
                  </div>
                </div>

                <div className="c9-tl-connector" />

                {/* Step 3 */}
                <div className="c9-timeline-step">
                  <div className="c9-tl-icon-circle">
                    <Package size={16} />
                  </div>
                  <div className="c9-tl-text">
                    <strong>READY FOR DELIVERY OR COLLECTION</strong>
                    <p>We will arrange delivery or collection with you.</p>
                  </div>
                </div>
              </div>

              <div className="c9-mail-update-box facet-oct-sm">
                <div className="c9-mail-icon-circle">
                  <Mail size={16} />
                </div>
                <p>
                  We’ll keep you informed as your piece progresses. Updates will be sent using the contact details provided with your order.
                </p>
              </div>
            </div>
          </div>

          {/* CARD 3: YOUR MAH CLIENT CARE */}
          <div className="c9-column-card facet-oct-sm">
            <div className="c9-card-header">
              <h3>YOUR MAH CLIENT CARE</h3>
              <div className="c9-card-header-line" />
            </div>

            <div className="c9-card-body">
              <div className="c9-client-care-intro">
                <div className="c9-care-icon-circle">
                  <Headphones size={20} />
                </div>
                <p>Should you wish to discuss your order, our team is here to assist you.</p>
              </div>

              <Link href="/expert" className="button button-dark button-wide c9-btn-expert">
                SPEAK TO AN MAH EXPERT
              </Link>
              <p className="c9-care-note">Our team will respond to you as soon as possible.</p>

              <div className="c9-care-divider" />

              <div className="c9-account-prompt-block">
                <h4>KEEP YOUR MAH DETAILS TOGETHER</h4>
                <p>Create an account to access your order and future MAH purchases.</p>

                {!accountCreated ? (
                  <form onSubmit={handleCreateAccount} className="c9-account-form">
                    <button type="submit" className="button button-outline-dark button-wide c9-btn-create-acc">
                      <span>CREATE ACCOUNT</span>
                      <ArrowRight size={14} />
                    </button>
                  </form>
                ) : (
                  <div className="c9-account-created-badge">
                    <Check size={14} />
                    <span>Maison Account Active & Linked</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM CONTINUE EXPLORING STRIP */}
      <section className="shell c9-continue-strip-section">
        <div className="c9-continue-bar">
          <div className="c9-continue-pip-line" />
          <Link href="/jewellery" className="c9-continue-link">
            <span>CONTINUE EXPLORING MAH</span>
            <ArrowRight size={15} />
          </Link>
          <div className="c9-continue-pip-line" />
        </div>
        <p className="c9-continue-sub">
          Discover fine jewellery and rare diamonds, crafted with intention.
        </p>
      </section>

      {/* ORDER DOSSIER MODAL */}
      {showOrderDetailsModal && (
        <div className="cert-modal-backdrop" onClick={() => setShowOrderDetailsModal(false)}>
          <div className="cert-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="cert-modal-header">
              <div className="cert-modal-logo">
                <span className="cert-badge-oct">MAH</span>
                <div>
                  <h4>OFFICIAL ORDER DOSSIER</h4>
                  <small>Reference {serverOrder?.orderNumber || orderRef}</small>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowOrderDetailsModal(false)}
                className="cert-close-btn"
              >
                ✕
              </button>
            </div>
            <div className="cert-modal-content">
              <div className="cert-report-header">
                <div>
                  <span className="report-authority">MAH DIAMONDS LONDON</span>
                  <h2>{primaryItem.name || "Emerald-Cut Engagement Ring"}</h2>
                  <p>{primaryItem.metal || "Solid Platinum 950"} · UK Ring Size {primaryItem.size || "M"}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <strong>{money(orderTotal)}</strong>
                  <small style={{ display: "block", color: "var(--muted)" }}>Paid in Full</small>
                </div>
              </div>

              <div style={{ margin: "20px 0" }}>
                <p><strong>Diamond Specification:</strong> {primaryItem.diamondCarat || "2.01"}ct {primaryItem.diamondShape || "Emerald"} Cut · Colour {primaryItem.diamondColor || "F"} · Clarity {primaryItem.diamondClarity || "VS1"}</p>
                <p><strong>Certification:</strong> {primaryItem.certNumber || "GIA 2487316207"}</p>
                <p><strong>Fulfilment:</strong> Fully Insured Royal Mail Special Delivery / Mayfair Salon</p>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
                <button
                  type="button"
                  onClick={() => typeof window !== "undefined" && window.print()}
                  className="button button-ghost"
                >
                  <Download size={14} /> Print Dossier
                </button>
                <button
                  type="button"
                  onClick={() => setShowOrderDetailsModal(false)}
                  className="button button-dark"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


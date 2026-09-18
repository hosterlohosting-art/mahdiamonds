"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Headphones,
  Lock,
  ShieldCheck,
  Diamond,
  Check,
  Sparkles,
  Info,
  X,
  Award,
} from "lucide-react";
import { useDemoStore } from "@/components/demo-store-provider";
import { money } from "@/lib/demo-data";
import type { RoutePage } from "@/lib/site-data";
import { toast } from "sonner";

interface CheckoutViewProps {
  page: RoutePage;
}

export function CheckoutView({ page }: CheckoutViewProps) {
  const store = useDemoStore();
  const router = useRouter();

  // Active Checkout Step (1 to 5)
  const [step, setStep] = useState<number>(1);

  // Step 1: Customer Details
  const [email, setEmail] = useState("amelia.hart@example.com");
  const [firstName, setFirstName] = useState("Amelia");
  const [lastName, setLastName] = useState("Hart");
  const [countryCode, setCountryCode] = useState("+44");
  const [phoneNumber, setPhoneNumber] = useState("07700 900077");
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState("");

  // Step 2: Delivery / Collection
  const [fulfilmentType, setFulfilmentType] = useState<"delivery" | "collection">("delivery");
  const [addressLine1, setAddressLine1] = useState("14 Mount Street");
  const [addressLine2, setAddressLine2] = useState("Flat 3B");
  const [city, setCity] = useState("London");
  const [postcode, setPostcode] = useState("W1K 2RF");
  const [country, setCountry] = useState("United Kingdom");

  // Step 3: Billing
  const [sameAsDelivery, setSameAsDelivery] = useState(true);
  const [billingAddress1, setBillingAddress1] = useState("14 Mount Street");
  const [billingCity, setBillingCity] = useState("London");
  const [billingPostcode, setBillingPostcode] = useState("W1K 2RF");

  // Step 4: Payment
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple" | "wire" | "concierge">("card");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("•••");
  const [cardName, setCardName] = useState("Amelia Hart");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDiamondDossier, setShowDiamondDossier] = useState(false);

  // Bag items calculation
  const totalItemsCount = store.bag.reduce((sum, item) => sum + item.quantity, 0);

  // Fallback demo items if bag is empty
  const isDemoFallback = store.bag.length === 0;
  const subtotal = isDemoFallback
    ? 21700
    : store.bag.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const vatAmount = Math.round(subtotal * 0.2);
  const total = subtotal + vatAmount;

  // Primary Ring Item (for high-jewellery breakdown showcase matching wireframe 07)
  const primaryItem = store.bag[0] || {
    id: "mah-classic-emerald",
    key: "mah-classic-emerald",
    name: "Emerald-Cut Engagement Ring",
    productName: "MAH Classic Solitaire",
    metal: "Platinum",
    size: "M (UK)",
    diamondCarat: "2.01",
    diamondShape: "Emerald",
    diamondColor: "D",
    diamondClarity: "VVS1",
    diamondCut: "Excellent",
    certNumber: "GIA 2487316207",
    image: "/images/styles/emerald-solitaire.jpg",
    settingPrice: 2950,
    diamondPrice: 18750,
    price: 21700,
    quantity: 1,
  };

  const stepsList = [
    { num: 1, key: "details", label: "CUSTOMER DETAILS" },
    { num: 2, key: "delivery", label: "DELIVERY / COLLECTION" },
    { num: 3, key: "billing", label: "BILLING" },
    { num: 4, key: "payment", label: "PAYMENT" },
    { num: 5, key: "review", label: "REVIEW & CONFIRM" },
  ];

  const handleNext = () => {
    if (step === 1) {
      if (!email || !firstName || !lastName || !phoneNumber) {
        toast.error("Please complete all required customer details.");
        return;
      }
    }
    if (step === 2 && fulfilmentType === "delivery") {
      if (!addressLine1 || !city || !postcode) {
        toast.error("Please enter complete delivery address.");
        return;
      }
    }
    setStep((prev) => Math.min(5, prev + 1));
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    const orderRef = `MAH-2408-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: orderRef,
          customerName: `${firstName} ${lastName}`,
          email,
          phone: `${countryCode} ${phoneNumber}`,
          deliveryType: fulfilmentType,
          address: {
            line1: addressLine1,
            line2: addressLine2,
            city,
            postcode,
            country,
          },
          items: store.bag.length > 0 ? store.bag : [primaryItem],
          subtotal,
          vat: vatAmount,
          total,
          paymentMethod,
        }),
      });
    } catch {
      // offline fallback
    } finally {
      store.placeOrder(orderRef);
      setIsSubmitting(false);

      // High-value purchases (> £5,000) go to Section 08 3D Secure / High-Value Verification
      if (total >= 5000) {
        router.push(`/verification?orderId=${encodeURIComponent(orderRef)}`);
      } else {
        router.push(`/confirmation?orderId=${encodeURIComponent(orderRef)}`);
      }
    }
  };

  return (
    <main id="main-content" className="checkout-page-07">
      {/* 1. TOP HEADER & EXPERT CONTACT */}
      <div className="co-top-header shell">
        <div className="co-top-inner">
          <div className="co-brand-center">
            <Link href="/" className="co-logo-link" aria-label="MAH Home">
              <span className="co-logo-text">M A H</span>
              <span className="co-logo-sub">DIAMONDS</span>
            </Link>
          </div>
          <div className="co-expert-link-wrap">
            <Link href="/expert" className="co-expert-btn">
              <Headphones size={15} />
              <span>Speak to an MAH Expert</span>
            </Link>
          </div>
        </div>

        <div className="co-secure-title-row">
          <div className="co-lock-badge">
            <Lock size={14} />
            <span>SECURE CHECKOUT</span>
          </div>
        </div>
      </div>

      {/* 2. 5-STEP HORIZONTAL STEPPER BAR */}
      <section className="shell co-stepper-section" aria-label="Checkout Steps">
        <div className="co-stepper-bar">
          {stepsList.map((st, idx) => {
            const isCompleted = step > st.num;
            const isActive = step === st.num;
            return (
              <div
                key={st.key}
                className={`co-step-item ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
                onClick={() => isCompleted && setStep(st.num)}
                style={{ cursor: isCompleted ? "pointer" : "default" }}
              >
                <div className="co-step-circle">
                  {isCompleted ? <Check size={14} strokeWidth={2.5} /> : <span>{st.num}</span>}
                </div>
                <span className="co-step-label">{st.label}</span>
                {idx < stepsList.length - 1 && <div className="co-step-line" />}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. MAIN CHECKOUT 2-COLUMN LAYOUT */}
      <section className="shell co-main-section">
        <div className="co-split-layout">
          {/* LEFT COLUMN: ACTIVE STEP FORM */}
          <div className="co-left-col">
            {/* STEP 1: CUSTOMER DETAILS */}
            {step === 1 && (
              <div className="co-form-card facet-oct-sm">
                <div className="co-form-header">
                  <div className="co-title-wrap">
                    <h2>1. CUSTOMER DETAILS</h2>
                    <p className="co-form-sub">Enter your contact details or continue as guest.</p>
                  </div>
                  <Link href="/account" className="co-signin-link">
                    Already a client? <strong>Sign In</strong>
                  </Link>
                </div>

                <div className="co-fields-grid">
                  <div className="co-field-group full-width">
                    <label htmlFor="co-email">
                      Email address <span className="req">*</span>
                    </label>
                    <input
                      id="co-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                    />
                  </div>

                  <div className="co-field-group half-width">
                    <label htmlFor="co-first-name">
                      First name <span className="req">*</span>
                    </label>
                    <input
                      id="co-first-name"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      required
                    />
                  </div>

                  <div className="co-field-group half-width">
                    <label htmlFor="co-last-name">
                      Last name <span className="req">*</span>
                    </label>
                    <input
                      id="co-last-name"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      required
                    />
                  </div>

                  <div className="co-field-group full-width">
                    <label htmlFor="co-phone">
                      Phone number <span className="req">*</span>
                    </label>
                    <div className="co-phone-wrap">
                      <select
                        aria-label="Country Dialling Code"
                        className="co-country-select"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                      >
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+33">🇫🇷 +33</option>
                        <option value="+41">🇨🇭 +41</option>
                        <option value="+971">🇦🇪 +971</option>
                        <option value="+852">🇭🇰 +852</option>
                      </select>
                      <input
                        id="co-phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Phone number"
                        required
                      />
                    </div>
                  </div>

                  <div className="co-account-toggle-wrap full-width">
                    <label className="co-checkbox-label">
                      <input
                        type="checkbox"
                        checked={createAccount}
                        onChange={(e) => setCreateAccount(e.target.checked)}
                      />
                      <span className="co-checkbox-custom" />
                      <span className="co-checkbox-text">
                        <strong>Create an MAH account for future convenience</strong>
                        <small>You can set a password in the next step.</small>
                      </span>
                    </label>
                  </div>

                  {createAccount && (
                    <div className="co-field-group full-width co-password-field">
                      <label htmlFor="co-pwd">
                        Create Maison Password <span className="req">*</span>
                      </label>
                      <input
                        id="co-pwd"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Choose a secure passphrase"
                      />
                    </div>
                  )}
                </div>

                <div className="co-actions-wrap">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="button button-dark button-wide co-btn-primary"
                  >
                    <span>CONTINUE TO DELIVERY / COLLECTION</span>
                    <ArrowRight size={16} />
                  </button>
                  <div className="co-security-note">
                    <Lock size={13} />
                    <span>Your details are encrypted and secure.</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: DELIVERY / COLLECTION */}
            {step === 2 && (
              <div className="co-form-card facet-oct-sm">
                <div className="co-form-header">
                  <div className="co-title-wrap">
                    <h2>2. DELIVERY / COLLECTION</h2>
                    <p className="co-form-sub">Select your preferred high-jewellery handover method.</p>
                  </div>
                </div>

                <div className="co-fulfilment-selector">
                  <button
                    type="button"
                    className={`co-fulfil-card ${fulfilmentType === "delivery" ? "active" : ""}`}
                    onClick={() => setFulfilmentType("delivery")}
                  >
                    <span className="co-radio-circle">{fulfilmentType === "delivery" && <span className="co-radio-dot" />}</span>
                    <div className="co-fulfil-info">
                      <strong>Insured Express Courier Delivery</strong>
                      <p>Complimentary, discreet packaging with signature required upon arrival.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`co-fulfil-card ${fulfilmentType === "collection" ? "active" : ""}`}
                    onClick={() => setFulfilmentType("collection")}
                  >
                    <span className="co-radio-circle">{fulfilmentType === "collection" && <span className="co-radio-dot" />}</span>
                    <div className="co-fulfil-info">
                      <strong>Private Salon Collection</strong>
                      <p>MAH Private Salon, 14 Mount Street, Mayfair, London W1K 2RF</p>
                    </div>
                  </button>
                </div>

                {fulfilmentType === "delivery" ? (
                  <div className="co-fields-grid" style={{ marginTop: 24 }}>
                    <div className="co-field-group full-width">
                      <label htmlFor="co-address-1">
                        Address line 1 <span className="req">*</span>
                      </label>
                      <input
                        id="co-address-1"
                        type="text"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        placeholder="House / Building name or number, street"
                        required
                      />
                    </div>

                    <div className="co-field-group full-width">
                      <label htmlFor="co-address-2">
                        Address line 2 <small>(Optional)</small>
                      </label>
                      <input
                        id="co-address-2"
                        type="text"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        placeholder="Apartment, suite, unit"
                      />
                    </div>

                    <div className="co-field-group half-width">
                      <label htmlFor="co-city">
                        City / Town <span className="req">*</span>
                      </label>
                      <input
                        id="co-city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="London"
                        required
                      />
                    </div>

                    <div className="co-field-group half-width">
                      <label htmlFor="co-postcode">
                        Postcode <span className="req">*</span>
                      </label>
                      <input
                        id="co-postcode"
                        type="text"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        placeholder="W1K 2RF"
                        required
                      />
                    </div>

                    <div className="co-field-group full-width">
                      <label htmlFor="co-country">
                        Country <span className="req">*</span>
                      </label>
                      <select
                        id="co-country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      >
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="France">France</option>
                        <option value="Switzerland">Switzerland</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="Hong Kong">Hong Kong</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="co-salon-info-box facet-oct-sm" style={{ marginTop: 24 }}>
                    <div className="co-salon-icon">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <strong>Mayfair Salon Handover Appointment</strong>
                      <p>Your piece will be reserved in our vault. Our client concierge will contact you to confirm your private collection time and champagne reception.</p>
                    </div>
                  </div>
                )}

                <div className="co-actions-split">
                  <button type="button" onClick={handleBack} className="button button-ghost co-btn-back">
                    Back
                  </button>
                  <button type="button" onClick={handleNext} className="button button-dark co-btn-primary">
                    <span>CONTINUE TO BILLING</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: BILLING */}
            {step === 3 && (
              <div className="co-form-card facet-oct-sm">
                <div className="co-form-header">
                  <div className="co-title-wrap">
                    <h2>3. BILLING</h2>
                    <p className="co-form-sub">Specify the billing address associated with your payment method.</p>
                  </div>
                </div>

                <div className="co-fields-grid">
                  <div className="co-account-toggle-wrap full-width">
                    <label className="co-checkbox-label">
                      <input
                        type="checkbox"
                        checked={sameAsDelivery}
                        onChange={(e) => setSameAsDelivery(e.target.checked)}
                      />
                      <span className="co-checkbox-custom" />
                      <span className="co-checkbox-text">
                        <strong>Billing address is the same as delivery address</strong>
                        <small>{addressLine1}, {city} {postcode}</small>
                      </span>
                    </label>
                  </div>

                  {!sameAsDelivery && (
                    <>
                      <div className="co-field-group full-width">
                        <label htmlFor="co-b-address">Billing Address</label>
                        <input
                          id="co-b-address"
                          type="text"
                          value={billingAddress1}
                          onChange={(e) => setBillingAddress1(e.target.value)}
                          placeholder="Address Line 1"
                        />
                      </div>
                      <div className="co-field-group half-width">
                        <label htmlFor="co-b-city">City</label>
                        <input
                          id="co-b-city"
                          type="text"
                          value={billingCity}
                          onChange={(e) => setBillingCity(e.target.value)}
                        />
                      </div>
                      <div className="co-field-group half-width">
                        <label htmlFor="co-b-postcode">Postcode</label>
                        <input
                          id="co-b-postcode"
                          type="text"
                          value={billingPostcode}
                          onChange={(e) => setBillingPostcode(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="co-actions-split">
                  <button type="button" onClick={handleBack} className="button button-ghost co-btn-back">
                    Back
                  </button>
                  <button type="button" onClick={handleNext} className="button button-dark co-btn-primary">
                    <span>CONTINUE TO PAYMENT</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: PAYMENT */}
            {step === 4 && (
              <div className="co-form-card facet-oct-sm">
                <div className="co-form-header">
                  <div className="co-title-wrap">
                    <h2>4. PAYMENT</h2>
                    <p className="co-form-sub">Encrypted 256-bit bank-grade payment processing.</p>
                  </div>
                </div>

                <div className="co-payment-methods-grid">
                  <button
                    type="button"
                    className={`co-pm-btn ${paymentMethod === "card" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <span>Credit / Debit Card</span>
                  </button>
                  <button
                    type="button"
                    className={`co-pm-btn ${paymentMethod === "apple" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("apple")}
                  >
                    <span>Apple Pay / Google Pay</span>
                  </button>
                  <button
                    type="button"
                    className={`co-pm-btn ${paymentMethod === "wire" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("wire")}
                  >
                    <span>Bank Wire Transfer</span>
                  </button>
                  <button
                    type="button"
                    className={`co-pm-btn ${paymentMethod === "concierge" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("concierge")}
                  >
                    <span>Concierge Settlement</span>
                  </button>
                </div>

                {paymentMethod === "card" && (
                  <div className="co-fields-grid" style={{ marginTop: 24 }}>
                    <div className="co-field-group full-width">
                      <label htmlFor="co-card-num">Card Number</label>
                      <input
                        id="co-card-num"
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• ••••"
                      />
                    </div>
                    <div className="co-field-group half-width">
                      <label htmlFor="co-card-exp">Expiry (MM/YY)</label>
                      <input
                        id="co-card-exp"
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="co-field-group half-width">
                      <label htmlFor="co-card-cvc">Security Code (CVC)</label>
                      <input
                        id="co-card-cvc"
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="CVC"
                      />
                    </div>
                    <div className="co-field-group full-width">
                      <label htmlFor="co-card-name">Name on Card</label>
                      <input
                        id="co-card-name"
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Cardholder Name"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === "wire" && (
                  <div className="co-wire-box facet-oct-sm" style={{ marginTop: 20 }}>
                    <Info size={18} />
                    <p>
                      Wire instructions with MAH Diamonds Client Settlement Account details and invoice reference will be provided upon review confirmation.
                    </p>
                  </div>
                )}

                <div className="co-actions-split">
                  <button type="button" onClick={handleBack} className="button button-ghost co-btn-back">
                    Back
                  </button>
                  <button type="button" onClick={handleNext} className="button button-dark co-btn-primary">
                    <span>CONTINUE TO REVIEW & CONFIRM</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW & CONFIRM */}
            {step === 5 && (
              <div className="co-form-card facet-oct-sm">
                <div className="co-form-header">
                  <div className="co-title-wrap">
                    <h2>5. REVIEW & CONFIRM</h2>
                    <p className="co-form-sub">Please verify your order details before final authorization.</p>
                  </div>
                </div>

                <div className="co-review-summary-box">
                  <div className="co-review-section">
                    <div className="co-rev-header">
                      <strong>Client Contact</strong>
                      <button type="button" onClick={() => setStep(1)} className="co-rev-edit">
                        Edit
                      </button>
                    </div>
                    <p>{firstName} {lastName} · {email}</p>
                    <p>{countryCode} {phoneNumber}</p>
                  </div>

                  <div className="co-review-section">
                    <div className="co-rev-header">
                      <strong>Fulfilment</strong>
                      <button type="button" onClick={() => setStep(2)} className="co-rev-edit">
                        Edit
                      </button>
                    </div>
                    {fulfilmentType === "delivery" ? (
                      <p>Insured Express Courier: {addressLine1}, {city} {postcode}, {country}</p>
                    ) : (
                      <p>Private Salon Collection: 14 Mount Street, Mayfair, London</p>
                    )}
                  </div>

                  <div className="co-review-section">
                    <div className="co-rev-header">
                      <strong>Payment Method</strong>
                      <button type="button" onClick={() => setStep(4)} className="co-rev-edit">
                        Edit
                      </button>
                    </div>
                    <p>
                      {paymentMethod === "card"
                        ? `Credit Card ending in 4242 (${cardName})`
                        : paymentMethod === "apple"
                        ? "Apple Pay / Google Pay"
                        : paymentMethod === "wire"
                        ? "Private Bank Wire Transfer"
                        : "Concierge Settlement"}
                    </p>
                  </div>
                </div>

                <div className="co-actions-split">
                  <button type="button" onClick={handleBack} className="button button-ghost co-btn-back">
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmOrder}
                    disabled={isSubmitting}
                    className="button button-dark co-btn-primary"
                  >
                    <span>{isSubmitting ? "AUTHORISING..." : "PLACE ORDER & PROCEED"}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: STICKY 'YOUR SELECTION' SUMMARY CARD */}
          <aside className="co-right-col">
            <div className="co-selection-card facet-oct-sm">
              <div className="co-selection-header">
                <h3>YOUR SELECTION</h3>
                <Link href="/bag" className="co-edit-bag-link">
                  Edit Bag ({store.bag.length > 0 ? totalItemsCount : 2})
                </Link>
              </div>

              {/* Product Card Layout (Matching Wireframe 07) */}
              <div className="co-product-showcase">
                <div className="co-prod-media-col">
                  <div className="co-prod-img-wrap">
                    <Image
                      src={primaryItem.image || "/images/styles/emerald-solitaire.jpg"}
                      alt={primaryItem.name || "MAH Fine Creation"}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="co-prod-details-col">
                  <h4 className="co-prod-title">{primaryItem.name || "Engagement Ring"}</h4>
                  <div className="co-prod-meta-block">
                    <div className="co-meta-line">
                      <span className="co-meta-lbl">Setting</span>
                      <span className="co-meta-val">{primaryItem.productName || "MAH Classic Solitaire"}</span>
                    </div>
                    <div className="co-meta-line">
                      <span className="co-meta-lbl">Metal</span>
                      <span className="co-meta-val">{primaryItem.metal || "Platinum"}</span>
                    </div>
                    <div className="co-meta-line">
                      <span className="co-meta-lbl">Size</span>
                      <span className="co-meta-val">{primaryItem.size || "M (UK)"}</span>
                    </div>
                  </div>

                  <div className="co-diamond-spec-block">
                    <span className="co-spec-lead">
                      Centre Diamond: {primaryItem.diamondCarat || "2.01"}ct {primaryItem.diamondShape || "Emerald"} Cut
                    </span>
                    <div className="co-4spec-grid">
                      <div className="co-spec-cell">
                        <span className="co-spec-tag">Colour</span>
                        <strong className="co-spec-val">{primaryItem.diamondColor || "D"}</strong>
                      </div>
                      <div className="co-spec-cell">
                        <span className="co-spec-tag">Clarity</span>
                        <strong className="co-spec-val">{primaryItem.diamondClarity || "VVS1"}</strong>
                      </div>
                      <div className="co-spec-cell">
                        <span className="co-spec-tag">Cut</span>
                        <strong className="co-spec-val">{primaryItem.diamondCut || "Excellent"}</strong>
                      </div>
                      <div className="co-spec-cell">
                        <span className="co-spec-tag">Certification</span>
                        <strong className="co-spec-val">{primaryItem.certNumber || "GIA 2487316207"}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="co-pricing-breakdown">
                <div className="co-price-row">
                  <span>Ring Setting</span>
                  <span>{money(primaryItem.settingPrice || 2950)}</span>
                </div>
                <div className="co-price-row">
                  <span>Centre Diamond ({primaryItem.diamondCarat || "2.01"}ct)</span>
                  <span>{money(primaryItem.diamondPrice || 18750)}</span>
                </div>
                <div className="co-diamond-link-row">
                  <button
                    type="button"
                    onClick={() => setShowDiamondDossier(true)}
                    className="co-view-diamond-link"
                  >
                    View Diamond Details
                  </button>
                </div>

                <div className="co-subtotal-divider" />

                <div className="co-price-row">
                  <span>Subtotal</span>
                  <span>{money(subtotal)}</span>
                </div>
                <div className="co-price-row">
                  <span>VAT (20%)</span>
                  <span>{money(vatAmount)}</span>
                </div>
                <div className="co-price-row">
                  <span>Delivery</span>
                  <span className="co-comp-delivery">—</span>
                </div>

                <div className="co-total-divider" />

                <div className="co-total-row">
                  <span className="co-total-label">TOTAL</span>
                  <span className="co-total-amount">{money(total)}</span>
                </div>
              </div>

              {/* Final price notice */}
              <div className="co-revalidation-notice">
                <ShieldCheck size={16} />
                <p>Final price and availability will be revalidated before your order is confirmed.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* 4. BOTTOM REASSURANCE STRIP (4 COLUMNS - EXACT WIREFRAME) */}
      <section className="shell co-reassurance-strip-section">
        <div className="co-reassurance-grid-4col">
          {/* 1. EXPERT CRAFTSMANSHIP */}
          <div className="co-reassure-card">
            <div className="co-reassure-icon-wrap">
              <Diamond size={24} strokeWidth={1.2} />
            </div>
            <div className="co-reassure-text">
              <strong>EXPERT CRAFTSMANSHIP</strong>
              <p>Timeless pieces, expertly made.</p>
            </div>
          </div>

          {/* 2. PRIVATE & SECURE */}
          <div className="co-reassure-card">
            <div className="co-reassure-icon-wrap">
              <ShieldCheck size={24} strokeWidth={1.2} />
            </div>
            <div className="co-reassure-text">
              <strong>PRIVATE & SECURE</strong>
              <p>Your information is protected at every step.</p>
            </div>
          </div>

          {/* 3. CONFIDENTIAL & DISCREET */}
          <div className="co-reassure-card">
            <div className="co-reassure-icon-wrap">
              <Lock size={24} strokeWidth={1.2} />
            </div>
            <div className="co-reassure-text">
              <strong>CONFIDENTIAL & DISCREET</strong>
              <p>Your privacy is always respected.</p>
            </div>
          </div>

          {/* 4. PERSONAL ASSISTANCE */}
          <div className="co-reassure-card">
            <div className="co-reassure-icon-wrap">
              <Headphones size={24} strokeWidth={1.2} />
            </div>
            <div className="co-reassure-text">
              <strong>PERSONAL ASSISTANCE</strong>
              <p>Our experts are here to help you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DIAMOND DETAILS DOSSIER MODAL */}
      {showDiamondDossier && (
        <div className="modal-backdrop-06" onClick={() => setShowDiamondDossier(false)}>
          <div className="modal-dossier-06" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn-06"
              onClick={() => setShowDiamondDossier(false)}
              aria-label="Close Diamond Details"
            >
              <X size={18} />
            </button>

            <div className="gia-dossier-header">
              <div className="gia-badge-seal">
                <Award size={24} />
                <span>CENTRE DIAMOND DOSSIER</span>
              </div>
              <span className="gia-ref-pill">Ref: {primaryItem.certNumber || "GIA 2487316207"}</span>
            </div>

            <div className="gia-dossier-body">
              <div className="gia-matrix-grid">
                <div className="gia-spec-item">
                  <span className="lbl">Shape &amp; Cutting Style</span>
                  <strong className="val">{primaryItem.diamondShape || "Emerald Cut"}</strong>
                </div>
                <div className="gia-spec-item">
                  <span className="lbl">Carat Weight</span>
                  <strong className="val">{primaryItem.diamondCarat || "2.01"} ct</strong>
                </div>
                <div className="gia-spec-item">
                  <span className="lbl">Colour Grade</span>
                  <strong className="val">{primaryItem.diamondColor || "D"} (Colorless)</strong>
                </div>
                <div className="gia-spec-item">
                  <span className="lbl">Clarity Grade</span>
                  <strong className="val">{primaryItem.diamondClarity || "VVS1"}</strong>
                </div>
                <div className="gia-spec-item">
                  <span className="lbl">Cut Grade</span>
                  <strong className="val">{primaryItem.diamondCut || "Excellent"}</strong>
                </div>
                <div className="gia-spec-item">
                  <span className="lbl">Polish / Symmetry</span>
                  <strong className="val">Excellent / Excellent</strong>
                </div>
                <div className="gia-spec-item">
                  <span className="lbl">Fluorescence</span>
                  <strong className="val">None (Inert)</strong>
                </div>
                <div className="gia-spec-item">
                  <span className="lbl">Grading Authority</span>
                  <strong className="val">GIA London &amp; New York</strong>
                </div>
              </div>

              <div className="gia-security-footer">
                <ShieldCheck size={18} className="shield-icon" />
                <p>
                  Independently certified stone with microscopic laser inscription on the girdle, verified against the official gemological database.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  Diamond,
  Heart,
  Info,
  Gift,
  Send,
  Copy,
  Lock,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  Eye,
  ArrowRight,
  Ruler,
} from "lucide-react";
import { toast } from "sonner";
import { money, products, type Product } from "@/lib/demo-data";
import { useDemoStore } from "@/components/demo-store-provider";
import { RingSizeGuideModal } from "@/components/ring-size-guide-modal";

interface ProductDetailViewProps {
  product: Product;
  category: "wedding" | "jewellery" | "engagement";
}





export function ProductDetailView({ product, category }: ProductDetailViewProps) {
  const store = useDemoStore();
  const router = useRouter();

  const initialMetal = product.metal || "18k Yellow Gold";
  const [metal, setMetal] = useState<string>(initialMetal);
  const [width, setWidth] = useState<string>("3.5mm");
  const [fingerSize, setFingerSize] = useState<string>("M");
  const [necklaceLength, setNecklaceLength] = useState<string>("45 cm");
  const [isEngravingOpen, setIsEngravingOpen] = useState(false);
  const [engravingText, setEngravingText] = useState("");
  const [activeAccordion, setActiveAccordion] = useState<string | null>("description");
  const [previewImageModal, setPreviewImageModal] = useState<string | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [engravingFont, setEngravingFont] = useState<"script" | "roman" | "sans">("script");
  const [showHintModal, setShowHintModal] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [hintMessage, setHintMessage] = useState("I thought you might like to see this exquisite piece from MAH Diamonds...");
  const [hintSent, setHintSent] = useState(false);

  const availableMetals = product.availableMetals || [
    "Platinum",
    "18k White Gold",
    "18k Yellow Gold",
    "18k Rose Gold",
  ];

  const widths = ["2mm", "2.5mm", "3mm", "3.5mm", "4mm", "5mm"];
  const fingerSizes = ["J", "K", "L", "M", "N", "O", "P", "Q", "R", "S"];

  const calculatedPrice = useMemo(() => {
    let base = product.price;
    if (category === "wedding" || category === "engagement") {
      if (width === "4mm") base += 120;
      if (width === "5mm") base += 260;
      if (width === "2mm") base -= 80;
    }
    return base;
  }, [product.price, width, category]);

  const galleryImages = useMemo(() => {
    const list: string[] = [];
    if (product.images && product.images.length > 0) {
      list.push(...product.images);
    } else {
      list.push(product.image);
    }

    if (list.length === 1) {
      if (category === "wedding") {
        list.push(
          "/images/styles/diamond-band.jpg",
          product.image,
          "/images/metals/platinum.jpg"
        );
      } else if (category === "engagement") {
        list.push(
          "/images/mah-hero-concept.png",
          product.image,
          "/images/metals/platinum.jpg"
        );
      } else {
        list.push(
          "/images/styles/solitaire.jpg",
          product.image,
          "/images/styles/halo.jpg"
        );
      }
    }
    return list;
  }, [product, category]);

  const relatedProducts = useMemo(() => {
    return products
      .filter((p) => p.category === category && p.id !== product.id)
      .slice(0, 3);
  }, [category, product.id]);

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  const handleAddToBag = () => {
    const configDetail = [
      metal,
      category === "wedding" ? `${width} · UK Size ${fingerSize}` : null,
      category === "engagement" ? `UK Size ${fingerSize}` : null,
      category === "jewellery" ? necklaceLength : null,
      engravingText ? `Engraved: "${engravingText}"` : null,
    ]
      .filter(Boolean)
      .join(" · ");

    store.addProduct(
      {
        ...product,
        price: calculatedPrice,
      },
      configDetail
    );

    toast.success("Piece added to your shopping bag", {
      description: `${product.name} (${metal})`,
    });
    router.push("/bag");
  };

  const getMetalColorClass = (m: string) => {
    if (m.includes("Platinum")) return "metal-platinum";
    if (m.includes("Yellow")) return "metal-yellow";
    if (m.includes("Rose")) return "metal-rose";
    return "metal-white";
  };

  const categoryLabel =
    category === "wedding"
      ? "Wedding Rings"
      : category === "engagement"
      ? "Engagement Rings"
      : "Haute Joaillerie";

  const categoryHref =
    category === "wedding"
      ? "/wedding-rings"
      : category === "engagement"
      ? "/engagement-rings"
      : "/jewellery";

  return (
    <div className="qs-pdp-experience">
      <nav className="shell qs-breadcrumbs" aria-label="Breadcrumb navigation">
        <Link href="/">Home</Link>
        <span className="qs-crumb-sep">/</span>
        <Link href={categoryHref}>{categoryLabel}</Link>
        {product.collection && (
          <>
            <span className="qs-crumb-sep">/</span>
            <Link href={`${categoryHref}?collection=${encodeURIComponent(product.collection)}`}>
              {product.collection}
            </Link>
          </>
        )}
        <span className="qs-crumb-sep">/</span>
        <span className="qs-crumb-current">{product.name}</span>
      </nav>

      <section className="shell qs-main-pdp-grid">
        <div className="qs-mosaic-gallery" aria-label="Product photography gallery">
          {galleryImages.map((imgUrl, index) => {
            const isFullSpan = index === 0 && galleryImages.length > 2;
            const isModelShot =
              imgUrl.toLowerCase().includes("model") || imgUrl.toLowerCase().includes("crop");

            return (
              <div
                key={`${imgUrl}-${index}`}
                className={`qs-gallery-item ${isFullSpan ? "span-two" : ""} ${
                  isModelShot ? "item-model" : "item-packshot"
                }`}
                onClick={() => setPreviewImageModal(imgUrl)}
              >
                <div className="qs-image-container">
                  <Image
                    src={imgUrl}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    sizes={isFullSpan ? "(max-width: 900px) 100vw, 55vw" : "(max-width: 900px) 50vw, 28vw"}
                    priority={index <= 1}
                    className={isModelShot ? "qs-img-cover" : "qs-img-contain"}
                  />
                  <button
                    type="button"
                    className="qs-zoom-indicator"
                    aria-label="Enlarge view"
                  >
                    <Eye size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="qs-sticky-buybox">
          <div className="qs-buybox-inner">
            <div className="qs-header-wrap">
              <span className="qs-eyebrow-tag">
                {product.badge || product.collection || "Maison Fine Jewellery"} · {product.id}
              </span>
              <h1 className="qs-product-title">{product.name}</h1>
              <div className="qs-price-tag">
                <strong>{money(calculatedPrice)}</strong>
                <span>Inc. VAT · Free Insured Courier</span>
              </div>
            </div>

            <div className="qs-option-group">
              <div className="qs-option-label-row">
                <span className="qs-group-label">Choose Precious Metal:</span>
                <span className="qs-active-choice">{metal}</span>
              </div>
              <div className="qs-metal-swatches">
                {availableMetals.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`qs-metal-swatch ${getMetalColorClass(m)} ${
                      metal === m ? "active" : ""
                    }`}
                    onClick={() => setMetal(m)}
                    title={m}
                    aria-label={`Select ${m}`}
                  >
                    <span className="qs-swatch-circle" />
                    <span className="qs-swatch-name">{m}</span>
                  </button>
                ))}
              </div>
            </div>

            {(category === "wedding" || category === "engagement") && (
              <div className="qs-option-group">
                <div className="qs-option-label-row">
                  <span className="qs-group-label">Band Width:</span>
                  <span className="qs-active-choice">{width}</span>
                </div>
                <div className="qs-pill-row">
                  {widths.map((w) => (
                    <button
                      key={w}
                      type="button"
                      className={`qs-pill-btn ${width === w ? "active" : ""}`}
                      onClick={() => setWidth(w)}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {category === "wedding" || category === "engagement" ? (
              <div className="qs-option-group">
                <div className="qs-option-label-row">
                  <span className="qs-group-label">UK Finger Size:</span>
                  <button
                    type="button"
                    className="qs-size-guide-link"
                    onClick={() => setIsSizeGuideOpen(true)}
                    style={{ background: "none", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
                  >
                    <Ruler size={13} /> Size Guide & Gauge
                  </button>
                </div>
                <div className="qs-pill-row wrap">
                  {fingerSizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`qs-pill-btn ${fingerSize === s ? "active" : ""}`}
                      onClick={() => setFingerSize(s)}
                    >
                      Size {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="qs-option-group">
                <div className="qs-option-label-row">
                  <span className="qs-group-label">Chain / Drop Length:</span>
                  <span className="qs-active-choice">{necklaceLength}</span>
                </div>
                <div className="qs-pill-row">
                  {["40 cm", "45 cm", "50 cm"].map((len) => (
                    <button
                      key={len}
                      type="button"
                      className={`qs-pill-btn ${necklaceLength === len ? "active" : ""}`}
                      onClick={() => setNecklaceLength(len)}
                    >
                      {len}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="qs-engraving-card">
              <button
                type="button"
                className="qs-engraving-toggle"
                onClick={() => setIsEngravingOpen(!isEngravingOpen)}
              >
                <span>
                  <strong>✦ Complimentary Laser & Hand Engraving</strong>
                  <small>Personalise the inner band with names, dates, or private promises</small>
                </span>
                {isEngravingOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {isEngravingOpen && (
                <div className="qs-engraving-input-wrap">
                  {/* Font choice selector */}
                  <div className="engraving-font-selector">
                    <span className="engraving-label">Choose Typography:</span>
                    <div className="engraving-font-pills">
                      <button
                        type="button"
                        className={`font-pill ${engravingFont === "script" ? "active" : ""}`}
                        onClick={() => setEngravingFont("script")}
                        style={{ fontFamily: "var(--font-display-stack)", fontStyle: "italic" }}
                      >
                        Royal Script
                      </button>
                      <button
                        type="button"
                        className={`font-pill ${engravingFont === "roman" ? "active" : ""}`}
                        onClick={() => setEngravingFont("roman")}
                        style={{ fontFamily: "var(--font-editorial-stack)", letterSpacing: "0.08em" }}
                      >
                        Classic Roman
                      </button>
                      <button
                        type="button"
                        className={`font-pill ${engravingFont === "sans" ? "active" : ""}`}
                        onClick={() => setEngravingFont("sans")}
                        style={{ fontFamily: "var(--font-sans-stack)", letterSpacing: "0.1em" }}
                      >
                        Modern Sans
                      </button>
                    </div>
                  </div>

                  {/* Input field and romantic symbols */}
                  <div className="engraving-field-group">
                    <div className="engraving-input-row">
                      <input
                        type="text"
                        maxLength={25}
                        placeholder="e.g. Amelia & Henry · 2026 ♡"
                        value={engravingText}
                        onChange={(e) => setEngravingText(e.target.value)}
                        className="qs-engraving-input"
                      />
                      <span className="engraving-count">{engravingText.length}/25</span>
                    </div>

                    <div className="engraving-symbol-strip">
                      <span className="symbol-label">Insert Symbol:</span>
                      {["♡", "∞", "✦", "&", "·"].map((sym) => (
                        <button
                          key={sym}
                          type="button"
                          className="symbol-btn"
                          onClick={() => {
                            if (engravingText.length + sym.length <= 25) {
                              setEngravingText(engravingText + " " + sym);
                            }
                          }}
                          title={`Insert ${sym}`}
                        >
                          {sym}
                        </button>
                      ))}
                      {engravingText && (
                        <button
                          type="button"
                          className="symbol-clear"
                          onClick={() => setEngravingText("")}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Live Inside-the-Band Curvature Preview */}
                  <div className="engraving-band-preview-wrap">
                    <span className="preview-label">Live Inner Band Hallmark & Laser Preview</span>
                    <div className={`engraving-band-stage metal-${metal.toLowerCase().replace(/[^a-z]/g, "")}`}>
                      <div className="band-hallmark-group">
                        <span className="hallmark-stamp" title="London Assay Office Leopard">🐆</span>
                        <span className="hallmark-stamp" title="Metal Purity Stamp">
                          {metal.includes("Platinum") ? "950" : "750"}
                        </span>
                        <span className="hallmark-stamp" title="Maison Sponsor Mark">MAH</span>
                      </div>
                      <div
                        className={`band-engraving-text font-${engravingFont}`}
                        style={{
                          fontFamily:
                            engravingFont === "script"
                              ? "var(--font-display-stack)"
                              : engravingFont === "roman"
                              ? "var(--font-editorial-stack)"
                              : "var(--font-sans-stack)",
                          fontStyle: engravingFont === "script" ? "italic" : "normal",
                        }}
                      >
                        {engravingText || "Your Inscription Appears Here"}
                      </div>
                    </div>
                    <small className="preview-guarantee">
                      Precision diamond-drag laser engraved in London Atelier · Never fades
                    </small>
                  </div>
                </div>
              )}
            </div>

            <div className="qs-action-stack">
              <button
                type="button"
                className="qs-primary-cta facet-oct-sm"
                onClick={handleAddToBag}
              >
                <ShoppingBag size={18} />
                <span>Add To Basket — {money(calculatedPrice)}</span>
              </button>

              <div className="qs-dual-action-row">
                <Link
                  href="/appointments"
                  className="qs-secondary-cta facet-oct-sm"
                  style={{ flex: 1 }}
                >
                  <CalendarDays size={15} />
                  <span>Book Appointment</span>
                </Link>
                <button
                  type="button"
                  className="qs-hint-btn facet-oct-sm"
                  onClick={() => setShowHintModal(true)}
                  style={{ flex: 1 }}
                >
                  <Gift size={15} />
                  <span>Drop a Hint</span>
                </button>
              </div>
            </div>

            <div className="qs-dispatch-strip">
              <span className="qs-pulse-dot" />
              <span>
                Estimated dispatch: <strong>Handcrafted in 3–4 weeks</strong>. Complimentary
                insured UK & international courier.
              </span>
            </div>

            <div className="qs-atelier-banner">
              <div className="qs-atelier-banner-content">
                <span className="qs-atelier-eyebrow">London Atelier Heritage</span>
                <h4>Master Goldsmith Bench Craftsmanship</h4>
                <p>
                  Every creation is cast in solid 950 platinum or 18k gold, independently hallmarked at Goldsmiths&apos; Hall, and hand-finished by master craftspeople in our London workshops.
                </p>
                <Link href="/appointments" className="qs-atelier-link">
                  Book London Showroom Consultation →
                </Link>
              </div>
            </div>

            <div className="qs-accordions">
              <div className="qs-accordion-item">
                <button
                  type="button"
                  className="qs-accordion-trigger"
                  onClick={() => toggleAccordion("description")}
                >
                  <span>Description & Details</span>
                  {activeAccordion === "description" ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                {activeAccordion === "description" && (
                  <div className="qs-accordion-body">
                    <p>{product.description}</p>
                    <ul className="qs-spec-list">
                      <li>
                        <strong>Precious Metal:</strong> Solid {metal}
                      </li>
                      {product.style && (
                        <li>
                          <strong>Design Silhouette:</strong> {product.style}
                        </li>
                      )}
                      {product.collection && (
                        <li>
                          <strong>Royal Collection:</strong> {product.collection}
                        </li>
                      )}
                      <li>
                        <strong>Hallmark:</strong> Stamped with official British Assay Office mark
                      </li>
                      <li>
                        <strong>Profile:</strong> Silky luxury comfort-fit interior for everyday wear
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="qs-accordion-item">
                <button
                  type="button"
                  className="qs-accordion-trigger"
                  onClick={() => toggleAccordion("delivery")}
                >
                  <span>Complimentary Delivery & 30-Day Resizing</span>
                  {activeAccordion === "delivery" ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                {activeAccordion === "delivery" && (
                  <div className="qs-accordion-body">
                    <p>
                      Every order is shipped with priority discreet courier packaging, fully insured
                      from our London workshops directly to your hands. We offer one complimentary
                      finger resizing within 30 days of receipt.
                    </p>
                  </div>
                )}
              </div>

              <div className="qs-accordion-item">
                <button
                  type="button"
                  className="qs-accordion-trigger"
                  onClick={() => toggleAccordion("warranty")}
                >
                  <span>Lifetime Maison Warranty</span>
                  {activeAccordion === "warranty" ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                {activeAccordion === "warranty" && (
                  <div className="qs-accordion-body">
                    <p>
                      Our lifetime warranty covers all manufacturing craftsmanship, annual ultrasonic
                      cleaning, prong tightness checkups, and rhodium replating in our London salons.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="qs-value-props-bar" aria-label="Maison assurances">
        <div className="shell qs-props-grid">
          <div className="qs-prop-item">
            <div className="qs-prop-icon">
              <Diamond size={20} />
            </div>
            <div className="qs-prop-text">
              <strong>Ethical Diamonds & Gold</strong>
              <span>100% Conflict-free & certified</span>
            </div>
          </div>

          <div className="qs-prop-item">
            <div className="qs-prop-icon">
              <Award size={20} />
            </div>
            <div className="qs-prop-text">
              <strong>Perfect Fit Guarantee</strong>
              <span>Complimentary 30-day resizing</span>
            </div>
          </div>

          <div className="qs-prop-item">
            <div className="qs-prop-icon">
              <ShieldCheck size={20} />
            </div>
            <div className="qs-prop-text">
              <strong>Lifetime Warranty</strong>
              <span>Annual inspection & cleaning</span>
            </div>
          </div>

          <div className="qs-prop-item">
            <div className="qs-prop-icon">
              <RotateCcw size={20} />
            </div>
            <div className="qs-prop-text">
              <strong>30-Day Returns</strong>
              <span>Unconditional peace of mind</span>
            </div>
          </div>

          <div className="qs-prop-item">
            <div className="qs-prop-icon">
              <Truck size={20} />
            </div>
            <div className="qs-prop-text">
              <strong>Insured Delivery</strong>
              <span>Signature midnight packaging</span>
            </div>
          </div>
        </div>
      </section>



      <section className="shell qs-related-section">
        <div className="qs-related-header">
          <h2>Our Most Popular {categoryLabel}</h2>
          <p>Handcrafted in solid platinum, 18k yellow gold, and French rose gold</p>
        </div>

        <div className="qs-related-grid">
          {relatedProducts.map((rel) => {
            const relHref =
              rel.category === "wedding"
                ? `/wedding-rings/product?id=${rel.id}`
                : rel.category === "engagement"
                ? `/engagement-rings/configure?id=${rel.id}`
                : `/jewellery/product?id=${rel.id}`;

            return (
              <article className="qs-related-card" key={rel.id}>
                <Link href={relHref} className="qs-related-media">
                  <Image
                    src={rel.image}
                    alt={rel.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="qs-related-img"
                  />
                </Link>
                <div className="qs-related-body">
                  <span className="qs-related-metal">{rel.metal}</span>
                  <h3>
                    <Link href={relHref}>{rel.name}</Link>
                  </h3>
                  <strong>{money(rel.price)}</strong>
                  <Link href={relHref} className="qs-related-link">
                    Discover Piece <ArrowRight size={13} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>




      <RingSizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        initialSize={fingerSize}
        onSelectSize={(newSize) => setFingerSize(newSize)}
      />

      {/* Drop a Hint Modal */}
      {showHintModal && (
        <div className="bespoke-modal-backdrop" onClick={() => setShowHintModal(false)}>
          <div className="bespoke-modal-card facet-oct" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <button
              className="modal-close-btn"
              onClick={() => setShowHintModal(false)}
              aria-label="Close"
            >
              ✕
            </button>
            {hintSent ? (
              <div className="modal-success">
                <span className="success-emblem facet-oct">✓</span>
                <h3>Discreet Hint Dispatched</h3>
                <p>
                  A discreet, beautifully presented dossier for <strong>{product.name}</strong> ({metal} · Size {fingerSize}) has been queued to <strong>{partnerEmail}</strong>.
                </p>
                <button
                  type="button"
                  className="button button-dark facet-oct-sm"
                  onClick={() => {
                    setHintSent(false);
                    setShowHintModal(false);
                  }}
                  style={{ marginTop: 20 }}
                >
                  Return to Piece
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!partnerEmail) {
                    toast.error("Please enter your partner's email address.");
                    return;
                  }
                  setHintSent(true);
                  toast.success("Discreet hint sent successfully!");
                }}
                className="modal-form"
              >
                <p className="eyebrow">Maison Discretion · Drop a Hint</p>
                <h3>Share Your Dream Piece</h3>
                <p className="modal-sub">
                  Send a subtle, beautifully formatted suggestion directly to your partner&apos;s inbox with exact specifications and ring size.
                </p>

                <div className="hint-selected-pill facet-oct-sm">
                  <Diamond size={16} />
                  <div>
                    <strong>{product.name}</strong>
                    <small>{metal} · UK Size {fingerSize} {engravingText ? `· Engraved "${engravingText}"` : ""}</small>
                  </div>
                </div>

                <label>
                  Partner&apos;s Name
                  <input
                    type="text"
                    required
                    placeholder="e.g. Henry"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                  />
                </label>

                <label>
                  Partner&apos;s Email Address *
                  <input
                    type="email"
                    required
                    placeholder="e.g. henry@example.com"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                  />
                </label>

                <label>
                  Personal Message
                  <textarea
                    rows={2}
                    value={hintMessage}
                    onChange={(e) => setHintMessage(e.target.value)}
                  />
                </label>

                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  <button type="submit" className="button button-dark facet-oct-sm" style={{ flex: 1 }}>
                    <Send size={14} /> Send Subtle Hint
                  </button>
                  <button
                    type="button"
                    className="button button-ghost facet-oct-sm"
                    onClick={() => {
                      if (typeof navigator !== "undefined" && navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Shareable link copied to clipboard!");
                      }
                    }}
                  >
                    <Copy size={14} /> Copy Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {previewImageModal && (
        <div
          className="qs-lightbox-backdrop"
          onClick={() => setPreviewImageModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="qs-lightbox-dialog" onClick={(e) => e.stopPropagation()}>
            <Image
              src={previewImageModal}
              alt="High resolution magnified view"
              fill
              className="qs-lightbox-img"
            />
            <button
              type="button"
              className="qs-lightbox-close"
              onClick={() => setPreviewImageModal(null)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

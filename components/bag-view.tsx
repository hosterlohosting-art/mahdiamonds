"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Award,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Diamond,
  Edit3,
  ExternalLink,
  Heart,
  HelpCircle,
  Info,
  Lock,
  Minus,
  Plus,
  RotateCw,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Trash2,
  Truck,
  User,
  X,
} from "lucide-react";
import { useDemoStore, type BagItem } from "@/components/demo-store-provider";
import { money, type Diamond as DiamondType } from "@/lib/demo-data";
import type { RoutePage } from "@/lib/site-data";
import { RingSizeGuideModal } from "@/components/ring-size-guide-modal";
import { toast } from "sonner";

interface BagViewProps {
  page: RoutePage;
}

export function BagView({ page }: BagViewProps) {
  const store = useDemoStore();
  const router = useRouter();

  // Selected image index for main gallery
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);

  // Private Code Accordion & State
  const [isPrivateCodeOpen, setIsPrivateCodeOpen] = useState(false);
  const [privateCode, setPrivateCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [discountLabel, setDiscountLabel] = useState("");

  // Delivery / Collection preview toggle
  const [deliveryPreview, setDeliveryPreview] = useState<"delivery" | "collection">("delivery");

  // Modals
  const [activeGiaItem, setActiveGiaItem] = useState<BagItem | null>(null);
  const [activeEditItem, setActiveEditItem] = useState<BagItem | null>(null);
  const [showOptionsInfoModal, setShowOptionsInfoModal] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Editable ring state for quick edit modal
  const [editMetal, setEditMetal] = useState("Platinum");
  const [editSize, setEditSize] = useState("L ½");

  // Fallback demo exemplar if user wants to seed initial state
  const demoExemplar: BagItem = {
    id: "er-aurora-001",
    key: "er-aurora-001",
    name: "The Aurora",
    productName: "The Aurora",
    category: "ENGAGEMENT RING",
    metal: "Platinum",
    size: "L ½",
    diamondCarat: "3.01",
    diamondShape: "Round Brilliant",
    diamondColor: "D",
    diamondClarity: "VVS1",
    diamondCut: "Excellent",
    diamondPolish: "Excellent",
    diamondSymmetry: "Excellent",
    diamondFluorescence: "None",
    diamondLab: "GIA",
    certNumber: "2476843210",
    settingPrice: 2950,
    diamondPrice: 93500,
    additionalOptionsPrice: 450,
    price: 96900,
    quantity: 1,
    image: "/images/styles/solitaire.jpg",
    detail: "Platinum · Size L ½ · 3.01ct Round Brilliant",
  };

  const handleSeedDemo = () => {
    store.addProduct({
      id: demoExemplar.id || "er-aurora-001",
      name: demoExemplar.name,
      category: "engagement",
      style: "Solitaire",
      metal: demoExemplar.metal || "Platinum",
      price: demoExemplar.price,
      description: "6-claw solitaire with hidden halo.",
      image: demoExemplar.image || "/images/styles/solitaire.jpg",
    });
    toast.success("Loaded MAH Signatures exemplar (The Aurora).");
  };

  // Has items in bag
  const hasItems = store.bag.length > 0;
  const bagItems = store.bag;

  // 5 Gallery images matching wireframe
  const primaryItem = bagItems[0] || demoExemplar;
  const galleryImages = [
    primaryItem.image || "/images/styles/solitaire.jpg",
    "/images/mah-hero-concept.png",
    "/images/metals/platinum.jpg",
    "/images/styles/halo.jpg",
    "/images/journal-atelier.jpg",
  ];

  // Pricing calculations
  const baseSubtotal = bagItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = appliedDiscount ? Math.round(baseSubtotal * appliedDiscount) : 0;
  const subtotal = Math.max(0, baseSubtotal - discountAmount);
  const total = subtotal;

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = privateCode.trim().toUpperCase();
    if (!clean) {
      toast.error("Please enter a private code.");
      return;
    }
    if (clean === "MAH2026" || clean === "VIP10" || clean === "LONDON") {
      setAppliedDiscount(0.1);
      setDiscountLabel("10% Maison VIP Privilege");
      toast.success("Private VIP privilege applied (-10%).");
    } else if (clean === "MAH500") {
      setAppliedDiscount(500 / baseSubtotal);
      setDiscountLabel("£500 Atelier Courtesy Privilege");
      toast.success("£500 Atelier courtesy credit applied.");
    } else {
      toast.error("Invalid or expired private code. Please contact your MAH advisor.");
    }
  };

  const handleRemoveItem = (key: string) => {
    store.removeBag(key);
    toast.info("Item removed from your selection.");
  };

  const handleOpenEditModal = (item: BagItem) => {
    setActiveEditItem(item);
    setEditMetal(item.metal || "Platinum");
    setEditSize(item.size || "L ½");
  };

  const handleSaveEditedRing = () => {
    if (activeEditItem) {
      store.updateRing({ metal: editMetal, size: editSize });
      setActiveEditItem(null);
      toast.success(`Ring configuration updated to ${editMetal}, Size ${editSize}.`);
    }
  };

  return (
    <main id="main-content" className="bag-page-06">
      {/* 1. Header & Stepper Bar */}
      <section className="bag-header-section-06">
        <div className="shell">
          <div className="bag-header-top-06">
            <div className="bag-title-area-06">
              <h1 className="bag-page-title-06">
                <span className="section-num">06 — </span>YOUR SELECTION
              </h1>
              <p className="bag-page-subtitle-06">
                Review your selection before you proceed to secure checkout.
              </p>
            </div>

            {/* Stepper Progress Indicator */}
            <div className="bag-stepper-06" aria-label="Checkout stages">
              <div className="stepper-node active">
                <span className="stepper-circle">1</span>
                <span className="stepper-label">Your Selection</span>
              </div>
              <span className="stepper-connector" />
              <Link href="/checkout" className="stepper-node upcoming">
                <span className="stepper-circle">2</span>
                <span className="stepper-label">Secure Checkout</span>
              </Link>
              <span className="stepper-connector" />
              <div className="stepper-node upcoming">
                <span className="stepper-circle">3</span>
                <span className="stepper-label">Payment</span>
              </div>
              <span className="stepper-connector" />
              <div className="stepper-node upcoming">
                <span className="stepper-circle">4</span>
                <span className="stepper-label">Confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <section className="bag-main-section-06">
        <div className="shell">
          {hasItems ? (
            <>
              <div className="bag-grid-06">
                {/* LEFT COLUMN: Main Selection Cards List */}
                <div className="bag-items-list-col-06">
                  {bagItems.map((item, itemIdx) => {
                    const isRing =
                      item.name.toLowerCase().includes("ring") ||
                      item.name.toLowerCase().includes("solitaire") ||
                      item.name.toLowerCase().includes("aurora");
                    const hasDiamond = !!(item.diamondCarat || item.diamondShape || isRing);

                    return (
                      <div key={item.key || itemIdx} className="bag-main-card-06">
                        <div className="bag-card-split-06">
                          {/* Left: Product Visual Gallery */}
                          <div className="bag-gallery-col-06">
                            <div className="bag-main-image-wrap-06">
                              <Image
                                src={
                                  itemIdx === 0
                                    ? galleryImages[selectedImageIdx] || item.image || "/images/styles/solitaire.jpg"
                                    : item.image || "/images/styles/solitaire.jpg"
                                }
                                alt={item.name || "MAH High Jewellery Selection"}
                                fill
                                priority={itemIdx === 0}
                                sizes="(max-width: 768px) 100vw, 340px"
                                className="bag-main-image-06"
                              />
                              <span className="bag-hallmark-badge-06">
                                <Diamond size={13} /> MAH LONDON · ASSAY HALLMARK
                              </span>
                            </div>

                            {/* 5 Gallery Thumbnails (for primary item) */}
                            {itemIdx === 0 && (
                              <div className="bag-thumbs-row-06" role="tablist" aria-label="Product views">
                                {galleryImages.map((thumbUrl, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    className={`bag-thumb-btn-06 ${selectedImageIdx === idx ? "active" : ""}`}
                                    onClick={() => setSelectedImageIdx(idx)}
                                    aria-label={`View angle ${idx + 1}`}
                                  >
                                    <Image
                                      src={thumbUrl}
                                      alt=""
                                      fill
                                      sizes="60px"
                                      className="bag-thumb-img-06"
                                    />
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Right: Product Dossier & Specifications */}
                          <div className="bag-info-col-06">
                            <div className="bag-item-header-06">
                              <span className="bag-category-tag-06">
                                {item.category || (isRing ? "ENGAGEMENT RING" : "MAISON JEWELLERY")}
                              </span>
                              <h2 className="bag-item-title-06">{item.name || "The Aurora"}</h2>
                              <p className="bag-item-subtitle-06">
                                {item.metal || "Platinum"} · {item.diamondShape || "Round Brilliant"} · Size {item.size || "L ½"}
                                <br />
                                <span className="bag-setting-desc-06">
                                  {item.detail || "6-claw solitaire with hidden halo"}
                                </span>
                              </p>
                            </div>

                            {/* CENTRE DIAMOND Specifications */}
                            {hasDiamond && (
                              <div className="bag-spec-block-06">
                                <h3 className="bag-spec-heading-06">CENTRE DIAMOND</h3>
                                <dl className="bag-spec-table-06">
                                  <div className="spec-row">
                                    <dt>Type</dt>
                                    <dd>Natural Diamond</dd>
                                  </div>
                                  <div className="spec-row">
                                    <dt>Carat</dt>
                                    <dd>{item.diamondCarat ? `${item.diamondCarat} ct` : "3.01 ct"}</dd>
                                  </div>
                                  <div className="spec-row">
                                    <dt>Colour</dt>
                                    <dd>{item.diamondColor || "D"}</dd>
                                  </div>
                                  <div className="spec-row">
                                    <dt>Clarity</dt>
                                    <dd>{item.diamondClarity || "VVS1"}</dd>
                                  </div>
                                  <div className="spec-row">
                                    <dt>Cut</dt>
                                    <dd>{item.diamondCut || "Excellent"}</dd>
                                  </div>
                                  <div className="spec-row">
                                    <dt>Polish</dt>
                                    <dd>{item.diamondPolish || "Excellent"}</dd>
                                  </div>
                                  <div className="spec-row">
                                    <dt>Symmetry</dt>
                                    <dd>{item.diamondSymmetry || "Excellent"}</dd>
                                  </div>
                                  <div className="spec-row">
                                    <dt>Fluorescence</dt>
                                    <dd>{item.diamondFluorescence || "None"}</dd>
                                  </div>
                                  <div className="spec-row">
                                    <dt>Grading Laboratory</dt>
                                    <dd>{item.diamondLab || "GIA"}</dd>
                                  </div>
                                  <div className="spec-row">
                                    <dt>Report Number</dt>
                                    <dd>{item.certNumber?.replace(/GIA\s*/, "") || "2476843210"}</dd>
                                  </div>
                                </dl>

                                <button
                                  type="button"
                                  className="bag-view-gia-btn-06"
                                  onClick={() => setActiveGiaItem(item)}
                                >
                                  VIEW GIA REPORT <ExternalLink size={12} />
                                </button>
                              </div>
                            )}

                            {/* RING SETTING Specifications */}
                            <div className="bag-spec-block-06">
                              <h3 className="bag-spec-heading-06">
                                {isRing ? "RING SETTING" : "PIECE SPECIFICATIONS"}
                              </h3>
                              <dl className="bag-spec-table-06">
                                <div className="spec-row">
                                  <dt>Setting</dt>
                                  <dd>{item.productName || item.name || "The Aurora"}</dd>
                                </div>
                                <div className="spec-row">
                                  <dt>Metal</dt>
                                  <dd>{item.metal || "Platinum"}</dd>
                                </div>
                                <div className="spec-row">
                                  <dt>Band Style</dt>
                                  <dd>Classic (2.0mm)</dd>
                                </div>
                                <div className="spec-row">
                                  <dt>Ring Size</dt>
                                  <dd>{item.size || "L ½"}</dd>
                                </div>
                                <div className="spec-row">
                                  <dt>Setting Details</dt>
                                  <dd>6-claw solitaire with hidden halo</dd>
                                </div>
                              </dl>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons Bar */}
                        <div className="bag-actions-bar-06">
                          <button
                            type="button"
                            className="bag-action-btn-06"
                            onClick={() => handleOpenEditModal(item)}
                          >
                            <Edit3 size={14} />
                            <span>
                              <strong>EDIT RING</strong>
                              <small>Change setting or size</small>
                            </span>
                          </button>

                          <Link
                            href="/diamonds/search"
                            className="bag-action-btn-06"
                          >
                            <Diamond size={14} />
                            <span>
                              <strong>CHANGE DIAMOND</strong>
                              <small>Select a different diamond</small>
                            </span>
                          </Link>

                          <button
                            type="button"
                            className="bag-action-btn-06 remove"
                            onClick={() => handleRemoveItem(item.key)}
                          >
                            <Trash2 size={14} />
                            <span>
                              <strong>REMOVE</strong>
                              <small>Remove from bag</small>
                            </span>
                          </button>
                        </div>

                        {/* AVAILABILITY CONFIRMED Box */}
                        <div className="bag-availability-box-06">
                          <span className="avail-check-icon">
                            <Check size={16} />
                          </span>
                          <div className="avail-text">
                            <h4>AVAILABILITY CONFIRMED</h4>
                            <p>
                              Your diamond is currently available. Availability and price will be revalidated before payment.
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* RIGHT COLUMN: Order Summary & Concierge */}
                <aside className="bag-summary-col-06">
                  <div className="bag-summary-card-06">
                    <h3 className="bag-summary-title-06">ORDER SUMMARY</h3>

                    <div className="bag-summary-lines-06">
                      {bagItems.map((item, idx) => (
                        <div key={idx} className="summary-item-group">
                          <div className="summary-line">
                            <span>
                              Ring Setting ({item.productName || item.name})
                            </span>
                            <strong>
                              {money(item.settingPrice || (item.price > 10000 ? 2950 : item.price))}
                            </strong>
                          </div>
                          {item.diamondPrice ? (
                            <div className="summary-line">
                              <span>
                                Centre Diamond ({item.diamondCarat || "3.01"} ct {item.diamondColor || "D"} {item.diamondClarity || "VVS1"})
                              </span>
                              <strong>{money(item.diamondPrice)}</strong>
                            </div>
                          ) : null}
                          {item.additionalOptionsPrice ? (
                            <div className="summary-line">
                              <span className="with-info">
                                Additional Options
                                <button
                                  type="button"
                                  className="info-btn"
                                  onClick={() => setShowOptionsInfoModal(true)}
                                  aria-label="Additional options details"
                                >
                                  <Info size={12} />
                                </button>
                              </span>
                              <strong>{money(item.additionalOptionsPrice)}</strong>
                            </div>
                          ) : null}
                        </div>
                      ))}

                      {appliedDiscount && (
                        <div className="summary-line discount">
                          <span>{discountLabel}</span>
                          <strong>-{money(discountAmount)}</strong>
                        </div>
                      )}

                      <div className="summary-divider" />

                      <div className="summary-line subtotal">
                        <span>Subtotal</span>
                        <strong>{money(subtotal)}</strong>
                      </div>

                      <div className="summary-line delivery">
                        <span className="with-info">
                          Delivery / Collection
                          <button
                            type="button"
                            className="info-btn"
                            title="Complimentary fully insured global courier or Hatton Garden collection"
                            aria-label="Delivery information"
                          >
                            <Info size={12} />
                          </button>
                        </span>
                        <em>To be confirmed</em>
                      </div>

                      <div className="summary-divider" />

                      <div className="summary-line grand-total">
                        <span>TOTAL <small>(including VAT where applicable)</small></span>
                        <strong className="total-amount">{money(total)}</strong>
                      </div>
                    </div>

                    {/* PRICE TRANSPARENCY Note */}
                    <div className="bag-price-transparency-06">
                      <Tag size={15} className="transparency-icon" />
                      <div className="transparency-text">
                        <h5>PRICE TRANSPARENCY</h5>
                        <p>
                          Final delivery or collection costs, applicable taxes and any charges will be confirmed during checkout.
                        </p>
                      </div>
                    </div>

                    {/* HAVE A PRIVATE CODE Accordion */}
                    <div className="bag-private-code-accordion-06">
                      <button
                        type="button"
                        className="accordion-trigger-06"
                        onClick={() => setIsPrivateCodeOpen(!isPrivateCodeOpen)}
                        aria-expanded={isPrivateCodeOpen}
                      >
                        <span>HAVE A PRIVATE CODE?</span>
                        {isPrivateCodeOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      {isPrivateCodeOpen && (
                        <form onSubmit={handleApplyCode} className="private-code-form-06">
                          <div className="code-input-group">
                            <input
                              type="text"
                              placeholder="Enter private code"
                              value={privateCode}
                              onChange={(e) => setPrivateCode(e.target.value)}
                              className="code-input"
                            />
                            <button type="submit" className="code-apply-btn">
                              APPLY
                            </button>
                          </div>
                          <span className="code-hint">Try VIP code: <code>MAH2026</code></span>
                        </form>
                      )}
                    </div>

                    {/* NEED HELP BEFORE CHECKOUT Box */}
                    <div className="bag-help-box-06">
                      <div className="help-box-header">
                        <User size={18} className="help-avatar" />
                        <div className="help-box-text">
                          <h4>NEED HELP BEFORE CHECKOUT?</h4>
                          <p>
                            Our advisors are here should you wish to discuss your selection or bespoke requirements.
                          </p>
                        </div>
                      </div>

                      <div className="help-box-ctas">
                        <Link href="/expert" className="button button-outline-help">
                          <Sparkles size={13} /> SPEAK TO AN MAH EXPERT
                        </Link>
                        <Link href="/appointments" className="button button-outline-help">
                          <Calendar size={13} /> BOOK AN APPOINTMENT
                        </Link>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>

              {/* 3. 3-Column Preview & Trust Strip (Appears ONLY when bag is populated) */}
              <div className="bag-preview-strip-06">
                {/* Column 1: PRODUCTION & LEAD TIME */}
                <div className="preview-card-06">
                  <div className="preview-card-header">
                    <Calendar size={18} className="preview-icon" />
                    <div>
                      <h4>PRODUCTION & LEAD TIME</h4>
                      <p className="lead-subtitle">This piece is Made to Order.</p>
                    </div>
                  </div>
                  <div className="preview-metrics">
                    <div className="metric-row">
                      <span>Estimated completion</span>
                      <strong>4 – 6 weeks</strong>
                    </div>
                    <div className="metric-row">
                      <span>Estimated dispatch / collection</span>
                      <strong>5 – 7 weeks</strong>
                    </div>
                  </div>
                  <p className="preview-footnote">
                    We will keep you updated at every stage of your piece’s creation.
                  </p>
                </div>

                {/* Column 2: DELIVERY OR COLLECTION (Preview) */}
                <div className="preview-card-06">
                  <div className="preview-card-header">
                    <Truck size={18} className="preview-icon" />
                    <div>
                      <h4>DELIVERY OR COLLECTION <small>(Preview)</small></h4>
                      <p className="lead-subtitle">Choose your preferred option at checkout.</p>
                    </div>
                  </div>
                  <div className="preview-radios-06">
                    <label className={`preview-radio-label ${deliveryPreview === "delivery" ? "active" : ""}`}>
                      <input
                        type="radio"
                        name="delivery-preview"
                        checked={deliveryPreview === "delivery"}
                        onChange={() => setDeliveryPreview("delivery")}
                      />
                      <div className="radio-content">
                        <strong>Secure Delivery</strong>
                        <small>Fully insured delivery to your chosen address.</small>
                      </div>
                    </label>
                    <label className={`preview-radio-label ${deliveryPreview === "collection" ? "active" : ""}`}>
                      <input
                        type="radio"
                        name="delivery-preview"
                        checked={deliveryPreview === "collection"}
                        onChange={() => setDeliveryPreview("collection")}
                      />
                      <div className="radio-content">
                        <strong>Collect from MAH</strong>
                        <small>Private collection from our Hatton Garden atelier.</small>
                      </div>
                    </label>
                  </div>
                  <p className="preview-footnote">
                    Eligibility and timing will be confirmed at checkout.
                  </p>
                </div>

                {/* Column 3: WHY SHOP WITH MAH */}
                <div className="preview-card-06">
                  <div className="preview-card-header">
                    <ShieldCheck size={18} className="preview-icon" />
                    <div>
                      <h4>WHY SHOP WITH MAH</h4>
                    </div>
                  </div>
                  <ul className="preview-checklist-06">
                    <li>
                      <span className="check-bullet"><Check size={12} /></span>
                      <div>
                        <strong>Independent Diamond Grading</strong>
                        <small>View grading report where available.</small>
                      </div>
                    </li>
                    <li>
                      <span className="check-bullet"><Check size={12} /></span>
                      <div>
                        <strong>Secure &amp; Discreet</strong>
                        <small>Your details and payment are always protected.</small>
                      </div>
                    </li>
                    <li>
                      <span className="check-bullet"><Check size={12} /></span>
                      <div>
                        <strong>Expert Guidance</strong>
                        <small>Our experts are here at every step.</small>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 4. Bottom Action & Sign-in Bar (Appears ONLY when bag is populated) */}
              <div className="bag-bottom-actions-06">
                {/* Left Primary Checkout Action */}
                <div className="checkout-action-box-06">
                  <Link
                    href="/checkout"
                    className="button button-burgundy-checkout facet-oct-sm"
                  >
                    <ShoppingBag size={16} /> CONTINUE TO SECURE CHECKOUT <ArrowRight size={15} />
                  </Link>
                  <p className="checkout-subcopy-06">
                    <Lock size={12} /> You will be able to confirm delivery or collection, billing and payment details in the next step.
                  </p>
                </div>

                {/* Right Sign-in Box */}
                <div className="save-selection-box-06">
                  <div className="save-header">
                    <Heart size={16} className="heart-icon" />
                    <div>
                      <h4>SIGN IN TO SAVE YOUR SELECTION</h4>
                      <p>Save your selection and retrieve it later from any device.</p>
                    </div>
                  </div>
                  <div className="save-ctas">
                    <Link href="/account" className="button button-dark-save facet-oct-sm">
                      <User size={14} /> SIGN IN / CREATE ACCOUNT
                    </Link>
                    <Link href="/checkout" className="guest-link">
                      Continue as Guest
                    </Link>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Wireframe ALTERNATIVE STATE — EMPTY BAG (Renders strictly as standalone alternative state) */
            <div className="bag-empty-card-06">
              <div className="empty-icon-wrap">
                <ShoppingBag size={38} strokeWidth={1.2} />
              </div>
              <h3>Your selection is currently empty.</h3>
              <p>Explore our collections and find something extraordinary.</p>
              <div className="empty-explore-btns">
                <Link href="/engagement-rings" className="button button-light facet-oct-sm">
                  ENGAGEMENT RINGS
                </Link>
                <Link href="/diamonds" className="button button-light facet-oct-sm">
                  DIAMONDS
                </Link>
                <Link href="/jewellery" className="button button-light facet-oct-sm">
                  JEWELLERY
                </Link>
              </div>

              <div className="empty-seed-demo-wrap">
                <button
                  type="button"
                  onClick={handleSeedDemo}
                  className="empty-seed-demo-btn"
                >
                  <Sparkles size={12} /> View Signatures Demonstration Piece (The Aurora)
                </button>
              </div>
            </div>
          )}

          {/* 5. Footer Micro-Reassurance */}
          <div className="bag-footer-reassurance-06">
            <p>
              <Lock size={12} /> Secure SSL encrypted checkout · We respect your privacy · Prices are subject to change until payment is confirmed.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MODALS: GIA Certificate Report & Quick Ring Configuration Edit            */}
      {/* ========================================================================= */}

      {/* GIA Certificate Report Modal */}
      {activeGiaItem && (
        <div className="modal-backdrop-06" onClick={() => setActiveGiaItem(null)}>
          <div className="modal-dossier-06" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn-06"
              onClick={() => setActiveGiaItem(null)}
              aria-label="Close GIA Report"
            >
              <X size={18} />
            </button>

            <div className="gia-dossier-header">
              <div className="gia-badge-seal">
                <Award size={24} />
                <span>GIA REPORT VERIFICATION</span>
              </div>
              <span className="gia-ref-pill">Report #{activeGiaItem.certNumber || "2476843210"}</span>
            </div>

            <div className="gia-dossier-body">
              <div className="gia-matrix-grid">
                <div className="gia-spec-item">
                  <span className="lbl">Carat Weight</span>
                  <strong className="val">{activeGiaItem.diamondCarat || "3.01"} ct</strong>
                </div>
                <div className="gia-spec-item">
                  <span className="lbl">Colour Grade</span>
                  <strong className="val">{activeGiaItem.diamondColor || "D"} (Exceptional White +)</strong>
                </div>
                <div className="gia-spec-item">
                  <span className="lbl">Clarity Grade</span>
                  <strong className="val">{activeGiaItem.diamondClarity || "VVS1"} (Very Very Slightly Included)</strong>
                </div>
                <div className="gia-spec-item">
                  <span className="lbl">Cut Grade</span>
                  <strong className="val">{activeGiaItem.diamondCut || "Excellent"}</strong>
                </div>
                <div className="gia-spec-item">
                  <span className="lbl">Polish</span>
                  <strong className="val">{activeGiaItem.diamondPolish || "Excellent"}</strong>
                </div>
                <div className="gia-spec-item">
                  <span className="lbl">Symmetry</span>
                  <strong className="val">{activeGiaItem.diamondSymmetry || "Excellent"}</strong>
                </div>
                <div className="gia-spec-item">
                  <span className="lbl">Fluorescence</span>
                  <strong className="val">{activeGiaItem.diamondFluorescence || "None (Inert)"}</strong>
                </div>
                <div className="gia-spec-item">
                  <span className="lbl">Laser Inscription</span>
                  <strong className="val">GIA 2476843210 · MAH-AUTHENTIC</strong>
                </div>
              </div>

              <div className="gia-security-footer">
                <ShieldCheck size={18} className="shield-icon" />
                <p>
                  Graded and sealed by the Gemological Institute of America. Digital verification active on the GIA Global Registry.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Edit Ring Modal */}
      {activeEditItem && (
        <div className="modal-backdrop-06" onClick={() => setActiveEditItem(null)}>
          <div className="modal-dossier-06 edit-ring" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn-06"
              onClick={() => setActiveEditItem(null)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="edit-modal-header">
              <Edit3 size={20} />
              <div>
                <h3>Edit Ring Configuration</h3>
                <p>Modify metal alloy or finger size for {activeEditItem.name || "The Aurora"}</p>
              </div>
            </div>

            <div className="edit-modal-body">
              <div className="edit-field-group">
                <label className="edit-field-lbl">Precious Metal</label>
                <div className="metal-options-row">
                  {["Platinum", "18k Yellow Gold", "18k Rose Gold", "18k White Gold"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`metal-choice-btn ${editMetal === m ? "selected" : ""}`}
                      onClick={() => setEditMetal(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="edit-field-group">
                <div className="field-lbl-split">
                  <label className="edit-field-lbl">Ring Size (UK Scale)</label>
                  <button
                    type="button"
                    className="size-guide-link"
                    onClick={() => setShowSizeGuide(true)}
                  >
                    <Ruler size={12} /> Size Guide
                  </button>
                </div>
                <select
                  value={editSize}
                  onChange={(e) => setEditSize(e.target.value)}
                  className="size-select-06"
                >
                  {["I", "J", "K", "L", "L ½", "M", "N", "O", "P", "Q", "R", "S"].map((s) => (
                    <option key={s} value={s}>
                      Size {s} (UK)
                    </option>
                  ))}
                </select>
              </div>

              <div className="edit-modal-ctas">
                <button
                  type="button"
                  className="button button-dark button-wide facet-oct-sm"
                  onClick={handleSaveEditedRing}
                >
                  Save Ring Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Options Info Modal */}
      {showOptionsInfoModal && (
        <div className="modal-backdrop-06" onClick={() => setShowOptionsInfoModal(false)}>
          <div className="modal-dossier-06 options-info" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn-06"
              onClick={() => setShowOptionsInfoModal(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <h3 className="options-title">Additional Options</h3>
            <p className="options-desc">
              Your piece includes the following bespoke artisanal embellishments:
            </p>
            <ul className="options-list">
              <li>
                <strong>Hidden Pavé Halo</strong> (£350) — A row of micro-pavé round brilliant diamonds set beneath the centre basket.
              </li>
              <li>
                <strong>Atelier Hand-Engraving</strong> (£100) — Bespoke script engraving inside the inner shank, assayed by Goldsmiths’ Hall London.
              </li>
            </ul>
            <button
              type="button"
              className="button button-dark button-wide facet-oct-sm"
              onClick={() => setShowOptionsInfoModal(false)}
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* Ring Size Guide Modal */}
      <RingSizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        initialSize={editSize}
        onSelectSize={(s) => setEditSize(s)}
      />
    </main>
  );
}

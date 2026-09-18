"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  FileText,
  Heart,
  HelpCircle,
  Maximize2,
  MessageCircle,
  RotateCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { getDiamond, money, type Diamond } from "@/lib/demo-data";
import { useDemoStore } from "@/components/demo-store-provider";
import { DiamondLoupe } from "@/components/visualizer/diamond-loupe";
import type { RoutePage } from "@/lib/site-data";

interface DiamondDetailViewProps {
  diamondId?: string;
  page?: RoutePage;
  query?: Record<string, string | string[] | undefined>;
}

export function DiamondDetailView({ diamondId, page, query }: DiamondDetailViewProps) {
  const store = useDemoStore();
  const router = useRouter();

  // Selected Diamond
  const diamond = useMemo(() => {
    return getDiamond(diamondId);
  }, [diamondId]);

  // Wishlist state
  const isSavedInWishlist = store.wishlist.includes(diamond.id);

  // Gallery & 360 Mode
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [mediaMode, setMediaMode] = useState<"image" | "360">("image");
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [showLoupeModal, setShowLoupeModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"details" | "report" | "about">("details");

  // Shape image helper
  const shapeImageMap: Record<string, string> = {
    Round: "/images/shapes/round.png",
    Oval: "/images/shapes/oval.png",
    Emerald: "/images/shapes/emerald.png",
    Pear: "/images/shapes/pear.png",
    Cushion: "/images/shapes/cushion.png",
    Princess: "/images/shapes/princess.png",
    Radiant: "/images/shapes/radiant.png",
    Asscher: "/images/shapes/asscher.png",
    Marquise: "/images/shapes/marquise.png",
    Heart: "/images/shapes/heart.png",
  };

  const primaryShapeImg = shapeImageMap[diamond.shape] || "/images/shapes/round.png";

  const mediaViews = [
    { label: "Top Table", image: primaryShapeImg },
    { label: "Side Profile", image: "/images/journal-diamonds.jpg" },
    { label: "3/4 Angle", image: "/images/mah-hero-concept.png" },
    { label: "Culet View", image: primaryShapeImg },
  ];

  // Calculated Dimensions based on Carat
  const calculatedMeasurements = useMemo(() => {
    const scale = Math.sqrt(diamond.carat);
    if (diamond.shape === "Round") {
      const d = (6.45 * scale).toFixed(2);
      const depthMm = (3.95 * scale).toFixed(2);
      return `${d} – ${(Number(d) + 0.04).toFixed(2)} × ${depthMm} mm`;
    }
    const l = (7.8 * scale).toFixed(2);
    const w = (5.6 * scale).toFixed(2);
    const depthMm = (3.5 * scale).toFixed(2);
    return `${l} × ${w} × ${depthMm} mm`;
  }, [diamond]);

  // Wishlist handler
  const handleWishlistToggle = () => {
    store.toggleWishlist(diamond.id);
    if (!isSavedInWishlist) {
      toast.success(`${diamond.carat}ct ${diamond.shape} diamond added to wishlist.`);
    } else {
      toast.info(`${diamond.carat}ct ${diamond.shape} diamond removed from wishlist.`);
    }
  };

  // Choose This Diamond (Diamond-First Ring Journey)
  const handleChooseThisDiamond = () => {
    store.updateRing({ diamondId: diamond.id });
    toast.success("Diamond Selected for Engagement Ring", {
      description: `${diamond.carat}ct ${diamond.shape} (${diamond.certificate})`,
    });
    router.push(`/engagement-rings?diamondId=${diamond.id}`);
  };

  // Add Loose Diamond to Bag
  const handleAddLooseDiamondToBag = () => {
    store.addDiamond(diamond);

    toast.success("Loose Diamond Added to Bag", {
      description: `${diamond.carat.toFixed(2)}ct ${diamond.shape} Diamond`,
    });
    router.push("/bag");
  };

  // 360 Mouse Dragging
  const isDragging = useRef(false);
  const startX = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const delta = e.clientX - startX.current;
    setRotationAngle((prev) => (prev + delta * 0.75) % 360);
    startX.current = e.clientX;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <main id="main-content" className="diamond-detail-page-11c">
      {/* 1. TOP BREADCRUMB & BACK ACTION */}
      <div className="d-pdp-top-bar">
        <div className="shell d-pdp-top-inner">
          <nav aria-label="Breadcrumb" className="d-breadcrumbs">
            <Link href="/">Home</Link>
            <span className="crumb-sep">/</span>
            <Link href="/diamonds/search">Diamonds</Link>
            <span className="crumb-sep">/</span>
            <span className="crumb-current">
              {diamond.shape} Brilliant {diamond.carat.toFixed(2)} ct {diamond.colour} {diamond.clarity} {diamond.cut}
            </span>
          </nav>

          <Link href="/diamonds/search" className="d-back-link">
            &lt; Back to Search Results
          </Link>
        </div>
      </div>

      {/* 2. MAIN DIAMOND DETAIL GRID (STAGE + BUYBOX) */}
      <section className="shell d-pdp-main-grid" aria-labelledby="diamond-title-11c">
        {/* LEFT COLUMN: INTERACTIVE 360° STAGE */}
        <div className="d-stage-column">
          <div className="d-stage-box facet-oct-sm">
            {/* Top 360 indicator badge */}
            <div className="d-360-top-indicator">
              <RotateCw size={14} />
              <span>360°</span>
            </div>

            {/* Prev / Next arrows */}
            <button
              type="button"
              className="d-stage-arrow d-stage-prev"
              onClick={() => {
                setMediaMode("image");
                setActiveMediaIndex((prev) => (prev > 0 ? prev - 1 : mediaViews.length - 1));
              }}
              aria-label="Previous view"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              className="d-stage-arrow d-stage-next"
              onClick={() => {
                setMediaMode("image");
                setActiveMediaIndex((prev) => (prev < mediaViews.length - 1 ? prev + 1 : 0));
              }}
              aria-label="Next view"
            >
              <ChevronRight size={22} />
            </button>

            {/* Main Stage Viewport */}
            <div
              className="d-stage-viewport"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div
                className="d-diamond-render-wrap"
                style={{
                  transform:
                    mediaMode === "360"
                      ? `rotateY(${rotationAngle}deg) rotateZ(${rotationAngle * 0.1}deg)`
                      : "none",
                }}
              >
                <Image
                  src={mediaViews[activeMediaIndex].image}
                  alt={`${diamond.carat}ct ${diamond.shape} Diamond`}
                  fill
                  priority
                  className="d-stage-diamond-img"
                />
              </div>

              {mediaMode === "360" && (
                <div className="d-drag-hint">
                  <span>Drag horizontally to rotate 360° optical scintillation</span>
                </div>
              )}
            </div>
          </div>

          {/* Vertical/Stacked Thumbnail Strip */}
          <div className="d-thumbs-strip" role="tablist" aria-label="Diamond views">
            {mediaViews.map((v, idx) => (
              <button
                key={`view-${idx}`}
                type="button"
                role="tab"
                aria-selected={mediaMode === "image" && activeMediaIndex === idx}
                className={`d-thumb-btn ${mediaMode === "image" && activeMediaIndex === idx ? "active" : ""}`}
                onClick={() => {
                  setMediaMode("image");
                  setActiveMediaIndex(idx);
                }}
              >
                <div className="d-thumb-inner">
                  <Image src={v.image} alt={v.label} fill sizes="72px" className="object-contain p-2" />
                </div>
              </button>
            ))}

            {/* 360 Control Button */}
            <button
              type="button"
              role="tab"
              aria-selected={mediaMode === "360"}
              className={`d-thumb-btn d-thumb-360 ${mediaMode === "360" ? "active" : ""}`}
              onClick={() => setMediaMode("360")}
              title="Interactive 360 View"
            >
              <RotateCw size={18} />
              <span>360°</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: SPECIFICATION & ACTIONS BUYBOX */}
        <aside className="d-buybox-column">
          <div className="d-buybox-card">
            {/* Top Badges & Wishlist */}
            <div className="d-buybox-top-row">
              <div className="d-badges-group">
                <span className="d-badge-origin facet-oct-sm">
                  {diamond.type.toUpperCase()} DIAMOND
                </span>
                <span className="d-badge-cert facet-oct-sm">
                  {diamond.certificate} CERTIFIED
                </span>
              </div>

              <button
                type="button"
                onClick={handleWishlistToggle}
                aria-label={isSavedInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                className={`d-wishlist-heart-btn ${isSavedInWishlist ? "active" : ""}`}
              >
                <Heart
                  size={18}
                  fill={isSavedInWishlist ? "var(--midnight)" : "none"}
                  strokeWidth={1.3}
                />
              </button>
            </div>

            {/* Title & Subtitle */}
            <h1 id="diamond-title-11c" className="d-product-title">
              {diamond.shape.toUpperCase()} BRILLIANT
            </h1>
            <p className="d-product-sub">
              {diamond.carat.toFixed(2)} ct &nbsp;|&nbsp; {diamond.colour} Colour &nbsp;|&nbsp; {diamond.clarity} Clarity &nbsp;|&nbsp; {diamond.cut} Cut
            </p>

            {/* 2-Column Key/Value Specification Table */}
            <div className="d-spec-table">
              <div className="d-spec-row">
                <span className="d-spec-key">SHAPE</span>
                <span className="d-spec-val">{diamond.shape} Brilliant</span>
              </div>
              <div className="d-spec-row">
                <span className="d-spec-key">CARAT WEIGHT</span>
                <span className="d-spec-val">{diamond.carat.toFixed(2)} ct</span>
              </div>
              <div className="d-spec-row">
                <span className="d-spec-key">COLOUR</span>
                <span className="d-spec-val">{diamond.colour}</span>
              </div>
              <div className="d-spec-row">
                <span className="d-spec-key">CLARITY</span>
                <span className="d-spec-val">{diamond.clarity}</span>
              </div>
              <div className="d-spec-row">
                <span className="d-spec-key">CUT</span>
                <span className="d-spec-val">{diamond.cut}</span>
              </div>
              <div className="d-spec-row">
                <span className="d-spec-key">GRADING LABORATORY</span>
                <span className="d-spec-val">{diamond.certificate}</span>
              </div>
              <div className="d-spec-row">
                <span className="d-spec-key">STOCK NUMBER</span>
                <span className="d-spec-val">MAH-{diamond.id}</span>
              </div>
            </div>

            {/* Price Display */}
            <div className="d-price-block">
              <span className="d-price-amount">{money(diamond.price)}</span>
            </div>

            {/* ACTION BUTTONS STACK */}
            <div className="d-actions-stack">
              {/* PRIMARY: CHOOSE THIS DIAMOND (FOR RING) */}
              <button
                type="button"
                onClick={handleChooseThisDiamond}
                className="d-btn-choose-diamond facet-oct-sm"
              >
                <div className="d-btn-choose-content">
                  <div className="d-btn-choose-title">
                    <ShoppingBag size={17} />
                    <span>CHOOSE THIS DIAMOND &rarr;</span>
                  </div>
                  <small className="d-btn-choose-sub">View compatible ring settings</small>
                </div>
              </button>

              {/* SECONDARY: BUY AS A LOOSE DIAMOND */}
              <button
                type="button"
                onClick={handleAddLooseDiamondToBag}
                className="d-btn-loose-bag facet-oct-sm"
              >
                <ShoppingBag size={15} />
                <span>ADD LOOSE DIAMOND TO BAG</span>
              </button>

              {/* ACTION PAIR: WISHLIST + EXPERT */}
              <div className="d-action-pair-row">
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  className={`d-btn-pair-item facet-oct-sm ${isSavedInWishlist ? "active" : ""}`}
                >
                  <Heart size={14} fill={isSavedInWishlist ? "currentColor" : "none"} />
                  <span>{isSavedInWishlist ? "SAVED IN WISHLIST" : "ADD TO WISHLIST"}</span>
                </button>
                <Link href="/expert" className="d-btn-pair-item facet-oct-sm">
                  <MessageCircle size={14} />
                  <span>SPEAK TO AN MAH EXPERT</span>
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </section>

      {/* 3. TECHNICAL SPECIFICATIONS & GRADING REPORT SECTION */}
      <section className="shell d-technical-section">
        <div className="d-technical-split-grid">
          {/* Left Column: 3 Tabs (Diamond Details, Grading Report, About) */}
          <div className="d-tech-left-box facet-oct-sm">
            <div className="d-tech-tabs-header" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "details"}
                className={`d-tech-tab-btn ${activeTab === "details" ? "active" : ""}`}
                onClick={() => setActiveTab("details")}
              >
                DIAMOND DETAILS
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "report"}
                className={`d-tech-tab-btn ${activeTab === "report" ? "active" : ""}`}
                onClick={() => setActiveTab("report")}
              >
                GRADING REPORT
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "about"}
                className={`d-tech-tab-btn ${activeTab === "about" ? "active" : ""}`}
                onClick={() => setActiveTab("about")}
              >
                ABOUT THIS DIAMOND
              </button>
            </div>

            <div className="d-tech-tab-body">
              {activeTab === "details" && (
                <div className="d-tech-grid-2col">
                  <div className="d-tech-col">
                    <div className="d-tech-row">
                      <span className="d-tech-label">Measurements</span>
                      <span className="d-tech-val">{calculatedMeasurements}</span>
                    </div>
                    <div className="d-tech-row">
                      <span className="d-tech-label">Carat Weight</span>
                      <span className="d-tech-val">{diamond.carat.toFixed(2)} ct</span>
                    </div>
                    <div className="d-tech-row">
                      <span className="d-tech-label">Depth</span>
                      <span className="d-tech-val">60.9%</span>
                    </div>
                    <div className="d-tech-row">
                      <span className="d-tech-label">Table</span>
                      <span className="d-tech-val">57.0%</span>
                    </div>
                    <div className="d-tech-row">
                      <span className="d-tech-label">Crown Angle</span>
                      <span className="d-tech-val">34.5°</span>
                    </div>
                    <div className="d-tech-row">
                      <span className="d-tech-label">Pavilion Angle</span>
                      <span className="d-tech-val">40.8°</span>
                    </div>
                  </div>

                  <div className="d-tech-col">
                    <div className="d-tech-row">
                      <span className="d-tech-label">Girdle</span>
                      <span className="d-tech-val">Medium to Slightly Thick</span>
                    </div>
                    <div className="d-tech-row">
                      <span className="d-tech-label">Culet</span>
                      <span className="d-tech-val">None</span>
                    </div>
                    <div className="d-tech-row">
                      <span className="d-tech-label">Polish</span>
                      <span className="d-tech-val">Excellent</span>
                    </div>
                    <div className="d-tech-row">
                      <span className="d-tech-label">Symmetry</span>
                      <span className="d-tech-val">Excellent</span>
                    </div>
                    <div className="d-tech-row">
                      <span className="d-tech-label">Fluorescence</span>
                      <span className="d-tech-val">None</span>
                    </div>
                    <div className="d-tech-row">
                      <span className="d-tech-label">L/W Ratio</span>
                      <span className="d-tech-val">1.00</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "report" && (
                <div className="d-tech-report-pane">
                  <p className="d-report-intro">
                    This diamond is independently verified and sealed under strict laboratory standards by {diamond.certificate}.
                  </p>
                  <ul className="d-report-list">
                    <li><strong>Laboratory:</strong> {diamond.certificate} (Gemological Institute)</li>
                    <li><strong>Report Number:</strong> MAH-{diamond.id.replace("D-", "2026-")}</li>
                    <li><strong>Inscription:</strong> Micro-laser inscribed on diamond girdle</li>
                  </ul>
                  <button
                    type="button"
                    onClick={() => setShowLoupeModal(true)}
                    className="button button-outline-dark facet-oct-sm mt-3"
                  >
                    <Search size={14} /> Open 10× Precision Clarity Loupe
                  </button>
                </div>
              )}

              {activeTab === "about" && (
                <div className="d-tech-about-pane">
                  <p>
                    Every MAH certified stone is personally inspected in London under 10× optical stereoscopic magnification for flawless internal fire, scintillation, and structural symmetry.
                  </p>
                  <p>
                    All natural diamonds strictly adhere to the Kimberley Process, while all lab-grown stones are created using renewable solar-powered crystallization reactors.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: GRADING REPORT / CERTIFICATE CARD */}
          <div className="d-cert-card facet-oct-sm">
            <h3 className="d-cert-heading">GRADING REPORT / CERTIFICATE</h3>

            <div className="d-cert-content-row">
              {/* Certificate Miniature */}
              <div className="d-cert-thumb-pane">
                <Image
                  src="/images/brand/gia_igi_badges.png"
                  alt={`${diamond.certificate} Grading Report`}
                  fill
                  sizes="160px"
                  className="object-contain p-2"
                />
              </div>

              {/* Certificate Copy & Action */}
              <div className="d-cert-info-pane">
                <h4 className="d-cert-lab-name">{diamond.certificate}</h4>
                <p className="d-cert-sub">Report available for this diamond.</p>
                <button
                  type="button"
                  onClick={() => setShowCertificateModal(true)}
                  className="button button-dark d-btn-view-report facet-oct-sm"
                >
                  <span>VIEW REPORT</span>
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "NEED GUIDANCE?" CONCIERGE BANNER */}
      <section className="shell d-guidance-section">
        <div className="d-guidance-banner facet-oct-sm">
          <div className="d-guidance-left">
            <div className="d-guidance-avatar">
              <User size={20} />
            </div>
            <div className="d-guidance-text">
              <span className="d-guidance-title">NEED GUIDANCE?</span>
              <p className="d-guidance-sub">Speak to an MAH Expert for personalised advice.</p>
            </div>
          </div>

          <Link href="/expert" className="d-guidance-cta">
            <span>SPEAK TO AN MAH EXPERT</span>
            <span className="cta-arrow">&rarr;</span>
          </Link>
        </div>
      </section>

      {/* 5. CERTIFICATE MODAL */}
      {showCertificateModal && (
        <div className="d-modal-backdrop" onClick={() => setShowCertificateModal(false)}>
          <div className="d-cert-modal facet-oct" onClick={(e) => e.stopPropagation()}>
            <div className="d-modal-header">
              <h3>{diamond.certificate} Official Diamond Dossier</h3>
              <button
                type="button"
                onClick={() => setShowCertificateModal(false)}
                className="d-modal-close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="d-modal-body">
              <div className="d-modal-cert-image">
                <Image
                  src="/images/brand/gia_igi_badges.png"
                  alt="Official Grading Dossier"
                  fill
                  sizes="400px"
                  className="object-contain"
                />
              </div>
              <div className="d-modal-cert-details">
                <p><strong>Certificate Authority:</strong> {diamond.certificate}</p>
                <p><strong>Stone Reference:</strong> MAH-{diamond.id}</p>
                <p><strong>Carat Weight:</strong> {diamond.carat.toFixed(2)} ct</p>
                <p><strong>Colour Grade:</strong> {diamond.colour}</p>
                <p><strong>Clarity Grade:</strong> {diamond.clarity}</p>
                <p><strong>Cut Grade:</strong> {diamond.cut}</p>
                <p><strong>Polish / Symmetry:</strong> Excellent / Excellent</p>
                <p><strong>Fluorescence:</strong> None</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. 10X LOUPE MODAL */}
      {showLoupeModal && (
        <div className="d-modal-backdrop" onClick={() => setShowLoupeModal(false)}>
          <div className="d-loupe-modal facet-oct" onClick={(e) => e.stopPropagation()}>
            <div className="d-modal-header">
              <h3>10× Optical Precision Loupe Inspection</h3>
              <button
                type="button"
                onClick={() => setShowLoupeModal(false)}
                className="d-modal-close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="d-modal-body">
              <DiamondLoupe diamond={diamond} onClose={() => setShowLoupeModal(false)} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Diamond as DiamondIcon,
  Eye,
  Heart,
  HelpCircle,
  Maximize2,
  Phone,
  Play,
  RotateCcw,
  RotateCw,
  Ruler,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Award,
  Truck,
  Clock,
  MessageSquare,
  X,
} from "lucide-react";
import { products, diamonds, getProduct, getDiamond, type Product, type Diamond } from "@/lib/demo-data";
import { useDemoStore } from "@/components/demo-store-provider";
import type { RoutePage } from "@/lib/site-data";
import { RingSizeGuideModal } from "@/components/ring-size-guide-modal";
import { toast } from "sonner";

interface EngagementRingConfiguratorViewProps {
  page?: RoutePage;
  query?: Record<string, string | string[] | undefined>;
}

const BAND_STYLES = [
  { id: "Classic (2.0mm)", label: "Classic", sub: "(2.0mm)", surcharge: 0, profilePath: "M2,8 C6,2 18,2 22,8 L22,12 C18,16 6,16 2,12 Z" },
  { id: "Comfort Fit (2.2mm)", label: "Comfort Fit", sub: "(2.2mm)", surcharge: 0, profilePath: "M2,7 C6,1 18,1 22,7 L22,13 C18,17 6,17 2,13 Z" },
  { id: "D-Shape (2.2mm)", label: "D-Shape", sub: "(2.2mm)", surcharge: 0, profilePath: "M2,9 C6,2 18,2 22,9 L22,13 L2,13 Z" },
  { id: "Tapered", label: "Tapered", sub: "(2.0–1.5mm)", surcharge: 0, profilePath: "M4,8 C7,3 17,3 20,8 L18,12 C15,15 9,15 6,12 Z" },
  { id: "Knife Edge", label: "Knife Edge", sub: "Architectural", surcharge: 0, profilePath: "M2,10 L12,2 L22,10 L12,16 Z" },
  { id: "Pavé (+£350)", label: "Pavé", sub: "(+£350)", surcharge: 350, profilePath: "M2,8 C6,2 18,2 22,8 L22,12 C18,16 6,16 2,12 Z", hasDiamonds: true },
];

const METALS_LIST = [
  { label: "Platinum", code: "Platinum", color: "#E5E7EB", border: "#CBD5E1" },
  { label: "18k White Gold", code: "18k White Gold", color: "#F1F5F9", border: "#E2E8F0" },
  { label: "18k Yellow Gold", code: "18k Yellow Gold", color: "#FDE047", border: "#EAB308" },
  { label: "18k Rose Gold", code: "18k Rose Gold", color: "#FBCFE8", border: "#F472B6" },
];

const UK_RING_SIZES = [
  "G", "H", "I", "J", "K", "L", "L 1/2", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "Not Sure (Complimentary Sizer)"
];

const SHAPE_CONFIG_LIST = [
  { id: "Round", label: "Round", icon: "/images/shapes/round.png" },
  { id: "Oval", label: "Oval", icon: "/images/shapes/oval.png" },
  { id: "Cushion", label: "Cushion", icon: "/images/shapes/cushion.png" },
  { id: "Princess", label: "Princess", icon: "/images/shapes/princess.png" },
  { id: "Emerald", label: "Emerald", icon: "/images/shapes/emerald.png" },
  { id: "Pear", label: "Pear", icon: "/images/shapes/pear.png" },
  { id: "Marquise", label: "Marquise", icon: "/images/shapes/marquise.png" },
  { id: "Radiant", label: "Radiant", icon: "/images/shapes/radiant.png" },
  { id: "Asscher", label: "Asscher", icon: "/images/shapes/asscher.png" },
];

export function EngagementRingConfiguratorView({ page, query }: EngagementRingConfiguratorViewProps) {
  const store = useDemoStore();
  const router = useRouter();

  // 1. Resolve Product / Setting from query or store
  const requestedId = typeof query?.id === "string" ? query.id : typeof query?.setting === "string" ? query.setting : store.ring.settingId || "ER-000";
  const product = useMemo(() => {
    return products.find((p) => p.id === requestedId) || getProduct("ER-000");
  }, [requestedId]);

  // 2. Resolve Selected Diamond (if returned from diamond journey)
  const requestedDiamondId = typeof query?.diamondId === "string" ? query.diamondId : store.ring.diamondId;
  const selectedDiamond: Diamond | null = useMemo(() => {
    if (!requestedDiamondId) return null;
    return diamonds.find((d) => d.id === requestedDiamondId) || null;
  }, [requestedDiamondId]);

  // 3. Configurator Form State
  const initialMetal = typeof query?.metal === "string" ? query.metal : store.ring.metal || product.metal;
  const initialSize = typeof query?.size === "string" ? query.size : store.ring.size || "L 1/2";
  const initialShape = typeof query?.shape === "string" ? query.shape : store.ring.diamondShape || product.compatibleShapes?.[0] || "Round";
  const initialBand = typeof query?.band === "string" ? query.band : store.ring.bandStyle || "Classic (2.0mm)";
  const initialType = (query?.type === "Lab-grown" || store.ring.diamondType === "Lab-grown") ? "Lab-grown" : "Natural";

  const [selectedShape, setSelectedShape] = useState<string>(initialShape);
  const [selectedMetal, setSelectedMetal] = useState<string>(initialMetal);
  const [selectedBandStyle, setSelectedBandStyle] = useState<string>(initialBand);
  const [selectedSize, setSelectedSize] = useState<string>(initialSize);
  const [diamondType, setDiamondType] = useState<"Natural" | "Lab-grown">(initialType);

  // Accordion Step open/close states (Step 1 to 5)
  const [openStep, setOpenStep] = useState<number | null>(selectedDiamond ? null : 1);

  // Active Media Stage
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [spinRotation, setSpinRotation] = useState<number>(0);

  // Modals & Bottom Tabs
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [activeBottomTab, setActiveBottomTab] = useState<"description" | "specifications" | "craftsmanship" | "delivery" | "aftercare">("description");

  // Sync to store on changes
  useEffect(() => {
    store.updateRing({
      settingId: product.id,
      metal: selectedMetal,
      size: selectedSize,
      diamondShape: selectedShape,
      bandStyle: selectedBandStyle,
      bandSurcharge: BAND_STYLES.find((b) => b.id === selectedBandStyle)?.surcharge || 0,
      diamondType: diamondType,
    });
  }, [product.id, selectedMetal, selectedSize, selectedShape, selectedBandStyle, diamondType]);

  // Pricing Calculations
  const bandSurcharge = useMemo(() => {
    return BAND_STYLES.find((b) => b.id === selectedBandStyle)?.surcharge || 0;
  }, [selectedBandStyle]);

  const settingSubtotal = useMemo(() => {
    return product.price + bandSurcharge;
  }, [product.price, bandSurcharge]);

  const completeRingTotal = useMemo(() => {
    if (!selectedDiamond) return null;
    return settingSubtotal + selectedDiamond.price;
  }, [settingSubtotal, selectedDiamond]);

  // Active Preview Image
  const activeImage = useMemo(() => {
    return product.metalImages?.[selectedMetal] || product.image;
  }, [product, selectedMetal]);

  // Media gallery items
  const galleryThumbnails = useMemo(() => {
    const list = product.images && product.images.length > 0 ? product.images : [activeImage];
    return [
      { id: "persp", label: "Perspective", src: list[0] || activeImage },
      { id: "overhead", label: "Overhead", src: list[1] || "/images/mah-hero-concept.png" },
      { id: "profile", label: "Profile", src: list[2] || "/images/styles/solitaire.jpg" },
      { id: "hallmark", label: "Hallmark", src: list[3] || "/images/mah-atelier-concept.png" },
      { id: "video", label: "360 Video", icon: "video" },
      { id: "spin", label: "360 Spin", icon: "spin" },
    ];
  }, [product, activeImage]);

  // Wishlist handler
  const isWishlisted = store.wishlist.includes(product.id);
  const handleToggleWishlist = () => {
    store.toggleWishlist(product.id);
    if (!isWishlisted) {
      toast.success(`${product.name} added to your private Wishlist`);
    } else {
      toast.info(`${product.name} removed from Wishlist`);
    }
  };

  // Share handler
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      toast.success("Configuration link copied to clipboard");
    }
  };

  // Navigate to Choose Diamond
  const handleSelectDiamondClick = () => {
    const params = new URLSearchParams({
      setting: product.id,
      shape: selectedShape,
      type: diamondType,
      metal: selectedMetal,
      band: selectedBandStyle,
      size: selectedSize,
      mode: "ring",
    });
    router.push(`/engagement-rings/diamonds?${params.toString()}`);
  };

  // Add Complete Ring to Bag
  const handleAddToBag = () => {
    if (!selectedDiamond) {
      toast.error("Please select a centre diamond before adding to bag");
      return;
    }
    store.addCompleteRing(product, selectedDiamond, {
      metal: selectedMetal,
      size: selectedSize,
      bandStyle: selectedBandStyle,
      bandSurcharge: bandSurcharge,
      diamondShape: selectedShape,
    });
    toast.success("Complete ring successfully added to your selection");
    router.push("/bag");
  };

  return (
    <main id="main-content" className="er-config-page-05b">
      {/* 1. Breadcrumb & Back Navigation */}
      <nav aria-label="Breadcrumb" className="er-config-nav-strip">
        <div className="shell er-config-nav-flex">
          <ol className="er-config-breadcrumbs">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-hidden="true" className="sep">›</li>
            <li>
              <Link href="/engagement-rings">Engagement Rings</Link>
            </li>
            <li aria-hidden="true" className="sep">›</li>
            <li>
              <Link href={`/engagement-rings?style=${product.style.toLowerCase()}`}>{product.style}</Link>
            </li>
            <li aria-hidden="true" className="sep">›</li>
            <li aria-current="page">{product.name}</li>
          </ol>
          <Link href="/engagement-rings" className="er-config-back-link">
            <ArrowLeft size={13} /> Back to Engagement Rings
          </Link>
        </div>
      </nav>

      {/* 2. Main Configurator Section: 2-Column Split */}
      <section className="er-config-main-section">
        <div className="shell er-config-main-grid">
          {/* Left Column: Media Stage & Step-by-Step Configuration Accordion */}
          <div className="er-config-left-column">
            {/* Top Media & Setting Intro Split */}
            <div className="er-media-and-intro-card facet-oct-sm">
              <div className="er-gallery-stage-split">
                {/* Vertical Thumbnails Strip */}
                <div className="er-vertical-thumb-strip" aria-label="Product Media Angles">
                  {galleryThumbnails.map((thumb, idx) => {
                    const isSelected = activeMediaIndex === idx;
                    if (thumb.icon === "video") {
                      return (
                        <button
                          key={thumb.id}
                          type="button"
                          className={`er-thumb-btn er-thumb-media-btn ${isSelected ? "is-selected" : ""}`}
                          onClick={() => {
                            setActiveMediaIndex(idx);
                            setIsVideoPlaying(true);
                          }}
                          title="Interactive 360 Video"
                        >
                          <Play size={18} className="text-[#0C1B54]" />
                          <span className="er-thumb-media-label">Video</span>
                        </button>
                      );
                    }
                    if (thumb.icon === "spin") {
                      return (
                        <button
                          key={thumb.id}
                          type="button"
                          className={`er-thumb-btn er-thumb-media-btn ${isSelected ? "is-selected" : ""}`}
                          onClick={() => {
                            setActiveMediaIndex(idx);
                            setIsVideoPlaying(false);
                            setSpinRotation((prev) => (prev + 90) % 360);
                          }}
                          title="360 Rotation Spin"
                        >
                          <RotateCw size={18} className="text-[#0C1B54]" />
                          <span className="er-thumb-media-label">360°</span>
                        </button>
                      );
                    }
                    return (
                      <button
                        key={thumb.id}
                        type="button"
                        className={`er-thumb-btn ${isSelected ? "is-selected" : ""}`}
                        onClick={() => {
                          setActiveMediaIndex(idx);
                          setIsVideoPlaying(false);
                        }}
                        title={thumb.label}
                      >
                        <Image
                          src={thumb.src || activeImage}
                          alt={`${product.name} ${thumb.label}`}
                          width={48}
                          height={48}
                          className="object-contain er-thumb-img"
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Large Main Product Stage */}
                <div className="er-main-media-viewer">
                  {isVideoPlaying ? (
                    <div className="er-video-sim-stage">
                      <Image
                        src={activeImage}
                        alt="360 Rotating Ring Simulation"
                        fill
                        className="object-contain animate-pulse"
                      />
                      <div className="er-video-indicator-badge">
                        <Sparkles size={14} /> 360° Ultra-HD Atelier Video Simulation
                      </div>
                    </div>
                  ) : (
                    <div
                      className="er-main-image-wrap"
                      style={{
                        transform: `rotate(${spinRotation}deg)`,
                        transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <Image
                        src={galleryThumbnails[activeMediaIndex]?.src || activeImage}
                        alt={`${product.name} - ${selectedMetal}`}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain er-stage-ring-img"
                      />
                    </div>
                  )}

                  {/* Stage Tools: Zoom & Expand */}
                  <div className="er-stage-tools-overlay">
                    <button
                      type="button"
                      className="er-stage-tool-btn facet-oct-sm"
                      onClick={() => setIsZoomModalOpen(true)}
                      title="Zoom into Atelier Craftsmanship"
                    >
                      <Search size={14} /> Zoom
                    </button>
                    <button
                      type="button"
                      className="er-stage-tool-btn facet-oct-sm"
                      onClick={() => setIsZoomModalOpen(true)}
                      title="Fullscreen High Definition View"
                    >
                      <Maximize2 size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Setting Header Information */}
              <div className="er-setting-meta-header">
                <span className="er-setting-eyebrow">{product.style.toUpperCase()}</span>
                <h1 className="er-setting-title">{product.name}</h1>
                <p className="er-setting-desc">{product.description}</p>

                <div className="er-setting-price-row">
                  <span className="er-setting-price-label">Setting Price ⓘ</span>
                  <strong className="er-setting-price-amount">
                    {store.formatMoney(settingSubtotal)}
                  </strong>
                </div>

                <div className="er-setting-reassurances-grid">
                  <div className="er-reassurance-pill">
                    <Clock size={14} className="text-[#C5A880]" />
                    <span>Estimated Lead Time: <strong>4–6 weeks</strong></span>
                  </div>
                  <div className="er-reassurance-pill">
                    <Truck size={14} className="text-[#C5A880]" />
                    <span>Complimentary Delivery & Returns</span>
                  </div>
                </div>

                <div className="er-setting-actions-row">
                  <button
                    type="button"
                    className={`er-action-link-btn ${isWishlisted ? "is-active" : ""}`}
                    onClick={handleToggleWishlist}
                  >
                    <Heart size={15} fill={isWishlisted ? "#8B263E" : "none"} color={isWishlisted ? "#8B263E" : "#0C1B54"} />
                    <span>{isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}</span>
                  </button>
                  <button
                    type="button"
                    className="er-action-link-btn"
                    onClick={handleShare}
                  >
                    <Share2 size={15} />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Step-by-Step Progressive Configuration Accordion */}
            <div className="er-config-steps-container">
              {/* STEP 1: DIAMOND SHAPE */}
              <div className={`er-step-card facet-oct-sm ${openStep === 1 ? "is-expanded" : ""}`}>
                <button
                  type="button"
                  className="er-step-card-header"
                  onClick={() => setOpenStep(openStep === 1 ? null : 1)}
                  aria-expanded={openStep === 1}
                >
                  <div className="er-step-num-title">
                    <span className="er-step-badge">1</span>
                    <span className="er-step-title">DIAMOND SHAPE</span>
                  </div>
                  <div className="er-step-header-right">
                    <span className="er-step-active-val">{selectedShape}</span>
                    <span className="er-step-change-btn">
                      Change {openStep === 1 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </span>
                  </div>
                </button>

                {openStep === 1 && (
                  <div className="er-step-card-body">
                    <p className="er-step-body-hint">
                      This setting is engineered to accommodate the following certified diamond shapes:
                    </p>
                    <div className="er-shapes-selector-grid">
                      {SHAPE_CONFIG_LIST.map((shape) => {
                        const isAvailable = product.compatibleShapes ? product.compatibleShapes.includes(shape.id) : true;
                        const isSelected = selectedShape === shape.id;
                        return (
                          <button
                            key={shape.id}
                            type="button"
                            disabled={!isAvailable}
                            className={`er-shape-option-btn facet-oct-sm ${isSelected ? "is-selected" : ""} ${!isAvailable ? "is-disabled" : ""}`}
                            onClick={() => {
                              setSelectedShape(shape.id);
                              setOpenStep(2);
                            }}
                          >
                            <div className="er-shape-opt-icon">
                              <Image
                                src={shape.icon}
                                alt={shape.label}
                                width={32}
                                height={32}
                                className="object-contain"
                              />
                            </div>
                            <span className="er-shape-opt-name">{shape.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 2: METAL */}
              <div className={`er-step-card facet-oct-sm ${openStep === 2 ? "is-expanded" : ""}`}>
                <button
                  type="button"
                  className="er-step-card-header"
                  onClick={() => setOpenStep(openStep === 2 ? null : 2)}
                  aria-expanded={openStep === 2}
                >
                  <div className="er-step-num-title">
                    <span className="er-step-badge">2</span>
                    <span className="er-step-title">METAL ⓘ</span>
                  </div>
                  <div className="er-step-header-right">
                    <span className="er-step-active-val">{selectedMetal}</span>
                    <span className="er-step-change-btn">
                      Change {openStep === 2 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </span>
                  </div>
                </button>

                {openStep === 2 && (
                  <div className="er-step-card-body">
                    <div className="er-metals-swatch-row">
                      {METALS_LIST.map((m) => {
                        const isSelected = selectedMetal === m.code;
                        return (
                          <button
                            key={m.code}
                            type="button"
                            className={`er-metal-option-btn facet-oct-sm ${isSelected ? "is-selected" : ""}`}
                            onClick={() => {
                              setSelectedMetal(m.code);
                              setOpenStep(3);
                            }}
                          >
                            <span
                              className="er-metal-large-dot"
                              style={{ backgroundColor: m.color, borderColor: m.border }}
                            />
                            <span className="er-metal-opt-name">{m.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 3: BAND STYLE */}
              <div className={`er-step-card facet-oct-sm ${openStep === 3 ? "is-expanded" : ""}`}>
                <button
                  type="button"
                  className="er-step-card-header"
                  onClick={() => setOpenStep(openStep === 3 ? null : 3)}
                  aria-expanded={openStep === 3}
                >
                  <div className="er-step-num-title">
                    <span className="er-step-badge">3</span>
                    <span className="er-step-title">BAND STYLE ⓘ</span>
                  </div>
                  <div className="er-step-header-right">
                    <span className="er-step-active-val">{selectedBandStyle}</span>
                    <span className="er-step-change-btn">
                      Change {openStep === 3 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </span>
                  </div>
                </button>

                {openStep === 3 && (
                  <div className="er-step-card-body">
                    <div className="er-bands-options-grid">
                      {BAND_STYLES.map((band) => {
                        const isSelected = selectedBandStyle === band.id;
                        return (
                          <button
                            key={band.id}
                            type="button"
                            className={`er-band-option-btn facet-oct-sm ${isSelected ? "is-selected" : ""}`}
                            onClick={() => {
                              setSelectedBandStyle(band.id);
                              setOpenStep(4);
                            }}
                          >
                            <div className="er-band-wireframe-svg">
                              <svg width="34" height="20" viewBox="0 0 24 16" fill="none" stroke="#0C1B54" strokeWidth="1.5">
                                <path d={band.profilePath} fill={isSelected ? "#E8E1D5" : "none"} />
                              </svg>
                            </div>
                            <strong className="er-band-name">{band.label}</strong>
                            <span className="er-band-sub">{band.sub}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 4: RING SIZE */}
              <div className={`er-step-card facet-oct-sm ${openStep === 4 ? "is-expanded" : ""}`}>
                <button
                  type="button"
                  className="er-step-card-header"
                  onClick={() => setOpenStep(openStep === 4 ? null : 4)}
                  aria-expanded={openStep === 4}
                >
                  <div className="er-step-num-title">
                    <span className="er-step-badge">4</span>
                    <span className="er-step-title">RING SIZE ⓘ</span>
                  </div>
                  <div className="er-step-header-right">
                    <span className="er-step-active-val">UK {selectedSize}</span>
                    <span className="er-step-change-btn">
                      Change {openStep === 4 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </span>
                  </div>
                </button>

                {openStep === 4 && (
                  <div className="er-step-card-body">
                    <div className="er-size-select-row">
                      <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="er-size-dropdown"
                      >
                        {UK_RING_SIZES.map((sz) => (
                          <option key={sz} value={sz}>
                            {sz.startsWith("Not") ? sz : `UK Size ${sz}`}
                          </option>
                        ))}
                      </select>
                      <div className="er-size-tools-links">
                        <button
                          type="button"
                          className="er-size-modal-trigger"
                          onClick={() => setIsSizeGuideOpen(true)}
                        >
                          <Ruler size={13} /> Size Guide
                        </button>
                        <span className="sep">|</span>
                        <Link href="/expert" className="er-size-advice-link">
                          <MessageSquare size={13} /> Not sure? We can help
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 5: CHOOSE YOUR CENTRE DIAMOND */}
              <div className="er-step-card er-step-card-diamond facet-oct-sm is-expanded">
                <div className="er-step-card-header">
                  <div className="er-step-num-title">
                    <span className="er-step-badge">5</span>
                    <span className="er-step-title">CHOOSE YOUR CENTRE DIAMOND ⓘ</span>
                  </div>
                </div>

                <div className="er-step-card-body">
                  <p className="er-step-body-hint">
                    Select your preferred diamond provenance before browsing certified loose diamonds compatible with your {selectedShape} setting:
                  </p>

                  <div className="er-diamond-type-toggles">
                    <button
                      type="button"
                      className={`er-diamond-type-btn facet-oct-sm ${diamondType === "Natural" ? "is-selected" : ""}`}
                      onClick={() => setDiamondType("Natural")}
                    >
                      <DiamondIcon size={18} className="text-[#0C1B54]" />
                      <div>
                        <strong>Natural Diamond</strong>
                        <small>Formed over billions of years deep within the earth</small>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`er-diamond-type-btn facet-oct-sm ${diamondType === "Lab-grown" ? "is-selected" : ""}`}
                      onClick={() => setDiamondType("Lab-grown")}
                    >
                      <Sparkles size={18} className="text-[#0C1B54]" />
                      <div>
                        <strong>Lab-Grown Diamond</strong>
                        <small>Chemically, physically, and optically identical</small>
                      </div>
                    </button>
                  </div>

                  {/* Primary CTA Button to Select Diamond */}
                  <div className="er-select-diamond-cta-box">
                    <button
                      type="button"
                      className="button button-burgundy button-wide er-select-diamond-btn facet-oct-sm"
                      onClick={handleSelectDiamondClick}
                    >
                      SELECT DIAMOND <ArrowRight size={16} />
                    </button>
                    <p className="er-select-diamond-subtext">
                      You will be able to view all {diamondType} diamonds compatible with this setting.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sticky Sidebar: YOUR RING SUMMARY */}
          <aside className="er-config-sidebar">
            <div className="er-summary-sticky-card facet-oct-sm">
              <h2 className="er-summary-heading">YOUR RING SUMMARY</h2>

              {/* Card 1: SELECTED SETTING */}
              <div className="er-summary-section-box">
                <span className="er-summary-box-eyebrow">SELECTED SETTING</span>
                <div className="er-setting-summary-content">
                  <div className="er-setting-mini-thumb">
                    <Image
                      src={activeImage}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  </div>
                  <div className="er-setting-mini-details">
                    <h4>{product.name}</h4>
                    <span className="er-setting-mini-style">{product.style}</span>
                    <div className="er-setting-mini-price">
                      Setting Price: <strong>{store.formatMoney(settingSubtotal)}</strong>
                    </div>
                  </div>
                </div>

                <div className="er-summary-specs-list">
                  <div className="er-summary-spec-row">
                    <span>Diamond Shape</span>
                    <strong>{selectedShape} Brilliant</strong>
                  </div>
                  <div className="er-summary-spec-row">
                    <span>Metal</span>
                    <strong>{selectedMetal}</strong>
                  </div>
                  <div className="er-summary-spec-row">
                    <span>Band Style</span>
                    <strong>{selectedBandStyle}</strong>
                  </div>
                  <div className="er-summary-spec-row">
                    <span>Ring Size</span>
                    <strong>UK {selectedSize}</strong>
                  </div>
                  <div className="er-summary-spec-row er-subtotal-row">
                    <span>Setting Subtotal</span>
                    <strong>{store.formatMoney(settingSubtotal)}</strong>
                  </div>
                </div>
              </div>

              {/* Card 2: SELECTED DIAMOND */}
              <div className="er-summary-section-box">
                <span className="er-summary-box-eyebrow">SELECTED DIAMOND</span>
                {selectedDiamond ? (
                  <div className="er-selected-diamond-dossier">
                    <div className="er-diamond-dossier-top">
                      <div className="er-diamond-dossier-icon">
                        <Image
                          src={`/images/shapes/${selectedDiamond.shape.toLowerCase()}.png`}
                          alt={selectedDiamond.shape}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      <div className="er-diamond-dossier-info">
                        <h4>{selectedDiamond.carat.toFixed(2)} ct {selectedDiamond.shape}</h4>
                        <p>{selectedDiamond.type} · {selectedDiamond.colour} · {selectedDiamond.clarity} · {selectedDiamond.cut}</p>
                        <span className="er-diamond-dossier-price">{store.formatMoney(selectedDiamond.price)}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="er-change-diamond-btn"
                      onClick={handleSelectDiamondClick}
                    >
                      Change Diamond →
                    </button>
                  </div>
                ) : (
                  <div className="er-no-diamond-placeholder">
                    <div className="er-no-diamond-icon">
                      <DiamondIcon size={24} className="text-[#C5A880]" />
                    </div>
                    <div className="er-no-diamond-text">
                      <strong>No diamond selected</strong>
                      <p>Choose your centre diamond to complete your ring.</p>
                    </div>
                    <button
                      type="button"
                      className="button button-outline button-wide facet-oct-sm er-select-diamond-outline-btn"
                      onClick={handleSelectDiamondClick}
                    >
                      SELECT DIAMOND
                    </button>
                  </div>
                )}
              </div>

              {/* Card 3: COMPLETE RING PRICE & MAIN PURCHASE ACTION */}
              <div className="er-summary-section-box er-summary-total-box">
                <span className="er-summary-box-eyebrow">COMPLETE RING PRICE</span>
                <p className="er-total-caption">Ring Total (Setting + Diamond) ⓘ</p>

                <div className="er-total-price-display">
                  {completeRingTotal ? (
                    <strong className="er-total-amount">{store.formatMoney(completeRingTotal)}</strong>
                  ) : (
                    <span className="er-total-empty">— —</span>
                  )}
                </div>
                {!completeRingTotal && (
                  <p className="er-total-hint">Price will update once a diamond is selected.</p>
                )}

                {/* Primary Action Button: REVIEW COMPLETE RING / ADD TO BAG */}
                {selectedDiamond ? (
                  <Link
                    href={`/engagement-rings/review?setting=${product.id}&diamondId=${selectedDiamond.id}&metal=${encodeURIComponent(selectedMetal)}&band=${encodeURIComponent(selectedBandStyle)}&size=${encodeURIComponent(selectedSize)}&shape=${encodeURIComponent(selectedShape)}`}
                    className="button button-burgundy button-wide er-add-to-bag-btn facet-oct-sm"
                  >
                    REVIEW COMPLETE RING <ArrowRight size={16} />
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="button button-burgundy button-wide er-add-to-bag-btn facet-oct-sm is-disabled"
                  >
                    ADD TO BAG
                  </button>
                )}

                {/* Secondary CTA: BOOK AN APPOINTMENT */}
                <Link
                  href="/appointments"
                  className="button button-ghost button-wide er-book-appt-btn facet-oct-sm"
                >
                  BOOK AN APPOINTMENT
                </Link>
              </div>

              {/* Advisory & Trust Notes */}
              <div className="er-sidebar-advisory-notes">
                <div className="er-advisory-item">
                  <Award size={18} className="text-[#0C1B54] flex-shrink-0" />
                  <p>
                    <strong>Made to order, just for you.</strong> Each ring is crafted to the highest standards in our London atelier.
                  </p>
                </div>
                <div className="er-advisory-item">
                  <Phone size={18} className="text-[#0C1B54] flex-shrink-0" />
                  <p>
                    <strong>Need help?</strong> Speak to an MAH Expert · +44 (0)20 0000 0000 ·{" "}
                    <Link href="/contact" className="text-[#8F7243] underline">WhatsApp us</Link>
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* 3. Bottom Tabbed Technical Dossier Section */}
      <section className="er-config-dossier-section">
        <div className="shell">
          <div className="er-dossier-card facet-oct-sm">
            {/* Tabs Header */}
            <div className="er-dossier-tabs-nav" role="tablist">
              <button
                type="button"
                className={`er-dossier-tab-btn ${activeBottomTab === "description" ? "is-active" : ""}`}
                onClick={() => setActiveBottomTab("description")}
                role="tab"
                aria-selected={activeBottomTab === "description"}
              >
                DESCRIPTION & DETAILS
              </button>
              <button
                type="button"
                className={`er-dossier-tab-btn ${activeBottomTab === "specifications" ? "is-active" : ""}`}
                onClick={() => setActiveBottomTab("specifications")}
                role="tab"
                aria-selected={activeBottomTab === "specifications"}
              >
                SPECIFICATIONS
              </button>
              <button
                type="button"
                className={`er-dossier-tab-btn ${activeBottomTab === "craftsmanship" ? "is-active" : ""}`}
                onClick={() => setActiveBottomTab("craftsmanship")}
                role="tab"
                aria-selected={activeBottomTab === "craftsmanship"}
              >
                CRAFTSMANSHIP
              </button>
              <button
                type="button"
                className={`er-dossier-tab-btn ${activeBottomTab === "delivery" ? "is-active" : ""}`}
                onClick={() => setActiveBottomTab("delivery")}
                role="tab"
                aria-selected={activeBottomTab === "delivery"}
              >
                DELIVERY & COLLECTION
              </button>
              <button
                type="button"
                className={`er-dossier-tab-btn ${activeBottomTab === "aftercare" ? "is-active" : ""}`}
                onClick={() => setActiveBottomTab("aftercare")}
                role="tab"
                aria-selected={activeBottomTab === "aftercare"}
              >
                RETURNS & AFTERCARE
              </button>
            </div>

            {/* Tab Content */}
            <div className="er-dossier-tab-content">
              {activeBottomTab === "description" && (
                <div className="er-dossier-description-layout">
                  <div className="er-dossier-desc-text">
                    <h3>The Architectural Solitaire</h3>
                    <p>
                      {product.description} Handcrafted in solid {selectedMetal}, each ring is individually balanced to ensure maximum light transmission through the pavilion and table of your selected centre diamond.
                    </p>
                    <p>
                      Designed with a comfort-fit interior shank and tapered claws to ensure effortless daily wear while preserving heirloom longevity.
                    </p>
                  </div>
                  {/* Technical CAD Elevation Diagram */}
                  <div className="er-dossier-cad-diagram facet-oct-sm">
                    <div className="er-cad-diagram-header">
                      <span>DIMENSIONAL ARCHITECTURE</span>
                      <small>1:1 Scale Proportions</small>
                    </div>
                    <div className="er-cad-illustrations">
                      <div className="er-cad-elevation">
                        <svg width="120" height="70" viewBox="0 0 120 70" fill="none" stroke="#0C1B54" strokeWidth="1.2">
                          {/* Side Ring Profile */}
                          <circle cx="60" cy="45" r="22" />
                          <circle cx="60" cy="45" r="18" />
                          {/* Head and Claws */}
                          <path d="M50,23 L55,10 L65,10 L70,23 Z" fill="rgba(197, 168, 128, 0.2)" />
                          <line x1="55" y1="10" x2="60" y2="4" strokeDasharray="1,1" />
                          <line x1="65" y1="10" x2="60" y2="4" strokeDasharray="1,1" />
                          {/* Dimension callout */}
                          <line x1="85" y1="4" x2="85" y2="67" stroke="#8F7243" strokeWidth="0.8" strokeDasharray="2,2" />
                          <text x="90" y="38" fill="#8F7243" fontSize="8" fontFamily="sans-serif">6.0mm</text>
                        </svg>
                        <span className="er-cad-label">Side Elevation</span>
                      </div>
                      <div className="er-cad-elevation">
                        <svg width="120" height="70" viewBox="0 0 120 70" fill="none" stroke="#0C1B54" strokeWidth="1.2">
                          {/* Overhead Profile */}
                          <circle cx="60" cy="35" r="24" />
                          <circle cx="60" cy="35" r="20" />
                          <circle cx="60" cy="35" r="8" fill="rgba(197, 168, 128, 0.3)" />
                          {/* 4 claws */}
                          <circle cx="53" cy="28" r="1.5" fill="#0C1B54" />
                          <circle cx="67" cy="28" r="1.5" fill="#0C1B54" />
                          <circle cx="53" cy="42" r="1.5" fill="#0C1B54" />
                          <circle cx="67" cy="42" r="1.5" fill="#0C1B54" />
                          {/* Band width dimension */}
                          <line x1="60" y1="60" x2="60" y2="66" stroke="#8F7243" strokeWidth="0.8" />
                          <text x="68" y="65" fill="#8F7243" fontSize="8" fontFamily="sans-serif">2.0mm</text>
                        </svg>
                        <span className="er-cad-label">Overhead Elevation</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeBottomTab === "specifications" && (
                <div className="er-specs-grid-layout">
                  <div className="er-spec-card">
                    <span className="label">Setting Reference</span>
                    <strong className="val">{product.id} ({product.name})</strong>
                  </div>
                  <div className="er-spec-card">
                    <span className="label">Precious Metal</span>
                    <strong className="val">Solid {selectedMetal} (UK Hallmarked)</strong>
                  </div>
                  <div className="er-spec-card">
                    <span className="label">Band Profile</span>
                    <strong className="val">{selectedBandStyle}</strong>
                  </div>
                  <div className="er-spec-card">
                    <span className="label">Claw Setting</span>
                    <strong className="val">4-Talon Claws (Solid Cast)</strong>
                  </div>
                  <div className="er-spec-card">
                    <span className="label">Profile Height</span>
                    <strong className="val">Approx. 6.0mm (Low-set gallery)</strong>
                  </div>
                  <div className="er-spec-card">
                    <span className="label">Band Width</span>
                    <strong className="val">2.0mm tapered to 1.5mm comfort base</strong>
                  </div>
                </div>
              )}

              {activeBottomTab === "craftsmanship" && (
                <div className="er-dossier-prose">
                  <h3>Master Goldsmithing in London</h3>
                  <p>
                    Every MAH engagement ring is individually forged and hand-finished in our London atelier by master jewellers with over three decades of heritage experience.
                  </p>
                  <ul>
                    <li>100% recycled precious metals certified by the Responsible Jewellery Council (RJC).</li>
                    <li>Independently tested and stamped by the Worshipful Company of Goldsmiths London Assay Office.</li>
                    <li>Precision microscope claw-setting ensures optimal stone security without obstructing light.</li>
                  </ul>
                </div>
              )}

              {activeBottomTab === "delivery" && (
                <div className="er-dossier-prose">
                  <h3>Insured Delivery & Showroom Collection</h3>
                  <p>
                    We offer discreet, complimentary and fully insured delivery worldwide. All orders arrive in luxury presentation packaging with certificate dossiers.
                  </p>
                  <ul>
                    <li><strong>Royal Mail Special Delivery (UK):</strong> Guaranteed next-day by 1:00 PM once dispatched.</li>
                    <li><strong>International Courier (FedEx/Ferrari Express):</strong> Fully insured door-to-door delivery.</li>
                    <li><strong>London Atelier Collection:</strong> Private milestone collection appointments in Hatton Garden.</li>
                  </ul>
                </div>
              )}

              {activeBottomTab === "aftercare" && (
                <div className="er-dossier-prose">
                  <h3>Lifetime Care & Complimentary Resizing</h3>
                  <p>
                    Your commitment is lifelong, and so is our care. Every MAH engagement ring is backed by our comprehensive lifetime warranty.
                  </p>
                  <ul>
                    <li><strong>30-Day Complimentary Resizing:</strong> We adjust the ring size by up to 2 full sizes at zero charge.</li>
                    <li><strong>Annual Ultrasonic Clean & Inspection:</strong> Complimentary lifetime cleaning and prong safety checks.</li>
                    <li><strong>Valuation Dossier:</strong> Includes an independent retail replacement valuation for your insurer.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. 4-Pillar Hallmark Badges */}
      <section className="er-config-hallmarks-strip">
        <div className="shell">
          <div className="er-config-hallmarks-grid">
            <div className="er-config-hallmark-item">
              <Truck size={18} className="text-[#0C1B54]" />
              <span>Complimentary worldwide delivery</span>
            </div>
            <div className="er-config-hallmark-item">
              <RotateCcw size={18} className="text-[#0C1B54]" />
              <span>Free returns within 30 days</span>
            </div>
            <div className="er-config-hallmark-item">
              <ShieldCheck size={18} className="text-[#0C1B54]" />
              <span>Lifetime craftsmanship guarantee</span>
            </div>
            <div className="er-config-hallmark-item">
              <DiamondIcon size={18} className="text-[#0C1B54]" />
              <span>Conflict-free diamonds</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Sizing Guide Modal */}
      <RingSizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        initialSize={selectedSize}
        onSelectSize={(sz) => setSelectedSize(sz)}
      />

      {/* 6. Zoom Fullscreen Modal */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C1B54]/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl bg-[#FAF8F5] p-6 rounded-lg shadow-2xl max-h-[90vh] flex flex-col items-center border border-[#C5A880]/40">
            <button
              type="button"
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-200 transition-colors"
              aria-label="Close Zoom"
            >
              <X size={20} />
            </button>
            <span className="text-xs uppercase tracking-widest text-[#8F7243] font-semibold mb-2">
              High Resolution Atelier Zoom
            </span>
            <h3 className="font-serif text-xl text-[#0C1B54] mb-4">
              {product.name} · {selectedMetal}
            </h3>
            <div className="relative w-full h-[60vh] max-h-[500px]">
              <Image
                src={galleryThumbnails[activeMediaIndex]?.src || activeImage}
                alt={`${product.name} high resolution zoom`}
                fill
                className="object-contain"
              />
            </div>
            <p className="text-xs text-slate-500 mt-4">
              Detailed macro inspection of the talon prongs, gallery architecture, and hallmark finish.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

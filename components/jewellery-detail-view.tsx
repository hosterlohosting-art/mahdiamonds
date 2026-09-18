"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  HelpCircle,
  Maximize2,
  MessageCircle,
  Play,
  RotateCw,
  Ruler,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { money, products, type Product } from "@/lib/demo-data";
import { useDemoStore } from "@/components/demo-store-provider";
import { RingSizeGuideModal } from "@/components/ring-size-guide-modal";

interface JewelleryDetailViewProps {
  product: Product;
}

export function JewelleryDetailView({ product }: JewelleryDetailViewProps) {
  const store = useDemoStore();
  const router = useRouter();

  // All Jewellery Products for Prev/Next navigation & recommendations
  const allJewellery = useMemo(() => {
    return products.filter((p) => p.category === "jewellery");
  }, []);

  // Find currentIndex, prev, next
  const currentIndex = allJewellery.findIndex((p) => p.id === product.id);
  const prevProduct = currentIndex > 0 ? allJewellery[currentIndex - 1] : allJewellery[allJewellery.length - 1];
  const nextProduct = currentIndex < allJewellery.length - 1 ? allJewellery[currentIndex + 1] : allJewellery[0];

  // Configuration state
  const availableMetals = product.availableMetals || [
    "Platinum",
    "18k White Gold",
    "18k Yellow Gold",
    "18k Rose Gold",
  ];

  const [selectedMetal, setSelectedMetal] = useState<string>(product.metal || availableMetals[0]);
  const [selectedChainLength, setSelectedChainLength] = useState<string>("45 cm / 18\"");
  const [selectedRingSize, setSelectedRingSize] = useState<string>("M");
  const [selectedBraceletSize, setSelectedBraceletSize] = useState<string>("17 cm (Medium)");
  const [selectedBacking, setSelectedBacking] = useState<string>("Four-Claw Post & Butterfly");
  const [quantity, setQuantity] = useState<number>(1);

  // Gallery & Media Mode State
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [mediaMode, setMediaMode] = useState<"image" | "360" | "video">("image");
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);

  // Information Tabs State
  const [activeTab, setActiveTab] = useState<"description" | "details" | "craftsmanship" | "delivery">("description");

  // Determine Product Subcategory
  const isNecklace = product.style?.toLowerCase().includes("necklace") || product.style?.toLowerCase().includes("pendant");
  const isRing = product.style?.toLowerCase().includes("ring");
  const isBracelet = product.style?.toLowerCase().includes("bracelet") || product.style?.toLowerCase().includes("bangle");
  const isEarrings = product.style?.toLowerCase().includes("earring") || product.style?.toLowerCase().includes("stud");

  // Build Media Items List
  const mediaList = useMemo(() => {
    const images: string[] = [];
    if (product.images && product.images.length > 0) {
      images.push(...product.images);
    } else if (product.image) {
      images.push(product.image);
    }

    // Ensure we have at least 4 views (front, angle, side/profile, model/lifestyle)
    if (images.length === 1) {
      images.push(
        "/images/mah-hero-concept.png",
        "/images/styles/solitaire.jpg",
        "/images/journal-diamonds.jpg"
      );
    } else if (images.length === 2) {
      images.push("/images/journal-diamonds.jpg", "/images/mah-hero-concept.png");
    } else if (images.length === 3) {
      images.push("/images/journal-diamonds.jpg");
    }

    return images.slice(0, 4);
  }, [product]);

  // Pricing calculation
  const calculatedPrice = useMemo(() => {
    let base = product.price;
    if (selectedMetal.includes("Platinum")) base += 200;
    return base * quantity;
  }, [product.price, selectedMetal, quantity]);

  // Wishlist Check
  const isSavedInWishlist = store.wishlist.includes(product.id);

  const handleWishlistToggle = () => {
    store.toggleWishlist(product.id);
    if (!isSavedInWishlist) {
      toast.success(`${product.name} added to your wishlist.`);
    } else {
      toast.info(`${product.name} removed from your wishlist.`);
    }
  };

  // Add to Bag Handler
  const handleAddToBag = () => {
    const configOptions: string[] = [selectedMetal];
    if (isNecklace) configOptions.push(`Chain: ${selectedChainLength}`);
    if (isRing) configOptions.push(`UK Ring Size: ${selectedRingSize}`);
    if (isBracelet) configOptions.push(`Bracelet Size: ${selectedBraceletSize}`);
    if (isEarrings) configOptions.push(`Backing: ${selectedBacking}`);

    store.addProduct(
      {
        ...product,
        price: calculatedPrice / quantity,
      },
      configOptions.join(" · ")
    );

    toast.success("Added to Bag", {
      description: `${quantity} × ${product.name} (${selectedMetal})`,
    });
    router.push("/bag");
  };

  // Media controls
  const handlePrevMedia = () => {
    if (mediaMode !== "image") {
      setMediaMode("image");
      return;
    }
    setActiveMediaIndex((prev) => (prev > 0 ? prev - 1 : mediaList.length - 1));
  };

  const handleNextMedia = () => {
    if (mediaMode !== "image") {
      setMediaMode("image");
      return;
    }
    setActiveMediaIndex((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0));
  };

  // 360 Rotation Mouse Drag
  const isDragging360 = useRef(false);
  const startX360 = useRef(0);

  const handleMouseDown360 = (e: React.MouseEvent) => {
    isDragging360.current = true;
    startX360.current = e.clientX;
  };

  const handleMouseMove360 = (e: React.MouseEvent) => {
    if (!isDragging360.current) return;
    const delta = e.clientX - startX360.current;
    setRotationAngle((prev) => (prev + delta * 0.5) % 360);
    startX360.current = e.clientX;
  };

  const handleMouseUp360 = () => {
    isDragging360.current = false;
  };

  // Recommended Products ("YOU MAY ALSO LIKE")
  const recommendedItems = useMemo(() => {
    return allJewellery
      .filter((p) => p.id !== product.id)
      .slice(0, 4);
  }, [allJewellery, product.id]);

  return (
    <div className="jewellery-pdp-12b">
      {/* 1. BREADCRUMBS & PREV/NEXT BAR */}
      <div className="j-pdp-top-bar">
        <div className="shell j-pdp-top-inner">
          <nav aria-label="Breadcrumb" className="j-breadcrumbs">
            <Link href="/">Home</Link>
            <span className="crumb-sep">&gt;</span>
            <Link href="/jewellery">Jewellery</Link>
            <span className="crumb-sep">&gt;</span>
            <Link href={`/jewellery?style=${encodeURIComponent(product.style || "all")}`}>
              {product.style ? `${product.style}s` : "Fine Jewellery"}
            </Link>
            <span className="crumb-sep">&gt;</span>
            <span className="crumb-current">{product.name}</span>
          </nav>

          <div className="j-pdp-nav-actions">
            {prevProduct && (
              <Link href={`/jewellery/product?id=${prevProduct.id}`} className="j-pdp-nav-link">
                &lt; PREVIOUS
              </Link>
            )}
            {prevProduct && nextProduct && <span className="nav-sep">|</span>}
            {nextProduct && (
              <Link href={`/jewellery/product?id=${nextProduct.id}`} className="j-pdp-nav-link">
                NEXT &gt;
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN PRODUCT AREA (GALLERY + BUYBOX) */}
      <section className="shell j-pdp-main-grid" aria-labelledby="product-title-12b">
        {/* LEFT: GALLERY WITH THUMBNAIL STRIP */}
        <div className="j-gallery-column">
          {/* Vertical Thumbnail Strip */}
          <div className="j-thumbs-strip" role="tablist" aria-label="Product media thumbnails">
            {mediaList.map((img, idx) => (
              <button
                key={`thumb-${idx}`}
                type="button"
                role="tab"
                aria-selected={mediaMode === "image" && activeMediaIndex === idx}
                className={`j-thumb-btn ${mediaMode === "image" && activeMediaIndex === idx ? "active" : ""}`}
                onClick={() => {
                  setMediaMode("image");
                  setActiveMediaIndex(idx);
                }}
              >
                <div className="j-thumb-img-wrap">
                  <Image src={img} alt={`${product.name} view ${idx + 1}`} fill sizes="80px" className="object-cover" />
                </div>
              </button>
            ))}

            {/* 360 Button */}
            <button
              type="button"
              role="tab"
              aria-selected={mediaMode === "360"}
              className={`j-thumb-btn j-thumb-control ${mediaMode === "360" ? "active" : ""}`}
              onClick={() => setMediaMode("360")}
              title="Interactive 360 View"
            >
              <span className="control-label">360°</span>
            </button>

            {/* Video Button */}
            <button
              type="button"
              role="tab"
              aria-selected={mediaMode === "video"}
              className={`j-thumb-btn j-thumb-control ${mediaMode === "video" ? "active" : ""}`}
              onClick={() => setMediaMode("video")}
              title="Product Video"
            >
              <Play size={18} fill="currentColor" />
            </button>
          </div>

          {/* Large Interactive Viewport */}
          <div className="j-main-stage-wrap facet-oct-sm">
            {/* Prev/Next Arrows */}
            <button
              type="button"
              className="j-stage-arrow j-stage-arrow-prev"
              onClick={handlePrevMedia}
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              type="button"
              className="j-stage-arrow j-stage-arrow-next"
              onClick={handleNextMedia}
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>

            {/* Zoom Trigger */}
            <button
              type="button"
              className="j-stage-zoom-btn"
              onClick={() => setIsZoomOpen(true)}
              aria-label="Enlarge image"
            >
              <Maximize2 size={16} />
            </button>

            {/* Stage Content: Image vs 360 vs Video */}
            <div className="j-stage-display">
              {mediaMode === "image" && (
                <div className="j-stage-image-container" onClick={() => setIsZoomOpen(true)}>
                  <Image
                    src={mediaList[activeMediaIndex]}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 900px) 100vw, 50vw"
                    className="j-stage-img"
                  />
                </div>
              )}

              {mediaMode === "360" && (
                <div
                  className="j-360-stage"
                  onMouseDown={handleMouseDown360}
                  onMouseMove={handleMouseMove360}
                  onMouseUp={handleMouseUp360}
                  onMouseLeave={handleMouseUp360}
                >
                  <div
                    className="j-360-rotator"
                    style={{ transform: `rotateY(${rotationAngle}deg)` }}
                  >
                    <Image
                      src={product.image}
                      alt={`${product.name} 360 degree inspection`}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="j-360-badge">
                    <RotateCw size={14} className="animate-spin-slow" />
                    <span>Drag horizontally to rotate 360°</span>
                  </div>
                </div>
              )}

              {mediaMode === "video" && (
                <div className="j-video-stage">
                  <div className="j-video-placeholder">
                    <Image
                      src={mediaList[0]}
                      alt={product.name}
                      fill
                      className="object-cover opacity-80"
                    />
                    <div className="j-video-overlay">
                      <div className="j-play-circle">
                        <Play size={28} fill="currentColor" />
                      </div>
                      <span className="j-video-caption">Artisanal Workshop Video Demonstration</span>
                      <small>High jewellery scintillation under daylight caustics</small>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: BUYBOX & CONFIGURATION FORM */}
        <aside className="j-buybox-column">
          <div className="j-buybox-content">
            <p className="j-eyebrow">JEWELLERY</p>
            <h1 id="product-title-12b" className="j-product-title">
              {product.name}
            </h1>
            <p className="j-price-tag">
              Price from MAH catalogue · <strong>{money(calculatedPrice)}</strong>
            </p>
            <p className="j-short-desc">
              {product.description ||
                "An elegant creation, designed to capture light from every angle. A timeless piece for everyday elegance or special occasions."}
            </p>

            <div className="j-prefs-section">
              <h2 className="j-prefs-heading">SELECT YOUR PREFERENCES</h2>

              <div className="j-form-grid">
                {/* 1. Metal Selector */}
                <div className="j-form-field">
                  <label htmlFor="pref-metal" className="j-field-label">
                    Metal
                  </label>
                  <div className="j-select-wrap">
                    <select
                      id="pref-metal"
                      value={selectedMetal}
                      onChange={(e) => setSelectedMetal(e.target.value)}
                      className="j-select facet-oct-sm"
                    >
                      {availableMetals.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="j-select-chevron" />
                  </div>
                </div>

                {/* 2. Adaptive Option based on Subcategory */}
                {isNecklace && (
                  <div className="j-form-field">
                    <div className="j-field-label-row">
                      <label htmlFor="pref-chain-length" className="j-field-label">
                        Chain Length
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="j-size-guide-btn"
                      >
                        <Ruler size={12} /> Size Guide ?
                      </button>
                    </div>
                    <div className="j-select-wrap">
                      <select
                        id="pref-chain-length"
                        value={selectedChainLength}
                        onChange={(e) => setSelectedChainLength(e.target.value)}
                        className="j-select facet-oct-sm"
                      >
                        <option value="40 cm / 16&quot;">40 cm / 16&quot; (Choker Collar)</option>
                        <option value="45 cm / 18&quot;">45 cm / 18&quot; (Classic Princess)</option>
                        <option value="50 cm / 20&quot;">50 cm / 20&quot; (Matinee Drop)</option>
                        <option value="55 cm / 22&quot;">55 cm / 22&quot; (Extended Line)</option>
                      </select>
                      <ChevronDown size={14} className="j-select-chevron" />
                    </div>
                  </div>
                )}

                {isRing && (
                  <div className="j-form-field">
                    <div className="j-field-label-row">
                      <label htmlFor="pref-ring-size" className="j-field-label">
                        Ring Size
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="j-size-guide-btn"
                      >
                        <Ruler size={12} /> Size Guide ?
                      </button>
                    </div>
                    <div className="j-select-wrap">
                      <select
                        id="pref-ring-size"
                        value={selectedRingSize}
                        onChange={(e) => setSelectedRingSize(e.target.value)}
                        className="j-select facet-oct-sm"
                      >
                        {["H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S"].map((sz) => (
                          <option key={sz} value={sz}>
                            UK Size {sz}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="j-select-chevron" />
                    </div>
                  </div>
                )}

                {isBracelet && (
                  <div className="j-form-field">
                    <div className="j-field-label-row">
                      <label htmlFor="pref-bracelet-size" className="j-field-label">
                        Bracelet Size
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="j-size-guide-btn"
                      >
                        <Ruler size={12} /> Size Guide ?
                      </button>
                    </div>
                    <div className="j-select-wrap">
                      <select
                        id="pref-bracelet-size"
                        value={selectedBraceletSize}
                        onChange={(e) => setSelectedBraceletSize(e.target.value)}
                        className="j-select facet-oct-sm"
                      >
                        <option value="16 cm (Small)">16 cm (Small Wrist)</option>
                        <option value="17 cm (Medium)">17 cm (Standard Medium)</option>
                        <option value="18 cm (Large)">18 cm (Comfort Fit Large)</option>
                        <option value="19 cm (Extra Large)">19 cm (Extended Length)</option>
                      </select>
                      <ChevronDown size={14} className="j-select-chevron" />
                    </div>
                  </div>
                )}

                {isEarrings && (
                  <div className="j-form-field">
                    <label htmlFor="pref-backing" className="j-field-label">
                      Backing Type
                    </label>
                    <div className="j-select-wrap">
                      <select
                        id="pref-backing"
                        value={selectedBacking}
                        onChange={(e) => setSelectedBacking(e.target.value)}
                        className="j-select facet-oct-sm"
                      >
                        <option value="Four-Claw Post & Butterfly">Post & Scroll Butterfly</option>
                        <option value="Screw Back Security">Screw Back Security</option>
                        <option value="French Lever Clip">French Lever Clip</option>
                      </select>
                      <ChevronDown size={14} className="j-select-chevron" />
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity Stepper */}
              <div className="j-quantity-row">
                <label className="j-field-label">QUANTITY</label>
                <div className="j-stepper facet-oct-sm">
                  <button
                    type="button"
                    className="j-stepper-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="j-stepper-value">{quantity}</span>
                  <button
                    type="button"
                    className="j-stepper-btn"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="j-actions-stack">
              {/* ADD TO BAG */}
              <button
                type="button"
                onClick={handleAddToBag}
                className="button button-dark j-add-bag-btn facet-oct-sm"
              >
                ADD TO BAG
              </button>

              {/* ADD TO WISHLIST */}
              <button
                type="button"
                onClick={handleWishlistToggle}
                className={`button button-outline-dark j-wishlist-btn facet-oct-sm ${
                  isSavedInWishlist ? "active" : ""
                }`}
              >
                <Heart
                  size={16}
                  fill={isSavedInWishlist ? "var(--midnight)" : "none"}
                  strokeWidth={1.4}
                />
                {isSavedInWishlist ? "SAVED IN WISHLIST" : "ADD TO WISHLIST"}
              </button>

              {/* DUAL CONCIERGE ACTIONS */}
              <div className="j-concierge-row">
                <Link href="/expert" className="j-concierge-btn facet-oct-sm">
                  <MessageCircle size={15} strokeWidth={1.3} />
                  <span>SPEAK TO AN MAH EXPERT</span>
                </Link>
                <Link href="/appointments" className="j-concierge-btn facet-oct-sm">
                  <CalendarDays size={15} strokeWidth={1.3} />
                  <span>BOOK AN APPOINTMENT</span>
                </Link>
              </div>

              <p className="j-assistance-text">
                <em>Need assistance? Our experts are here to help.</em>
              </p>
            </div>
          </div>
        </aside>
      </section>

      {/* 3. PRODUCT INFORMATION HORIZONTAL TABS */}
      <section className="shell j-tabs-section">
        <div className="j-tabs-header" role="tablist" aria-label="Product Information Tabs">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "description"}
            className={`j-tab-trigger ${activeTab === "description" ? "active" : ""}`}
            onClick={() => setActiveTab("description")}
          >
            DESCRIPTION
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "details"}
            className={`j-tab-trigger ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            PRODUCT DETAILS
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "craftsmanship"}
            className={`j-tab-trigger ${activeTab === "craftsmanship" ? "active" : ""}`}
            onClick={() => setActiveTab("craftsmanship")}
          >
            CRAFTSMANSHIP
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "delivery"}
            className={`j-tab-trigger ${activeTab === "delivery" ? "active" : ""}`}
            onClick={() => setActiveTab("delivery")}
          >
            DELIVERY & CARE
          </button>
        </div>

        <div className="j-tabs-content-box facet-oct">
          <div className="j-tab-split-grid">
            {/* Left Content Area */}
            <div className="j-tab-left-pane">
              {activeTab === "description" && (
                <div className="j-tab-text-block">
                  <p className="j-lead-para">
                    A refined expression of timeless elegance, this {product.name.toLowerCase()} is designed to bring a subtle yet captivating brilliance to everyday moments and special occasions alike.
                  </p>
                  <p>
                    With its graceful silhouette and exquisite detailing, it is a piece to be worn, loved and passed on across generations. Hand-finished at our London bench with precision-balanced proportions.
                  </p>
                </div>
              )}

              {activeTab === "details" && (
                <div className="j-tab-text-block">
                  <h3 className="j-pane-title">Specifications & Metallurgy</h3>
                  <ul className="j-specs-list">
                    <li>
                      <strong>Precious Metal:</strong> Solid {selectedMetal} (Assay Hallmarked)
                    </li>
                    <li>
                      <strong>Diamond Grade:</strong> Colour D–F, Clarity VVS–VS, Triple Excellent Cut
                    </li>
                    <li>
                      <strong>Setting Style:</strong> Micro-bead hand claw architecture for maximum light return
                    </li>
                    <li>
                      <strong>Origin & Assay:</strong> British Assay Office Leopard Mark London
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === "craftsmanship" && (
                <div className="j-tab-text-block">
                  <h3 className="j-pane-title">Master Goldsmith Benchcraft</h3>
                  <p>
                    Every MAH jewellery creation begins with gouache artwork and millimeter-precise CAD design before undergoing rigorous alloy casting, hand rolling, microscopic stone seating and mirror polishing in London.
                  </p>
                  <p>
                    Mounting prongs are individually sculpted to conform exactly to the diamond girdle, ensuring heirloom durability and supreme security.
                  </p>
                </div>
              )}

              {activeTab === "delivery" && (
                <div className="j-tab-text-block">
                  <h3 className="j-pane-title">Insured Logistics & Lifelong Care</h3>
                  <p>
                    All acquisitions include complimentary fully-insured discreet express transit via specialized high-value courier.
                  </p>
                  <p>
                    Every creation is backed by MAH’s Lifetime Manufacturing Warranty, complimentary annual ultrasonic steam cleans, and lifetime claw inspections in our London salons.
                  </p>
                </div>
              )}
            </div>

            {/* Right Visual Banner: "BEAUTY IN A HIGHER FORM" */}
            <div className="j-tab-right-banner">
              <Image
                src="/images/journal-diamonds.jpg"
                alt="Editorial jewellery composition"
                fill
                sizes="(max-width: 900px) 100vw, 45vw"
                className="j-banner-bg-img"
              />
              <div className="j-banner-overlay" />
              <div className="j-banner-text-box">
                <span className="j-banner-kicker">BEAUTY</span>
                <span className="j-banner-sub">IN A HIGHER FORM</span>
                <div className="j-banner-line" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "YOU MAY ALSO LIKE" RELATED JEWELLERY GRID */}
      <section className="shell j-related-section">
        <div className="j-related-header">
          <h2 className="j-related-title">YOU MAY ALSO LIKE</h2>
          <Link href="/jewellery" className="j-explore-more-link">
            EXPLORE MORE JEWELLERY <ArrowRight size={13} />
          </Link>
        </div>

        <div className="j-related-grid">
          {recommendedItems.map((item) => {
            const isSaved = store.wishlist.includes(item.id);
            return (
              <article key={item.id} className="j-related-card facet-oct-sm">
                <div className="j-related-top-action">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      store.toggleWishlist(item.id);
                      if (!isSaved) toast.success(`${item.name} added to wishlist`);
                      else toast.info(`${item.name} removed from wishlist`);
                    }}
                    aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                    className={`j-card-heart-btn ${isSaved ? "active" : ""}`}
                  >
                    <Heart size={15} fill={isSaved ? "var(--midnight)" : "none"} strokeWidth={1.3} />
                  </button>
                </div>

                <Link href={`/jewellery/product?id=${item.id}`} className="j-related-card-link">
                  <div className="j-related-img-wrap">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 900px) 50vw, 25vw"
                      className="j-related-card-img"
                    />
                  </div>

                  <div className="j-related-info">
                    <h3 className="j-related-name">{item.name.toUpperCase()}</h3>
                    <p className="j-related-price">Price from MAH catalogue</p>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* 5. LIGHTBOX ZOOM MODAL */}
      {isZoomOpen && (
        <div className="j-zoom-modal-backdrop" onClick={() => setIsZoomOpen(false)}>
          <div className="j-zoom-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="j-zoom-close-btn"
              onClick={() => setIsZoomOpen(false)}
              aria-label="Close zoom modal"
            >
              <X size={20} />
            </button>
            <div className="j-zoom-image-stage">
              <Image
                src={mediaList[activeMediaIndex]}
                alt={product.name}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
            <p className="j-zoom-caption">{product.name} — High Magnification Inspection</p>
          </div>
        </div>
      )}

      {/* 6. SIZE GUIDE MODAL */}
      <RingSizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        initialSize={selectedRingSize}
        onSelectSize={(s) => setSelectedRingSize(s)}
      />
    </div>
  );
}

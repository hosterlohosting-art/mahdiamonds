"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageSquare,
  Play,
  Ruler,
  Sparkles,
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  Diamond,
} from "lucide-react";
import { products, money, getProduct, type Product } from "@/lib/demo-data";
import { useDemoStore } from "@/components/demo-store-provider";
import { RingSizeGuideModal } from "@/components/ring-size-guide-modal";
import type { RoutePage } from "@/lib/site-data";
import { toast } from "sonner";

interface WeddingRingDetailViewProps {
  page?: RoutePage;
  query?: Record<string, string | string[] | undefined>;
  productId?: string;
}

export function WeddingRingDetailView({
  page,
  query,
  productId,
}: WeddingRingDetailViewProps) {
  const store = useDemoStore();
  const router = useRouter();

  // 1. Resolve Active Product from Catalogue
  const targetId =
    productId ||
    (typeof query?.id === "string" ? query.id : undefined) ||
    "WR-003";

  const product: Product = useMemo(() => {
    const found = getProduct(targetId);
    if (found) return found;
    // Fallback to first wedding ring or default
    return (
      products.find((p) => p.category === "wedding") || {
        id: "WR-003",
        name: "Classic Wedding Ring",
        category: "wedding",
        style: "Plain",
        collection: "Vendôme Suite",
        metal: "18k Rose Gold",
        availableMetals: [
          "Platinum",
          "18k Yellow Gold",
          "18k Rose Gold",
          "18k White Gold",
        ],
        price: 750,
        gender: "unisex",
        width: "3mm",
        profile: "Traditional Court",
        isDiamond: false,
        description:
          "A soft curved silhouette with seamless silk-touch interior engineered for effortless daily wear.",
        image: "/images/metals/rose-gold.jpg",
        images: [
          "/images/metals/rose-gold.jpg",
          "/images/metals/platinum.jpg",
          "/images/styles/diamond-band.jpg",
        ],
      }
    );
  }, [targetId]);

  // 2. Product Options Configuration
  const availableMetals = product.availableMetals || [
    "Solid Platinum 950",
    "18k Yellow Gold",
    "18k White Gold",
    "18k Rose Gold",
  ];

  const availableWidths = ["2mm", "2.5mm", "3mm", "4mm", "5mm", "6mm"];
  const availableProfiles = [
    "Traditional Court",
    "Flat Court",
    "Flat Profile",
    "Contour / Shaped",
  ];
  const availableFinishes = [
    "High Polish Mirror",
    "Brushed / Satin",
    "Hammered Artisanal",
    "Milgrain Edge",
  ];
  const availableSizes = [
    "I",
    "J",
    "K",
    "L",
    "M (Standard)",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  const [selectedMetal, setSelectedMetal] = useState<string>(
    product.metal || "Solid Platinum 950"
  );
  const [selectedWidth, setSelectedWidth] = useState<string>(
    product.width || "3mm"
  );
  const [selectedProfile, setSelectedProfile] = useState<string>(
    product.profile || "Traditional Court"
  );
  const [selectedFinish, setSelectedFinish] = useState<string>(
    "High Polish Mirror"
  );
  const [selectedSize, setSelectedSize] = useState<string>("M (Standard)");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<
    "description" | "details" | "craftsmanship" | "delivery"
  >("description");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);

  // Gallery images preparation (5 slots matching wireframe)
  const galleryImages = useMemo(() => {
    const list: string[] = [];
    if (product.images && product.images.length > 0) {
      list.push(...product.images);
    } else {
      list.push(product.image);
    }

    // Ensure 4 high-res perspective views
    if (list.length === 1) {
      list.push(
        "/images/metals/platinum.jpg",
        "/images/styles/diamond-band.jpg",
        "/images/metals/yellow-gold.jpg"
      );
    } else if (list.length === 2) {
      list.push(
        "/images/styles/diamond-band.jpg",
        "/images/metals/platinum.jpg"
      );
    } else if (list.length === 3) {
      list.push("/images/metals/yellow-gold.jpg");
    }

    return list.slice(0, 4);
  }, [product]);

  // Dynamic Price calculation based on metal and width
  const dynamicPrice = useMemo(() => {
    let base = product.price;

    // Metal modifiers
    if (selectedMetal.includes("Platinum")) {
      if (!product.metal.includes("Platinum")) base += 250;
    } else if (selectedMetal.includes("18k")) {
      if (product.metal.includes("Platinum")) base -= 200;
    }

    // Width modifiers
    if (selectedWidth === "4mm") base += 80;
    else if (selectedWidth === "5mm") base += 160;
    else if (selectedWidth === "6mm") base += 240;
    else if (selectedWidth === "2mm") base -= 40;

    return Math.max(450, base);
  }, [product.price, product.metal, selectedMetal, selectedWidth]);

  // Wishlist handler
  const isWishlisted = store.wishlist.includes(product.id);
  const handleToggleWishlist = () => {
    store.toggleWishlist(product.id);
    if (isWishlisted) {
      toast.info(`${product.name} removed from wishlist.`);
    } else {
      toast.success(`${product.name} saved to your private wishlist.`);
    }
  };

  // Add to Bag handler
  const handleAddToBag = () => {
    const configuredItem = {
      id: product.id,
      name: product.name,
      productName: product.name,
      metal: selectedMetal,
      size: selectedSize,
      width: selectedWidth,
      profile: selectedProfile,
      finish: selectedFinish,
      price: dynamicPrice,
      image: galleryImages[activeImageIndex] || product.image,
      detail: `${selectedMetal} · ${selectedWidth} ${selectedProfile} · Size ${selectedSize} · ${selectedFinish}`,
    };

    store.addProduct(
      {
        ...product,
        price: dynamicPrice,
        metal: selectedMetal,
      },
      configuredItem.detail
    );

    toast.success(`${product.name} added to your Bag.`);
    router.push("/bag");
  };

  // Related products from catalogue (3 items)
  const relatedProducts = useMemo(() => {
    return products
      .filter((p) => p.category === "wedding" && p.id !== product.id)
      .slice(0, 3);
  }, [product.id]);

  return (
    <main id="main-content" className="wedding-ring-detail-page-10b">
      {/* 1. BREADCRUMBS */}
      <nav aria-label="Breadcrumb" className="shell wr-breadcrumb-nav">
        <ol className="wr-breadcrumb-list">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li className="wr-bc-sep">/</li>
          <li>
            <Link href="/wedding-rings">Wedding Rings</Link>
          </li>
          <li className="wr-bc-sep">/</li>
          <li className="wr-bc-current" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* 2. MAIN 3-COLUMN PRODUCT VIEWPORT & CONFIGURATION */}
      <section className="shell wr-product-main-grid">
        {/* LEFT COLUMN: 5-THUMBNAIL STRIP & LARGE VIEWPORT */}
        <div className="wr-gallery-composite">
          {/* Vertical Thumbnail Strip */}
          <div className="wr-thumbnails-column">
            {galleryImages.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                className={`wr-thumb-btn ${activeImageIndex === idx ? "active" : ""}`}
                onClick={() => setActiveImageIndex(idx)}
                aria-label={`View perspective ${idx + 1}`}
              >
                <div className="wr-thumb-img-wrap">
                  <Image
                    src={imgUrl}
                    alt={`${product.name} view ${idx + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>
              </button>
            ))}

            {/* 5th Slot: Video / 360 View */}
            <button
              type="button"
              className="wr-thumb-btn wr-thumb-video-btn"
              onClick={() => setIsVideoModalOpen(true)}
              aria-label="Play 360 product video"
            >
              <div className="wr-thumb-img-wrap">
                <Image
                  src={galleryImages[0]}
                  alt="360 View preview"
                  fill
                  className="object-contain opacity-70"
                />
                <div className="wr-play-overlay">
                  <Play size={16} fill="currentColor" />
                </div>
              </div>
            </button>
          </div>

          {/* Large Main Product Viewport */}
          <div className="wr-main-viewport">
            <div className="wr-viewport-img-wrap">
              <Image
                src={galleryImages[activeImageIndex]}
                alt={`${product.name} in ${selectedMetal}`}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 540px"
                className="object-contain"
              />

              {/* Prev / Next Carousel Controls */}
              <button
                type="button"
                onClick={() =>
                  setActiveImageIndex((prev) =>
                    prev === 0 ? galleryImages.length - 1 : prev - 1
                  )
                }
                className="wr-viewport-nav-btn wr-nav-prev"
                aria-label="Previous view"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveImageIndex((prev) =>
                    prev === galleryImages.length - 1 ? 0 : prev + 1
                  )
                }
                className="wr-viewport-nav-btn wr-nav-next"
                aria-label="Next view"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: PRODUCT INFO & CONFIGURATION */}
        <div className="wr-config-column">
          <div className="wr-header-block">
            <div className="wr-title-row">
              <span className="wr-eyebrow">WEDDING RINGS</span>
              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`wr-wishlist-heart-btn ${isWishlisted ? "active" : ""}`}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  size={20}
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </button>
            </div>

            <h1 className="wr-product-headline">{product.name}</h1>
            <p className="wr-product-subline">
              {product.description || "A refined expression of a lasting commitment."}
            </p>

            <div className="wr-price-display">
              <span className="wr-price-from-label">Price from</span>
              <strong className="wr-price-amount">{money(dynamicPrice)}</strong>
            </div>
          </div>

          {/* CONFIGURATION DROPDOWNS */}
          <div className="wr-options-form">
            {/* 1. METAL */}
            <div className="wr-opt-row">
              <label htmlFor="wr-metal-select" className="wr-opt-label">
                METAL
              </label>
              <div className="wr-select-wrap">
                <select
                  id="wr-metal-select"
                  value={selectedMetal}
                  onChange={(e) => setSelectedMetal(e.target.value)}
                  className="wr-opt-select"
                >
                  {availableMetals.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. WIDTH */}
            <div className="wr-opt-row">
              <label htmlFor="wr-width-select" className="wr-opt-label">
                WIDTH
              </label>
              <div className="wr-select-wrap">
                <select
                  id="wr-width-select"
                  value={selectedWidth}
                  onChange={(e) => setSelectedWidth(e.target.value)}
                  className="wr-opt-select"
                >
                  {availableWidths.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. PROFILE */}
            <div className="wr-opt-row">
              <label htmlFor="wr-profile-select" className="wr-opt-label">
                PROFILE
              </label>
              <div className="wr-select-wrap">
                <select
                  id="wr-profile-select"
                  value={selectedProfile}
                  onChange={(e) => setSelectedProfile(e.target.value)}
                  className="wr-opt-select"
                >
                  {availableProfiles.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. FINISH */}
            <div className="wr-opt-row">
              <label htmlFor="wr-finish-select" className="wr-opt-label">
                FINISH
              </label>
              <div className="wr-select-wrap">
                <select
                  id="wr-finish-select"
                  value={selectedFinish}
                  onChange={(e) => setSelectedFinish(e.target.value)}
                  className="wr-opt-select"
                >
                  {availableFinishes.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 5. RING SIZE & SIZE GUIDE */}
            <div className="wr-opt-row wr-size-row">
              <label htmlFor="wr-size-select" className="wr-opt-label">
                RING SIZE
              </label>
              <div className="wr-size-controls">
                <div className="wr-select-wrap wr-size-select-wrap">
                  <select
                    id="wr-size-select"
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="wr-opt-select"
                  >
                    {availableSizes.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="wr-size-guide-link"
                >
                  <Ruler size={14} />
                  <span>Size Guide</span>
                </button>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="wr-actions-stack">
              <button
                type="button"
                onClick={handleAddToBag}
                className="button button-dark button-wide wr-btn-add-bag"
              >
                <span>ADD TO BAG</span>
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`button button-outline-dark button-wide wr-btn-wishlist ${
                  isWishlisted ? "active" : ""
                }`}
              >
                <Heart
                  size={15}
                  fill={isWishlisted ? "currentColor" : "none"}
                />
                <span>
                  {isWishlisted ? "SAVED IN WISHLIST" : "ADD TO WISHLIST"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: NEED GUIDANCE? BOX */}
        <aside className="wr-guidance-column">
          <div className="wr-guidance-card facet-oct-sm">
            <h3 className="wr-guidance-title">NEED GUIDANCE?</h3>

            <div className="wr-guidance-links">
              <Link href="/expert" className="wr-guidance-link-item">
                <MessageSquare size={16} />
                <span>SPEAK TO AN MAH EXPERT</span>
                <ArrowRight size={13} className="wr-link-arrow" />
              </Link>

              <Link href="/appointments" className="wr-guidance-link-item">
                <Calendar size={16} />
                <span>BOOK AN APPOINTMENT</span>
                <ArrowRight size={13} className="wr-link-arrow" />
              </Link>
            </div>
          </div>
        </aside>
      </section>

      {/* 3. FOUR-TAB PRODUCT DETAILS SECTION */}
      <section className="shell wr-details-tabs-section">
        {/* Tab Header Navigation */}
        <div className="wr-tabs-nav-bar" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "description"}
            className={`wr-tab-btn ${activeTab === "description" ? "active" : ""}`}
            onClick={() => setActiveTab("description")}
          >
            DESCRIPTION
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "details"}
            className={`wr-tab-btn ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            PRODUCT DETAILS
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "craftsmanship"}
            className={`wr-tab-btn ${activeTab === "craftsmanship" ? "active" : ""}`}
            onClick={() => setActiveTab("craftsmanship")}
          >
            CRAFTSMANSHIP
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "delivery"}
            className={`wr-tab-btn ${activeTab === "delivery" ? "active" : ""}`}
            onClick={() => setActiveTab("delivery")}
          >
            DELIVERY & CARE
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="wr-tab-panel facet-oct-sm">
          {activeTab === "description" && (
            <div className="wr-tab-inner-content">
              <p className="wr-tab-lead-text">
                {product.description ||
                  "Product description text to be provided from MAH catalogue. This space includes key details about the ring design, materials and available product options, subject to the specific product."}
              </p>
              <p>
                Each MAH wedding ring is proportioned with exacting balance, designed to sit comfortably alongside your engagement ring or to make a distinguished statement worn alone. Handcrafted from responsibly sourced precious metals, every piece is individually assayed with the official London Goldsmiths&apos; Hall hallmark.
              </p>
            </div>
          )}

          {activeTab === "details" && (
            <div className="wr-tab-inner-content">
              <div className="wr-specs-grid-2col">
                <div className="wr-spec-row">
                  <span>Precious Metal</span>
                  <strong>{selectedMetal}</strong>
                </div>
                <div className="wr-spec-row">
                  <span>Band Width</span>
                  <strong>{selectedWidth}</strong>
                </div>
                <div className="wr-spec-row">
                  <span>Band Profile</span>
                  <strong>{selectedProfile}</strong>
                </div>
                <div className="wr-spec-row">
                  <span>Surface Finish</span>
                  <strong>{selectedFinish}</strong>
                </div>
                <div className="wr-spec-row">
                  <span>Hallmarking</span>
                  <strong>Goldsmiths&apos; Company Assay Office, London</strong>
                </div>
                <div className="wr-spec-row">
                  <span>Comfort Fit</span>
                  <strong>Curved internal ergonomic profile</strong>
                </div>
              </div>
            </div>
          )}

          {activeTab === "craftsmanship" && (
            <div className="wr-tab-inner-content">
              <p>
                Crafted in our London atelier by master goldsmiths, each band undergoes extensive precision lathe-turning, meticulous hand-burnishing, and multi-stage polishing. The seamless band construction ensures unbroken integrity and exceptional lifetime durability.
              </p>
              <div className="wr-craft-badges-row">
                <div className="wr-craft-badge">
                  <Award size={18} />
                  <span>London Atelier Handcrafted</span>
                </div>
                <div className="wr-craft-badge">
                  <Sparkles size={18} />
                  <span>Micro-Engineered Comfort Fit</span>
                </div>
                <div className="wr-craft-badge">
                  <ShieldCheck size={18} />
                  <span>Lifetime Craftsmanship Guarantee</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "delivery" && (
            <div className="wr-tab-inner-content">
              <div className="wr-specs-grid-2col">
                <div className="wr-spec-row">
                  <span>Insured Delivery</span>
                  <strong>Complimentary Royal Mail Special Delivery (Next-Day)</strong>
                </div>
                <div className="wr-spec-row">
                  <span>Salon Collection</span>
                  <strong>Available at 14 Mount Street, Mayfair Salon</strong>
                </div>
                <div className="wr-spec-row">
                  <span>Resizing Policy</span>
                  <strong>Complimentary 30-Day Resizing included</strong>
                </div>
                <div className="wr-spec-row">
                  <span>Presentation</span>
                  <strong>Signature midnight blue presentation box & wax-sealed dossier</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. YOU MAY ALSO LIKE (3-COLUMN RELATED RINGS GRID) */}
      <section className="shell wr-related-section">
        <h3 className="wr-related-title">YOU MAY ALSO LIKE</h3>

        <div className="wr-related-grid-3col">
          {relatedProducts.map((rel) => (
            <div key={rel.id} className="wr-related-card facet-oct-sm">
              <div className="wr-rel-media">
                <Image
                  src={rel.image}
                  alt={rel.name}
                  fill
                  className="object-contain"
                />
                <button
                  type="button"
                  onClick={() => store.toggleWishlist(rel.id)}
                  className={`wr-rel-wishlist ${
                    store.wishlist.includes(rel.id) ? "active" : ""
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart
                    size={16}
                    fill={
                      store.wishlist.includes(rel.id)
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              </div>

              <div className="wr-rel-info">
                <h4 className="wr-rel-name">{rel.name.toUpperCase()}</h4>
                <Link
                  href={`/wedding-rings/product?id=${rel.id}`}
                  className="wr-rel-link"
                >
                  <span>View Details</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. THREE-PILLAR CLIENT SERVICES ACTION ROW */}
      <section className="shell wr-services-strip-section">
        <div className="wr-services-grid-3col">
          {/* Pillar 1: Speak to Expert */}
          <div className="wr-service-card">
            <div className="wr-service-icon">
              <MessageSquare size={22} strokeWidth={1.3} />
            </div>
            <div className="wr-service-copy">
              <Link href="/expert" className="wr-service-title-link">
                <strong>SPEAK TO AN MAH EXPERT</strong>
              </Link>
              <p>Receive guidance on wedding rings and personalisation.</p>
            </div>
          </div>

          {/* Pillar 2: Book Appointment */}
          <div className="wr-service-card">
            <div className="wr-service-icon">
              <Calendar size={22} strokeWidth={1.3} />
            </div>
            <div className="wr-service-copy">
              <Link href="/appointments" className="wr-service-title-link">
                <strong>BOOK AN APPOINTMENT</strong>
              </Link>
              <p>Arrange a personal consultation with MAH.</p>
            </div>
          </div>

          {/* Pillar 3: Explore Bespoke */}
          <div className="wr-service-card">
            <div className="wr-service-icon">
              <Diamond size={22} strokeWidth={1.3} />
            </div>
            <div className="wr-service-copy">
              <Link href="/bespoke" className="wr-service-title-link">
                <strong>EXPLORE BESPOKE</strong>
              </Link>
              <p>Create something entirely your own.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SIZE GUIDE MODAL */}
      <RingSizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* VIDEO 360 MODAL */}
      {isVideoModalOpen && (
        <div
          className="cert-modal-backdrop"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            className="cert-modal-sheet facet-oct"
            style={{ maxWidth: 640 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cert-modal-header">
              <div className="cert-modal-logo">
                <span className="cert-badge-oct">360° VIEW</span>
                <h4>{product.name}</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="cert-close-btn"
              >
                ✕
              </button>
            </div>
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 9",
                background: "#0c1b54",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src={galleryImages[0]}
                alt="Product 360 representation"
                fill
                className="object-contain"
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(12, 27, 84, 0.85)",
                  color: "#ffffff",
                  padding: "6px 16px",
                  borderRadius: 20,
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                }}
              >
                360° Studio Rotation Active
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

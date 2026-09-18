"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Filter,
  Heart,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  Grid3X3,
  Grid2X2,
  X,
  Ruler,
  HelpCircle,
  ShieldCheck,
  Award,
  Gem,
  Check,
  Compass,
  Lock,
  Headphones,
  Eye,
} from "lucide-react";
import { products, getDiamond, type Product } from "@/lib/demo-data";
import { useDemoStore } from "@/components/demo-store-provider";
import type { RoutePage } from "@/lib/site-data";
import { RingSizeGuideModal } from "@/components/ring-size-guide-modal";
import { DiamondEducationSuite } from "@/components/diamond-education-suite";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface EngagementRingsLandingViewProps {
  page?: RoutePage;
  query?: Record<string, string | string[] | undefined>;
}

// 8 Diamond shapes with wireframe icon assets
const DIAMOND_SHAPES = [
  { id: "Round", label: "ROUND", icon: "/images/shapes/round.png" },
  { id: "Oval", label: "OVAL", icon: "/images/shapes/oval.png" },
  { id: "Emerald", label: "EMERALD", icon: "/images/shapes/emerald.png" },
  { id: "Pear", label: "PEAR", icon: "/images/shapes/pear.png" },
  { id: "Marquise", label: "MARQUISE", icon: "/images/shapes/marquise.png" },
  { id: "Cushion", label: "CUSHION", icon: "/images/shapes/cushion.png" },
  { id: "Radiant", label: "RADIANT", icon: "/images/shapes/radiant.png" },
  { id: "Princess", label: "PRINCESS", icon: "/images/shapes/princess.png" },
];

const AVAILABLE_STYLES = [
  "Solitaire",
  "Halo",
  "Three Stone",
  "Pavé",
  "Hidden Halo",
  "Vintage",
  "Twist",
];

const AVAILABLE_METALS = [
  { label: "18K White Gold", code: "18k White Gold", color: "#E2E8F0" },
  { label: "18K Yellow Gold", code: "18k Yellow Gold", color: "#EAB308" },
  { label: "18K Rose Gold", code: "18k Rose Gold", color: "#F472B6" },
  { label: "Platinum", code: "Platinum", color: "#94A3B8" },
];

const AVAILABLE_SETTING_DETAILS = [
  "Plain Band",
  "Cathedral Setting",
  "Hidden Halo",
  "Tapered Band",
];

export function EngagementRingsLandingView({ page, query }: EngagementRingsLandingViewProps) {
  const store = useDemoStore();

  // Diamond-First Context (Journey B)
  const incomingDiamondId = typeof query?.diamondId === "string" ? query.diamondId : store.ring.diamondId;
  const incomingDiamond = useMemo(() => {
    return incomingDiamondId ? getDiamond(incomingDiamondId) : null;
  }, [incomingDiamondId]);

  // Primary Horizontal Shape Selector State
  const initialShapeQuery = typeof query?.shape === "string" ? query.shape : incomingDiamond ? incomingDiamond.shape : undefined;
  const initialStyleQuery = typeof query?.style === "string" ? query.style : undefined;
  const initialMetalQuery = typeof query?.metal === "string" ? query.metal : undefined;

  const [selectedTopShape, setSelectedTopShape] = useState<string>(initialShapeQuery || "all");

  // Sidebar Filter States (Multi-select)
  const [selectedStyles, setSelectedStyles] = useState<string[]>(
    initialStyleQuery ? [initialStyleQuery] : []
  );
  const [selectedShapes, setSelectedShapes] = useState<string[]>(
    initialShapeQuery ? [initialShapeQuery] : []
  );
  const [selectedMetals, setSelectedMetals] = useState<string[]>(
    initialMetalQuery ? [initialMetalQuery] : []
  );
  const [selectedSettingDetails, setSelectedSettingDetails] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(500);
  const [maxPrice, setMaxPrice] = useState<number>(25000);
  const [priceApplied, setPriceApplied] = useState<{ min: number; max: number }>({ min: 500, max: 25000 });

  // Sorting & Display Layout
  const [sortBy, setSortBy] = useState<string>("featured");
  const [gridColumns, setGridColumns] = useState<4 | 2>(4);
  const [displayLimit, setDisplayLimit] = useState<number>(8);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);

  // Accordion open/collapse states
  const [openSections, setOpenSections] = useState({
    style: true,
    shape: true,
    metal: true,
    details: true,
    price: true,
  });

  // Per-card metal swatch selection overrides (e.g. { "ER-010": "18k Yellow Gold" })
  const [cardMetals, setCardMetals] = useState<Record<string, string>>({});

  // Modals
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const [isStylesGuideOpen, setIsStylesGuideOpen] = useState(false);
  const [isShapesGuideOpen, setIsShapesGuideOpen] = useState(false);

  // Toggle Accordion Section
  const toggleAccordion = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Engagement rings dataset
  const engagementRings = useMemo(() => {
    return products.filter((p) => p.category === "engagement");
  }, []);

  // Multi-select toggle helper
  const toggleArrayItem = (list: string[], item: string, setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter((x) => x !== item));
    } else {
      setter([...list, item]);
    }
  };

  // Handle Top Shape Strip Selection
  const handleTopShapeSelect = (shapeId: string) => {
    if (selectedTopShape === shapeId) {
      setSelectedTopShape("all");
      setSelectedShapes([]);
    } else {
      setSelectedTopShape(shapeId);
      setSelectedShapes([shapeId]);
    }
  };

  // Clear All Filters
  const handleClearAll = () => {
    setSelectedTopShape("all");
    setSelectedStyles([]);
    setSelectedShapes([]);
    setSelectedMetals([]);
    setSelectedSettingDetails([]);
    setMinPrice(500);
    setMaxPrice(25000);
    setPriceApplied({ min: 500, max: 25000 });
    toast.success("All filters have been reset");
  };

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedTopShape !== "all" && selectedShapes.length === 0) count++;
    count += selectedStyles.length;
    count += selectedShapes.length;
    count += selectedMetals.length;
    count += selectedSettingDetails.length;
    if (priceApplied.min > 500 || priceApplied.max < 25000) count++;
    return count;
  }, [selectedTopShape, selectedStyles, selectedShapes, selectedMetals, selectedSettingDetails, priceApplied]);

  // Dynamic Item Counts calculation for filter facets
  const facetCounts = useMemo(() => {
    const styleMap: Record<string, number> = {};
    const shapeMap: Record<string, number> = {};
    const metalMap: Record<string, number> = {};
    const detailMap: Record<string, number> = {};

    AVAILABLE_STYLES.forEach((s) => (styleMap[s] = 0));
    DIAMOND_SHAPES.forEach((s) => (shapeMap[s.id] = 0));
    AVAILABLE_METALS.forEach((m) => (metalMap[m.code] = 0));
    AVAILABLE_SETTING_DETAILS.forEach((d) => (detailMap[d] = 0));

    engagementRings.forEach((ring) => {
      // Style
      if (styleMap[ring.style] !== undefined) styleMap[ring.style]++;
      // Shapes
      ring.compatibleShapes?.forEach((shape) => {
        if (shapeMap[shape] !== undefined) shapeMap[shape]++;
      });
      // Metals
      ring.availableMetals?.forEach((metal) => {
        AVAILABLE_METALS.forEach((m) => {
          if (metal.toLowerCase().includes(m.code.toLowerCase()) || m.code.toLowerCase().includes(metal.toLowerCase())) {
            metalMap[m.code]++;
          }
        });
      });
      // Details
      ring.settingDetails?.forEach((d) => {
        if (detailMap[d] !== undefined) detailMap[d]++;
      });
    });

    return { styleMap, shapeMap, metalMap, detailMap };
  }, [engagementRings]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return engagementRings.filter((product) => {
      // 1. Top Shape Selector Filter
      if (selectedTopShape !== "all") {
        const matchesTopShape = product.compatibleShapes?.some(
          (s) => s.toLowerCase() === selectedTopShape.toLowerCase()
        );
        if (!matchesTopShape) return false;
      }

      // 2. Style Filter
      if (selectedStyles.length > 0) {
        const matchesStyle = selectedStyles.some(
          (style) => product.style.toLowerCase() === style.toLowerCase()
        );
        if (!matchesStyle) return false;
      }

      // 3. Compatible Shape Filter (from sidebar)
      if (selectedShapes.length > 0) {
        const matchesAnyShape = selectedShapes.some((shape) =>
          product.compatibleShapes?.some((s) => s.toLowerCase() === shape.toLowerCase())
        );
        if (!matchesAnyShape) return false;
      }

      // 4. Metal Filter
      if (selectedMetals.length > 0) {
        const matchesMetal = selectedMetals.some((metal) =>
          product.availableMetals?.some((m) => m.toLowerCase().includes(metal.toLowerCase())) ||
          product.metal.toLowerCase().includes(metal.toLowerCase())
        );
        if (!matchesMetal) return false;
      }

      // 5. Setting Details Filter
      if (selectedSettingDetails.length > 0) {
        const matchesDetails = selectedSettingDetails.some((detail) =>
          product.settingDetails?.includes(detail)
        );
        if (!matchesDetails) return false;
      }

      // 6. Price Range
      if (product.price < priceApplied.min || product.price > priceApplied.max) {
        return false;
      }

      return true;
    });
  }, [
    engagementRings,
    selectedTopShape,
    selectedStyles,
    selectedShapes,
    selectedMetals,
    selectedSettingDetails,
    priceApplied,
  ]);

  // Sorted Products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "newest") list.reverse();
    return list;
  }, [filteredProducts, sortBy]);

  // Handle Metal Swatch Click on Product Card
  const handleCardMetalChange = (productId: string, metalCode: string) => {
    setCardMetals((prev) => ({ ...prev, [productId]: metalCode }));
  };

  // Wishlist toggle handler
  const handleToggleWishlist = (productId: string, productName: string) => {
    store.toggleWishlist(productId);
    const isNowInWishlist = !store.wishlist.includes(productId);
    if (isNowInWishlist) {
      toast.success(`${productName} added to your private Wishlist`);
    } else {
      toast.info(`${productName} removed from Wishlist`);
    }
  };

  // Render Filter Sidebar Content (shared between desktop sidebar and mobile drawer)
  const renderFilterSidebar = () => (
    <div className="er-filter-sidebar-inner">
      {/* 1. RING STYLE */}
      <div className="er-filter-group">
        <button
          type="button"
          className="er-filter-group-header"
          onClick={() => toggleAccordion("style")}
        >
          <span>RING STYLE</span>
          {openSections.style ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSections.style && (
          <div className="er-filter-options-list">
            {AVAILABLE_STYLES.map((style) => {
              const isChecked = selectedStyles.includes(style);
              const count = facetCounts.styleMap[style] || 0;
              return (
                <label key={style} className="er-filter-checkbox-row">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleArrayItem(selectedStyles, style, setSelectedStyles)}
                  />
                  <span className="er-checkbox-custom">
                    {isChecked && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span className="er-option-label">{style}</span>
                  <span className="er-option-count">({count + 12})</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. COMPATIBLE DIAMOND SHAPE */}
      <div className="er-filter-group">
        <button
          type="button"
          className="er-filter-group-header"
          onClick={() => toggleAccordion("shape")}
        >
          <span>COMPATIBLE DIAMOND SHAPE</span>
          {openSections.shape ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSections.shape && (
          <div className="er-filter-options-list">
            {DIAMOND_SHAPES.map((shape) => {
              const isChecked = selectedShapes.includes(shape.id);
              const count = facetCounts.shapeMap[shape.id] || 0;
              return (
                <label key={shape.id} className="er-filter-checkbox-row">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleArrayItem(selectedShapes, shape.id, setSelectedShapes)}
                  />
                  <span className="er-checkbox-custom">
                    {isChecked && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span className="er-option-label">{shape.id}</span>
                  <span className="er-option-count">({count + 14})</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. METAL */}
      <div className="er-filter-group">
        <button
          type="button"
          className="er-filter-group-header"
          onClick={() => toggleAccordion("metal")}
        >
          <span>METAL</span>
          {openSections.metal ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSections.metal && (
          <div className="er-filter-options-list">
            {AVAILABLE_METALS.map((metal) => {
              const isChecked = selectedMetals.includes(metal.code);
              const count = facetCounts.metalMap[metal.code] || 0;
              return (
                <label key={metal.code} className="er-filter-checkbox-row">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleArrayItem(selectedMetals, metal.code, setSelectedMetals)}
                  />
                  <span
                    className="er-metal-swatch-dot"
                    style={{ backgroundColor: metal.color }}
                  />
                  <span className="er-option-label">{metal.label}</span>
                  <span className="er-option-count">({count + 24})</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. SETTING DETAILS */}
      <div className="er-filter-group">
        <button
          type="button"
          className="er-filter-group-header"
          onClick={() => toggleAccordion("details")}
        >
          <span>SETTING DETAILS</span>
          {openSections.details ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSections.details && (
          <div className="er-filter-options-list">
            {AVAILABLE_SETTING_DETAILS.map((detail) => {
              const isChecked = selectedSettingDetails.includes(detail);
              const count = facetCounts.detailMap[detail] || 0;
              return (
                <label key={detail} className="er-filter-checkbox-row">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() =>
                      toggleArrayItem(selectedSettingDetails, detail, setSelectedSettingDetails)
                    }
                  />
                  <span className="er-checkbox-custom">
                    {isChecked && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span className="er-option-label">{detail}</span>
                  <span className="er-option-count">({count + 18})</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. SETTING PRICE */}
      <div className="er-filter-group">
        <button
          type="button"
          className="er-filter-group-header"
          onClick={() => toggleAccordion("price")}
        >
          <span>SETTING PRICE</span>
          {openSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSections.price && (
          <div className="er-price-filter-box">
            <div className="er-price-inputs-row">
              <div className="er-price-input-wrapper">
                <span className="er-curr">£</span>
                <input
                  type="number"
                  min={500}
                  max={25000}
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  placeholder="500"
                />
              </div>
              <span className="er-price-sep">–</span>
              <div className="er-price-input-wrapper">
                <span className="er-curr">£</span>
                <input
                  type="number"
                  min={500}
                  max={25000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  placeholder="25000"
                />
              </div>
            </div>
            <button
              type="button"
              className="er-apply-price-btn facet-oct-sm"
              onClick={() => {
                setPriceApplied({ min: minPrice, max: maxPrice });
                toast.success(`Price range set: £${minPrice.toLocaleString()} – £${maxPrice.toLocaleString()}`);
                if (isFilterDrawerOpen) setIsFilterDrawerOpen(false);
              }}
            >
              APPLY FILTERS
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <main id="main-content" className="er-landing-page-05a">
      {/* 1. Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="er-breadcrumb-strip">
        <div className="shell">
          <ol className="er-breadcrumb-list">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-hidden="true" className="sep">
              ›
            </li>
            <li aria-current="page">Engagement Rings</li>
          </ol>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="er-hero-section-05a">
        <div className="shell er-hero-grid-05a">
          <div className="er-hero-content-05a">
            <p className="er-hero-eyebrow">ENGAGEMENT RINGS</p>
            <h1 className="er-hero-title">The beginning of your forever.</h1>
            <p className="er-hero-subtext">
              Timeless designs. Exceptional craftsmanship. Created to celebrate your love story.
            </p>
            <a
              href="#er-collection-section"
              className="button button-dark er-hero-cta facet-oct-sm"
            >
              EXPLORE THE COLLECTION
            </a>
          </div>
          <div className="er-hero-visual-05a">
            <div className="er-hero-image-wrapper">
              <Image
                src="/images/mah-hero-concept.png"
                alt="MAH Fine Engagement Ring Collection"
                fill
                priority
                className="object-cover"
              />
              <div className="er-hero-image-overlay" />
            </div>
          </div>
        </div>
      </section>

      {/* Diamond-First Journey Banner (Journey B) */}
      {incomingDiamond && (
        <div className="bg-[#0C1B54] text-[#FAF8F5] py-3 px-4 border-b border-[#C5A880]/50 sticky top-0 z-20 shadow-md">
          <div className="shell flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#C5A880] text-[#0C1B54] font-bold flex items-center justify-center text-[10px] shrink-0">
                ✓
              </span>
              <span>
                <strong>Step 2 of Diamond-First Journey:</strong> Selected {incomingDiamond.carat.toFixed(2)}ct {incomingDiamond.shape} ({incomingDiamond.colour}, {incomingDiamond.clarity}, {incomingDiamond.cut}, {incomingDiamond.certificate} Certified).
              </span>
            </div>
            <span className="text-[#C5A880] text-[11px] uppercase tracking-wider font-semibold">
              Select any compatible ring design below to mount your stone
            </span>
          </div>
        </div>
      )}

      {/* 3. Shop by Diamond Shape Strip */}
      <section className="er-shape-strip-section-05a">
        <div className="shell">
          <h2 className="er-shape-strip-heading">SHOP BY DIAMOND SHAPE</h2>
          <div className="er-shape-strip-grid">
            {DIAMOND_SHAPES.map((shape) => {
              const isSelected = selectedTopShape === shape.id;
              return (
                <button
                  key={shape.id}
                  type="button"
                  className={`er-shape-strip-card facet-oct-sm ${isSelected ? "is-selected" : ""}`}
                  onClick={() => handleTopShapeSelect(shape.id)}
                  aria-pressed={isSelected}
                >
                  <div className="er-shape-icon-wrap">
                    <Image
                      src={shape.icon}
                      alt={`${shape.label} diamond silhouette`}
                      width={38}
                      height={38}
                      className="object-contain er-shape-img"
                    />
                  </div>
                  <span className="er-shape-name">{shape.label}</span>
                </button>
              );
            })}
            <button
              type="button"
              className={`er-shape-strip-card er-shape-all-card facet-oct-sm ${selectedTopShape === "all" ? "is-selected" : ""}`}
              onClick={() => {
                setSelectedTopShape("all");
                setSelectedShapes([]);
              }}
            >
              <span className="er-shape-all-text">
                SHOP ALL <ArrowRight size={14} />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. Main Engagement Rings Collection Area */}
      <section id="er-collection-section" className="er-collection-main-section-05a">
        <div className="shell">
          <div className="er-collection-top-header">
            <h2 className="er-collection-title">ENGAGEMENT RINGS COLLECTION</h2>
          </div>

          {/* Controls Bar: Filter Toggle, Clear All, Active Filter Tags, Sort By, Grid Switch */}
          <div className="er-collection-controls-bar">
            <div className="er-controls-left">
              <button
                type="button"
                className="er-mobile-filter-trigger facet-oct-sm"
                onClick={() => setIsFilterDrawerOpen(true)}
              >
                <SlidersHorizontal size={15} />
                <span>FILTER</span>
                {activeFilterCount > 0 && (
                  <span className="er-filter-count-badge">{activeFilterCount}</span>
                )}
              </button>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  className="er-clear-all-btn"
                  onClick={handleClearAll}
                >
                  CLEAR ALL
                </button>
              )}
            </div>

            {/* Active Filter Tags */}
            {activeFilterCount > 0 && (
              <div className="er-active-tags-strip">
                {selectedTopShape !== "all" && (
                  <span className="er-tag-pill">
                    Shape: {selectedTopShape}
                    <button
                      type="button"
                      onClick={() => setSelectedTopShape("all")}
                      aria-label={`Remove shape ${selectedTopShape}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedStyles.map((style) => (
                  <span key={style} className="er-tag-pill">
                    {style}
                    <button
                      type="button"
                      onClick={() => toggleArrayItem(selectedStyles, style, setSelectedStyles)}
                      aria-label={`Remove style ${style}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {selectedShapes.map((shape) => (
                  <span key={shape} className="er-tag-pill">
                    {shape}
                    <button
                      type="button"
                      onClick={() => toggleArrayItem(selectedShapes, shape, setSelectedShapes)}
                      aria-label={`Remove shape ${shape}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {selectedMetals.map((metal) => (
                  <span key={metal} className="er-tag-pill">
                    {metal}
                    <button
                      type="button"
                      onClick={() => toggleArrayItem(selectedMetals, metal, setSelectedMetals)}
                      aria-label={`Remove metal ${metal}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {selectedSettingDetails.map((detail) => (
                  <span key={detail} className="er-tag-pill">
                    {detail}
                    <button
                      type="button"
                      onClick={() =>
                        toggleArrayItem(selectedSettingDetails, detail, setSelectedSettingDetails)
                      }
                      aria-label={`Remove detail ${detail}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {(priceApplied.min > 500 || priceApplied.max < 25000) && (
                  <span className="er-tag-pill">
                    £{priceApplied.min.toLocaleString()} - £{priceApplied.max.toLocaleString()}
                    <button
                      type="button"
                      onClick={() => {
                        setMinPrice(500);
                        setMaxPrice(25000);
                        setPriceApplied({ min: 500, max: 25000 });
                      }}
                      aria-label="Remove price filter"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}

            <div className="er-controls-right">
              <div className="er-sort-wrapper">
                <label htmlFor="er-sort-select">SORT BY:</label>
                <select
                  id="er-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="er-sort-select"
                >
                  <option value="featured">FEATURED</option>
                  <option value="price-asc">PRICE: LOW TO HIGH</option>
                  <option value="price-desc">PRICE: HIGH TO LOW</option>
                  <option value="newest">NEWEST ADDITIONS</option>
                </select>
              </div>

              <div className="er-grid-switchers" aria-label="Grid layout toggle">
                <button
                  type="button"
                  className={`er-grid-btn ${gridColumns === 4 ? "is-active" : ""}`}
                  onClick={() => setGridColumns(4)}
                  title="4 Column Grid"
                  aria-label="4 Column View"
                >
                  <Grid3X3 size={17} />
                </button>
                <button
                  type="button"
                  className={`er-grid-btn ${gridColumns === 2 ? "is-active" : ""}`}
                  onClick={() => setGridColumns(2)}
                  title="2 Column Grid"
                  aria-label="2 Column View"
                >
                  <Grid2X2 size={17} />
                </button>
              </div>
            </div>
          </div>

          {/* Main 2-Column Section: Left Filters & Right Product Grid */}
          <div className="er-collection-layout-05a">
            {/* Desktop Left Sidebar */}
            <aside className="er-desktop-sidebar">
              <div className="er-desktop-sidebar-sticky">
                {renderFilterSidebar()}
              </div>
            </aside>

            {/* Mobile Drawer Filter Sheet */}
            <Sheet open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
              <SheetContent side="left" className="er-sheet-container bg-[#FAF8F5]">
                <SheetHeader className="er-sheet-header">
                  <SheetTitle className="font-serif tracking-wider text-[#0C1B54]">FILTERS</SheetTitle>
                  <SheetDescription>Refine engagement ring designs</SheetDescription>
                </SheetHeader>
                <div className="er-sheet-scrollable-content">
                  {renderFilterSidebar()}
                </div>
              </SheetContent>
            </Sheet>

            {/* Right Product Grid */}
            <div className="er-product-content-area">
              {sortedProducts.length === 0 ? (
                <div className="er-no-results-box facet-oct-sm">
                  <RotateCcw size={32} className="text-[#C5A880] mx-auto mb-3 opacity-80" />
                  <h3>No rings match your exact filter criteria</h3>
                  <p>Try clearing some filters or expanding your price and style preferences.</p>
                  <button
                    type="button"
                    className="button button-dark facet-oct-sm mt-4"
                    onClick={handleClearAll}
                  >
                    RESET ALL FILTERS
                  </button>
                </div>
              ) : (
                <>
                  <div
                    className={`er-products-grid er-grid-cols-${gridColumns}`}
                  >
                    {sortedProducts.slice(0, displayLimit).map((product) => {
                      const activeMetal = cardMetals[product.id] || product.metal;
                      const activeImage =
                        product.metalImages?.[activeMetal] || product.image;
                      const isWishlisted = store.wishlist.includes(product.id);

                      const incomingDiamondId = typeof query?.diamondId === "string" ? query.diamondId : store.ring.diamondId;
                      const configureHref = `/engagement-rings/configure?id=${product.id}&metal=${encodeURIComponent(activeMetal)}${incomingDiamondId ? `&diamondId=${incomingDiamondId}` : ""}`;

                      return (
                        <article
                          key={product.id}
                          className="er-product-card facet-oct-sm"
                        >
                          {/* Top Wishlist Heart Toggle */}
                          <button
                            type="button"
                            className={`er-card-wishlist-btn ${isWishlisted ? "is-active" : ""}`}
                            onClick={() => handleToggleWishlist(product.id, product.name)}
                            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                          >
                            <Heart
                              size={18}
                              fill={isWishlisted ? "#8B263E" : "none"}
                              color={isWishlisted ? "#8B263E" : "#718096"}
                            />
                          </button>

                          {/* Product Image Stage */}
                          <Link href={configureHref} className="er-card-media-stage">
                            <div className="er-card-image-wrap">
                              <Image
                                src={activeImage}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                className="object-contain er-ring-img"
                              />
                            </div>
                          </Link>

                          {/* Product Details */}
                          <div className="er-card-body">
                            <h3 className="er-card-name">
                              <Link href={configureHref}>{product.name.toUpperCase()}</Link>
                            </h3>
                            <p className="er-card-style-meta">
                              {product.style} • {activeMetal}
                            </p>
                            <div className="er-card-price-row">
                              <span className="er-card-price-label">Setting from </span>
                              <strong className="er-card-price-val">
                                {store.formatMoney(product.price)}
                              </strong>
                            </div>
                            <p className="er-card-compatible-shapes">
                              Compatible with {product.compatibleShapes?.join(", ")}
                            </p>

                            {/* Metal Swatches Row */}
                            <div className="er-card-swatches-row">
                              {AVAILABLE_METALS.map((metal) => {
                                const isSelectedMetal = activeMetal.toLowerCase().includes(metal.code.toLowerCase()) || metal.code.toLowerCase().includes(activeMetal.toLowerCase());
                                return (
                                  <button
                                    key={metal.code}
                                    type="button"
                                    className={`er-metal-swatch-circle ${isSelectedMetal ? "is-selected" : ""}`}
                                    style={{ backgroundColor: metal.color }}
                                    title={metal.label}
                                    onClick={() => handleCardMetalChange(product.id, metal.code)}
                                    aria-label={`Select ${metal.label}`}
                                  />
                                );
                              })}
                            </div>

                            {/* Action CTA Button */}
                            <Link
                              href={configureHref}
                              className="er-card-cta-btn facet-oct-sm"
                            >
                              VIEW / CUSTOMISE RING
                            </Link>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {/* Load More Button */}
                  {displayLimit < sortedProducts.length && (
                    <div className="er-load-more-wrapper">
                      <button
                        type="button"
                        className="er-load-more-btn facet-oct-sm"
                        onClick={() => setDisplayLimit((prev) => prev + 8)}
                      >
                        LOAD MORE DESIGNS <ChevronDown size={15} />
                      </button>
                      <p className="er-load-more-counter">
                        Showing {Math.min(displayLimit, sortedProducts.length)} of {sortedProducts.length} designs
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Concierge Assistance Banner */}
      <section className="er-concierge-banner-section">
        <div className="shell">
          <div className="er-concierge-card facet-oct-sm">
            <div className="er-concierge-content">
              <div className="er-concierge-icon-circle">
                <Headphones size={22} className="text-[#0C1B54]" />
              </div>
              <div className="er-concierge-text">
                <h3>Need help choosing the perfect ring?</h3>
                <p>Our diamond experts are here to guide you.</p>
              </div>
            </div>
            <div className="er-concierge-actions">
              <Link
                href="/appointments"
                className="button button-burgundy facet-oct-sm er-concierge-btn-primary"
              >
                BOOK AN APPOINTMENT
              </Link>
              <Link
                href="/expert"
                className="button button-outline facet-oct-sm er-concierge-btn-secondary"
              >
                CHAT WITH AN EXPERT
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Engagement Ring Guidance (4-Card Educational Strip) */}
      <section className="er-guidance-section">
        <div className="shell">
          <h2 className="er-guidance-title">ENGAGEMENT RING GUIDANCE</h2>
          <div className="er-guidance-grid">
            {/* Card 1: Styles */}
            <article className="er-guidance-card facet-oct-sm">
              <div className="er-guidance-img-wrap">
                <Image
                  src="/images/mah-atelier-concept.png"
                  alt="Engagement Ring Styles"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="er-guidance-card-body">
                <h3>Engagement Ring Styles</h3>
                <p>Explore different styles and settings.</p>
                <button
                  type="button"
                  className="er-guidance-link"
                  onClick={() => setIsStylesGuideOpen(true)}
                >
                  READ GUIDE <ArrowRight size={13} />
                </button>
              </div>
            </article>

            {/* Card 2: Diamond Shapes */}
            <article className="er-guidance-card facet-oct-sm">
              <div className="er-guidance-img-wrap">
                <Image
                  src="/images/journal-diamonds.jpg"
                  alt="Diamond Shapes"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="er-guidance-card-body">
                <h3>Diamond Shapes</h3>
                <p>Find the shape that tells your love story.</p>
                <button
                  type="button"
                  className="er-guidance-link"
                  onClick={() => setIsShapesGuideOpen(true)}
                >
                  READ GUIDE <ArrowRight size={13} />
                </button>
              </div>
            </article>

            {/* Card 3: Ring Size Guide */}
            <article className="er-guidance-card facet-oct-sm">
              <div className="er-guidance-img-wrap">
                <Image
                  src="/images/mah-atelier-sketch.jpg"
                  alt="Ring Size Guide"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="er-guidance-card-body">
                <h3>Ring Size Guide</h3>
                <p>Find the perfect fit with confidence.</p>
                <button
                  type="button"
                  className="er-guidance-link"
                  onClick={() => setIsSizeGuideOpen(true)}
                >
                  READ GUIDE <ArrowRight size={13} />
                </button>
              </div>
            </article>

            {/* Card 4: Natural vs Lab-Grown Diamonds */}
            <article className="er-guidance-card facet-oct-sm">
              <div className="er-guidance-img-wrap">
                <Image
                  src="/images/journal-hero-17a.jpg"
                  alt="Natural vs Lab-Grown Diamonds"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="er-guidance-card-body">
                <h3>Natural vs Lab-Grown Diamonds</h3>
                <p>Understand the differences and choose with clarity.</p>
                <button
                  type="button"
                  className="er-guidance-link"
                  onClick={() => setIsEducationOpen(true)}
                >
                  READ GUIDE <ArrowRight size={13} />
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 7. 5-Pillar Hallmark Badges Strip */}
      <section className="er-hallmark-strip-section">
        <div className="shell">
          <div className="er-hallmarks-grid">
            <div className="er-hallmark-item">
              <div className="er-hallmark-icon-wrap">
                <Gem size={22} className="text-[#0C1B54]" />
              </div>
              <span className="er-hallmark-text">ETHICALLY SOURCED DIAMONDS</span>
            </div>
            <div className="er-hallmark-item">
              <div className="er-hallmark-icon-wrap">
                <Award size={22} className="text-[#0C1B54]" />
              </div>
              <span className="er-hallmark-text">EXPERT CRAFTSMANSHIP IN LONDON</span>
            </div>
            <div className="er-hallmark-item">
              <div className="er-hallmark-icon-wrap">
                <ShieldCheck size={22} className="text-[#0C1B54]" />
              </div>
              <span className="er-hallmark-text">CONFLICT-FREE COMMITMENT</span>
            </div>
            <div className="er-hallmark-item">
              <div className="er-hallmark-icon-wrap">
                <Compass size={22} className="text-[#0C1B54]" />
              </div>
              <span className="er-hallmark-text">BESPOKE DESIGN YOUR STORY</span>
            </div>
            <div className="er-hallmark-item">
              <div className="er-hallmark-icon-wrap">
                <Lock size={22} className="text-[#0C1B54]" />
              </div>
              <span className="er-hallmark-text">SECURE & INSURED DELIVERY*</span>
            </div>
          </div>
          <p className="er-hallmark-disclaimer">*Where available</p>
        </div>
      </section>

      {/* Modals */}
      {/* 1. Ring Size Guide Modal */}
      <RingSizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* 2. Diamond Education Suite Modal */}
      {isEducationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C1B54]/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl bg-[#FAF8F5] p-6 md:p-8 rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto border border-[#C5A880]/30">
            <button
              type="button"
              onClick={() => setIsEducationOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-200 transition-colors"
              aria-label="Close Education Modal"
            >
              <X size={20} />
            </button>
            <DiamondEducationSuite />
          </div>
        </div>
      )}

      {/* 3. Styles Guide Modal */}
      {isStylesGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C1B54]/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-[#FAF8F5] p-6 md:p-8 rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto border border-[#C5A880]/30">
            <button
              type="button"
              onClick={() => setIsStylesGuideOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-200 transition-colors"
              aria-label="Close Styles Guide"
            >
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">MAH Diamantaire Guide</span>
              <h2 className="font-serif text-2xl md:text-3xl text-[#0C1B54] mt-1">Engagement Ring Styles</h2>
              <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto">
                Discover the architectural characteristics, light dynamics, and aesthetic personality of MAH’s signature setting styles.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded border border-[#E8E1D5]">
                <h4 className="font-serif text-lg text-[#0C1B54] font-semibold">Classic Solitaire</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  The purest expression of diamond brilliance. A single certified stone held in high relief by 4 or 6 talon claws to maximize 360° light transmission.
                </p>
              </div>
              <div className="p-4 bg-white rounded border border-[#E8E1D5]">
                <h4 className="font-serif text-lg text-[#0C1B54] font-semibold">Micropavé Halo</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  A continuous halo of calibrated brilliant-cut diamonds framing the centre gem, adding visual diameter and breathtaking peripheral sparkle.
                </p>
              </div>
              <div className="p-4 bg-white rounded border border-[#E8E1D5]">
                <h4 className="font-serif text-lg text-[#0C1B54] font-semibold">Trilogy Three-Stone</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Symbolizing the journey of love — Past, Present, and Future. Flanked by graduated pear, baguette, or round shoulder diamonds.
                </p>
              </div>
              <div className="p-4 bg-white rounded border border-[#E8E1D5]">
                <h4 className="font-serif text-lg text-[#0C1B54] font-semibold">Hidden Halo & Cathedral</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Concealed diamond galleries and sweeping arches visible from the side profile, offering secret luxury known only to the wearer.
                </p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                type="button"
                className="button button-dark facet-oct-sm px-6 py-2.5 text-xs tracking-wider"
                onClick={() => setIsStylesGuideOpen(false)}
              >
                CLOSE & EXPLORE STYLES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Shapes Guide Modal */}
      {isShapesGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C1B54]/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-[#FAF8F5] p-6 md:p-8 rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto border border-[#C5A880]/30">
            <button
              type="button"
              onClick={() => setIsShapesGuideOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-200 transition-colors"
              aria-label="Close Shapes Guide"
            >
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">Gemmology Reference</span>
              <h2 className="font-serif text-2xl md:text-3xl text-[#0C1B54] mt-1">Diamond Shapes & Silhouettes</h2>
              <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto">
                Each diamond cut creates unique optical scintillation, fire, and finger-flattering proportions.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DIAMOND_SHAPES.map((shape) => (
                <div key={shape.id} className="p-3 bg-white rounded border border-[#E8E1D5] text-center flex flex-col items-center">
                  <Image src={shape.icon} alt={shape.label} width={34} height={34} className="mb-2 object-contain" />
                  <span className="font-serif text-xs font-bold text-[#0C1B54]">{shape.label}</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    {shape.id === "Round" ? "57-facet brilliance" : shape.id === "Emerald" ? "Step-cut hall of mirrors" : shape.id === "Oval" ? "Elongating brilliance" : "Distinctive silhouette"}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button
                type="button"
                className="button button-dark facet-oct-sm px-6 py-2.5 text-xs tracking-wider"
                onClick={() => setIsShapesGuideOpen(false)}
              >
                CLOSE & CHOOSE SHAPE
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

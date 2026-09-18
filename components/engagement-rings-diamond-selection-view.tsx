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
  RotateCcw,
  RotateCw,
  Scale,
  Search,
  SlidersHorizontal,
  Sparkles,
  Award,
  Truck,
  ShieldCheck,
  X,
  Mail,
  MessageSquare,
  FileText,
} from "lucide-react";
import { products, diamonds, getProduct, getDiamond, type Product, type Diamond } from "@/lib/demo-data";
import { useDemoStore } from "@/components/demo-store-provider";
import type { RoutePage } from "@/lib/site-data";
import { DiamondEducationSuite } from "@/components/diamond-education-suite";
import { toast } from "sonner";

interface EngagementRingsDiamondSelectionViewProps {
  page?: RoutePage;
  query?: Record<string, string | string[] | undefined>;
}

export function EngagementRingsDiamondSelectionView({ page, query }: EngagementRingsDiamondSelectionViewProps) {
  const store = useDemoStore();
  const router = useRouter();

  // 1. Resolve Configured Ring Setting
  const settingId = typeof query?.setting === "string" ? query.setting : typeof query?.id === "string" ? query.id : store.ring.settingId || "ER-000";
  const product = useMemo(() => {
    return products.find((p) => p.id === settingId) || getProduct("ER-000");
  }, [settingId]);

  const selectedMetal = typeof query?.metal === "string" ? query.metal : store.ring.metal || product.metal;
  const selectedShape = typeof query?.shape === "string" ? query.shape : store.ring.diamondShape || "Round";
  const selectedBand = typeof query?.band === "string" ? query.band : store.ring.bandStyle || "Classic (2.0mm)";
  const selectedSize = typeof query?.size === "string" ? query.size : store.ring.size || "L 1/2";
  const bandSurcharge = store.ring.bandSurcharge || 0;
  const settingSubtotal = product.price + bandSurcharge;

  // 2. Diamond Provenance State (Natural vs Lab-Grown)
  const initialType = (query?.type === "Lab-grown" || store.ring.diamondType === "Lab-grown") ? "Lab-grown" : "Natural";
  const [activeType, setActiveType] = useState<"Natural" | "Lab-grown">(initialType);

  // 3. Filter States
  const [minPrice, setMinPrice] = useState<number>(500);
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [minCarat, setMinCarat] = useState<number>(0.30);
  const [maxCarat, setMaxCarat] = useState<number>(3.50);
  const [selectedColours, setSelectedColours] = useState<string[]>([]);
  const [selectedClarities, setSelectedClarities] = useState<string[]>([]);
  const [selectedCuts, setSelectedCuts] = useState<string[]>([]);
  const [selectedLabs, setSelectedLabs] = useState<string[]>([]);
  const [selectedPolish, setSelectedPolish] = useState<string[]>([]);
  const [selectedSymmetry, setSelectedSymmetry] = useState<string[]>([]);
  const [selectedFluorescence, setSelectedFluorescence] = useState<string[]>([]);

  // Advanced Filters Accordion
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("best-match");

  // 4. Active Preview Diamond for Right Flyout Dossier
  const [activeDossierDiamondId, setActiveDossierDiamondId] = useState<string>("D-001");

  // 5. Comparison Drawer State (up to 3 diamonds)
  const [comparedDiamondIds, setComparedDiamondIds] = useState<string[]>(["D-001", "D-003"]);
  const [isComparisonDrawerOpen, setIsComparisonDrawerOpen] = useState<boolean>(true);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState<boolean>(false);

  // 6. Modals
  const [isEducationModalOpen, setIsEducationModalOpen] = useState<boolean>(false);
  const [isGiaModalOpen, setIsGiaModalOpen] = useState<boolean>(false);
  const [isRequestDiamondModalOpen, setIsRequestDiamondModalOpen] = useState<boolean>(false);

  // Filter diamonds by active setting compatibility + filters
  const filteredDiamonds = useMemo(() => {
    return diamonds.filter((diamond) => {
      // Provenance
      if (diamond.type !== activeType) return false;

      // Shape compatibility with chosen setting shape
      if (selectedShape !== "all" && diamond.shape.toLowerCase() !== selectedShape.toLowerCase()) {
        return false;
      }

      // Price
      if (diamond.price < minPrice || diamond.price > maxPrice) return false;

      // Carat
      if (diamond.carat < minCarat || diamond.carat > maxCarat) return false;

      // Colour
      if (selectedColours.length > 0 && !selectedColours.includes(diamond.colour)) return false;

      // Clarity
      if (selectedClarities.length > 0 && !selectedClarities.includes(diamond.clarity)) return false;

      // Cut
      if (selectedCuts.length > 0 && !selectedCuts.includes(diamond.cut)) return false;

      // Lab
      if (selectedLabs.length > 0 && !selectedLabs.includes(diamond.certificate)) return false;

      // Polish
      if (selectedPolish.length > 0 && (!diamond.polish || !selectedPolish.includes(diamond.polish))) return false;

      // Symmetry
      if (selectedSymmetry.length > 0 && (!diamond.symmetry || !selectedSymmetry.includes(diamond.symmetry))) return false;

      // Fluorescence
      if (selectedFluorescence.length > 0 && (!diamond.fluorescence || !selectedFluorescence.includes(diamond.fluorescence))) return false;

      return true;
    });
  }, [
    activeType,
    selectedShape,
    minPrice,
    maxPrice,
    minCarat,
    maxCarat,
    selectedColours,
    selectedClarities,
    selectedCuts,
    selectedLabs,
    selectedPolish,
    selectedSymmetry,
    selectedFluorescence,
  ]);

  // Sorted diamonds
  const sortedDiamonds = useMemo(() => {
    const list = [...filteredDiamonds];
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "carat-asc") list.sort((a, b) => a.carat - b.carat);
    else if (sortBy === "carat-desc") list.sort((a, b) => b.carat - a.carat);
    return list;
  }, [filteredDiamonds, sortBy]);

  // Resolved Active Dossier Diamond
  const activeDossierDiamond = useMemo(() => {
    return diamonds.find((d) => d.id === activeDossierDiamondId) || sortedDiamonds[0] || diamonds[0];
  }, [activeDossierDiamondId, sortedDiamonds]);

  // Resolved Compared Diamonds
  const comparedDiamonds = useMemo(() => {
    return comparedDiamondIds.map((id) => diamonds.find((d) => d.id === id)).filter(Boolean) as Diamond[];
  }, [comparedDiamondIds]);

  // Comparison Handlers
  const toggleCompareDiamond = (id: string) => {
    if (comparedDiamondIds.includes(id)) {
      setComparedDiamondIds((prev) => prev.filter((item) => item !== id));
      toast.info("Diamond removed from comparison");
    } else {
      if (comparedDiamondIds.length >= 3) {
        toast.warning("You can compare a maximum of 3 diamonds side-by-side");
        return;
      }
      setComparedDiamondIds((prev) => [...prev, id]);
      toast.success("Diamond added to comparison drawer");
    }
  };

  const handleClearComparison = () => {
    setComparedDiamondIds([]);
    toast.info("Comparison list cleared");
  };

  // Reset Filters
  const handleResetFilters = () => {
    setMinPrice(500);
    setMaxPrice(20000);
    setMinCarat(0.30);
    setMaxCarat(3.50);
    setSelectedColours([]);
    setSelectedClarities([]);
    setSelectedCuts([]);
    setSelectedLabs([]);
    setSelectedPolish([]);
    setSelectedSymmetry([]);
    setSelectedFluorescence([]);
    toast.success("Filters reset to default");
  };

  // Multi-select toggle helper
  const toggleFacet = (list: string[], item: string, setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter((x) => x !== item));
    } else {
      setter([...list, item]);
    }
  };

  // Select Diamond & Return to Ring Configurator
  const handleSelectDiamond = (diamond: Diamond) => {
    store.updateRing({
      diamondId: diamond.id,
      diamondShape: diamond.shape,
      diamondType: diamond.type,
    });
    toast.success(`${diamond.carat.toFixed(2)} ct ${diamond.shape} diamond selected for ${product.name}`);
    router.push(`/engagement-rings/review?setting=${product.id}&diamondId=${diamond.id}&metal=${encodeURIComponent(selectedMetal)}&band=${encodeURIComponent(selectedBand)}&size=${encodeURIComponent(selectedSize)}&shape=${encodeURIComponent(diamond.shape)}`);
  };

  return (
    <main id="main-content" className="er-diamonds-page-05c">
      {/* 1. Breadcrumbs & Header */}
      <nav aria-label="Breadcrumb" className="er-diamond-breadcrumbs-strip">
        <div className="shell">
          <ol className="er-breadcrumbs-list">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-hidden="true" className="sep">›</li>
            <li>
              <Link href="/engagement-rings">Engagement Rings</Link>
            </li>
            <li aria-hidden="true" className="sep">›</li>
            <li>
              <Link href={`/engagement-rings/configure?id=${product.id}`}>{product.name}</Link>
            </li>
            <li aria-hidden="true" className="sep">›</li>
            <li aria-current="page">Choose Your Diamond</li>
          </ol>
        </div>
      </nav>

      {/* 2. Top Title & Configured Ring Context Banner */}
      <section className="er-diamond-top-section">
        <div className="shell">
          <h1 className="er-diamond-main-title">Choose Your Centre Diamond</h1>
          <p className="er-diamond-main-subtext">
            Only diamonds compatible with your selected ring and shape are shown.
          </p>

          {/* Configured Ring Setting Reassurance Banner */}
          <div className="er-ring-context-banner facet-oct-sm">
            <div className="er-ring-context-media">
              <Image
                src={product.metalImages?.[selectedMetal] || product.image}
                alt={product.name}
                width={72}
                height={72}
                className="object-contain"
              />
            </div>
            <div className="er-ring-context-info">
              <span className="er-ring-context-eyebrow">YOUR RING SETTING</span>
              <h2 className="er-ring-context-name">{product.name}</h2>
              <p className="er-ring-context-specs">
                {selectedShape} Brilliant · {selectedMetal} · {selectedBand}
              </p>
              <span className="er-ring-context-price">
                Setting Price: <strong>{store.formatMoney(settingSubtotal)}</strong>
              </span>
            </div>
            <Link
              href={`/engagement-rings/configure?id=${product.id}&metal=${encodeURIComponent(selectedMetal)}&band=${encodeURIComponent(selectedBand)}&size=${encodeURIComponent(selectedSize)}`}
              className="er-change-setting-btn facet-oct-sm"
            >
              CHANGE SETTING ✏
            </Link>
          </div>

          {/* Provenance Tabs: Natural vs Lab-Grown */}
          <div className="er-diamond-type-tabs-container">
            <div className="er-diamond-type-tabs">
              <button
                type="button"
                className={`er-type-tab-btn ${activeType === "Natural" ? "is-active" : ""}`}
                onClick={() => setActiveType("Natural")}
              >
                <DiamondIcon size={16} />
                <span>NATURAL DIAMOND</span>
              </button>
              <button
                type="button"
                className={`er-type-tab-btn ${activeType === "Lab-grown" ? "is-active" : ""}`}
                onClick={() => setActiveType("Lab-grown")}
              >
                <Sparkles size={16} />
                <span>LAB-GROWN DIAMOND</span>
              </button>
            </div>

            {/* Guidance Bar */}
            <div className="er-diamond-guidance-bar facet-oct-sm">
              <div className="er-guidance-bar-left">
                <HelpCircle size={16} className="text-[#8F7243]" />
                <span>
                  <strong>Not sure which is right for you?</strong> Our experts can guide you through the optical and investment differences.
                </span>
                <button
                  type="button"
                  className="er-guidance-modal-link"
                  onClick={() => setIsEducationModalOpen(true)}
                >
                  Learn More →
                </button>
              </div>
              <Link href="/appointments" className="button button-outline facet-oct-sm er-guidance-appt-btn">
                BOOK AN APPOINTMENT
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main 3-Column Work Area: Left Filters | Centre Results | Right Flyout Dossier */}
      <section className="er-diamond-workspace-section">
        <div className="shell er-diamond-workspace-grid">
          {/* Column 1: Left Filter Sidebar */}
          <aside className="er-filter-sidebar-05c">
            <div className="er-sidebar-sticky-wrap">
              <div className="er-sidebar-header">
                <div className="er-sidebar-title-badge">
                  <span className="er-badge-num">1</span>
                  <h3>FILTER DIAMONDS</h3>
                </div>
                <button
                  type="button"
                  className="er-reset-filters-btn"
                  onClick={handleResetFilters}
                >
                  Reset All ↺
                </button>
              </div>

              {/* ESSENTIAL FILTERS */}
              <div className="er-filter-block">
                <span className="er-filter-block-title">ESSENTIAL FILTERS</span>

                {/* Price Filter */}
                <div className="er-filter-field">
                  <label className="er-field-label">
                    <span>Price</span>
                    <strong>£{minPrice.toLocaleString()} – £{maxPrice.toLocaleString()}+</strong>
                  </label>
                  <div className="er-dual-inputs-row">
                    <input
                      type="number"
                      min={500}
                      max={50000}
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className="er-filter-input"
                    />
                    <span className="sep">–</span>
                    <input
                      type="number"
                      min={500}
                      max={50000}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="er-filter-input"
                    />
                  </div>
                </div>

                {/* Carat Filter */}
                <div className="er-filter-field">
                  <label className="er-field-label">
                    <span>Carat</span>
                    <strong>{minCarat.toFixed(2)} – {maxCarat.toFixed(2)}+ ct</strong>
                  </label>
                  <div className="er-dual-inputs-row">
                    <input
                      type="number"
                      step="0.05"
                      min={0.30}
                      max={5.00}
                      value={minCarat}
                      onChange={(e) => setMinCarat(Number(e.target.value))}
                      className="er-filter-input"
                    />
                    <span className="sep">–</span>
                    <input
                      type="number"
                      step="0.05"
                      min={0.30}
                      max={5.00}
                      value={maxCarat}
                      onChange={(e) => setMaxCarat(Number(e.target.value))}
                      className="er-filter-input"
                    />
                  </div>
                </div>

                {/* Colour Filter */}
                <div className="er-filter-field">
                  <label className="er-field-label">
                    <span>Colour</span>
                  </label>
                  <div className="er-pill-buttons-row">
                    {["D", "E", "F", "G", "H", "I", "J"].map((col) => {
                      const isSelected = selectedColours.includes(col);
                      return (
                        <button
                          key={col}
                          type="button"
                          className={`er-filter-pill-btn ${isSelected ? "is-selected" : ""}`}
                          onClick={() => toggleFacet(selectedColours, col, setSelectedColours)}
                        >
                          {col}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Clarity Filter */}
                <div className="er-filter-field">
                  <label className="er-field-label">
                    <span>Clarity</span>
                  </label>
                  <div className="er-pill-buttons-row">
                    {["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1"].map((cla) => {
                      const isSelected = selectedClarities.includes(cla);
                      return (
                        <button
                          key={cla}
                          type="button"
                          className={`er-filter-pill-btn ${isSelected ? "is-selected" : ""}`}
                          onClick={() => toggleFacet(selectedClarities, cla, setSelectedClarities)}
                        >
                          {cla}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Cut Filter */}
                <div className="er-filter-field">
                  <label className="er-field-label">
                    <span>Cut</span>
                  </label>
                  <div className="er-pill-buttons-row">
                    {["Excellent", "Very Good", "Good"].map((cut) => {
                      const isSelected = selectedCuts.includes(cut);
                      return (
                        <button
                          key={cut}
                          type="button"
                          className={`er-filter-pill-btn ${isSelected ? "is-selected" : ""}`}
                          onClick={() => toggleFacet(selectedCuts, cut, setSelectedCuts)}
                        >
                          {cut === "Excellent" ? "EX" : cut === "Very Good" ? "VG" : "G"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ADVANCED FILTERS Accordion */}
              <div className="er-filter-block">
                <button
                  type="button"
                  className="er-advanced-toggle-btn"
                  onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                >
                  <span>ADVANCED FILTERS</span>
                  {isAdvancedOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {isAdvancedOpen && (
                  <div className="er-advanced-filters-content">
                    {/* Lab */}
                    <div className="er-filter-field">
                      <label className="er-field-label">Certification Laboratory</label>
                      <div className="er-pill-buttons-row">
                        {["GIA", "IGI"].map((lab) => (
                          <button
                            key={lab}
                            type="button"
                            className={`er-filter-pill-btn ${selectedLabs.includes(lab) ? "is-selected" : ""}`}
                            onClick={() => toggleFacet(selectedLabs, lab, setSelectedLabs)}
                          >
                            {lab}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Polish */}
                    <div className="er-filter-field">
                      <label className="er-field-label">Polish</label>
                      <div className="er-pill-buttons-row">
                        {["Excellent", "Very Good"].map((pol) => (
                          <button
                            key={pol}
                            type="button"
                            className={`er-filter-pill-btn ${selectedPolish.includes(pol) ? "is-selected" : ""}`}
                            onClick={() => toggleFacet(selectedPolish, pol, setSelectedPolish)}
                          >
                            {pol === "Excellent" ? "EX" : "VG"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Symmetry */}
                    <div className="er-filter-field">
                      <label className="er-field-label">Symmetry</label>
                      <div className="er-pill-buttons-row">
                        {["Excellent", "Very Good"].map((sym) => (
                          <button
                            key={sym}
                            type="button"
                            className={`er-filter-pill-btn ${selectedSymmetry.includes(sym) ? "is-selected" : ""}`}
                            onClick={() => toggleFacet(selectedSymmetry, sym, setSelectedSymmetry)}
                          >
                            {sym === "Excellent" ? "EX" : "VG"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Fluorescence */}
                    <div className="er-filter-field">
                      <label className="er-field-label">Fluorescence</label>
                      <div className="er-pill-buttons-row">
                        {["None", "Faint", "Medium"].map((fluo) => (
                          <button
                            key={fluo}
                            type="button"
                            className={`er-filter-pill-btn ${selectedFluorescence.includes(fluo) ? "is-selected" : ""}`}
                            onClick={() => toggleFacet(selectedFluorescence, fluo, setSelectedFluorescence)}
                          >
                            {fluo}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Apply & Save Buttons */}
              <div className="er-sidebar-actions">
                <button
                  type="button"
                  className="button button-dark button-wide facet-oct-sm er-apply-btn"
                  onClick={() => toast.success(`Filters applied: ${sortedDiamonds.length} diamonds found`)}
                >
                  APPLY FILTERS ({sortedDiamonds.length})
                </button>
                <button
                  type="button"
                  className="er-save-search-link"
                  onClick={() => toast.success("Search criteria saved to your account preferences")}
                >
                  <Heart size={13} /> Save Search
                </button>
              </div>
            </div>
          </aside>

          {/* Column 2: Centre Diamond Results List */}
          <div className="er-diamond-results-column">
            {/* Results Controls Bar */}
            <div className="er-results-controls-bar">
              <span className="er-results-count">
                <strong>{sortedDiamonds.length} Diamonds Found</strong>
              </span>

              <div className="er-results-sort-wrap">
                <label htmlFor="er-diamond-sort">Sort by:</label>
                <select
                  id="er-diamond-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="er-diamond-sort-select"
                >
                  <option value="best-match">Best Match</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="carat-asc">Carat: Low to High</option>
                  <option value="carat-desc">Carat: High to Low</option>
                </select>
              </div>
            </div>

            {/* Diamond Results List Header */}
            <div className="er-results-table-header">
              <span className="col-comp">Compare</span>
              <span className="col-spec">Carat & Shape</span>
              <span className="col-stat">Colour</span>
              <span className="col-stat">Clarity</span>
              <span className="col-stat">Cut</span>
              <span className="col-price">Price</span>
              <span className="col-action">Action</span>
            </div>

            {/* Diamond Results Rows */}
            {sortedDiamonds.length === 0 ? (
              <div className="er-no-diamonds-box facet-oct-sm">
                <DiamondIcon size={32} className="text-[#C5A880] mx-auto mb-2 opacity-70" />
                <h3>No diamonds match your exact criteria</h3>
                <p>Try broadening your price, carat or clarity ranges.</p>
                <button
                  type="button"
                  className="button button-dark facet-oct-sm mt-3"
                  onClick={handleResetFilters}
                >
                  RESET FILTERS
                </button>
              </div>
            ) : (
              <div className="er-diamond-rows-list">
                {sortedDiamonds.map((diamond) => {
                  const isCompared = comparedDiamondIds.includes(diamond.id);
                  const isDossierActive = activeDossierDiamondId === diamond.id;
                  const isWishlisted = store.wishlist.includes(diamond.id);

                  return (
                    <article
                      key={diamond.id}
                      className={`er-diamond-row-card facet-oct-sm ${isDossierActive ? "is-active-dossier" : ""}`}
                    >
                      {/* Compare Checkbox */}
                      <div className="er-row-compare-cell">
                        <label className="er-custom-checkbox" title="Add to comparison">
                          <input
                            type="checkbox"
                            checked={isCompared}
                            onChange={() => toggleCompareDiamond(diamond.id)}
                          />
                          <span className="er-checkbox-indicator">
                            {isCompared && <Check size={11} strokeWidth={3} />}
                          </span>
                        </label>
                      </div>

                      {/* Diamond Visual Stage with 360 badge */}
                      <div
                        className="er-row-media-cell cursor-pointer"
                        onClick={() => setActiveDossierDiamondId(diamond.id)}
                      >
                        <div className="er-diamond-avatar-wrap">
                          <Image
                            src={`/images/shapes/${diamond.shape.toLowerCase()}.png`}
                            alt={`${diamond.carat} ct ${diamond.shape}`}
                            width={44}
                            height={44}
                            className="object-contain"
                          />
                          <span className="er-badge-360">360°</span>
                        </div>
                      </div>

                      {/* Spec and Certification Details */}
                      <div
                        className="er-row-specs-cell cursor-pointer"
                        onClick={() => setActiveDossierDiamondId(diamond.id)}
                      >
                        <h4 className="er-diamond-row-title">
                          {diamond.carat.toFixed(2)} ct {diamond.shape}
                        </h4>
                        <div className="er-diamond-lab-badge">
                          <strong>{diamond.certificate}</strong>
                          <span>{diamond.certificate} {diamond.reportNumber || "2476843210"}</span>
                        </div>
                      </div>

                      {/* 4Cs Columns */}
                      <div className="er-row-4c-col">
                        <span className="val">{diamond.colour}</span>
                        <span className="lbl">Colour</span>
                      </div>
                      <div className="er-row-4c-col">
                        <span className="val">{diamond.clarity}</span>
                        <span className="lbl">Clarity</span>
                      </div>
                      <div className="er-row-4c-col">
                        <span className="val">{diamond.cut === "Excellent" ? "EX" : diamond.cut}</span>
                        <span className="lbl">Cut</span>
                      </div>

                      {/* Price & Wishlist */}
                      <div className="er-row-price-cell">
                        <strong className="er-row-price">{store.formatMoney(diamond.price)}</strong>
                        <button
                          type="button"
                          className="er-row-wishlist-btn"
                          onClick={() => {
                            store.toggleWishlist(diamond.id);
                            toast.success(`Diamond ${diamond.carat}ct added to wishlist`);
                          }}
                        >
                          <Heart size={14} fill={isWishlisted ? "#8B263E" : "none"} color={isWishlisted ? "#8B263E" : "#94A3B8"} />
                        </button>
                      </div>

                      {/* Action Buttons */}
                      <div className="er-row-actions-cell">
                        <button
                          type="button"
                          className="er-row-view-details-btn"
                          onClick={() => setActiveDossierDiamondId(diamond.id)}
                        >
                          VIEW DETAILS
                        </button>
                        <button
                          type="button"
                          className={`er-row-compare-btn ${isCompared ? "is-active" : ""}`}
                          onClick={() => toggleCompareDiamond(diamond.id)}
                        >
                          <Scale size={13} /> {isCompared ? "COMPARED" : "COMPARE"}
                        </button>
                        <button
                          type="button"
                          className="er-row-select-btn facet-oct-sm"
                          onClick={() => handleSelectDiamond(diamond)}
                        >
                          SELECT DIAMOND →
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Pagination & Sourcing Assistance Box */}
            <div className="er-pagination-row">
              <span className="er-pagination-info">Showing 1–{Math.min(20, sortedDiamonds.length)} of {sortedDiamonds.length}</span>
              <div className="er-pagination-links">
                <button type="button" className="is-active">1</button>
                <button type="button">2</button>
                <button type="button">3</button>
                <span className="dots">...</span>
                <button type="button">7</button>
              </div>
            </div>

            {/* Sourcing Concierge Banner */}
            <div className="er-sourcing-banner facet-oct-sm">
              <div className="er-sourcing-content">
                <div className="er-sourcing-icon-circle">
                  <Search size={18} className="text-[#0C1B54]" />
                </div>
                <div className="er-sourcing-text">
                  <h4>Can&apos;t find the diamond you&apos;re looking for?</h4>
                  <p>Our diamantaire network in London and Antwerp can source exceptional stones to your exact specifications.</p>
                </div>
              </div>
              <button
                type="button"
                className="button button-outline facet-oct-sm er-request-diamond-btn"
                onClick={() => setIsRequestDiamondModalOpen(true)}
              >
                REQUEST A DIAMOND
              </button>
            </div>
          </div>

          {/* Column 3: Right Diamond Details Dossier Panel */}
          <aside className="er-diamond-details-flyout">
            <div className="er-flyout-sticky-card facet-oct-sm">
              <div className="er-flyout-header">
                <span className="er-flyout-title">DIAMOND DETAILS</span>
                <span className="er-flyout-ref">{activeDossierDiamond.id}</span>
              </div>

              {/* High-Resolution Interactive 360 Diamond Viewer */}
              <div className="er-flyout-media-stage">
                <Image
                  src={`/images/shapes/${activeDossierDiamond.shape.toLowerCase()}.png`}
                  alt={`${activeDossierDiamond.carat} ct ${activeDossierDiamond.shape}`}
                  width={140}
                  height={140}
                  className="object-contain er-flyout-diamond-img animate-pulse"
                />
                <div className="er-flyout-360-badge">
                  <Sparkles size={12} /> 360° HD Light Performance View
                </div>
              </div>

              {/* Diamond Title & Specs Summary */}
              <div className="er-flyout-meta-block">
                <h3 className="er-flyout-diamond-title">
                  {activeDossierDiamond.carat.toFixed(2)} ct {activeDossierDiamond.shape} Brilliant
                </h3>
                <div className="er-flyout-specs-table">
                  <div className="er-flyout-spec-row">
                    <span>Colour</span>
                    <strong>{activeDossierDiamond.colour}</strong>
                  </div>
                  <div className="er-flyout-spec-row">
                    <span>Clarity</span>
                    <strong>{activeDossierDiamond.clarity}</strong>
                  </div>
                  <div className="er-flyout-spec-row">
                    <span>Cut</span>
                    <strong>{activeDossierDiamond.cut} (Triple Excellent)</strong>
                  </div>
                  <div className="er-flyout-spec-row">
                    <span>Polish</span>
                    <strong>{activeDossierDiamond.polish || "EX"}</strong>
                  </div>
                  <div className="er-flyout-spec-row">
                    <span>Symmetry</span>
                    <strong>{activeDossierDiamond.symmetry || "EX"}</strong>
                  </div>
                  <div className="er-flyout-spec-row">
                    <span>Fluorescence</span>
                    <strong>{activeDossierDiamond.fluorescence || "None"}</strong>
                  </div>
                  <div className="er-flyout-spec-row">
                    <span>Measurements</span>
                    <strong>{activeDossierDiamond.measurements || "6.42 – 6.45 × 3.97 mm"}</strong>
                  </div>
                  <div className="er-flyout-spec-row">
                    <span>Table %</span>
                    <strong>{activeDossierDiamond.table || 57}%</strong>
                  </div>
                  <div className="er-flyout-spec-row">
                    <span>Depth %</span>
                    <strong>{activeDossierDiamond.depth || 61.8}%</strong>
                  </div>
                  <div className="er-flyout-spec-row">
                    <span>Culet</span>
                    <strong>{activeDossierDiamond.culet || "None"}</strong>
                  </div>
                  <div className="er-flyout-spec-row">
                    <span>Girdle</span>
                    <strong>{activeDossierDiamond.girdle || "Thin to Medium"}</strong>
                  </div>
                </div>
              </div>

              {/* GRADING LABORATORY Certificate Dossier Trigger */}
              <div className="er-flyout-lab-box">
                <span className="er-lab-box-title">GRADING LABORATORY</span>
                <div className="er-lab-logo-row">
                  <Award size={18} className="text-[#0C1B54]" />
                  <strong>{activeDossierDiamond.certificate}</strong>
                  <span>Report #{activeDossierDiamond.reportNumber || "2476843210"}</span>
                </div>
                <button
                  type="button"
                  className="button button-ghost button-wide er-view-gia-btn facet-oct-sm"
                  onClick={() => setIsGiaModalOpen(true)}
                >
                  <FileText size={14} /> VIEW {activeDossierDiamond.certificate} REPORT ↗
                </button>
              </div>

              {/* Proportions & Optical Scopes Graphic */}
              <div className="er-flyout-proportions-diagram facet-oct-sm">
                <span className="er-prop-title">PROPORTIONS & OPTICAL SYMMETRY</span>
                <div className="er-prop-graphics-row">
                  <div className="er-prop-wireframe">
                    <svg width="60" height="36" viewBox="0 0 60 36" fill="none" stroke="#0C1B54" strokeWidth="1">
                      <polygon points="12,14 48,14 30,32" fill="rgba(197, 168, 128, 0.2)" />
                      <polygon points="12,14 48,14 40,6 20,6" />
                      <line x1="20" y1="6" x2="40" y2="6" stroke="#8F7243" />
                      <text x="26" y="5" fill="#8F7243" fontSize="6" fontFamily="sans-serif">57%</text>
                    </svg>
                    <small>Table & Pavilion</small>
                  </div>
                  <div className="er-prop-scope">
                    <div className="er-scope-circle">
                      <Sparkles size={16} className="text-[#8F7243]" />
                    </div>
                    <small>Hearts & Arrows</small>
                  </div>
                </div>
              </div>

              {/* Pricing & Selection Primary Button */}
              <div className="er-flyout-price-cta-block">
                <div className="er-flyout-price-row">
                  <span className="lbl">PRICE (Diamond Only)</span>
                  <strong className="val">{store.formatMoney(activeDossierDiamond.price)}</strong>
                </div>

                <button
                  type="button"
                  className="button button-burgundy button-wide er-flyout-select-btn facet-oct-sm"
                  onClick={() => handleSelectDiamond(activeDossierDiamond)}
                >
                  SELECT THIS DIAMOND →
                </button>

                <button
                  type="button"
                  className="button button-ghost button-wide er-flyout-compare-btn facet-oct-sm"
                  onClick={() => toggleCompareDiamond(activeDossierDiamond.id)}
                >
                  <Scale size={14} /> {comparedDiamondIds.includes(activeDossierDiamond.id) ? "REMOVE FROM COMPARISON" : "COMPARE DIAMOND (2/3)"}
                </button>
              </div>

              {/* Need Help Choosing Concierge */}
              <div className="er-flyout-concierge-footer">
                <div className="er-advisor-avatar-circle">
                  <Award size={16} className="text-[#0C1B54]" />
                </div>
                <div className="er-advisor-text">
                  <strong>Need help choosing?</strong>
                  <p>Speak to an MAH Gemmologist for personal guidance.</p>
                </div>
                <div className="er-advisor-contact-icons">
                  <Link href="/expert" title="Phone Consultation"><Phone size={14} /></Link>
                  <Link href="/contact" title="Chat on WhatsApp"><MessageSquare size={14} /></Link>
                  <Link href="/contact" title="Email Specialist"><Mail size={14} /></Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* 4. Sticky Bottom Comparison Drawer */}
      {comparedDiamondIds.length > 0 && (
        <aside className="er-compare-drawer-sticky facet-oct-sm">
          <div className="shell er-compare-drawer-inner">
            <div className="er-compare-drawer-header">
              <div className="er-compare-title-row">
                <Scale size={16} className="text-[#C5A880]" />
                <h4>COMPARE DIAMONDS ({comparedDiamondIds.length}/3)</h4>
              </div>
              <button
                type="button"
                className="er-clear-comp-btn"
                onClick={handleClearComparison}
              >
                Clear All
              </button>
            </div>

            {/* 3 Comparison Slots */}
            <div className="er-compare-slots-row">
              {comparedDiamonds.map((d, index) => (
                <div key={d.id} className="er-compare-slot-card">
                  <button
                    type="button"
                    className="er-remove-slot-btn"
                    onClick={() => toggleCompareDiamond(d.id)}
                    aria-label={`Remove ${d.carat}ct diamond`}
                  >
                    <X size={12} />
                  </button>
                  <Image
                    src={`/images/shapes/${d.shape.toLowerCase()}.png`}
                    alt={d.shape}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                  <div className="er-slot-info">
                    <strong>{d.carat.toFixed(2)} ct {d.shape}</strong>
                    <p>{d.colour} · {d.clarity} · {d.cut === "Excellent" ? "EX" : d.cut}</p>
                    <span className="er-slot-price">{store.formatMoney(d.price)}</span>
                  </div>
                  {index < comparedDiamonds.length - 1 && (
                    <span className="er-slot-vs">VS</span>
                  )}
                </div>
              ))}

              {comparedDiamondIds.length < 3 && (
                <div className="er-compare-slot-empty">
                  <span className="text-xs text-slate-400">+ Add a diamond (Up to 3)</span>
                </div>
              )}
            </div>

            {/* Compare CTA */}
            <div className="er-compare-actions">
              <button
                type="button"
                className="button button-dark facet-oct-sm er-compare-modal-trigger-btn"
                onClick={() => setIsComparisonModalOpen(true)}
              >
                COMPARE SIDE BY SIDE
              </button>
              <button
                type="button"
                className="er-compare-how-link"
                onClick={() => setIsEducationModalOpen(true)}
              >
                Learn how comparison works ⓘ
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 5. Bottom Trust Strip */}
      <section className="er-diamond-trust-strip">
        <div className="shell">
          <div className="er-trust-pillars-grid">
            <div className="er-trust-pillar-item">
              <ShieldCheck size={20} className="text-[#0C1B54]" />
              <div>
                <strong>Important Information</strong>
                <p>Diamond availability is live and may change. Your selection will be rechecked before checkout.</p>
              </div>
            </div>
            <div className="er-trust-pillar-item">
              <Award size={20} className="text-[#0C1B54]" />
              <div>
                <strong>Independent Diamond Grading</strong>
                <p>View complete authenticated grading report with 1:1 laser inscription registry.</p>
              </div>
            </div>
            <div className="er-trust-pillar-item">
              <Sparkles size={20} className="text-[#0C1B54]" />
              <div>
                <strong>Made to Order</strong>
                <p>Your ring will be handcrafted by master jewellers in our London atelier.</p>
              </div>
            </div>
            <div className="er-trust-pillar-item">
              <Truck size={20} className="text-[#0C1B54]" />
              <div>
                <strong>Delivery Information</strong>
                <p>Complimentary insured worldwide delivery or London showroom collection.</p>
              </div>
            </div>
          </div>
          <p className="er-trust-fineprint">
            The diamonds shown are compatible with your selected ring setting and shape. Availability and prices are subject to change.
          </p>
        </div>
      </section>

      {/* MODALS */}
      {/* 1. Side-by-Side Comparison Modal */}
      {isComparisonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C1B54]/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-5xl bg-[#FAF8F5] p-6 md:p-8 rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto border border-[#C5A880]/40">
            <button
              type="button"
              onClick={() => setIsComparisonModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-200 transition-colors"
              aria-label="Close Comparison"
            >
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <span className="text-xs uppercase tracking-widest text-[#8F7243] font-semibold">Side-by-Side Evaluation</span>
              <h2 className="font-serif text-2xl md:text-3xl text-[#0C1B54] mt-1">Diamond Comparison Matrix</h2>
              <p className="text-sm text-slate-600 mt-1">
                Comparing {comparedDiamonds.length} diamonds compatible with {product.name}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {comparedDiamonds.map((d) => (
                <div key={d.id} className="p-5 bg-white rounded border border-[#E8E1D5] flex flex-col">
                  <div className="text-center mb-4">
                    <Image
                      src={`/images/shapes/${d.shape.toLowerCase()}.png`}
                      alt={d.shape}
                      width={64}
                      height={64}
                      className="mx-auto mb-2 object-contain"
                    />
                    <h3 className="font-serif text-lg text-[#0C1B54]">{d.carat.toFixed(2)} ct {d.shape}</h3>
                    <span className="text-xs text-slate-500">{d.type} Diamond · {d.certificate}</span>
                  </div>

                  <div className="flex flex-col gap-2 text-xs border-t border-b border-[#F1ECE3] py-4 my-2 flex-1">
                    <div className="flex justify-between"><span>Colour</span><strong>{d.colour}</strong></div>
                    <div className="flex justify-between"><span>Clarity</span><strong>{d.clarity}</strong></div>
                    <div className="flex justify-between"><span>Cut</span><strong>{d.cut}</strong></div>
                    <div className="flex justify-between"><span>Polish</span><strong>{d.polish || "EX"}</strong></div>
                    <div className="flex justify-between"><span>Symmetry</span><strong>{d.symmetry || "EX"}</strong></div>
                    <div className="flex justify-between"><span>Fluorescence</span><strong>{d.fluorescence || "None"}</strong></div>
                    <div className="flex justify-between"><span>Table %</span><strong>{d.table || 57}%</strong></div>
                    <div className="flex justify-between"><span>Depth %</span><strong>{d.depth || 61.8}%</strong></div>
                    <div className="flex justify-between"><span>Report #</span><strong>{d.reportNumber || "2476843210"}</strong></div>
                  </div>

                  <div className="text-center mt-4">
                    <span className="text-base font-serif font-bold text-[#0C1B54] block mb-3">
                      {store.formatMoney(d.price)}
                    </span>
                    <button
                      type="button"
                      className="button button-burgundy button-wide facet-oct-sm text-xs py-2.5"
                      onClick={() => {
                        setIsComparisonModalOpen(false);
                        handleSelectDiamond(d);
                      }}
                    >
                      SELECT THIS DIAMOND →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Diamond Education Suite Modal */}
      {isEducationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C1B54]/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl bg-[#FAF8F5] p-6 md:p-8 rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto border border-[#C5A880]/40">
            <button
              type="button"
              onClick={() => setIsEducationModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-200 transition-colors"
              aria-label="Close Education Modal"
            >
              <X size={20} />
            </button>
            <DiamondEducationSuite />
          </div>
        </div>
      )}

      {/* 3. GIA Report Modal */}
      {isGiaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C1B54]/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white p-6 md:p-8 rounded-lg shadow-2xl border border-[#C5A880]">
            <button
              type="button"
              onClick={() => setIsGiaModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-200 transition-colors"
              aria-label="Close GIA Report"
            >
              <X size={20} />
            </button>
            <div className="border-2 border-[#C5A880] p-6 text-center">
              <span className="text-xs uppercase tracking-widest text-[#8F7243] font-bold">Authenticated Dossier</span>
              <h2 className="font-serif text-2xl text-[#0C1B54] mt-1">{activeDossierDiamond.certificate} Grading Report</h2>
              <p className="text-xs text-slate-500 mt-1">Report Number: {activeDossierDiamond.reportNumber || "2476843210"}</p>

              <div className="grid grid-cols-2 gap-4 text-xs text-left my-6 bg-[#FAF8F5] p-4 border border-[#E8E1D5]">
                <div><span>Shape:</span> <strong>{activeDossierDiamond.shape} Brilliant</strong></div>
                <div><span>Carat Weight:</span> <strong>{activeDossierDiamond.carat.toFixed(2)} ct</strong></div>
                <div><span>Colour Grade:</span> <strong>{activeDossierDiamond.colour}</strong></div>
                <div><span>Clarity Grade:</span> <strong>{activeDossierDiamond.clarity}</strong></div>
                <div><span>Cut Grade:</span> <strong>{activeDossierDiamond.cut}</strong></div>
                <div><span>Polish:</span> <strong>{activeDossierDiamond.polish || "Excellent"}</strong></div>
                <div><span>Symmetry:</span> <strong>{activeDossierDiamond.symmetry || "Excellent"}</strong></div>
                <div><span>Fluorescence:</span> <strong>{activeDossierDiamond.fluorescence || "None"}</strong></div>
              </div>

              <button
                type="button"
                className="button button-dark facet-oct-sm px-6 py-2 text-xs"
                onClick={() => setIsGiaModalOpen(false)}
              >
                CLOSE DOSSIER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Request a Diamond Modal */}
      {isRequestDiamondModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C1B54]/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#FAF8F5] p-6 rounded-lg shadow-2xl border border-[#C5A880]">
            <button
              type="button"
              onClick={() => setIsRequestDiamondModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 rounded-full"
              aria-label="Close Modal"
            >
              <X size={20} />
            </button>
            <h3 className="font-serif text-xl text-[#0C1B54] mb-2">Bespoke Diamond Sourcing</h3>
            <p className="text-xs text-slate-600 mb-4">
              Let our head diamantaire source a rare or specific diamond for {product.name}.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Diamond sourcing request received. A specialist will contact you within 24 hours.");
                setIsRequestDiamondModalOpen(false);
              }}
              className="flex flex-col gap-3 text-xs"
            >
              <input type="text" placeholder="Your Name" required className="p-2.5 border border-[#E8E1D5] bg-white rounded" />
              <input type="email" placeholder="Your Email" required className="p-2.5 border border-[#E8E1D5] bg-white rounded" />
              <input type="tel" placeholder="Phone Number (Optional)" className="p-2.5 border border-[#E8E1D5] bg-white rounded" />
              <textarea placeholder="Specific requirements (e.g. 2.50ct D FL Oval, Type IIa, specific budget)..." rows={3} className="p-2.5 border border-[#E8E1D5] bg-white rounded" />
              <button type="submit" className="button button-burgundy facet-oct-sm py-2.5 font-bold tracking-wider mt-2">
                SUBMIT BESPOKE ENQUIRY
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

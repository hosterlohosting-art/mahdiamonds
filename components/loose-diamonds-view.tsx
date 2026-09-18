"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Diamond,
  Eye,
  FileText,
  Filter,
  Grid,
  Heart,
  HelpCircle,
  LayoutGrid,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Table as TableIcon,
  X,
} from "lucide-react";
import { diamonds, getDiamond, money, type Diamond as DiamondType } from "@/lib/demo-data";
import { useDemoStore } from "@/components/demo-store-provider";
import type { RoutePage } from "@/lib/site-data";
import { toast } from "sonner";

interface LooseDiamondsViewProps {
  page?: RoutePage;
  query?: Record<string, string | string[] | undefined>;
  mode?: "loose" | "ring";
}

export function LooseDiamondsView({ page, query, mode = "loose" }: LooseDiamondsViewProps) {
  const router = useRouter();
  const store = useDemoStore();

  // 1. Origin Filter: Natural vs Lab-Grown
  const [originType, setOriginType] = useState<"Natural" | "Lab-grown">(
    typeof query?.type === "string" && query.type.toLowerCase().includes("lab")
      ? "Lab-grown"
      : "Natural"
  );

  // 2. Primary Filters State
  const [selectedShape, setSelectedShape] = useState<string>(
    typeof query?.shape === "string" ? query.shape : "All"
  );
  const [minPrice, setMinPrice] = useState<number>(500);
  const [maxPrice, setMaxPrice] = useState<number>(25000);
  const [minCarat, setMinCarat] = useState<number>(0.3);
  const [maxCarat, setMaxCarat] = useState<number>(5.0);
  const [selectedColour, setSelectedColour] = useState<string>("All");
  const [selectedClarity, setSelectedClarity] = useState<string>("All");
  const [selectedCut, setSelectedCut] = useState<string>("All");

  // 3. Technical Filters State ("More Filters")
  const [showMoreFilters, setShowMoreFilters] = useState<boolean>(false);
  const [selectedPolish, setSelectedPolish] = useState<string>("All");
  const [selectedSymmetry, setSelectedSymmetry] = useState<string>("All");
  const [selectedFluorescence, setSelectedFluorescence] = useState<string>("All");
  const [selectedLab, setSelectedLab] = useState<string>("All");

  // 4. View Mode & Sorting
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [sortBy, setSortBy] = useState<string>("price-asc");

  // 5. Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);

  // 6. Comparison Drawer State
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  // Sync with incoming query parameters
  useEffect(() => {
    if (typeof query?.type === "string") {
      setOriginType(query.type.toLowerCase().includes("lab") ? "Lab-grown" : "Natural");
    }
    if (typeof query?.shape === "string") {
      setSelectedShape(query.shape);
    }
  }, [query]);

  // Shapes list & helper images
  const shapes = [
    "All",
    "Round",
    "Oval",
    "Emerald",
    "Pear",
    "Cushion",
    "Princess",
    "Radiant",
    "Asscher",
    "Marquise",
    "Heart",
  ];

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

  const colours = ["All", "D", "E", "F", "G", "H"];
  const clarities = ["All", "FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];
  const cuts = ["All", "Ideal", "Excellent", "Very Good", "Good"];
  const polishes = ["All", "Excellent", "Very Good", "Good"];
  const symmetries = ["All", "Excellent", "Very Good", "Good"];
  const fluorescences = ["All", "None", "Faint", "Medium", "Strong"];
  const labs = ["All", "GIA", "IGI"];

  // Filter diamonds dynamically
  const filteredDiamonds = useMemo(() => {
    return diamonds.filter((d) => {
      if (d.type !== originType) return false;
      if (selectedShape !== "All" && d.shape.toLowerCase() !== selectedShape.toLowerCase()) return false;
      if (d.price < minPrice || d.price > maxPrice) return false;
      if (d.carat < minCarat || d.carat > maxCarat) return false;
      if (selectedColour !== "All" && d.colour !== selectedColour) return false;
      if (selectedClarity !== "All" && d.clarity !== selectedClarity) return false;
      if (selectedCut !== "All" && d.cut !== selectedCut) return false;
      if (selectedPolish !== "All" && d.polish && d.polish !== selectedPolish) return false;
      if (selectedSymmetry !== "All" && d.symmetry && d.symmetry !== selectedSymmetry) return false;
      if (selectedFluorescence !== "All" && d.fluorescence && d.fluorescence !== selectedFluorescence) return false;
      if (selectedLab !== "All" && d.certificate !== selectedLab) return false;
      return true;
    });
  }, [
    originType,
    selectedShape,
    minPrice,
    maxPrice,
    minCarat,
    maxCarat,
    selectedColour,
    selectedClarity,
    selectedCut,
    selectedPolish,
    selectedSymmetry,
    selectedFluorescence,
    selectedLab,
  ]);

  // Sort diamonds dynamically
  const sortedDiamonds = useMemo(() => {
    const list = [...filteredDiamonds];
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "carat-asc") list.sort((a, b) => a.carat - b.carat);
    else if (sortBy === "carat-desc") list.sort((a, b) => b.carat - a.carat);
    else if (sortBy === "colour-best") {
      const order = ["D", "E", "F", "G", "H", "I", "J"];
      list.sort((a, b) => order.indexOf(a.colour) - order.indexOf(b.colour));
    } else if (sortBy === "clarity-best") {
      const order = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];
      list.sort((a, b) => order.indexOf(a.clarity) - order.indexOf(b.clarity));
    }
    return list;
  }, [filteredDiamonds, sortBy]);

  // Paginated diamonds
  const totalPages = Math.ceil(sortedDiamonds.length / itemsPerPage) || 1;
  const paginatedDiamonds = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedDiamonds.slice(start, start + itemsPerPage);
  }, [sortedDiamonds, currentPage, itemsPerPage]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    originType,
    selectedShape,
    minPrice,
    maxPrice,
    minCarat,
    maxCarat,
    selectedColour,
    selectedClarity,
    selectedCut,
    selectedPolish,
    selectedSymmetry,
    selectedFluorescence,
    selectedLab,
    sortBy,
  ]);

  // Active filter count & chips
  const activeChips = useMemo(() => {
    const chips: { id: string; label: string; onRemove: () => void }[] = [];

    // Origin chip
    chips.push({
      id: "origin",
      label: `${originType} Diamonds`,
      onRemove: () => setOriginType(originType === "Natural" ? "Lab-grown" : "Natural"),
    });

    if (selectedShape !== "All") {
      chips.push({
        id: "shape",
        label: selectedShape,
        onRemove: () => setSelectedShape("All"),
      });
    }

    if (minPrice > 500 || maxPrice < 25000) {
      chips.push({
        id: "price",
        label: `${money(minPrice)} – ${money(maxPrice)}`,
        onRemove: () => {
          setMinPrice(500);
          setMaxPrice(25000);
        },
      });
    }

    if (minCarat > 0.3 || maxCarat < 5.0) {
      chips.push({
        id: "carat",
        label: `${minCarat.toFixed(2)} – ${maxCarat.toFixed(2)} ct`,
        onRemove: () => {
          setMinCarat(0.3);
          setMaxCarat(5.0);
        },
      });
    }

    if (selectedColour !== "All") {
      chips.push({
        id: "colour",
        label: `Colour ${selectedColour}`,
        onRemove: () => setSelectedColour("All"),
      });
    }

    if (selectedClarity !== "All") {
      chips.push({
        id: "clarity",
        label: `Clarity ${selectedClarity}`,
        onRemove: () => setSelectedClarity("All"),
      });
    }

    if (selectedCut !== "All") {
      chips.push({
        id: "cut",
        label: `${selectedCut} Cut`,
        onRemove: () => setSelectedCut("All"),
      });
    }

    if (selectedPolish !== "All") {
      chips.push({
        id: "polish",
        label: `Polish: ${selectedPolish}`,
        onRemove: () => setSelectedPolish("All"),
      });
    }

    if (selectedSymmetry !== "All") {
      chips.push({
        id: "symmetry",
        label: `Symmetry: ${selectedSymmetry}`,
        onRemove: () => setSelectedSymmetry("All"),
      });
    }

    if (selectedFluorescence !== "All") {
      chips.push({
        id: "fluorescence",
        label: `Fluor: ${selectedFluorescence}`,
        onRemove: () => setSelectedFluorescence("All"),
      });
    }

    if (selectedLab !== "All") {
      chips.push({
        id: "lab",
        label: `Lab: ${selectedLab}`,
        onRemove: () => setSelectedLab("All"),
      });
    }

    return chips;
  }, [
    originType,
    selectedShape,
    minPrice,
    maxPrice,
    minCarat,
    maxCarat,
    selectedColour,
    selectedClarity,
    selectedCut,
    selectedPolish,
    selectedSymmetry,
    selectedFluorescence,
    selectedLab,
  ]);

  const clearAllFilters = () => {
    setSelectedShape("All");
    setMinPrice(500);
    setMaxPrice(25000);
    setMinCarat(0.3);
    setMaxCarat(5.0);
    setSelectedColour("All");
    setSelectedClarity("All");
    setSelectedCut("All");
    setSelectedPolish("All");
    setSelectedSymmetry("All");
    setSelectedFluorescence("All");
    setSelectedLab("All");
  };

  // Toggle wishlist
  const handleToggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    store.toggleWishlist(id);
    const stone = getDiamond(id);
    if (store.wishlist.includes(id)) {
      toast.info(`${stone.carat}ct ${stone.shape} diamond removed from wishlist.`);
    } else {
      toast.success(`${stone.carat}ct ${stone.shape} diamond added to wishlist.`);
    }
  };

  // Toggle comparison
  const toggleCompare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompareList((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        toast.error("You can compare a maximum of 3 diamonds simultaneously.");
        return prev;
      }
      toast.success(`Diamond ${id} added to comparison drawer.`);
      return [...prev, id];
    });
  };

  return (
    <main id="main-content" className="diamonds-search-page-11b">
      {/* 1. TOP BREADCRUMB */}
      <div className="ds-top-bar">
        <div className="shell ds-top-inner">
          <nav aria-label="Breadcrumb" className="ds-breadcrumbs">
            <Link href="/">Home</Link>
            <span className="crumb-sep">/</span>
            <Link href="/diamonds">Diamonds</Link>
            <span className="crumb-sep">/</span>
            <span className="crumb-current">Loose Diamonds</span>
          </nav>
        </div>
      </div>

      {/* 2. PAGE HEADER WITH EDITORIAL TWEEZERS ASSET */}
      <section className="shell ds-header-section">
        <div className="ds-header-grid">
          <div className="ds-header-left">
            <h1 className="ds-page-title">LOOSE DIAMONDS</h1>
            <p className="ds-page-subtitle">Find your diamond.</p>
          </div>

          <div className="ds-header-visual">
            <div className="ds-tweezers-wrap">
              <Image
                src="/images/journal-diamonds.jpg"
                alt="Master diamond held in precision inspection tweezers"
                fill
                priority
                sizes="(max-width: 768px) 140px, 220px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. DIAMOND TYPE SEGMENTED TOGGLE (NATURAL | LAB-GROWN) */}
      <section className="shell ds-origin-toggle-section">
        <div className="ds-origin-segmented-bar facet-oct-sm">
          <button
            type="button"
            className={`ds-origin-tab-btn ${originType === "Natural" ? "active" : ""}`}
            onClick={() => setOriginType("Natural")}
          >
            <Diamond size={16} />
            <span>NATURAL DIAMONDS</span>
          </button>

          <button
            type="button"
            className={`ds-origin-tab-btn ${originType === "Lab-grown" ? "active" : ""}`}
            onClick={() => setOriginType("Lab-grown")}
          >
            <Sparkles size={16} />
            <span>LAB-GROWN DIAMONDS</span>
          </button>
        </div>
      </section>

      {/* 4. PRIMARY & TECHNICAL FILTERS BAR */}
      <section className="shell ds-filters-bar-section">
        <div className="ds-filters-main-card facet-oct-sm">
          {/* Primary Dropdowns Row */}
          <div className="ds-primary-filters-grid">
            {/* Shape Select */}
            <div className="ds-filter-cell">
              <label htmlFor="filter-shape" className="ds-filter-label">SHAPE</label>
              <div className="ds-select-wrap">
                <select
                  id="filter-shape"
                  value={selectedShape}
                  onChange={(e) => setSelectedShape(e.target.value)}
                  className="ds-select-input"
                >
                  {shapes.map((s) => (
                    <option key={s} value={s}>
                      {s === "All" ? "All Shapes" : s}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="ds-select-chevron" />
              </div>
            </div>

            {/* Price Range */}
            <div className="ds-filter-cell">
              <label htmlFor="filter-price" className="ds-filter-label">PRICE</label>
              <div className="ds-select-wrap">
                <select
                  id="filter-price"
                  value={`${minPrice}-${maxPrice}`}
                  onChange={(e) => {
                    const [min, max] = e.target.value.split("-").map(Number);
                    setMinPrice(min);
                    setMaxPrice(max);
                  }}
                  className="ds-select-input"
                >
                  <option value="500-25000">£ Min – £ Max (All)</option>
                  <option value="500-2000">Under £2,000</option>
                  <option value="2000-5000">£2,000 – £5,000</option>
                  <option value="5000-10000">£5,000 – £10,000</option>
                  <option value="10000-25000">Over £10,000</option>
                </select>
                <ChevronDown size={14} className="ds-select-chevron" />
              </div>
            </div>

            {/* Carat Weight */}
            <div className="ds-filter-cell">
              <label htmlFor="filter-carat" className="ds-filter-label">CARAT</label>
              <div className="ds-select-wrap">
                <select
                  id="filter-carat"
                  value={`${minCarat}-${maxCarat}`}
                  onChange={(e) => {
                    const [min, max] = e.target.value.split("-").map(Number);
                    setMinCarat(min);
                    setMaxCarat(max);
                  }}
                  className="ds-select-input"
                >
                  <option value="0.3-5">0.30 – 5.00+ ct (All)</option>
                  <option value="0.3-0.99">0.30 – 0.99 ct</option>
                  <option value="1.0-1.49">1.00 – 1.49 ct</option>
                  <option value="1.5-1.99">1.50 – 1.99 ct</option>
                  <option value="2.0-5.0">2.00+ ct</option>
                </select>
                <ChevronDown size={14} className="ds-select-chevron" />
              </div>
            </div>

            {/* Colour */}
            <div className="ds-filter-cell">
              <label htmlFor="filter-colour" className="ds-filter-label">COLOUR</label>
              <div className="ds-select-wrap">
                <select
                  id="filter-colour"
                  value={selectedColour}
                  onChange={(e) => setSelectedColour(e.target.value)}
                  className="ds-select-input"
                >
                  <option value="All">D – Z (All)</option>
                  <option value="D">D (Colourless)</option>
                  <option value="E">E (Colourless)</option>
                  <option value="F">F (Colourless)</option>
                  <option value="G">G (Near Colourless)</option>
                  <option value="H">H (Near Colourless)</option>
                </select>
                <ChevronDown size={14} className="ds-select-chevron" />
              </div>
            </div>

            {/* Clarity */}
            <div className="ds-filter-cell">
              <label htmlFor="filter-clarity" className="ds-filter-label">CLARITY</label>
              <div className="ds-select-wrap">
                <select
                  id="filter-clarity"
                  value={selectedClarity}
                  onChange={(e) => setSelectedClarity(e.target.value)}
                  className="ds-select-input"
                >
                  <option value="All">IF – I3 (All)</option>
                  <option value="FL">FL (Flawless)</option>
                  <option value="IF">IF (Internally Flawless)</option>
                  <option value="VVS1">VVS1 (Very Very Slight)</option>
                  <option value="VVS2">VVS2</option>
                  <option value="VS1">VS1 (Very Slight)</option>
                  <option value="VS2">VS2</option>
                  <option value="SI1">SI1 (Slight Inclusions)</option>
                  <option value="SI2">SI2</option>
                </select>
                <ChevronDown size={14} className="ds-select-chevron" />
              </div>
            </div>

            {/* Cut */}
            <div className="ds-filter-cell">
              <label htmlFor="filter-cut" className="ds-filter-label">CUT</label>
              <div className="ds-select-wrap">
                <select
                  id="filter-cut"
                  value={selectedCut}
                  onChange={(e) => setSelectedCut(e.target.value)}
                  className="ds-select-input"
                >
                  <option value="All">Excellent – Good (All)</option>
                  <option value="Ideal">Ideal</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                </select>
                <ChevronDown size={14} className="ds-select-chevron" />
              </div>
            </div>
          </div>

          {/* Secondary Controls: More Filters & Sort By */}
          <div className="ds-secondary-filters-bar">
            <button
              type="button"
              className={`ds-more-filters-btn ${showMoreFilters ? "active" : ""}`}
              onClick={() => setShowMoreFilters(!showMoreFilters)}
            >
              <SlidersHorizontal size={14} />
              <span>MORE FILTERS</span>
              {showMoreFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            <div className="ds-sort-wrap">
              <label htmlFor="sort-by" className="ds-sort-label">SORT BY</label>
              <div className="ds-select-wrap ds-sort-select-wrap">
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="ds-select-input ds-sort-select"
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="carat-asc">Carat: Low to High</option>
                  <option value="carat-desc">Carat: High to Low</option>
                  <option value="colour-best">Colour: Best First</option>
                  <option value="clarity-best">Clarity: Best First</option>
                </select>
                <ChevronDown size={14} className="ds-select-chevron" />
              </div>
            </div>
          </div>

          {/* Expandable Technical Filters Drawer ("More Filters") */}
          {showMoreFilters && (
            <div className="ds-technical-drawer">
              <div className="ds-technical-grid">
                {/* Polish */}
                <div className="ds-filter-cell">
                  <label htmlFor="tech-polish" className="ds-filter-label">POLISH</label>
                  <div className="ds-select-wrap">
                    <select
                      id="tech-polish"
                      value={selectedPolish}
                      onChange={(e) => setSelectedPolish(e.target.value)}
                      className="ds-select-input"
                    >
                      {polishes.map((p) => (
                        <option key={p} value={p}>{p === "All" ? "All Polish" : p}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="ds-select-chevron" />
                  </div>
                </div>

                {/* Symmetry */}
                <div className="ds-filter-cell">
                  <label htmlFor="tech-symmetry" className="ds-filter-label">SYMMETRY</label>
                  <div className="ds-select-wrap">
                    <select
                      id="tech-symmetry"
                      value={selectedSymmetry}
                      onChange={(e) => setSelectedSymmetry(e.target.value)}
                      className="ds-select-input"
                    >
                      {symmetries.map((s) => (
                        <option key={s} value={s}>{s === "All" ? "All Symmetry" : s}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="ds-select-chevron" />
                  </div>
                </div>

                {/* Fluorescence */}
                <div className="ds-filter-cell">
                  <label htmlFor="tech-fluorescence" className="ds-filter-label">FLUORESCENCE</label>
                  <div className="ds-select-wrap">
                    <select
                      id="tech-fluorescence"
                      value={selectedFluorescence}
                      onChange={(e) => setSelectedFluorescence(e.target.value)}
                      className="ds-select-input"
                    >
                      {fluorescences.map((f) => (
                        <option key={f} value={f}>{f === "All" ? "All Fluorescence" : f}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="ds-select-chevron" />
                  </div>
                </div>

                {/* Laboratory */}
                <div className="ds-filter-cell">
                  <label htmlFor="tech-lab" className="ds-filter-label">GRADING LABORATORY</label>
                  <div className="ds-select-wrap">
                    <select
                      id="tech-lab"
                      value={selectedLab}
                      onChange={(e) => setSelectedLab(e.target.value)}
                      className="ds-select-input"
                    >
                      {labs.map((l) => (
                        <option key={l} value={l}>{l === "All" ? "All Laboratories" : l}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="ds-select-chevron" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Removable Chips Bar */}
          <div className="ds-active-chips-strip">
            <span className="ds-active-chips-label">ACTIVE FILTERS</span>
            <div className="ds-chips-list">
              {activeChips.map((chip) => (
                <span key={chip.id} className="ds-chip-pill">
                  <span>{chip.label}</span>
                  <button
                    type="button"
                    onClick={chip.onRemove}
                    className="ds-chip-remove"
                    aria-label={`Remove filter ${chip.label}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={clearAllFilters}
              className="ds-clear-all-btn"
            >
              CLEAR ALL ✕
            </button>
          </div>
        </div>
      </section>

      {/* 5. RESULTS COUNT & VIEW TOGGLE (TABLE VIEW | GRID VIEW) */}
      <section className="shell ds-results-controls-section">
        <div className="ds-results-controls-bar">
          <div className="ds-results-count-box">
            <h2 className="ds-results-count-title">
              {sortedDiamonds.length} DIAMONDS FOUND
            </h2>
            <p className="ds-results-count-sub">
              Results update automatically when you change filters.
            </p>
          </div>

          <div className="ds-view-toggle-group">
            <button
              type="button"
              className={`ds-view-btn ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
            >
              <TableIcon size={14} />
              <span>TABLE VIEW</span>
            </button>
            <button
              type="button"
              className={`ds-view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid size={14} />
              <span>GRID VIEW</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. DIAMOND RESULTS CONTAINER (TABLE OR GRID) */}
      <section className="shell ds-results-container-section">
        {paginatedDiamonds.length === 0 ? (
          <div className="ds-no-results-box facet-oct-sm">
            <Diamond size={32} />
            <h3>No Diamonds Matching Your Selection</h3>
            <p>Try broadening your filter criteria or clearing some parameters.</p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="button button-dark facet-oct-sm mt-3"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === "table" ? (
          /* TABLE VIEW */
          <div className="ds-table-card facet-oct-sm">
            <div className="ds-table-responsive">
              <table className="ds-diamonds-table">
                <thead>
                  <tr>
                    <th className="th-shape">SHAPE</th>
                    <th className="th-carat">CARAT</th>
                    <th className="th-colour">COLOUR</th>
                    <th className="th-clarity">CLARITY</th>
                    <th className="th-cut">CUT</th>
                    <th className="th-lab">GRADING LAB</th>
                    <th
                      className="th-price th-sortable"
                      onClick={() => setSortBy(sortBy === "price-asc" ? "price-desc" : "price-asc")}
                    >
                      PRICE {sortBy === "price-asc" ? "▲" : sortBy === "price-desc" ? "▼" : ""}
                    </th>
                    <th className="th-action">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDiamonds.map((diamond) => {
                    const isWishlisted = store.wishlist.includes(diamond.id);
                    const shapeImg = shapeImageMap[diamond.shape] || "/images/shapes/round.png";

                    return (
                      <tr key={diamond.id} className="ds-table-row">
                        {/* SHAPE */}
                        <td className="td-shape">
                          <div className="ds-table-shape-cell">
                            <div className="ds-shape-img-thumb">
                              <Image
                                src={shapeImg}
                                alt={diamond.shape}
                                width={28}
                                height={28}
                                className="object-contain"
                              />
                            </div>
                            <div className="ds-shape-cell-text">
                              <strong>{diamond.shape} Brilliant</strong>
                              <small>MAH-{diamond.id}</small>
                            </div>
                          </div>
                        </td>

                        {/* CARAT */}
                        <td className="td-carat">
                          <strong>{diamond.carat.toFixed(2)} ct</strong>
                        </td>

                        {/* COLOUR */}
                        <td className="td-colour">
                          <span>{diamond.colour}</span>
                        </td>

                        {/* CLARITY */}
                        <td className="td-clarity">
                          <span>{diamond.clarity}</span>
                        </td>

                        {/* CUT */}
                        <td className="td-cut">
                          <span>{diamond.cut}</span>
                        </td>

                        {/* GRADING LAB */}
                        <td className="td-lab">
                          <span className="ds-lab-pill">{diamond.certificate}</span>
                        </td>

                        {/* PRICE */}
                        <td className="td-price">
                          <strong>{money(diamond.price)}</strong>
                        </td>

                        {/* ACTION */}
                        <td className="td-action">
                          <div className="ds-table-action-stack">
                            <Link
                              href={`/diamonds/detail?id=${diamond.id}`}
                              className="ds-btn-view-diamond facet-oct-sm"
                            >
                              VIEW DIAMOND
                            </Link>

                            <button
                              type="button"
                              onClick={(e) => handleToggleWishlist(diamond.id, e)}
                              className={`ds-table-heart-btn ${isWishlisted ? "active" : ""}`}
                              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                            >
                              <Heart
                                size={16}
                                fill={isWishlisted ? "#0c1b54" : "none"}
                                strokeWidth={1.3}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* GRID VIEW */
          <div className="ds-grid-view-grid">
            {paginatedDiamonds.map((diamond) => {
              const isWishlisted = store.wishlist.includes(diamond.id);
              const shapeImg = shapeImageMap[diamond.shape] || "/images/shapes/round.png";

              return (
                <div key={diamond.id} className="ds-grid-card facet-oct-sm">
                  {/* Top Row Badges & Wishlist */}
                  <div className="ds-grid-card-top">
                    <div className="ds-card-badges">
                      <span className="ds-card-badge-origin">
                        {diamond.type.toUpperCase()}
                      </span>
                      <span className="ds-card-badge-cert">
                        {diamond.certificate}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleToggleWishlist(diamond.id, e)}
                      className={`ds-grid-heart-btn ${isWishlisted ? "active" : ""}`}
                      aria-label="Wishlist"
                    >
                      <Heart
                        size={16}
                        fill={isWishlisted ? "#0c1b54" : "none"}
                        strokeWidth={1.3}
                      />
                    </button>
                  </div>

                  {/* Diamond Image Thumbnail */}
                  <div className="ds-grid-img-wrap">
                    <Image
                      src={shapeImg}
                      alt={`${diamond.carat}ct ${diamond.shape}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 280px"
                      className="object-contain p-4"
                    />
                  </div>

                  {/* Body Specs */}
                  <div className="ds-grid-body">
                    <h3 className="ds-grid-diamond-name">
                      {diamond.carat.toFixed(2)}ct {diamond.shape} Brilliant
                    </h3>
                    <p className="ds-grid-diamond-specs">
                      {diamond.colour} Colour · {diamond.clarity} Clarity · {diamond.cut} Cut
                    </p>
                    <div className="ds-grid-price-row">
                      <strong className="ds-grid-price-amount">
                        {money(diamond.price)}
                      </strong>
                    </div>

                    <Link
                      href={`/diamonds/detail?id=${diamond.id}`}
                      className="ds-grid-view-btn facet-oct-sm"
                    >
                      <span>VIEW DIAMOND</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 7. PAGINATION & ITEMS PER PAGE */}
      {sortedDiamonds.length > 0 && (
        <section className="shell ds-pagination-section">
          <div className="ds-pagination-bar">
            {/* Page buttons */}
            <div className="ds-pagination-controls">
              <button
                type="button"
                className="ds-page-arrow"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                // Show first, last, and around current
                if (
                  p === 1 ||
                  p === totalPages ||
                  (p >= currentPage - 2 && p <= currentPage + 2)
                ) {
                  return (
                    <button
                      key={p}
                      type="button"
                      className={`ds-page-num ${currentPage === p ? "active" : ""}`}
                      onClick={() => setCurrentPage(p)}
                    >
                      {p}
                    </button>
                  );
                }
                if (p === currentPage - 3 || p === currentPage + 3) {
                  return <span key={p} className="ds-page-dots">...</span>;
                }
                return null;
              })}

              <button
                type="button"
                className="ds-page-arrow"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Items Per Page Dropdown */}
            <div className="ds-per-page-wrap">
              <span className="ds-per-page-label">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="ds-per-page-select"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="ds-per-page-label">per page</span>
            </div>
          </div>
        </section>
      )}

      {/* 8. FLOATING COMPARISON TRAY (OPTIONAL 3-STONE SIDE-BY-SIDE EVALUATION) */}
      {compareList.length > 0 && (
        <aside className="ds-compare-floating-tray facet-oct" aria-label="Diamond comparison drawer">
          <div className="shell ds-compare-tray-inner">
            <div className="ds-compare-left-info">
              <span className="ds-compare-badge facet-oct-sm">{compareList.length}/3</span>
              <div>
                <strong>Compare Selected Diamonds</strong>
                <small>Side-by-side gemological specification analysis</small>
              </div>
            </div>

            <div className="ds-compare-items-strip">
              {compareList.map((id) => {
                const stone = getDiamond(id);
                return (
                  <div key={id} className="ds-compare-thumb-pill facet-oct-sm">
                    <Diamond size={14} />
                    <div className="ds-compare-thumb-text">
                      <strong>{stone.carat.toFixed(2)}ct {stone.shape}</strong>
                      <small>{money(stone.price)}</small>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => toggleCompare(id, e)}
                      aria-label="Remove from comparison"
                      className="ds-compare-remove-item"
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="ds-compare-actions-group">
              <button
                type="button"
                onClick={() => setShowCompareModal(true)}
                disabled={compareList.length < 2}
                className="button button-dark facet-oct-sm ds-btn-compare-action"
              >
                <SlidersHorizontal size={14} />
                <span>{compareList.length >= 2 ? `Compare ${compareList.length} Stones` : "Select 1 More"}</span>
              </button>

              <button
                type="button"
                onClick={() => setCompareList([])}
                className="ds-compare-clear-btn"
              >
                Clear
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 9. SIDE-BY-SIDE COMPARISON MODAL */}
      {showCompareModal && compareList.length >= 2 && (
        <div className="ds-modal-backdrop" onClick={() => setShowCompareModal(false)}>
          <div
            className="ds-compare-modal-card facet-oct"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ds-modal-header">
              <div>
                <span className="ds-modal-eyebrow">Section 11B · Side-by-Side Analysis</span>
                <h3 className="ds-modal-title">Diamond Comparison Dossier</h3>
              </div>
              <button
                type="button"
                className="ds-modal-close"
                onClick={() => setShowCompareModal(false)}
                aria-label="Close comparison"
              >
                <X size={18} />
              </button>
            </div>

            <div className="ds-compare-table-wrap">
              <table className="ds-matrix-table">
                <thead>
                  <tr>
                    <th className="ds-matrix-prop-th">Specification</th>
                    {compareList.map((id) => {
                      const stone = getDiamond(id);
                      return (
                        <th key={id} className="ds-matrix-stone-th">
                          <div className="ds-matrix-stone-head">
                            <span className="ds-matrix-shape-icon facet-oct-sm">
                              <Diamond size={18} />
                            </span>
                            <strong>{stone.carat.toFixed(2)}ct {stone.shape}</strong>
                            <span className="ds-matrix-origin-pill">{stone.type}</span>
                            <div className="ds-matrix-price-tag">{money(stone.price)}</div>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="ds-matrix-prop">Stock Reference</td>
                    {compareList.map((id) => (
                      <td key={id}><strong>MAH-{id}</strong></td>
                    ))}
                  </tr>
                  <tr>
                    <td className="ds-matrix-prop">Carat Weight</td>
                    {compareList.map((id) => {
                      const s = getDiamond(id);
                      return <td key={id}><strong>{s.carat.toFixed(2)} ct</strong></td>;
                    })}
                  </tr>
                  <tr>
                    <td className="ds-matrix-prop">Colour Grade</td>
                    {compareList.map((id) => {
                      const s = getDiamond(id);
                      return <td key={id}><strong>{s.colour}</strong></td>;
                    })}
                  </tr>
                  <tr>
                    <td className="ds-matrix-prop">Clarity Grade</td>
                    {compareList.map((id) => {
                      const s = getDiamond(id);
                      return <td key={id}><strong>{s.clarity}</strong></td>;
                    })}
                  </tr>
                  <tr>
                    <td className="ds-matrix-prop">Cut Grade</td>
                    {compareList.map((id) => {
                      const s = getDiamond(id);
                      return <td key={id}><span>{s.cut}</span></td>;
                    })}
                  </tr>
                  <tr>
                    <td className="ds-matrix-prop">Laboratory Certification</td>
                    {compareList.map((id) => {
                      const s = getDiamond(id);
                      return <td key={id}><span className="ds-lab-pill">{s.certificate}</span></td>;
                    })}
                  </tr>
                  <tr>
                    <td className="ds-matrix-prop">Polish / Symmetry</td>
                    {compareList.map((id) => {
                      const s = getDiamond(id);
                      return <td key={id}>{s.polish || "Excellent"} / {s.symmetry || "Excellent"}</td>;
                    })}
                  </tr>
                  <tr>
                    <td className="ds-matrix-prop">Fluorescence</td>
                    {compareList.map((id) => {
                      const s = getDiamond(id);
                      return <td key={id}>{s.fluorescence || "None"}</td>;
                    })}
                  </tr>
                  <tr>
                    <td className="ds-matrix-prop">Action</td>
                    {compareList.map((id) => (
                      <td key={id}>
                        <Link
                          href={`/diamonds/detail?id=${id}`}
                          className="button button-dark facet-oct-sm ds-matrix-view-btn"
                          onClick={() => setShowCompareModal(false)}
                        >
                          View Diamond
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

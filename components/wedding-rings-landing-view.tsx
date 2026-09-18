"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import {
  ArrowRight,
  Circle,
  Disc,
  Filter,
  Gem,
  Heart,
  Hammer,
  RotateCcw,
  Sparkles,
  Wrench,
  ChevronDown,
} from "lucide-react";
import { products, money, type Product } from "@/lib/demo-data";
import { useDemoStore } from "@/components/demo-store-provider";
import type { RoutePage } from "@/lib/site-data";
import { toast } from "sonner";

interface WeddingRingsLandingViewProps {
  page?: RoutePage;
  query?: Record<string, string | string[] | undefined>;
}

export function WeddingRingsLandingView({ page, query }: WeddingRingsLandingViewProps) {
  const store = useDemoStore();

  // Active Category Selection
  const [activeCategory, setActiveCategory] = useState<string>(
    typeof query?.category === "string" ? query.category : "all"
  );

  // Filters State
  const [selectedStyle, setSelectedStyle] = useState<string>("all");
  const [selectedMetal, setSelectedMetal] = useState<string>("all");
  const [selectedWidth, setSelectedWidth] = useState<string>("all");
  const [selectedProfile, setSelectedProfile] = useState<string>("all");
  const [selectedDiamondType, setSelectedDiamondType] = useState<string>("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");

  // Get all wedding products
  const weddingProducts = useMemo(() => {
    return products.filter((p) => p.category === "wedding");
  }, []);

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return weddingProducts.filter((product) => {
      // 1. Top Category Bar Filter
      if (activeCategory === "women" && product.gender === "men") return false;
      if (activeCategory === "men" && product.gender === "women") return false;
      if (activeCategory === "diamond" && !product.isDiamond && product.style !== "Diamond") return false;
      if (activeCategory === "plain" && (product.isDiamond || product.style === "Diamond")) return false;

      // 2. Dropdown Filters
      if (selectedStyle !== "all" && product.style.toLowerCase() !== selectedStyle.toLowerCase()) {
        return false;
      }
      if (selectedMetal !== "all" && !product.metal.toLowerCase().includes(selectedMetal.toLowerCase())) {
        return false;
      }
      if (selectedWidth !== "all" && product.width !== selectedWidth) {
        return false;
      }
      if (selectedProfile !== "all" && product.profile?.toLowerCase() !== selectedProfile.toLowerCase()) {
        return false;
      }
      if (selectedDiamondType === "diamond" && !product.isDiamond && product.style !== "Diamond") {
        return false;
      }
      if (selectedDiamondType === "plain" && (product.isDiamond || product.style === "Diamond")) {
        return false;
      }
      if (selectedPriceRange === "under-1000" && product.price >= 1000) return false;
      if (selectedPriceRange === "1000-2000" && (product.price < 1000 || product.price > 2000)) return false;
      if (selectedPriceRange === "over-2000" && product.price <= 2000) return false;

      return true;
    });
  }, [
    weddingProducts,
    activeCategory,
    selectedStyle,
    selectedMetal,
    selectedWidth,
    selectedProfile,
    selectedDiamondType,
    selectedPriceRange,
  ]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "newest") list.reverse();
    return list;
  }, [filteredProducts, sortBy]);

  // Wishlist handler
  const handleToggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    store.toggleWishlist(productId);
    const prod = weddingProducts.find((p) => p.id === productId);
    if (store.wishlist.includes(productId)) {
      toast.info(`${prod?.name || "Wedding ring"} removed from wishlist.`);
    } else {
      toast.success(`${prod?.name || "Wedding ring"} added to wishlist.`);
    }
  };

  const resetAllFilters = () => {
    setActiveCategory("all");
    setSelectedStyle("all");
    setSelectedMetal("all");
    setSelectedWidth("all");
    setSelectedProfile("all");
    setSelectedDiamondType("all");
    setSelectedPriceRange("all");
    setSortBy("featured");
  };

  return (
    <main id="main-content" className="wedding-rings-page-10a">
      {/* 1. HERO SECTION */}
      <section className="wr-hero-10a" aria-labelledby="wr-hero-title">
        <div className="shell wr-hero-split-grid">
          <div className="wr-hero-left">
            <span className="wr-hero-eyebrow">WEDDING RINGS</span>
            <h1 id="wr-hero-title" className="wr-hero-title">
              Wedding Rings
            </h1>
            <p className="wr-hero-sub">
              Made to mark a promise that endures.
            </p>
            <div className="wr-hero-divider-pip">
              <span className="wr-div-line" />
              <span className="wr-div-diamond">◇</span>
              <span className="wr-div-line" />
            </div>
          </div>

          <div className="wr-hero-right">
            <div className="wr-hero-img-wrap">
              <Image
                src="/images/styles/diamond-band.jpg"
                alt="MAH handcrafted gold and diamond eternity wedding rings resting on silk"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 540px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. COLLECTION NAVIGATION (5-CATEGORY STRIP) */}
      <section className="shell wr-nav-section-10a" aria-label="Wedding Ring Categories">
        <div className="wr-category-strip-5col">
          {/* 1. WOMEN'S WEDDING RINGS */}
          <button
            type="button"
            className={`wr-cat-item-btn facet-oct-sm ${activeCategory === "women" ? "active" : ""}`}
            onClick={() => setActiveCategory(activeCategory === "women" ? "all" : "women")}
          >
            <div className="wr-cat-icon">
              <Circle size={22} strokeWidth={1.4} />
            </div>
            <div className="wr-cat-text">
              <strong>WOMEN’S</strong>
              <span>WEDDING RINGS</span>
            </div>
          </button>

          {/* 2. MEN'S WEDDING RINGS */}
          <button
            type="button"
            className={`wr-cat-item-btn facet-oct-sm ${activeCategory === "men" ? "active" : ""}`}
            onClick={() => setActiveCategory(activeCategory === "men" ? "all" : "men")}
          >
            <div className="wr-cat-icon">
              <Disc size={22} strokeWidth={1.4} />
            </div>
            <div className="wr-cat-text">
              <strong>MEN’S</strong>
              <span>WEDDING RINGS</span>
            </div>
          </button>

          {/* 3. DIAMOND WEDDING RINGS */}
          <button
            type="button"
            className={`wr-cat-item-btn facet-oct-sm ${activeCategory === "diamond" ? "active" : ""}`}
            onClick={() => setActiveCategory(activeCategory === "diamond" ? "all" : "diamond")}
          >
            <div className="wr-cat-icon">
              <Gem size={22} strokeWidth={1.4} />
            </div>
            <div className="wr-cat-text">
              <strong>DIAMOND</strong>
              <span>WEDDING RINGS</span>
            </div>
          </button>

          {/* 4. PLAIN WEDDING RINGS */}
          <button
            type="button"
            className={`wr-cat-item-btn facet-oct-sm ${activeCategory === "plain" ? "active" : ""}`}
            onClick={() => setActiveCategory(activeCategory === "plain" ? "all" : "plain")}
          >
            <div className="wr-cat-icon">
              <Circle size={22} strokeWidth={2} />
            </div>
            <div className="wr-cat-text">
              <strong>PLAIN</strong>
              <span>WEDDING RINGS</span>
            </div>
          </button>

          {/* 5. BESPOKE WEDDING RINGS (SPECIAL ROUTE TO BESPOKE JOURNEY) */}
          <Link
            href="/bespoke"
            className="wr-cat-item-btn wr-cat-bespoke facet-oct-sm"
          >
            <div className="wr-cat-icon">
              <Wrench size={20} strokeWidth={1.4} />
            </div>
            <div className="wr-cat-text">
              <strong>BESPOKE</strong>
              <span>WEDDING RINGS</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. FILTERS & SORT BAR */}
      <section className="shell wr-filters-section-10a" aria-label="Filters">
        <div className="wr-filters-bar facet-oct-sm">
          {/* Left Filters Group */}
          <div className="wr-filters-left-group">
            <div className="wr-filter-btn-indicator">
              <Filter size={14} />
              <span>FILTER</span>
            </div>

            {/* Style */}
            <div className="wr-filter-dropdown-wrap">
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="wr-filter-select"
                aria-label="Filter by Style"
              >
                <option value="all">STYLE</option>
                <option value="plain">Plain</option>
                <option value="diamond">Diamond Set</option>
              </select>
              <ChevronDown size={14} className="wr-filter-chevron" />
            </div>

            {/* Metal */}
            <div className="wr-filter-dropdown-wrap">
              <select
                value={selectedMetal}
                onChange={(e) => setSelectedMetal(e.target.value)}
                className="wr-filter-select"
                aria-label="Filter by Metal"
              >
                <option value="all">METAL</option>
                <option value="platinum">Platinum</option>
                <option value="yellow gold">18k Yellow Gold</option>
                <option value="rose gold">18k Rose Gold</option>
                <option value="white gold">18k White Gold</option>
              </select>
              <ChevronDown size={14} className="wr-filter-chevron" />
            </div>

            {/* Width */}
            <div className="wr-filter-dropdown-wrap">
              <select
                value={selectedWidth}
                onChange={(e) => setSelectedWidth(e.target.value)}
                className="wr-filter-select"
                aria-label="Filter by Width"
              >
                <option value="all">WIDTH</option>
                <option value="1.8mm">1.8mm</option>
                <option value="2mm">2.0mm</option>
                <option value="2.5mm">2.5mm</option>
                <option value="3mm">3.0mm</option>
                <option value="3.5mm">3.5mm</option>
                <option value="4mm">4.0mm</option>
                <option value="5mm">5.0mm</option>
                <option value="6mm">6.0mm</option>
              </select>
              <ChevronDown size={14} className="wr-filter-chevron" />
            </div>

            {/* Profile */}
            <div className="wr-filter-dropdown-wrap">
              <select
                value={selectedProfile}
                onChange={(e) => setSelectedProfile(e.target.value)}
                className="wr-filter-select"
                aria-label="Filter by Profile"
              >
                <option value="all">PROFILE</option>
                <option value="court">Traditional Court</option>
                <option value="flat court">Flat Court</option>
                <option value="flat">Flat</option>
                <option value="contour">Contour</option>
              </select>
              <ChevronDown size={14} className="wr-filter-chevron" />
            </div>

            {/* Diamond / Plain */}
            <div className="wr-filter-dropdown-wrap">
              <select
                value={selectedDiamondType}
                onChange={(e) => setSelectedDiamondType(e.target.value)}
                className="wr-filter-select"
                aria-label="Filter by Diamond or Plain"
              >
                <option value="all">DIAMOND / PLAIN</option>
                <option value="diamond">Diamond Set</option>
                <option value="plain">Plain Metal</option>
              </select>
              <ChevronDown size={14} className="wr-filter-chevron" />
            </div>

            {/* Price */}
            <div className="wr-filter-dropdown-wrap">
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="wr-filter-select"
                aria-label="Filter by Price"
              >
                <option value="all">PRICE</option>
                <option value="under-1000">Under £1,000</option>
                <option value="1000-2000">£1,000 – £2,000</option>
                <option value="over-2000">Over £2,000</option>
              </select>
              <ChevronDown size={14} className="wr-filter-chevron" />
            </div>
          </div>

          {/* Right Sort Group */}
          <div className="wr-sort-right-group">
            <span className="wr-sort-label">SORT BY</span>
            <div className="wr-filter-dropdown-wrap">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="wr-filter-select wr-sort-select"
                aria-label="Sort products"
              >
                <option value="featured">FEATURED</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
              <ChevronDown size={14} className="wr-filter-chevron" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRODUCT GRID (4-COLUMN LAYOUT) */}
      <section className="shell wr-product-grid-section">
        {sortedProducts.length === 0 ? (
          <div className="wr-no-results facet-oct-sm">
            <Gem size={32} />
            <h3>No Wedding Rings Matching Your Selection</h3>
            <p>Try resetting some filters or explore our Bespoke Wedding Ring service.</p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="button button-dark facet-oct-sm mt-3"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="wr-products-grid">
            {sortedProducts.map((product) => {
              const isWishlisted = store.wishlist.includes(product.id);

              return (
                <article key={product.id} className="wr-catalog-card facet-oct-sm">
                  {/* Top Wishlist Heart */}
                  <div className="wr-card-top-action">
                    <button
                      type="button"
                      onClick={(e) => handleToggleWishlist(product.id, e)}
                      className="wr-card-heart"
                      aria-label="Wishlist"
                    >
                      <Heart
                        size={16}
                        fill={isWishlisted ? "#0c1b54" : "none"}
                        color={isWishlisted ? "#0c1b54" : "#0c1b54"}
                        strokeWidth={1.3}
                      />
                    </button>
                  </div>

                  {/* Card Main Link */}
                  <Link
                    href={`/wedding-rings/product?id=${product.id}`}
                    className="wr-card-link"
                  >
                    <div className="wr-card-img-wrap">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="wr-card-img"
                      />
                    </div>

                    <div className="wr-card-info-box">
                      <h3 className="wr-card-name">{product.name}</h3>
                      <p className="wr-card-metal">{product.metal}</p>
                      <p className="wr-card-price">
                        From <strong>{money(product.price)}</strong>
                      </p>
                      <span className="wr-card-view-details">
                        VIEW DETAILS &rarr;
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. BOTTOM BESPOKE WEDDING RINGS BANNER */}
      <section className="shell wr-bespoke-banner-section">
        <div className="wr-bespoke-cta-card facet-oct-sm">
          <div className="wr-bespoke-icon-pane">
            <div className="wr-bespoke-ring-circle">
              <Circle size={28} strokeWidth={1.3} />
            </div>
          </div>

          <div className="wr-bespoke-text-pane">
            <h3 className="wr-bespoke-heading">
              Can’t find what you’re looking for?
            </h3>
            <p className="wr-bespoke-sub">
              Create something unique with our Bespoke service. Made entirely for you.
            </p>
          </div>

          <div className="wr-bespoke-action-pane">
            <Link href="/bespoke" className="wr-bespoke-cta-btn facet-oct-sm">
              <span>START YOUR COMMISSION</span>
              <span className="wr-arrow">&rarr;</span>
            </Link>
            <span className="wr-bespoke-footer-label">BESPOKE WEDDING RINGS</span>
          </div>
        </div>
      </section>
    </main>
  );
}

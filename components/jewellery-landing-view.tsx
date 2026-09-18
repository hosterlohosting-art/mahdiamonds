"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, Heart } from "lucide-react";
import { toast } from "sonner";
import { money, products, type Product } from "@/lib/demo-data";
import { useDemoStore } from "@/components/demo-store-provider";
import type { RoutePage } from "@/lib/site-data";

interface JewelleryLandingViewProps {
  page?: RoutePage;
  query?: Record<string, string | string[] | undefined>;
}

const CATEGORY_CARDS = [
  {
    id: "necklace",
    label: "NECKLACES",
    filterValue: "necklace",
    image: "/images/styles/solitaire.jpg",
  },
  {
    id: "earring",
    label: "EARRINGS",
    filterValue: "earring",
    image: "/images/styles/halo.jpg",
  },
  {
    id: "bracelet",
    label: "BRACELETS",
    filterValue: "bracelet",
    image: "/images/styles/diamond-band.jpg",
  },
  {
    id: "ring",
    label: "RINGS",
    filterValue: "ring",
    image: "/images/mah-hero-concept.png",
  },
  {
    id: "pendant",
    label: "PENDANTS",
    filterValue: "pendant",
    image: "/images/styles/solitaire.jpg",
  },
  {
    id: "mens",
    label: "MEN’S JEWELLERY",
    filterValue: "men",
    image: "/images/styles/diamond-band.jpg",
  },
];

export function JewelleryLandingView({ page, query }: JewelleryLandingViewProps) {
  const store = useDemoStore();
  const router = useRouter();

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMetal, setSelectedMetal] = useState<string>("all");
  const [selectedGemstone, setSelectedGemstone] = useState<string>("all");
  const [selectedStyle, setSelectedStyle] = useState<string>("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");

  // Sync initial query params if present
  useEffect(() => {
    if (query?.style && typeof query.style === "string") {
      setSelectedCategory(query.style.toLowerCase());
    }
  }, [query]);

  // Handle Category Card Click (toggles filter)
  const handleCategoryCardClick = (catValue: string) => {
    if (selectedCategory === catValue) {
      setSelectedCategory("all");
    } else {
      setSelectedCategory(catValue);
    }
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => p.category === "jewellery");

    // Filter by Category
    if (selectedCategory !== "all") {
      list = list.filter((p) =>
        p.style.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        p.name.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Filter by Metal
    if (selectedMetal !== "all") {
      list = list.filter((p) => {
        const matchesPrimary = p.metal.toLowerCase().includes(selectedMetal.toLowerCase());
        const matchesAvailable = p.availableMetals?.some((m) =>
          m.toLowerCase().includes(selectedMetal.toLowerCase())
        );
        return matchesPrimary || matchesAvailable;
      });
    }

    // Filter by Gemstone
    if (selectedGemstone !== "all") {
      if (selectedGemstone === "diamond") {
        list = list.filter((p) => p.name.toLowerCase().includes("diamond") || p.description.toLowerCase().includes("diamond"));
      }
    }

    // Filter by Style
    if (selectedStyle !== "all") {
      list = list.filter((p) =>
        p.style.toLowerCase().includes(selectedStyle.toLowerCase()) ||
        p.description.toLowerCase().includes(selectedStyle.toLowerCase())
      );
    }

    // Filter by Price Range
    if (selectedPriceRange !== "all") {
      if (selectedPriceRange === "under2000") {
        list = list.filter((p) => p.price < 2000);
      } else if (selectedPriceRange === "2000to5000") {
        list = list.filter((p) => p.price >= 2000 && p.price <= 5000);
      } else if (selectedPriceRange === "over5000") {
        list = list.filter((p) => p.price > 5000);
      }
    }

    // Sorting
    if (sortBy === "priceAsc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceDesc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      list.sort((a, b) => b.id.localeCompare(a.id));
    }

    return list;
  }, [selectedCategory, selectedMetal, selectedGemstone, selectedStyle, selectedPriceRange, sortBy]);

  // Wishlist Toggle
  const handleWishlistToggle = (e: React.MouseEvent, p: Product) => {
    e.preventDefault();
    e.stopPropagation();
    store.toggleWishlist(p.id);
    const isSaved = store.wishlist.includes(p.id);
    if (!isSaved) {
      toast.success(`${p.name} added to your wishlist.`);
    } else {
      toast.info(`${p.name} removed from your wishlist.`);
    }
  };

  return (
    <main id="main-content" className="jewellery-landing-page-12a">
      {/* 1. JEWELLERY HERO SECTION */}
      <section className="j-hero-12a" aria-labelledby="j-hero-title">
        <div className="shell">
          <div className="j-hero-split-grid facet-oct">
            {/* Left Hero Pane */}
            <div className="j-hero-left-box">
              <p className="j-hero-eyebrow">JEWELLERY</p>
              <h1 id="j-hero-title" className="j-hero-heading">
                EXTRAORDINARY
                <br />
                IN EVERY DETAIL
              </h1>
              <div className="j-hero-accent-line" />
              <p className="j-hero-sub">
                Exquisite jewellery, crafted for life’s most meaningful moments.
              </p>
            </div>

            {/* Right Hero Editorial Visual Pane */}
            <div className="j-hero-right-pane">
              <Image
                src="/images/journal-diamonds.jpg"
                alt="High Fine Jewellery Diamond Rivière Necklace"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 55vw"
                className="j-hero-model-img"
              />
              <div className="j-hero-gradient-overlay" />
              <div className="j-hero-quote-box">
                <span className="j-quote-line-1">FINE JEWELLERY</span>
                <span className="j-quote-line-2">FOR A BRIGHTER</span>
                <span className="j-quote-line-3">TOMORROW</span>
                <div className="j-quote-accent-bar" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EXPLORE OUR JEWELLERY CATEGORY STRIP + MAH SIGNATURES */}
      <section className="j-categories-section">
        <div className="shell">
          <div className="j-categories-heading-wrap">
            <h2 className="j-categories-title">EXPLORE OUR JEWELLERY</h2>
          </div>

          <div className="j-categories-strip-grid">
            {/* 6 Core Category Cards */}
            {CATEGORY_CARDS.map((cat) => {
              const isActive = selectedCategory === cat.filterValue;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryCardClick(cat.filterValue)}
                  className={`j-category-card facet-oct-sm ${isActive ? "active" : ""}`}
                >
                  <div className="j-cat-img-wrap">
                    <Image src={cat.image} alt={cat.label} fill sizes="160px" className="j-cat-img" />
                  </div>
                  <div className="j-cat-label-row">
                    <span>{cat.label}</span>
                    <span className="j-cat-arrow">&rarr;</span>
                  </div>
                </button>
              );
            })}

            {/* 7th Card: MAH SIGNATURES (Prominent Dark Navy Card) */}
            <Link href="/jewellery/signatures" className="j-signatures-promo-card facet-oct-sm">
              <div className="j-sig-card-bg">
                <Image
                  src="/images/styles/diamond-band.jpg"
                  alt="MAH Signatures Collection"
                  fill
                  sizes="220px"
                  className="j-sig-bg-img"
                />
                <div className="j-sig-card-overlay" />
              </div>
              <div className="j-sig-card-content">
                <span className="j-sig-kicker">MAH</span>
                <span className="j-sig-title">SIGNATURES</span>
                <span className="j-sig-action">
                  DISCOVER <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. FILTERS & SORTING BAR */}
      <section className="j-filters-section">
        <div className="shell">
          <div className="j-filters-bar facet-oct-sm">
            {/* Left Filter Dropdowns */}
            <div className="j-filters-left-group">
              {/* Category */}
              <div className="j-filter-dropdown-wrap">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="j-filter-select"
                  aria-label="Filter by Category"
                >
                  <option value="all">Category</option>
                  <option value="necklace">Necklaces</option>
                  <option value="earring">Earrings</option>
                  <option value="bracelet">Bracelets</option>
                  <option value="ring">Rings</option>
                  <option value="pendant">Pendants</option>
                  <option value="men">Men's Jewellery</option>
                </select>
                <ChevronDown size={13} className="j-filter-chevron" />
              </div>

              {/* Metal */}
              <div className="j-filter-dropdown-wrap">
                <select
                  value={selectedMetal}
                  onChange={(e) => setSelectedMetal(e.target.value)}
                  className="j-filter-select"
                  aria-label="Filter by Metal"
                >
                  <option value="all">Metal</option>
                  <option value="Platinum">Platinum</option>
                  <option value="White Gold">18ct White Gold</option>
                  <option value="Yellow Gold">18ct Yellow Gold</option>
                  <option value="Rose Gold">18ct Rose Gold</option>
                </select>
                <ChevronDown size={13} className="j-filter-chevron" />
              </div>

              {/* Gemstone / Diamond */}
              <div className="j-filter-dropdown-wrap">
                <select
                  value={selectedGemstone}
                  onChange={(e) => setSelectedGemstone(e.target.value)}
                  className="j-filter-select"
                  aria-label="Filter by Gemstone or Diamond"
                >
                  <option value="all">Gemstone / Diamond</option>
                  <option value="diamond">Certified Diamonds</option>
                </select>
                <ChevronDown size={13} className="j-filter-chevron" />
              </div>

              {/* Style */}
              <div className="j-filter-dropdown-wrap">
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="j-filter-select"
                  aria-label="Filter by Style"
                >
                  <option value="all">Style</option>
                  <option value="solitaire">Solitaire</option>
                  <option value="halo">Halo</option>
                  <option value="tennis">Rivière / Tennis</option>
                  <option value="drop">Articulated Drop</option>
                </select>
                <ChevronDown size={13} className="j-filter-chevron" />
              </div>

              {/* Price */}
              <div className="j-filter-dropdown-wrap">
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="j-filter-select"
                  aria-label="Filter by Price"
                >
                  <option value="all">Price</option>
                  <option value="under2000">Under £2,000</option>
                  <option value="2000to5000">£2,000 – £5,000</option>
                  <option value="over5000">Over £5,000</option>
                </select>
                <ChevronDown size={13} className="j-filter-chevron" />
              </div>
            </div>

            {/* Right Sort Control */}
            <div className="j-sort-right-group">
              <label htmlFor="j-sort-select" className="j-sort-label">
                Sort by
              </label>
              <div className="j-filter-dropdown-wrap j-sort-dropdown">
                <select
                  id="j-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="j-filter-select"
                >
                  <option value="featured">Featured</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
                <ChevronDown size={13} className="j-filter-chevron" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRODUCT GRID */}
      <section className="j-product-grid-section">
        <div className="shell">
          {filteredProducts.length === 0 ? (
            <div className="j-no-results facet-oct-sm">
              <p>No jewellery pieces match your exact filter selection.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedMetal("all");
                  setSelectedGemstone("all");
                  setSelectedStyle("all");
                  setSelectedPriceRange("all");
                }}
                className="button button-outline-dark facet-oct-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="j-products-grid">
              {filteredProducts.map((p) => {
                const isSaved = store.wishlist.includes(p.id);
                return (
                  <article key={p.id} className="j-catalog-card facet-oct-sm">
                    {/* Top Wishlist Heart */}
                    <div className="j-card-top-action">
                      <button
                        type="button"
                        onClick={(e) => handleWishlistToggle(e, p)}
                        aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                        className={`j-card-heart ${isSaved ? "active" : ""}`}
                      >
                        <Heart
                          size={15}
                          fill={isSaved ? "var(--midnight)" : "none"}
                          strokeWidth={1.3}
                        />
                      </button>
                    </div>

                    <Link href={`/jewellery/product?id=${p.id}`} className="j-card-link">
                      <div className="j-card-img-wrap">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          sizes="(max-width: 900px) 100vw, 25vw"
                          className="j-card-img"
                        />
                      </div>

                      <div className="j-card-info-box">
                        <h3 className="j-card-name">{p.name}</h3>
                        <p className="j-card-metal">{p.metal}</p>
                        <p className="j-card-price">Price from MAH catalogue</p>
                        <span className="j-card-view-details">
                          VIEW DETAILS <span className="view-arrow">&rarr;</span>
                        </span>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

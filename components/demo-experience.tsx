"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  ChevronRight,
  Diamond,
  Eye,
  Gift,
  Heart,
  HelpCircle,
  Minus,
  Plus,
  RotateCcw,
  Ruler,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Truck,
  Share2,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import {
  diamonds,
  getDiamond,
  getProduct,
  money,
  products,
  type Diamond as DiamondType,
  type Product,
} from "@/lib/demo-data";
import { useDemoStore } from "@/components/demo-store-provider";
import { CaratOnHand } from "@/components/visualizer/carat-on-hand";
import { RingSizeGuideModal } from "@/components/ring-size-guide-modal";
import { DiamondLoupe } from "@/components/visualizer/diamond-loupe";
import { SalonBooking } from "@/components/appointments/salon-booking";
import { VaultPortal } from "@/components/client-vault/vault-portal";
import { ProductDetailView } from "@/components/product-detail-view";
import { JewelleryDetailView } from "@/components/jewellery-detail-view";
import { JewelleryLandingView } from "@/components/jewellery-landing-view";
import { DiamondsLandingView } from "@/components/diamonds-landing-view";
import { LooseDiamondsView } from "@/components/loose-diamonds-view";
import { DiamondDetailView } from "@/components/diamond-detail-view";
import { BespokeView } from "@/components/bespoke-view";
import { AtelierView } from "@/components/atelier-view";
import { OurHouseView } from "@/components/our-house-view";
import { JournalView } from "@/components/journal-view";
import { ExpertView } from "@/components/expert-view";
import { SignaturesView } from "@/components/signatures-view";
import { EngagementRingsLandingView } from "@/components/engagement-rings-landing-view";
import { EngagementRingConfiguratorView } from "@/components/engagement-ring-configurator-view";
import { EngagementRingsDiamondSelectionView } from "@/components/engagement-rings-diamond-selection-view";
import { EngagementRingsCompleteReviewView } from "@/components/engagement-rings-complete-review-view";
import { WeddingRingsLandingView } from "@/components/wedding-rings-landing-view";
import { WeddingRingDetailView } from "@/components/wedding-ring-detail-view";
import { ContactView } from "@/components/contact-view";
import { CheckoutStatusView } from "@/components/checkout-status-view";
import { CheckoutView } from "@/components/checkout-view";
import { BagView } from "@/components/bag-view";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { RoutePage } from "@/lib/site-data";

type Props = {
  routeKey: string;
  page: RoutePage;
  query?: Record<string, string | string[] | undefined>;
};

function PageIntro({
  page,
  children,
}: {
  page: RoutePage;
  children?: React.ReactNode;
}) {
  return (
    <section className="demo-hero">
      <div className="shell">
        <Link href="/" className="route-back">
          <ArrowLeft size={14} /> Back to Maison Home
        </Link>
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <p>{page.intro}</p>
        {children}
      </div>
    </section>
  );
}

function ProductVisual({
  product,
  selectedMetal,
  activeImage,
}: {
  product: Product;
  selectedMetal?: string;
  activeImage?: string;
}) {
  return (
    <div className={`sample-product-visual sample-${product.category}`}>
      <Image
        src={activeImage || product.image}
        alt={`${product.name} visual preview`}
        fill
        sizes="(max-width: 700px) 100vw, 33vw"
      />
      {/* Subtle MAH octagonal diamond hallmark watermark */}
      <span className="product-gem facet-oct-sm" aria-hidden="true">
        <Diamond size={22} />
      </span>
      <small>
        {selectedMetal || product.metal} · Fine Craftsmanship
      </small>
    </div>
  );
}

function MetalDots({
  metals,
  selected,
  onSelect,
}: {
  metals: string[];
  selected: string;
  onSelect: (metal: string) => void;
}) {
  const getDotClass = (m: string) => {
    if (m.includes("Platinum")) return "platinum";
    if (m.includes("Yellow")) return "yellow";
    if (m.includes("Rose")) return "rose";
    return "white";
  };

  return (
    <div className="metal-swatches" aria-label="Available metals">
      {metals.map((m) => (
        <button
          key={m}
          type="button"
          className={`metal-dot ${getDotClass(m)} ${selected === m ? "active" : ""}`}
          title={m}
          aria-label={m}
          onClick={(e) => {
            e.preventDefault();
            onSelect(m);
          }}
        />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const store = useDemoStore();
  const saved = store.wishlist.includes(product.id);
  const [activeMetal, setActiveMetal] = useState(product.metal);
  const availableMetals = product.availableMetals || [
    "Platinum",
    "18k White Gold",
    "18k Yellow Gold",
    "18k Rose Gold",
  ];

  const detailHref =
    product.category === "engagement"
      ? `/engagement-rings/configure?id=${product.id}&metal=${encodeURIComponent(activeMetal)}`
      : product.category === "wedding"
      ? `/wedding-rings/product?id=${product.id}&metal=${encodeURIComponent(activeMetal)}`
      : `/jewellery/product?id=${product.id}&metal=${encodeURIComponent(activeMetal)}`;

  return (
    <article className="product-card">
      <div className="product-card-media">
        <ProductVisual product={product} selectedMetal={activeMetal} />
        {product.badge && (
          <span className="product-badge facet-oct-sm">{product.badge}</span>
        )}
        <button
          className={`wish-button${saved ? " saved" : ""}`}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          onClick={() => {
            store.toggleWishlist(product.id);
            toast.success(
              saved ? "Removed from wishlist" : "Saved to your private wishlist"
            );
          }}
        >
          <Heart size={16} fill={saved ? "currentColor" : "none"} strokeWidth={1.3} />
        </button>
      </div>
      <div className="product-card-body">
        <div className="card-top-row">
          <p>{product.style} · {activeMetal}</p>
          <MetalDots
            metals={availableMetals}
            selected={activeMetal}
            onSelect={setActiveMetal}
          />
        </div>
        <h3>{product.name}</h3>
        <strong>
          {money(product.price)}{" "}
          <small>
            {product.category === "engagement" ? "Setting price" : "Incl. VAT"}
          </small>
        </strong>
        <Link href={detailHref}>
          {product.category === "engagement" ? "Configure Setting" : "Discover Piece"}{" "}
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}

function Filters({
  style,
  setStyle,
  metal,
  setMetal,
  collection,
  setCollection,
  category,
}: {
  style: string;
  setStyle: (value: string) => void;
  metal: string;
  setMetal: (value: string) => void;
  collection: string;
  setCollection: (value: string) => void;
  category: Product["category"];
}) {
  const catProducts = useMemo(
    () => products.filter((p) => p.category === category),
    [category]
  );
  const styles = useMemo(
    () => [...new Set(catProducts.map((p) => p.style))],
    [catProducts]
  );
  const collections = useMemo(
    () => [
      ...new Set(
        catProducts
          .map((p) => p.collection)
          .filter((c): c is string => Boolean(c))
      ),
    ],
    [catProducts]
  );

  return (
    <div className="filter-fields">
      <label>
        Design Silhouette
        <select value={style} onChange={(event) => setStyle(event.target.value)}>
          <option>All styles</option>
          {styles.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>

      {collections.length > 0 && (
        <label>
          Maison Collection
          <select
            value={collection}
            onChange={(event) => setCollection(event.target.value)}
          >
            <option>All collections</option>
            {collections.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      )}

      <label>
        Precious Metal
        <select value={metal} onChange={(event) => setMetal(event.target.value)}>
          <option>All metals</option>
          {["Platinum", "18k White Gold", "18k Yellow Gold", "18k Rose Gold"].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
    </div>
  );
}

function Catalog({
  page,
  category,
  signatures = false,
  query,
}: {
  page: RoutePage;
  category: Product["category"];
  signatures?: boolean;
  query?: Record<string, string | string[] | undefined>;
}) {
  const store = useDemoStore();
  const router = useRouter();
  const queryStyle = typeof query?.style === "string" ? query.style : "";
  const queryMetal = typeof query?.metal === "string" ? query.metal : "";
  const queryCollection = typeof query?.collection === "string" ? query.collection : "";
  const queryDiamondId = typeof query?.diamondId === "string" ? query.diamondId : "";

  const [style, setStyle] = useState("All styles");
  const [metal, setMetal] = useState("All metals");
  const [collection, setCollection] = useState("All collections");
  const [selectedShape, setSelectedShape] = useState("All");
  const [weddingTab, setWeddingTab] = useState("all");
  const [jewelleryType, setJewelleryType] = useState("all");
  const [sort, setSort] = useState("Featured");

  // Check if a diamond is pre-selected (Diamond-First journey from Section 11C)
  const activeDiamondId = queryDiamondId || store.ring.diamondId;
  const activeDiamond = activeDiamondId ? getDiamond(activeDiamondId) : null;

  useEffect(() => {
    if (queryStyle) setStyle(queryStyle);
    if (queryMetal) setMetal(queryMetal);
    if (queryCollection) setCollection(queryCollection);
  }, [queryStyle, queryMetal, queryCollection]);

  let results = products.filter((p) => {
    if (p.category !== category) return false;
    if (
      signatures &&
      !p.badge?.toLowerCase().includes("signature") &&
      !p.collection?.toLowerCase().includes("signature")
    ) {
      return false;
    }

    // Engagement: Shape Filter (Section 05A)
    if (category === "engagement" && selectedShape !== "All") {
      const matchShape = p.compatibleShapes?.includes(selectedShape) ||
        p.description.toLowerCase().includes(selectedShape.toLowerCase()) ||
        p.name.toLowerCase().includes(selectedShape.toLowerCase());
      if (!matchShape) return false;
    }

    // Wedding: 5 Navigation Categories (Section 10A)
    if (category === "wedding") {
      if (weddingTab === "womens" && p.gender !== "women" && p.gender !== "unisex" && p.style !== "Diamond") return false;
      if (weddingTab === "mens" && p.gender !== "men" && p.gender !== "unisex" && p.style !== "Plain") return false;
      if (weddingTab === "diamond" && p.style.toLowerCase() !== "diamond") return false;
      if (weddingTab === "plain" && p.style.toLowerCase() !== "plain") return false;
    }

    // Jewellery: Category Filter (Section 12A)
    if (category === "jewellery" && jewelleryType !== "all") {
      if (!p.style.toLowerCase().includes(jewelleryType.toLowerCase())) return false;
    }

    if (style !== "All styles") {
      const matchExact = p.style.toLowerCase() === style.toLowerCase();
      const matchPartial =
        p.style.toLowerCase().includes(style.toLowerCase()) ||
        style.toLowerCase().includes(p.style.toLowerCase());
      if (!matchExact && !matchPartial) return false;
    }

    if (metal !== "All metals") {
      const matchExact = p.metal.toLowerCase() === metal.toLowerCase();
      const matchAvailable = p.availableMetals?.some((m) =>
        m.toLowerCase().includes(metal.toLowerCase())
      );
      if (!matchExact && !matchAvailable) return false;
    }

    if (collection !== "All collections") {
      const matchExact = p.collection?.toLowerCase() === collection.toLowerCase();
      const matchPartial =
        p.collection?.toLowerCase().includes(collection.toLowerCase()) ||
        collection.toLowerCase().includes(p.collection?.toLowerCase() || "");
      if (!matchExact && !matchPartial) return false;
    }

    return true;
  });

  if (sort === "Price low to high") results = [...results].sort((a, b) => a.price - b.price);
  if (sort === "Price high to low") results = [...results].sort((a, b) => b.price - a.price);

  return (
    <main id="main-content">
      <PageIntro page={page} />
      <section className="section-pad demo-catalog">
        <div className="shell">
          {/* Section 05A / 11C: Diamond-First Active Reassurance Banner */}
          {category === "engagement" && activeDiamond && (
            <div className="diamond-first-banner facet-oct-sm">
              <div className="dfb-content">
                <Image
                  src={`/images/shapes/${activeDiamond.shape.toLowerCase()}.png`}
                  alt={activeDiamond.shape}
                  width={34}
                  height={34}
                  className="object-contain"
                />
                <div>
                  <strong>Diamond-First Commission Active</strong>
                  <p>
                    You have selected a {activeDiamond.carat.toFixed(2)}ct {activeDiamond.shape} ({activeDiamond.certificate} Certified, {money(activeDiamond.price)}). Choose a compatible setting below to complete your ring.
                  </p>
                </div>
              </div>
              <Link href="/diamonds/search" className="button button-ghost facet-oct-sm">
                Change Diamond
              </Link>
            </div>
          )}

          {/* Section 05A: 8-Shape Geometry Selector Strip for Engagement Rings */}
          {category === "engagement" && (
            <div className="shape-selector-strip" aria-label="Filter by compatible diamond shape">
              <span className="strip-title">Compatible Diamond Shape:</span>
              <div className="shape-pills">
                {["All", "Round", "Oval", "Emerald", "Pear", "Marquise", "Cushion", "Princess", "Radiant"].map((shp) => (
                  <button
                    key={shp}
                    type="button"
                    className={`shape-pill facet-oct-sm ${selectedShape === shp ? "active" : ""}`}
                    onClick={() => setSelectedShape(shp)}
                  >
                    {shp !== "All" && (
                      <Image
                        src={`/images/shapes/${shp.toLowerCase()}.png`}
                        alt={shp}
                        width={18}
                        height={18}
                        className="object-contain inline-block mr-1.5"
                      />
                    )}
                    {shp}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section 10A: 5 Approved Wedding Rings Navigation Categories */}
          {category === "wedding" && (
            <div className="wedding-category-tabs" role="tablist" aria-label="Wedding Ring Collections">
              {[
                { id: "all", label: "All Wedding Rings" },
                { id: "womens", label: "Women’s Wedding Rings" },
                { id: "mens", label: "Men’s Wedding Rings" },
                { id: "diamond", label: "Diamond Wedding Rings" },
                { id: "plain", label: "Plain Wedding Rings" },
                { id: "bespoke", label: "Bespoke Wedding Rings", isBespoke: true },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={weddingTab === tab.id}
                  className={`w-cat-tab facet-oct-sm ${weddingTab === tab.id ? "active" : ""}`}
                  onClick={() => {
                    if (tab.isBespoke) {
                      router.push("/bespoke");
                    } else {
                      setWeddingTab(tab.id);
                    }
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Section 12A: Jewellery Category Visual Cards & MAH Signatures Feature */}
          {category === "jewellery" && !signatures && (
            <div className="jewellery-gateway-module">
              <div className="jewellery-cat-row">
                {[
                  { id: "all", label: "All Jewellery" },
                  { id: "necklace", label: "Necklaces & Pendants" },
                  { id: "earring", label: "Earrings" },
                  { id: "bracelet", label: "Bracelets" },
                  { id: "ring", label: "Fine Rings" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`j-cat-btn facet-oct-sm ${jewelleryType === item.id ? "active" : ""}`}
                    onClick={() => setJewelleryType(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              {/* Section 12A Mandate: Prominent MAH Signatures Editorial Card */}
              <div className="signatures-feature-banner facet-oct-sm">
                <div className="sfb-content">
                  <span className="eyebrow">Haute Joaillerie Focus</span>
                  <h3>MAH Signatures</h3>
                  <p>
                    The definitive expression of MAH craftsmanship. Masterpieces created in single editions or reserved for bespoke commission.
                  </p>
                  <Link href="/jewellery/signatures" className="button button-dark facet-oct-sm">
                    Discover MAH Signatures <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="catalog-tools">
            <div className="desktop-filters">
              <Filters
                style={style}
                setStyle={setStyle}
                metal={metal}
                setMetal={setMetal}
                collection={collection}
                setCollection={setCollection}
                category={category}
              />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <button className="filter-button">
                  <SlidersHorizontal size={15} /> Filter Collection
                </button>
              </SheetTrigger>
              <SheetContent className="demo-sheet">
                <SheetHeader>
                  <SheetTitle>Filter the Collection</SheetTitle>
                  <SheetDescription>
                    Refine by precious metal, silhouette and royal collection suite.
                  </SheetDescription>
                </SheetHeader>
                <Filters
                  style={style}
                  setStyle={setStyle}
                  metal={metal}
                  setMetal={setMetal}
                  collection={collection}
                  setCollection={setCollection}
                  category={category}
                />
              </SheetContent>
            </Sheet>
            <span>{results.length} Creations</span>
            <label className="sort-field">
              Sort
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option>Featured</option>
                <option>Price low to high</option>
                <option>Price high to low</option>
              </select>
            </label>
          </div>
          <div className="product-grid">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {results.length === 0 && (
            <div className="empty-state">
              <Diamond />
              <h2>No pieces match your selection</h2>
              <p>Try clearing active filters to view all available creations.</p>
              <button
                className="button"
                onClick={() => {
                  setStyle("All styles");
                  setMetal("All metals");
                  setCollection("All collections");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function ChoiceButtons({
  label,
  values,
  value,
  onChange,
}: {
  label: string;
  values: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="choice-set">
      <legend>{label}</legend>
      <div>
        {values.map((item) => (
          <button
            type="button"
            key={item}
            className={value === item ? "selected" : ""}
            onClick={() => onChange(item)}
          >
            {item}
            {value === item && <Check size={13} />}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/* 10% Queensmith 3-Stage Configurator Progress Bar */
function ConfiguratorSteps({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  return (
    <nav className="config-step-bar" aria-label="Ring builder progress">
      <div className={`config-step-item ${currentStep >= 1 ? "active" : ""}`}>
        <span className="config-step-num">01</span>
        <span>Choose Setting</span>
      </div>
      <div className={`config-step-item ${currentStep >= 2 ? "active" : ""}`}>
        <span className="config-step-num">02</span>
        <span>Select Diamond</span>
      </div>
      <div className={`config-step-item ${currentStep >= 3 ? "active" : ""}`}>
        <span className="config-step-num">03</span>
        <span>Review & Finger Size</span>
      </div>
    </nav>
  );
}

function RingConfigurator({ page, query }: Props) {
  const store = useDemoStore();
  const product = getProduct(
    typeof query?.id === "string" ? query.id : store.ring.settingId
  );
  const initialMetal = typeof query?.metal === "string" ? query.metal : store.ring.metal;
  const [metal, setMetal] = useState(initialMetal);
  const [size, setSize] = useState(store.ring.size);
  const [activeImage, setActiveImage] = useState(product.image);
  const selectedDiamond = store.ring.diamondId ? getDiamond(store.ring.diamondId) : null;
  const [showHandVisualizer, setShowHandVisualizer] = useState(false);
  const [showLoupe, setShowLoupe] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    setActiveImage(product.image);
  }, [product.image]);

  const continueJourney = () => {
    store.updateRing({ settingId: product.id, metal, size });
  };

  return (
    <main id="main-content">
      <PageIntro page={page}>
        <ConfiguratorSteps currentStep={1} />
      </PageIntro>
      <section className="section-pad">
        <div className="shell product-detail">
          <div className="product-visual-column">
            <ProductVisual
              product={product}
              selectedMetal={metal}
              activeImage={activeImage}
            />
            {product.images && product.images.length > 1 && (
              <div className="product-thumb-strip" aria-label="Setting views">
                {product.images.map((img, idx) => (
                  <button
                    key={img}
                    type="button"
                    className={`thumb-btn ${activeImage === img ? "active" : ""}`}
                    onClick={() => setActiveImage(img)}
                    aria-label={`View angle ${idx + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} angle ${idx + 1}`}
                      width={60}
                      height={60}
                      style={{ objectFit: "contain" }}
                    />
                  </button>
                ))}
              </div>
            )}
            <div className="atelier-tools-row">
              <button
                type="button"
                className="atelier-tool-btn facet-oct-sm"
                onClick={() => setShowHandVisualizer(true)}
              >
                <Eye size={14} /> View Carat on Hand
              </button>
              <button
                type="button"
                className="atelier-tool-btn facet-oct-sm"
                onClick={() => setShowLoupe(true)}
              >
                <Search size={14} /> 10× Clarity Loupe
              </button>
            </div>
          </div>
          <div className="product-info">
            <p className="eyebrow">
              Maison Setting · Reference {product.id}
            </p>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <div className="price-line">
              <strong>{money(product.price)}</strong>
              <span>Bespoke setting price · Centre diamond chosen in Step 02</span>
            </div>
            <ChoiceButtons
              label="Precious Metal"
              values={["Platinum", "18k White Gold", "18k Yellow Gold", "18k Rose Gold"]}
              value={metal}
              onChange={setMetal}
            />
            <ChoiceButtons
              label="UK Standard Ring Size"
              values={["J", "K", "L", "M", "N", "O", "P", "Q"]}
              value={size}
              onChange={setSize}
            />
            <div className="size-guide-trigger-row" style={{ marginTop: "-8px", marginBottom: "16px", display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="size-guide-trigger-btn"
                onClick={() => setShowSizeGuide(true)}
                style={{ background: "none", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.76rem", color: "#8f7243", textDecoration: "underline", textUnderlineOffset: "3px" }}
              >
                <Ruler size={13} /> Sizing Guide & Complimentary Sizer Kit
              </button>
            </div>
            {/* Section 05B: Selected Diamond Dossier & Itemised Pricing */}
            {selectedDiamond ? (
              <div className="configured-diamond-dossier facet-oct-sm">
                <div className="cdd-header">
                  <span className="eyebrow">Selected Centre Diamond</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "6px 0 4px" }}>
                    <Image
                      src={`/images/shapes/${selectedDiamond.shape.toLowerCase()}.png`}
                      alt={selectedDiamond.shape}
                      width={30}
                      height={30}
                      className="object-contain"
                    />
                    <h4 style={{ margin: 0 }}>{selectedDiamond.carat.toFixed(2)}ct {selectedDiamond.shape} Diamond</h4>
                  </div>
                  <p>{selectedDiamond.type} · Colour {selectedDiamond.colour} · {selectedDiamond.clarity} · {selectedDiamond.cut} Cut · {selectedDiamond.certificate} Certified</p>
                </div>
                <div className="cdd-price-breakdown">
                  <div className="cdd-row">
                    <span>Maison Setting ({metal})</span>
                    <strong>{money(product.price)}</strong>
                  </div>
                  <div className="cdd-row">
                    <span>Centre Diamond ({selectedDiamond.carat}ct {selectedDiamond.shape})</span>
                    <strong>{money(selectedDiamond.price)}</strong>
                  </div>
                  <div className="cdd-row cdd-total">
                    <span>Complete Ring Price (incl. VAT)</span>
                    <strong>{money(product.price + selectedDiamond.price)}</strong>
                  </div>
                </div>
                <div className="cdd-actions">
                  <Link
                    className="button button-dark button-wide facet-oct-sm"
                    href="/engagement-rings/review"
                    onClick={continueJourney}
                  >
                    Review Complete Ring & Add to Bag <ArrowRight size={15} />
                  </Link>
                  <Link
                    className="button button-ghost button-wide facet-oct-sm"
                    href="/engagement-rings/diamonds"
                  >
                    Change Centre Diamond
                  </Link>
                </div>
              </div>
            ) : (
              <div className="action-row">
                <Link
                  className="button button-dark facet-oct-sm"
                  href="/engagement-rings/diamonds"
                  onClick={continueJourney}
                >
                  Continue to Choose Diamond <ArrowRight size={16} />
                </Link>
                <Link className="text-link" href="/expert">
                  <HelpCircle size={14} /> Size Guidance
                </Link>
              </div>
            )}
            <div className="checkout-trust-banner">
              <div className="trust-pill">
                <ShieldCheck size={16} />
                <span>Complimentary Resizing & Insured Delivery</span>
              </div>
              <div className="trust-pill">
                <Award size={16} />
                <span>Handcrafted in London Atelier</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showHandVisualizer && (
        <CaratOnHand
          isOpen={showHandVisualizer}
          onClose={() => setShowHandVisualizer(false)}
          defaultMetal={metal}
          defaultSize={size}
        />
      )}
      {showSizeGuide && (
        <RingSizeGuideModal
          isOpen={showSizeGuide}
          onClose={() => setShowSizeGuide(false)}
          initialSize={size}
          onSelectSize={(newSize) => setSize(newSize)}
        />
      )}
      {showLoupe && (
        <DiamondLoupe
          isOpen={showLoupe}
          onClose={() => setShowLoupe(false)}
        />
      )}
    </main>
  );
}

function DiamondTable({
  mode = "ring",
  initialType,
}: {
  mode?: "ring" | "loose";
  initialType?: string;
}) {
  const router = useRouter();
  const store = useDemoStore();
  const [type, setType] = useState(
    initialType === "lab-grown"
      ? "Lab-grown"
      : initialType === "natural"
      ? "Natural"
      : "All"
  );
  const [shape, setShape] = useState("All");
  const [compare, setCompare] = useState<string[]>([]);

  const results = diamonds.filter(
    (d) =>
      (type === "All" || d.type === type) &&
      (shape === "All" || d.shape === shape)
  );

  const choose = (diamond: DiamondType) => {
    if (mode === "ring") {
      store.updateRing({ diamondId: diamond.id });
      router.push("/engagement-rings/review");
    } else {
      router.push(`/diamonds/detail?id=${diamond.id}`);
    }
  };

  const toggleCompare = (id: string) =>
    setCompare((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : current.length < 3
        ? [...current, id]
        : current
    );

  return (
    <>
      <div className="diamond-toolbar">
        <div className="diamond-type-toggle">
          {["All", "Natural", "Lab-grown"].map((t) => (
            <button
              key={t}
              type="button"
              className={`diamond-type-btn ${type === t ? "active" : ""}`}
              onClick={() => setType(t)}
            >
              {t === "All" ? "All Diamonds" : `${t} Diamonds`}
            </button>
          ))}
        </div>
        <label>
          Shape
          <select value={shape} onChange={(e) => setShape(e.target.value)}>
            <option>All</option>
            {[...new Set(diamonds.map((d) => d.shape))].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>

      {compare.length > 0 && (
        <div className="compare-tray">
          <strong>Comparing {compare.length} of 3 Stones:</strong>
          {compare.map((id) => (
            <span key={id} className="compare-badge">
              {id}
            </span>
          ))}
          <button onClick={() => setCompare([])}>Clear Selection</button>
        </div>
      )}

      <div className="diamond-table-wrap">
        <table className="diamond-table">
          <thead>
            <tr>
              <th>Shape & Reference</th>
              <th>Origin</th>
              <th>Carat</th>
              <th>Colour</th>
              <th>Clarity</th>
              <th>Cut Grade</th>
              <th>Certification</th>
              <th>Price</th>
              <th>Compare</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {results.map((diamond) => (
              <tr key={diamond.id}>
                <td>
                  <span className="shape-icon">
                    <Image
                      src={`/images/shapes/${diamond.shape.toLowerCase()}.png`}
                      alt={diamond.shape}
                      width={22}
                      height={22}
                      className="object-contain"
                    />
                  </span>
                  <strong>{diamond.shape}</strong>
                  <small>{diamond.id}</small>
                </td>
                <td>
                  <span className="origin-badge">{diamond.type}</span>
                </td>
                <td>{diamond.carat.toFixed(2)}ct</td>
                <td>{diamond.colour}</td>
                <td>{diamond.clarity}</td>
                <td>{diamond.cut}</td>
                <td>
                  <span className="cert-pill">{diamond.certificate}</span>
                </td>
                <td>
                  <strong>{money(diamond.price)}</strong>
                </td>
                <td>
                  <input
                    aria-label={`Compare ${diamond.id}`}
                    type="checkbox"
                    checked={compare.includes(diamond.id)}
                    disabled={!compare.includes(diamond.id) && compare.length === 3}
                    onChange={() => toggleCompare(diamond.id)}
                  />
                </td>
                <td>
                  <button
                    className="mini-button facet-oct-sm"
                    onClick={() => choose(diamond)}
                  >
                    {mode === "ring" ? "Select Stone" : "View Diamond"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function DiamondsExperience({
  page,
  query,
  mode,
}: Props & { mode: "ring" | "loose" }) {
  return (
    <main id="main-content">
      <PageIntro page={page}>
        {mode === "ring" && <ConfiguratorSteps currentStep={2} />}
      </PageIntro>
      <section className="section-pad">
        <div className="shell">
          <DiamondTable
            mode={mode}
            initialType={typeof query?.type === "string" ? query.type : undefined}
          />
        </div>
      </section>
    </main>
  );
}

function RingReview({ page }: { page: RoutePage }) {
  const store = useDemoStore();
  const router = useRouter();
  const product = getProduct(store.ring.settingId);
  const diamond = getDiamond(store.ring.diamondId);

  const [showHand, setShowHand] = useState(false);
  const [showLoupe, setShowLoupe] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isSavingVault, setIsSavingVault] = useState(false);

  const saveToVault = async () => {
    setIsSavingVault(true);
    try {
      const payload = {
        name: `${product.name} with ${diamond.carat.toFixed(2)}ct ${diamond.shape}`,
        settingId: product.id,
        metal: store.ring.metal,
        size: store.ring.size,
        diamondId: diamond.id,
        diamondCarat: diamond.carat,
        diamondShape: diamond.shape,
        diamondPrice: diamond.price,
        settingPrice: product.price,
        totalPrice: product.price + diamond.price,
      };
      await fetch("/api/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      toast.success("Bespoke creation preserved in your private Maison Vault");
    } catch {
      toast.success("Creation saved locally to your Maison Vault");
    } finally {
      setIsSavingVault(false);
    }
  };

  return (
    <main id="main-content">
      <PageIntro page={page}>
        <ConfiguratorSteps currentStep={3} />
      </PageIntro>
      <section className="section-pad">
        <div className="shell review-layout">
          <ProductVisual product={product} selectedMetal={store.ring.metal} />
          <div className="review-card">
            <p className="eyebrow">Your Custom Creation</p>
            <h2>{product.name}</h2>
            <div className="summary-row">
              <span>Bespoke Setting</span>
              <strong>{money(product.price)}</strong>
              <small>{store.ring.metal} · UK Finger Size {store.ring.size}</small>
              <Link href={`/engagement-rings/configure?id=${product.id}`}>
                Edit Setting
              </Link>
            </div>
            <div className="summary-row">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <Image
                  src={`/images/shapes/${diamond.shape.toLowerCase()}.png`}
                  alt={diamond.shape}
                  width={28}
                  height={28}
                  className="object-contain"
                />
                <div>
                  <span style={{ display: "block" }}>Selected Centre Diamond</span>
                  <strong>{money(diamond.price)}</strong>
                </div>
              </div>
              <small>
                {diamond.carat.toFixed(2)}ct {diamond.shape} · {diamond.type} · Colour {diamond.colour} · {diamond.clarity} ({diamond.certificate} Certified)
              </small>
              <Link href="/engagement-rings/diamonds">Change Diamond</Link>
            </div>
            <div className="review-total">
              <span>Complete Creation Total</span>
              <strong>{money(product.price + diamond.price)}</strong>
            </div>

            <div className="review-action-stack">
              <button
                className="button button-dark button-wide facet-oct-sm"
                onClick={() => {
                  store.addCompleteRing(product, diamond);
                  toast.success("Complete bespoke ring added to your shopping bag");
                  router.push("/bag");
                }}
              >
                <ShoppingBag size={16} /> Add Complete Ring to Bag
              </button>

              <div className="review-secondary-tools">
                <button
                  type="button"
                  className="button button-ghost facet-oct-sm"
                  onClick={() => setShowHand(true)}
                >
                  <Eye size={15} /> Simulate Carat on Hand
                </button>
                <button
                  type="button"
                  className="button button-ghost facet-oct-sm"
                  onClick={() => setShowLoupe(true)}
                >
                  <Search size={15} /> 10× Precision Loupe
                </button>
                <button
                  type="button"
                  className="button button-ghost facet-oct-sm"
                  onClick={saveToVault}
                  disabled={isSavingVault}
                >
                  <Heart size={15} /> {isSavingVault ? "Saving..." : "Save to Maison Vault"}
                </button>
              </div>
            </div>

            <div className="checkout-trust-banner">
              <div className="trust-pill">
                <Award size={16} />
                <span>{diamond.certificate} Dossier & Hallmarked</span>
              </div>
              <div className="trust-pill">
                <RotateCcw size={16} />
                <span>30-Day Resizing & Inspection</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showHand && (
        <CaratOnHand
          isOpen={showHand}
          onClose={() => setShowHand(false)}
          defaultCarat={diamond.carat}
          defaultShape={diamond.shape}
          defaultMetal={store.ring.metal}
          defaultSize={store.ring.size}
        />
      )}
      {showLoupe && (
        <DiamondLoupe
          diamond={diamond}
          isOpen={showLoupe}
          onClose={() => setShowLoupe(false)}
        />
      )}
    </main>
  );
}

function ProductDetail({
  page,
  query,
  category,
}: Props & { category: "wedding" | "jewellery" | "engagement" }) {
  const fallback = products.find((p) => p.category === category)!;
  const picked =
    typeof query?.id === "string"
      ? products.find((p) => p.id === query.id)
      : undefined;
  const product = picked?.category === category ? picked : fallback;

  if (category === "jewellery") {
    return (
      <main id="main-content">
        <JewelleryDetailView product={product} />
      </main>
    );
  }

  return (
    <main id="main-content">
      <ProductDetailView product={product} category={category} />
    </main>
  );
}

function DiamondDetail({ page, query }: Props) {
  const store = useDemoStore();
  const router = useRouter();
  const [showLoupe, setShowLoupe] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const diamond = getDiamond(
    typeof query?.id === "string" ? query.id : undefined
  );

  return (
    <main id="main-content">
      <PageIntro page={page} />
      <section className="section-pad">
        <div className="shell diamond-detail">
          <div className="diamond-stage">
            <span className="facet-oct">
              <Diamond />
            </span>
            <small>
              {diamond.certificate} Certified · {diamond.type} Diamond
            </small>
            <button
              type="button"
              className="atelier-tool-btn facet-oct-sm"
              onClick={() => setShowLoupe(true)}
            >
              <Search size={14} /> Inspect 10× Precision Loupe
            </button>
          </div>
          <div className="product-info">
            <p className="eyebrow">
              Certified Stone · Reference {diamond.id}
            </p>
            <h2>
              {diamond.carat.toFixed(2)}ct {diamond.shape} Diamond
            </h2>
            <p>
              An individually graded certified diamond with exceptional optical symmetry and brilliance.
            </p>
            <div className="spec-grid">
              {[
                ["Origin", diamond.type],
                ["Shape", diamond.shape],
                ["Carat Weight", `${diamond.carat.toFixed(2)}ct`],
                ["Colour Grade", diamond.colour],
                ["Clarity Grade", diamond.clarity],
                ["Cut Grade", diamond.cut],
                ["Grading Authority", diamond.certificate],
                ["Polish & Symmetry", "Excellent"],
                ["Fluorescence", "None"],
              ].map(([label, value]) => (
                <div key={label}>
                  <small>{label}</small>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <div className="price-line">
              <strong>{money(diamond.price)}</strong>
              <span>Individual diamond price · VAT included</span>
            </div>
            <div className="action-row">
              <Link
                className="button button-dark facet-oct-sm"
                href="/engagement-rings"
                onClick={() => store.updateRing({ diamondId: diamond.id })}
              >
                Pair with an Engagement Setting
              </Link>
              <button
                type="button"
                className="button button-ghost facet-oct-sm"
                onClick={() => setShowLoupe(true)}
              >
                <Search size={15} /> 10× Loupe & Dossier
              </button>
              <button
                className="button button-ghost"
                onClick={() => {
                  store.addDiamond(diamond);
                  toast.success("Loose diamond added to bag");
                  router.push("/bag");
                }}
              >
                Reserve Loose Stone
              </button>
            </div>
          </div>
        </div>
      </section>

      {showLoupe && (
        <DiamondLoupe
          diamond={diamond}
          isOpen={showLoupe}
          onClose={() => setShowLoupe(false)}
        />
      )}
    </main>
  );
}

function Bag({ page }: { page: RoutePage }) {
  const store = useDemoStore();
  const total = store.bag.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main id="main-content">
      <PageIntro page={page} />
      <section className="section-pad">
        <div className="shell bag-layout">
          <div>
            {store.bag.length === 0 ? (
              <div className="empty-state">
                <ShoppingBag />
                <h2>Your Shopping Bag is Empty</h2>
                <p>
                  Explore our engagement rings, wedding bands, and high jewellery collections.
                </p>
                <Link className="button button-dark facet-oct-sm" href="/engagement-rings">
                  Explore Engagement Rings
                </Link>
              </div>
            ) : (
              store.bag.map((item) => (
                <article className="bag-item" key={item.key}>
                  <div className="bag-thumb">
                    {item.image ? (
                      <Image src={item.image} alt="" fill sizes="110px" />
                    ) : (
                      <Diamond />
                    )}
                  </div>
                  <div>
                    <div className="bag-item-leadtime">
                      {item.name.includes("diamond") ? (
                        <span className="leadtime-badge ready">⚡ Certified Loose Stone · Dispatched in 1–2 Days</span>
                      ) : item.name.includes("ring") || item.name.includes("Ring") ? (
                        <span className="leadtime-badge custom">✦ Made to Order · London Bench Crafting 2–3 Weeks</span>
                      ) : (
                        <span className="leadtime-badge atelier">✦ Atelier Piece · Hand-Finished in 2–3 Days</span>
                      )}
                    </div>
                    <p className="eyebrow">Maison Selection</p>
                    <h3>{item.name}</h3>
                    <p>{item.detail}</p>
                    <div className="quantity">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() =>
                          store.setQuantity(item.key, item.quantity - 1)
                        }
                      >
                        <Minus size={13} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() =>
                          store.setQuantity(item.key, item.quantity + 1)
                        }
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                  <strong>{money(item.price * item.quantity)}</strong>
                  <button
                    className="remove-button"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => store.removeBag(item.key)}
                  >
                    <Trash2 size={16} />
                  </button>
                </article>
              ))
            )}
          </div>

          {store.bag.length > 0 && (
            <aside className="order-summary">
              <p className="eyebrow">Your Selection</p>
              <div>
                <span>Subtotal</span>
                <strong>{money(total)}</strong>
              </div>
              <div>
                <span>Insured Global Delivery</span>
                <strong>Complimentary</strong>
              </div>
              <div>
                <span>Signature Midnight Blue Box</span>
                <strong>Included</strong>
              </div>
              <div>
                <span>Complimentary 30-Day Resizing</span>
                <strong>Included</strong>
              </div>
              <div>
                <span>London Assay Hallmarking</span>
                <strong>Verified</strong>
              </div>
              <div className="order-total">
                <span>Total</span>
                <strong>{money(total)}</strong>
              </div>
              <div className="bag-security-notice">
                <ShieldCheck size={16} />
                <p>Discreet, tamper-evident unbranded packaging. Fully insured by Lloyd's until signed for.</p>
              </div>
              <Link
                className="button button-dark button-wide facet-oct-sm"
                href="/checkout"
              >
                Proceed to Luxury Checkout
              </Link>
            </aside>
          )}
        </div>
      </section>
    </main>
  );
}

/* 5-Stage Private Luxury Checkout */
function Checkout({ page }: { page: RoutePage }) {
  const store = useDemoStore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [verify, setVerify] = useState(false);
  const [giftBox, setGiftBox] = useState(true);
  const [clientInfo, setClientInfo] = useState({
    title: "Lady",
    firstName: "Amelia",
    lastName: "Hart",
    email: "amelia.hart@example.com",
    phone: "+44 7700 900077",
  });
  const [deliveryMethod, setDeliveryMethod] = useState("Insured Royal Mail Special Delivery");
  const [paymentMethod, setPaymentMethod] = useState("Credit / Debit Card (Stripe)");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = store.bag.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const labels = ["Client", "Delivery", "Gifting", "Payment", "Review"];

  if (!store.bag.length) return <Bag page={page} />;

  const next = () => setStep((current) => Math.min(5, current + 1));
  const confirm = async () => {
    setIsSubmitting(true);
    let orderId = `MAH-ROYAL-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: `${clientInfo.title} ${clientInfo.firstName} ${clientInfo.lastName}`,
          email: clientInfo.email,
          items: store.bag,
          total,
          giftWrap: giftBox,
          deliveryMethod,
          paymentMethod,
        }),
      });
      const data: any = await res.json();
      if (data?.order?.id) {
        orderId = data.order.id;
      }
    } catch {
      // Offline fallback
    } finally {
      store.placeOrder(orderId);
      setIsSubmitting(false);
      router.push(verify ? "/verification" : "/confirmation");
    }
  };

  return (
    <main id="main-content">
      <PageIntro page={page} />
      <section className="section-pad">
        <div className="shell checkout-layout">
          <div className="checkout-main">
            <ol className="checkout-progress">
              {labels.map((label, index) => (
                <li
                  className={step >= index + 1 ? "active" : ""}
                  key={label}
                >
                  <span>0{index + 1}</span>
                  <small>{label}</small>
                </li>
              ))}
            </ol>

            <div className="checkout-panel">
              <p className="eyebrow">Step 0{step} of 05 · Private Checkout</p>

              {step === 1 && (
                <>
                  <h2>Client Identification</h2>
                  <p className="panel-sub">
                    Provide your contact details for discreet communication and delivery tracking.
                  </p>
                  <div className="form-grid">
                    <label>
                      Title
                      <select
                        value={clientInfo.title}
                        onChange={(e) => setClientInfo({ ...clientInfo, title: e.target.value })}
                      >
                        <option>Mr</option>
                        <option>Ms</option>
                        <option>Mrs</option>
                        <option>Dr</option>
                        <option>Lord</option>
                        <option>Lady</option>
                      </select>
                    </label>
                    <label>
                      First Name
                      <input
                        value={clientInfo.firstName}
                        onChange={(e) => setClientInfo({ ...clientInfo, firstName: e.target.value })}
                      />
                    </label>
                    <label className="wide">
                      Surname
                      <input
                        value={clientInfo.lastName}
                        onChange={(e) => setClientInfo({ ...clientInfo, lastName: e.target.value })}
                      />
                    </label>
                    <label className="wide">
                      Email Address
                      <input
                        type="email"
                        value={clientInfo.email}
                        onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                      />
                    </label>
                    <label className="wide">
                      Telephone (for courier dispatch updates)
                      <input
                        type="tel"
                        value={clientInfo.phone}
                        onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                      />
                    </label>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2>Delivery & Boutique Collection</h2>
                  <ChoiceButtons
                    label="Choose Fulfilment Method"
                    values={[
                      "Insured Royal Mail Special Delivery",
                      "Private Boutique Collection (Mayfair)",
                    ]}
                    value="Insured Royal Mail Special Delivery"
                    onChange={() => {}}
                  />
                  <div className="form-grid">
                    <label className="wide">
                      Address Line 1
                      <input defaultValue="14 Mount Street" />
                    </label>
                    <label className="wide">
                      Address Line 2 (Optional)
                      <input defaultValue="Mayfair" />
                    </label>
                    <label>
                      City
                      <input defaultValue="London" />
                    </label>
                    <label>
                      Postcode
                      <input defaultValue="W1K 2RF" />
                    </label>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2>Signature Packaging & Gifting</h2>
                  <p className="panel-sub">
                    Every piece is presented in MAH’s signature midnight-blue box with a silver-embossed monogram and wax-sealed certificate of authenticity.
                  </p>
                  <label className="check-row">
                    <input
                      type="checkbox"
                      checked={giftBox}
                      onChange={(e) => setGiftBox(e.target.checked)}
                    />
                    <span>
                      Include complimentary signature gift wrapping and wax-sealed authenticity dossier
                    </span>
                  </label>
                  <div className="form-grid">
                    <label className="wide">
                      Complimentary Handwritten Card Message (Optional)
                      <textarea
                        rows={3}
                        placeholder="Add a personal note to be calligraphed on our heavy cream cardstock..."
                      />
                    </label>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <h2>Payment & Concierge Settlement</h2>
                  <div className="secure-demo">
                    <ShieldCheck size={20} />
                    <div>
                      <strong>Bank-Grade 256-Bit SSL Encryption</strong>
                      <p>
                        All transactions are encrypted with 256-bit TLS security and verified via 3D Secure 2.0 protocol.
                      </p>
                    </div>
                  </div>
                  <ChoiceButtons
                    label="Payment Method"
                    values={[
                      "Credit / Debit Card (Stripe)",
                      "Apple Pay / Google Pay",
                      "Private Bank Wire Transfer",
                    ]}
                    value="Credit / Debit Card (Stripe)"
                    onChange={() => {}}
                  />
                  <label className="check-row">
                    <input
                      type="checkbox"
                      checked={verify}
                      onChange={(e) => setVerify(e.target.checked)}
                    />
                    <span>
                      Preview high-value 3D Secure verification step after confirming
                    </span>
                  </label>
                </>
              )}

              {step === 5 && (
                <>
                  <h2>Order Review & Authenticity Confirmation</h2>
                  {store.bag.map((item) => (
                    <div className="checkout-line" key={item.key}>
                      <span>
                        {item.name}
                        <small>{item.detail}</small>
                      </span>
                      <strong>{money(item.price * item.quantity)}</strong>
                    </div>
                  ))}
                  <div className="review-total">
                    <span>Total Amount</span>
                    <strong>{money(total)}</strong>
                  </div>
                  <div className="checkout-trust-banner">
                    <div className="trust-pill">
                      <ShieldCheck size={16} />
                      <span>Insured Royal Mail Delivery</span>
                    </div>
                    <div className="trust-pill">
                      <Award size={16} />
                      <span>Lifetime Warranty Included</span>
                    </div>
                  </div>
                </>
              )}

              <div className="checkout-actions">
                {step > 1 && (
                  <button
                    className="button button-ghost"
                    onClick={() => setStep(step - 1)}
                  >
                    Back
                  </button>
                )}
                <button
                  className="button button-dark facet-oct-sm"
                  onClick={step === 5 ? confirm : next}
                >
                  {step === 5 ? "Confirm Order" : "Continue"}{" "}
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>

          <aside className="order-summary">
            <p className="eyebrow">Your Selection</p>
            {store.bag.map((item) => (
              <div key={item.key}>
                <span>
                  {item.name} × {item.quantity}
                </span>
                <strong>{money(item.price * item.quantity)}</strong>
              </div>
            ))}
            <div className="order-total">
              <span>Total</span>
              <strong>{money(total)}</strong>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function StatusPage({
  page,
  verification = false,
}: {
  page: RoutePage;
  verification?: boolean;
}) {
  const store = useDemoStore();
  const router = useRouter();

  return (
    <main id="main-content">
      <PageIntro page={page} />
      <section className="section-pad">
        <div className="shell status-card">
          <span className="status-icon facet-oct">
            {verification ? <ShieldCheck size={28} /> : <Check size={28} />}
          </span>
          <p className="eyebrow">Maison Confirmation</p>
          <h2>
            {verification
              ? "3D Secure Verification Ready"
              : "Your Order is Confirmed"}
          </h2>
          <p>
            {verification
              ? "In live production, an approved provider securely authenticates this payment step. No credentials were transmitted."
              : `Order Reference ${store.lastOrder || "MAH-ROYAL-7890"}. An order dossier has been recorded for your private demonstration.`}
          </p>
          {verification ? (
            <button
              className="button button-dark facet-oct-sm"
              onClick={() => router.push("/confirmation")}
            >
              Complete Verification
            </button>
          ) : (
            <div className="action-row">
              <Link className="button button-dark facet-oct-sm" href="/">
                Return to Maison Home
              </Link>
              <Link className="text-link" href="/account">
                View Demo Account Space
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Wishlist({ page }: { page: RoutePage }) {
  const store = useDemoStore();
  const router = useRouter();
  const saved = products.filter((p) => store.wishlist.includes(p.id));
  const [shareMsg, setShareMsg] = useState("");

  const moveToBAG = (product: Product) => {
    store.addProduct(product, product.metal);
    store.toggleWishlist(product.id);
    toast.success(`${product.name} moved to your bag`);
  };

  const shareWishlist = () => {
    const items = saved.map((p) => p.name).join(", ");
    const text = `My MAH Diamonds Wishlist: ${items}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setShareMsg("Wishlist link copied to clipboard");
      setTimeout(() => setShareMsg(""), 3000);
    }
  };

  return (
    <main id="main-content">
      <PageIntro page={page} />
      <section className="section-pad">
        <div className="shell">
          {saved.length > 0 && (
            <div className="wishlist-toolbar">
              <div className="wishlist-count">
                <Heart size={16} fill="currentColor" />
                <span>{saved.length} Saved {saved.length === 1 ? "Creation" : "Creations"}</span>
              </div>
              <div className="wishlist-actions-row">
                {shareMsg && <span className="wishlist-share-msg"><Check size={14} /> {shareMsg}</span>}
                <button className="button button-ghost button-sm" onClick={shareWishlist}>
                  <Share2 size={14} /> Share Wishlist
                </button>
                <Link className="button button-outline-dark button-sm" href="/appointments">
                  <Calendar size={14} /> Book Salon Viewing
                </Link>
              </div>
            </div>
          )}

          {saved.length ? (
            <div className="wishlist-grid">
              {saved.map((p) => (
                <article className="wishlist-card" key={p.id}>
                  <div className="wishlist-card-media">
                    <ProductVisual product={p} />
                    {p.badge && <span className="product-badge facet-oct-sm">{p.badge}</span>}
                  </div>
                  <div className="wishlist-card-body">
                    <div className="wishlist-card-top">
                      <p className="wishlist-card-style">{p.style} · {p.metal}</p>
                      <h3>{p.name}</h3>
                      <strong>{money(p.price)} <small>{p.category === "engagement" ? "Setting price" : "Incl. VAT"}</small></strong>
                    </div>
                    <div className="wishlist-card-meta">
                      {p.compatibleShapes && (
                        <span className="wishlist-shapes">Compatible: {p.compatibleShapes.slice(0, 3).join(", ")}</span>
                      )}
                      {p.availableMetals && (
                        <span className="wishlist-metals">{p.availableMetals.length} metal options</span>
                      )}
                    </div>
                    <div className="wishlist-card-actions">
                      <button className="button button-dark button-sm facet-oct-sm" onClick={() => moveToBAG(p)}>
                        <ShoppingBag size={14} /> Move to Bag
                      </button>
                      <Link
                        className="button button-ghost button-sm"
                        href={p.category === "engagement" ? `/engagement-rings/configure?id=${p.id}` : p.category === "wedding" ? `/wedding-rings/product?id=${p.id}` : `/jewellery/product?id=${p.id}`}
                      >
                        <Eye size={14} /> View Details
                      </Link>
                      <button
                        className="wishlist-remove-btn"
                        onClick={() => { store.toggleWishlist(p.id); toast.success("Removed from wishlist"); }}
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon-wrap"><Heart size={36} /></div>
              <h2>No Saved Creations Yet</h2>
              <p>Select the heart on any piece to preserve it in your private curated wishlist.</p>
              <div className="empty-actions">
                <Link className="button button-dark facet-oct-sm" href="/engagement-rings">Engagement Rings</Link>
                <Link className="button button-ghost facet-oct-sm" href="/jewellery">High Jewellery</Link>
                <Link className="button button-ghost facet-oct-sm" href="/diamonds/search">Certified Diamonds</Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function SearchPage({ page }: { page: RoutePage }) {
  const [term, setTerm] = useState("");
  const results = useMemo(
    () =>
      term.length < 2
        ? []
        : products.filter((p) =>
            `${p.name} ${p.style} ${p.metal} ${p.category}`
              .toLowerCase()
              .includes(term.toLowerCase())
          ),
    [term]
  );

  return (
    <main id="main-content">
      <PageIntro page={page} />
      <section className="section-pad">
        <div className="shell search-experience">
          <label>
            <Search />
            <input
              autoFocus
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search by piece, style or metal (e.g. ‘solitaire’, ‘platinum’)"
            />
            <span>
              {term.length >= 2
                ? `${results.length} Creations Found`
                : "Enter at least 2 characters"}
            </span>
          </label>
          {results.length > 0 && (
            <div className="product-grid">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function DemoForm({
  kind,
}: {
  kind: "expert" | "appointment" | "account";
}) {
  const [sent, setSent] = useState(false);
  const [step, setStep] = useState(1);

  if (sent)
    return (
      <div className="status-card compact">
        <span className="status-icon facet-oct">
          <Check size={24} />
        </span>
        <h2>
          {kind === "appointment"
            ? "Private Consultation Requested"
            : kind === "account"
            ? "Maison Client Space Opened"
            : "Enquiry Received"}
        </h2>
        <p>
          This is a demonstration confirmation. Your request has been simulated locally.
        </p>
        <button
          className="button button-ghost"
          onClick={() => {
            setSent(false);
            setStep(1);
          }}
        >
          Begin Again
        </button>
      </div>
    );

  if (kind === "account")
    return (
      <div className="service-card">
        <p className="eyebrow">Client Portal Preview</p>
        <h2>Welcome to Your MAH Space</h2>
        <div className="form-grid">
          <label className="wide">
            Email Address
            <input type="email" defaultValue="alex@example.com" />
          </label>
          <label className="wide">
            Passphrase
            <input type="password" defaultValue="sample-only" />
          </label>
        </div>
        <button
          className="button button-dark button-wide facet-oct-sm"
          onClick={() => setSent(true)}
        >
          Enter Private Space
        </button>
        <p className="panel-note">
          Local demonstration preview. No account is created on a server.
        </p>
      </div>
    );

  if (kind === "appointment")
    return (
      <div className="service-card">
        <div className="service-progress">Consultation Step 0{step} of 04</div>
        {step === 1 && (
          <>
            <p className="eyebrow">Private Viewing</p>
            <h2>How would you prefer to meet?</h2>
            <ChoiceButtons
              label="Consultation Location"
              values={[
                "Mayfair Boutique (London)",
                "Hatton Garden Salon (London)",
                "Virtual Private Consultation",
              ]}
              value="Mayfair Boutique (London)"
              onChange={() => {}}
            />
            <ChoiceButtons
              label="Discussion Focus"
              values={[
                "Engagement Rings",
                "Wedding Bands",
                "High Jewellery",
                "Bespoke Commission",
              ]}
              value="Engagement Rings"
              onChange={() => {}}
            />
          </>
        )}
        {step === 2 && (
          <>
            <p className="eyebrow">Demonstration Times</p>
            <h2>Select your preferred date & time</h2>
            <ChoiceButtons
              label="Date"
              values={["Tue 15 Sep", "Thu 17 Sep", "Sat 19 Sep"]}
              value="Tue 15 Sep"
              onChange={() => {}}
            />
            <ChoiceButtons
              label="Time"
              values={["11:00", "14:00", "16:30"]}
              value="11:00"
              onChange={() => {}}
            />
          </>
        )}
        {step === 3 && (
          <>
            <p className="eyebrow">Client Information</p>
            <h2>Who will we have the pleasure of welcoming?</h2>
            <div className="form-grid">
              <label>
                First Name
                <input defaultValue="Amelia" />
              </label>
              <label>
                Surname
                <input defaultValue="Hart" />
              </label>
              <label className="wide">
                Email Address
                <input type="email" defaultValue="amelia.hart@example.com" />
              </label>
              <label className="wide">
                Specific Pieces or Requests (Optional)
                <textarea placeholder="e.g. Interested in comparing an oval vs emerald diamond on the Aster Solitaire." />
              </label>
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <p className="eyebrow">Consultation Summary</p>
            <h2>Confirm Your Private Viewing</h2>
            <div className="secure-demo">
              <Check size={18} />
              <div>
                <strong>Mayfair Boutique · Engagement Rings</strong>
                <p>Tuesday 15 September at 11:00 — Demonstration booking.</p>
              </div>
            </div>
          </>
        )}
        <div className="checkout-actions">
          {step > 1 && (
            <button
              className="button button-ghost"
              onClick={() => setStep(step - 1)}
            >
              Back
            </button>
          )}
          <button
            className="button button-dark facet-oct-sm"
            onClick={() => (step === 4 ? setSent(true) : setStep(step + 1))}
          >
            {step === 4 ? "Confirm Consultation Request" : "Continue"}
          </button>
        </div>
      </div>
    );

  return (
    <div className="service-card">
      <p className="eyebrow">Concierge Enquiry</p>
      <h2>Speak with an MAH Specialist</h2>
      <div className="form-grid">
        <label>
          First Name
          <input defaultValue="Amelia" />
        </label>
        <label>
          Surname
          <input defaultValue="Hart" />
        </label>
        <label className="wide">
          Email Address
          <input type="email" defaultValue="amelia.hart@example.com" />
        </label>
        <label className="wide">
          Topic of Guidance
          <select>
            <option>Bespoke Engagement Ring</option>
            <option>Diamond 4Cs Selection</option>
            <option>Wedding Band Pairing</option>
            <option>Atelier Commission</option>
          </select>
        </label>
        <label className="wide">
          Your Message
          <textarea defaultValue="I would like personal guidance on comparing natural vs lab-grown diamonds for the Aster Solitaire setting." />
        </label>
      </div>
      <button
        className="button button-dark button-wide facet-oct-sm"
        onClick={() => setSent(true)}
      >
        Submit Concierge Request
      </button>
    </div>
  );
}

function ServicePage({
  page,
  kind,
}: {
  page: RoutePage;
  kind: "expert" | "appointment" | "account";
}) {
  return (
    <main id="main-content">
      <PageIntro page={page} />
      <section className="section-pad">
        <div className="shell service-layout">
          <DemoForm kind={kind} />
          <aside>
            <p className="eyebrow">Personal Service</p>
            <h2>Rooted in Conversation & Craft</h2>
            <p>
              Whether meeting in our London salons or speaking virtually, our specialists provide calm, transparent guidance for every milestone piece.
            </p>
            <Link className="text-link" href="/contact">
              Alternative Contact Options <ArrowRight size={14} />
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}

export function DemoExperience(props: Props) {
  const { routeKey, page } = props;
  if (routeKey === "engagement-rings") return <EngagementRingsLandingView page={page} query={props.query} />;
  if (routeKey === "wedding-rings") return <WeddingRingsLandingView page={page} query={props.query} />;
  if (routeKey === "jewellery") return <JewelleryLandingView page={page} query={props.query} />;
  if (routeKey === "jewellery/signatures" || routeKey === "signatures") return <SignaturesView page={page} />;
  if (routeKey === "engagement-rings/configure") return <EngagementRingConfiguratorView page={page} query={props.query} />;
  if (routeKey === "engagement-rings/diamonds") return <EngagementRingsDiamondSelectionView page={page} query={props.query} />;
  if (routeKey === "diamonds") return <DiamondsLandingView page={page} />;
  if (routeKey === "diamonds/search") return <LooseDiamondsView page={page} query={props.query} mode="loose" />;
  if (routeKey === "diamonds/detail") return <DiamondDetailView diamondId={typeof props.query?.id === "string" ? props.query.id : undefined} page={page} query={props.query} />;
  if (routeKey === "engagement-rings/review") return <EngagementRingsCompleteReviewView page={page} query={props.query} />;
  if (routeKey === "wedding-rings/product") return <WeddingRingDetailView page={page} query={props.query} productId={typeof props.query?.id === "string" ? props.query.id : undefined} />;
  if (routeKey === "jewellery/product") return <ProductDetail {...props} category="jewellery" />;
  if (routeKey === "bespoke") return <BespokeView page={page} />;
  if (routeKey === "atelier") return <AtelierView page={page} />;
  if (routeKey === "our-house") return <OurHouseView page={page} />;
  if (routeKey === "journal") return <JournalView page={page} />;
  if (routeKey === "journal/article") return <JournalView page={page} articleId={(typeof props.query?.id === "string" ? props.query.id : undefined) || "vision-of-mah"} />;
  if (routeKey === "expert") return <ExpertView page={page} />;
  if (routeKey === "contact") return <ContactView page={page} />;
  if (routeKey === "bag") return <BagView page={page} />;
  if (routeKey === "checkout") return <CheckoutView page={page} />;
  if (routeKey === "verification") return <CheckoutStatusView page={page} verification />;
  if (routeKey === "confirmation") return <CheckoutStatusView page={page} />;
  if (routeKey === "wishlist") return <Wishlist page={page} />;
  if (routeKey === "search") return <SearchPage page={page} />;
  if (routeKey === "appointments")
    return (
      <main id="main-content" className="appointments-page-shell">
        <SalonBooking />
      </main>
    );
  if (routeKey === "account")
    return (
      <main id="main-content">
        <PageIntro page={page} />
        <section className="section-pad">
          <div className="shell">
            <VaultPortal />
          </div>
        </section>
      </main>
    );
  return null;
}

export const interactiveRoutes = new Set([
  "engagement-rings",
  "wedding-rings",
  "jewellery",
  "jewellery/signatures",
  "engagement-rings/configure",
  "engagement-rings/diamonds",
  "diamonds",
  "diamonds/search",
  "diamonds/detail",
  "engagement-rings/review",
  "wedding-rings/product",
  "jewellery/product",
  "bespoke",
  "atelier",
  "our-house",
  "journal",
  "journal/article",
  "expert",
  "appointments",
  "contact",
  "bag",
  "checkout",
  "verification",
  "confirmation",
  "wishlist",
  "search",
  "account",
]);


"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Diamond as DiamondIcon,
  Eye,
  Heart,
  HelpCircle,
  Maximize2,
  Phone,
  RotateCcw,
  RotateCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
  FileText,
  Calendar,
  MessageSquare,
  Mail,
  Clock,
  Award,
  Lock,
} from "lucide-react";
import {
  products,
  diamonds,
  getProduct,
  getDiamond,
  type Product,
  type Diamond,
  money,
} from "@/lib/demo-data";
import { useDemoStore } from "@/components/demo-store-provider";
import type { RoutePage } from "@/lib/site-data";
import { RingSizeGuideModal } from "@/components/ring-size-guide-modal";
import { toast } from "sonner";

interface EngagementRingsCompleteReviewViewProps {
  page?: RoutePage;
  query?: Record<string, string | string[] | undefined>;
}

export function EngagementRingsCompleteReviewView({
  page,
  query,
}: EngagementRingsCompleteReviewViewProps) {
  const store = useDemoStore();
  const router = useRouter();

  // 1. Resolve Active Configured Setting
  const settingId =
    typeof query?.setting === "string"
      ? query.setting
      : typeof query?.id === "string"
      ? query.id
      : store.ring.settingId || "ER-000";

  const product = useMemo(() => {
    return products.find((p) => p.id === settingId) || getProduct("ER-000");
  }, [settingId]);

  const selectedMetal =
    typeof query?.metal === "string"
      ? query.metal
      : store.ring.metal || product.metal || "Platinum";

  const selectedShape =
    typeof query?.shape === "string"
      ? query.shape
      : store.ring.diamondShape || "Round";

  const selectedBand =
    typeof query?.band === "string"
      ? query.band
      : store.ring.bandStyle || "Classic (2.0mm)";

  const [selectedSize, setSelectedSize] = useState<string>(
    typeof query?.size === "string" ? query.size : store.ring.size || "L 1/2"
  );

  const [isChangingSize, setIsChangingSize] = useState<boolean>(false);

  // 2. Resolve Active Diamond
  const diamondId =
    typeof query?.diamondId === "string"
      ? query.diamondId
      : store.ring.diamondId || "D-05D";

  const diamond = useMemo(() => {
    return diamonds.find((d) => d.id === diamondId) || diamonds.find((d) => d.id === "D-05D") || getDiamond("D-001");
  }, [diamondId]);

  // Surcharges & Calculations
  const bandSurcharge = selectedBand.includes("Pavé") ? 350 : store.ring.bandSurcharge || 0;
  // If product is ER-000 and matches wireframe £2,950 setting price (or base price + surcharge)
  const baseSettingPrice = product.id === "ER-000" && !bandSurcharge ? 2950 : product.price;
  const finalSettingPrice = baseSettingPrice + bandSurcharge;
  const finalDiamondPrice = diamond.price;
  const chargeableExtras = 0;
  const totalPrice = finalSettingPrice + finalDiamondPrice + chargeableExtras;

  // Visual State
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [is360Active, setIs360Active] = useState<boolean>(false);
  const [spinAngle, setSpinAngle] = useState<number>(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState<boolean>(false);

  // Modals & Tools
  const [isGiaModalOpen, setIsGiaModalOpen] = useState<boolean>(false);
  const [isDiamondDetailsExpanded, setIsDiamondDetailsExpanded] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [showHandModal, setShowHandModal] = useState<boolean>(false);
  const [showLoupeModal, setShowLoupeModal] = useState<boolean>(false);
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState<boolean>(false);

  // Wishlist & Add to Bag State
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [isAddedSuccess, setIsAddedSuccess] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // Media angles list
  const mediaAngles = useMemo(() => {
    const mainImg = product.metalImages?.[selectedMetal] || product.image || "/images/styles/solitaire.jpg";
    return [
      { id: 0, title: "Mounted Front View", src: mainImg, type: "image" },
      { id: 1, title: "Overhead Table Angle", src: "/images/mah-hero-concept.png", type: "image" },
      { id: 2, title: "Side Elevation Profile", src: "/images/styles/solitaire.jpg", type: "image" },
      { id: 3, title: "Atelier Hallmark Detail", src: "/images/metals/platinum.jpg", type: "image" },
    ];
  }, [product, selectedMetal]);

  // Today formatted for Revalidation Badge
  const todayFormatted = useMemo(() => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
  }, []);

  // Update store ring configuration on mount or change
  useEffect(() => {
    store.updateRing({
      settingId: product.id,
      diamondId: diamond.id,
      diamondShape: selectedShape,
      diamondType: diamond.type,
      metal: selectedMetal,
      bandStyle: selectedBand,
      bandSurcharge: bandSurcharge,
      size: selectedSize,
    });
  }, [product.id, diamond.id, selectedShape, diamond.type, selectedMetal, selectedBand, bandSurcharge, selectedSize]);

  // Add Complete Ring to Bag handler
  const handleAddCompleteRingToBag = () => {
    setIsAdding(true);
    setTimeout(() => {
      store.addCompleteRing(
        {
          ...product,
          price: finalSettingPrice,
          metal: selectedMetal,
        },
        diamond,
        {
          metal: selectedMetal,
          size: selectedSize,
          bandStyle: selectedBand,
          bandSurcharge: bandSurcharge,
          diamondShape: selectedShape,
        }
      );
      setIsAdding(false);
      setIsAddedSuccess(true);
      toast.success("Your complete bespoke ring has been added to the bag.", {
        description: `${product.name} with ${diamond.carat.toFixed(2)}ct ${diamond.shape} Brilliant`,
      });
    }, 400);
  };

  // Save to Wishlist / Vault
  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    if (!isWishlisted) {
      toast.success("Complete ring configuration saved to your Wishlist & Maison Vault");
    } else {
      toast.info("Removed from saved items");
    }
  };

  const ukSizes = [
    "G", "H", "I", "J", "K", "L", "L 1/2", "M", "M 1/2", "N", "N 1/2",
    "O", "O 1/2", "P", "P 1/2", "Q", "R", "S", "T", "U", "V"
  ];

  return (
    <main id="main-content" className="er-complete-review-page bg-[#FAF8F5] text-[#1B1B1B] min-h-screen pb-20">
      {/* 0. Top Context Bar & Breadcrumbs */}
      <div className="bg-white border-b border-[#E8E1D5] py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/engagement-rings/diamonds?setting=${product.id}&metal=${encodeURIComponent(selectedMetal)}&band=${encodeURIComponent(selectedBand)}&size=${encodeURIComponent(selectedSize)}&shape=${encodeURIComponent(selectedShape)}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#0C1B54] hover:text-[#8F7243] transition-colors uppercase"
            >
              <ArrowLeft size={14} /> Back to Diamond Selection
            </Link>
            <span className="text-slate-300">|</span>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 hidden sm:flex">
              <Link href="/engagement-rings" className="hover:underline">Engagement Rings</Link>
              <span>›</span>
              <Link href={`/engagement-rings/configure?id=${product.id}`} className="hover:underline">{product.name}</Link>
              <span>›</span>
              <span className="text-[#0C1B54] font-medium">Complete Review</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="bg-[#0C1B54]/5 text-[#0C1B54] font-mono px-2.5 py-1 rounded border border-[#0C1B54]/15">
              Step 3 of 3: Final Verification
            </span>
          </div>
        </div>
      </div>

      {/* Hero Title Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-4">
        <div className="max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-[#8F7243] font-bold">
            05D — COMPLETE RING REVIEW & ADD TO BAG
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#0C1B54] mt-1.5 tracking-tight">
            Review Your Bespoke Creation
          </h1>
          <p className="text-sm text-slate-600 mt-2 font-serif italic">
            Review every detail of your ring. We recommend you take a moment to ensure everything is exactly as you wish.
          </p>
        </div>
      </section>

      {/* Main Review Section (2-Column Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: Main Visual Render & 4-Angle Media Gallery   */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="bg-white border border-[#E8E1D5] rounded-xl p-6 shadow-sm relative overflow-hidden group">
              
              {/* Badge Overlay */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <span className="bg-[#0C1B54] text-[#FAF8F5] text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded shadow-sm">
                  Complete Ring Render
                </span>
                <span className="bg-[#C5A880]/20 text-[#8F7243] border border-[#C5A880]/50 text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded">
                  {selectedMetal} · {diamond.carat.toFixed(2)}ct {diamond.shape}
                </span>
              </div>

              {/* Interactive Tools (Top Right) */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIs360Active(!is360Active)}
                  className={`p-2 rounded-full border text-xs font-semibold flex items-center gap-1 transition-all ${
                    is360Active
                      ? "bg-[#0C1B54] text-white border-[#0C1B54] shadow-md"
                      : "bg-white/90 backdrop-blur-sm text-slate-700 border-[#E8E1D5] hover:bg-white"
                  }`}
                  title="360° Interactive Rotation"
                >
                  <RotateCw size={14} className={is360Active ? "animate-spin" : ""} />
                  <span className="text-[11px] font-bold">360° VIEW</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsZoomModalOpen(true)}
                  className="p-2 rounded-full bg-white/90 backdrop-blur-sm border border-[#E8E1D5] text-slate-700 hover:text-[#0C1B54] hover:bg-white transition-colors"
                  title="Fullscreen Loupe Zoom"
                  aria-label="Zoom visual"
                >
                  <Maximize2 size={14} />
                </button>
              </div>

              {/* Main Visual Presentation Stage */}
              <div className="relative aspect-square w-full flex items-center justify-center my-4 overflow-hidden rounded-lg bg-[#FAF8F5]">
                {is360Active ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center select-none">
                    <div
                      className="relative w-full h-full transition-transform duration-75 flex items-center justify-center"
                      style={{ transform: `rotate(${spinAngle}deg)` }}
                    >
                      <Image
                        src={mediaAngles[0].src}
                        alt={`${product.name} 360 Spin`}
                        fill
                        className="object-contain p-8 drop-shadow-2xl"
                      />
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full border border-[#E8E1D5] shadow-sm">
                      <button
                        type="button"
                        onClick={() => setSpinAngle((prev) => prev - 45)}
                        className="p-1 text-slate-600 hover:text-[#0C1B54]"
                        aria-label="Rotate Counter-Clockwise"
                      >
                        <RotateCcw size={14} />
                      </button>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">
                        Drag to Spin ({spinAngle % 360}°)
                      </span>
                      <button
                        type="button"
                        onClick={() => setSpinAngle((prev) => prev + 45)}
                        className="p-1 text-slate-600 hover:text-[#0C1B54]"
                        aria-label="Rotate Clockwise"
                      >
                        <RotateCw size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={mediaAngles[activeMediaIndex]?.src || product.image}
                      alt={`${product.name} - ${mediaAngles[activeMediaIndex]?.title}`}
                      fill
                      priority
                      className="object-contain p-6 transition-all duration-300 drop-shadow-xl"
                    />
                  </div>
                )}
              </div>

              {/* 4-Thumbnail Media Gallery Strip */}
              <div className="grid grid-cols-4 gap-3 pt-4 border-t border-[#E8E1D5]">
                {mediaAngles.map((angle, idx) => (
                  <button
                    key={angle.id}
                    type="button"
                    onClick={() => {
                      setIs360Active(false);
                      setActiveMediaIndex(idx);
                    }}
                    className={`relative aspect-square rounded-lg border overflow-hidden p-1 transition-all text-left ${
                      !is360Active && activeMediaIndex === idx
                        ? "border-[#0C1B54] ring-2 ring-[#0C1B54]/20 shadow-sm bg-white"
                        : "border-[#E8E1D5] bg-[#FAF8F5] opacity-75 hover:opacity-100 hover:border-slate-400"
                    }`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={angle.src}
                        alt={angle.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="sr-only">{angle.title}</span>
                  </button>
                ))}
              </div>

              {/* Secondary Atelier Tools Row */}
              <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-dashed border-[#E8E1D5] text-xs">
                <button
                  type="button"
                  onClick={() => setShowHandModal(true)}
                  className="inline-flex items-center gap-1.5 text-slate-700 hover:text-[#0C1B54] font-medium"
                >
                  <Eye size={14} className="text-[#8F7243]" />
                  <span>Simulate on Hand</span>
                </button>
                <span className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={() => setShowLoupeModal(true)}
                  className="inline-flex items-center gap-1.5 text-slate-700 hover:text-[#0C1B54] font-medium"
                >
                  <Search size={14} className="text-[#8F7243]" />
                  <span>10× Precision Loupe</span>
                </button>
                <span className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1.5 text-slate-700 hover:text-[#0C1B54] font-medium"
                >
                  <HelpCircle size={14} className="text-[#8F7243]" />
                  <span>Ring Size Guide</span>
                </button>
              </div>
            </div>

            {/* Bottom Left: 4. COMPLETE PRICE & 5. AVAILABILITY & LEAD TIME */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* 4. COMPLETE PRICE */}
              <div className="bg-white border border-[#E8E1D5] rounded-xl p-5 shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8F7243] block mb-3">
                  4. COMPLETE PRICE
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Ring Setting</span>
                    <strong className="text-slate-900 font-mono font-medium">{money(finalSettingPrice)}</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Centre Diamond ({diamond.carat.toFixed(2)} ct)</span>
                    <strong className="text-slate-900 font-mono font-medium">{money(finalDiamondPrice)}</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Selected Extras</span>
                    <span className="text-slate-400">—</span>
                  </div>
                  <div className="pt-3 border-t border-[#E8E1D5] flex justify-between items-baseline">
                    <span className="font-bold text-xs uppercase tracking-wider text-[#0C1B54]">TOTAL</span>
                    <div className="text-right">
                      <span className="font-serif text-xl sm:text-2xl font-bold text-[#0C1B54]">
                        {money(totalPrice)}
                      </span>
                      <span className="block text-[10px] text-slate-500">Price includes VAT</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. AVAILABILITY & LEAD TIME */}
              <div className="bg-white border border-[#E8E1D5] rounded-xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#8F7243] block mb-2">
                    5. AVAILABILITY & LEAD TIME
                  </span>
                  <p className="text-xs text-slate-700 font-medium">
                    This diamond is currently available. Your ring will be crafted to order.
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2.5 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded">
                    <Check size={14} className="shrink-0 text-emerald-600 font-bold" />
                    <span>Diamond availability revalidated today {todayFormatted}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8E1D5] text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Estimated Lead Time:</span>
                    <strong className="text-slate-900 font-medium">4 – 6 weeks</strong>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Truck size={13} className="text-[#8F7243]" />
                    <span>Complimentary insured delivery or collection in London</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: 3 Summary Panels + Primary CTA & Care       */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            
            {/* 1. RING SETTING SUMMARY PANEL */}
            <div className="bg-white border border-[#E8E1D5] rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D5]">
                <span className="text-xs uppercase font-bold tracking-widest text-[#0C1B54]">
                  1. RING SETTING
                </span>
                <Link
                  href={`/engagement-rings/configure?id=${product.id}&metal=${encodeURIComponent(selectedMetal)}&band=${encodeURIComponent(selectedBand)}&size=${encodeURIComponent(selectedSize)}&diamondId=${diamond.id}&shape=${encodeURIComponent(selectedShape)}`}
                  className="inline-flex items-center gap-1 text-xs text-[#8F7243] hover:text-[#0C1B54] font-semibold transition-colors"
                >
                  Edit Setting ✏
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs pt-3.5">
                <div>
                  <span className="text-slate-500 block text-[11px]">Setting</span>
                  <strong className="text-slate-900 font-serif text-sm">{product.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Diamond Shape</span>
                  <strong className="text-slate-900">{selectedShape} Brilliant</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Metal</span>
                  <strong className="text-slate-900">{selectedMetal}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Band Style</span>
                  <strong className="text-slate-900">{selectedBand}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Ring Size</span>
                  <strong className="text-slate-900">{selectedSize}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Setting Price</span>
                  <strong className="text-slate-900 font-mono">{money(finalSettingPrice)}</strong>
                </div>
              </div>
            </div>

            {/* 2. SELECTED DIAMOND SUMMARY PANEL */}
            <div className="bg-white border border-[#E8E1D5] rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D5]">
                <span className="text-xs uppercase font-bold tracking-widest text-[#0C1B54]">
                  2. SELECTED DIAMOND
                </span>
                <Link
                  href={`/engagement-rings/diamonds?setting=${product.id}&metal=${encodeURIComponent(selectedMetal)}&band=${encodeURIComponent(selectedBand)}&size=${encodeURIComponent(selectedSize)}&shape=${encodeURIComponent(selectedShape)}`}
                  className="inline-flex items-center gap-1 text-xs text-[#8F7243] hover:text-[#0C1B54] font-semibold transition-colors"
                >
                  Change Diamond ✏
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs pt-3.5">
                <div>
                  <span className="text-slate-500 block text-[11px]">Type</span>
                  <strong className="text-slate-900">{diamond.type} Diamond</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Carat</span>
                  <strong className="text-slate-900">{diamond.carat.toFixed(2)} ct</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Colour</span>
                  <strong className="text-slate-900">{diamond.colour}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Clarity</span>
                  <strong className="text-slate-900">{diamond.clarity}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Cut</span>
                  <strong className="text-slate-900">{diamond.cut}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Polish</span>
                  <strong className="text-slate-900">{diamond.polish || "Excellent"}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Symmetry</span>
                  <strong className="text-slate-900">{diamond.symmetry || "Excellent"}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Fluorescence</span>
                  <strong className="text-slate-900">{diamond.fluorescence || "None"}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Grading Laboratory</span>
                  <strong className="text-slate-900 font-semibold text-[#0C1B54]">{diamond.certificate}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Report Number</span>
                  <strong className="text-slate-900 font-mono">{diamond.reportNumber || "2476843210"}</strong>
                </div>
              </div>

              {/* Diamond Dossier CTA & Expandable Proportions */}
              <div className="mt-4 pt-3 border-t border-[#E8E1D5] flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsGiaModalOpen(true)}
                  className="w-full py-2 px-3 border border-[#0C1B54] text-[#0C1B54] hover:bg-[#0C1B54] hover:text-white rounded text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5"
                >
                  <FileText size={14} /> VIEW {diamond.certificate} REPORT ↗
                </button>

                <button
                  type="button"
                  onClick={() => setIsDiamondDetailsExpanded(!isDiamondDetailsExpanded)}
                  className="text-[11px] text-slate-600 hover:text-[#0C1B54] font-medium flex items-center justify-between py-1 px-1"
                >
                  <span>{isDiamondDetailsExpanded ? "Hide Technical Proportions" : "View Diamond Details >"}</span>
                  <span className="text-slate-400">{isDiamondDetailsExpanded ? "▲" : "▼"}</span>
                </button>

                {isDiamondDetailsExpanded && (
                  <div className="bg-[#FAF8F5] p-3 rounded border border-[#E8E1D5] grid grid-cols-2 gap-2 text-[11px] text-slate-700 animate-fade-in">
                    <div><span>Measurements:</span> <strong>{diamond.measurements || "9.78 × 9.82 mm"}</strong></div>
                    <div><span>Depth %:</span> <strong>{diamond.depth || 61.8}%</strong></div>
                    <div><span>Table %:</span> <strong>{diamond.table || 57.0}%</strong></div>
                    <div><span>L/W Ratio:</span> <strong>{diamond.ratio || "1.00"}</strong></div>
                    <div><span>Culet:</span> <strong>{diamond.culet || "None"}</strong></div>
                    <div><span>Girdle:</span> <strong>{diamond.girdle || "Medium"}</strong></div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. RING SIZE SUMMARY PANEL */}
            <div className="bg-white border border-[#E8E1D5] rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D5]">
                <span className="text-xs uppercase font-bold tracking-widest text-[#0C1B54]">
                  3. RING SIZE
                </span>
                <button
                  type="button"
                  onClick={() => setIsChangingSize(!isChangingSize)}
                  className="inline-flex items-center gap-1 text-xs text-[#8F7243] hover:text-[#0C1B54] font-semibold transition-colors"
                >
                  {isChangingSize ? "Done ✓" : "Change Size ✏"}
                </button>
              </div>

              {isChangingSize ? (
                <div className="pt-3.5 space-y-3">
                  <label className="block text-[11px] text-slate-600 font-medium">
                    Select Finger Size (UK Standard):
                  </label>
                  <div className="flex items-center gap-3">
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="p-2 border border-[#0C1B54] rounded bg-white text-xs font-semibold text-[#0C1B54] focus:outline-none focus:ring-1 focus:ring-[#0C1B54]"
                    >
                      {ukSizes.map((sz) => (
                        <option key={sz} value={sz}>
                          UK Size {sz}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-xs text-[#8F7243] underline hover:text-[#0C1B54]"
                    >
                      Need help finding your size?
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-y-2 text-xs pt-3.5">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Size</span>
                    <strong className="text-slate-900 text-sm font-semibold">{selectedSize} (UK)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Complimentary resize</span>
                    <strong className="text-emerald-700 font-medium">Yes (within 60 days)</strong>
                  </div>
                </div>
              )}
            </div>

            {/* 6. READY TO ADD YOUR COMPLETE RING? (PRIMARY PURCHASE ACTION) */}
            <div className="bg-[#FAF8F5] border-2 border-[#0C1B54]/20 rounded-xl p-6 shadow-md">
              <span className="text-[11px] uppercase font-bold tracking-widest text-[#0C1B54] block mb-3 text-center">
                6. READY TO ADD YOUR COMPLETE RING?
              </span>

              <button
                type="button"
                onClick={handleAddCompleteRingToBag}
                disabled={isAdding}
                className="w-full bg-[#722F37] hover:bg-[#5C242C] text-white py-4 px-6 rounded-lg font-bold text-sm tracking-wider uppercase shadow-lg transition-all transform active:scale-[0.99] flex items-center justify-center gap-2.5"
              >
                <ShoppingBag size={18} />
                {isAdding ? "SECURING CREATION..." : "ADD COMPLETE RING TO BAG"}
              </button>

              {/* Secondary Actions Row */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#E8E1D5] text-[11px] text-center">
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className="p-2 rounded hover:bg-white text-slate-700 hover:text-[#722F37] transition-colors flex items-center justify-center gap-1"
                >
                  <Heart size={13} className={isWishlisted ? "fill-[#722F37] text-[#722F37]" : "text-slate-500"} />
                  <span>{isWishlisted ? "Saved" : "Save to Wishlist"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAdvisorModalOpen(true)}
                  className="p-2 rounded hover:bg-white text-slate-700 hover:text-[#0C1B54] transition-colors flex items-center justify-center gap-1"
                >
                  <Phone size={13} className="text-slate-500" />
                  <span>Speak to Expert</span>
                </button>

                <Link
                  href="/appointments"
                  className="p-2 rounded hover:bg-white text-slate-700 hover:text-[#0C1B54] transition-colors flex items-center justify-center gap-1"
                >
                  <Calendar size={13} className="text-slate-500" />
                  <span>Book Salon</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. EDIT ANYTHING & EMOTIONAL REASSURANCE / CLIENT CARE     */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <div className="border-t border-[#E8E1D5] pt-8">
          
          <div className="mb-6">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#8F7243] block">
              7. EDIT ANYTHING BEFORE YOU ADD TO BAG
            </span>
            <h2 className="font-serif text-2xl text-[#0C1B54] mt-1">
              A Piece of Your Story Begins Here
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              You can make changes at any time without losing your chosen configuration.
            </p>
          </div>

          {/* Presentation Letter & Journey Stepper Card */}
          <div className="bg-white border border-[#E8E1D5] rounded-xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Box Presentation Image */}
            <div className="lg:col-span-4 relative min-h-[280px] bg-[#FAF8F5] flex items-center justify-center p-6 border-b lg:border-b-0 lg:border-r border-[#E8E1D5]">
              <div className="relative w-full h-full min-h-[240px] rounded overflow-hidden shadow-inner flex items-center justify-center">
                <Image
                  src="/images/mah-atelier-sketch.jpg"
                  alt="MAH Maison Packaging & Seal"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C1B54]/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A880] block font-bold">
                    Maison Packaging
                  </span>
                  <p className="text-xs font-serif italic mt-0.5">
                    Wax-sealed presentation casket & verified certificates
                  </p>
                </div>
              </div>
            </div>

            {/* Middle: Poetic MAH Letter */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[#E8E1D5]">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#C5A880] text-[#8F7243] mb-4">
                <Sparkles size={16} />
              </div>
              <h3 className="font-serif text-xl text-[#0C1B54] mb-3">
                A Piece of Your Story Begins Here.
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-serif italic mb-3">
                &ldquo;Thank you for choosing MAH. What you have chosen is more than a piece of jewellery. It is a marker of a moment, a feeling, a promise — something made to be carried with you, and perhaps one day, passed on.&rdquo;
              </p>
              <p className="text-xs text-slate-700 leading-relaxed font-serif italic mb-4">
                &ldquo;From this moment, your piece is in our care. We will oversee every detail until it reaches you. Welcome to MAH. May you wear it with pride, and may its story grow beautifully with your own.&rdquo;
              </p>
              
              <div className="pt-3 border-t border-[#E8E1D5] flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Status: Ready for Bag</span>
                <span>Demo Ref: MAH-260826-00123</span>
              </div>
            </div>

            {/* Right: What Happens Next Stepper */}
            <div className="lg:col-span-3 p-6 bg-[#FAF8F5] flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#0C1B54] block mb-4">
                What happens next
              </span>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#0C1B54] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    01
                  </span>
                  <div>
                    <strong className="text-slate-900 block font-medium">Order Confirmed</strong>
                    <span className="text-[10px] text-slate-500">{todayFormatted}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#0C1B54]/20 text-[#0C1B54] text-[10px] font-bold flex items-center justify-center shrink-0">
                    02
                  </span>
                  <div>
                    <strong className="text-slate-900 block font-medium">Verification</strong>
                    <span className="text-[10px] text-slate-500">Diamond & specification check</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#0C1B54]/20 text-[#0C1B54] text-[10px] font-bold flex items-center justify-center shrink-0">
                    03
                  </span>
                  <div>
                    <strong className="text-slate-900 block font-medium">Craftsmanship & Setting</strong>
                    <span className="text-[10px] text-slate-500">Your ring is hand-forged in London</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#0C1B54]/20 text-[#0C1B54] text-[10px] font-bold flex items-center justify-center shrink-0">
                    04
                  </span>
                  <div>
                    <strong className="text-slate-900 block font-medium">Final Inspection</strong>
                    <span className="text-[10px] text-slate-500">Quality & authenticity check</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#0C1B54]/20 text-[#0C1B54] text-[10px] font-bold flex items-center justify-center shrink-0">
                    05
                  </span>
                  <div>
                    <strong className="text-slate-900 block font-medium">Presentation & Delivery</strong>
                    <span className="text-[10px] text-slate-500">Secure delivery or London salon</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Client Advisor Touchpoint Strip */}
          <div className="mt-6 bg-white border border-[#E8E1D5] rounded-xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden relative border border-[#C5A880] shrink-0 bg-[#0C1B54]">
                <Image
                  src="/images/advisor-clara.jpg"
                  alt="MAH Client Advisor"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-[#0C1B54] block">Your MAH Client Advisor</span>
                <p className="text-[11px] text-slate-600 max-w-md">
                  A member of our team will personally oversee your purchase and keep you informed throughout its journey.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <a
                href="tel:+442012345678"
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#E8E1D5] rounded text-slate-700 hover:text-[#0C1B54] hover:bg-[#FAF8F5] transition-colors"
              >
                <Phone size={13} className="text-[#8F7243]" />
                <span>+44 20 1234 5678</span>
              </a>
              <a
                href="https://wa.me/442012345678"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#E8E1D5] rounded text-slate-700 hover:text-emerald-700 hover:bg-[#FAF8F5] transition-colors"
              >
                <MessageSquare size={13} className="text-emerald-600" />
                <span>WhatsApp Message</span>
              </a>
              <a
                href="mailto:clientcare@mahdiamonds.com"
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#E8E1D5] rounded text-slate-700 hover:text-[#0C1B54] hover:bg-[#FAF8F5] transition-colors"
              >
                <Mail size={13} className="text-[#8F7243]" />
                <span>clientcare@mahdiamonds.com</span>
              </a>
            </div>
          </div>

          {/* Bottom Confirmation Action CTAs (After Adding or Direct Review) */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/bag"
              className="bg-[#722F37] hover:bg-[#5C242C] text-white py-3.5 px-8 rounded-lg font-bold text-xs tracking-widest uppercase shadow-md transition-all flex items-center gap-2"
            >
              <span>VIEW BAG & CHECKOUT</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/engagement-rings"
              className="border border-[#0C1B54] text-[#0C1B54] hover:bg-[#0C1B54] hover:text-white py-3.5 px-8 rounded-lg font-bold text-xs tracking-widest uppercase transition-colors"
            >
              CONTINUE SHOPPING
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* MODALS & SLIDE-OVERS                                      */}
      {/* ========================================================= */}

      {/* 1. GIA / IGI Authenticated Report Modal */}
      {isGiaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C1B54]/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-[#C5A880] p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsGiaModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 rounded-full"
              aria-label="Close Report"
            >
              <X size={20} />
            </button>
            <div className="border-2 border-[#C5A880] p-6 text-center">
              <span className="text-xs uppercase tracking-widest text-[#8F7243] font-bold">
                Authenticated Laboratory Dossier
              </span>
              <h2 className="font-serif text-2xl text-[#0C1B54] mt-1">
                {diamond.certificate} Diamond Dossier
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Report Number: {diamond.reportNumber || "2476843210"}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-left my-6 bg-[#FAF8F5] p-5 border border-[#E8E1D5]">
                <div><span className="text-slate-500 block">Shape:</span> <strong>{diamond.shape} Brilliant</strong></div>
                <div><span className="text-slate-500 block">Carat Weight:</span> <strong>{diamond.carat.toFixed(2)} ct</strong></div>
                <div><span className="text-slate-500 block">Colour Grade:</span> <strong>{diamond.colour}</strong></div>
                <div><span className="text-slate-500 block">Clarity Grade:</span> <strong>{diamond.clarity}</strong></div>
                <div><span className="text-slate-500 block">Cut Grade:</span> <strong>{diamond.cut}</strong></div>
                <div><span className="text-slate-500 block">Polish:</span> <strong>{diamond.polish || "Excellent"}</strong></div>
                <div><span className="text-slate-500 block">Symmetry:</span> <strong>{diamond.symmetry || "Excellent"}</strong></div>
                <div><span className="text-slate-500 block">Fluorescence:</span> <strong>{diamond.fluorescence || "None"}</strong></div>
                <div><span className="text-slate-500 block">Measurements:</span> <strong>{diamond.measurements || "9.78 – 9.82 × 6.05 mm"}</strong></div>
              </div>

              <div className="flex items-center justify-center gap-3">
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
        </div>
      )}

      {/* 2. Ring Size Guide Modal */}
      <RingSizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        initialSize={selectedSize}
        onSelectSize={(sz) => setSelectedSize(sz)}
      />

      {/* 3. Carat on Hand Simulator Modal */}
      {showHandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C1B54]/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-white p-6 rounded-lg shadow-2xl border border-[#C5A880]">
            <button
              type="button"
              onClick={() => setShowHandModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 rounded-full"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            <h3 className="font-serif text-xl text-[#0C1B54] mb-2">Carat on Hand Simulation</h3>
            <p className="text-xs text-slate-600 mb-4">
              Visualizing a <strong>{diamond.carat.toFixed(2)}ct {diamond.shape}</strong> diamond on a standard UK finger size {selectedSize}.
            </p>
            <div className="relative aspect-video w-full bg-[#FAF8F5] rounded border border-[#E8E1D5] flex items-center justify-center overflow-hidden mb-4">
              <Image
                src="/images/mah-hero-concept.png"
                alt="Carat on hand simulation"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute p-3 bg-white/90 backdrop-blur rounded text-xs font-semibold text-[#0C1B54] shadow">
                {diamond.carat.toFixed(2)} Carat · Scale 1:1 on UK Size {selectedSize}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowHandModal(false)}
              className="w-full button button-dark facet-oct-sm py-2 text-xs"
            >
              RETURN TO REVIEW
            </button>
          </div>
        </div>
      )}

      {/* 4. 10x Precision Loupe Modal */}
      {showLoupeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C1B54]/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-white p-6 rounded-lg shadow-2xl border border-[#C5A880]">
            <button
              type="button"
              onClick={() => setShowLoupeModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 rounded-full"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            <h3 className="font-serif text-xl text-[#0C1B54] mb-2">10× Precision Loupe Inspection</h3>
            <p className="text-xs text-slate-600 mb-4">
              Inspecting {product.name} setting prongs and diamond table clarity.
            </p>
            <div className="relative aspect-square w-full bg-[#FAF8F5] rounded-full border-4 border-[#C5A880] flex items-center justify-center overflow-hidden mb-4 shadow-inner">
              <Image
                src={mediaAngles[0].src}
                alt="10x Loupe View"
                fill
                className="object-contain scale-150"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowLoupeModal(false)}
              className="w-full button button-dark facet-oct-sm py-2 text-xs"
            >
              CLOSE LOUPE
            </button>
          </div>
        </div>
      )}

      {/* 5. Concierge / Advisor Modal */}
      {isAdvisorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C1B54]/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#FAF8F5] p-6 rounded-lg shadow-2xl border border-[#C5A880]">
            <button
              type="button"
              onClick={() => setIsAdvisorModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 rounded-full"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            <h3 className="font-serif text-xl text-[#0C1B54] mb-1">Consult with an MAH Specialist</h3>
            <p className="text-xs text-slate-600 mb-4">
              Regarding {product.name} ({money(totalPrice)})
            </p>
            <div className="space-y-3 text-xs">
              <a
                href="tel:+442012345678"
                className="w-full p-3 bg-white border border-[#E8E1D5] rounded flex items-center justify-between text-slate-800 hover:border-[#0C1B54]"
              >
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-[#8F7243]" />
                  <span>Call London Atelier</span>
                </div>
                <strong>+44 20 1234 5678</strong>
              </a>
              <a
                href="https://wa.me/442012345678"
                target="_blank"
                rel="noreferrer"
                className="w-full p-3 bg-white border border-[#E8E1D5] rounded flex items-center justify-between text-slate-800 hover:border-emerald-600"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare size={14} className="text-emerald-600" />
                  <span>WhatsApp Concierge</span>
                </div>
                <strong>Live Chat</strong>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 6. Added to Bag Slide-over Toast / Dialog */}
      {isAddedSuccess && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-white border-2 border-[#0C1B54] rounded-xl shadow-2xl p-5 animate-slide-up">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5 text-emerald-800">
              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center font-bold">
                ✓
              </div>
              <strong className="text-sm text-[#0C1B54]">Complete Ring Added to Bag</strong>
            </div>
            <button
              type="button"
              onClick={() => setIsAddedSuccess(false)}
              className="text-slate-400 hover:text-slate-700"
              aria-label="Close Alert"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-2 font-serif">
            {product.name} in {selectedMetal} with {diamond.carat.toFixed(2)}ct {diamond.shape} ({money(totalPrice)})
          </p>
          <div className="flex items-center gap-3 mt-4">
            <Link
              href="/bag"
              className="flex-1 bg-[#722F37] hover:bg-[#5C242C] text-white py-2.5 text-center rounded text-xs font-bold tracking-wider uppercase shadow transition-colors"
            >
              VIEW BAG & CHECKOUT
            </Link>
            <button
              type="button"
              onClick={() => setIsAddedSuccess(false)}
              className="flex-1 border border-slate-300 py-2.5 text-center rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              CONTINUE BROWSING
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

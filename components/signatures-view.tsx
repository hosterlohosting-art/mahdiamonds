"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CalendarDays, Gem, Heart, MessageCircle } from "lucide-react";
import type { RoutePage } from "@/lib/site-data";
import { useDemoStore } from "@/components/demo-store-provider";
import { toast } from "sonner";

export interface SignatureProductItem {
  id: string;
  name: string;
  subName: string;
  category: "ring" | "pendant" | "bracelet" | "earrings";
  price: number;
  priceFormatted: string;
  image: string;
  isBespokeOnly?: boolean;
}

const SIGNATURE_PRODUCTS: SignatureProductItem[] = [
  {
    id: "ER-004",
    name: "SIGNATURE RING",
    subName: "The Aurelia Halo Ring",
    category: "ring",
    price: 2450,
    priceFormatted: "Price from £2,450",
    image: "/images/styles/halo.jpg",
  },
  {
    id: "JW-001",
    name: "SIGNATURE PENDANT",
    subName: "The Aster Diamond Pendant",
    category: "pendant",
    price: 1250,
    priceFormatted: "Price from £1,250",
    image: "/images/styles/solitaire.jpg",
  },
  {
    id: "JW-003",
    name: "SIGNATURE BRACELET",
    subName: "The Luna Riviera Line Bracelet",
    category: "bracelet",
    price: 4800,
    priceFormatted: "Price from £4,800",
    image: "/images/styles/diamond-band.jpg",
  },
  {
    id: "JW-005",
    name: "SIGNATURE EARRINGS",
    subName: "The Royal Drop Earrings",
    category: "earrings",
    price: 3200,
    priceFormatted: "Price from £3,200",
    image: "/images/styles/trilogy.jpg",
  },
];

export function SignaturesView({ page }: { page?: RoutePage }) {
  const { wishlist, toggleWishlist } = useDemoStore();

  const scrollToCollection = () => {
    const el = document.getElementById("signature-collection");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleWishlistClick = (e: React.MouseEvent, item: SignatureProductItem) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(item.id);
    const isSaved = wishlist.includes(item.id);
    if (!isSaved) {
      toast.success(`${item.subName} added to your wishlist.`);
    } else {
      toast.info(`${item.subName} removed from your wishlist.`);
    }
  };

  return (
    <main id="main-content" className="signatures-page-13">
      {/* 1. BREADCRUMBS */}
      <div className="signatures-breadcrumb-bar">
        <div className="shell">
          <nav aria-label="Breadcrumb" className="signatures-breadcrumbs">
            <Link href="/">Home</Link>
            <span className="crumb-sep">&gt;</span>
            <Link href="/jewellery">Jewellery</Link>
            <span className="crumb-sep">&gt;</span>
            <span className="crumb-current">MAH Signatures</span>
          </nav>
        </div>
      </div>

      {/* 2. HERO BANNER */}
      <section className="signatures-hero-13" aria-labelledby="signatures-hero-title">
        <div className="shell">
          <div className="signatures-hero-split-grid facet-oct">
            {/* Left Navy Card */}
            <div className="signatures-hero-navy-card">
              <p className="signatures-eyebrow-hero">MAH SIGNATURES</p>
              <h1 id="signatures-hero-title" className="signatures-hero-heading">
                DISTINCTIVE
                <br />
                BY DESIGN
              </h1>
              <div className="signatures-eyebrow-line" />
              <p className="signatures-hero-sub">
                A curated expression of MAH, bringing together pieces defined by character, proportion and detail.
              </p>
              <button
                onClick={scrollToCollection}
                className="button button-outline-light signatures-hero-btn facet-oct-sm"
              >
                EXPLORE THE COLLECTION <ArrowRight size={14} />
              </button>
            </div>

            {/* Right Editorial Image */}
            <div className="signatures-hero-image-pane">
              <Image
                src="/images/styles/diamond-band.jpg"
                alt="MAH Signature diamond tennis bracelet in sunlight"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 55vw"
                className="signatures-hero-split-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE COLLECTION */}
      <section id="signature-collection" className="signatures-collection-section">
        <div className="shell">
          <div className="signatures-collection-heading centred">
            <p className="collection-eyebrow">THE COLLECTION</p>
            <h2 className="collection-title">MAH SIGNATURES</h2>
            <div className="collection-accent-line" />
            <p className="collection-sub">
              A considered selection of jewellery representing the evolving design language of MAH.
            </p>
          </div>

          <div className="signatures-cards-grid">
            {SIGNATURE_PRODUCTS.map((item) => {
              const isSaved = wishlist.includes(item.id);
              const detailHref = item.isBespokeOnly
                ? "/bespoke"
                : `/jewellery/product?id=${item.id}`;

              return (
                <article key={item.id} className="signature-product-card facet-oct-sm">
                  <div className="card-top-action">
                    <button
                      onClick={(e) => handleWishlistClick(e, item)}
                      aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                      className={`wishlist-heart-btn ${isSaved ? "active" : ""}`}
                    >
                      <Heart size={15} strokeWidth={1.4} fill={isSaved ? "var(--midnight)" : "none"} />
                    </button>
                  </div>

                  <Link href={detailHref} className="signature-card-link">
                    <div className="signature-img-wrap">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 900px) 100vw, 25vw"
                        className="signature-card-img"
                      />
                    </div>

                    <div className="signature-card-info">
                      <h3 className="product-title-label">{item.name}</h3>
                      <p className="product-price-label">{item.priceFormatted}</p>
                      <span className="view-details-link">
                        {item.isBespokeOnly ? "Explore Bespoke" : "View Details"} <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>

          <div className="explore-all-btn-wrap">
            <Link href="/jewellery" className="button button-outline-dark facet-oct-sm">
              EXPLORE ALL SIGNATURE PIECES <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. THE SIGNATURE STORY */}
      <section className="signatures-story-section">
        <div className="shell">
          <div className="signatures-story-split-grid facet-oct">
            {/* Left Navy Box */}
            <div className="signatures-story-navy-box">
              <p className="story-eyebrow">THE SIGNATURE STORY</p>
              <h2 className="story-title">
                AN EVOLVING
                <br />
                HOUSE CODE
              </h2>
              <div className="story-accent-line" />
              <p className="story-body-p">
                MAH Signatures brings together designs created to express the character of the house. The collection will evolve as new signature pieces and design codes are introduced.
              </p>
              <Link href="/our-house" className="button button-outline-light signatures-story-btn facet-oct-sm">
                DISCOVER THE STORY <ArrowRight size={14} />
              </Link>
            </div>

            {/* Middle Editorial Image: Tweezers holding diamond */}
            <div className="signatures-story-img-pane">
              <Image
                src="/images/journal-diamonds.jpg"
                alt="Precision diamond selection with tweezers"
                fill
                sizes="(max-width: 900px) 100vw, 30vw"
                className="signatures-story-photo"
              />
            </div>

            {/* Right Editorial Image: Architectural / Atelier craftsmanship */}
            <div className="signatures-story-img-pane">
              <Image
                src="/images/journal-atelier.jpg"
                alt="Fine jewellery architectural details"
                fill
                sizes="(max-width: 900px) 100vw, 30vw"
                className="signatures-story-photo"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. CLIENT ACTIONS (3-PILLAR ROW) */}
      <section className="signatures-actions-section">
        <div className="shell">
          <div className="signatures-actions-grid">
            {/* PILLAR 1: SPEAK TO AN MAH EXPERT */}
            <Link href="/expert" className="signatures-action-pillar">
              <div className="action-icon-box">
                <MessageCircle size={22} strokeWidth={1.25} />
              </div>
              <div className="action-text-box">
                <span className="action-title">SPEAK TO AN MAH EXPERT</span>
                <span className="action-sub">Receive guidance on MAH Signatures and individual pieces.</span>
              </div>
            </Link>

            {/* DIVIDER 1 */}
            <div className="action-pillar-divider" />

            {/* PILLAR 2: BOOK AN APPOINTMENT */}
            <Link href="/appointments" className="signatures-action-pillar">
              <div className="action-icon-box">
                <CalendarDays size={22} strokeWidth={1.25} />
              </div>
              <div className="action-text-box">
                <span className="action-title">BOOK AN APPOINTMENT</span>
                <span className="action-sub">Arrange a personal consultation with MAH.</span>
              </div>
            </Link>

            {/* DIVIDER 2 */}
            <div className="action-pillar-divider" />

            {/* PILLAR 3: EXPLORE BESPOKE */}
            <Link href="/bespoke" className="signatures-action-pillar">
              <div className="action-icon-box">
                <Gem size={22} strokeWidth={1.25} />
              </div>
              <div className="action-text-box">
                <span className="action-title">EXPLORE BESPOKE</span>
                <span className="action-sub">Discover the MAH Bespoke experience.</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

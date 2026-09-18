"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { RoutePage } from "@/lib/site-data";

const DIAMOND_SHAPES = [
  { name: "Round", icon: "/images/shapes/round.png" },
  { name: "Oval", icon: "/images/shapes/oval.png" },
  { name: "Emerald", icon: "/images/shapes/emerald.png" },
  { name: "Pear", icon: "/images/shapes/pear.png" },
  { name: "Marquise", icon: "/images/shapes/marquise.png" },
  { name: "Cushion", icon: "/images/shapes/cushion.png" },
  { name: "Princess", icon: "/images/shapes/princess.png" },
  { name: "Radiant", icon: "/images/shapes/radiant.png" },
];

export function DiamondsLandingView({ page }: { page?: RoutePage }) {
  return (
    <main id="main-content" className="diamonds-landing-page-11a">
      {/* 1. HERO SECTION */}
      <section className="dl-hero-11a" aria-labelledby="dl-hero-title">
        <div className="dl-hero-bg-wrap">
          <Image
            src="/images/journal-diamonds.jpg"
            alt="MAH certified loose diamond held in precision inspection tweezers"
            fill
            priority
            sizes="100vw"
            className="dl-hero-bg-img"
          />
          <div className="dl-hero-gradient-overlay" />
        </div>

        <div className="shell dl-hero-inner">
          <div className="dl-hero-copy-box">
            <h1 id="dl-hero-title" className="dl-hero-headline">
              DIAMONDS
            </h1>
            <p className="dl-hero-lead">
              Choose a diamond with clarity and confidence.
            </p>
            <div className="dl-hero-action">
              <Link href="/diamonds/search" className="dl-hero-cta-btn facet-oct-sm">
                <span>DISCOVER DIAMONDS</span>
                <span className="dl-cta-arrow">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NATURAL VS LAB-GROWN SPLIT EDITORIAL CARDS */}
      <section className="shell dl-origins-section-11a" aria-label="Diamond Origins">
        <div className="dl-origins-split-grid">
          {/* NATURAL DIAMONDS CARD */}
          <article className="dl-origin-card-11a dl-origin-natural facet-oct-sm">
            <div className="dl-origin-copy-pane">
              <div className="dl-origin-title-wrap">
                <h2 className="dl-origin-title">NATURAL<br />DIAMONDS</h2>
                <div className="dl-origin-divider" />
              </div>
              <p className="dl-origin-text">
                Rare by nature.<br />
                Formed over billions of years.
              </p>
              <Link
                href="/diamonds/search?type=natural"
                className="dl-origin-explore-link"
              >
                <span>EXPLORE NATURAL DIAMONDS</span>
                <span className="dl-cta-arrow">&rarr;</span>
              </Link>
            </div>

            <div className="dl-origin-visual-pane">
              <div className="dl-origin-diamond-img-wrap">
                <Image
                  src="/images/shapes/round.png"
                  alt="Natural earth-mined round brilliant diamond"
                  fill
                  sizes="(max-width: 768px) 100vw, 240px"
                  className="object-contain"
                />
              </div>
            </div>
          </article>

          {/* LAB-GROWN DIAMONDS CARD */}
          <article className="dl-origin-card-11a dl-origin-lab facet-oct-sm">
            <div className="dl-origin-copy-pane">
              <div className="dl-origin-title-wrap">
                <h2 className="dl-origin-title">LAB-GROWN<br />DIAMONDS</h2>
                <div className="dl-origin-divider" />
              </div>
              <p className="dl-origin-text">
                Created with innovation.<br />
                The same brilliance you love.
              </p>
              <Link
                href="/diamonds/search?type=lab-grown"
                className="dl-origin-explore-link"
              >
                <span>EXPLORE LAB-GROWN DIAMONDS</span>
                <span className="dl-cta-arrow">&rarr;</span>
              </Link>
            </div>

            <div className="dl-origin-visual-pane">
              <div className="dl-origin-diamond-img-wrap">
                <Image
                  src="/images/shapes/oval.png"
                  alt="Lab-grown oval cut certified diamond"
                  fill
                  sizes="(max-width: 768px) 100vw, 240px"
                  className="object-contain"
                />
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* 3. SHOP BY SHAPE SECTION */}
      <section className="shell dl-shapes-section-11a" aria-labelledby="dl-shapes-title">
        <div className="dl-shapes-header centred">
          <span className="dl-shapes-eyebrow">SHOP BY SHAPE</span>
          <h2 id="dl-shapes-title" className="dl-shapes-headline">
            FIND THE SHAPE YOU LOVE
          </h2>
        </div>

        {/* 8 Shapes Row */}
        <div className="dl-shapes-grid-8col">
          {DIAMOND_SHAPES.map((shape) => (
            <Link
              key={shape.name}
              href={`/diamonds/search?shape=${shape.name}`}
              className="dl-shape-card-item facet-oct-sm"
            >
              <div className="dl-shape-render-box">
                <Image
                  src={shape.icon}
                  alt={`${shape.name} Diamond Shape`}
                  fill
                  sizes="64px"
                  className="object-contain p-2"
                />
              </div>
              <div className="dl-shape-info-row">
                <span className="dl-shape-label">{shape.name.toUpperCase()}</span>
                <span className="dl-shape-arrow">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Diamonds Action */}
        <div className="dl-shapes-footer-cta">
          <Link href="/diamonds/search" className="dl-view-all-btn facet-oct-sm">
            <span>VIEW ALL DIAMONDS</span>
            <span className="dl-cta-arrow">&rarr;</span>
          </Link>
        </div>
      </section>

      {/* 4. DIAMOND EDUCATION BANNER */}
      <section className="shell dl-education-section-11a" aria-labelledby="dl-edu-title">
        <div className="dl-education-card facet-oct-sm">
          <div className="dl-education-copy-col">
            <span className="dl-education-eyebrow">DIAMOND EDUCATION</span>
            <h2 id="dl-edu-title" className="dl-education-headline">
              KNOW MORE.<br />
              CHOOSE BETTER.
            </h2>
            <p className="dl-education-sub">
              Guides, expert insights and everything you need to feel confident in your choice.
            </p>
            <Link href="/journal?category=education" className="dl-education-cta-link">
              <span>EXPLORE OUR GUIDES</span>
              <span className="dl-cta-arrow">&rarr;</span>
            </Link>
          </div>

          <div className="dl-education-visual-col">
            <div className="dl-education-img-wrap">
              <Image
                src="/images/mah-atelier-sketch.jpg"
                alt="Gemological loupe inspection, certified diamonds and design sketch"
                fill
                sizes="(max-width: 768px) 100vw, 560px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

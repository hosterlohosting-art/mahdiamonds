"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Gem, MessageCircle } from "lucide-react";
import type { RoutePage } from "@/lib/site-data";

export function OurHouseView({ page }: { page?: RoutePage }) {
  const scrollToApproach = () => {
    const el = document.getElementById("our-approach");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main id="main-content" className="our-house-page-16">
      {/* 1. HERO BANNER */}
      <section className="house-hero-16" aria-labelledby="house-hero-heading">
        <div className="house-hero-grid">
          {/* Left Text Column */}
          <div className="house-hero-left">
            <div className="house-hero-content">
              <p className="house-eyebrow">OUR HOUSE</p>
              <h1 id="house-hero-heading" className="house-hero-title">
                THE HOUSE
                <br />
                OF MAH
              </h1>
              <div className="house-title-line" />
              <p className="house-hero-sub">
                Discover the story and direction of MAH Diamonds.
              </p>
              <button
                onClick={scrollToApproach}
                className="button button-dark house-hero-btn facet-oct-sm"
              >
                DISCOVER OUR HOUSE <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Right Visual Column */}
          <div className="house-hero-right">
            <div className="house-portal-wrap">
              <Image
                src="/images/mah-expert-hero.jpg"
                alt="The House of MAH Diamonds - Private salon entrance and bespoke presentation"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 55vw"
                className="house-portal-img"
              />
              <div className="house-portal-overlay">
                <div className="house-portal-signage">
                  <span className="signage-brand">MAH</span>
                  <span className="signage-sub">DIAMONDS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR APPROACH SECTION */}
      <section id="our-approach" className="house-approach-section">
        <div className="shell">
          <div className="house-approach-heading centred">
            <p className="house-approach-eyebrow">OUR PHILOSOPHY</p>
            <h2 className="house-approach-title">OUR APPROACH</h2>
            <div className="house-approach-line" />
            <p className="house-approach-sub">
              The philosophy, values and approach that define MAH Diamonds.
            </p>
          </div>

          {/* 3. THREE CONTENT AREAS (DIAMONDS · DESIGN · THE MAH EXPERIENCE) */}
          <div className="house-cards-grid">
            {/* CARD 1: DIAMONDS */}
            <div className="house-split-card facet-oct-sm">
              <div className="card-copy-side">
                <h3 className="card-title">DIAMONDS</h3>
                <div className="card-accent-line" />
                <p className="card-desc">MAH-approved diamond content.</p>
              </div>
              <div className="card-image-side">
                <Image
                  src="/images/journal-diamonds.jpg"
                  alt="MAH Diamonds - Curated natural and lab-grown stones"
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  className="card-img"
                />
              </div>
            </div>

            {/* CARD 2: DESIGN */}
            <div className="house-split-card facet-oct-sm">
              <div className="card-copy-side">
                <h3 className="card-title">DESIGN</h3>
                <div className="card-accent-line" />
                <p className="card-desc">MAH-approved design philosophy.</p>
              </div>
              <div className="card-image-side">
                <Image
                  src="/images/mah-atelier-sketch.jpg"
                  alt="MAH Design Philosophy - Hand-rendered graphite sketches"
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  className="card-img"
                />
              </div>
            </div>

            {/* CARD 3: THE MAH EXPERIENCE */}
            <div className="house-split-card facet-oct-sm">
              <div className="card-copy-side">
                <h3 className="card-title">
                  THE MAH
                  <br />
                  EXPERIENCE
                </h3>
                <div className="card-accent-line" />
                <p className="card-desc">MAH-approved brand and client experience.</p>
              </div>
              <div className="card-image-side">
                <Image
                  src="/images/journal-atelier.jpg"
                  alt="The MAH Experience - Master goldsmith and private consultation"
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  className="card-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MAH TODAY BANNER */}
      <section className="house-today-banner">
        <div className="house-today-bg-wrap">
          <Image
            src="/images/mah-expert-hero.jpg"
            alt="MAH Today - A Continuing Story"
            fill
            sizes="100vw"
            className="house-today-img"
          />
          <div className="house-today-shade" />
        </div>

        <div className="shell house-today-content">
          <div className="house-today-text-box">
            <p className="today-eyebrow">MAH TODAY</p>
            <h2 className="today-title">A CONTINUING STORY</h2>
            <p className="today-sub">
              The current MAH story and future direction will be presented here.
            </p>
          </div>
          <div className="house-today-badge">
            <span className="badge-brand">MAH</span>
            <span className="badge-sub">DIAMONDS</span>
          </div>
        </div>
      </section>

      {/* 5. CLIENT ACTIONS (3-PILLAR ROW) */}
      <section className="house-actions-section">
        <div className="shell">
          <div className="house-actions-grid">
            {/* PILLAR 1: SPEAK TO AN MAH EXPERT */}
            <Link href="/expert" className="house-action-pillar">
              <div className="pillar-icon-box">
                <MessageCircle size={22} strokeWidth={1.25} />
              </div>
              <div className="pillar-text-box">
                <span className="pillar-title">SPEAK TO AN MAH EXPERT</span>
                <span className="pillar-sub">Discuss your ideas with our team.</span>
              </div>
            </Link>

            {/* DIVIDER 1 */}
            <div className="pillar-divider" />

            {/* PILLAR 2: BOOK AN APPOINTMENT */}
            <Link href="/appointments" className="house-action-pillar">
              <div className="pillar-icon-box">
                <CalendarDays size={22} strokeWidth={1.25} />
              </div>
              <div className="pillar-text-box">
                <span className="pillar-title">BOOK AN APPOINTMENT</span>
                <span className="pillar-sub">Arrange a consultation with MAH.</span>
              </div>
            </Link>

            {/* DIVIDER 2 */}
            <div className="pillar-divider" />

            {/* PILLAR 3: EXPLORE OUR COLLECTIONS */}
            <Link href="/engagement-rings" className="house-action-pillar">
              <div className="pillar-icon-box">
                <Gem size={22} strokeWidth={1.25} />
              </div>
              <div className="pillar-text-box">
                <span className="pillar-title">EXPLORE OUR COLLECTIONS</span>
                <span className="pillar-sub">Discover the world of MAH.</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

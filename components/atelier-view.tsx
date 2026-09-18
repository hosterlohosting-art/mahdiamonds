"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Hammer, Eye, Sparkles, ShieldCheck, CalendarDays, MessageCircle } from "lucide-react";
import type { RoutePage } from "@/lib/site-data";

const CRAFT_STAGES = [
  {
    num: "01",
    title: "Design",
    subtitle: "From First Gouache to 3D Form",
    desc: "Every creation begins with pencil sketches and gouache paintings on paper, followed by millimeter-precise computer-aided design balancing weight, light return, and finger ergonomics.",
    image: "/images/mah-hero-concept.png",
  },
  {
    num: "02",
    title: "Craft",
    subtitle: "London Goldsmithing Benchcraft",
    desc: "Molten platinum and 18-karat golds are hand-drawn, rolled, and forged at the jeweler's bench in London. Mounting prongs are carved to fit the exact girdle thickness of each diamond.",
    image: "/images/mah-atelier-concept.png",
  },
  {
    num: "03",
    title: "Detail",
    subtitle: "Microscope Setting & Hallmarking",
    desc: "Using high-magnification optical stereo microscopes, master setters seat micro-pavé diamonds with bead prongs that disappear into light, followed by official British hallmarking.",
    image: "/images/journal-atelier.jpg",
  },
];

const MATERIALS = [
  {
    name: "Solid Platinum 950",
    desc: "Naturally hypoallergenic, dense, and indestructible. Platinum secures diamonds with unrivaled grip and develops a soft heirloom patina over decades.",
    badge: "Hypoallergenic 95% Pure",
    image: "/images/metals/platinum.jpg",
  },
  {
    name: "18k Fairmined Golds",
    desc: "Cast in London using certified 750-purity alloys: warm Champagne Yellow Gold, radiant Rose Gold, and high-palladium White Gold requiring zero rhodium plating.",
    badge: "750 Purity Alloy",
    image: "/images/metals/yellow-gold.jpg",
  },
  {
    name: "Ethically Certified Diamonds",
    desc: "Triple Excellent proportioned stones personally inspected under 10× loupe for flawless optical fire, accompanied by GIA and IGI grading reports.",
    badge: "GIA & IGI Graded",
    image: "/images/shapes/round.png",
  },
];

export function AtelierView({ page }: { page: RoutePage }) {
  return (
    <main id="main-content" className="atelier-page">
      {/* 15 Hero Section */}
      <section className="atelier-hero" aria-labelledby="atelier-hero-title">
        <div className="atelier-hero-bg">
          <Image
            src="/images/journal-atelier.jpg"
            alt="MAH master craftsman at the jeweller's bench"
            fill
            priority
            sizes="100vw"
            className="atelier-hero-img"
          />
          <div className="atelier-hero-overlay" />
        </div>

        <div className="shell atelier-hero-content">
          <p className="eyebrow eyebrow-light">Section 15 · The Atelier</p>
          <h1 id="atelier-hero-title">
            From first line to final detail.
          </h1>
          <p className="atelier-hero-sub">
            The design, artisanal craftsmanship, and time-honoured bench techniques behind MAH high jewellery.
          </p>
          <div className="atelier-hero-ctas">
            <Link href="/bespoke" className="button button-light facet-oct-sm">
              Start Your Commission <ArrowRight size={15} />
            </Link>
            <Link href="/appointments" className="button button-outline-light facet-oct-sm">
              Book Atelier Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Journey of Craft Section (01 Design, 02 Craft, 03 Detail) */}
      <section className="atelier-craft-section section-pad">
        <div className="shell">
          <div className="section-heading centred">
            <p className="eyebrow">The Master Jeweller’s Bench</p>
            <h2>The Journey of Craft</h2>
            <p style={{ maxWidth: 640, margin: "14px auto 0", color: "var(--muted)" }}>
              The three essential disciplines guiding every solitaire, eternity band, and bespoke commission.
            </p>
          </div>

          <div className="craft-stages-list">
            {CRAFT_STAGES.map((stage, idx) => (
              <article
                key={stage.num}
                className={`craft-stage-row ${idx % 2 === 1 ? "craft-stage-reverse" : ""}`}
              >
                <div className="craft-stage-img-wrap facet-oct">
                  <Image
                    src={stage.image}
                    alt={stage.title}
                    fill
                    sizes="(max-width: 800px) 100vw, 50vw"
                  />
                  <span className="craft-stage-num-badge">{stage.num}</span>
                </div>
                <div className="craft-stage-copy">
                  <span className="stage-kicker">Stage {stage.num}</span>
                  <h3>{stage.title}</h3>
                  <strong>{stage.subtitle}</strong>
                  <p>{stage.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Materials & Stones */}
      <section className="atelier-materials-section section-pad" style={{ background: "var(--white)" }}>
        <div className="shell">
          <div className="section-heading centred">
            <p className="eyebrow">Noble Elements</p>
            <h2>Materials & Precious Stones</h2>
            <p style={{ maxWidth: 640, margin: "14px auto 0", color: "var(--muted)" }}>
              We source only noble precious metals and verified diamonds to ensure structural integrity across generations.
            </p>
          </div>

          <div className="materials-grid">
            {MATERIALS.map((mat) => (
              <div key={mat.name} className="material-card facet-oct-sm">
                <div style={{ position: "relative", width: "100%", height: 160, marginBottom: 16, borderRadius: 4, overflow: "hidden", background: "var(--ivory)", border: "1px solid var(--border-delicate)" }}>
                  <Image
                    src={mat.image}
                    alt={mat.name}
                    fill
                    className={mat.image.endsWith(".png") ? "object-contain p-4" : "object-cover"}
                  />
                </div>
                <span className="material-badge facet-oct-sm">{mat.badge}</span>
                <h3>{mat.name}</h3>
                <p>{mat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Craft & Detail Editorial Reassurance */}
      <section className="atelier-detail-section section-pad">
        <div className="shell atelier-detail-box facet-oct">
          <div className="detail-copy">
            <p className="eyebrow eyebrow-light">British Hallmarking & Provenance</p>
            <h2>Crafted in London’s Historic Quarters</h2>
            <p>
              Every MAH creation undergoes independent assaying and hallmarking at the Goldsmiths’ Company Assay Office in London, a tradition of consumer protection dating back to 1327.
            </p>
            <div className="detail-actions">
              <Link href="/bespoke" className="button button-light facet-oct-sm">
                Explore Bespoke Service <ArrowRight size={14} />
              </Link>
              <Link href="/expert" className="button button-outline-light facet-oct-sm">
                <MessageCircle size={15} /> Speak to an Expert
              </Link>
              <Link href="/appointments" className="button button-outline-light facet-oct-sm">
                <CalendarDays size={15} /> Book an Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

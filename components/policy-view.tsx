"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Award,
  Lock,
  FileText,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Printer,
  Info,
} from "lucide-react";
import { BrandMark } from "./brand-mark";

import { MAISON_POLICIES, type PolicySlug, type PolicyData } from "@/lib/policy-data";
export { MAISON_POLICIES, type PolicySlug, type PolicyData };

export function PolicyView({ activeSlug = "delivery-collection" }: { activeSlug?: PolicySlug }) {
  const [selectedSlug, setSelectedSlug] = useState<PolicySlug>(activeSlug);
  const current = MAISON_POLICIES[selectedSlug] || MAISON_POLICIES["delivery-collection"];

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="policy-suite-view">
      {/* Editorial Header */}
      <section className="policy-hero">
        <div className="shell policy-hero-inner">
          <div className="policy-hero-breadcrumbs">
            <Link href="/" className="crumb-link">Home</Link>
            <span className="crumb-sep">/</span>
            <span className="crumb-current">Maison Policies</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-active">{current.shortTitle}</span>
          </div>

          <div className="policy-hero-main">
            <span className="policy-badge facet-oct-sm">
              <ShieldCheck size={14} /> Section 30 · Maison Legal Standards
            </span>
            <h1>{current.title}</h1>
            <p className="policy-hero-sub">{current.subtitle}</p>

            <div className="policy-meta-row">
              <span><strong>Last Revised:</strong> {current.lastUpdated}</span>
              <span className="meta-dot">·</span>
              <span><strong>Assurance:</strong> London Assay Office & UK Consumer Law</span>
              <span className="meta-dot">·</span>
              <button onClick={handlePrint} className="policy-print-btn" title="Print this policy document">
                <Printer size={14} /> Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Suite Layout */}
      <div className="shell policy-layout-grid">
        {/* Left Navigation Sidebar */}
        <aside className="policy-sidebar">
          <div className="policy-sidebar-sticky">
            <p className="sidebar-eyebrow">Legal & Operational Suite</p>
            <nav className="policy-nav-list" aria-label="Policy Navigation">
              {(Object.keys(MAISON_POLICIES) as PolicySlug[]).map((slug) => {
                const item = MAISON_POLICIES[slug];
                const Icon = item.icon;
                const isActive = slug === selectedSlug;
                return (
                  <button
                    key={slug}
                    onClick={() => {
                      setSelectedSlug(slug);
                      if (typeof window !== "undefined") {
                        window.history.replaceState(null, "", `/policies/${slug}`);
                      }
                    }}
                    className={`policy-nav-btn ${isActive ? "active" : ""}`}
                  >
                    <span className="nav-icon-wrap">
                      <Icon size={16} />
                    </span>
                    <div className="nav-text-wrap">
                      <span className="nav-code">{item.sectionCode}</span>
                      <strong className="nav-title">{item.shortTitle}</strong>
                    </div>
                    {isActive && <div className="active-pip" />}
                  </button>
                );
              })}
            </nav>

            {/* Concierge Contact Card */}
            <div className="policy-concierge-card">
              <div className="concierge-crest">
                <BrandMark size="sm" />
              </div>
              <h4>Direct Client Concierge</h4>
              <p>For bespoke commission legalities, insurance certifications, or questions regarding transit.</p>
              <div className="concierge-links">
                <Link href="/expert" className="button button-outline button-sm">
                  Speak with Specialist
                </Link>
                <Link href="/appointments" className="text-link-sm">
                  Book Salon Viewing <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Article Content */}
        <main className="policy-article-body">
          {/* Key Assurance 4-Pillars Card */}
          <div className="policy-pillars-card">
            <p className="pillars-heading">Key Client Guarantees & Summary</p>
            <div className="pillars-grid">
              {current.summaryPillars.map((pillar, i) => (
                <div key={i} className="pillar-item">
                  <div className="pillar-icon">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <strong>{pillar.title}</strong>
                    <p>{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Policy Clauses */}
          <div className="policy-clauses">
            {current.content.map((clause, idx) => (
              <article key={idx} className="clause-card">
                <h2>{clause.heading}</h2>
                <p className="clause-body">{clause.body}</p>

                {clause.subsections && (
                  <div className="clause-subsections">
                    {clause.subsections.map((sub, sIdx) => (
                      <div key={sIdx} className="subsection-item">
                        <span className="sub-bullet">✦</span>
                        <div>
                          <strong>{sub.title}</strong>
                          <p>{sub.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {clause.callout && (
                  <div className={`policy-callout callout-${clause.callout.type}`}>
                    <Info size={16} />
                    <p>{clause.callout.text}</p>
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* Statutory Footer Stamp */}
          <div className="policy-statutory-stamp">
            <div className="stamp-inner">
              <Award size={28} />
              <div>
                <strong>MAH Diamonds & Fine Jewellery Ltd</strong>
                <p>Incorporated in England & Wales · Registered Sponsor Mark 'MAH' at London Assay Office · British Hallmarking Council Approved.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

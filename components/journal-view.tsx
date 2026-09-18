"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Calendar, Clock, Share2, Sparkles, User, X } from "lucide-react";
import type { RoutePage } from "@/lib/site-data";
import { DiamondEducationSuite } from "@/components/diamond-education-suite";
import { toast } from "sonner";

export interface JournalStory {
  id: string;
  categoryNum: string;
  category: string;
  title: string;
  titleLines: [string, string];
  subtitle: string;
  excerpt: string;
  author: string;
  date: string;
  readingTime: string;
  image: string;
  body: string[];
  quote: string;
}

export const JOURNAL_STORIES: JournalStory[] = [
  {
    id: "meaningful-tomorrow",
    categoryNum: "01",
    category: "From the Owner",
    title: "A More Meaningful Tomorrow",
    titleLines: ["A More", "Meaningful Tomorrow"],
    subtitle: "Thoughts, reflections and a look ahead from the person behind MAH.",
    excerpt: "Thoughts, reflections and a look ahead from the person behind MAH.",
    author: "MAH Founder",
    date: "Autumn 2026",
    readingTime: "4 min read",
    image: "/images/mah-atelier-sketch.jpg",
    body: [
      "When we founded MAH, our purpose was clear: to return fine jewellery to a standard of authentic beauty, quiet precision and uncompromising honesty.",
      "Too often, the fine jewellery world has relied on opaque pricing, artificial pressure and manufactured distance. We believe the creation and acquisition of extraordinary diamonds should be an open, personal conversation.",
      "Looking ahead, our commitment remains unwavering: to create enduring pieces marked by architectural clarity, ethical integrity and British hallmarked excellence that stand the test of generations."
    ],
    quote: "“Jewellery is the tangible memory of life’s most luminous promises. It must be crafted to outlive us all.”",
  },
  {
    id: "understanding-diamonds",
    categoryNum: "02",
    category: "Diamond & Jewellery Education",
    title: "Understanding Diamonds",
    titleLines: ["Understanding", "Diamonds"],
    subtitle: "Knowledge, guidance and insights to help you make more informed choices.",
    excerpt: "Knowledge, guidance and insights to help you make more informed choices.",
    author: "Head Gemmologist",
    date: "September 2026",
    readingTime: "6 min read",
    image: "/images/journal-diamonds.jpg",
    body: [
      "A diamond is an architectural study in light refraction. While carat weight describes physical mass, it is the precision of the cut that commands optical brilliance, fire and scintillation.",
      "When evaluating diamonds, proportions dictate how light behaves. An ideal table percentage between 54% and 57% paired with a 34.5° crown angle ensures that photons entering the crown reflect internally across the pavilion facets and exit directly toward the viewer.",
      "Whether choosing a billion-year-old natural diamond or a precision CVD lab-grown diamond, MAH provides comprehensive certification from GIA and IGI alongside clear gemmological guidance."
    ],
    quote: "“A diamond’s true beauty lies not in its weight, but in how masterfully it commands light.”",
  },
  {
    id: "people-and-process",
    categoryNum: "03",
    category: "House Stories",
    title: "The People and the Process",
    titleLines: ["The People", "and the Process"],
    subtitle: "Meet the craftsmanship, expertise and heritage that shape MAH.",
    excerpt: "Meet the craftsmanship, expertise and heritage that shape MAH.",
    author: "Atelier Director",
    date: "August 2026",
    readingTime: "5 min read",
    image: "/images/journal-atelier.jpg",
    body: [
      "Behind every MAH creation is a quiet dialogue between master goldsmiths, diamond setters and gemmologists working at benches worn smooth by decades of craftsmanship.",
      "Before precious metals are cast or claws are raised, every commission begins with a hand-rendered technical sketch and gouache painting to balance proportion, light entry and structural durability.",
      "Once hand-assembled in solid 950 platinum or 18k gold and micro-set under optical magnification, each finished piece travels to the Goldsmiths' Assay Office in London for official British hallmarking."
    ],
    quote: "“At the bench, a tenth of a millimeter is the difference between the ordinary and the timeless.”",
  },
  {
    id: "precious-alloys",
    categoryNum: "04",
    category: "Diamond & Jewellery Education",
    title: "Platinum & Gold: Selecting Your Alloy",
    titleLines: ["Platinum & Gold", "Selecting Your Alloy"],
    subtitle: "A comparative metallurgical guide for heirloom rings.",
    excerpt: "Understanding alloy densities, patina development and tensile strength across 950 Platinum and 18k Gold.",
    author: "Lead Metallurgist",
    date: "July 2026",
    readingTime: "5 min read",
    image: "/images/journal-diamonds.jpg",
    body: [
      "Choosing a metal alloy is both an aesthetic preference and an engineering decision for structural longevity.",
      "Solid 950 Platinum provides hypoallergenic purity and natural cold white luster that never requires rhodium plating. 18k Yellow and Rose Gold offer timeless warmth with 75% pure gold balanced with copper and silver for optimal daily wear durability."
    ],
    quote: "“The mount is not merely a frame—it is the enduring architecture that protects your stone.”",
  },
  {
    id: "anatomy-of-bespoke",
    categoryNum: "05",
    category: "House Stories",
    title: "The Anatomy of a Bespoke Commission",
    titleLines: ["The Anatomy of", "a Bespoke Piece"],
    subtitle: "From initial gouache sketches to final hallmark.",
    excerpt: "How our London atelier collaborates with clients to sculpt one-of-a-kind milestone pieces.",
    author: "Senior Designer",
    date: "June 2026",
    readingTime: "6 min read",
    image: "/images/mah-atelier-sketch.jpg",
    body: [
      "A bespoke commission begins without templates or preconceived limitations. We listen to your milestone story, explore diamond proportions, and carve hand-made wax models before metal casting."
    ],
    quote: "“A truly bespoke jewel is one that could only have been created for one person.”",
  },
];

export function JournalView({
  page,
  articleId,
}: {
  page: RoutePage;
  articleId?: string;
}) {
  const [activeStoryId, setActiveStoryId] = useState<string | null>(articleId || null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archiveFilter, setArchiveFilter] = useState("All");

  const activeStory = JOURNAL_STORIES.find((s) => s.id === activeStoryId);

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Article link copied to clipboard.");
    }
  };

  const scrollToCategories = () => {
    const el = document.getElementById("journal-categories");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Section 17B: Dedicated Journal Article Template View
  if (activeStory) {
    const primaryThree = JOURNAL_STORIES.slice(0, 3);
    const relatedStories = primaryThree.filter((s) => s.id !== activeStory.id);
    const currentIndex = JOURNAL_STORIES.findIndex((s) => s.id === activeStory.id);
    const prevStory = currentIndex > 0 ? JOURNAL_STORIES[currentIndex - 1] : null;
    const nextStory = currentIndex < JOURNAL_STORIES.length - 1 ? JOURNAL_STORIES[currentIndex + 1] : null;

    return (
      <main id="main-content" className="journal-article-page">
        {/* Top Header & Breadcrumb */}
        <section className="article-hero-section">
          <div className="shell">
            <button
              onClick={() => setActiveStoryId(null)}
              className="article-back-button"
            >
              <ArrowLeft size={14} /> Back to The Journal
            </button>

            <div className="article-header">
              <span className="article-category-eyebrow">{activeStory.category}</span>
              <h1 className="article-main-title">{activeStory.title}</h1>
              <p className="article-subtitle">{activeStory.subtitle}</p>

              <div className="article-meta-row">
                <span><User size={13} /> {activeStory.author}</span>
                <span><Calendar size={13} /> {activeStory.date}</span>
                <span><Clock size={13} /> {activeStory.readingTime}</span>
                <button onClick={handleShare} className="article-share-btn">
                  <Share2 size={13} /> Share Article
                </button>
              </div>
            </div>

            <div className="article-hero-img-wrap facet-oct">
              <Image
                src={activeStory.image}
                alt={activeStory.title}
                fill
                priority
                sizes="(max-width: 1000px) 100vw, 1200px"
                className="article-hero-img"
              />
            </div>
          </div>
        </section>

        {/* Article Body with Table of Contents */}
        <section className="article-body-section section-pad">
          <div className="shell article-body-inner">
            <aside className="article-toc">
              <div className="article-toc-box facet-oct-sm">
                <strong>In This Article</strong>
                <ul>
                  <li><a href="#overview">Overview & Context</a></li>
                  <li><a href="#reflection">Maison Reflection</a></li>
                  <li><a href="#craft">Craftsmanship & Standards</a></li>
                </ul>
              </div>
            </aside>

            <article className="article-content">
              <div id="overview" className="article-prose">
                <p className="article-lead">{activeStory.excerpt}</p>
                {activeStory.body.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {activeStory.id === "understanding-diamonds" && (
                <div style={{ margin: "40px 0" }}>
                  <DiamondEducationSuite compact />
                </div>
              )}

              <blockquote id="reflection" className="article-pull-quote facet-oct-sm">
                <p>{activeStory.quote}</p>
              </blockquote>

              <div id="craft" className="article-secondary-copy">
                <h3>Our Commitment</h3>
                <p>
                  Every insight shared in the MAH Journal reflects our genuine atelier practices and direct gemmological experience. For bespoke commissions or diamond inquiries, our experts are at your service.
                </p>
                <div style={{ marginTop: 24, display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <Link href="/expert" className="button button-dark facet-oct-sm">
                    Speak with an MAH Specialist <ArrowRight size={14} />
                  </Link>
                  <Link href="/appointments" className="button button-outline-dark facet-oct-sm">
                    Book an Appointment
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Related Stories (3 Categories) */}
        <section className="article-related-section section-pad">
          <div className="shell">
            <div className="section-heading centred">
              <p className="eyebrow">CONTINUE READING</p>
              <h2>Related Stories</h2>
            </div>

            <div className="related-stories-grid">
              {relatedStories.map((story) => (
                <div
                  key={story.id}
                  className="related-story-card facet-oct-sm"
                  onClick={() => {
                    setActiveStoryId(story.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className="related-img-wrap">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      sizes="(max-width: 800px) 100vw, 33vw"
                      className="related-card-img"
                    />
                  </div>
                  <div className="related-copy">
                    <span className="related-eyebrow">{story.category}</span>
                    <h3 className="related-title">{story.title}</h3>
                    <span className="text-link">
                      Discover Story <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Prev / Next Story Footer Links */}
            <div className="article-nav-row">
              {prevStory ? (
                <button
                  onClick={() => {
                    setActiveStoryId(prevStory.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="article-nav-link prev"
                >
                  <ArrowLeft size={14} /> Previous: {prevStory.title}
                </button>
              ) : <div />}
              {nextStory && (
                <button
                  onClick={() => {
                    setActiveStoryId(nextStory.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="article-nav-link next"
                >
                  Next: {nextStory.title} <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Section 17A: Journal Landing Page (100% Wireframe Alignment)
  const primaryCategories = JOURNAL_STORIES.slice(0, 3);
  const filteredArchive = archiveFilter === "All"
    ? JOURNAL_STORIES
    : JOURNAL_STORIES.filter((s) => s.category === archiveFilter);

  return (
    <main id="main-content" className="journal-landing-page-17a">
      {/* 1. HERO BANNER */}
      <section className="journal-hero-17a" aria-labelledby="journal-hero-heading">
        <div className="journal-hero-bg-wrap">
          <Image
            src="/images/journal-hero-17a.jpg"
            alt="The MAH Journal - Midnight linen embossed book with sparkling diamond and light caustics"
            fill
            priority
            sizes="100vw"
            className="journal-hero-image"
          />
          <div className="journal-hero-shade" />
        </div>

        <div className="shell journal-hero-inner">
          <div className="journal-hero-content-box">
            <p className="journal-eyebrow-hero">THE JOURNAL</p>
            <div className="journal-eyebrow-line" />
            <h1 id="journal-hero-heading" className="journal-hero-heading">
              A Closer Look
              <br />
              at a Brighter World
            </h1>
            <p className="journal-hero-sub">
              Stories and perspectives from the world of fine jewellery, told by MAH.
            </p>
            <div className="journal-hero-action-wrap">
              <button
                onClick={scrollToCategories}
                aria-label="Enter The Journal"
                className="journal-hero-arrow-btn facet-oct-sm"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE ALTERNATING EDITORIAL CATEGORIES */}
      <section id="journal-categories" className="journal-categories-17a">
        <div className="shell">
          {/* CATEGORY 01: FROM THE OWNER (Image Left · Content Right) */}
          <article className="journal-category-row image-left">
            <div
              className="journal-cat-image-box facet-oct-sm"
              onClick={() => setActiveStoryId(primaryCategories[0].id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter") setActiveStoryId(primaryCategories[0].id); }}
            >
              <Image
                src={primaryCategories[0].image}
                alt="Atelier drafting sketchbook with diamond ring drawing and fountain pen"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="journal-cat-img"
              />
            </div>

            <div className="journal-cat-content-box">
              <p className="journal-cat-eyebrow">
                01 <span className="cat-eyebrow-dash">——</span> FROM THE OWNER
              </p>
              <h2 className="journal-cat-title">
                A More
                <br />
                Meaningful Tomorrow
              </h2>
              <div className="journal-cat-accent-line" />
              <p className="journal-cat-description">
                Thoughts, reflections and a look ahead from the person behind MAH.
              </p>
              <button
                onClick={() => setActiveStoryId(primaryCategories[0].id)}
                className="journal-discover-link"
              >
                DISCOVER <ArrowRight size={14} />
              </button>
            </div>
          </article>

          {/* CATEGORY 02: DIAMOND & JEWELLERY EDUCATION (Content Left · Image Right) */}
          <article className="journal-category-row content-left">
            <div className="journal-cat-content-box">
              <p className="journal-cat-eyebrow">
                02 <span className="cat-eyebrow-dash">——</span> DIAMOND &amp; JEWELLERY EDUCATION
              </p>
              <h2 className="journal-cat-title">
                Understanding
                <br />
                Diamonds
              </h2>
              <div className="journal-cat-accent-line" />
              <p className="journal-cat-description">
                Knowledge, guidance and insights to help you make more informed choices.
              </p>
              <button
                onClick={() => setActiveStoryId(primaryCategories[1].id)}
                className="journal-discover-link"
              >
                DISCOVER <ArrowRight size={14} />
              </button>
            </div>

            <div
              className="journal-cat-image-box facet-oct-sm"
              onClick={() => setActiveStoryId(primaryCategories[1].id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter") setActiveStoryId(primaryCategories[1].id); }}
            >
              <Image
                src={primaryCategories[1].image}
                alt="Fine diamond solitaire ring catching luminous reflections on silk"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="journal-cat-img"
              />
            </div>
          </article>

          {/* CATEGORY 03: HOUSE STORIES (Image Left · Content Right) */}
          <article className="journal-category-row image-left">
            <div
              className="journal-cat-image-box facet-oct-sm"
              onClick={() => setActiveStoryId(primaryCategories[2].id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter") setActiveStoryId(primaryCategories[2].id); }}
            >
              <Image
                src={primaryCategories[2].image}
                alt="Master goldsmith diamond setting workbench with bench vise and precision loupe"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="journal-cat-img"
              />
            </div>

            <div className="journal-cat-content-box">
              <p className="journal-cat-eyebrow">
                03 <span className="cat-eyebrow-dash">——</span> HOUSE STORIES
              </p>
              <h2 className="journal-cat-title">
                The People
                <br />
                and the Process
              </h2>
              <div className="journal-cat-accent-line" />
              <p className="journal-cat-description">
                Meet the craftsmanship, expertise and heritage that shape MAH.
              </p>
              <button
                onClick={() => setActiveStoryId(primaryCategories[2].id)}
                className="journal-discover-link"
              >
                DISCOVER <ArrowRight size={14} />
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* 3. VIEW ALL STORIES ARCHIVE SECTION */}
      <section className="journal-view-all-section">
        <div className="shell journal-view-all-inner">
          <p className="journal-explore-eyebrow">EXPLORE MORE</p>
          <h2 className="journal-view-all-title">View All Stories</h2>
          <button
            onClick={() => setShowArchiveModal(true)}
            aria-label="View All Journal Stories"
            className="journal-archive-arrow-btn facet-oct-sm"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* COMPLETE ARCHIVE MODAL / DRAWER */}
      {showArchiveModal && (
        <div
          className="journal-archive-modal-backdrop"
          onClick={() => setShowArchiveModal(false)}
        >
          <div
            className="journal-archive-modal facet-oct"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="archive-modal-header">
              <div>
                <span className="eyebrow">MAH Editorial Archive</span>
                <h2>All Journal Stories</h2>
              </div>
              <button
                onClick={() => setShowArchiveModal(false)}
                className="modal-close-btn"
                aria-label="Close Archive"
              >
                <X size={20} />
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="archive-filter-pills">
              {["All", "From the Owner", "Diamond & Jewellery Education", "House Stories"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setArchiveFilter(cat)}
                  className={`archive-pill ${archiveFilter === cat ? "active" : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Archive Stories List */}
            <div className="archive-stories-grid">
              {filteredArchive.map((story) => (
                <div
                  key={story.id}
                  className="archive-story-item facet-oct-sm"
                  onClick={() => {
                    setShowArchiveModal(false);
                    setActiveStoryId(story.id);
                  }}
                >
                  <div className="archive-story-img-wrap">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      sizes="300px"
                      className="archive-img"
                    />
                  </div>
                  <div className="archive-story-info">
                    <span className="archive-category">{story.category}</span>
                    <h3>{story.title}</h3>
                    <p>{story.subtitle}</p>
                    <div className="archive-meta">
                      <span>{story.readingTime}</span> · <span>{story.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  CalendarDays,
  Diamond,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Lock,
} from "lucide-react";
import { money, products } from "@/lib/demo-data";

const collectionTiles = [
  {
    number: "01",
    title: "Engagement Rings",
    subtitle: "Solitaires, Trilogies & Halo Clusters",
    copy: "Begin with an architectural setting, a certified diamond, or a personal conversation.",
    href: "/engagement-rings",
    image: "/images/styles/solitaire.jpg",
    position: "center",
  },
  {
    number: "02",
    title: "Wedding Bands",
    subtitle: "Eternity & Pavé Bands",
    copy: "Heirloom bands considered individually, chosen and cast to mark a promise made together.",
    href: "/wedding-rings",
    image: "/images/styles/diamond-band.jpg",
    position: "center",
  },
  {
    number: "03",
    title: "Certified Diamonds",
    subtitle: "Natural & Lab-Grown Reserves",
    copy: "Every centre stone individually graded by GIA or IGI and laser-inscribed for lifelong provenance.",
    href: "/diamonds",
    image: "/images/journal-diamonds.jpg",
    position: "center",
  },
  {
    number: "04",
    title: "Haute Joaillerie",
    subtitle: "Signatures & Bespoke Suites",
    copy: "Fine jewellery creations crafted in London for milestone moments that become part of you.",
    href: "/jewellery",
    image: "/images/styles/halo.jpg",
    position: "center",
  },
];

const homeShapes = [
  { name: "Round", tagline: "Brilliant 57-Facet Fire", icon: "/images/shapes/round.png" },
  { name: "Oval", tagline: "Elongated Modern Grace", icon: "/images/shapes/oval.png" },
  { name: "Emerald", tagline: "Architectural Step-Cut", icon: "/images/shapes/emerald.png" },
  { name: "Pear", tagline: "Tapered Teardrop Majesty", icon: "/images/shapes/pear.png" },
  { name: "Cushion", tagline: "Antique Romantic Pillow", icon: "/images/shapes/cushion.png" },
  { name: "Marquise", tagline: "French Royal Silhouette", icon: "/images/shapes/marquise.png" },
  { name: "Princess", tagline: "Crisp Square Symmetry", icon: "/images/shapes/princess.png" },
  { name: "Radiant", tagline: "Truncated Scintillation", icon: "/images/shapes/radiant.png" },
];

const services = [
  {
    title: "Private Salon Consultation",
    copy: "Meet with an MAH diamond specialist in our Mayfair or Hatton Garden showrooms.",
    href: "/appointments",
    icon: CalendarDays,
  },
  {
    title: "4Cs Diamond Guidance",
    copy: "Direct advice on carat proportions, GIA grading, and natural vs lab-grown stones.",
    href: "/expert",
    icon: MessageCircle,
  },
  {
    title: "Bespoke Royal Commissions",
    copy: "One-of-a-kind milestone pieces designed and hand-forged in our London atelier.",
    href: "/bespoke",
    icon: ShieldCheck,
  },
  {
    title: "Maison Vault & Guarantees",
    copy: "Lifetime craftsmanship warranty, British hallmarking, and digital certificate dossiers.",
    href: "/account",
    icon: Lock,
  },
];

export default function Home() {
  const edit = products.slice(0, 4);

  return (
    <main id="main-content" className="lux-home">
      {/* Hero Section - Haute Joaillerie Solitaires */}
      <section className="lux-hero" aria-labelledby="lux-hero-title">
        <Image
          src="/images/mah-hero-concept.png"
          alt="MAH Solitaire diamond ring beside a midnight-blue presentation box"
          fill
          priority
          sizes="100vw"
          className="lux-hero-image"
        />
        <div className="lux-hero-shade" />
        <div className="shell lux-hero-copy">
          <div className="hero-emblem-badge facet-oct-sm">
            <Diamond size={14} />
            <span>Maison de Haute Joaillerie</span>
          </div>
          <p className="lux-kicker">The MAH Solitaire Collection</p>
          <h1 id="lux-hero-title">
            For the promise<br />that changes everything.
          </h1>
          <p>
            Parisian poetry, British royal heraldry, and Hatton Garden diamond mastery united in milestone creations designed for a lifetime.
          </p>
          <div className="lux-actions">
            <Link href="/engagement-rings" className="facet-oct-sm">
              Explore Engagement Rings <ArrowRight size={15} />
            </Link>
            <Link href="/appointments">Book Private Appointment</Link>
          </div>
        </div>
        <div className="lux-hero-index">
          <span>01</span>
          <i />
          <span>04</span>
        </div>
        <p className="lux-image-note">
          MAH High Jewellery · Handcrafted in Mayfair & Hatton Garden
        </p>
      </section>

      {/* Trust & Heritage Reassurance Ticker */}
      <section className="home-reassurance-bar" aria-label="Maison assurances">
        <div className="shell reassurance-grid">
          <div className="reassurance-item">
            <Award size={17} />
            <span>GIA & IGI Certified Diamonds</span>
          </div>
          <div className="reassurance-item">
            <Sparkles size={17} />
            <span>British Hallmarked & London Atelier Cast</span>
          </div>
          <div className="reassurance-item">
            <ShieldCheck size={17} />
            <span>Complimentary Insured UK & Global Delivery</span>
          </div>
          <div className="reassurance-item">
            <CalendarDays size={17} />
            <span>Private Consultations in Mayfair</span>
          </div>
        </div>
      </section>

      {/* Intro Section - Chaumet expansive breathing space */}
      <section className="lux-intro">
        <div className="shell">
          <p className="lux-kicker">A House of Considered Detail</p>
          <h2>
            Jewellery begins with beauty.<br />Meaning makes it yours.
          </h2>
          <p className="lux-intro-copy">
            MAH brings together certified diamonds, architectural design and personal guidance in one serene experience—created for the milestone creations you will pass down for generations.
          </p>
          <Link className="lux-line-link" href="/our-house">
            Discover Our House History <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* Collections Grid - Chaumet Chapters (4 Primary Categories) */}
      <section className="lux-collections" aria-labelledby="collections-heading">
        <div className="shell lux-section-head">
          <div>
            <p className="lux-kicker">Maison Chapters</p>
            <h2 id="collections-heading">Collections</h2>
          </div>
          <Link className="lux-line-link" href="/jewellery">
            View All High Jewellery <ArrowRight size={14} />
          </Link>
        </div>
        <div className="lux-collection-grid lux-collection-grid-4">
          {collectionTiles.map((tile) => (
            <Link
              href={tile.href}
              className="lux-collection-card"
              key={tile.title}
            >
              <Image
                src={tile.image}
                alt={tile.title}
                fill
                sizes="(max-width: 760px) 100vw, (max-width: 1200px) 50vw, 25vw"
                style={{ objectPosition: tile.position }}
              />
              <span className="lux-collection-shade" />
              <span className="lux-collection-number">{tile.number}</span>
              <span className="lux-collection-content">
                <small>{tile.subtitle}</small>
                <strong>{tile.title}</strong>
                <em>{tile.copy}</em>
                <i>
                  Discover Collection <ArrowRight size={14} />
                </i>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Diamond Shape Gateway - Section 04 Requirement */}
      <section className="home-shapes-gateway section-pad" aria-labelledby="shapes-heading">
        <div className="shell">
          <div className="lux-section-head" style={{ marginBottom: 36 }}>
            <div>
              <p className="lux-kicker">Architectural Geometry</p>
              <h2 id="shapes-heading" style={{ fontSize: "clamp(2.4rem, 4vw, 3.6rem)" }}>
                Explore by Diamond Shape
              </h2>
            </div>
            <Link className="lux-line-link" href="/diamonds/search">
              View All Loose Diamonds <ArrowRight size={14} />
            </Link>
          </div>

          <div className="home-shapes-grid">
            {homeShapes.map((shape) => (
              <Link
                key={shape.name}
                href={`/diamonds/search?shape=${encodeURIComponent(shape.name)}`}
                className="home-shape-card facet-oct-sm"
              >
                <span className="home-shape-icon facet-oct-sm">
                  <Image
                    src={shape.icon}
                    alt={`${shape.name} Diamond Cut`}
                    width={46}
                    height={46}
                    className="home-shape-img"
                  />
                </span>
                <strong>{shape.name}</strong>
                <small>{shape.tagline}</small>
                <span className="home-shape-action">
                  Explore Shape <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* The MAH Edit - Clean Alabaster Gallery Rail */}
      <section className="lux-edit" aria-labelledby="edit-heading">
        <div className="shell lux-section-head">
          <div>
            <p className="lux-kicker">Curated for You</p>
            <h2 id="edit-heading">The MAH Edit</h2>
          </div>
          <p>
            A sample edit of our signature settings and certified stones, ready to be configured.
          </p>
        </div>
        <div className="shell lux-product-rail">
          {edit.map((product) => {
            const href =
              product.category === "engagement"
                ? "/engagement-rings/configure?id=" + product.id
                : product.category === "wedding"
                ? "/wedding-rings/product?id=" + product.id
                : "/jewellery/product?id=" + product.id;
            return (
              <Link href={href} className="lux-product" key={product.id}>
                <span className="lux-product-image">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 760px) 78vw, 25vw"
                  />
                  <small>London Handcrafted</small>
                </span>
                <span className="lux-product-meta">
                  <small>
                    {product.style} · {product.metal}
                  </small>
                  <strong>{product.name}</strong>
                  <em>
                    {money(product.price)}{" "}
                    {product.category === "engagement" ? "setting price" : "incl. VAT"}
                  </em>
                </span>
              </Link>
            );
          })}
        </div>
        <div className="shell lux-centred-link">
          <Link className="lux-line-link" href="/jewellery">
            Explore the Complete Catalogue <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* MAH Bespoke Feature - British Atelier Heritage */}
      <section className="lux-feature lux-feature-dark">
        <div className="lux-feature-image">
          <Image
            src="/images/mah-atelier-concept.png"
            alt="Jewellery master crafting a bespoke diamond setting at the MAH atelier bench"
            fill
            sizes="(max-width: 850px) 100vw, 58vw"
          />
          <small>MAH Atelier · Mayfair & Hatton Garden</small>
        </div>
        <div className="lux-feature-copy">
          <p className="lux-kicker">MAH Bespoke Commissions</p>
          <h2>
            One singular idea.<br />Hand-forged for you.
          </h2>
          <p>
            A bespoke commission begins with an intimate conversation. Discover a personal path from hand-drawn gouache renderings to certified gemstone sourcing and the final hallmarked creation.
          </p>
          <Link href="/bespoke" className="facet-oct-sm">
            Begin Your Private Commission <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Signature Section */}
      <section className="lux-signature">
        <div className="shell lux-signature-grid">
          <div className="lux-signature-copy">
            <p className="lux-kicker">MAH Signatures</p>
            <h2>A Distinct Point of View.</h2>
            <p>
              Discover the signature edit—where cut-corner octagonal facet silhouettes meet the pure brilliance of high-purity natural and lab-grown diamonds.
            </p>
            <Link className="lux-line-link" href="/jewellery/signatures">
              Discover Signature Creations <ArrowRight size={14} />
            </Link>
          </div>
          <div className="lux-signature-image facet-oct">
            <Image
              src="/images/mah-hero-concept.png"
              alt="Signature MAH Solitaire Ring"
              fill
              sizes="(max-width: 760px) 100vw, 54vw"
            />
            <span>Signature Edition 01</span>
          </div>
        </div>
      </section>

      {/* Journal Stories - Linked to Live Articles */}
      <section className="lux-journal">
        <div className="shell lux-section-head">
          <div>
            <p className="lux-kicker">The World of MAH</p>
            <h2>Stories & Considered Guidance</h2>
          </div>
          <Link className="lux-line-link" href="/journal">
            Enter the Journal <ArrowRight size={14} />
          </Link>
        </div>
        <div className="shell lux-journal-grid">
          <Link href="/journal/article?id=4cs-dossier" className="lux-story lux-story-main">
            <span>Diamond Education</span>
            <strong>The 4Cs Dossier: Finding the Diamond That Speaks to You.</strong>
            <p>
              A considered introduction to proportion, light performance, optical symmetry and the distinction between natural and lab-grown diamonds.
            </p>
            <i>
              Read the Story <ArrowRight size={14} />
            </i>
          </Link>
          <Link href="/journal/article?id=atelier-journey" className="lux-story">
            <span>The Atelier</span>
            <strong>From First Gouache Sketch to Final Hallmarking.</strong>
            <i>
              Discover Craftsmanship <ArrowRight size={14} />
            </i>
          </Link>
          <Link href="/journal/article?id=vision-of-mah" className="lux-story">
            <span>Our House</span>
            <strong>The Evolving MAH Point of View.</strong>
            <i>
              Read More <ArrowRight size={14} />
            </i>
          </Link>
        </div>
      </section>

      {/* Client Services Bar */}
      <section className="lux-services" aria-label="Client services">
        <div className="shell">
          {services.map(({ title, copy, href, icon: Icon }) => (
            <Link href={href} key={title}>
              <Icon />
              <span>
                <strong>{title}</strong>
                <small>{copy}</small>
              </span>
              <ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

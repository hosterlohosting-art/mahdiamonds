import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Info } from "lucide-react";
import { notFound } from "next/navigation";
import { routePages } from "@/lib/site-data";
import { DemoExperience } from "@/components/demo-experience";
import { PolicyView } from "@/components/policy-view";
import { MAISON_POLICIES, type PolicySlug } from "@/lib/policy-data";

const interactiveRoutes = new Set([
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

type PageProps = { params: Promise<{ slug: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let key = slug.join("/");
  if (key === "appointment" || key === "book-an-appointment") key = "appointments";
  if (key.startsWith("policies/")) {
    const policySlug = key.replace("policies/", "") as PolicySlug;
    const policy = MAISON_POLICIES[policySlug];
    if (policy) return { title: `${policy.title} | MAH Diamonds London`, description: policy.subtitle };
  }
  if (key === "policies") {
    return { title: "Maison Policies & Legal Standards | MAH Diamonds London" };
  }
  const page = routePages[key];
  if (!page) return { title: "Page not found" };
  return { title: page.title, description: page.intro };
}

export default async function SectionPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  let routeKey = slug.join("/");
  if (routeKey === "appointment" || routeKey === "book-an-appointment") {
    routeKey = "appointments";
  }

  if (routeKey.startsWith("policies/")) {
    let rawSlug = routeKey.replace("policies/", "");
    const aliasMap: Record<string, PolicySlug> = {
      "privacy-security": "privacy",
      "privacy-policy": "privacy",
      "terms-of-sale": "terms",
      "terms-and-conditions": "terms",
      "bespoke-terms": "terms",
      "diamond-grading": "lifetime-warranty",
      "hallmarking": "hallmarking-act",
      "shipping": "delivery-collection",
      "returns": "returns-resizing",
    };
    const policySlug = (aliasMap[rawSlug] || rawSlug) as PolicySlug;
    if (MAISON_POLICIES[policySlug]) {
      return (
        <main id="main-content">
          <PolicyView activeSlug={policySlug} />
        </main>
      );
    }
  }

  if (routeKey === "policies") {
    return (
      <main id="main-content">
        <PolicyView activeSlug="delivery-collection" />
      </main>
    );
  }

  const page = routePages[routeKey];
  if (!page) notFound();
  if (interactiveRoutes.has(routeKey)) return <DemoExperience routeKey={routeKey} page={page} query={await searchParams} />;

  return (
    <main id="main-content" className={`route-page${page.dark ? " route-page-dark" : ""}`}>
      <section className="route-hero">
        <div className="route-orbit route-orbit-one" aria-hidden="true" />
        <div className="route-orbit route-orbit-two" aria-hidden="true" />
        <div className="shell route-hero-inner">
          <Link href="/" className="route-back"><ArrowLeft size={15} /> Home</Link>
          <div className="route-title-wrap">
            <p className="eyebrow">Section {page.section} · {page.eyebrow}</p>
            <h1>{page.title}</h1>
            <p>{page.intro}</p>
          </div>
          <span className="route-section-number" aria-hidden="true">{page.section}</span>
        </div>
      </section>

      {page.steps && (
        <section className="route-steps" aria-label="Journey steps"><div className="shell">
          {page.steps.map((step, index) => <div className="route-step" key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong>{index < page.steps!.length - 1 && <i aria-hidden="true" />}</div>)}
        </div></section>
      )}

      <section className="route-content section-pad"><div className="shell">
        <div className="route-content-heading"><p className="eyebrow">Maison Curation</p><h2>Crafted with London Bench Mastery</h2><p>Every piece is shaped by certified gemological standards and hallmarked by the London Assay Office.</p></div>
        <div className="route-modules">
          {page.modules.map((item, index) => (
            <article className="route-module" key={item.title}>
              <span className="module-index">0{index + 1}</span>
              <div className="module-rule" />
              <h3>{item.title}</h3><p>{item.body}</p>
              {item.href && <Link href={item.href}>{item.cta} <ArrowRight size={15} /></Link>}
            </article>
          ))}
        </div>
      </div></section>

      <section className="route-readiness"><div className="shell readiness-grid">
        <div><p className="eyebrow eyebrow-light">Private Consultations</p><h2>Experience MAH Diamonds in Person</h2></div>
        <div className="readiness-list"><span><Check size={16} /> GIA &amp; IGI certified gemstones</span><span><Check size={16} /> British Hallmarked Platinum &amp; Gold</span><span><Check size={16} /> Bespoke Mayfair &amp; Hatton Garden Salons</span><span><Check size={16} /> Complimentary Insured Delivery</span></div>
        <Link className="button button-outline-light" href="/appointments">Book a Consultation</Link>
      </div></section>
    </main>
  );
}

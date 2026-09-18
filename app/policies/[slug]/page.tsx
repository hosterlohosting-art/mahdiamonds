import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PolicyView } from "@/components/policy-view";
import { MAISON_POLICIES, type PolicySlug } from "@/lib/policy-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return Object.keys(MAISON_POLICIES).map((slug) => ({ slug }));
}

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolvedSlug = (aliasMap[slug] || slug) as PolicySlug;
  const policy = MAISON_POLICIES[resolvedSlug];
  if (!policy) return { title: "Policy Not Found | MAH Diamonds" };
  return {
    title: `${policy.title} | MAH Diamonds London`,
    description: policy.subtitle,
  };
}

export default async function PolicySlugPage({ params }: PageProps) {
  const { slug } = await params;
  const resolvedSlug = (aliasMap[slug] || slug) as PolicySlug;
  if (!MAISON_POLICIES[resolvedSlug]) {
    notFound();
  }

  return (
    <main id="main-content">
      <PolicyView activeSlug={resolvedSlug} />
    </main>
  );
}

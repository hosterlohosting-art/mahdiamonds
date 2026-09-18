import type { MetadataRoute } from "next";
import { MAISON_POLICIES } from "@/lib/policy-data";
import { products, diamonds } from "@/lib/demo-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mahdiamonds.co.uk";
  const now = new Date();

  // Core navigation routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/engagement-rings`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/engagement-rings/configure`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/wedding-rings`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/diamonds`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/diamonds/search`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/jewellery`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/jewellery/signatures`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/bespoke`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/atelier`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/our-house`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/journal`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/expert`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/appointments`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/policies`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${baseUrl}/wishlist`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/search`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
  ];

  // Policies (Section 30)
  const policyRoutes: MetadataRoute.Sitemap = Object.keys(MAISON_POLICIES).map((slug) => ({
    url: `${baseUrl}/policies/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  // Journal Articles (Section 17B)
  const journalRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/journal/article?id=4cs-dossier`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/journal/article?id=atelier-journey`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/journal/article?id=vision-of-mah`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
  ];

  return [...staticRoutes, ...policyRoutes, ...journalRoutes];
}

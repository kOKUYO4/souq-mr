import { MetadataRoute } from "next";
import { listings, categories } from "@/data/mockData";

const BASE = "https://souq.mr";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE, priority: 1.0, changeFrequency: "daily" as const },
    { url: `${BASE}/annonces`, priority: 0.9, changeFrequency: "hourly" as const },
    { url: `${BASE}/categories`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE}/vendre`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${BASE}/recherche`, priority: 0.7, changeFrequency: "weekly" as const },
    { url: `${BASE}/pro`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${BASE}/aide`, priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${BASE}/a-propos`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `${BASE}/contact`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `${BASE}/securite`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `${BASE}/conditions`, priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${BASE}/confidentialite`, priority: 0.3, changeFrequency: "yearly" as const },
  ];

  const categoryPages = categories.map((cat) => ({
    url: `${BASE}/categories/${cat.id}`,
    priority: 0.7,
    changeFrequency: "daily" as const,
  }));

  const listingPages = listings.map((l) => ({
    url: `${BASE}/annonce/${l.id}`,
    priority: 0.6,
    changeFrequency: "weekly" as const,
    lastModified: new Date(l.createdAt),
  }));

  return [...staticPages, ...categoryPages, ...listingPages];
}

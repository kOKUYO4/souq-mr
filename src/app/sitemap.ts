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
    { url: `${BASE}/notifications`, priority: 0.4, changeFrequency: "daily" as const },
    { url: `${BASE}/carte`, priority: 0.6, changeFrequency: "weekly" as const },
    { url: `${BASE}/escrow`, priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${BASE}/souk-vocal`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `${BASE}/ramadan`, priority: 0.6, changeFrequency: "daily" as const },
    { url: `${BASE}/portefeuille`, priority: 0.5, changeFrequency: "daily" as const },
    { url: `${BASE}/alertes`, priority: 0.5, changeFrequency: "daily" as const },
    { url: `${BASE}/parrainage`, priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${BASE}/tontine`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `${BASE}/bazaar-live`, priority: 0.7, changeFrequency: "hourly" as const },
    { url: `${BASE}/suivi`, priority: 0.5, changeFrequency: "daily" as const },
    { url: `${BASE}/livraison`, priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${BASE}/paiement`, priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${BASE}/verification`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `${BASE}/classement`, priority: 0.6, changeFrequency: "weekly" as const },
    { url: `${BASE}/actualites`, priority: 0.7, changeFrequency: "daily" as const },
    { url: `${BASE}/statistiques`, priority: 0.5, changeFrequency: "daily" as const },
    { url: `${BASE}/promotions`, priority: 0.8, changeFrequency: "daily" as const },
    { url: `${BASE}/application`, priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${BASE}/offres`, priority: 0.5, changeFrequency: "daily" as const },
    { url: `${BASE}/vendeurs`, priority: 0.7, changeFrequency: "daily" as const },
    { url: `${BASE}/coupons`, priority: 0.7, changeFrequency: "daily" as const },
    { url: `${BASE}/faq`, priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${BASE}/partenaires`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `${BASE}/presse`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `${BASE}/investisseurs`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `${BASE}/recrutement`, priority: 0.6, changeFrequency: "weekly" as const },
    { url: `${BASE}/accessibilite`, priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${BASE}/ramadan`, priority: 0.7, changeFrequency: "daily" as const },
    { url: `${BASE}/verification`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `${BASE}/plan-du-site`, priority: 0.3, changeFrequency: "monthly" as const },
    { url: `${BASE}/politique-cookies`, priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${BASE}/comparer`, priority: 0.6, changeFrequency: "weekly" as const },
    { url: `${BASE}/connexion`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `${BASE}/inscription`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `${BASE}/messages`, priority: 0.7, changeFrequency: "daily" as const },
    { url: `${BASE}/favoris`, priority: 0.5, changeFrequency: "daily" as const },
    { url: `${BASE}/tableau-de-bord`, priority: 0.7, changeFrequency: "daily" as const },
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

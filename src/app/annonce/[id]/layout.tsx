import type { Metadata } from "next";
import { listings, formatPrice } from "@/data/mockData";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const listing = listings.find((l) => l.id === params.id);

  if (!listing) {
    return { title: "Annonce introuvable" };
  }

  const desc = `${formatPrice(listing.price)} — ${listing.location}. ${listing.description.slice(0, 130)}…`;

  return {
    title: listing.title,
    description: desc,
    openGraph: {
      title: `${listing.title} | SOUQ.MR`,
      description: desc,
      images: listing.images[0] ? [{ url: listing.images[0], width: 1200, height: 630 }] : [],
      type: "website",
      locale: "fr_MR",
    },
    twitter: {
      card: "summary_large_image",
      title: listing.title,
      description: desc,
      images: listing.images[0] ? [listing.images[0]] : [],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

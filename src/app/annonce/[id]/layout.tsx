import type { Metadata } from "next";

const formatPrice = (price: number): string =>
  new Intl.NumberFormat("fr-MR", { style: "decimal", maximumFractionDigits: 0 }).format(price);

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/listings/${params.id}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("not found");
    const listing = await res.json();

    const desc = `${formatPrice(listing.price)} MRU — ${listing.location}. ${listing.description?.slice(0, 130) ?? ""}…`;

    return {
      title: listing.title,
      description: desc,
      openGraph: {
        title: `${listing.title} | SOUQ.MR`,
        description: desc,
        images: listing.images?.[0] ? [{ url: listing.images[0], width: 1200, height: 630 }] : [],
        type: "website",
        locale: "fr_MR",
      },
      twitter: {
        card: "summary_large_image",
        title: listing.title,
        description: desc,
        images: listing.images?.[0] ? [listing.images[0]] : [],
      },
    };
  } catch {
    return { title: "Annonce introuvable" };
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

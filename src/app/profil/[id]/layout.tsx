import type { Metadata } from "next";
import { sellers } from "@/data/mockData";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const seller = sellers.find((s) => s.id === params.id);

  if (!seller) {
    return { title: "Profil introuvable" };
  }

  const desc = `Profil de ${seller.name} sur SOUQ.MR — Note ${seller.rating}/5, ${seller.reviews} avis, ${seller.listings} annonces actives.`;

  return {
    title: `${seller.name} — Vendeur`,
    description: desc,
    openGraph: {
      title: `${seller.name} | SOUQ.MR`,
      description: desc,
      images: [{ url: seller.avatar, width: 400, height: 400 }],
      type: "profile",
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

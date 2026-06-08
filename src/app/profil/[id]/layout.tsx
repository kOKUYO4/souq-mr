import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/profile/${params.id}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("not found");
    const seller = await res.json();

    const desc = `Profil de ${seller.name} sur NUQTA.MR — Note ${seller.rating}/5, ${seller.reviews} avis, ${seller.listings} annonces actives.`;

    return {
      title: `${seller.name} — Vendeur`,
      description: desc,
      openGraph: {
        title: `${seller.name} | NUQTA.MR`,
        description: desc,
        images: seller.avatar ? [{ url: seller.avatar, width: 400, height: 400 }] : [],
        type: "profile",
      },
    };
  } catch {
    return { title: "Profil introuvable" };
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

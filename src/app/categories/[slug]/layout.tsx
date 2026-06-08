import type { Metadata } from "next";
import { categories } from "@/data/categories";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const cat = categories.find((c) => c.id === params.slug);

  if (!cat) {
    return { title: "Catégorie introuvable" };
  }

  return {
    title: `${cat.name} — ${cat.count.toLocaleString("fr-MR")} annonces`,
    description: `Parcourez ${cat.count.toLocaleString("fr-MR")} annonces dans la catégorie ${cat.name} sur NUQTA.MR — la première marketplace mauritanienne.`,
    openGraph: {
      title: `${cat.name} | NUQTA.MR`,
      description: `${cat.count.toLocaleString("fr-MR")} annonces disponibles`,
      type: "website",
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

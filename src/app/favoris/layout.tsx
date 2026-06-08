import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mes favoris",
  description: "Retrouvez toutes vos annonces sauvegardées sur NUQTA.MR.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Mes offres",
  description: "Suivez vos offres d'achat et de vente sur SOUQ.MR.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Carte des annonces",
  description: "Trouvez des annonces près de chez vous sur la carte SOUQ.MR.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

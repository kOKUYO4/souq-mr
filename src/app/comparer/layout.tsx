import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Comparer des produits",
  description: "Comparez jusqu'à 4 articles côte à côte sur NUQTA.MR.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

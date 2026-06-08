import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Promotions & Bons plans",
  description: "Découvrez toutes les promotions et bons plans sur NUQTA.MR, la marketplace mauritanienne.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Plan du site",
  description: "Toutes les pages de NUQTA.MR en un seul endroit.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administration",
  description: "Panneau d'administration NUQTA.MR.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

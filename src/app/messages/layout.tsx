import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages",
  description: "Vos conversations avec les vendeurs sur NUQTA.MR.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

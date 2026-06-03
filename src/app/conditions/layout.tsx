import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description: "Conditions générales d'utilisation de SOUQ.MR — plateforme de mise en relation entre acheteurs et vendeurs mauritaniens.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

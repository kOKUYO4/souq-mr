import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contactez-nous",
  description: "Contactez l'équipe NUQTA.MR — support disponible 7j/7 par téléphone, email ou chat.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

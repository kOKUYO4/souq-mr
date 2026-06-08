import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Actualités & Blog",
  description: "Suivez les dernières actualités et conseils de NUQTA.MR.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

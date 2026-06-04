import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "FAQ — Questions fréquentes",
  description: "Trouvez les réponses aux questions les plus fréquentes sur SOUQ.MR.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Service Escrow",
  description: "Transactions sécurisées par séquestre — achetez et vendez en toute confiance sur SOUQ.MR.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

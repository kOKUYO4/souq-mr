import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Modes de paiement",
  description: "Tous les moyens de paiement acceptés sur SOUQ.MR.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

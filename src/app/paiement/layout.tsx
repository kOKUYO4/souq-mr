import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Modes de paiement",
  description: "Tous les moyens de paiement acceptés sur NUQTA.MR.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

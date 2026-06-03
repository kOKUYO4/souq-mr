import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité de SOUQ.MR — comment nous collectons, utilisons et protégeons vos données personnelles.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

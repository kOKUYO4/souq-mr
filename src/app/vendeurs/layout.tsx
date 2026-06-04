import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Annuaire des vendeurs",
  description: "Parcourez les vendeurs professionnels et particuliers sur SOUQ.MR.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

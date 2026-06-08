import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos de NUQTA.MR",
  description: "NUQTA.MR — La première marketplace mauritanienne. Notre mission, notre équipe, nos valeurs.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

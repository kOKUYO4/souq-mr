import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos de SOUQ.MR",
  description: "SOUQ.MR — La première marketplace mauritanienne. Notre mission, notre équipe, nos valeurs.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

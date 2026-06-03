import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "SOUQ.MR — Le grand souk numérique de Mauritanie | السوق الرقمي الكبير لموريتانيا",
  description:
    "La première marketplace mauritanienne. Achetez, vendez et négociez des voitures, téléphones, vêtements, beauté et plus à Nouakchott et en Mauritanie.",
  keywords: ["marketplace mauritanie", "annonces mauritanie", "vente nouakchott", "souq mauritanien"],
  openGraph: {
    title: "SOUQ.MR — Marketplace Mauritanien",
    description: "Le grand souk numérique de Mauritanie",
    type: "website",
    locale: "fr_MR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Noto+Sans+Arabic:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-cream font-body antialiased">
        <LanguageProvider>
          <FavoritesProvider>
            <Navbar />
            <main className="pt-16">{children}</main>
            <Footer />
          </FavoritesProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

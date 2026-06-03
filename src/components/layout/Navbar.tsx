"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search, Menu, X, Heart, MessageCircle,
  ChevronDown, Plus, User, LayoutDashboard,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import NotificationPanel from "@/components/social/NotificationPanel";
import { useLanguage } from "@/context/LanguageContext";
import { useFavorites } from "@/context/FavoritesContext";

export default function Navbar() {
  const { t, locale, setLocale, isRTL } = useLanguage();
  const { count: favCount } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/categories", label: t.nav.categories, hasDropdown: true },
    { href: "/annonces", label: isRTL ? "الإعلانات" : "Annonces" },
    { href: "/pro", label: isRTL ? "للتجار" : "Espace Pro" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-night-500/95 backdrop-blur-md shadow-night py-2" : "bg-night-500 py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`flex items-center justify-between gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo size="sm" />
          </Link>

          {/* Recherche desktop */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={t.nav.search}
                dir={isRTL ? "rtl" : "ltr"}
                className="w-full bg-night-600/60 border border-night-400/40 text-white placeholder-sand-400/60 rounded-xl px-4 py-2.5 pr-10 text-sm outline-none focus:border-sand-400/60 transition-all"
                onKeyDown={(e) => {
                  const val = (e.target as HTMLInputElement).value;
                  if (e.key === "Enter" && val) window.location.assign(`/recherche?q=${val}`);
                }}
              />
              <Search size={16} className={`absolute top-1/2 -translate-y-1/2 text-sand-400/60 ${isRTL ? "left-3" : "right-3"}`} />
            </div>
          </div>

          {/* Liens nav desktop */}
          <div className={`hidden md:flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1 px-3 py-2 text-sm text-sand-200 hover:text-sand-400 transition-colors rounded-lg hover:bg-night-600/50"
              >
                {link.label}
                {link.hasDropdown && <ChevronDown size={14} />}
              </Link>
            ))}
          </div>

          {/* Actions droite */}
          <div className={`flex items-center gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}>
            {/* Langue */}
            <button
              onClick={() => setLocale(locale === "fr" ? "ar" : "fr")}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sand-400/30 text-sand-300 text-xs hover:border-sand-400 hover:text-sand-400 transition-all"
            >
              <span className="text-base">{locale === "fr" ? "🇲🇷" : "🇫🇷"}</span>
              <span>{t.nav.language}</span>
            </button>

            {/* Notifications */}
            <NotificationPanel />

            {/* Favoris */}
            <Link href="/favoris" className="hidden sm:flex relative p-2 text-sand-300 hover:text-sand-400 transition-colors rounded-lg hover:bg-night-600/50">
              <Heart size={18} />
              {favCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 rounded-full text-[9px] font-bold text-night-500 flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                  {favCount}
                </span>
              )}
            </Link>

            {/* Messages */}
            <Link href="/messages" className="hidden sm:flex relative p-2 text-sand-300 hover:text-sand-400 transition-colors rounded-lg hover:bg-night-600/50">
              <MessageCircle size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-islamic-400 rounded-full"></span>
            </Link>

            {/* Dashboard */}
            <Link href="/tableau-de-bord" className="hidden md:flex p-2 text-sand-300 hover:text-sand-400 transition-colors rounded-lg hover:bg-night-600/50">
              <LayoutDashboard size={18} />
            </Link>

            {/* Vendre */}
            <Link href="/vendre" className="hidden sm:flex btn-gold text-sm py-2 px-4 gap-1.5">
              <Plus size={16} />
              {t.nav.sell}
            </Link>

            {/* Connexion */}
            <Link href="/connexion" className="hidden md:flex items-center gap-1.5 px-3 py-2 text-sm text-sand-300 hover:text-white border border-sand-400/20 rounded-xl hover:border-sand-400/50 transition-all">
              <User size={14} />
              {t.nav.login}
            </Link>

            {/* Menu mobile */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-sand-300 hover:text-white">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div className="md:hidden mt-3 pb-4 border-t border-night-400/30 pt-4 space-y-1 animate-fade-in">
            <div className="relative mb-3">
              <input
                type="text"
                placeholder={t.nav.search}
                dir={isRTL ? "rtl" : "ltr"}
                className="w-full bg-night-600/60 border border-night-400/40 text-white placeholder-sand-400/60 rounded-xl px-4 py-2.5 pr-10 text-sm outline-none"
              />
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-400/60" />
            </div>
            {[...navLinks, { href: "/tableau-de-bord", label: isRTL ? "لوحة التحكم" : "Dashboard" }, { href: "/favoris", label: isRTL ? "المفضلة" : "Favoris" }].map((link) => (
              <Link key={link.href} href={link.href}
                className="block px-3 py-2.5 text-sand-200 hover:text-sand-400 hover:bg-night-600/50 rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Link href="/vendre" className="btn-gold flex-1 text-sm py-2.5 justify-center"><Plus size={16} />{t.nav.sell}</Link>
              <Link href="/connexion" className="btn-night flex-1 text-sm py-2.5 justify-center">{t.nav.login}</Link>
            </div>
            <button onClick={() => setLocale(locale === "fr" ? "ar" : "fr")}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 border border-sand-400/30 text-sand-300 text-sm rounded-lg">
              {locale === "fr" ? "🇲🇷 العربية" : "🇫🇷 Français"}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

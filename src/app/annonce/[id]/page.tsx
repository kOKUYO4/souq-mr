"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Heart, Share2, MapPin, Eye, Clock, CheckCircle2, Phone,
  MessageCircle, Star, ChevronLeft, ChevronRight, Shield, Truck,
  Flag, ZoomIn, Tag,
} from "lucide-react";
import { listings, reviews, formatPrice, timeAgo } from "@/data/mockData";
import Badge from "@/components/ui/Badge";
import HagglingModal from "@/components/social/HagglingModal";
import ReviewCard from "@/components/social/ReviewCard";
import ReviewForm from "@/components/social/ReviewForm";
import StarRating from "@/components/social/StarRating";
import { useFavorites } from "@/context/FavoritesContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";

export default function AnnonceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isRTL, locale, t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imgIdx, setImgIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "attrs" | "seller">("desc");
  const [hagglingOpen, setHagglingOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [reported, setReported] = useState(false);
  const { success, warning } = useToast();

  const handleReport = async () => {
    if (reported) return;
    try {
      await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: listing.id, reason: "other" }),
      });
      setReported(true);
      warning(isRTL ? "تم الإبلاغ — سيراجع فريقنا خلال ساعة" : "Signalement envoyé — notre équipe examine sous 1h");
    } catch {
      warning(isRTL ? "تعذر الإرسال" : "Impossible d'envoyer le signalement");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = isRTL ? listing.titleAr : listing.title;
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const listing = listings.find((l) => l.id === id) || listings[0];
  const liked = isFavorite(listing.id);
  const sellerReviews = reviews.filter((r) => r.sellerId === listing.seller.id);

  const prevImg = () => setImgIdx((i) => Math.max(0, i - 1));
  const nextImg = () => setImgIdx((i) => Math.min(listing.images.length - 1, i + 1));

  /* Annonces similaires */
  const similar = listings.filter((l) => l.id !== listing.id && l.category === listing.category).slice(0, 3);

  return (
    <div className="min-h-screen bg-sand-50">
      {hagglingOpen && (
        <HagglingModal listing={listing} onClose={() => setHagglingOpen(false)} />
      )}

      {/* Lightbox image */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <img src={listing.images[imgIdx]} alt="" className="max-h-screen max-w-screen-lg object-contain" />
          <button onClick={(e) => { e.stopPropagation(); prevImg(); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20">
            <ChevronLeft size={24} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); nextImg(); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20">
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Fil d'ariane */}
        <div className={`flex items-center gap-2 text-sm text-night-400/60 mb-6 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
          <Link href="/" className="hover:text-sand-500 transition-colors">{isRTL ? "الرئيسية" : "Accueil"}</Link>
          <span>/</span>
          <Link href="/annonces" className="hover:text-sand-500 transition-colors">{isRTL ? "الإعلانات" : "Annonces"}</Link>
          <span>/</span>
          <Link href={`/categories/${listing.category}`} className="hover:text-sand-500 transition-colors capitalize">{listing.category}</Link>
          <span>/</span>
          <span className="text-night-500 truncate max-w-[180px]">{isRTL ? listing.titleAr : listing.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Colonne principale ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Galerie */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-card">
              <div className="relative h-72 sm:h-[420px] bg-sand-100 cursor-zoom-in" onClick={() => setLightboxOpen(true)}>
                <img
                  src={listing.images[imgIdx]}
                  alt={isRTL ? listing.titleAr : listing.title}
                  className="w-full h-full object-cover"
                />
                {/* Badges */}
                <div className={`absolute top-4 ${isRTL ? "right-4" : "left-4"} flex gap-2`}>
                  <Badge type={listing.condition === "new" ? "new" : "used"} size="md" />
                  {listing.featured && (
                    <span className="badge-night badge">⭐ {isRTL ? "مميز" : "Vedette"}</span>
                  )}
                </div>
                {/* Actions overlay */}
                <div className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} flex gap-2`}>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(listing.id); success(isFavorite(listing.id) ? (isRTL ? "تمت الإزالة من المفضلة" : "Retiré des favoris") : (isRTL ? "تمت الإضافة إلى المفضلة ❤️" : "Ajouté aux favoris ❤️")); }}
                    className="w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow transition-all hover:scale-110"
                  >
                    <Heart size={16} className={liked ? "fill-red-500 text-red-500" : "text-night-400"} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleShare(); }}
                    className="w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow transition-all hover:scale-110 relative">
                    {shareCopied ? <CheckCircle2 size={16} className="text-islamic-500" /> : <Share2 size={16} className="text-night-400" />}
                  </button>
                  <button className="w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow">
                    <ZoomIn size={16} className="text-night-400" />
                  </button>
                </div>
                {/* Nav images */}
                {listing.images.length > 1 && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); prevImg(); }} disabled={imgIdx === 0} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow disabled:opacity-30">
                      <ChevronLeft size={18} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); nextImg(); }} disabled={imgIdx === listing.images.length - 1} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow disabled:opacity-30">
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
                {/* Prix bottom */}
                <div className={`absolute bottom-4 ${isRTL ? "right-4" : "left-4"}`}>
                  <div className="px-3 py-1.5 rounded-xl font-bold text-white text-base"
                    style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.95), rgba(184,146,46,0.95))" }}>
                    {formatPrice(listing.price)} MRU
                    {listing.originalPrice && (
                      <span className="ml-2 text-white/60 line-through text-sm">{formatPrice(listing.originalPrice)}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Miniatures */}
              {listing.images.length > 1 && (
                <div className={`flex gap-2 p-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  {listing.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                        imgIdx === i ? "border-sand-400" : "border-transparent hover:border-sand-200"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Titre + infos */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <div className={`flex items-start justify-between gap-4 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className={isRTL ? "text-right flex-1" : "flex-1"}>
                  <h1 className={`text-xl font-bold text-night-500 mb-2 ${isRTL ? "font-arabic" : ""}`}>
                    {isRTL ? listing.titleAr : listing.title}
                  </h1>
                  <div className={`flex flex-wrap items-center gap-3 text-sm text-night-400/60 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <span className="flex items-center gap-1"><MapPin size={13} />{isRTL ? listing.locationAr : listing.location}</span>
                    <span className="flex items-center gap-1"><Clock size={13} />{timeAgo(listing.createdAt, locale)}</span>
                    <span className="flex items-center gap-1"><Eye size={13} />{listing.views} {t.listings.views}</span>
                  </div>
                </div>
                <div className={`${isRTL ? "text-left" : "text-right"} flex-shrink-0`}>
                  <div className="text-2xl font-bold price-tag">{formatPrice(listing.price)} MRU</div>
                  {listing.negotiable && <div className="mt-1"><Badge type="negotiate" size="sm" /></div>}
                </div>
              </div>

              <div className={`flex flex-wrap gap-2 mb-5 ${isRTL ? "flex-row-reverse" : ""}`}>
                {listing.cod && <Badge type="cod" size="md" />}
                {listing.negotiable && <Badge type="negotiate" size="md" />}
              </div>

              {/* Onglets */}
              <div className={`flex gap-1 border-b border-sand-100 mb-5 ${isRTL ? "flex-row-reverse" : ""}`}>
                {[
                  { key: "desc", fr: "Description", ar: "الوصف" },
                  { key: "attrs", fr: "Caractéristiques", ar: "المواصفات" },
                  { key: "seller", fr: "Vendeur", ar: "البائع" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                      activeTab === tab.key ? "border-sand-400 text-sand-500" : "border-transparent text-night-400/60 hover:text-night-500"
                    }`}
                  >
                    {isRTL ? tab.ar : tab.fr}
                  </button>
                ))}
              </div>

              {activeTab === "desc" && (
                <p className={`text-sm text-night-500/80 leading-relaxed ${isRTL ? "font-arabic text-right" : ""}`}>
                  {isRTL ? listing.descriptionAr : listing.description}
                </p>
              )}

              {activeTab === "attrs" && (
                <div className="grid grid-cols-2 gap-3">
                  {listing.attributes
                    ? Object.entries(listing.attributes).map(([key, val]) => (
                        <div key={key} className={`bg-sand-50 rounded-xl px-4 py-3 ${isRTL ? "text-right" : ""}`}>
                          <p className="text-xs text-night-400/60 capitalize mb-0.5">{key}</p>
                          <p className="text-sm font-semibold text-night-500">{val}</p>
                        </div>
                      ))
                    : <p className="text-sm text-night-400/60 col-span-2">{isRTL ? "لا توجد مواصفات" : "Aucune caractéristique"}</p>
                  }
                </div>
              )}

              {activeTab === "seller" && (
                <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <img src={listing.seller.avatar} alt="" className="w-14 h-14 rounded-full bg-sand-100" />
                  <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                    <p className="font-semibold text-night-500">{isRTL ? listing.seller.nameAr : listing.seller.name}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <StarRating value={Math.floor(listing.seller.rating)} size={13} />
                      <span className="text-night-400/60">({listing.seller.reviews} {isRTL ? "تقييم" : "avis"})</span>
                    </div>
                    <p className="text-xs text-night-400/50 mt-0.5">{listing.seller.listings} {isRTL ? "إعلان" : "annonces"}</p>
                  </div>
                  <Link href={`/profil/${listing.seller.id}`} className="btn-outline text-xs py-2 px-4 flex-shrink-0">
                    {isRTL ? "الملف الشخصي" : "Voir profil"}
                  </Link>
                </div>
              )}
            </div>

            {/* Avis sur le vendeur */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <button
                onClick={() => setReviewsOpen(!reviewsOpen)}
                className={`w-full flex items-center justify-between px-5 py-4 border-b border-sand-100 hover:bg-sand-50 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <h3 className="font-bold text-night-500 text-sm">
                    {isRTL ? "تقييمات البائع" : "Avis sur le vendeur"}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star size={13} className="text-sand-400 fill-sand-400" />
                    <span className="text-sm font-bold text-night-500">{listing.seller.rating}</span>
                    <span className="text-xs text-night-400/50">({sellerReviews.length})</span>
                  </div>
                </div>
                <ChevronRight size={16} className={`text-sand-400 transition-transform ${reviewsOpen ? "rotate-90" : ""} ${isRTL ? "rotate-180" : ""}`} />
              </button>

              {reviewsOpen && (
                <div className="p-5 space-y-4">
                  {sellerReviews.length > 0 ? (
                    sellerReviews.map((r) => <ReviewCard key={r.id} review={r} />)
                  ) : (
                    <p className="text-center text-sm text-night-400/60 py-4">
                      {isRTL ? "لا توجد تقييمات بعد" : "Pas encore d'avis"}
                    </p>
                  )}
                  <ReviewForm
                    sellerId={listing.seller.id}
                    listingId={listing.id}
                    sellerName={listing.seller.name}
                    sellerNameAr={listing.seller.nameAr}
                  />
                </div>
              )}
            </div>

            {/* Annonces similaires */}
            {similar.length > 0 && (
              <div>
                <h3 className={`font-bold text-night-500 mb-4 ${isRTL ? "text-right" : ""}`}>
                  {isRTL ? "إعلانات مشابهة" : "Annonces similaires"}
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  {similar.map((l) => (
                    <Link key={l.id} href={`/annonce/${l.id}`} className="listing-card block">
                      <img src={l.images[0]} alt="" className="w-full h-36 object-cover" />
                      <div className={`p-3 ${isRTL ? "text-right" : ""}`}>
                        <p className="text-sm font-semibold text-night-500 line-clamp-1">{isRTL ? l.titleAr : l.title}</p>
                        <p className="text-sm font-bold text-sand-500 mt-1">{formatPrice(l.price)} MRU</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Signalement */}
            <div className={`text-center ${isRTL ? "" : ""}`}>
              <button onClick={handleReport} disabled={reported}
                className={`inline-flex items-center gap-1.5 text-xs transition-colors ${reported ? "text-red-400 cursor-default" : "text-night-400/40 hover:text-red-400"}`}>
                <Flag size={11} />
                {reported ? (isRTL ? "تم الإبلاغ ✓" : "Signalé ✓") : (isRTL ? "الإبلاغ عن هذا الإعلان" : "Signaler cette annonce")}
              </button>
            </div>
          </div>

          {/* ── Sidebar contact ── */}
          <div className="space-y-4">
            {/* Contact */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <div className={`flex items-center gap-3 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className="relative flex-shrink-0">
                  <img src={listing.seller.avatar} alt="" className="w-12 h-12 rounded-full bg-sand-100" />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-islamic-400 border-2 border-white" />
                </div>
                <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                  <p className="font-semibold text-night-500 text-sm">{isRTL ? listing.seller.nameAr : listing.seller.name}</p>
                  {listing.seller.badge !== "regular" && (
                    <div className={`flex items-center gap-0.5 mt-0.5 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <CheckCircle2 size={11} className="text-islamic-400" />
                      <span className="text-xs text-islamic-400">
                        {listing.seller.badge === "pro" ? t.trust.pro : t.trust.verified}
                      </span>
                    </div>
                  )}
                  <p className="text-[10px] text-night-400/50 mt-0.5">
                    {isRTL ? `يرد عادةً خلال ${listing.seller.responseTime}` : `Répond en ${listing.seller.responseTime}`}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <a href={`tel:${listing.seller.phone}`} className="w-full btn-night py-3 text-sm flex items-center justify-center gap-2">
                  <Phone size={16} />
                  {isRTL ? "اتصل الآن" : "Appeler maintenant"}
                </a>
                <Link href={`/messages?seller=${listing.seller.id}&listing=${listing.id}`} className="w-full btn-outline py-3 text-sm flex items-center justify-center gap-2">
                  <MessageCircle size={16} />
                  {isRTL ? "رسالة" : "Envoyer un message"}
                </Link>
              </div>

              {/* Négociation */}
              {listing.negotiable && (
                <div className="border-t border-sand-100 pt-4">
                  <p className="text-xs text-night-400/60 mb-2 flex items-center gap-1">
                    🤝 {isRTL ? "التفاوض متاح على هذا الإعلان" : "La négociation est possible"}
                  </p>
                  <button
                    onClick={() => setHagglingOpen(true)}
                    className="w-full py-3 rounded-xl border-2 border-sand-400 text-sand-500 text-sm font-bold hover:bg-sand-50 transition-colors"
                  >
                    💬 {t.haggle.makeOffer}
                  </button>
                </div>
              )}
            </div>

            {/* Prix */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <div className={`flex items-center justify-between mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <span className="text-xs text-night-400/60">{isRTL ? "السعر" : "Prix"}</span>
                {listing.negotiable && <Badge type="negotiate" />}
              </div>
              <p className="text-3xl font-display font-bold price-tag">{formatPrice(listing.price)}</p>
              <p className="text-sm text-night-400/60 mt-0.5">MRU (Ouguiya mauritanien)</p>
              {listing.originalPrice && (
                <p className="text-sm text-night-400/40 line-through mt-1">{formatPrice(listing.originalPrice)} MRU</p>
              )}
            </div>

            {/* Livraison */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <h4 className={`font-semibold text-night-500 mb-3 text-sm ${isRTL ? "text-right" : ""}`}>
                {isRTL ? "التوصيل والاستلام" : "Livraison & Remise"}
              </h4>
              {[
                { icon: Truck, fr: "Livraison dans votre quartier", ar: "توصيل للحي" },
                { icon: MapPin, fr: "Remise en main propre sécurisée", ar: "تسليم مباشر آمن" },
                { icon: Shield, fr: "Escrow disponible > 50 000 MRU", ar: "ضمان مالي > 50,000 أوقية" },
              ].map(({ icon: Icon, fr, ar }, i) => (
                <div key={i} className={`flex items-center gap-2.5 text-xs text-night-400/70 mb-2 last:mb-0 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Icon size={14} className="text-sand-400 flex-shrink-0" />
                  {isRTL ? ar : fr}
                </div>
              ))}
            </div>

            {/* Guide sécurité */}
            <div className="bg-islamic-50 border border-islamic-100 rounded-2xl p-4">
              <div className={`flex items-center gap-2 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Shield size={14} className="text-islamic-400" />
                <span className="text-xs font-bold text-islamic-500">
                  {isRTL ? "نصائح الأمان" : "Guide anti-arnaque"}
                </span>
              </div>
              <ul className={`space-y-1 text-xs text-islamic-600/70 ${isRTL ? "text-right" : ""}`}>
                {(isRTL
                  ? ["لا تدفع قبل الاستلام", "التحقق من هوية البائع", "التقِ في مكان عام"]
                  : ["Ne payez qu'à la réception", "Vérifiez l'identité du vendeur", "Rencontrez-vous en public"]
                ).map((tip, i) => (
                  <li key={i} className={`flex items-start gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <CheckCircle2 size={11} className="text-islamic-400 flex-shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Annonces similaires */}
        {(() => {
          const related = listings
            .filter((l) => l.id !== listing.id && l.category === listing.category)
            .slice(0, 4);
          if (!related.length) return null;
          return (
            <div className="mt-12">
              <div className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
                <h2 className={`text-xl font-bold text-night-500 ${isRTL ? "font-arabic" : "font-display"}`}>
                  {isRTL ? "إعلانات مشابهة" : "Annonces similaires"}
                </h2>
                <Link
                  href={`/categories/${listing.category}`}
                  className={`text-sm text-sand-500 font-semibold hover:underline flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  {isRTL ? "عرض الكل" : "Voir tout"}
                  <ChevronRight size={14} className={isRTL ? "rotate-180" : ""} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/annonce/${rel.id}`}
                    className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all overflow-hidden"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={rel.images[0]}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {rel.featured && (
                        <span className="absolute top-2 left-2 text-[10px] font-bold text-night-500 px-2 py-0.5 rounded-full"
                          style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                          {isRTL ? "مميز" : "Vedette"}
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className={`text-sm font-semibold text-night-500 line-clamp-2 mb-1 ${isRTL ? "font-arabic text-right" : ""}`}>
                        {isRTL ? rel.titleAr : rel.title}
                      </p>
                      <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                        <span className="text-sm font-bold text-sand-500">{formatPrice(rel.price)} MRU</span>
                        <div className={`flex items-center gap-1 text-xs text-night-400/50 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <Eye size={11} />
                          {rel.views}
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <MapPin size={10} className="text-sand-400 flex-shrink-0" />
                        <span className="text-[11px] text-night-400/60 truncate">
                          {isRTL ? rel.locationAr : rel.location}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { recordView } from "@/components/home/RecentlyViewed";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Heart, Share2, MapPin, Eye, Clock, CheckCircle2, Phone,
  MessageCircle, Star, ChevronLeft, ChevronRight, Shield, Truck,
  Flag, ZoomIn,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import HagglingModal from "@/components/social/HagglingModal";
import ReviewCard from "@/components/social/ReviewCard";
import ReviewForm from "@/components/social/ReviewForm";
import StarRating from "@/components/social/StarRating";
import { useFavorites } from "@/context/FavoritesContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
type Listing = {
  id: string;
  title: string;
  titleAr: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory: string;
  location: string;
  locationAr: string;
  images: string[];
  condition: "new" | "used" | "tbh";
  negotiable: boolean;
  cod: boolean;
  featured: boolean;
  views: number;
  createdAt: string;
  description: string;
  descriptionAr: string;
  attributes?: Record<string, string>;
  seller: {
    id: string;
    name: string;
    nameAr: string;
    avatar: string;
    badge: "verified" | "pro" | "regular";
    rating: number;
    reviews: number;
    listings: number;
    joinedAt: string;
    phone: string;
    responseTime?: string;
  };
};

const formatPrice = (p: number) => p.toLocaleString("fr-FR");
const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  return `Il y a ${days} jours`;
};

function PriceAlertCard({ listing, isRTL, onSuccess }: { listing: Listing; isRTL: boolean; onSuccess: (msg: string) => void }) {
  const [alertPrice, setAlertPrice] = useState("");
  const [alertSet, setAlertSet] = useState(false);
  const handleSet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertPrice) return;
    setAlertSet(true);
    onSuccess(isRTL ? `سيتم إخطارك عند ${parseInt(alertPrice).toLocaleString()} أوقية 🔔` : `Alerte activée à ${parseInt(alertPrice).toLocaleString()} MRU 🔔`);
  };
  return (
    <div className="bg-sand-50 border border-sand-200 rounded-2xl p-4">
      <div className={`flex items-center gap-2 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
        <span className="text-base">🔔</span>
        <span className="text-xs font-bold text-night-500">{isRTL ? "تنبيه السعر" : "Alerte prix"}</span>
      </div>
      {alertSet ? (
        <p className={`text-xs text-islamic-500 font-medium ${isRTL ? "text-right" : ""}`}>
          ✓ {isRTL ? "سيتم إخطارك عند انخفاض السعر" : "Vous serez notifié si le prix baisse"}
        </p>
      ) : (
        <form onSubmit={handleSet} className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <input type="number" value={alertPrice} onChange={(e) => setAlertPrice(e.target.value)}
            placeholder={isRTL ? "السعر المستهدف" : "Prix cible (MRU)"}
            className="flex-1 text-xs py-2 px-3 bg-white border border-sand-200 rounded-xl text-night-500 outline-none focus:border-sand-400"
            dir="ltr" />
          <button type="submit" className="px-3 py-2 rounded-xl text-[10px] font-bold text-night-500 whitespace-nowrap flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
            {isRTL ? "تفعيل" : "Activer"}
          </button>
        </form>
      )}
    </div>
  );
}

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
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [listing, setListing] = useState<Listing | null>(null);
  const [sellerReviews, setSellerReviews] = useState<{ id: string; sellerId: string; rating: number; comment: string; buyerName: string; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const touchStartX = useRef(0);
  const { success, warning } = useToast();

  const handleReport = async () => {
    if (reported || !listing || !reportReason) return;
    try {
      await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listing.id, reason: reportReason }),
      });
      setReported(true);
      setReportModalOpen(false);
      warning(isRTL ? "تم الإبلاغ — سيراجع فريقنا خلال ساعة" : "Signalement envoyé — notre équipe examine sous 1h");
    } catch {
      warning(isRTL ? "تعذر الإرسال" : "Impossible d'envoyer le signalement");
    }
  };

  const handleShare = async () => {
    if (!listing) return;
    const url = window.location.href;
    const text = isRTL
      ? `${listing.titleAr} — ${formatPrice(listing.price)}`
      : `${listing.title} — ${formatPrice(listing.price)}`;
    if (navigator.share) {
      await navigator.share({ title: isRTL ? listing.titleAr : listing.title, text, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
      success(isRTL ? "تم نسخ الرابط" : "Lien copié !");
    }
  };

  useEffect(() => {
    setLoading(true);
    setFetchError(null);
    fetch(`/api/listings/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.error) { setFetchError(json.error); return; }
        setListing(json.data ?? json);
      })
      .catch(() => setFetchError("Impossible de charger l'annonce"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (listing?.id) { recordView(listing.id); }
  }, [listing?.id]);

  const liked = listing ? isFavorite(listing.id) : false;

  const prevImg = () => setImgIdx((i) => Math.max(0, i - 1));
  const nextImg = () => setImgIdx((i) => listing ? Math.min(listing.images.length - 1, i + 1) : i);

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="text-night-400/60 text-sm">{isRTL ? "جاري التحميل..." : "Chargement..."}</div>
      </div>
    );
  }

  if (fetchError || !listing) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{fetchError || (isRTL ? "الإعلان غير موجود" : "Annonce introuvable")}</p>
          <Link href="/annonces" className="btn-gold px-6 py-2">{isRTL ? "العودة للإعلانات" : "Retour aux annonces"}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {hagglingOpen && (
        <HagglingModal listing={listing} onClose={() => setHagglingOpen(false)} />
      )}

      {/* Lightbox image */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
          onKeyDown={(e) => { if (e.key === "ArrowLeft") prevImg(); if (e.key === "ArrowRight") nextImg(); if (e.key === "Escape") setLightboxOpen(false); }}
          tabIndex={0} autoFocus>
          <img src={listing.images[imgIdx]} alt="" className="max-h-screen max-w-screen-lg object-contain" />
          <span className="absolute top-4 right-4 text-white/50 text-sm">{imgIdx + 1} / {listing.images.length}</span>
          {listing.images.length > 1 && <>
            <button onClick={(e) => { e.stopPropagation(); prevImg(); }} disabled={imgIdx === 0} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-20">
              <ChevronLeft size={24} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); nextImg(); }} disabled={imgIdx === listing.images.length - 1} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-20">
              <ChevronRight size={24} />
            </button>
          </>}
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
              <div className="relative h-72 sm:h-[420px] bg-sand-100 cursor-zoom-in"
                onClick={() => setLightboxOpen(true)}
                onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                onTouchEnd={(e) => {
                  const dx = e.changedTouches[0].clientX - touchStartX.current;
                  if (Math.abs(dx) > 50) dx < 0 ? nextImg() : prevImg();
                }}
              >
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
                  {listing && (
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`${isRTL ? listing.titleAr : listing.title} — ${formatPrice(listing.price)} MRU\n${typeof window !== "undefined" ? window.location.href : ""}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow transition-all hover:scale-110"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </a>
                  )}
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
                      <span className="ml-2 text-white/60 line-through text-sm">{formatPrice(listing.originalPrice!)}</span>
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
                    <span className="flex items-center gap-1"><Clock size={13} />{timeAgo(listing.createdAt)}</span>
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
                  <div className="flex gap-2 flex-shrink-0">
                    {listing.seller.badge === "pro" && (
                      <Link href={`/boutique/${listing.seller.id}`}
                        className="text-xs py-2 px-3 rounded-xl font-semibold text-night-500"
                        style={{ background: "linear-gradient(135deg, #C9A84C30, #B8922E20)", border: "1px solid #C9A84C50" }}>
                        🏪 {isRTL ? "البوتيك" : "Boutique"}
                      </Link>
                    )}
                    <Link href={`/profil/${listing.seller.id}`} className="btn-outline text-xs py-2 px-4">
                      {isRTL ? "الملف الشخصي" : "Voir profil"}
                    </Link>
                  </div>
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

            {/* Signalement */}
            <div className="text-center">
              <button onClick={() => !reported && setReportModalOpen(true)} disabled={reported}
                className={`inline-flex items-center gap-1.5 text-xs transition-colors ${reported ? "text-red-400 cursor-default" : "text-night-400/40 hover:text-red-400"}`}>
                <Flag size={11} />
                {reported ? (isRTL ? "تم الإبلاغ ✓" : "Signalé ✓") : (isRTL ? "الإبلاغ عن هذا الإعلان" : "Signaler cette annonce")}
              </button>
            </div>

            {/* Modal signalement */}
            {reportModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setReportModalOpen(false)}>
                <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
                  <h3 className={`font-bold text-night-500 mb-4 ${isRTL ? "text-right font-arabic" : ""}`}>
                    {isRTL ? "الإبلاغ عن الإعلان" : "Signaler cette annonce"}
                  </h3>
                  <div className="space-y-2 mb-5">
                    {[
                      { fr: "Annonce frauduleuse", ar: "إعلان احتيالي", value: "fraud" },
                      { fr: "Prix incorrect", ar: "سعر خاطئ", value: "wrong_price" },
                      { fr: "Contenu inapproprié", ar: "محتوى غير لائق", value: "inappropriate" },
                      { fr: "Autre", ar: "أخرى", value: "other" },
                    ].map((r) => (
                      <label key={r.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${reportReason === r.value ? "border-sand-400 bg-sand-50" : "border-sand-100 hover:border-sand-200"} ${isRTL ? "flex-row-reverse" : ""}`}>
                        <input type="radio" name="reason" value={r.value} checked={reportReason === r.value} onChange={() => setReportReason(r.value)} className="sr-only" />
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${reportReason === r.value ? "border-sand-400" : "border-sand-200"}`}>
                          {reportReason === r.value && <div className="w-2 h-2 rounded-full bg-sand-400" />}
                        </div>
                        <span className={`text-sm text-night-500 ${isRTL ? "font-arabic" : ""}`}>
                          {isRTL ? r.ar : r.fr}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <button onClick={() => setReportModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-sand-200 text-sm text-night-400 hover:bg-sand-50 transition-colors">
                      {isRTL ? "إلغاء" : "Annuler"}
                    </button>
                    <button onClick={handleReport} disabled={!reportReason}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-40"
                      style={{ background: reportReason ? "#ef4444" : "#e5e7eb" }}>
                      {isRTL ? "إرسال البلاغ" : "Envoyer"}
                    </button>
                  </div>
                </div>
              </div>
            )}
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
                <a
                  href={`https://wa.me/${listing.seller.phone.replace(/\s+/g, "").replace("+", "")}?text=${encodeURIComponent((isRTL ? `مرحباً، أنا مهتم بـ: ${listing.titleAr}` : `Bonjour, je suis intéressé par : ${listing.title}`) + " — " + (typeof window !== "undefined" ? window.location.href : ""))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                  style={{ background: "#25D366", color: "white" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
                <Link href={`/messages?listing_id=${listing.id}&seller_id=${listing.seller.id}`} className="w-full btn-outline py-3 text-sm flex items-center justify-center gap-2">
                  <MessageCircle size={16} />
                  {isRTL ? "رسالة داخلية" : "Message interne"}
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
                <p className="text-sm text-night-400/40 line-through mt-1">{formatPrice(listing.originalPrice!)} MRU</p>
              )}
            </div>

            {/* Localisation */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-card">
              <div className="h-28 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #E8F0F5 0%, #D4E4EE 100%)" }}>
                {/* Fake map tiles */}
                <div className="absolute inset-0 opacity-30"
                  style={{ backgroundImage: "repeating-linear-gradient(0deg, #B8CCd8 0px, transparent 1px, transparent 40px, #B8CCd8 40px), repeating-linear-gradient(90deg, #B8CCd8 0px, transparent 1px, transparent 40px, #B8CCd8 40px)" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                      style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                      <MapPin size={16} className="text-night-500" />
                    </div>
                    <div className="w-2 h-2 rounded-full bg-sand-400/50" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 text-[10px] text-night-400/40">© NUQTA.MR Maps</div>
              </div>
              <div className={`px-4 py-3 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <MapPin size={14} className="text-sand-400 flex-shrink-0" />
                <span className="text-sm text-night-500 font-medium">{isRTL ? listing.locationAr : listing.location}</span>
              </div>
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

            {/* Alerte prix */}
            {listing.negotiable && (
              <PriceAlertCard listing={listing} isRTL={isRTL} onSuccess={(msg) => success(msg)} />
            )}

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
          const related: Listing[] = [];
          if (!related.length) return null;
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

      {/* Sticky mobile CTA */}
      <div className="sm:hidden fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-sand-100 px-4 py-3 safe-area-inset-bottom"
        style={{ boxShadow: "0 -4px 16px rgba(27,42,74,0.08)" }}>
        <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <a href={`tel:${listing.seller.phone}`}
            className="w-12 h-12 rounded-xl bg-sand-50 border border-sand-200 flex items-center justify-center flex-shrink-0">
            <Phone size={18} className="text-night-400" />
          </a>
          <a href={`https://wa.me/${listing.seller.phone.replace(/\s+/g, "").replace("+", "")}`}
            target="_blank" rel="noopener noreferrer"
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#25D366" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
          {listing.negotiable ? (
            <button onClick={() => setHagglingOpen(true)}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-night-500"
              style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
              💬 {isRTL ? "فاوض" : "Négocier"}
            </button>
          ) : (
            <Link href={`/messages?listing_id=${listing.id}&seller_id=${listing.seller.id}`}
              className="flex-1 py-3 rounded-xl text-sm font-bold bg-night-500 text-white flex items-center justify-center gap-2">
              <MessageCircle size={16} />
              {isRTL ? "تواصل" : "Contacter"}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

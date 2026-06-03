"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Heart, Share2, MapPin, Eye, Clock, CheckCircle2, Phone,
  MessageCircle, Star, ChevronLeft, ChevronRight, Shield, Truck, ArrowLeft
} from "lucide-react";
import { listings, formatPrice, timeAgo } from "@/data/mockData";
import Badge from "@/components/ui/Badge";
import { useLanguage } from "@/context/LanguageContext";

export default function AnnonceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isRTL, locale, t } = useLanguage();
  const [liked, setLiked] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [offer, setOffer] = useState("");
  const [activeTab, setActiveTab] = useState<"desc" | "seller">("desc");

  const listing = listings.find((l) => l.id === id) || listings[0];

  const prevImg = () => setImgIdx((i) => Math.max(0, i - 1));
  const nextImg = () => setImgIdx((i) => Math.min(listing.images.length - 1, i + 1));

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Fil d'ariane */}
        <div className={`flex items-center gap-2 text-sm text-night-400/60 mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Link href="/" className="hover:text-sand-500 transition-colors">
            {isRTL ? "الرئيسية" : "Accueil"}
          </Link>
          <span>/</span>
          <Link href="/annonces" className="hover:text-sand-500 transition-colors">
            {isRTL ? "الإعلانات" : "Annonces"}
          </Link>
          <span>/</span>
          <span className="text-night-500 truncate max-w-[200px]">
            {isRTL ? listing.titleAr : listing.title}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galerie images */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-card">
              <div className="relative h-72 sm:h-96 bg-sand-100">
                <img
                  src={listing.images[imgIdx]}
                  alt={isRTL ? listing.titleAr : listing.title}
                  className="w-full h-full object-cover"
                />
                {listing.images.length > 1 && (
                  <>
                    <button onClick={prevImg} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow">
                      <ChevronLeft size={18} />
                    </button>
                    <button onClick={nextImg} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow">
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
                {/* Badges */}
                <div className={`absolute top-4 ${isRTL ? "right-4" : "left-4"} flex gap-2`}>
                  <Badge type={listing.condition === "new" ? "new" : "used"} size="md" />
                  {listing.featured && (
                    <span className="badge-night badge text-xs">⭐ {isRTL ? "مميز" : "Vedette"}</span>
                  )}
                </div>
                {/* Actions */}
                <div className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} flex gap-2`}>
                  <button
                    onClick={() => setLiked(!liked)}
                    className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center"
                  >
                    <Heart size={16} className={liked ? "fill-red-500 text-red-500" : "text-night-400"} />
                  </button>
                  <button className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center">
                    <Share2 size={16} className="text-night-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Titre + prix */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <div className={`flex items-start justify-between gap-4 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className={isRTL ? "text-right" : ""}>
                  <h1 className={`text-xl font-bold text-night-500 mb-2 ${isRTL ? "font-arabic" : ""}`}>
                    {isRTL ? listing.titleAr : listing.title}
                  </h1>
                  <div className={`flex items-center gap-3 text-sm text-night-400/60 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <span className="flex items-center gap-1">
                      <MapPin size={13} />
                      {isRTL ? listing.locationAr : listing.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      {timeAgo(listing.createdAt, locale)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={13} />
                      {listing.views} {t.listings.views}
                    </span>
                  </div>
                </div>
                <div className={isRTL ? "text-left" : "text-right"}>
                  <div className="text-2xl font-bold price-tag">
                    {formatPrice(listing.price)} MRU
                  </div>
                  {listing.originalPrice && (
                    <div className="text-sm text-night-400/50 line-through">
                      {formatPrice(listing.originalPrice)} MRU
                    </div>
                  )}
                  {listing.negotiable && (
                    <div className="mt-1">
                      <Badge type="negotiate" size="sm" />
                    </div>
                  )}
                </div>
              </div>

              <div className={`flex flex-wrap gap-2 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                {listing.cod && <Badge type="cod" size="md" />}
                {listing.negotiable && <Badge type="negotiate" size="md" />}
              </div>

              {/* Onglets description/vendeur */}
              <div className={`flex gap-1 border-b border-sand-100 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                {[
                  { key: "desc", labelFr: "Description", labelAr: "الوصف" },
                  { key: "seller", labelFr: "Vendeur", labelAr: "البائع" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as "desc" | "seller")}
                    className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                      activeTab === tab.key
                        ? "border-sand-400 text-sand-500"
                        : "border-transparent text-night-400/60 hover:text-night-500"
                    }`}
                  >
                    {isRTL ? tab.labelAr : tab.labelFr}
                  </button>
                ))}
              </div>

              {activeTab === "desc" ? (
                <p className={`text-sm text-night-500/80 leading-relaxed ${isRTL ? "font-arabic text-right" : ""}`}>
                  {isRTL ? listing.descriptionAr : listing.description}
                </p>
              ) : (
                <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <img src={listing.seller.avatar} alt="" className="w-14 h-14 rounded-full bg-sand-100" />
                  <div className={isRTL ? "text-right" : ""}>
                    <div className="font-semibold text-night-500">{isRTL ? listing.seller.nameAr : listing.seller.name}</div>
                    <div className="flex items-center gap-1 text-sm text-night-400/60">
                      <Star size={12} className="text-sand-400 fill-sand-400" />
                      <span>{listing.seller.rating}</span>
                      <span>({listing.seller.reviews} avis)</span>
                    </div>
                    <div className="text-xs text-night-400/50 mt-0.5">
                      {listing.seller.listings} {isRTL ? "إعلان" : "annonces"}
                    </div>
                  </div>
                  <Link href={`/profil/${listing.seller.id}`} className="ml-auto btn-outline text-xs py-2 px-4">
                    {isRTL ? "عرض الملف" : "Voir profil"}
                  </Link>
                </div>
              )}
            </div>

            {/* Guide sécurité */}
            <div className="bg-sand-50 border border-sand-200 rounded-2xl p-5">
              <div className={`flex items-center gap-2 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Shield size={16} className="text-islamic-400" />
                <h4 className="text-sm font-semibold text-night-500">
                  {isRTL ? "نصائح الأمان" : "Guide anti-arnaque"}
                </h4>
              </div>
              <ul className={`space-y-1.5 text-xs text-night-400/70 ${isRTL ? "text-right" : ""}`}>
                {(isRTL
                  ? ["لا تدفع قبل استلام البضاعة", "تأكد من هوية البائع", "التقِ في مكان عام وآمن", "استخدم نظام الضمان للمبالغ الكبيرة"]
                  : ["Ne payez jamais avant de recevoir le produit", "Vérifiez l'identité du vendeur", "Rencontrez-vous dans un lieu public sécurisé", "Utilisez l'escrow pour les grandes sommes"]
                ).map((tip, i) => (
                  <li key={i} className={`flex items-start gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <CheckCircle2 size={12} className="text-islamic-400 flex-shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar contact */}
          <div className="space-y-4">
            {/* Carte vendeur */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <h3 className={`font-semibold text-night-500 mb-4 ${isRTL ? "text-right" : ""}`}>
                {isRTL ? "تواصل مع البائع" : "Contacter le vendeur"}
              </h3>
              <div className={`flex items-center gap-3 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <img src={listing.seller.avatar} alt="" className="w-12 h-12 rounded-full bg-sand-100" />
                <div className={isRTL ? "text-right" : ""}>
                  <p className="font-semibold text-night-500 text-sm">
                    {isRTL ? listing.seller.nameAr : listing.seller.name}
                  </p>
                  {listing.seller.badge !== "regular" && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <CheckCircle2 size={11} className="text-islamic-400" />
                      <span className="text-xs text-islamic-400">
                        {listing.seller.badge === "pro" ? t.trust.pro : t.trust.verified}
                      </span>
                    </div>
                  )}
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

              {/* Système négociation */}
              {listing.negotiable && (
                <div className="border-t border-sand-100 pt-4">
                  <p className="text-xs font-semibold text-night-500 mb-2 flex items-center gap-1.5">
                    🤝 {t.haggle.makeOffer}
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder={t.haggle.yourOffer}
                      value={offer}
                      onChange={(e) => setOffer(e.target.value)}
                      className="input-field text-sm py-2"
                    />
                    <button className="btn-gold py-2 px-4 text-xs whitespace-nowrap">
                      {isRTL ? "أرسل" : "OK"}
                    </button>
                  </div>
                  <button className="w-full mt-2 py-2.5 text-xs font-bold text-sand-500 border border-sand-300 rounded-xl hover:bg-sand-50 transition-colors">
                    🤝 {t.haggle.askLastPrice}
                  </button>
                </div>
              )}
            </div>

            {/* Livraison */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <h4 className={`font-semibold text-night-500 mb-3 text-sm ${isRTL ? "text-right" : ""}`}>
                {isRTL ? "التوصيل" : "Livraison"}
              </h4>
              <div className="space-y-2.5">
                {[
                  { icon: Truck, textFr: "Livraison dans votre quartier disponible", textAr: "توصيل للحي متوفر" },
                  { icon: MapPin, textFr: "Remise en main propre — lieu sécurisé", textAr: "تسليم مباشر — مكان آمن" },
                ].map(({ icon: Icon, textFr, textAr }, i) => (
                  <div key={i} className={`flex items-center gap-2.5 text-xs text-night-400/70 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Icon size={14} className="text-sand-400 flex-shrink-0" />
                    {isRTL ? textAr : textFr}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

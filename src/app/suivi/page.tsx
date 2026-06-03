"use client";

import { useState } from "react";
import { Search, MapPin, CheckCircle2, Clock, Truck, Package, Phone } from "lucide-react";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";

type OrderStatus = "confirmed" | "preparing" | "picked_up" | "en_route" | "delivered";

const demoOrder = {
  id: "CMD-2025-7842",
  listing: { title: "iPhone 15 Pro Max 256GB", titleAr: "آيفون 15 برو ماكس 256 جيجا", price: 190000, image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400" },
  seller: { name: "Sidi Ould Vall", nameAr: "سيدي ولد فال", phone: "+222 36 12 34 56", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SidiVall" },
  status: "en_route" as OrderStatus,
  estimatedTime: "35 min",
  driver: { name: "Moctar", nameAr: "مختار", phone: "+222 22 45 67 89" },
  steps: [
    { key: "confirmed", fr: "Commande confirmée", ar: "تأكيد الطلب", time: "14:12" },
    { key: "preparing", fr: "Préparation en cours", ar: "جارٍ التحضير", time: "14:18" },
    { key: "picked_up", fr: "Récupéré par le livreur", ar: "استلمه السائق", time: "14:35" },
    { key: "en_route", fr: "En route vers vous", ar: "في الطريق إليك", time: "14:47" },
    { key: "delivered", fr: "Livré", ar: "تم التسليم", time: null },
  ] as const,
};

const statusOrder: OrderStatus[] = ["confirmed", "preparing", "picked_up", "en_route", "delivered"];

export default function SuiviPage() {
  const { isRTL, locale } = useLanguage();
  const { success } = useToast();
  const [trackingId, setTrackingId] = useState("");
  const [order, setOrder] = useState<typeof demoOrder | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setOrder(demoOrder);
  };

  const currentIdx = order ? statusOrder.indexOf(order.status) : -1;

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="relative py-12 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <IslamicPattern opacity={0.05} />
        <div className={`relative max-w-2xl mx-auto px-4 sm:px-6 text-center ${isRTL ? "font-arabic" : ""}`}>
          <div className={`flex items-center justify-center gap-2 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Truck size={20} className="text-sand-400" />
            <h1 className="text-2xl font-display font-bold text-white">
              {isRTL ? "تتبع طلبك" : "Suivi de commande"}
            </h1>
          </div>
          <p className="text-sand-300/70 text-sm">
            {isRTL ? "أدخل رقم الطلب لمتابعة توصيلك في الوقت الفعلي" : "Entrez votre numéro de commande pour suivre votre livraison en temps réel"}
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Search form */}
        <form onSubmit={handleTrack} className={`flex gap-3 mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className="relative flex-1">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder={isRTL ? "CMD-2025-XXXX أو رقم الطلب" : "CMD-2025-XXXX ou numéro de commande"}
              dir={isRTL ? "rtl" : "ltr"}
              className="w-full input-field py-3.5 pl-10 pr-4"
            />
            <Search size={16} className={`absolute top-1/2 -translate-y-1/2 text-sand-300 ${isRTL ? "right-3" : "left-3"}`} />
          </div>
          <button type="submit" disabled={loading}
            className="btn-gold py-3.5 px-6 text-sm flex-shrink-0">
            {loading ? (
              <span className="w-4 h-4 border-2 border-night-500/40 border-t-night-500 rounded-full animate-spin" />
            ) : (isRTL ? "تتبع" : "Suivre")}
          </button>
        </form>

        {/* Demo hint */}
        <p className={`text-xs text-night-400/50 -mt-5 mb-8 ${isRTL ? "font-arabic text-right" : ""}`}>
          {isRTL ? "للتجربة: اكتب أي رقم واضغط تتبع" : "Pour tester : tapez n'importe quoi et cliquez Suivre"}
        </p>

        {order && (
          <div className="space-y-4 animate-fade-in">
            {/* Article */}
            <div className={`flex items-center gap-4 bg-white rounded-2xl p-4 shadow-card ${isRTL ? "flex-row-reverse" : ""}`}>
              <img src={order.listing.image} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                <p className={`font-semibold text-night-500 text-sm ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? order.listing.titleAr : order.listing.title}
                </p>
                <p className="text-xs text-sand-500 font-bold mt-0.5">{order.listing.price.toLocaleString()} MRU</p>
                <p className="text-xs text-night-400/50 mt-0.5">{order.id}</p>
              </div>
              <div className="flex-shrink-0 text-center">
                <div className="px-3 py-1.5 rounded-xl text-xs font-bold text-night-500"
                  style={{ background: "linear-gradient(135deg, #C9A84C30, #B8922E20)", border: "1px solid #C9A84C50" }}>
                  <Clock size={11} className="inline-block mr-1" />
                  {order.estimatedTime}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <div className="space-y-4">
                {order.steps.map((step, i) => {
                  const isDone = i <= currentIdx;
                  const isCurrent = i === currentIdx;
                  return (
                    <div key={step.key} className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                      {/* Dot */}
                      <div className="relative flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isDone ? "bg-islamic-400" : "bg-sand-100"}`}>
                          <CheckCircle2 size={16} className={isDone ? "text-white" : "text-sand-300"} />
                        </div>
                        {i < order.steps.length - 1 && (
                          <div className={`absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-6 ${isDone && i < currentIdx ? "bg-islamic-400" : "bg-sand-100"}`} />
                        )}
                      </div>
                      <div className={`flex-1 pb-4 ${isRTL ? "text-right" : ""}`}>
                        <p className={`text-sm font-semibold ${isDone ? "text-night-500" : "text-night-400/40"} ${isRTL ? "font-arabic" : ""}`}>
                          {isRTL ? step.ar : step.fr}
                          {isCurrent && (
                            <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                              {isRTL ? "الحالة الآن" : "En cours"}
                            </span>
                          )}
                        </p>
                        {step.time && isDone && (
                          <p className="text-xs text-night-400/50 mt-0.5">{step.time}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Livreur */}
            <div className="bg-white rounded-2xl p-4 shadow-card">
              <p className={`text-xs font-semibold text-night-400/60 mb-3 ${isRTL ? "font-arabic text-right" : ""}`}>
                {isRTL ? "السائق" : "Livreur"}
              </p>
              <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="w-10 h-10 rounded-full bg-sand-100 flex items-center justify-center">
                    <Truck size={18} className="text-sand-400" />
                  </div>
                  <div className={isRTL ? "text-right" : ""}>
                    <p className={`text-sm font-semibold text-night-500 ${isRTL ? "font-arabic" : ""}`}>
                      {isRTL ? order.driver.nameAr : order.driver.name}
                    </p>
                    <p className="text-xs text-islamic-400">● {isRTL ? "في الطريق" : "En route"}</p>
                  </div>
                </div>
                <a href={`tel:${order.driver.phone}`}
                  className="w-10 h-10 rounded-xl bg-sand-50 border border-sand-200 flex items-center justify-center text-night-400 hover:bg-sand-100 transition-colors">
                  <Phone size={16} />
                </a>
              </div>
            </div>

            {/* Vendeur */}
            <div className={`flex items-center justify-between bg-white rounded-2xl p-4 shadow-card ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <img src={order.seller.avatar} alt="" className="w-10 h-10 rounded-full" />
                <div className={isRTL ? "text-right" : ""}>
                  <p className={`text-sm font-semibold text-night-500 ${isRTL ? "font-arabic" : ""}`}>
                    {isRTL ? order.seller.nameAr : order.seller.name}
                  </p>
                  <p className="text-xs text-night-400/50">{isRTL ? "البائع" : "Vendeur"}</p>
                </div>
              </div>
              <a href={`tel:${order.seller.phone}`}
                className="w-10 h-10 rounded-xl bg-sand-50 border border-sand-200 flex items-center justify-center text-night-400 hover:bg-sand-100 transition-colors">
                <Phone size={16} />
              </a>
            </div>

            <button
              onClick={() => success(isRTL ? "تم تأكيد الاستلام! شكراً" : "Réception confirmée ! Merci")}
              className={`w-full py-4 rounded-2xl text-base font-bold text-night-500 flex items-center justify-center gap-2 ${isRTL ? "flex-row-reverse font-arabic" : ""}`}
              style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
              <CheckCircle2 size={18} />
              {isRTL ? "تأكيد الاستلام" : "Confirmer la réception"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

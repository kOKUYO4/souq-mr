"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Navigation, MapPin, CheckCircle2, Phone, Package, Truck, Clock } from "lucide-react";
import { useToast } from "@/context/ToastContext";

type Status = "confirmed" | "preparing" | "picked_up" | "en_route" | "delivered";
const NEXT_STATUS: Record<string, Status> = {
  confirmed: "preparing", preparing: "picked_up", picked_up: "en_route", en_route: "delivered",
};
const STATUS_LABELS: Record<string, { fr: string; ar: string }> = {
  confirmed:  { fr: "Confirmée",       ar: "مؤكدة" },
  preparing:  { fr: "En préparation",  ar: "جاري التحضير" },
  picked_up:  { fr: "Récupéré",        ar: "تم الاستلام" },
  en_route:   { fr: "En route",        ar: "في الطريق" },
  delivered:  { fr: "Livré",           ar: "تم التسليم" },
};

export default function LivreurPage() {
  const { isRTL, locale } = useLanguage();
  const { success, error: showError } = useToast();
  const [trackingCode, setTrackingCode] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [lastPos, setLastPos] = useState<{ lat: number; lng: number } | null>(null);
  const watchRef = useRef<number>();
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const fetchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/orders/${trackingCode.trim()}`);
    setLoading(false);
    if (!res.ok) { showError(isRTL ? "الطلب غير موجود" : "Commande introuvable"); return; }
    const { data } = await res.json();
    setOrder(data);
  };

  const updateStatus = async (newStatus: Status) => {
    const res = await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      const { data } = await res.json();
      setOrder(data);
      success(isRTL ? "تم تحديث الحالة" : "Statut mis à jour");
    }
  };

  const sendPosition = (lat: number, lng: number, heading: number | null) => {
    setLastPos({ lat, lng });
    fetch(`/api/orders/${order.id}/location`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lng, heading }),
    });
  };

  const startSharing = () => {
    if (!navigator.geolocation) { showError("GPS non disponible"); return; }
    setSharing(true);
    // Envoie la position immédiatement, puis toutes les 5 secondes
    navigator.geolocation.getCurrentPosition((pos) => {
      sendPosition(pos.coords.latitude, pos.coords.longitude, pos.coords.heading);
    });
    intervalRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition((pos) => {
        sendPosition(pos.coords.latitude, pos.coords.longitude, pos.coords.heading);
      }, () => {}, { enableHighAccuracy: true, maximumAge: 3000 });
    }, 5000);
  };

  const stopSharing = () => {
    clearInterval(intervalRef.current);
    setSharing(false);
  };

  useEffect(() => () => { clearInterval(intervalRef.current); }, []);

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="relative py-10 px-4" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <div className="max-w-lg mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-sand-400/20 flex items-center justify-center mx-auto mb-3">
            <Truck size={28} className="text-sand-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">{isRTL ? "بوابة السائق" : "Espace livreur"}</h1>
          <p className="text-sand-400/70 text-sm mt-1">{isRTL ? "تتبع وتحديث حالة الطلبات" : "Suivez et mettez à jour vos livraisons"}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Search order */}
        <form onSubmit={fetchOrder} className="bg-white rounded-2xl p-5 shadow-sm border border-sand-200">
          <p className="text-sm font-semibold text-night-500 mb-3">{isRTL ? "أدخل رمز التتبع" : "Entrez le code de suivi"}</p>
          <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <input
              value={trackingCode}
              onChange={e => setTrackingCode(e.target.value.toUpperCase())}
              placeholder="CMD-XXXXXXXX"
              className="flex-1 border border-sand-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sand-400/50 bg-sand-50"
            />
            <button type="submit" disabled={loading}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-night-500 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
              {loading ? "..." : isRTL ? "بحث" : "Chercher"}
            </button>
          </div>
        </form>

        {order && (
          <>
            {/* Order info */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-sand-200">
              <div className={`flex items-center justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div>
                  <p className="font-bold text-night-500 font-mono">{order.tracking_code}</p>
                  {order.listing && <p className="text-sm text-night-400">{isRTL ? order.listing.title_ar : order.listing.title}</p>}
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-sand-100 text-sand-600">
                  {STATUS_LABELS[order.status]?.[locale]}
                </span>
              </div>

              {/* Address */}
              <div className={`flex items-start gap-2 p-3 bg-sand-50 rounded-xl ${isRTL ? "flex-row-reverse" : ""}`}>
                <MapPin size={16} className="text-sand-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-night-500">{order.address}</p>
              </div>

              {/* Buyer contact */}
              {order.buyer && (
                <div className={`flex items-center justify-between mt-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div>
                    <p className="text-xs text-night-400">{isRTL ? "المشتري" : "Acheteur"}</p>
                    <p className="text-sm font-semibold text-night-500">{isRTL ? order.buyer.name_ar : order.buyer.name}</p>
                  </div>
                  <a href={`tel:${order.buyer.phone}`}
                    className="flex items-center gap-1.5 px-3 py-2 bg-green-500 text-white rounded-xl text-xs font-bold hover:bg-green-600 transition-colors">
                    <Phone size={14} /> {order.buyer.phone}
                  </a>
                </div>
              )}
            </div>

            {/* GPS sharing */}
            {order.status === "en_route" && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-sand-200">
                <p className="text-sm font-semibold text-night-500 mb-3">
                  {isRTL ? "مشاركة موقعك" : "Partager votre position"}
                </p>
                {lastPos && (
                  <p className="text-xs text-night-400 mb-3 font-mono">
                    GPS : {lastPos.lat.toFixed(5)}, {lastPos.lng.toFixed(5)}
                  </p>
                )}
                <button onClick={sharing ? stopSharing : startSharing}
                  className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                    sharing ? "bg-red-500 text-white hover:bg-red-600" : "text-white hover:opacity-90"
                  }`}
                  style={sharing ? {} : { background: "linear-gradient(135deg, #C9A84C, #B8922E)", color: "#1B2A4A" }}>
                  <Navigation size={16} className={sharing ? "animate-pulse" : ""} />
                  {sharing
                    ? (isRTL ? "إيقاف المشاركة" : "Arrêter le partage")
                    : (isRTL ? "بدء مشاركة الموقع" : "Démarrer le partage GPS")}
                </button>
              </div>
            )}

            {/* Update status */}
            {order.status !== "delivered" && order.status !== "cancelled" && NEXT_STATUS[order.status] && (
              <button onClick={() => updateStatus(NEXT_STATUS[order.status])}
                className="w-full py-4 rounded-2xl text-sm font-bold text-night-500 shadow-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                <CheckCircle2 size={18} />
                {isRTL
                  ? `التالي: ${STATUS_LABELS[NEXT_STATUS[order.status]]?.ar}`
                  : `Étape suivante : ${STATUS_LABELS[NEXT_STATUS[order.status]]?.fr}`}
              </button>
            )}

            {order.status === "delivered" && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
                <CheckCircle2 size={32} className="text-green-500 mx-auto mb-2" />
                <p className="font-bold text-green-700">{isRTL ? "تم التسليم بنجاح!" : "Livraison terminée !"}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

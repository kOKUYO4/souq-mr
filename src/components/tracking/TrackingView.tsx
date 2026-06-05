"use client";

import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Phone, CheckCircle2, Truck, Package, MapPin, Navigation } from "lucide-react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";

const DeliveryMap = dynamic(() => import("@/components/tracking/DeliveryMap"), { ssr: false });

type Status = "pending" | "confirmed" | "preparing" | "picked_up" | "en_route" | "delivered" | "cancelled";

const STEPS: { key: Status; fr: string; ar: string; icon: React.ReactNode }[] = [
  { key: "confirmed",  fr: "Confirmée",        ar: "مؤكدة",          icon: <CheckCircle2 size={16}/> },
  { key: "preparing",  fr: "En préparation",   ar: "جاري التحضير",   icon: <Package size={16}/> },
  { key: "picked_up",  fr: "Récupéré",         ar: "تم الاستلام",    icon: <Truck size={16}/> },
  { key: "en_route",   fr: "En route",         ar: "في الطريق",      icon: <Navigation size={16}/> },
  { key: "delivered",  fr: "Livré ✓",         ar: "تم التسليم ✓",  icon: <CheckCircle2 size={16}/> },
];
const STATUS_ORDER: Status[] = ["confirmed","preparing","picked_up","en_route","delivered"];

export default function TrackingView({ orderId }: { orderId: string }) {
  const { isRTL, locale } = useLanguage();
  const [order, setOrder] = useState<any>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveOrderId, setLiveOrderId] = useState<string | null>(null);

  // Initial fetch
  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.data) {
          setOrder(d.data);
          setLiveOrderId(d.data.id);
        }
        setLoading(false);
      });
  }, [orderId]);

  // Supabase Realtime — order status changes
  useEffect(() => {
    if (!liveOrderId) return;
    const channel = supabase
      .channel(`order-status-${liveOrderId}`)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "orders",
        filter: `id=eq.${liveOrderId}`,
      }, (payload) => {
        setOrder((prev: any) => ({ ...prev, ...payload.new }));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [liveOrderId]);

  // Supabase Realtime — driver GPS location
  useEffect(() => {
    if (!liveOrderId) return;
    const channel = supabase
      .channel(`driver-location-${liveOrderId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "delivery_locations",
        filter: `order_id=eq.${liveOrderId}`,
      }, (payload) => {
        setLocation({ lat: payload.new.lat, lng: payload.new.lng });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [liveOrderId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-sand-50">
      <div className="w-10 h-10 rounded-full border-4 border-sand-400 border-t-transparent animate-spin" />
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center bg-sand-50">
      <div className="text-center p-8">
        <p className="text-night-500 font-bold text-lg mb-2">{isRTL ? "الطلب غير موجود" : "Commande introuvable"}</p>
        <p className="text-night-400 text-sm">{isRTL ? "تحقق من رقم التتبع" : "Vérifiez votre numéro de suivi"}</p>
      </div>
    </div>
  );

  const currentIdx = STATUS_ORDER.indexOf(order.status);

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Map */}
      <div className="h-64 sm:h-80 w-full relative bg-night-500">
        <DeliveryMap
          driverLocation={location}
          deliveryAddress={{ lat: order.address_lat ?? 18.08, lng: order.address_lng ?? -15.97 }}
          status={order.status}
        />
        {order.status === "en_route" && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white/95 rounded-full px-4 py-1.5 text-xs font-bold text-night-500 shadow-md flex items-center gap-1.5 z-[1000]">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {isRTL ? "تتبع مباشر" : "Suivi en direct"}
          </div>
        )}
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Order header */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-sand-200">
          <div className={`flex items-start justify-between gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div>
              <p className="text-xs text-night-400 mb-1">{isRTL ? "رقم الطلب" : "Commande"}</p>
              <p className="font-bold text-night-500 font-mono text-lg">{order.tracking_code}</p>
              {order.listing && (
                <p className="text-sm text-night-400 mt-1">{isRTL ? order.listing.title_ar : order.listing.title}</p>
              )}
            </div>
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${
              order.status === "delivered" ? "bg-green-100 text-green-700" :
              order.status === "en_route"  ? "bg-blue-100 text-blue-700" :
              order.status === "cancelled" ? "bg-red-100 text-red-700" :
              "bg-sand-100 text-sand-600"
            }`}>
              {STEPS.find(s => s.key === order.status)?.[locale] ?? order.status}
            </div>
          </div>
        </div>

        {/* Progress steps */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-sand-200">
          <div className="space-y-3">
            {STEPS.map((step, i) => {
              const done   = i <= currentIdx;
              const active = i === currentIdx;
              return (
                <div key={step.key} className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    done ? "bg-sand-400 text-white" : "bg-sand-100 text-sand-300"
                  } ${active ? "ring-2 ring-sand-400 ring-offset-2" : ""}`}>
                    {step.icon}
                  </div>
                  <span className={`text-sm flex-1 ${done ? "text-night-500 font-semibold" : "text-night-300"} ${isRTL ? "text-right" : ""}`}>
                    {step[locale]}
                  </span>
                  {active && (
                    <span className="text-xs text-sand-500 animate-pulse">{isRTL ? "الآن" : "En cours"}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Driver contact */}
        {order.driver && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-sand-200">
            <p className="text-xs text-night-400 mb-3 font-medium uppercase tracking-wide">
              {isRTL ? "السائق" : "Livreur"}
            </p>
            <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className="w-10 h-10 rounded-full bg-night-500 flex items-center justify-center text-sand-400 font-bold text-sm">
                  {(isRTL ? order.driver.name_ar : order.driver.name)?.[0] ?? "L"}
                </div>
                <div>
                  <p className="font-semibold text-night-500 text-sm">{isRTL ? order.driver.name_ar : order.driver.name}</p>
                  <p className="text-xs text-night-400">{order.driver.phone}</p>
                </div>
              </div>
              <a href={`tel:${order.driver.phone}`}
                className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white hover:bg-green-600 transition-colors">
                <Phone size={16} />
              </a>
            </div>
          </div>
        )}

        {/* Delivery address */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-sand-200">
          <div className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <MapPin size={18} className="text-sand-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-night-400 mb-1">{isRTL ? "عنوان التسليم" : "Adresse de livraison"}</p>
              <p className="text-sm text-night-500 font-medium">{order.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

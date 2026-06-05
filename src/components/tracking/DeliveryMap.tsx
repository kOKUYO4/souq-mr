"use client";

import { useEffect, useRef } from "react";

type Props = {
  driverLocation: { lat: number; lng: number } | null;
  deliveryAddress: { lat: number; lng: number };
  status: string;
};

export default function DeliveryMap({ driverLocation, deliveryAddress, status }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const driverMarkerRef = useRef<any>(null);
  const destMarkerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      // Fix default icon paths for Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const center = driverLocation ?? deliveryAddress;
      const map = L.map(mapRef.current!, { zoomControl: true, scrollWheelZoom: false });
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 18,
      }).addTo(map);

      // Destination marker (gold)
      const destIcon = L.divIcon({
        html: `<div style="width:32px;height:32px;border-radius:50% 50% 50% 0;background:#C9A84C;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
        iconSize: [32, 32], iconAnchor: [16, 32], className: "",
      });
      destMarkerRef.current = L.marker([deliveryAddress.lat, deliveryAddress.lng], { icon: destIcon })
        .addTo(map)
        .bindPopup("📦 Adresse de livraison");

      if (driverLocation) {
        const driverIcon = L.divIcon({
          html: `<div style="width:40px;height:40px;border-radius:50%;background:#1B2A4A;border:3px solid #C9A84C;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(0,0,0,0.4);font-size:18px">🛵</div>`,
          iconSize: [40, 40], iconAnchor: [20, 20], className: "",
        });
        driverMarkerRef.current = L.marker([driverLocation.lat, driverLocation.lng], { icon: driverIcon })
          .addTo(map)
          .bindPopup("🛵 Livreur");

        const bounds = L.latLngBounds([driverLocation.lat, driverLocation.lng], [deliveryAddress.lat, deliveryAddress.lng]);
        map.fitBounds(bounds, { padding: [40, 40] });
      } else {
        map.setView([deliveryAddress.lat, deliveryAddress.lng], 14);
      }
    });

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update driver marker position when location changes
  useEffect(() => {
    if (!driverLocation || !mapInstanceRef.current || !driverMarkerRef.current) return;
    import("leaflet").then((L) => {
      driverMarkerRef.current.setLatLng([driverLocation.lat, driverLocation.lng]);
    });
  }, [driverLocation]);

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} className="w-full h-full" />
    </>
  );
}

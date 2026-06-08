"use client";

import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PWAInstallBanner() {
  const { isRTL } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("pwa-dismissed")) return;
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShow(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("pwa-dismissed", "1");
  };

  if (!show) return null;

  return (
    <div className={`fixed bottom-20 sm:bottom-6 ${isRTL ? "left-4" : "right-4"} z-50 max-w-xs w-[calc(100%-2rem)] sm:w-80`}>
      <div className="bg-night-500 text-white rounded-2xl p-4 shadow-gold-lg border border-sand-400/20 animate-fade-in">
        <div className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className="w-10 h-10 rounded-xl bg-sand-400/20 flex items-center justify-center flex-shrink-0">
            <Download size={18} className="text-sand-400" />
          </div>
          <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
            <p className="text-sm font-bold text-white mb-0.5">
              {isRTL ? "حمّل تطبيق نقطة.مر" : "Installer NUQTA.MR"}
            </p>
            <p className="text-xs text-sand-300/70">
              {isRTL ? "تجربة أفضل، بدون متصفح" : "Meilleure expérience, sans navigateur"}
            </p>
          </div>
          <button onClick={handleDismiss} className="p-1 text-sand-400/60 hover:text-sand-400 flex-shrink-0">
            <X size={16} />
          </button>
        </div>
        <div className={`flex gap-2 mt-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <button onClick={handleInstall}
            className="flex-1 py-2 rounded-xl text-xs font-bold text-night-500 transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
            {isRTL ? "تثبيت" : "Installer"}
          </button>
          <button onClick={handleDismiss}
            className="flex-1 py-2 rounded-xl text-xs font-semibold text-sand-300 border border-night-400/40 hover:bg-night-600/50 transition-colors">
            {isRTL ? "لاحقاً" : "Plus tard"}
          </button>
        </div>
      </div>
    </div>
  );
}

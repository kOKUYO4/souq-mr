"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";
import IslamicPattern from "@/components/ui/IslamicPattern";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0C1426, #1B2A4A)" }}>
      <IslamicPattern opacity={0.05} />
      <div className="relative text-center max-w-md">
        <div className="text-7xl font-display font-bold mb-4"
          style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96A, #B8922E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          Oops
        </div>
        <div className="text-5xl mb-5">⚠️</div>
        <h1 className="text-2xl font-bold text-white mb-3">Une erreur est survenue</h1>
        <p className="text-sand-300/70 mb-8 text-sm">
          {error.message || "Quelque chose s'est mal passé. Veuillez réessayer."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="btn-gold py-3 px-6 gap-2">
            <RefreshCw size={16} />
            Réessayer
          </button>
          <Link href="/" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-sand-400/30 text-sand-300 hover:border-sand-400 transition-all">
            <Home size={16} />
            Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

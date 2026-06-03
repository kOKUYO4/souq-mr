"use client";

import { useState, createContext, useContext } from "react";
import Link from "next/link";
import { X, Scale, ArrowRight } from "lucide-react";
import type { Listing } from "@/data/mockData";
import { formatPrice } from "@/data/mockData";
import { useLanguage } from "@/context/LanguageContext";

interface CompareContextType {
  compareList: Listing[];
  toggleCompare: (listing: Listing) => void;
  isComparing: (id: string) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType>({
  compareList: [],
  toggleCompare: () => {},
  isComparing: () => false,
  clearCompare: () => {},
});

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<Listing[]>([]);

  const toggleCompare = (listing: Listing) => {
    setCompareList((prev) => {
      const exists = prev.find((l) => l.id === listing.id);
      if (exists) return prev.filter((l) => l.id !== listing.id);
      if (prev.length >= 3) return prev;
      return [...prev, listing];
    });
  };

  const isComparing = (id: string) => compareList.some((l) => l.id === id);
  const clearCompare = () => setCompareList([]);

  return (
    <CompareContext.Provider value={{ compareList, toggleCompare, isComparing, clearCompare }}>
      {children}
      <CompareBar />
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}

function CompareBar() {
  const { compareList, clearCompare } = useContext(CompareContext);
  const { isRTL } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  if (compareList.length === 0) return null;

  return (
    <div className={`fixed bottom-20 sm:bottom-6 ${isRTL ? "right-4" : "left-4"} z-50 max-w-sm`}>
      <div className="bg-night-500 text-white rounded-2xl shadow-gold-lg border border-sand-400/20 overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full flex items-center justify-between gap-3 px-4 py-3 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Scale size={16} className="text-sand-400" />
            <span className="text-sm font-bold">{isRTL ? `مقارنة (${compareList.length})` : `Comparer (${compareList.length})`}</span>
          </div>
          <div className="flex items-center gap-1">
            {compareList.map((l) => (
              <img key={l.id} src={l.images[0]} alt="" className="w-6 h-6 rounded-md object-cover" />
            ))}
          </div>
        </button>

        {expanded && (
          <div className="border-t border-night-400/30 p-3 space-y-2">
            {compareList.map((l) => (
              <div key={l.id} className={`flex items-center gap-2 text-xs ${isRTL ? "flex-row-reverse" : ""}`}>
                <img src={l.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white truncate font-medium">{isRTL ? l.titleAr : l.title}</p>
                  <p className="text-sand-400 font-bold">{formatPrice(l.price)} MRU</p>
                </div>
              </div>
            ))}
            <div className={`flex gap-2 pt-1 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Link href={`/comparer?ids=${compareList.map((l) => l.id).join(",")}`}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-night-500 flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                {isRTL ? "مقارنة" : "Comparer"}
                {isRTL ? null : <ArrowRight size={12} />}
              </Link>
              <button onClick={clearCompare}
                className="px-3 py-2 rounded-xl text-xs text-sand-400 border border-night-400/40 hover:bg-night-600/50 transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

const TRENDING = ["iPhone 15", "Toyota Hilux", "Samsung Galaxy", "Robe traditionnelle", "Laptop Dell"];

export default function SearchAutocomplete({ className = "", placeholder }: { className?: string; placeholder?: string }) {
  const { isRTL, locale } = useLanguage();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) { setSuggestions([]); return; }
    setLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=5`);
    setLoading(false);
    if (!res.ok) return;
    const { data } = await res.json();
    const titles = [...new Set((data?.listings ?? []).map((l: any) => locale === "ar" ? l.title_ar : l.title))] as string[];
    setSuggestions(titles.slice(0, 6));
  }, [locale]);

  const handleChange = (v: string) => {
    setQuery(v);
    setOpen(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchSuggestions(v), 300);
  };

  const handleSelect = (term: string) => {
    setQuery(term);
    setOpen(false);
    router.push(`/recherche?q=${encodeURIComponent(term)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) { setOpen(false); router.push(`/recherche?q=${encodeURIComponent(query.trim())}`); }
  };

  const showTrending = query.length === 0 && open;
  const showSuggestions = query.length >= 2 && open && suggestions.length > 0;

  return (
    <div className={`relative ${className}`} ref={ref}>
      <form onSubmit={handleSubmit}>
        <div className={`flex items-center gap-2 bg-night-400/40 border border-night-300/30 rounded-2xl px-4 py-2.5 focus-within:border-sand-400/50 focus-within:bg-night-400/60 transition-all ${isRTL ? "flex-row-reverse" : ""}`}>
          <Search size={16} className="text-sand-400/60 flex-shrink-0" />
          <input
            value={query}
            onChange={e => handleChange(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder ?? (isRTL ? "ابحث عن أي شيء..." : "Rechercher...")}
            className={`flex-1 bg-transparent text-white placeholder:text-sand-400/40 text-sm outline-none ${isRTL ? "text-right" : ""}`}
          />
          {query && (
            <button type="button" onClick={() => { setQuery(""); setSuggestions([]); }}
              className="text-sand-400/40 hover:text-sand-400 transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
      </form>

      {(showTrending || showSuggestions) && (
        <div className={`absolute top-full mt-2 ${isRTL ? "right-0" : "left-0"} w-full min-w-[280px] bg-night-500 border border-night-400/30 rounded-2xl shadow-gold-lg overflow-hidden z-50`}>
          {showTrending && (
            <>
              <p className={`text-xs text-sand-400/60 px-4 py-2 font-medium uppercase tracking-wide ${isRTL ? "text-right" : ""}`}>
                {isRTL ? "الأكثر بحثاً" : "Tendances"}
              </p>
              {TRENDING.map(t => (
                <button key={t} onClick={() => handleSelect(t)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-night-400/30 transition-colors text-sm text-sand-300 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                  <TrendingUp size={14} className="text-sand-400/50 flex-shrink-0" />
                  {t}
                </button>
              ))}
            </>
          )}
          {showSuggestions && suggestions.map(s => (
            <button key={s} onClick={() => handleSelect(s)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-night-400/30 transition-colors text-sm text-white ${isRTL ? "flex-row-reverse text-right" : ""}`}>
              <Search size={14} className="text-sand-400/50 flex-shrink-0" />
              <span className="truncate">{s}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

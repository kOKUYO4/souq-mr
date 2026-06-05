"use client";

import { Loader2, ArrowDown } from "lucide-react";

export default function PullToRefreshIndicator({ pulling, refreshing }: { pulling: boolean; refreshing: boolean }) {
  if (!pulling && !refreshing) return null;
  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-night-500 text-sand-300 px-4 py-2 rounded-full shadow-lg text-xs font-medium">
      {refreshing
        ? <><Loader2 size={14} className="animate-spin" /> Actualisation...</>
        : <><ArrowDown size={14} className="animate-bounce" /> Relâcher pour actualiser</>
      }
    </div>
  );
}

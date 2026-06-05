"use client";

import { useEffect, useRef, useState } from "react";

export function usePullToRefresh(onRefresh: () => Promise<void>, threshold = 80) {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    const el = document.documentElement;

    const onTouchStart = (e: TouchEvent) => {
      if (el.scrollTop === 0) startY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!startY.current) return;
      currentY.current = e.touches[0].clientY;
      const diff = currentY.current - startY.current;
      if (diff > 20 && el.scrollTop === 0) setPulling(true);
    };

    const onTouchEnd = async () => {
      const diff = currentY.current - startY.current;
      startY.current = 0;
      currentY.current = 0;
      setPulling(false);
      if (diff > threshold) {
        setRefreshing(true);
        await onRefresh();
        setRefreshing(false);
      }
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd);
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [onRefresh, threshold]);

  return { pulling, refreshing };
}

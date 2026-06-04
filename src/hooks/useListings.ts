"use client";
/**
 * Hook — annonces avec pagination et filtres (Supabase)
 */
import { useState, useEffect, useCallback } from "react";
import type { DbListing } from "@/lib/supabase";

interface UseListingsOptions {
  category?: string;
  subcategory?: string;
  q?: string;
  sort?: string;
  limit?: number;
}

export function useListings(options: UseListingsOptions = {}) {
  const [listings, setListings]     = useState<DbListing[]>([]);
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(1);
  const [total, setTotal]           = useState(0);
  const [hasMore, setHasMore]       = useState(false);

  const limit = options.limit ?? 12;

  const fetchListings = useCallback(async (p = 1) => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(p));
    params.set("limit", String(limit));
    if (options.category)    params.set("category", options.category);
    if (options.subcategory) params.set("subcategory", options.subcategory);
    if (options.q)           params.set("q", options.q);
    if (options.sort)        params.set("sort", options.sort);

    try {
      const res  = await fetch(`/api/listings?${params}`);
      const json = await res.json();
      if (json.success) {
        setListings(p === 1 ? json.data : (prev: DbListing[]) => [...prev, ...json.data]);
        setTotal(json.meta?.total ?? 0);
        setHasMore(json.meta?.hasMore ?? false);
        setPage(p);
      }
    } finally {
      setLoading(false);
    }
  }, [options.category, options.subcategory, options.q, options.sort, limit]);

  useEffect(() => { fetchListings(1); }, [fetchListings]);

  const loadMore = () => { if (hasMore && !loading) fetchListings(page + 1); };
  const refresh  = () => fetchListings(1);

  return { listings, loading, total, hasMore, loadMore, refresh };
}

export function useListing(id: string | null) {
  const [listing, setListing] = useState<DbListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    fetch(`/api/listings/${id}`)
      .then((r) => r.json())
      .then((j) => { if (j.success) setListing(j.data); })
      .finally(() => setLoading(false));
  }, [id]);

  return { listing, loading };
}

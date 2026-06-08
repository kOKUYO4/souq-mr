"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Seller } from "@/data/mockData";

interface AuthContextType {
  user: Seller | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  sendOtp: (phone: string) => Promise<{ success: boolean; error?: string; devOtp?: string }>;
  verifyOtp: (phone: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null, token: null, isLoading: true, isAuthenticated: false,
  sendOtp: async () => ({ success: false }),
  verifyOtp: async () => ({ success: false }),
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Seller | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const savedToken = localStorage.getItem("nuqta-token");
    if (!savedToken) { setIsLoading(false); return; }
    try {
      const res = await fetch("/api/auth/me", { headers: { Authorization: `Bearer ${savedToken}` } });
      if (res.ok) {
        const { data } = await res.json();
        setUser(data.user);
        setToken(savedToken);
      } else {
        localStorage.removeItem("nuqta-token");
      }
    } catch {
      /* réseau indisponible — ignorer */
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { refreshUser(); }, [refreshUser]);

  const sendOtp = async (phone: string) => {
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const json = await res.json();
    return { success: json.success, error: json.error, devOtp: json.data?.devOtp };
  };

  const verifyOtp = async (phone: string, otp: string) => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });
    const json = await res.json();
    if (json.success) {
      const { user: u, token: t } = json.data;
      setUser(u);
      setToken(t);
      localStorage.setItem("nuqta-token", t);
    }
    return { success: json.success, error: json.error };
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setToken(null);
    localStorage.removeItem("nuqta-token");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: !!user, sendOtp, verifyOtp, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

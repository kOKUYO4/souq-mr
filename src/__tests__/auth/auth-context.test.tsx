/**
 * Tests d'intégration — AuthContext (hook useAuth)
 * Note: refreshUser ne fait PAS de fetch si localStorage est vide (retour immédiat)
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import React from "react";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

function mockNext(data: object, status = 200) {
  (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  } as Response);
}

describe("AuthContext — useAuth", () => {
  beforeEach(() => {
    localStorage.clear(); // évite que le token du test précédent déclenche refreshUser→fetch
  });

  it("démarre non authentifié sans token en localStorage", async () => {
    // Pas de token → refreshUser ne fetch pas → aucun mock nécessaire
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("sendOtp appelle /api/auth/send-otp et retourne devOtp", async () => {
    // Pas de token en localStorage → refreshUser ne fetch pas
    // Seul mock : sendOtp
    mockNext({ success: true, data: { message: "OTP envoyé", devOtp: "654321" } });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    let res: Awaited<ReturnType<typeof result.current.sendOtp>>;
    await act(async () => {
      res = await result.current.sendOtp("+22236000020");
    });
    expect(res!.success).toBe(true);
    expect(res!.devOtp).toBe("654321");
  });

  it("sendOtp propage les erreurs serveur", async () => {
    mockNext({ success: false, error: "Numéro invalide" }, 400);

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    let res: Awaited<ReturnType<typeof result.current.sendOtp>>;
    await act(async () => {
      res = await result.current.sendOtp("0612345678");
    });
    expect(res!.success).toBe(false);
    expect(res!.error).toBe("Numéro invalide");
  });

  it("verifyOtp met à jour user + token après succès", async () => {
    const fakeUser = { id: "s1", name: "Test User", badge: "pro" };
    const fakeToken = "header.payload.signature";
    mockNext({ success: true, data: { user: fakeUser, token: fakeToken } });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    await act(async () => {
      await result.current.verifyOtp("+22236000021", "123456");
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.id).toBe("s1");
    expect(localStorage.getItem("nuqta-token")).toBe(fakeToken);
  });

  it("logout vide user, token et localStorage", async () => {
    // Séquence : verifyOtp → isAuthenticated=true → logout → isAuthenticated=false
    const fakeUser = { id: "s1", name: "Test User", badge: "pro" };
    // Mock #1: verifyOtp success
    mockNext({ success: true, data: { user: fakeUser, token: "tok.en.jwt" } });
    // Mock #2: logout (pas de res.json() dans logout, mais fetch est appelé)
    mockNext({ success: true });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    // Connexion
    let verifyRes: Awaited<ReturnType<typeof result.current.verifyOtp>>;
    await act(async () => { verifyRes = await result.current.verifyOtp("+22236000022", "123456"); });
    expect(verifyRes!.success).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);

    // Déconnexion
    await act(async () => { await result.current.logout(); });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem("nuqta-token")).toBeNull();
  });

  it("refreshUser recharge l'utilisateur depuis le token localStorage", async () => {
    const fakeUser = { id: "s1", name: "Cached User", badge: "verified" };
    localStorage.setItem("nuqta-token", "saved.token.here");
    // Avec un token → refreshUser appelle /api/auth/me
    mockNext({ success: true, data: { user: fakeUser } });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.name).toBe("Cached User");
  });
});

/**
 * Tests UI — Page /connexion (flow OTP complet)
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConnexionPage from "@/app/connexion/page";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ToastProvider } from "@/context/ToastContext";
import React from "react";

function mockNext(data: object, status = 200) {
  (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  } as Response);
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ToastProvider>{children}</ToastProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

describe("Page /connexion", () => {
  beforeEach(() => {
    localStorage.clear();
    // fetch is reset in setup.tsx beforeEach
    // Note: AuthContext.refreshUser ne fetch PAS /me si localStorage est vide → pas de mock /me nécessaire
  });

  it("affiche le bouton d'envoi OTP par défaut", async () => {
    render(<ConnexionPage />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByText(/envoyer le code otp/i)).toBeInTheDocument();
    });
  });

  it("affiche le champ téléphone (type tel)", async () => {
    render(<ConnexionPage />, { wrapper: Wrapper });
    await waitFor(() => {
      const input = document.querySelector('input[type="tel"]');
      expect(input).toBeInTheDocument();
    });
  });

  it("affiche un message d'erreur après échec de sendOtp", async () => {
    mockNext({ success: false, error: "Numéro mauritanien invalide" }, 400);
    render(<ConnexionPage />, { wrapper: Wrapper });
    await waitFor(() => screen.getByText(/envoyer le code otp/i));

    const input = document.querySelector('input[type="tel"]') as HTMLInputElement;
    fireEvent.change(input, { target: { value: "0612345678" } });
    fireEvent.click(screen.getByText(/envoyer le code otp/i));

    await waitFor(() => {
      expect(screen.getByText("Numéro mauritanien invalide")).toBeInTheDocument();
    });
  });

  it("passe à l'étape OTP après envoi réussi", async () => {
    mockNext({ success: true, data: { message: "OTP envoyé", devOtp: "123456" } });
    render(<ConnexionPage />, { wrapper: Wrapper });
    await waitFor(() => screen.getByText(/envoyer le code otp/i));

    const input = document.querySelector('input[type="tel"]') as HTMLInputElement;
    fireEvent.change(input, { target: { value: "+22236000030" } });
    fireEvent.click(screen.getByText(/envoyer le code otp/i));

    await waitFor(() => {
      // Les 6 inputs OTP individuels (type="text", inputMode="numeric")
      const otpInputs = document.querySelectorAll('input[type="text"]');
      expect(otpInputs.length).toBe(6);
    });
  });

  it("affiche le devOtp reçu en mode dev", async () => {
    mockNext({ success: true, data: { message: "OTP envoyé", devOtp: "987654" } });
    render(<ConnexionPage />, { wrapper: Wrapper });
    await waitFor(() => screen.getByText(/envoyer le code otp/i));

    const input = document.querySelector('input[type="tel"]') as HTMLInputElement;
    fireEvent.change(input, { target: { value: "+22236000031" } });
    fireEvent.click(screen.getByText(/envoyer le code otp/i));

    await waitFor(() => {
      expect(screen.getByText(/987654/)).toBeInTheDocument();
    });
  });
});

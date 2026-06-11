"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <html lang="fr">
      <body style={{ background: "#0C1426", color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>Erreur critique</h1>
          <p style={{ color: "#C9A84C", marginBottom: "2rem" }}>
            Une erreur inattendue est survenue. Veuillez rafraîchir la page.
          </p>
          <button
            onClick={reset}
            style={{ background: "#C9A84C", color: "#0C1426", padding: "0.75rem 1.5rem", borderRadius: "0.75rem", fontWeight: 600, border: "none", cursor: "pointer" }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}

"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          margin: 0,
          padding: "1rem",
          background: "#fafafa",
          color: "#171717",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <p style={{ fontSize: 48, margin: "0 0 1rem" }}>♻️</p>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 0.5rem" }}>
            Something broke
          </h1>
          <p style={{ color: "#737373", margin: "0 0 1.5rem" }}>
            A critical error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/App";
import { AuthProvider } from "@/context/AuthContext";
import "@/index.css";

async function bootstrap() {
  try {
    const response = await fetch("/runtime-config.json", { cache: "no-store" });

    if (response.ok) {
      window.__APP_CONFIG__ = await response.json();
    }
  } catch {
    // The app can still boot with build-time defaults when runtime config is unavailable.
  }

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>,
  );
}

void bootstrap();

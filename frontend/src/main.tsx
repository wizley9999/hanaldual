import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

if ("serviceWorker" in navigator) {
  await navigator.serviceWorker.register("/firebase-messaging-sw.js");
}

window.addEventListener("beforeinstallprompt", (e: any) => {
  e.preventDefault();
  (window as any).deferredInstallPrompt = e;
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

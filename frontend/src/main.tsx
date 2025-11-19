import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "@/index.css";
import App from "@/App";
import Post from "@/components/post";

if ("serviceWorker" in navigator) {
  await navigator.serviceWorker.register("/firebase-messaging-sw.js");
}

window.addEventListener("beforeinstallprompt", (e: any) => {
  e.preventDefault();
  (window as any).deferredInstallPrompt = e;
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />

        <Route path="posts">
          <Route path=":analysisId" element={<Post />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

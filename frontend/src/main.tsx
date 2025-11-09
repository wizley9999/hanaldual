import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.tsx";
import My from "./components/my.tsx";
import Post from "./components/post.tsx";

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

        <Route path="my" element={<My />} />

        <Route path="posts">
          <Route path=":postId" element={<Post />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

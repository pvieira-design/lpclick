"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __gtmLoaded?: boolean;
  }
}

const GTM_ID = "GTM-NHB2NDHK";

function loadGTM() {
  if (typeof window === "undefined" || window.__gtmLoaded) return;
  window.__gtmLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(s);
}

export default function DeferredGTM() {
  useEffect(() => {
    // dataLayer fica disponível imediatamente — sendGTMEvent enfileira normal
    // mesmo antes do GTM carregar.
    window.dataLayer = window.dataLayer || [];

    const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    const onInteraction = () => {
      cleanup();
      loadGTM();
    };
    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, onInteraction));
    };

    events.forEach((e) =>
      window.addEventListener(e, onInteraction, { once: true, passive: true }),
    );

    return cleanup;
  }, []);

  return null;
}

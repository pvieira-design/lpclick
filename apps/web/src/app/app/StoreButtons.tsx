"use client";

import { useEffect, useState } from "react";
import { APPLE_STORE_URL, PLAY_STORE_URL, platformFromUserAgent, type Platform } from "./store-links";

function AppleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function PlayLogo() {
  return (
    <svg width="18" height="20" viewBox="0 0 22 24" fill="currentColor" aria-hidden="true">
      <path d="M1.22.557c-.3.3-.44.75-.44 1.28v20.33c0 .53.15.97.46 1.28l.07.06L12.9 12.03v-.06L1.29.49 1.22.557zM16.78 15.92l-3.88-3.89v-.06l3.88-3.89.09.05 4.6 2.61c1.31.75 1.31 1.97 0 2.71l-4.6 2.61-.09.05v-.19zM16.87 16.11L12.9 12.03 1.36 23.57c.43.46 1.15.52 1.96.08l13.55-7.54zM16.87 7.95L3.32.41C2.51-.03 1.79.03 1.36.49L12.9 12.03l3.97-4.08z" />
    </svg>
  );
}

/* Começa mostrando as duas lojas (HTML do servidor) e, no aparelho, fica só com a certa. */
function usePlatform() {
  const [platform, setPlatform] = useState<Platform | null>(null);
  useEffect(() => {
    setPlatform(platformFromUserAgent(navigator.userAgent, navigator.maxTouchPoints));
  }, []);
  return platform;
}

export function StoreButtons({ withQr = false }: { withQr?: boolean }) {
  const platform = usePlatform();
  const showApple = platform !== "android";
  const showPlay = platform !== "ios";
  const onPhone = platform === "ios" || platform === "android";

  return (
    <div className={`stores-block${withQr ? " has-qr" : ""}`}>
      <div className="stores">
        {showApple && (
          <a className={`store${onPhone ? " is-solo" : ""}`} href={APPLE_STORE_URL} target="_blank" rel="noopener noreferrer">
            <AppleLogo />
            <span>
              <small>Baixar na</small>
              App Store
            </span>
          </a>
        )}
        {showPlay && (
          <a className={`store${onPhone ? " is-solo" : ""}`} href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
            <PlayLogo />
            <span>
              <small>Disponível no</small>
              Google Play
            </span>
          </a>
        )}
      </div>
      {withQr && platform === "other" && (
        <div className="qr-card">
          <img src="/app/qr-baixar.svg" alt="QR code para baixar o app Click Cannabis" width={96} height={96} />
          <p>
            <strong>Está no computador?</strong>
            Aponte a câmera do celular para o código e baixe direto na loja certa.
          </p>
        </div>
      )}
    </div>
  );
}

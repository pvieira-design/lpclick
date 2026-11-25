"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { startBrowserTracking } from "@click-cannabis/tracking-edge/browser";
import { COOKIE_CONTEXTO } from "@/lib/tracking-context-cookie";

const TAXA_POR_HORA_DE_SAO_PAULO = [
  1, 1, 1, 1, 1, 1, 1, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
  0.25, 0.25, 0.25, 0.25,
];

export default function TrackingContextCapture({
  enabled,
  cookieDomain,
}: {
  enabled: boolean;
  cookieDomain: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tracker = useRef<ReturnType<typeof startBrowserTracking> | null>(null);

  useEffect(() => {
    if (!enabled) return;
    try {
      tracker.current = startBrowserTracking({
        endpoint: "/api/tracking/observations",
        contextCookie: COOKIE_CONTEXTO,
        cookieDomain,
        onDiagnostic: code => console.warn("[tracking-context]", code),
        pageView: true,
        pageViewModeFromServer: true,
        pageTiming: { hourlyRate: TAXA_POR_HORA_DE_SAO_PAULO },
      });
    } catch {
      console.warn("[tracking-context]", "initialization-failed");
    }
    return () => {
      tracker.current?.stop();
      tracker.current = null;
    };
  }, [enabled, cookieDomain]);

  useEffect(() => {
    void tracker.current?.capture();
  }, [pathname, searchParams]);

  return null;
}

"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { startBrowserTracking } from "@click-cannabis/tracking-edge/browser";
import { COOKIE_CONTEXTO } from "@/lib/tracking-context-cookie";

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
        endpoint: "/api/tracking/observations/",
        contextCookie: COOKIE_CONTEXTO,
        cookieDomain,
        onDiagnostic: code => console.warn("[tracking-context]", code),
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

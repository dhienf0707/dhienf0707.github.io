"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ROUTES_TO_WARM = ["/blog"];

export default function RoutePrefetcher() {
  const router = useRouter();

  useEffect(() => {
    const warmRoutes = () => {
      for (const route of ROUTES_TO_WARM) {
        router.prefetch(route);
      }
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(warmRoutes, { timeout: 2000 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(warmRoutes, 500);
    return () => window.clearTimeout(timeoutId);
  }, [router]);

  return null;
}

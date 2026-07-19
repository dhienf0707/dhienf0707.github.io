"use client";

import { useCallback, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";

const REFRESH_TIMEOUT_MS = 15000;

/**
 * Returns a refresh() function that resolves once router.refresh() finishes
 * re-fetching the current route (tracked via useTransition).
 */
export function useRouterRefresh() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const resolveRef = useRef(null);
  const isTriggeredRef = useRef(false);

  const refresh = useCallback(() => {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        if (!resolveRef.current) return;
        resolveRef.current = null;
        isTriggeredRef.current = false;
        reject(new Error("Refresh timed out"));
      }, REFRESH_TIMEOUT_MS);

      resolveRef.current = () => {
        clearTimeout(timeoutId);
        resolve();
      };

      startTransition(() => {
        router.refresh();
      });
    });
  }, [router]);

  useEffect(() => {
    if (isPending) {
      isTriggeredRef.current = true;
      return;
    }

    if (isTriggeredRef.current && resolveRef.current) {
      isTriggeredRef.current = false;
      const resolve = resolveRef.current;
      resolveRef.current = null;
      resolve();
    }
  }, [isPending]);

  return refresh;
}

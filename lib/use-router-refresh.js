"use client";

import { useCallback, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";

const REFRESH_TIMEOUT_MS = 15000;

/**
 * Returns a refresh() function that resolves once router.refresh() finishes
 * re-fetching the current route (tracked via useTransition).
 *
 * Concurrent calls are batched: callers that arrive while a refresh is
 * in-flight wait for a follow-up refresh so they always see the latest data.
 */
export function useRouterRefresh() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const waitersRef = useRef([]);
  const inFlightWaitersRef = useRef([]);
  const refreshScheduledRef = useRef(false);
  const isTriggeredRef = useRef(false);

  const scheduleRefresh = useCallback(() => {
    if (refreshScheduledRef.current) return;
    refreshScheduledRef.current = true;
    inFlightWaitersRef.current = waitersRef.current.splice(0);
    startTransition(() => {
      router.refresh();
    });
  }, [router]);

  const refresh = useCallback(() => {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        for (const list of [waitersRef.current, inFlightWaitersRef.current]) {
          const idx = list.findIndex((w) => w.resolve === resolve);
          if (idx !== -1) {
            list.splice(idx, 1);
            reject(new Error("Refresh timed out"));
            return;
          }
        }
      }, REFRESH_TIMEOUT_MS);

      waitersRef.current.push({ resolve, reject, timeoutId });
      scheduleRefresh();
    });
  }, [scheduleRefresh]);

  useEffect(() => {
    if (isPending) {
      isTriggeredRef.current = true;
      return;
    }

    if (!isTriggeredRef.current) return;

    isTriggeredRef.current = false;
    refreshScheduledRef.current = false;

    const completed = inFlightWaitersRef.current;
    inFlightWaitersRef.current = [];

    for (const waiter of completed) {
      clearTimeout(waiter.timeoutId);
      waiter.resolve();
    }

    if (waitersRef.current.length > 0) {
      scheduleRefresh();
    }
  }, [isPending, scheduleRefresh]);

  return refresh;
}

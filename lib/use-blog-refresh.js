"use client";

import { useCallback, useState } from "react";
import { revalidateBlogPath } from "@/lib/revalidate-client";
import { useRouterRefresh } from "@/lib/use-router-refresh";

export function useBlogRefresh() {
  const refreshRouter = useRouterRefresh();
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const refreshBlog = useCallback(
    async (path) => {
      setRefreshing(true);
      setError("");
      try {
        await revalidateBlogPath(path);
        await refreshRouter();
      } catch (err) {
        setError(err.message || "Failed to refresh");
      } finally {
        setRefreshing(false);
      }
    },
    [refreshRouter]
  );

  return { refreshBlog, refreshing, error, setError };
}

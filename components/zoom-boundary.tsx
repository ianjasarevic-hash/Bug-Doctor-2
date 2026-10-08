"use client";

import { useEffect } from "react";
import { installZoomListeners } from "@/lib/zoom-transition";

/**
 * Mounts the global click + popstate listeners that power the
 * `data-zoom-target` transition. Rendered once in the root layout
 * so it stays alive for the whole session.
 */
export function ZoomBoundary() {
  useEffect(() => {
    return installZoomListeners();
  }, []);
  return null;
}

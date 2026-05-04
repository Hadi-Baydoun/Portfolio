import { useEffect } from "react";
import { initHomepage } from "../../../../scripts/script.js";

/** Runs legacy homepage behaviors (Rellax, lazy load, Lottie, nav) after mount; cleans up on unmount. */
export function useHomepageInit() {
  useEffect(() => {
    let teardownRef = null;
    let cancelled = false;

    initHomepage().then((teardown) => {
      if (cancelled) teardown?.();
      else teardownRef = teardown;
    });

    return () => {
      cancelled = true;
      teardownRef?.();
    };
  }, []);
}

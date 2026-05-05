import { useState, useEffect, useRef } from "react";

/**
 * Typewriter effect that types text character by character when a trigger element enters the viewport.
 * Runs once only.
 *
 * @param {string} text - The full text to type
 * @param {Object} options - Configuration options
 * @param {React.RefObject} options.triggerRef - Ref to the element that triggers typing when in view (e.g. section ref)
 * @param {number} options.charDelay - Delay in ms between each character (default: 60)
 * @param {number} options.threshold - IntersectionObserver threshold 0-1 (default: 0.3)
 * @param {number} options.startDelay - Delay in ms before typing starts after trigger (default: 0)
 * @param {boolean} options.enabled - When false, typing does not start until true (default: true)
 * @returns {{ typedText: string, showCursor: boolean }}
 */
export function useTypewriter(
  text,
  {
    triggerRef,
    charDelay = 60,
    threshold = 0.3,
    startDelay = 0,
    enabled = true,
  } = {},
) {
  const [typedText, setTypedText] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const hasTriggeredRef = useRef(false);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      // If we armed the trigger then `enabled` flipped false before setHasStarted ran (e.g. home
      // reveal gate), the observer cleanup clears the timeout but leaves hasTriggeredRef stuck true.
      hasTriggeredRef.current = false;
      return;
    }
    if (!triggerRef?.current) return;

    let timeoutId = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          timeoutId = setTimeout(() => setHasStarted(true), startDelay);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(triggerRef.current);
    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [threshold, triggerRef, startDelay, enabled]);

  useEffect(() => {
    if (!hasStarted || !text.length) return;

    startTimeRef.current = null;
    let rafId = null;

    const step = (timestamp) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const charsToShow = Math.min(
        Math.floor(elapsed / charDelay) + 1,
        text.length,
      );
      const newText = text.slice(0, charsToShow);

      setTypedText((prev) => (prev === newText ? prev : newText));

      if (charsToShow < text.length) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [text, charDelay, hasStarted]);

  return {
    typedText,
    showCursor: typedText.length < text.length,
  };
}

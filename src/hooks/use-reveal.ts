import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

export function useReveal() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    let cancelled = false;
    let io: IntersectionObserver | null = null;
    const timeouts: number[] = [];

    const reveal = (el: Element) => el.classList.add("in");

    const init = () => {
      if (cancelled) return;
      const els = Array.from(document.querySelectorAll(".reveal:not(.in)"));

      // Immediately reveal anything already in (or above) the viewport
      els.forEach((el) => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.95) reveal(el);
      });

      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              reveal(e.target);
              io?.unobserve(e.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: "0px 0px -5% 0px" }
      );
      document.querySelectorAll(".reveal:not(.in)").forEach((el) => io!.observe(el));
    };

    // Run twice: once after layout, once a bit later for late-mounted content
    timeouts.push(window.setTimeout(init, 0));
    timeouts.push(window.setTimeout(init, 150));

    // Ultimate fallback: reveal everything still hidden after 800ms
    timeouts.push(
      window.setTimeout(() => {
        document.querySelectorAll(".reveal:not(.in)").forEach(reveal);
      }, 800)
    );

    return () => {
      cancelled = true;
      timeouts.forEach((t) => window.clearTimeout(t));
      io?.disconnect();
    };
  }, [pathname]);
}

import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

export function useReveal() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    // Defer to allow new route's DOM to mount
    const raf = requestAnimationFrame(() => {
      const els = document.querySelectorAll(".reveal:not(.in)");
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      els.forEach((el) => io.observe(el));

      // Fallback: if anything is still hidden after a moment, reveal it
      const fallback = window.setTimeout(() => {
        document.querySelectorAll(".reveal:not(.in)").forEach((el) => {
          const rect = (el as HTMLElement).getBoundingClientRect();
          if (rect.top < window.innerHeight) el.classList.add("in");
        });
      }, 400);

      (window as unknown as { __revealIO?: IntersectionObserver }).__revealIO?.disconnect();
      (window as unknown as { __revealIO?: IntersectionObserver }).__revealIO = io;

      return () => {
        window.clearTimeout(fallback);
        io.disconnect();
      };
    });

    return () => cancelAnimationFrame(raf);
  }, [pathname]);
}

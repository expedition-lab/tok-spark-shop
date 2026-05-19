import { useEffect, useRef, useState, type ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  /** Reserved space to prevent layout shift before children mount. */
  minHeight?: number | string;
  /** rootMargin for IntersectionObserver — preloads before visible. */
  rootMargin?: string;
  className?: string;
}

/**
 * Defers rendering of below-the-fold content until it scrolls near the
 * viewport. Uses IntersectionObserver + CSS content-visibility for
 * cheaper paint/layout while offscreen.
 */
export const LazySection = ({
  children,
  minHeight = 400,
  rootMargin = "400px 0px",
  className,
}: LazySectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [visible, rootMargin]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: `1px ${typeof minHeight === "number" ? `${minHeight}px` : minHeight}`,
        minHeight: visible ? undefined : minHeight,
      }}
    >
      {visible ? children : null}
    </div>
  );
};

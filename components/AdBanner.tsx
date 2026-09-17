'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
  className?: string;
  adSlot?: string;
}

export default function AdBanner({ className = '', adSlot }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const insRef = useRef<HTMLModElement | null>(null);
  const isPushedRef = useRef(false);

  useEffect(() => {
    if (isPushedRef.current) return;

    let resizeObserver: ResizeObserver | null = null;
    let timer: NodeJS.Timeout | null = null;

    const requestAd = () => {
      if (isPushedRef.current) return true;

      const ins = insRef.current;
      const container = containerRef.current;
      if (!ins || !container) return false;

      // 1. Verify container and ins have non-zero width
      const width = container.offsetWidth || ins.offsetWidth;
      if (width <= 0) {
        return false;
      }

      // 2. Check if this specific ins tag was already processed by AdSense
      if (ins.getAttribute('data-adsbygoogle-status')) {
        isPushedRef.current = true;
        return true;
      }

      // 3. AdSense looks for any unfilled ins element in the DOM.
      // If there are no uninitialized ins elements, calling push() throws:
      // "All 'ins' elements in the DOM with class=adsbygoogle already have ads in them."
      if (typeof document !== 'undefined') {
        const unfilledAds = document.querySelectorAll(
          'ins.adsbygoogle:not([data-adsbygoogle-status])'
        );
        if (unfilledAds.length === 0) {
          return true;
        }
      }

      try {
        if (typeof window !== 'undefined') {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          isPushedRef.current = true;
          return true;
        }
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        // Suppress expected transient AdSense errors during SPA re-renders or zero width layout calculations
        if (
          !errMsg.includes('already have ads in them') &&
          !errMsg.includes('availableWidth=0')
        ) {
          console.warn('AdSense notice:', errMsg);
        }
        isPushedRef.current = true;
        return true;
      }
      return false;
    };

    // Delay slightly until CSS/layout settles so availableWidth is properly calculated
    timer = setTimeout(() => {
      if (!requestAd() && containerRef.current) {
        resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            if (entry.contentRect.width > 0) {
              if (requestAd()) {
                resizeObserver?.disconnect();
              }
            }
          }
        });
        resizeObserver.observe(containerRef.current);
      }
    }, 150);

    return () => {
      if (timer) clearTimeout(timer);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden flex justify-center items-center my-4 min-h-[60px] ${className}`}
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minWidth: '250px' }}
        data-ad-client="ca-pub-1428022985258563"
        {...(adSlot ? { 'data-ad-slot': adSlot } : {})}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}

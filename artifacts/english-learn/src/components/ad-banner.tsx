import { useEffect, useRef } from "react";

interface AdBannerProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdBanner({ slot, format = "auto", className = "" }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      if (typeof window !== "undefined") {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        pushed.current = true;
      }
    } catch (e) {
      // AdSense not loaded yet — will activate once publisher ID is set
    }
  }, []);

  return (
    <div className={`overflow-hidden text-center ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

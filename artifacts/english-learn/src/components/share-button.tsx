import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  title: string;
  text: string;
  className?: string;
}

export function ShareButton({ title, text, className = "" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text });
        return;
      } catch {
        // user cancelled or API unavailable, fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleShare}
      className={`gap-2 ${className}`}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-500" />
          تم النسخ!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          شارك نتيجتك
        </>
      )}
    </Button>
  );
}

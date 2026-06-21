"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface CopyButtonProps {
  text: string;
}

export default function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Kode booking disalin!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin. Salin manual ya.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
      title="Salin kode booking"
      aria-label="Salin kode booking"
    >
      {copied ? (
        <Check className="h-4 w-4 text-primary" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );
}

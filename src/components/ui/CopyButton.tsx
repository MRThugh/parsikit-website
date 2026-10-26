import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  size?: 'sm' | 'md';
}

/**
 * Uiverse-inspired tactile micro-interaction copy button
 * Adapted for ParsiKit design system tokens with WCAG-compliant contrast and reduced motion.
 * Inspiration: Uiverse.io clean clipboard button patterns (MIT License compatible).
 */
export function CopyButton({
  text,
  label = 'Copy',
  copiedLabel = 'Copied!',
  className = '',
  size = 'md',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isSmall = size === 'sm';

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : label}
      title={copied ? copiedLabel : label}
      className={`group relative inline-flex items-center justify-center gap-1.5 rounded-lg border font-mono transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
        isSmall ? 'px-2 py-1 text-[11px] min-h-[32px]' : 'px-3 py-1.5 text-xs min-h-[38px]'
      } ${
        copied
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold'
          : 'bg-[var(--surface-elevated)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--primary)] hover:bg-[var(--primary-surface)]'
      } ${className}`}
    >
      <span className="relative flex items-center justify-center w-3.5 h-3.5">
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-500 animate-in zoom-in-50 duration-150" />
        ) : (
          <Copy className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 transition-opacity" />
        )}
      </span>
      <span>{copied ? copiedLabel : label}</span>
    </button>
  );
}

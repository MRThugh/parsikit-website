import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslations } from '../i18n/translations';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language = 'python', title, showLineNumbers = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { lang } = useApp();
  const t = getTranslations(lang);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lines = code.trim().split('\n');

  return (
    <div className="my-4 rounded-xl border border-[var(--border)] bg-[var(--code-background)] text-[var(--code-text)] overflow-hidden shadow-sm group transition-colors">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--surface-elevated)] border-b border-[var(--border)] text-xs text-[var(--text-secondary)]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 opacity-60">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] inline-block" />
          </div>
          {title && <span className="font-mono text-[var(--text-primary)] ml-2 font-medium">{title}</span>}
          {!title && <span className="font-mono uppercase tracking-wider text-[11px] text-[var(--primary)] font-semibold">{language}</span>}
        </div>

        <button
          onClick={handleCopy}
          aria-label={copied ? t.hero.copied : t.hero.copyCmd}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-sans text-[var(--text-primary)] hover:bg-[var(--primary-surface)] transition-colors cursor-pointer min-h-[30px]"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">{t.hero.copied}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              <span>{t.hero.copyCmd}</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <pre
        dir="ltr"
        className="p-4 overflow-x-auto text-xs md:text-sm font-mono leading-relaxed text-left"
      >
        <code>
          {lines.map((line, idx) => (
            <div key={idx} className="table-row">
              {showLineNumbers && (
                <span className="table-cell pr-4 select-none text-[#7A8C85] dark:text-[#788E84] text-right w-8 text-xs">
                  {idx + 1}
                </span>
              )}
              <span className="table-cell">{line || ' '}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

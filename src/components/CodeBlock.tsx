import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language = 'python', title, showLineNumbers = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { lang } = useApp();

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
    <div className="my-4 rounded-xl border border-[#126E68]/20 dark:border-white/10 bg-[#141B19] text-[#E2E8E7] overflow-hidden shadow-sm group">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0E1312] border-b border-white/5 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 opacity-60">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          {title && <span className="font-mono text-slate-300 ml-2">{title}</span>}
          {!title && <span className="font-mono uppercase tracking-wider text-[11px] text-[#52C5BE]">{language}</span>}
        </div>

        <button
          onClick={handleCopy}
          aria-label={copied ? (lang === 'fa' ? 'کپی شد' : 'Copied') : (lang === 'fa' ? 'کپی کد' : 'Copy code')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-sans text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">{lang === 'fa' ? 'کپی شد' : 'Copied'}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              <span>{lang === 'fa' ? 'کپی' : 'Copy'}</span>
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
                <span className="table-cell pr-4 select-none text-slate-600 text-right w-8 text-xs">
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

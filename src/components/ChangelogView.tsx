import React from 'react';
import { Calendar, Wrench, PlusCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RELEASES_DATA } from '../data/changelogData';
import { getTranslations } from '../i18n/translations';

export function ChangelogView() {
  const { lang, isRtl } = useApp();
  const t = getTranslations(lang);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Header */}
      <div className="mb-12">
        <div className="text-xs font-mono text-[#126E68] dark:text-[#52C5BE] uppercase tracking-wider mb-2">
          {t.changelog.title}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight mb-4">
          {t.changelog.title}
        </h1>
        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300">
          {t.changelog.subtitle}
        </p>
      </div>

      {/* Releases Timeline */}
      <div className="space-y-12">
        {RELEASES_DATA.map((release, idx) => {
          const isLatest = idx === 0;
          return (
            <article
              key={release.version}
              className={`p-6 sm:p-8 rounded-2xl border transition-all ${
                isLatest
                  ? 'bg-white dark:bg-[#151D1B] border-[#126E68]/30 dark:border-[#52C5BE]/30 shadow-md ring-1 ring-[#126E68]/20'
                  : 'bg-white/60 dark:bg-[#121917] border-stone-200 dark:border-white/10'
              }`}
            >
              {/* Header */}
              <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2 pb-4 border-b border-stone-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold font-mono text-stone-900 dark:text-white" dir="ltr">
                    v{release.version}
                  </h2>
                  {isLatest && (
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      {t.changelog.latestBadge}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono" dir="ltr">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{release.date}</span>
                </div>
              </div>

              {/* Fixed items */}
              {release.fixed && release.fixed.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>{t.changelog.fixed}</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                    {release.fixed.map((item, iIdx) => (
                      <li key={iIdx} className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1 select-none">•</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Added items */}
              {release.added && release.added.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#126E68] dark:text-[#52C5BE] mb-3">
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{t.changelog.added}</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                    {release.added.map((item, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-2">
                        <span className="text-[#126E68] dark:text-[#52C5BE] mt-1 select-none">•</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Changed items */}
              {release.changed && release.changed.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-3">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{t.changelog.changed}</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                    {release.changed.map((item, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-2">
                        <span className="text-sky-500 mt-1 select-none">•</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

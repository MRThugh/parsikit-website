/**
 * Client-Side Search Engine for ParsiKit Documentation
 */

import { ALL_DOCS, type DocEntry } from '../data/docsManifest';
import { type AppLang } from './router';
import { cleanText } from './validation';
import { toEnglishDigits } from './persianNumber';

export interface SearchResult {
  doc: DocEntry;
  matchScore: number;
  snippet: string;
  matchedHeading?: string;
  matchedHeadingId?: string;
}

function normalizeQuery(q: string): string {
  const { cleaned } = cleanText(q);
  return toEnglishDigits(cleaned).toLowerCase().trim();
}

export function searchDocumentation(query: string, lang?: AppLang): SearchResult[] {
  const cleanQ = normalizeQuery(query);
  if (!cleanQ || cleanQ.length < 2) return [];

  const terms = cleanQ.split(/\s+/).filter(Boolean);
  const results: SearchResult[] = [];

  const candidates = lang ? ALL_DOCS.filter((d) => d.lang === lang) : ALL_DOCS;

  for (const doc of candidates) {
    const normTitle = normalizeQuery(doc.title);
    const normSummary = normalizeQuery(doc.summary);
    const normContent = normalizeQuery(doc.content);

    let score = 0;
    let bestHeading: string | undefined;
    let bestHeadingId: string | undefined;

    // Check title match
    if (normTitle.includes(cleanQ)) {
      score += 100;
    } else {
      for (const t of terms) {
        if (normTitle.includes(t)) score += 30;
      }
    }

    // Check slug match
    if (doc.slug.toLowerCase().includes(cleanQ)) {
      score += 40;
    }

    // Check headings
    for (const h of doc.headings) {
      const normH = normalizeQuery(h.text);
      if (normH.includes(cleanQ)) {
        score += 50;
        if (!bestHeading) {
          bestHeading = h.text;
          bestHeadingId = h.id;
        }
      }
    }

    // Check summary match
    if (normSummary.includes(cleanQ)) {
      score += 25;
    }

    // Check body content match
    const contentIdx = normContent.indexOf(cleanQ);
    if (contentIdx !== -1) {
      score += 15;
    }

    if (score > 0) {
      // Build snippet
      let snippet = doc.summary;
      if (contentIdx !== -1) {
        const start = Math.max(0, contentIdx - 40);
        const end = Math.min(doc.content.length, contentIdx + cleanQ.length + 80);
        snippet = (start > 0 ? '...' : '') + doc.content.slice(start, end).replace(/\n/g, ' ') + (end < doc.content.length ? '...' : '');
      }

      results.push({
        doc,
        matchScore: score,
        snippet,
        matchedHeading: bestHeading,
        matchedHeadingId: bestHeadingId,
      });
    }
  }

  return results.sort((a, b) => b.matchScore - a.matchScore).slice(0, 12);
}

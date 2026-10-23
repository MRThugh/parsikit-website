import { marked } from 'marked';

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Strict protocol allowlist and URL security validator.
 * Only permits: http:, https:, mailto:, in-page anchors, and internal relative paths.
 * Rejects javascript:, data:, vbscript:, file:, blob:, and any obfuscated or entity-encoded forms.
 */
export function isSafeUrl(rawUrl: string): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;

  // 1. Strip ASCII control characters and whitespace
  const sanitized = rawUrl.replace(/[\u0000-\u001F\u007F-\u009F\s]/g, '');
  if (!sanitized) return false;

  // 2. Decode entities and percent encodings to uncover obfuscated schemes
  let decoded = sanitized;
  decoded = decoded
    .replace(/&#x([0-9a-f]+);?/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#([0-9]+);?/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)));
  try {
    decoded = decodeURIComponent(decoded);
  } catch {}
  const normalized = decoded.replace(/[\u0000-\u001F\u007F-\u009F\s]/g, '').toLowerCase();

  // Deny dangerous scheme strings anywhere in normalized form
  if (
    normalized.startsWith('javascript:') ||
    normalized.startsWith('data:') ||
    normalized.startsWith('vbscript:') ||
    normalized.startsWith('file:') ||
    normalized.startsWith('blob:') ||
    normalized.startsWith('intent:') ||
    normalized.includes('javascript:')
  ) {
    return false;
  }

  // 3. Anchor-only links are safe if they contain no HTML or quotes
  if (sanitized.startsWith('#')) {
    return !/[<>"']/.test(sanitized);
  }

  // 4. Scheme validation: if URL contains a scheme delimiter ':'
  const firstColon = sanitized.indexOf(':');
  const firstSlash = sanitized.indexOf('/');
  const firstQuestion = sanitized.indexOf('?');
  const firstHash = sanitized.indexOf('#');

  const hasScheme =
    firstColon !== -1 &&
    (firstSlash === -1 || firstColon < firstSlash) &&
    (firstQuestion === -1 || firstColon < firstQuestion) &&
    (firstHash === -1 || firstColon < firstHash);

  if (hasScheme) {
    try {
      const parsed = new URL(sanitized);
      const protocol = parsed.protocol.toLowerCase();
      return ['http:', 'https:', 'mailto:'].includes(protocol);
    } catch {
      return false;
    }
  }

  // 5. Internal relative or root-relative path: reject raw HTML and attribute breaks
  if (/[<>"']/.test(sanitized)) {
    return false;
  }

  return true;
}

export function isDangerousScheme(url: string): boolean {
  return !isSafeUrl(url);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF\u0400-\u04FF]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Resolves relative documentation links relative to the source document's directory.
 * Preserves query parameters, URL fragments, and ensures paths do not escape the doc root.
 * Returns null if the link is malicious or attempts path traversal outside the doc root.
 */
export function resolveRelativeDocLink(
  baseSlug: string | undefined,
  href: string,
  lang?: string
): string | null {
  if (!isSafeUrl(href)) {
    return null;
  }

  // Handle external URLs
  if (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:')
  ) {
    return href;
  }

  // Handle in-page anchors
  if (href.startsWith('#')) {
    return href;
  }

  // Parse path, query, and fragment cleanly
  const hashIdx = href.indexOf('#');
  const pathAndQuery = hashIdx !== -1 ? href.slice(0, hashIdx) : href;
  const hashPart = hashIdx !== -1 ? href.slice(hashIdx) : '';

  const queryIdx = pathAndQuery.indexOf('?');
  let rawPath = queryIdx !== -1 ? pathAndQuery.slice(0, queryIdx) : pathAndQuery;
  const queryPart = queryIdx !== -1 ? pathAndQuery.slice(queryIdx) : '';

  // Clean trailing .md extension
  if (rawPath.endsWith('.md')) {
    rawPath = rawPath.slice(0, -3);
  }

  let resolvedSlug: string;

  // Handle root-relative link (e.g. /docs/installation or /fa/docs/installation)
  if (rawPath.startsWith('/')) {
    let clean = rawPath.replace(/^\/+/, '');
    for (const l of ['fa', 'en', 'prs-af', 'tg']) {
      if (clean.startsWith(`${l}/docs/`)) {
        clean = clean.slice(`${l}/docs/`.length);
        break;
      }
    }
    if (clean.startsWith('docs/')) {
      clean = clean.slice(5);
    }
    const parts = clean.split('/').filter(Boolean);
    // Check for traversal in root-relative
    if (parts.some((p) => p === '..')) {
      return null;
    }
    resolvedSlug = parts.join('/') || 'index';
  } else {
    // Relative link: resolve against baseSlug's directory
    const dirParts = baseSlug ? baseSlug.split('/') : [];
    if (dirParts.length > 0) {
      dirParts.pop(); // remove file name, retain directory
    }

    const segments = rawPath.split('/');
    const targetParts = [...dirParts];

    for (const seg of segments) {
      if (seg === '.' || seg === '') {
        continue;
      } else if (seg === '..') {
        if (targetParts.length === 0) {
          // Traversal escaped documentation namespace!
          return null;
        }
        targetParts.pop();
      } else {
        targetParts.push(seg);
      }
    }

    resolvedSlug = targetParts.join('/') || 'index';
  }

  const suffix = `${queryPart}${hashPart}`;
  if (lang) {
    return `/${lang}/docs/${resolvedSlug}${suffix}`;
  }
  return `${resolvedSlug}${suffix}`;
}

/**
 * Create a secure custom Marked renderer for technical documentation.
 */
function createSecureRenderer(baseSlug?: string, lang?: string) {
  const renderer = new marked.Renderer();

  // 1. Sanitize raw HTML tags to prevent XSS injection
  renderer.html = function ({ text }) {
    return escapeHtml(text);
  };

  // 2. Safe heading with anchor links
  renderer.heading = function ({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const plainText = text.replace(/<[^>]*>/g, '');
    const id = slugify(plainText) || `heading-${depth}`;
    return `<h${depth} id="${id}" class="scroll-mt-24 group">${text} <a href="#${id}" class="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-stone-600 transition-opacity" aria-label="Link to section">#</a></h${depth}>\n`;
  };

  // 3. Safe link with protocol allowlist & directory-aware relative resolution
  renderer.link = function ({ href, title, tokens }) {
    const text = this.parser.parseInline(tokens);
    const rawHref = href || '#';

    if (!isSafeUrl(rawHref)) {
      return `<span class="text-red-500 font-mono text-xs">[unsafe link blocked]</span>`;
    }

    const isExternal =
      rawHref.startsWith('http://') ||
      rawHref.startsWith('https://') ||
      rawHref.startsWith('mailto:');

    if (isExternal) {
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
      return `<a href="${escapeHtml(rawHref)}"${titleAttr} rel="noopener noreferrer" target="_blank" class="text-[#126E68] dark:text-[#52C5BE] underline hover:opacity-80 transition-opacity">${text}</a>`;
    }

    if (rawHref.startsWith('#')) {
      return `<a href="${escapeHtml(rawHref)}" class="text-[#126E68] dark:text-[#52C5BE] underline hover:opacity-80 transition-opacity">${text}</a>`;
    }

    const resolved = resolveRelativeDocLink(baseSlug, rawHref, lang);
    if (!resolved) {
      return `<span class="text-red-500 font-mono text-xs">[unsafe link blocked]</span>`;
    }

    const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
    return `<a href="${escapeHtml(resolved)}"${titleAttr} class="text-[#126E68] dark:text-[#52C5BE] underline hover:opacity-80 transition-opacity">${text}</a>`;
  };

  // 4. Safe image renderer with scheme validation
  renderer.image = function ({ href, title, text }) {
    const rawHref = href || '';
    if (!isSafeUrl(rawHref)) {
      return `<span class="text-red-500 font-mono text-xs">[unsafe image blocked]</span>`;
    }
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
    const altAttr = text ? ` alt="${escapeHtml(text)}"` : '';
    return `<img src="${escapeHtml(rawHref)}"${altAttr}${titleAttr} class="rounded-xl max-w-full my-4" />`;
  };

  // 5. Code block with LTR direction and escaping
  renderer.code = function ({ text, lang: codeLang }) {
    const language = codeLang || 'text';
    const escaped = escapeHtml(text);
    return `<pre dir="ltr" class="p-4 rounded-xl bg-stone-900 text-stone-100 overflow-x-auto text-sm my-4 font-mono text-left"><code class="language-${escapeHtml(language)}">${escaped}</code></pre>\n`;
  };

  // 6. Inline code with escaping
  renderer.codespan = function ({ text }) {
    return `<code class="font-mono text-xs px-1.5 py-0.5 rounded bg-stone-100 dark:bg-white/10 text-[#126E68] dark:text-[#52C5BE]" dir="ltr">${escapeHtml(text)}</code>`;
  };

  return renderer;
}

export function renderMarkdownToHtml(markdown: string, baseSlug?: string, lang?: string): string {
  try {
    const renderer = createSecureRenderer(baseSlug, lang);
    const rawHtml = marked.parse(markdown, {
      renderer,
      gfm: true,
      breaks: false,
    }) as string;

    // Enhance tables with responsive overflow container
    const cleanHtml = rawHtml
      .replace(/<table>/g, '<div class="overflow-x-auto my-6 rounded-lg border border-stone-200 dark:border-white/10"><table class="min-w-full divide-y divide-stone-200 dark:divide-white/10 text-sm">')
      .replace(/<\/table>/g, '</table></div>');

    return cleanHtml;
  } catch (err) {
    console.error('Markdown rendering error:', err);
    return `<pre dir="ltr"><code>${escapeHtml(markdown)}</code></pre>`;
  }
}

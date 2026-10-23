import { marked } from 'marked';

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function isDangerousScheme(url: string): boolean {
  const trimmed = url.trim().toLowerCase();
  return (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:') ||
    trimmed.startsWith('file:')
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF\u0400-\u04FF]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Resolves relative documentation links relative to the source document's directory.
 * E.g.:
 * - In 'api/index', 'validators.md' -> 'api/validators'
 * - In 'api/index', '../tutorials/datetime.md' -> 'tutorials/datetime'
 * - In 'index', 'installation.md' -> 'installation'
 */
export function resolveRelativeDocLink(baseSlug: string | undefined, href: string): string {
  if (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('#')
  ) {
    return href;
  }

  // Split path and fragment
  const hashIdx = href.indexOf('#');
  let pathPart = hashIdx !== -1 ? href.slice(0, hashIdx) : href;
  const hashPart = hashIdx !== -1 ? href.slice(hashIdx) : '';

  if (!pathPart) return hashPart;

  // Clean trailing .md
  pathPart = pathPart.replace(/\.md$/, '');

  // Root-relative link
  if (pathPart.startsWith('/')) {
    return pathPart.replace(/^\/docs\//, '') + hashPart;
  }

  if (!baseSlug) {
    return pathPart.replace(/^\.\//, '') + hashPart;
  }

  // Split base slug into directory segments
  const baseParts = baseSlug.split('/');
  baseParts.pop(); // remove file name, retain directory

  const hrefSegments = pathPart.split('/');
  for (const seg of hrefSegments) {
    if (seg === '.' || seg === '') {
      continue;
    } else if (seg === '..') {
      if (baseParts.length > 0) {
        baseParts.pop();
      }
    } else {
      baseParts.push(seg);
    }
  }

  const resolved = baseParts.join('/');
  return resolved + hashPart;
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

  // 3. Safe link with protocol validation & directory-aware relative resolution
  renderer.link = function ({ href, title, tokens }) {
    const text = this.parser.parseInline(tokens);
    const rawHref = href || '#';

    // Reject dangerous URI schemes
    if (isDangerousScheme(rawHref)) {
      return `<span class="text-red-500 font-mono text-xs">[unsafe link blocked]</span>`;
    }

    const isExternal = rawHref.startsWith('http://') || rawHref.startsWith('https://') || rawHref.startsWith('mailto:');
    if (isExternal) {
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
      return `<a href="${escapeHtml(rawHref)}"${titleAttr} rel="noopener noreferrer" target="_blank" class="text-[#126E68] dark:text-[#52C5BE] underline hover:opacity-80 transition-opacity">${text}</a>`;
    }

    // Anchor-only link
    if (rawHref.startsWith('#')) {
      return `<a href="${escapeHtml(rawHref)}" class="text-[#126E68] dark:text-[#52C5BE] underline hover:opacity-80 transition-opacity">${text}</a>`;
    }

    // Internal document link: resolve relative to baseSlug
    const resolvedDocSlug = resolveRelativeDocLink(baseSlug, rawHref);
    const targetUrl = lang ? `/${lang}/docs/${resolvedDocSlug}` : resolvedDocSlug;
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';

    return `<a href="${escapeHtml(targetUrl)}"${titleAttr} class="text-[#126E68] dark:text-[#52C5BE] underline hover:opacity-80 transition-opacity">${text}</a>`;
  };

  // 4. Safe image renderer with scheme validation
  renderer.image = function ({ href, title, text }) {
    const rawHref = href || '';
    if (isDangerousScheme(rawHref)) {
      return `<span class="text-red-500 font-mono text-xs">[unsafe image blocked]</span>`;
    }
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
    const altAttr = text ? ` alt="${escapeHtml(text)}"` : '';
    return `<img src="${escapeHtml(rawHref)}"${altAttr}${titleAttr} class="rounded-xl max-w-full my-4" />`;
  };

  // 5. Code block with LTR direction and escaping
  renderer.code = function ({ text, lang }) {
    const language = lang || 'text';
    const escaped = escapeHtml(text);
    return `<pre dir="ltr" class="p-4 rounded-xl bg-stone-900 text-stone-100 overflow-x-auto text-sm my-4 font-mono text-left"><code class="language-${escapeHtml(language)}">${escaped}</code></pre>\n`;
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

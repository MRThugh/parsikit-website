import { marked } from 'marked';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FFáéíóúñÁÉÍÓÚÑ]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Configure marked renderer with custom heading IDs and safe links
 */
const renderer = new marked.Renderer();

renderer.heading = function ({ tokens, depth }) {
  const text = this.parser.parseInline(tokens);
  // Strip tags from text to create clean ID
  const plainText = text.replace(/<[^>]*>/g, '');
  const id = slugify(plainText) || `heading-${depth}`;
  return `<h${depth} id="${id}" class="scroll-mt-24 group">${text} <a href="#${id}" class="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-stone-600 transition-opacity" aria-label="Link to section">#</a></h${depth}>\n`;
};

renderer.link = function ({ href, title, tokens }) {
  const text = this.parser.parseInline(tokens);
  // Check for safe URL scheme
  const cleanHref = href || '#';
  const isExternal = cleanHref.startsWith('http://') || cleanHref.startsWith('https://');
  const rel = isExternal ? ' rel="noopener noreferrer" target="_blank"' : '';
  const titleAttr = title ? ` title="${title.replace(/"/g, '&quot;')}"` : '';
  return `<a href="${cleanHref}"${titleAttr}${rel} class="text-[#126E68] dark:text-[#52C5BE] underline hover:opacity-80 transition-opacity">${text}</a>`;
};

marked.use({
  renderer,
  gfm: true,
  breaks: false,
});

export function renderMarkdownToHtml(markdown: string): string {
  try {
    const rawHtml = marked.parse(markdown) as string;
    // Enhance tables with responsive overflow container
    const cleanHtml = rawHtml
      .replace(/<table>/g, '<div class="overflow-x-auto my-6 rounded-lg border border-stone-200 dark:border-white/10"><table class="min-w-full divide-y divide-stone-200 dark:divide-white/10 text-sm">')
      .replace(/<\/table>/g, '</table></div>');
    return cleanHtml;
  } catch (err) {
    console.error('Markdown rendering error:', err);
    return `<pre><code>${markdown.replace(/</g, '&lt;')}</code></pre>`;
  }
}

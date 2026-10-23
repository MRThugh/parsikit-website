import { marked } from 'marked';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF\u0400-\u04FF]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Configure marked renderer with custom heading IDs, safe links, and LTR code blocks
 */
const renderer = new marked.Renderer();

renderer.heading = function ({ tokens, depth }) {
  const text = this.parser.parseInline(tokens);
  const plainText = text.replace(/<[^>]*>/g, '');
  const id = slugify(plainText) || `heading-${depth}`;
  return `<h${depth} id="${id}" class="scroll-mt-24 group">${text} <a href="#${id}" class="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-stone-600 transition-opacity" aria-label="Link to section">#</a></h${depth}>\n`;
};

renderer.link = function ({ href, title, tokens }) {
  const text = this.parser.parseInline(tokens);
  let cleanHref = href || '#';
  const isExternal = cleanHref.startsWith('http://') || cleanHref.startsWith('https://');

  if (!isExternal) {
    cleanHref = cleanHref.replace(/^\.\//, '').replace(/\.md$/, '');
  }

  const rel = isExternal ? ' rel="noopener noreferrer" target="_blank"' : '';
  const titleAttr = title ? ` title="${title.replace(/"/g, '&quot;')}"` : '';
  return `<a href="${cleanHref}"${titleAttr}${rel} class="text-[#126E68] dark:text-[#52C5BE] underline hover:opacity-80 transition-opacity">${text}</a>`;
};

renderer.code = function ({ text, lang }) {
  const language = lang || 'text';
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<pre dir="ltr" class="p-4 rounded-xl bg-stone-900 text-stone-100 overflow-x-auto text-sm my-4 font-mono text-left"><code class="language-${language}">${escaped}</code></pre>\n`;
};

marked.use({
  renderer,
  gfm: true,
  breaks: false,
});

export function renderMarkdownToHtml(markdown: string): string {
  try {
    const rawHtml = marked.parse(markdown) as string;
    const cleanHtml = rawHtml
      .replace(/<table>/g, '<div class="overflow-x-auto my-6 rounded-lg border border-stone-200 dark:border-white/10"><table class="min-w-full divide-y divide-stone-200 dark:divide-white/10 text-sm">')
      .replace(/<\/table>/g, '</table></div>');
    return cleanHtml;
  } catch (err) {
    console.error('Markdown rendering error:', err);
    return `<pre dir="ltr"><code>${markdown.replace(/</g, '&lt;')}</code></pre>`;
  }
}

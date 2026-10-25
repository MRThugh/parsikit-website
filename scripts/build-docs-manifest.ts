import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'smol-toml';
import { getVerifiedSiteUrl, getDeploymentBasePath } from '../src/config/site';

export interface DocHeading {
  id: string;
  text: string;
  level: number;
}

export type DocCategory = 'getting-started' | 'tutorials' | 'guides' | 'api' | 'development';
export type AppLang = 'fa' | 'en' | 'prs-af' | 'tg';

export interface DocEntry {
  id: string;
  slug: string;
  lang: AppLang;
  category: DocCategory;
  title: string;
  summary: string;
  content: string;
  headings: DocHeading[];
  counterpartSlug?: string;
  counterparts?: Partial<Record<AppLang, string>>;
  filePath: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF\u0400-\u04FF]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseDocFile(filePath: string, lang: AppLang, category: DocCategory, relativePath: string): DocEntry {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const lines = raw.split('\n');

  let title = '';
  const headings: DocHeading[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('# ')) {
      if (!title) {
        title = line.replace(/^#\s+/, '').trim();
      }
      const headingText = line.replace(/^#\s+/, '').trim();
      headings.push({
        id: slugify(headingText) || `heading-${headings.length}`,
        text: headingText,
        level: 1,
      });
    } else if (line.startsWith('## ')) {
      const headingText = line.replace(/^##\s+/, '').trim();
      headings.push({
        id: slugify(headingText) || `heading-${headings.length}`,
        text: headingText,
        level: 2,
      });
    } else if (line.startsWith('### ')) {
      const headingText = line.replace(/^###\s+/, '').trim();
      headings.push({
        id: slugify(headingText) || `heading-${headings.length}`,
        text: headingText,
        level: 3,
      });
    }
  }

  if (!title) {
    title = path.basename(filePath, '.md');
  }

  // Find summary: first non-heading, non-empty paragraph
  let summary = '';
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('```') && !trimmed.startsWith('---') && !trimmed.startsWith('<') && !trimmed.startsWith('![')) {
      summary = trimmed.replace(/[*_`]/g, '').slice(0, 200);
      break;
    }
  }

  const cleanSlug = relativePath.replace(/\.md$/, '');
  const id = `${lang}-${cleanSlug.replace(/\//g, '-')}`;

  return {
    id,
    slug: cleanSlug,
    lang,
    category,
    title,
    summary,
    content: raw,
    headings,
    filePath,
  };
}

function walkDir(dir: string, cb: (file: string, rel: string) => void, base = dir) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walkDir(full, cb, base);
    } else {
      cb(full, path.relative(base, full));
    }
  }
}

function extractDocs(): DocEntry[] {
  const docs: DocEntry[] = [];
  const baseDir = path.resolve(process.cwd(), 'repo_data/docs');

  const langDirs: { dirName: string; lang: AppLang }[] = [
    { dirName: 'fa', lang: 'fa' },
    { dirName: 'en', lang: 'en' },
    { dirName: 'prs-af', lang: 'prs-af' },
    { dirName: 'tg', lang: 'tg' },
  ];

  for (const item of langDirs) {
    const fullDir = path.join(baseDir, item.dirName);
    walkDir(fullDir, (f, rel) => {
      if (!f.endsWith('.md')) return;
      let cat: DocCategory = 'getting-started';
      if (rel.startsWith('tutorials/')) cat = 'tutorials';
      else if (rel.startsWith('guides/')) cat = 'guides';
      else if (rel.startsWith('api/')) cat = 'api';
      docs.push(parseDocFile(f, item.lang, cat, rel));
    });
  }

  // Development docs
  const devDir = path.join(baseDir, 'development');
  walkDir(devDir, (f, rel) => {
    if (!f.endsWith('.md')) return;
    docs.push(parseDocFile(f, 'en', 'development', `development/${rel}`));
  });

  // Map multilingual counterparts across fa, en, prs-af, tg
  for (const doc of docs) {
    const counterparts: Partial<Record<AppLang, string>> = {};
    const matchingDocs = docs.filter((d) => d.slug === doc.slug && d.id !== doc.id);
    for (const match of matchingDocs) {
      counterparts[match.lang] = match.slug;
    }
    doc.counterparts = counterparts;

    // Set default counterpartSlug
    if (doc.lang === 'en') {
      doc.counterpartSlug = counterparts.fa || counterparts['prs-af'] || counterparts.tg;
    } else {
      doc.counterpartSlug = counterparts.en || counterparts.fa;
    }
  }

  return docs;
}

function parseChangelog() {
  const changelogPath = path.resolve(process.cwd(), 'repo_data/CHANGELOG.md');
  if (!fs.existsSync(changelogPath)) return [];
  const text = fs.readFileSync(changelogPath, 'utf-8');
  
  const sections = text.split(/(?=## \[\d+\.\d+\.\d+\])/g);
  const releases = [];

  for (const section of sections) {
    const headerMatch = section.match(/## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})/);
    if (!headerMatch) continue;

    const version = headerMatch[1];
    const date = headerMatch[2];

    const fixedMatch = section.match(/### Fixed([\s\S]*?)(?=### Added|### Changed|### Removed|---|$)/);
    const addedMatch = section.match(/### Added([\s\S]*?)(?=### Fixed|### Changed|### Removed|---|$)/);
    const changedMatch = section.match(/### Changed([\s\S]*?)(?=### Fixed|### Added|### Removed|---|$)/);

    const parseList = (block?: string | null) => {
      if (!block) return [];
      return block
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.startsWith('- '))
        .map(l => l.replace(/^- /, ''));
    };

    releases.push({
      version,
      date,
      fixed: parseList(fixedMatch ? fixedMatch[1] : null),
      added: parseList(addedMatch ? addedMatch[1] : null),
      changed: parseList(changedMatch ? changedMatch[1] : null),
      raw: section.trim(),
    });
  }

  return releases;
}

export function parsePyprojectData() {
  const pyprojectPath = path.resolve(process.cwd(), 'repo_data/pyproject.toml');
  const content = fs.readFileSync(pyprojectPath, 'utf-8');
  const parsed = parse(content) as Record<string, any>;
  const project = parsed.project || {};
  const authors = Array.isArray(project.authors) ? project.authors : [];
  const primaryAuthor = authors[0] || {};

  return {
    name: String(project.name || 'parsikit'),
    version: String(project.version || '3.3.1'),
    description: String(project.description || 'A production-grade pure Python library for Persian data infrastructure.'),
    author: String(primaryAuthor.name || 'Ali Kamrani'),
    authorEmail: String(primaryAuthor.email || ''),
    license: typeof project.license === 'object' ? String(project.license.text) : 'MIT',
    pythonRequirement: String(project['requires-python'] || '>=3.10'),
    repository: 'https://github.com/MRThugh/ParsiKit',
  };
}

function main() {
  const docs = extractDocs();
  const releases = parseChangelog();
  const project = parsePyprojectData();

  fs.mkdirSync(path.resolve(process.cwd(), 'src/data'), { recursive: true });

  // 1. Write src/data/repoMetadata.ts
  const repoMetadataCode = `/**
 * AUTO-GENERATED FROM REPOSITORY SOURCE OF TRUTH
 * Source: repo_data/pyproject.toml parsed with smol-toml, repo_data/CHANGELOG.md, repo_data/LICENSE
 */

export interface RepoMetadata {
  name: string;
  version: string;
  description: string;
  author: string;
  authorEmail: string;
  license: string;
  pythonRequirement: string;
  repository: string;
  documentationUrl: string;
  pyPiUrl: string;
  totalDocs: number;
}

export const REPO_METADATA: RepoMetadata = {
  name: ${JSON.stringify(project.name)},
  version: ${JSON.stringify(project.version)},
  description: ${JSON.stringify(project.description)},
  author: ${JSON.stringify(project.author)},
  authorEmail: ${JSON.stringify(project.authorEmail)},
  license: ${JSON.stringify(project.license)},
  pythonRequirement: ${JSON.stringify(project.pythonRequirement)},
  repository: ${JSON.stringify(project.repository)},
  documentationUrl: 'https://github.com/MRThugh/ParsiKit#readme',
  pyPiUrl: 'https://pypi.org/project/parsikit/',
  totalDocs: ${docs.length},
};
`;
  fs.writeFileSync(path.resolve(process.cwd(), 'src/data/repoMetadata.ts'), repoMetadataCode);

  // 2. Write src/data/changelogData.ts
  const changelogCode = `/**
 * AUTO-GENERATED FROM REPOSITORY CHANGELOG.md
 */

export interface ReleaseEntry {
  version: string;
  date: string;
  fixed: string[];
  added: string[];
  changed: string[];
  raw: string;
}

export const RELEASES_DATA: ReleaseEntry[] = ${JSON.stringify(releases, null, 2)};
`;
  fs.writeFileSync(path.resolve(process.cwd(), 'src/data/changelogData.ts'), changelogCode);

  // 3. Write src/data/docsManifest.ts
  const docsManifestCode = `/**
 * AUTO-GENERATED FROM REPOSITORY DOCS
 * Count: ${docs.length} documents
 */

export interface DocHeading {
  id: string;
  text: string;
  level: number;
}

export interface DocEntry {
  id: string;
  slug: string;
  lang: 'fa' | 'en' | 'prs-af' | 'tg';
  category: 'getting-started' | 'tutorials' | 'guides' | 'api' | 'development';
  title: string;
  summary: string;
  content: string;
  headings: DocHeading[];
  counterpartSlug?: string;
  counterparts?: Partial<Record<'fa' | 'en' | 'prs-af' | 'tg', string>>;
  filePath: string;
}

export const ALL_DOCS: DocEntry[] = ${JSON.stringify(docs, null, 2)};
`;
  fs.writeFileSync(path.resolve(process.cwd(), 'src/data/docsManifest.ts'), docsManifestCode);

  const siteUrl = getVerifiedSiteUrl();
  const basePath = getDeploymentBasePath();

  // Ensure public/sitemap.xml is never created in source directory (sitemap generation is strictly exclusive to scripts/prerender.ts)
  const publicSitemap = path.resolve(process.cwd(), 'public/sitemap.xml');
  if (fs.existsSync(publicSitemap)) {
    fs.unlinkSync(publicSitemap);
  }

  // Ensure public/robots.txt is clean in source tree
  const robotsTxt = `# ParsiKit robots.txt\nUser-agent: *\nAllow: /\n`;
  fs.writeFileSync(path.resolve(process.cwd(), 'public/robots.txt'), robotsTxt);

  // 5. Generate public/docs.json for machine retrieval & lightweight indexing
  const docsIndex = docs.map((d) => ({
    slug: d.slug,
    lang: d.lang,
    category: d.category,
    title: d.title,
    summary: d.summary,
    url: siteUrl
      ? `${siteUrl}${basePath}/${d.lang}/docs/${d.slug}`
      : `${basePath}/${d.lang}/docs/${d.slug}`,
  }));
  fs.writeFileSync(path.resolve(process.cwd(), 'public/docs.json'), JSON.stringify(docsIndex, null, 2));

  console.log(`Successfully generated manifest with ${docs.length} docs and ${releases.length} releases!`);
}

main();

/**
 * ParsiKit Web App Manifest Generator & URL Resolver
 * Ensures start_url, scope, and icon paths are base-path aware across root and project-site deployments.
 *
 * Project Owner & Author: Ali Kamrani (علی کامرانی)
 * Official Repo: https://github.com/MRThugh/ParsiKit
 */

import { getDeploymentBasePath } from '../config/site';

export interface WebManifestIcon {
  src: string;
  sizes: string;
  type: string;
}

export interface WebManifest {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  scope?: string;
  display: string;
  background_color: string;
  theme_color: string;
  icons: WebManifestIcon[];
}

export const DEFAULT_MANIFEST_TEMPLATE: Omit<WebManifest, 'start_url' | 'scope' | 'icons'> = {
  name: 'ParsiKit — Persian Data Infrastructure',
  short_name: 'ParsiKit',
  description: 'Production-grade pure Python library for Persian data infrastructure by Ali Kamrani.',
  display: 'standalone',
  background_color: '#FAF7F2',
  theme_color: '#126E68',
};

export const DEFAULT_MANIFEST_ICONS: WebManifestIcon[] = [
  {
    src: 'android-chrome-192x192.png',
    sizes: '192x192',
    type: 'image/png',
  },
  {
    src: 'android-chrome-512x512.png',
    sizes: '512x512',
    type: 'image/png',
  },
];

/**
 * Builds a valid, base-path aware Web Manifest.
 *
 * @param basePath - Configured deployment base path (e.g. '' for root, '/parsikit-website' for GitHub Pages)
 * @param customData - Optional overrides for manifest properties
 */
export function buildWebManifest(
  basePath: string = getDeploymentBasePath(),
  customData?: Partial<WebManifest>
): WebManifest {
  const normBase = basePath ? `/${basePath.replace(/^\/+|\/+$/g, '')}` : '';
  const prefix = normBase ? `${normBase}/` : '/';

  const baseIcons = customData?.icons || DEFAULT_MANIFEST_ICONS;

  return {
    name: customData?.name || DEFAULT_MANIFEST_TEMPLATE.name,
    short_name: customData?.short_name || DEFAULT_MANIFEST_TEMPLATE.short_name,
    description: customData?.description || DEFAULT_MANIFEST_TEMPLATE.description,
    start_url: prefix,
    scope: prefix,
    display: customData?.display || DEFAULT_MANIFEST_TEMPLATE.display,
    background_color: customData?.background_color || DEFAULT_MANIFEST_TEMPLATE.background_color,
    theme_color: customData?.theme_color || DEFAULT_MANIFEST_TEMPLATE.theme_color,
    icons: baseIcons.map((icon) => ({
      ...icon,
      src: `${prefix}${icon.src.replace(/^\/+/, '')}`,
    })),
  };
}

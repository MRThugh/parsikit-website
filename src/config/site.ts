/**
 * ParsiKit Official Website Configuration
 * Project Owner & Author: Ali Kamrani (علی کامرانی)
 * Official Library Repository: https://github.com/MRThugh/ParsiKit
 *
 * Single Source of Truth for:
 * - Public base URL / site origin (strictly verified via env var; NEVER invented)
 * - Static deployment base path (for GitHub Pages project sites or custom root domains)
 * - Official repository metadata (kept strictly separate from website deployment URL)
 */

export const OFFICIAL_REPO_URL = 'https://github.com/MRThugh/ParsiKit';
export const OFFICIAL_AUTHOR = 'Ali Kamrani';
export const OFFICIAL_AUTHOR_URL = 'https://github.com/MRThugh';

/**
 * Returns the verified public origin/base URL of the website if configured.
 * Reads from VITE_SITE_URL or SITE_URL environment variables.
 *
 * RULES:
 * 1. Never invent or hardcode a production domain (such as parsikit.dev).
 * 2. If no verified origin is provided, returns undefined.
 * 3. Never use localhost, temporary preview URLs, or the GitHub repository URL as a production canonical.
 * 4. Must be a valid absolute HTTP or HTTPS URL.
 */
export function getVerifiedSiteUrl(): string | undefined {
  let envUrl: string | undefined;

  // Node.js scripts / build environment
  if (typeof process !== 'undefined' && process.env) {
    envUrl = process.env.VITE_SITE_URL || process.env.SITE_URL;
  }

  // Vite client-side bundle
  if (!envUrl && typeof import.meta !== 'undefined' && (import.meta as any).env) {
    envUrl = (import.meta as any).env.VITE_SITE_URL || (import.meta as any).env.SITE_URL;
  }

  if (!envUrl) return undefined;

  const trimmed = String(envUrl).trim().replace(/\/+$/, '');
  if (!trimmed) return undefined;

  // Explicitly reject unverified/placeholder domain
  if (trimmed === 'https://parsikit.dev' || trimmed === 'http://parsikit.dev') {
    return undefined;
  }

  // Reject local development or temporary preview URLs
  if (
    trimmed.includes('localhost') ||
    trimmed.includes('127.0.0.1') ||
    trimmed.includes('0.0.0.0') ||
    trimmed.includes('.run.app') ||
    trimmed.includes('github.com')
  ) {
    return undefined;
  }

  // Validate format (must be absolute http:// or https://)
  if (!/^https?:\/\/[a-zA-Z0-9.-]+(:\d+)?/i.test(trimmed)) {
    return undefined;
  }

  return trimmed;
}

/**
 * Returns the static deployment base path (e.g. '' for root or '/parsikit-website' for GitHub Pages project sites).
 */
export function getDeploymentBasePath(): string {
  let envPath: string | undefined;

  if (typeof process !== 'undefined' && process.env) {
    envPath = process.env.BASE_PATH || process.env.VITE_BASE_PATH;
  }

  if (!envPath && typeof import.meta !== 'undefined' && (import.meta as any).env) {
    envPath = (import.meta as any).env.BASE_PATH || (import.meta as any).env.VITE_BASE_PATH;
  }

  if (!envPath) return '';
  const trimmed = String(envPath).trim();
  if (trimmed === '/' || !trimmed) return '';
  return `/${trimmed.replace(/^\/+/, '').replace(/\/+$/, '')}`;
}

/**
 * Checks whether a verified production origin is configured.
 */
export function hasVerifiedSiteUrl(): boolean {
  return Boolean(getVerifiedSiteUrl());
}

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
 * Normalizes a candidate base path (e.g. '/parsikit-website/' -> '/parsikit-website', '/' -> '').
 */
export function normalizeBasePath(rawPath: string | undefined): string {
  if (!rawPath) return '';
  const trimmed = String(rawPath).trim();
  if (trimmed === '/' || !trimmed) return '';
  return `/${trimmed.replace(/^\/+/, '').replace(/\/+$/, '')}`;
}

/**
 * Validates and normalizes a candidate site URL into a verified public origin.
 * Returns undefined if the URL is malformed, has unsupported schemes, embedded credentials,
 * is localhost/loopback, preview URL, repository URL, or unverified domain.
 */
export function validateAndNormalizeOrigin(rawUrl: string | undefined): string | undefined {
  if (!rawUrl) return undefined;
  const trimmed = String(rawUrl).trim();
  if (!trimmed) return undefined;

  // Reject unverified placeholder domain early
  if (trimmed === 'https://parsikit.dev' || trimmed === 'http://parsikit.dev') {
    return undefined;
  }

  try {
    const parsed = new URL(trimmed);

    // Reject unsupported protocols (only http: and https: permitted)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return undefined;
    }

    // Reject credentials embedded in URLs (e.g. https://user:pass@example.com)
    if (parsed.username || parsed.password) {
      return undefined;
    }

    const host = parsed.hostname.toLowerCase();

    // Reject localhost and IPv4/IPv6 loopback addresses
    if (
      host === 'localhost' ||
      host.endsWith('.localhost') ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host === '::1' ||
      host === '[::1]'
    ) {
      return undefined;
    }

    // Reject temporary cloud preview URLs
    if (host.endsWith('.run.app') || host.endsWith('.workers.dev')) {
      return undefined;
    }

    // Reject code repository URLs (the website is distinct from the repo)
    if (host === 'github.com' || host === 'gitlab.com' || host.endsWith('.github.com')) {
      return undefined;
    }

    // Reject unverified domain parsikit.dev
    if (host === 'parsikit.dev' || host.endsWith('.parsikit.dev')) {
      return undefined;
    }

    // Return the clean origin (protocol + host + port), without trailing slash
    return parsed.origin;
  } catch {
    return undefined;
  }
}

/**
 * Returns the verified public origin/base URL of the website if configured.
 * Reads from VITE_SITE_URL or SITE_URL environment variables.
 * Throws an Error if both variables are set but conflict.
 *
 * RULES:
 * 1. Never invent or hardcode a production domain (such as parsikit.dev).
 * 2. If no verified origin is provided, returns undefined.
 * 3. Never use localhost, temporary preview URLs, or the GitHub repository URL as a production canonical.
 * 4. Must be a valid absolute HTTP or HTTPS URL.
 */
export function getVerifiedSiteUrl(): string | undefined {
  let envSiteUrl: string | undefined;
  let envViteSiteUrl: string | undefined;

  // Node.js scripts / build environment
  if (typeof process !== 'undefined' && process.env) {
    envSiteUrl = process.env.SITE_URL;
    envViteSiteUrl = process.env.VITE_SITE_URL;
  }

  // Vite client-side bundle
  if (!envSiteUrl && !envViteSiteUrl && typeof import.meta !== 'undefined' && (import.meta as any).env) {
    envSiteUrl = (import.meta as any).env.SITE_URL;
    envViteSiteUrl = (import.meta as any).env.VITE_SITE_URL;
  }

  // Check for silent configuration conflict between SITE_URL and VITE_SITE_URL
  if (envSiteUrl && envViteSiteUrl) {
    const norm1 = validateAndNormalizeOrigin(envSiteUrl);
    const norm2 = validateAndNormalizeOrigin(envViteSiteUrl);
    if (norm1 && norm2 && norm1 !== norm2) {
      throw new Error(
        `Configuration conflict: SITE_URL ("${envSiteUrl}") and VITE_SITE_URL ("${envViteSiteUrl}") do not match.`
      );
    }
  }

  const raw = envViteSiteUrl || envSiteUrl;
  return validateAndNormalizeOrigin(raw);
}

/**
 * Returns the static deployment base path (e.g. '' for root or '/parsikit-website' for GitHub Pages project sites).
 * Throws an Error if both BASE_PATH and VITE_BASE_PATH are set but conflict.
 */
export function getDeploymentBasePath(): string {
  let envBasePath: string | undefined;
  let envViteBasePath: string | undefined;

  if (typeof process !== 'undefined' && process.env) {
    envBasePath = process.env.BASE_PATH;
    envViteBasePath = process.env.VITE_BASE_PATH;
  }

  if (!envBasePath && !envViteBasePath && typeof import.meta !== 'undefined' && (import.meta as any).env) {
    envBasePath = (import.meta as any).env.BASE_PATH;
    envViteBasePath = (import.meta as any).env.VITE_BASE_PATH;
  }

  // Check for silent configuration conflict between BASE_PATH and VITE_BASE_PATH
  if (envBasePath && envViteBasePath) {
    const norm1 = normalizeBasePath(envBasePath);
    const norm2 = normalizeBasePath(envViteBasePath);
    if (norm1 !== norm2) {
      throw new Error(
        `Configuration conflict: BASE_PATH ("${envBasePath}") and VITE_BASE_PATH ("${envViteBasePath}") do not match.`
      );
    }
  }

  const raw = envViteBasePath || envBasePath;
  return normalizeBasePath(raw);
}

/**
 * Checks whether a verified production origin is configured.
 */
export function hasVerifiedSiteUrl(): boolean {
  return Boolean(getVerifiedSiteUrl());
}


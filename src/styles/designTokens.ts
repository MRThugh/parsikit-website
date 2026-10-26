/**
 * ParsiKit Official Design System Tokens
 * Design Owner & Creator: Ali Kamrani (MRThugh)
 *
 * Distinctive Persian-inspired developer infrastructure aesthetic:
 * Light Mode: Persian Manuscript (warm parchment paper, Persian tilework, antique gold)
 * Dark Mode: Persian Night (deep teal mineral architecture, turquoise highlights, muted gold)
 */

export const SEMANTIC_PALETTES = {
  light: {
    background: '#F7F4EC',
    backgroundSecondary: '#EFE9DB',
    surface: '#FFFFFF',
    surfaceElevated: '#FAF8F3',
    textPrimary: '#202D29',
    textSecondary: '#596760',
    textMuted: '#7A8C85',
    border: '#DCD5C6',
    borderStrong: '#C5BCAF',
    primary: '#176B65',
    primaryHover: '#105650',
    primarySurface: 'rgba(23, 107, 101, 0.08)',
    accent: '#B68A3D',
    accentHover: '#9A732E',
    accentSurface: 'rgba(182, 138, 61, 0.1)',
    link: '#176B65',
    focusRing: '#176B65',
    codeBackground: '#ECEFE8',
    codeText: '#1B2925',
    success: '#28764D',
    successSurface: 'rgba(40, 118, 77, 0.1)',
    warning: '#946515',
    warningSurface: 'rgba(148, 101, 21, 0.1)',
    error: '#B33D38',
    errorSurface: 'rgba(179, 61, 56, 0.1)',
    shadow: '0 4px 20px -2px rgba(32, 45, 41, 0.06), 0 2px 6px -1px rgba(32, 45, 41, 0.04)',
    overlay: 'rgba(32, 45, 41, 0.45)',
  },
  dark: {
    background: '#0D1715',
    backgroundSecondary: '#12211E',
    surface: '#182A26',
    surfaceElevated: '#20352F',
    textPrimary: '#F0F3EC',
    textSecondary: '#B1C0B8',
    textMuted: '#788E84',
    border: '#30443D',
    borderStrong: '#445D54',
    primary: '#69C5B7',
    primaryHover: '#8AD7CB',
    primarySurface: 'rgba(105, 197, 183, 0.12)',
    accent: '#D6B36A',
    accentHover: '#E8CA88',
    accentSurface: 'rgba(214, 179, 106, 0.12)',
    link: '#69C5B7',
    focusRing: '#69C5B7',
    codeBackground: '#101D1A',
    codeText: '#E6EFEA',
    success: '#76D6A0',
    successSurface: 'rgba(118, 214, 160, 0.12)',
    warning: '#E6C078',
    warningSurface: 'rgba(230, 192, 120, 0.12)',
    error: '#FF8983',
    errorSurface: 'rgba(255, 137, 131, 0.12)',
    shadow: '0 6px 24px -2px rgba(0, 0, 0, 0.45), 0 2px 8px -1px rgba(0, 0, 0, 0.35)',
    overlay: 'rgba(5, 10, 9, 0.75)',
  },
} as const;

export const DESIGN_TOKENS = {
  colors: {
    turquoise: {
      light: '#69C5B7',
      DEFAULT: '#176B65',
      dark: '#105650',
      surface: 'rgba(23, 107, 101, 0.08)',
      glow: 'rgba(23, 107, 101, 0.22)',
    },
    lapis: {
      light: '#2E507A',
      DEFAULT: '#1D3D63',
      dark: '#132842',
    },
    saffron: {
      light: '#D6B36A',
      DEFAULT: '#B68A3D',
      dark: '#8C6724',
      surface: 'rgba(182, 138, 61, 0.1)',
    },
    parchment: {
      DEFAULT: '#F7F4EC',
      subtle: '#EFE9DB',
      card: '#FFFFFF',
      border: '#DCD5C6',
    },
    ink: {
      DEFAULT: '#202D29',
      muted: '#596760',
      surface: '#0D1715',
      card: '#182A26',
      border: '#30443D',
    },
  },
  typography: {
    fonts: {
      fa: "'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      en: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      mono: "'JetBrains Mono', 'Vazirmatn', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    },
  },
  radii: {
    sm: '0.375rem', // 6px
    md: '0.5rem',   // 8px
    lg: '0.75rem',  // 12px
    xl: '1rem',     // 16px
    '2xl': '1.25rem', // 20px
    '3xl': '1.5rem',  // 24px
  },
  touchTarget: {
    minHeight: '44px',
    minWidth: '44px',
  },
} as const;

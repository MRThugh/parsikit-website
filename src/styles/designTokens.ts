/**
 * ParsiKit Official Design System Tokens
 * Iranian-inspired developer infrastructure aesthetic:
 * - Persian Turquoise (فیروزه‌ای)
 * - Mineral / Lapis Blue (لاجوردی)
 * - Aged Gold / Saffron (زرین / زعفرانی)
 * - Warm Ivory / Parchment (نخودی)
 * - Charcoal Ink (مرکب تیره)
 */

export const DESIGN_TOKENS = {
  colors: {
    turquoise: {
      light: '#1A8780',
      DEFAULT: '#126E68',
      dark: '#0D544F',
      surface: 'rgba(18, 110, 104, 0.08)',
      glow: 'rgba(18, 110, 104, 0.25)',
    },
    lapis: {
      light: '#2A5288',
      DEFAULT: '#1D3D63',
      dark: '#142B47',
    },
    saffron: {
      light: '#E5B75E',
      DEFAULT: '#D4A03D',
      dark: '#B08027',
      surface: 'rgba(212, 160, 61, 0.1)',
    },
    parchment: {
      DEFAULT: '#FAF7F2',
      subtle: '#F4EFE6',
      card: '#FFFFFF',
      border: '#E8E2D8',
    },
    ink: {
      DEFAULT: '#121817',
      muted: '#52605E',
      surface: '#0E1413',
      card: '#151D1B',
      border: 'rgba(255, 255, 255, 0.08)',
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

/**
 * ParsiKit Number & Currency Algorithms (Pure TypeScript port of parsikit.number & parsikit.currency)
 */

export const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
export const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function toPersianDigits(input: string | number): string {
  const str = String(input);
  return str.replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export function toEnglishDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
}

const ONES = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
const TEENS = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
const TENS = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
const HUNDREDS = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
const SCALES = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون', 'کوادریلیون', 'کوینتیلیون'];

function chunkThree(numStr: string): number[] {
  const clean = numStr.replace(/^0+/, '') || '0';
  const chunks: number[] = [];
  let len = clean.length;
  while (len > 0) {
    const start = Math.max(0, len - 3);
    chunks.push(parseInt(clean.slice(start, len), 10));
    len = start;
  }
  return chunks;
}

function chunkToWords(n: number): string {
  if (n === 0) return '';
  const parts: string[] = [];

  const h = Math.floor(n / 100);
  const remainder = n % 100;

  if (h > 0) {
    parts.push(HUNDREDS[h]);
  }

  if (remainder > 0) {
    if (remainder < 10) {
      parts.push(ONES[remainder]);
    } else if (remainder < 20) {
      parts.push(TEENS[remainder - 10]);
    } else {
      const t = Math.floor(remainder / 10);
      const o = remainder % 10;
      parts.push(TENS[t]);
      if (o > 0) {
        parts.push(ONES[o]);
      }
    }
  }

  return parts.join(' و ');
}

export function numberToWords(input: number | string | bigint): string {
  const rawStr = toEnglishDigits(String(input)).trim();
  if (rawStr === '0' || rawStr === '') return 'صفر';

  const isNegative = rawStr.startsWith('-');
  const clean = isNegative ? rawStr.slice(1) : rawStr;

  if (!/^\d+$/.test(clean)) {
    return 'عدد نامعتبر';
  }

  const chunks = chunkThree(clean);
  const words: string[] = [];

  for (let i = chunks.length - 1; i >= 0; i--) {
    const chunkVal = chunks[i];
    if (chunkVal > 0) {
      const chunkWord = chunkToWords(chunkVal);
      const scale = SCALES[i];
      if (scale) {
        words.push(`${chunkWord} ${scale}`);
      } else {
        words.push(chunkWord);
      }
    }
  }

  const result = words.join(' و ');
  return isNegative ? `منفی ${result}` : result;
}

export function rialToToman(rial: number | string): number {
  const num = typeof rial === 'number' ? rial : parseInt(toEnglishDigits(rial).replace(/[^\d-]/g, ''), 10) || 0;
  return Math.floor(num / 10);
}

export function tomanToRial(toman: number | string): number {
  const num = typeof toman === 'number' ? toman : parseInt(toEnglishDigits(toman).replace(/[^\d-]/g, ''), 10) || 0;
  return num * 10;
}

export function formatPersianCurrency(amount: number | string, unit: 'تومان' | 'ریال' | 'toman' | 'rial' = 'تومان'): string {
  const num = typeof amount === 'number' ? amount : parseInt(toEnglishDigits(amount).replace(/[^\d-]/g, ''), 10) || 0;
  const formatted = Math.abs(num).toLocaleString('en-US');
  const persianDigits = toPersianDigits(formatted);
  const sign = num < 0 ? '-' : '';
  const localizedUnit = unit === 'toman' || unit === 'تومان' ? 'تومان' : 'ریال';
  return `${sign}${persianDigits} ${localizedUnit}`;
}

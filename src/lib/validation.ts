/**
 * ParsiKit Validation, Detection & Masking Algorithms (Pure TypeScript port of parsikit.validators & parsikit.models)
 */

import { toEnglishDigits } from './persianNumber';

export function isValidNationalCode(code: string): boolean {
  const clean = toEnglishDigits(code).trim().replace(/[^\d]/g, '');
  if (clean.length !== 10) return false;

  // Check repeating identical digits (0000000000, 1111111111, etc.)
  if (/^(\d)\1{9}$/.test(clean)) return false;

  const digits = clean.split('').map(Number);
  const checkDigit = digits[9];

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }

  const remainder = sum % 11;
  if (remainder < 2) {
    return checkDigit === remainder;
  }
  return checkDigit === 11 - remainder;
}

export function isValidCardNumber(cardNumber: string): boolean {
  const clean = toEnglishDigits(cardNumber).trim().replace(/[^\d]/g, '');
  if (clean.length !== 16) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

const BANK_PREFIXES: Record<string, { nameFa: string; nameEn: string; color: string }> = {
  '603799': { nameFa: 'بانک ملی ایران', nameEn: 'Bank Melli Iran', color: '#10569E' },
  '610433': { nameFa: 'بانک ملت', nameEn: 'Bank Mellat', color: '#C8102E' },
  '585983': { nameFa: 'بانک تجارت', nameEn: 'Tejarat Bank', color: '#00539F' },
  '603769': { nameFa: 'بانک صادرات ایران', nameEn: 'Bank Saderat Iran', color: '#1B365D' },
  '621986': { nameFa: 'بانک سامان', nameEn: 'Saman Bank', color: '#00A3E0' },
  '502229': { nameFa: 'بانک پاسارگاد', nameEn: 'Pasargad Bank', color: '#FDB913' },
  '627412': { nameFa: 'بانک اقتصاد نوین', nameEn: 'EN Bank', color: '#7E1C74' },
  '627353': { nameFa: 'بانک سینا', nameEn: 'Sina Bank', color: '#00857C' },
  '589210': { nameFa: 'بانک سپه', nameEn: 'Bank Sepah', color: '#B38B4D' },
  '603770': { nameFa: 'بانک کشاورزی', nameEn: 'Keshavarzi Bank', color: '#008751' },
  '628023': { nameFa: 'بانک مسکن', nameEn: 'Bank Maskan', color: '#E87722' },
  '502908': { nameFa: 'بانک توسعه تعاون', nameEn: 'Tose-e Taavon Bank', color: '#007A33' },
  '504706': { nameFa: 'بانک شهر', nameEn: 'Shahr Bank', color: '#DA291C' },
  '639346': { nameFa: 'بانک سینا', nameEn: 'Sina Bank', color: '#00857C' },
  '639607': { nameFa: 'بانک سرمایه', nameEn: 'Sarmayeh Bank', color: '#005596' },
};

export function detectBank(cardNumber: string): { nameFa: string; nameEn: string; color: string } | null {
  const clean = toEnglishDigits(cardNumber).trim().replace(/[^\d]/g, '');
  if (clean.length < 6) return null;
  const prefix = clean.slice(0, 6);
  return BANK_PREFIXES[prefix] || null;
}

export function detectMobileOperator(phone: string): { nameFa: string; nameEn: string; color: string } | null {
  let clean = toEnglishDigits(phone).trim().replace(/[^\d]/g, '');
  if (clean.startsWith('98')) clean = '0' + clean.slice(2);
  if (clean.startsWith('+98')) clean = '0' + clean.slice(3);
  if (!clean.startsWith('0') && clean.length === 10) clean = '0' + clean;

  if (clean.length < 4) return null;
  const prefix = clean.slice(0, 4);

  // MCI
  if (/^09(1\d|9[0-4])/.test(prefix)) {
    return { nameFa: 'همراه اول (MCI)', nameEn: 'Hamrah-e Aval (MCI)', color: '#00A3E0' };
  }
  // Irancell
  if (/^09(3[0-9]|0[1-5]|41)/.test(prefix)) {
    return { nameFa: 'ایرانسل (MTN Irancell)', nameEn: 'MTN Irancell', color: '#FFCC00' };
  }
  // Rightel
  if (/^09(2[0-3])/.test(prefix)) {
    return { nameFa: 'رایتل (Rightel)', nameEn: 'Rightel', color: '#880058' };
  }
  // Shatel Mobile
  if (/^0998/.test(prefix)) {
    return { nameFa: 'شاتل موبایل', nameEn: 'Shatel Mobile', color: '#FF6600' };
  }

  return null;
}

export function maskCard(cardNumber: string): string {
  const clean = toEnglishDigits(cardNumber).trim().replace(/[^\d]/g, '');
  if (clean.length !== 16) return cardNumber;
  return `${clean.slice(0, 4)}-${clean.slice(4, 6)}**-****-${clean.slice(12)}`;
}

export function maskMobile(phone: string): string {
  const clean = toEnglishDigits(phone).trim().replace(/[^\d]/g, '');
  if (clean.length === 11) {
    return `${clean.slice(0, 4)}***${clean.slice(7)}`;
  }
  if (clean.length === 10) {
    return `${clean.slice(0, 3)}***${clean.slice(6)}`;
  }
  return phone;
}

export function maskNationalCode(code: string): string {
  const clean = toEnglishDigits(code).trim().replace(/[^\d]/g, '');
  if (clean.length !== 10) return code;
  return `${clean.slice(0, 3)}***${clean.slice(6)}`;
}

export function cleanText(input: string): { cleaned: string; zwnjCount: number; replacements: number } {
  let cleaned = input;
  let replacements = 0;

  // Replace Arabic Yeh & Kaf
  const arabicYehKaf = /[يىك]/g;
  cleaned = cleaned.replace(arabicYehKaf, (match) => {
    replacements++;
    if (match === 'ي' || match === 'ى') return 'ی';
    if (match === 'ك') return 'ک';
    return match;
  });

  // Standardize multiple spaces to single space
  cleaned = cleaned.replace(/ +/g, ' ');

  // Fix ZWNJ boundaries without relying on ASCII \b:
  // "می " or "نمی " at start or after whitespace -> "می‌"
  const zwnj = '\u200C';
  cleaned = cleaned.replace(/(^|\s)(می|نمی)\s+/gu, (match, prefix, particle) => {
    replacements++;
    return `${prefix}${particle}${zwnj}`;
  });

  // Suffixes: " ها", " های", etc. -> "‌ها"
  cleaned = cleaned.replace(/\s+(ها|های|هایم|هایت|هایش|هایمان|هایتان|هایشان|تر|ترین)(?=$|\s|[.,;:!؟،])/gu, (match, suffix) => {
    replacements++;
    return `${zwnj}${suffix}`;
  });

  const zwnjCount = (cleaned.match(new RegExp(zwnj, 'g')) || []).length;

  return {
    cleaned,
    zwnjCount,
    replacements,
  };
}

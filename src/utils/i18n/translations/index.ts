import { en } from './en';
import { de } from './de';
import { es } from './es';
import { it } from './it';
import { fr } from './fr';
import type { Language } from '../types';

export const translations: Record<Language, typeof en> = {
  en,
  de,
  es,
  it,
  fr
};
import { en } from './en';
import { de } from './de';
import { es } from './es';
import { it } from './it';
import { fr } from './fr';
import { pt } from './pt';
import { nl } from './nl';
import type { Language, TranslationType } from '../types';

export const translations: Record<Language, TranslationType> = {
  en,
  de,
  es,
  it,
  fr,
  pt,
  nl
};
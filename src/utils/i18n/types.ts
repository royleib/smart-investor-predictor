export type Language = 'en' | 'de' | 'es' | 'it' | 'fr';

export const languages = {
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  it: 'Italiano',
  fr: 'Français'
};

export const defaultLanguage: Language = 'en';

export const isValidLanguage = (lang: string): lang is Language => {
  return Object.keys(languages).includes(lang);
};
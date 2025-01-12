export type Language = 'en' | 'de' | 'es' | 'it' | 'fr' | 'pt' | 'nl';

export const languages: Record<Language, string> = {
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  it: 'Italiano',
  fr: 'Français',
  pt: 'Português',
  nl: 'Nederlands'
};

export const defaultLanguage: Language = 'en';

export const isValidLanguage = (lang: string | undefined): lang is Language => {
  return lang !== undefined && Object.keys(languages).includes(lang);
};

export interface TranslationType {
  welcome: string;
  chooseInvestment: string;
  stocks: string;
  crypto: string;
  etfs: string;
  forex: string;
  indices: string;
  ai_etfs: string;
  startTrading: string;
  analysis: string;
  currentPrice: string;
  probability: string;
  signOut: string;
  email: string;
  password: string;
  signUp: string;
  signIn: string;
  error: string;
  emailAlreadyRegistered: string;
  failedToSavePrediction: string;
  unexpectedError: string;
  selectAssetType: string;
  selectMarket: string;
  selectStock: string;
  selectCrypto: string;
  us: string;
  eu: string;
  asia: string;
  predictionsFor: string;
  startTradingOn: string;
  week: string;
  month: string;
  sixMonths: string;
  year: string;
  shortTermForecast: string;
  monthlyForecast: string;
  sixMonthForecast: string;
  yearlyForecast: string;
  increase: string;
  decrease: string;
}
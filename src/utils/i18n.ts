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

export const translations = {
  en: {
    welcome: "Smart Market Predictions",
    chooseInvestment: "Choose your investment category and get AI-powered insights",
    stocks: "Trade company shares",
    crypto: "Digital assets",
    etfs: "Exchange-traded funds",
    forex: "Currency exchange",
    startTrading: "Start Trading",
    analysis: "Analysis",
    currentPrice: "Current Price",
    probability: "Probability",
    signOut: "Sign Out",
    email: "Email",
    password: "Password",
    signUp: "Sign up",
    signIn: "Sign in",
    error: "Error",
    failedToSavePrediction: "Failed to save prediction. Please try again.",
    unexpectedError: "An unexpected error occurred. Please try again.",
    selectAssetType: "Select Asset Type",
    selectMarket: "Select Market",
    selectStock: "Select Stock from",
    selectCrypto: "Select Cryptocurrency",
    us: "US Market",
    eu: "European Markets",
    asia: "Asian Markets"
  },
  de: {
    welcome: "Intelligente Marktprognosen",
    chooseInvestment: "Wählen Sie Ihre Anlagekategorie und erhalten Sie KI-gestützte Einblicke",
    stocks: "Aktien handeln",
    crypto: "Digitale Vermögenswerte",
    etfs: "Börsengehandelte Fonds",
    forex: "Devisenhandel",
    startTrading: "Handel beginnen",
    analysis: "Analyse",
    currentPrice: "Aktueller Preis",
    probability: "Wahrscheinlichkeit",
    signOut: "Abmelden",
    email: "E-Mail",
    password: "Passwort",
    signUp: "Registrieren",
    signIn: "Anmelden",
    error: "Fehler",
    failedToSavePrediction: "Fehler beim Speichern der Vorhersage. Bitte versuchen Sie es erneut.",
    unexpectedError: "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
    selectAssetType: "Wählen Sie den Anlagetyp",
    selectMarket: "Wählen Sie den Markt",
    selectStock: "Wählen Sie Aktie aus",
    selectCrypto: "Wählen Sie Kryptowährung",
    us: "US-Markt",
    eu: "Europäische Märkte",
    asia: "Asiatische Märkte"
  },
  es: {
    welcome: "Predicciones Inteligentes del Mercado",
    chooseInvestment: "Elija su categoría de inversión y obtenga información basada en IA",
    stocks: "Comerciar acciones",
    crypto: "Activos digitales",
    etfs: "Fondos cotizados",
    forex: "Cambio de divisas",
    startTrading: "Comenzar a operar",
    analysis: "Análisis",
    currentPrice: "Precio actual",
    probability: "Probabilidad",
    signOut: "Cerrar sesión",
    email: "Correo electrónico",
    password: "Contraseña",
    signUp: "Registrarse",
    signIn: "Iniciar sesión",
    error: "Error",
    failedToSavePrediction: "Error al guardar la predicción. Por favor, inténtelo de nuevo.",
    unexpectedError: "Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo.",
    selectAssetType: "Seleccione tipo de activo",
    selectMarket: "Seleccione mercado",
    selectStock: "Seleccione acción de",
    selectCrypto: "Seleccione criptomoneda",
    us: "Mercado estadounidense",
    eu: "Mercados europeos",
    asia: "Mercados asiáticos"
  },
  it: {
    welcome: "Previsioni Intelligenti del Mercato",
    chooseInvestment: "Scegli la tua categoria di investimento e ottieni approfondimenti basati sull'IA",
    stocks: "Negozia azioni",
    crypto: "Asset digitali",
    etfs: "Fondi negoziati in borsa",
    forex: "Cambio valuta",
    startTrading: "Inizia a fare trading",
    analysis: "Analisi",
    currentPrice: "Prezzo attuale",
    probability: "Probabilità",
    signOut: "Disconnetti",
    email: "Email",
    password: "Password",
    signUp: "Registrati",
    signIn: "Accedi",
    error: "Errore",
    failedToSavePrediction: "Impossibile salvare la previsione. Per favore riprova.",
    unexpectedError: "Si è verificato un errore imprevisto. Per favore riprova.",
    selectAssetType: "Seleziona tipo di asset",
    selectMarket: "Seleziona mercato",
    selectStock: "Seleziona azione da",
    selectCrypto: "Seleziona criptovaluta",
    us: "Mercato USA",
    eu: "Mercati europei",
    asia: "Mercati asiatici"
  },
  fr: {
    welcome: "Prédictions Intelligentes du Marché",
    chooseInvestment: "Choisissez votre catégorie d'investissement et obtenez des analyses basées sur l'IA",
    stocks: "Négocier des actions",
    crypto: "Actifs numériques",
    etfs: "Fonds négociés en bourse",
    forex: "Change de devises",
    startTrading: "Commencer le trading",
    analysis: "Analyse",
    currentPrice: "Prix actuel",
    probability: "Probabilité",
    signOut: "Déconnexion",
    email: "Email",
    password: "Mot de passe",
    signUp: "S'inscrire",
    signIn: "Se connecter",
    error: "Erreur",
    failedToSavePrediction: "Échec de l'enregistrement de la prédiction. Veuillez réessayer.",
    unexpectedError: "Une erreur inattendue s'est produite. Veuillez réessayer.",
    selectAssetType: "Sélectionnez le type d'actif",
    selectMarket: "Sélectionnez le marché",
    selectStock: "Sélectionnez une action de",
    selectCrypto: "Sélectionnez une cryptomonnaie",
    us: "Marché américain",
    eu: "Marchés européens",
    asia: "Marchés asiatiques"
  }
};
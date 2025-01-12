import { type Language, translations } from "@/utils/i18n";

interface LoginHeaderProps {
  lang: Language;
}

export const LoginHeader = ({ lang }: LoginHeaderProps) => {
  const t = translations[lang];
  
  return (
    <div className="space-y-2 text-center mb-8">
      <h2 className="text-2xl font-semibold tracking-tight">
        Predict Markets with AI Precision
      </h2>
      <p className="text-sm text-muted-foreground">
        Get advanced AI-powered predictions for stocks, crypto, ETFs, and forex markets. Make data-driven decisions with institutional-grade analysis.
      </p>
    </div>
  );
};
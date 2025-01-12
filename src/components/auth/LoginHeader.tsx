import { type Language, translations } from "@/utils/i18n";

interface LoginHeaderProps {
  lang: Language;
}

export const LoginHeader = ({ lang }: LoginHeaderProps) => {
  const t = translations[lang];
  
  return (
    <div className="space-y-2 text-center mb-8">
      <h2 className="text-2xl font-semibold tracking-tight">
        {t.signUp}
      </h2>
      <p className="text-sm text-muted-foreground">
        Get instant access to AI-powered market predictions
      </p>
    </div>
  );
};
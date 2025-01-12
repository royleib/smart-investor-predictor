import { type Language, translations } from "@/utils/i18n";

interface WelcomeProps {
  lang: Language;
}

export const Welcome = ({ lang }: WelcomeProps) => {
  const t = translations[lang];

  return (
    <div className="text-center space-y-4 py-8 md:py-12">
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
        {t.welcome}
      </h1>
      <p className="text-lg md:text-xl text-blue-900/70 max-w-2xl mx-auto">
        {t.chooseInvestment}
      </p>
    </div>
  );
};
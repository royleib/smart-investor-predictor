import { type Language, translations } from "@/utils/i18n";

interface LoginHeaderProps {
  lang: Language;
}

export const LoginHeader = ({ lang }: LoginHeaderProps) => {
  const t = translations[lang];
  
  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-gray-900">
        Get Started Now
      </h2>
      <p className="mt-2 text-gray-600">
        Join thousands of traders making data-driven decisions
      </p>
    </div>
  );
};
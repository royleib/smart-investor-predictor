import { motion } from "framer-motion";
import { type Language, translations } from "@/utils/i18n";

interface LoginHeaderProps {
  lang: Language;
}

export const LoginHeader = ({ lang }: LoginHeaderProps) => {
  const t = translations[lang];
  
  return (
    <div className="space-y-2 mb-8">
      <h1 className="text-3xl font-montserrat font-bold text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
        {t.startTrading}
      </h1>
      <p className="text-blue-600/80 text-center font-medium">
        {t.chooseInvestment}
      </p>
    </div>
  );
};
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Briefcase, Bitcoin, LineChart, DollarSign } from 'lucide-react';
import { motion } from "framer-motion";
import { translations, type Language } from "@/utils/i18n";

const assetTypes = [
  { id: 'Stocks', icon: Briefcase, translationKey: 'stocksDescription' },
  { id: 'Crypto', icon: Bitcoin, translationKey: 'cryptoDescription' },
  { id: 'ETFs', icon: LineChart, translationKey: 'etfsDescription' },
  { id: 'Forex', icon: DollarSign, translationKey: 'forexDescription' }
] as const;

interface AssetSelectorProps {
  onSelect: (type: string) => void;
  lang: Language;
}

export const AssetSelector = ({ onSelect, lang }: AssetSelectorProps) => {
  const t = translations[lang];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
      {assetTypes.map((type, index) => (
        <motion.div
          key={type.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card 
            className="cursor-pointer glass-effect hover-lift"
            onClick={() => onSelect(type.id)}
          >
            <CardContent className="flex items-center p-4 md:p-6">
              <div className="h-10 w-10 md:h-12 md:w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 md:mr-4 shadow-lg">
                <type.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg md:text-xl font-montserrat font-semibold text-slate-800">{t[type.id.toLowerCase() as keyof typeof t]}</h3>
                <p className="text-sm md:text-base text-slate-600">{t[type.translationKey]}</p>
              </div>
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, TrendingUp } from 'lucide-react';
import { translations, type Language } from "@/utils/i18n";

interface EUCountrySelectorProps {
  onSelect: (country: string) => void;
  lang: Language;
}

export const EUCountrySelector = ({ onSelect, lang }: EUCountrySelectorProps) => {
  const t = translations[lang];

  const getCountryTranslation = (country: string) => {
    switch (country) {
      case 'Germany':
        return t.germany;
      case 'UK':
        return t.uk;
      case 'France':
        return t.france;
      case 'Italy':
        return t.italy;
      case 'Netherlands':
        return t.netherlands;
      default:
        return country;
    }
  };

  const getCountryDescription = (country: string) => {
    switch (country) {
      case 'Germany':
        return t.germanyStocks;
      case 'UK':
        return t.ukStocks;
      case 'France':
        return t.franceStocks;
      case 'Italy':
        return t.italyStocks;
      case 'Netherlands':
        return t.netherlandsStocks;
      default:
        return `${t.view} ${country} ${t.stocks}`;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {['Germany', 'UK', 'France', 'Italy', 'Netherlands'].map((country) => (
        <Card 
          key={country}
          className="cursor-pointer bg-white/80 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all hover:scale-105"
          onClick={() => onSelect(country)}
        >
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-montserrat font-semibold text-gray-800">
                {getCountryTranslation(country)}
              </h3>
              <p className="text-sm text-gray-600">{getCountryDescription(country)}</p>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';
import { translations, type Language } from "@/utils/i18n";
import { getTradingUrl } from "@/utils/tradingUrls";

interface PredictionProps {
  symbol: string;
  currentPrice: number;
  predictions: {
    period: string;
    price: number;
    probability: number;
    trend: 'up' | 'down';
  }[];
  explanation: string;
  lang: Language;
}

export const PredictionDisplay = ({ symbol, currentPrice, predictions, explanation, lang }: PredictionProps) => {
  const t = translations[lang];

  const getPredictionExplanation = (period: string, price: number, currentPrice: number) => {
    const percentageChange = ((price - currentPrice) / currentPrice * 100).toFixed(2);
    const direction = price > currentPrice ? t.increase : t.decrease;
    
    const explanations = {
      [t.week]: t.shortTermForecast.replace('{direction}', direction).replace('{percentage}', Math.abs(Number(percentageChange)).toString()),
      [t.month]: t.monthlyForecast.replace('{direction}', direction).replace('{percentage}', Math.abs(Number(percentageChange)).toString()),
      [t.sixMonths]: t.sixMonthForecast.replace('{direction}', direction).replace('{percentage}', Math.abs(Number(percentageChange)).toString()),
      [t.year]: t.yearlyForecast.replace('{direction}', direction).replace('{percentage}', Math.abs(Number(percentageChange)).toString())
    };

    return explanations[period] || '';
  };

  const getPeriodTranslation = (period: string) => {
    const periodMap: Record<string, string> = {
      '1 Week': t.week,
      '1 Month': t.month,
      '6 Months': t.sixMonths,
      '1 Year': t.year
    };
    return periodMap[period] || period;
  };

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-4">
      <h2 className="text-xl md:text-2xl font-montserrat font-bold text-center mb-6 md:mb-8">
        {t.predictionsFor} {symbol}
      </h2>
      
      <Card className="prediction-card mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-semibold mb-2">{t.currentPrice}</h3>
        <p className="text-2xl md:text-3xl font-bold text-blue-600">${currentPrice.toFixed(2)}</p>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {predictions.map((pred) => (
          <Card key={pred.period} className="prediction-card p-4 md:p-6">
            <div className="flex justify-between items-center mb-3 md:mb-4">
              <h3 className="text-base md:text-lg font-semibold">{getPeriodTranslation(pred.period)}</h3>
              <span className={`flex items-center ${
                pred.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {pred.trend === 'up' ? <ArrowUpRight /> : <ArrowDownRight />}
              </span>
            </div>
            <div className="space-y-3 md:space-y-4">
              <div>
                <p className="text-xl md:text-2xl font-bold">${pred.price.toFixed(2)}</p>
                <p className="text-xs md:text-sm text-gray-500">
                  {t.probability}: {(pred.probability * 100).toFixed(1)}%
                </p>
              </div>
              <div className="mt-3 md:mt-4 text-sm text-gray-700">
                {getPredictionExplanation(getPeriodTranslation(pred.period), pred.price, currentPrice)}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">{t.analysis}</h3>
        <p className="text-sm md:text-base text-gray-700">{explanation}</p>
      </Card>

      <div className="mt-6 md:mt-8">
        <Button 
          className="w-full py-4 md:py-6 text-base md:text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 group"
          onClick={() => window.open(getTradingUrl(symbol), '_blank')}
        >
          {t.startTradingOn.replace('{symbol}', symbol)}
          <ExternalLink className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};
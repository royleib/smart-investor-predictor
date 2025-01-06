import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';
import { translations, type Language } from "@/utils/i18n";

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
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-montserrat font-bold text-center mb-8">
        {t.predictionsFor} {symbol}
      </h2>
      
      <Card className="prediction-card mb-6">
        <h3 className="text-lg font-semibold mb-2">{t.currentPrice}</h3>
        <p className="text-3xl font-bold text-blue-600">${currentPrice.toFixed(2)}</p>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        {predictions.map((pred) => (
          <Card key={pred.period} className="prediction-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{getPeriodTranslation(pred.period)}</h3>
              <span className={`flex items-center ${
                pred.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {pred.trend === 'up' ? <ArrowUpRight /> : <ArrowDownRight />}
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-bold">${pred.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500">
                  {t.probability}: {(pred.probability * 100).toFixed(1)}%
                </p>
              </div>
              <div className="mt-4 text-gray-700 text-sm">
                {getPredictionExplanation(getPeriodTranslation(pred.period), pred.price, currentPrice)}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">{t.analysis}</h3>
        <p className="text-gray-700">{explanation}</p>
      </Card>

      <div className="mt-8">
        <Button 
          className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 group"
          onClick={() => window.open('https://med.etoro.com/B12087_A71830_TClick.aspx', '_blank')}
        >
          {t.startTradingOn.replace('{symbol}', symbol)}
          <ExternalLink className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};
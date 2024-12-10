import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';

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
}

export const PredictionDisplay = ({ symbol, currentPrice, predictions, explanation }: PredictionProps) => {
  const getPredictionExplanation = (period: string, price: number, currentPrice: number) => {
    const percentageChange = ((price - currentPrice) / currentPrice * 100).toFixed(2);
    const direction = price > currentPrice ? 'increase' : 'decrease';
    
    const explanations = {
      '1 Week': `Based on short-term market indicators and recent trading patterns, we expect a ${direction} of ${Math.abs(Number(percentageChange))}% in the next week. This forecast considers current market sentiment and immediate technical factors.`,
      '1 Month': `Our one-month projection factors in broader market trends, upcoming sector events, and technical analysis, suggesting a ${direction} of ${Math.abs(Number(percentageChange))}%. This takes into account potential market adjustments and sector momentum.`,
      '6 Months': `Looking at a 6-month horizon, our analysis of long-term trends, market cycles, and fundamental factors points to a ${direction} of ${Math.abs(Number(percentageChange))}%. This forecast incorporates potential market developments and sector evolution.`,
      '1 Year': `Our one-year prediction shows a ${direction} of ${Math.abs(Number(percentageChange))}%, based on comprehensive analysis of market cycles, industry developments, and long-term growth potential. This considers macroeconomic factors and industry transformations.`
    };

    return explanations[period as keyof typeof explanations] || '';
  };

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-montserrat font-bold text-center mb-8">
        Predictions for {symbol}
      </h2>
      
      <Card className="prediction-card mb-6">
        <h3 className="text-lg font-semibold mb-2">Current Price</h3>
        <p className="text-3xl font-bold text-blue-600">${currentPrice.toFixed(2)}</p>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        {predictions.map((pred) => (
          <Card key={pred.period} className="prediction-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{pred.period}</h3>
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
                  Probability: {(pred.probability * 100).toFixed(1)}%
                </p>
              </div>
              <div className="mt-4 text-gray-700 text-sm">
                {getPredictionExplanation(pred.period, pred.price, currentPrice)}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Analysis</h3>
        <p className="text-gray-700">{explanation}</p>
      </Card>

      <div className="mt-8 text-center">
        <Button 
          className="gradient-bg text-white"
          onClick={() => window.open('https://med.etoro.com/B12087_A71830_TClick.aspx', '_blank')}
        >
          Start Trading on eToro <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
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
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-montserrat font-bold text-center mb-8">
        Predictions for {symbol}
      </h2>
      
      <Card className="prediction-card mb-6">
        <h3 className="text-lg font-semibold mb-2">Current Price</h3>
        <p className="text-3xl font-bold text-blue-600">${currentPrice.toFixed(2)}</p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {predictions.map((pred) => (
          <Card key={pred.period} className="prediction-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{pred.period}</h3>
              <span className={`flex items-center ${
                pred.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {pred.trend === 'up' ? <ArrowUpRight /> : <ArrowDownRight />}
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold">${pred.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">
                Probability: {(pred.probability * 100).toFixed(1)}%
              </p>
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
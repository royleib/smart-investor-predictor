import { useState } from 'react';
import { AssetSelector } from '@/components/AssetSelector';
import { MarketSelector } from '@/components/MarketSelector';
import { PredictionDisplay } from '@/components/PredictionDisplay';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [step, setStep] = useState(1);
  const [selectedAssetType, setSelectedAssetType] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const { toast } = useToast();

  // Mock data with more realistic predictions based on current AAPL price
  const mockPredictions = {
    symbol: 'AAPL',
    currentPrice: 239.59,
    predictions: [
      { period: '1 Week', price: 242.75, probability: 0.75, trend: 'up' as const },
      { period: '1 Month', price: 248.50, probability: 0.65, trend: 'up' as const },
      { period: '6 Months', price: 265.25, probability: 0.55, trend: 'up' as const },
      { period: '1 Year', price: 290.00, probability: 0.45, trend: 'up' as const },
    ],
    explanation: 'Based on strong technical indicators, positive market sentiment, and upcoming product launches, AAPL shows bullish trends. The company\'s consistent innovation and market leadership position support these predictions. Current market analysis and recent performance suggest a steady upward trajectory.',
  };

  const handleAssetTypeSelect = (type: string) => {
    setSelectedAssetType(type);
    setStep(2);
  };

  const handleMarketSelect = (market: string) => {
    setSelectedMarket(market);
    // Skip API key step and go directly to predictions
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="gradient-bg text-white py-6 mb-8">
        <h1 className="text-3xl font-montserrat font-bold text-center">
          Market Prediction AI
        </h1>
      </header>

      <main className="container mx-auto px-4 max-w-4xl">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-montserrat font-semibold mb-6 text-center">
              Select Asset Type
            </h2>
            <AssetSelector onSelect={handleAssetTypeSelect} />
          </div>
        )}

        {step === 2 && selectedAssetType === 'Stocks' && (
          <div>
            <h2 className="text-2xl font-montserrat font-semibold mb-6 text-center">
              Select Market
            </h2>
            <MarketSelector onSelect={handleMarketSelect} />
          </div>
        )}

        {step === 4 && (
          <PredictionDisplay {...mockPredictions} />
        )}
      </main>
    </div>
  );
};

export default Index;
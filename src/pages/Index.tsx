import { useState, useEffect } from 'react';
import { AssetSelector } from '@/components/AssetSelector';
import { MarketSelector } from '@/components/MarketSelector';
import { PredictionDisplay } from '@/components/PredictionDisplay';
import { useToast } from "@/components/ui/use-toast";
import axios from 'axios';

const FINNHUB_API_KEY = '4cslob0hr01qgp6njjev0cslob0hr01qgp6njjevg';

const Index = () => {
  const [step, setStep] = useState(1);
  const [selectedAssetType, setSelectedAssetType] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCurrentPrice = async () => {
      if (step === 4) {
        try {
          const response = await axios.get(
            `https://finnhub.io/api/v1/quote?symbol=AAPL&token=${FINNHUB_API_KEY}`
          );
          setCurrentPrice(response.data.c); // Current price
        } catch (error) {
          toast({
            title: "Error fetching price",
            description: "Could not fetch current price. Using fallback data.",
            variant: "destructive",
          });
          setCurrentPrice(239.59); // Fallback price
        }
      }
    };

    fetchCurrentPrice();
  }, [step, toast]);

  // Mock predictions based on current price
  const getMockPredictions = (basePrice: number) => ({
    symbol: 'AAPL',
    currentPrice: basePrice,
    predictions: [
      { period: '1 Week', price: basePrice * 1.013, probability: 0.75, trend: 'up' as const },
      { period: '1 Month', price: basePrice * 1.037, probability: 0.65, trend: 'up' as const },
      { period: '6 Months', price: basePrice * 1.107, probability: 0.55, trend: 'up' as const },
      { period: '1 Year', price: basePrice * 1.21, probability: 0.45, trend: 'up' as const },
    ],
    explanation: 'Based on strong technical indicators, positive market sentiment, and upcoming product launches, AAPL shows bullish trends. The company\'s consistent innovation and market leadership position support these predictions. Current market analysis and recent performance suggest a steady upward trajectory.',
  });

  const handleAssetTypeSelect = (type: string) => {
    setSelectedAssetType(type);
    setStep(2);
  };

  const handleMarketSelect = (market: string) => {
    setSelectedMarket(market);
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

        {step === 4 && currentPrice && (
          <PredictionDisplay {...getMockPredictions(currentPrice)} />
        )}
      </main>
    </div>
  );
};

export default Index;
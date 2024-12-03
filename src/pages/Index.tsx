import { useState } from 'react';
import { AssetSelector } from '@/components/AssetSelector';
import { MarketSelector } from '@/components/MarketSelector';
import { PredictionDisplay } from '@/components/PredictionDisplay';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [step, setStep] = useState(1);
  const [selectedAssetType, setSelectedAssetType] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  // Mock data for demonstration
  const mockPredictions = {
    symbol: 'AAPL',
    predictions: [
      { period: '1 Week', price: 185.50, probability: 0.75, trend: 'up' as const },
      { period: '1 Month', price: 190.25, probability: 0.65, trend: 'up' as const },
      { period: '6 Months', price: 205.75, probability: 0.55, trend: 'up' as const },
      { period: '1 Year', price: 225.00, probability: 0.45, trend: 'up' as const },
    ],
    explanation: 'Based on strong technical indicators, positive market sentiment, and upcoming product launches, AAPL shows bullish trends. The company\'s consistent innovation and market leadership position support these predictions.',
  };

  const handleAssetTypeSelect = (type: string) => {
    setSelectedAssetType(type);
    setStep(2);
  };

  const handleMarketSelect = (market: string) => {
    setSelectedMarket(market);
    setStep(3);
  };

  const handleApiKeySubmit = () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Finnhub API key to continue.",
        variant: "destructive",
      });
      return;
    }
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

        {step === 3 && (
          <div className="max-w-md mx-auto space-y-4">
            <h2 className="text-2xl font-montserrat font-semibold mb-6 text-center">
              Enter Your Finnhub API Key
            </h2>
            <Input
              type="password"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full"
            />
            <Button 
              onClick={handleApiKeySubmit}
              className="w-full gradient-bg text-white"
            >
              Continue
            </Button>
            <p className="text-sm text-gray-500 text-center">
              Get your API key at{' '}
              <a 
                href="https://finnhub.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Finnhub.io
              </a>
            </p>
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
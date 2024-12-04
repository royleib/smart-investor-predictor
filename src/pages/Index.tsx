import { useState, useEffect } from 'react';
import { AssetSelector } from '@/components/AssetSelector';
import { MarketSelector } from '@/components/MarketSelector';
import { StockSelector } from '@/components/StockSelector';
import { PredictionDisplay } from '@/components/PredictionDisplay';
import { useToast } from "@/components/ui/use-toast";
import axios from 'axios';

const ALPHA_VANTAGE_API_KEY = 'XLLX4SPDO7AUDSG3';

const Index = () => {
  const [step, setStep] = useState(1);
  const [selectedAssetType, setSelectedAssetType] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCurrentPrice = async () => {
      if (step === 5 && selectedSymbol) {
        try {
          console.log('Fetching price for:', selectedSymbol);
          const response = await axios.get('https://www.alphavantage.co/query', {
            params: {
              function: 'GLOBAL_QUOTE',
              symbol: selectedSymbol,
              apikey: ALPHA_VANTAGE_API_KEY
            }
          });
          
          console.log('API Response:', response.data);
          
          if (response.data['Global Quote'] && response.data['Global Quote']['05. price']) {
            const price = parseFloat(response.data['Global Quote']['05. price']);
            console.log('Setting current price to:', price);
            setCurrentPrice(price);
          } else {
            throw new Error('Invalid price data received');
          }
        } catch (error) {
          console.error('Error fetching price:', error);
          toast({
            title: "Error fetching price",
            description: "Could not fetch current price. Using fallback data.",
            variant: "destructive",
          });
          // Updated fallback prices as of the latest market data
          const fallbackPrices = {
            'AAPL': 191.45,
            'MSFT': 378.85,
            'GOOGL': 134.99,
            'AMZN': 147.03,
            'META': 325.28,
            'TSLA': 238.45
          };
          setCurrentPrice(fallbackPrices[selectedSymbol as keyof typeof fallbackPrices] || 100);
        }
      }
    };

    fetchCurrentPrice();
  }, [step, selectedSymbol, toast]);

  const getMockPredictions = (basePrice: number) => ({
    symbol: selectedSymbol,
    currentPrice: basePrice,
    predictions: [
      { period: '1 Week', price: basePrice * 1.013, probability: 0.75, trend: 'up' as const },
      { period: '1 Month', price: basePrice * 1.037, probability: 0.65, trend: 'up' as const },
      { period: '6 Months', price: basePrice * 1.107, probability: 0.55, trend: 'up' as const },
      { period: '1 Year', price: basePrice * 1.21, probability: 0.45, trend: 'up' as const },
    ],
    explanation: `Based on strong technical indicators, positive market sentiment, and upcoming developments, ${selectedSymbol} shows bullish trends. The company's consistent performance and market position support these predictions. Current market analysis and recent performance suggest a steady upward trajectory.`,
  });

  const handleAssetTypeSelect = (type: string) => {
    setSelectedAssetType(type);
    setStep(2);
  };

  const handleMarketSelect = (market: string) => {
    setSelectedMarket(market);
    setStep(3);
  };

  const handleStockSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
    setStep(5);
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

        {step === 3 && selectedMarket === 'US' && (
          <div>
            <h2 className="text-2xl font-montserrat font-semibold mb-6 text-center">
              Select Stock
            </h2>
            <StockSelector onSelect={handleStockSelect} />
          </div>
        )}

        {step === 5 && currentPrice && (
          <PredictionDisplay {...getMockPredictions(currentPrice)} />
        )}
      </main>
    </div>
  );
};

export default Index;
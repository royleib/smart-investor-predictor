import { useState, useEffect } from 'react';
import { AssetSelector } from '@/components/AssetSelector';
import { MarketSelector } from '@/components/MarketSelector';
import { StockSelector } from '@/components/StockSelector';
import { CryptoSelector } from '@/components/CryptoSelector';
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
          console.log('Fetching price for:', selectedSymbol, 'Type:', selectedAssetType);
          
          if (selectedAssetType === 'Crypto') {
            const response = await axios.get('https://www.alphavantage.co/query', {
              params: {
                function: 'CURRENCY_EXCHANGE_RATE',
                from_currency: selectedSymbol,
                to_currency: 'USD',
                apikey: ALPHA_VANTAGE_API_KEY
              }
            });
            
            console.log('Crypto API Response:', response.data);
            
            if (response.data['Realtime Currency Exchange Rate'] && 
                response.data['Realtime Currency Exchange Rate']['5. Exchange Rate']) {
              const price = parseFloat(response.data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
              console.log('Setting current crypto price to:', price);
              setCurrentPrice(price);
            } else {
              throw new Error('Invalid crypto price data received');
            }
          } else {
            const response = await axios.get('https://www.alphavantage.co/query', {
              params: {
                function: 'GLOBAL_QUOTE',
                symbol: selectedSymbol,
                apikey: ALPHA_VANTAGE_API_KEY
              }
            });
            
            console.log('Stock API Response:', response.data);
            
            if (response.data['Global Quote'] && response.data['Global Quote']['05. price']) {
              const price = parseFloat(response.data['Global Quote']['05. price']);
              console.log('Setting current stock price to:', price);
              setCurrentPrice(price);
            } else {
              throw new Error('Invalid stock price data received');
            }
          }
        } catch (error) {
          console.error('Error fetching price:', error);
          toast({
            title: "Error fetching price",
            description: "Could not fetch current price. Using fallback data.",
            variant: "destructive",
          });
          
          const fallbackPrices: Record<string, number> = {
            // Stocks - US
            'AAPL': 191.45,
            'MSFT': 378.85,
            'GOOGL': 134.99,
            'AMZN': 147.03,
            'META': 325.28,
            'TSLA': 238.45,
            // Stocks - EU
            'ASML.AMS': 687.30,
            'SAP.FRA': 145.78,
            'LVMH.PAR': 834.50,
            'SIE.FRA': 165.92,
            'NOVO-B.CPH': 725.40,
            'SHELL.LON': 2543.50,
            // Stocks - ASIA
            '9984.TYO': 6789.00,
            '005930.KRX': 71500.00,
            '9988.HKG': 72.55,
            '000660.KRX': 125000.00,
            '7203.TYO': 2825.50,
            '1299.HKG': 67.85,
            // Crypto
            'BTC': 43250.00,
            'ETH': 2280.50,
            'USDT': 1.00,
            'BNB': 305.75,
            'SOL': 98.45,
            'XRP': 0.55,
          };
          setCurrentPrice(fallbackPrices[selectedSymbol] || 100);
        }
      }
    };

    fetchCurrentPrice();
  }, [step, selectedSymbol, selectedAssetType, toast]);

  const getMockPredictions = (basePrice: number) => {
    const getRandomTrend = () => Math.random() > 0.5 ? 'up' as const : 'down' as const;
    
    const getExplanation = () => {
      if (selectedAssetType === 'Crypto') {
        return `Analysis for ${selectedSymbol}: The cryptocurrency market shows ${getRandomTrend() === 'up' ? 'positive' : 'negative'} momentum. 
        Key factors include: regulatory developments in major markets, institutional adoption trends, network activity metrics, and overall market sentiment. 
        Technical indicators suggest ${getRandomTrend() === 'up' ? 'potential breakthrough of resistance levels' : 'testing of support levels'}. 
        Consider market volatility and global economic factors affecting digital assets.`;
      } else {
        return `Analysis for ${selectedSymbol}: Based on comprehensive market research including:
        1. Financial Performance: Recent ${getRandomTrend() === 'up' ? 'strong' : 'mixed'} quarterly results
        2. Industry Trends: ${getRandomTrend() === 'up' ? 'Growing' : 'Challenging'} market conditions
        3. Economic Indicators: Impact of interest rates and inflation
        4. Technical Analysis: ${getRandomTrend() === 'up' ? 'Bullish' : 'Bearish'} momentum indicators
        5. Market Sentiment: ${getRandomTrend() === 'up' ? 'Positive' : 'Cautious'} institutional investor outlook`;
      }
    };

    const predictions = [
      {
        period: '1 Week',
        price: basePrice * (1 + (Math.random() * 0.04 - 0.02)), // ±2%
        probability: 0.75 + (Math.random() * 0.1),
        trend: getRandomTrend()
      },
      {
        period: '1 Month',
        price: basePrice * (1 + (Math.random() * 0.08 - 0.04)), // ±4%
        probability: 0.65 + (Math.random() * 0.1),
        trend: getRandomTrend()
      },
      {
        period: '6 Months',
        price: basePrice * (1 + (Math.random() * 0.16 - 0.08)), // ±8%
        probability: 0.55 + (Math.random() * 0.1),
        trend: getRandomTrend()
      },
      {
        period: '1 Year',
        price: basePrice * (1 + (Math.random() * 0.24 - 0.12)), // ±12%
        probability: 0.45 + (Math.random() * 0.1),
        trend: getRandomTrend()
      }
    ];

    return {
      symbol: selectedSymbol,
      currentPrice: basePrice,
      predictions,
      explanation: getExplanation()
    };
  };

  const handleAssetTypeSelect = (type: string) => {
    setSelectedAssetType(type);
    if (type === 'Crypto') {
      setStep(4);
    } else {
      setStep(2);
    }
  };

  const handleMarketSelect = (market: string) => {
    setSelectedMarket(market);
    setStep(3);
  };

  const handleStockSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
    setStep(5);
  };

  const handleCryptoSelect = (symbol: string) => {
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

        {step === 3 && selectedMarket && (
          <div>
            <h2 className="text-2xl font-montserrat font-semibold mb-6 text-center">
              Select Stock
            </h2>
            <StockSelector onSelect={handleStockSelect} market={selectedMarket} />
          </div>
        )}

        {step === 4 && selectedAssetType === 'Crypto' && (
          <div>
            <h2 className="text-2xl font-montserrat font-semibold mb-6 text-center">
              Select Cryptocurrency
            </h2>
            <CryptoSelector onSelect={handleCryptoSelect} />
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

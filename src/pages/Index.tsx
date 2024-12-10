import { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { StockSelector } from '@/components/StockSelector';
import { CryptoSelector } from '@/components/CryptoSelector';
import { AssetSelector } from '@/components/AssetSelector';
import { PredictionDisplay } from '@/components/PredictionDisplay';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const Index = () => {
  const [session, setSession] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [selectedAssetType, setSelectedAssetType] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
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

  const handleSymbolSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
    setStep(5); // Add new step for showing predictions
  };

  // Mock data for predictions - in a real app, this would come from an API
  const mockPredictionData = {
    currentPrice: 150.25,
    predictions: [
      {
        period: '1 Week',
        price: 155.75,
        probability: 0.65,
        trend: 'up' as const,
      },
      {
        period: '1 Month',
        price: 162.30,
        probability: 0.58,
        trend: 'up' as const,
      },
      {
        period: '6 Months',
        price: 145.80,
        probability: 0.62,
        trend: 'down' as const,
      },
      {
        period: '1 Year',
        price: 180.45,
        probability: 0.70,
        trend: 'up' as const,
      },
    ],
    explanation: 'Based on our analysis of market trends, technical indicators, and fundamental factors, we predict a generally positive trajectory for this asset. The short-term outlook shows potential volatility, but long-term indicators suggest strong growth potential.',
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-montserrat font-bold text-center mb-2 text-blue-900">
                Market Prediction AI
              </h1>
              <p className="text-gray-600 text-center mb-8">
                Sign in to access advanced market predictions powered by artificial intelligence
              </p>
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: '#1E3A8A',
                        brandAccent: '#2563EB',
                      },
                    },
                  },
                }}
                providers={[]}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-6 px-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-montserrat font-bold">
            Market Prediction AI
          </h1>
          <Button 
            variant="outline" 
            className="text-white border-white hover:bg-white/10"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-montserrat font-semibold mb-6 text-center text-blue-900">
              Select Asset Type
            </h2>
            <AssetSelector onSelect={handleAssetTypeSelect} />
          </div>
        )}

        {step === 2 && selectedAssetType === 'Stocks' && (
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-montserrat font-semibold mb-6 text-center text-blue-900">
              Select Market
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['US', 'EU', 'ASIA'].map((market) => (
                <button
                  key={market}
                  onClick={() => handleMarketSelect(market)}
                  className="prediction-card hover:shadow-xl"
                >
                  <h3 className="text-xl font-montserrat font-semibold text-blue-900">{market}</h3>
                  <p className="text-gray-600 mt-2">{market} Market</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && selectedMarket && (
          <div className="bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-montserrat font-semibold p-6 text-center text-blue-900">
              Select Stock from {selectedMarket} Market
            </h2>
            <StockSelector onSelect={handleSymbolSelect} market={selectedMarket} />
          </div>
        )}

        {step === 4 && selectedAssetType === 'Crypto' && (
          <div className="bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-montserrat font-semibold p-6 text-center text-blue-900">
              Select Cryptocurrency
            </h2>
            <CryptoSelector onSelect={handleSymbolSelect} />
          </div>
        )}

        {step === 5 && selectedSymbol && (
          <PredictionDisplay
            symbol={selectedSymbol}
            currentPrice={mockPredictionData.currentPrice}
            predictions={mockPredictionData.predictions}
            explanation={mockPredictionData.explanation}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { AssetSelector } from '@/components/AssetSelector';
import { MarketSelector } from '@/components/MarketSelector';
import { StockSelector } from '@/components/StockSelector';
import { CryptoSelector } from '@/components/CryptoSelector';
import { PredictionDisplay } from '@/components/PredictionDisplay';
import { PriceDataFetcher } from '@/components/prediction/PriceDataFetcher';
import { generatePredictions } from '@/components/prediction/PredictionGenerator';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const Index = () => {
  const [step, setStep] = useState(1);
  const [selectedAssetType, setSelectedAssetType] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();

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

  const handleStockSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
    setStep(5);
  };

  const handleCryptoSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
    setStep(5);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <h1 className="text-4xl font-montserrat font-bold text-center mb-2 text-blue-900">
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
        <PriceDataFetcher
          step={step}
          selectedSymbol={selectedSymbol}
          selectedAssetType={selectedAssetType}
          setCurrentPrice={setCurrentPrice}
        />

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
            <MarketSelector onSelect={handleMarketSelect} />
          </div>
        )}

        {step === 3 && selectedMarket && (
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-montserrat font-semibold mb-6 text-center text-blue-900">
              Select Stock
            </h2>
            <StockSelector onSelect={handleStockSelect} market={selectedMarket} />
          </div>
        )}

        {step === 4 && selectedAssetType === 'Crypto' && (
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-montserrat font-semibold mb-6 text-center text-blue-900">
              Select Cryptocurrency
            </h2>
            <CryptoSelector onSelect={handleCryptoSelect} />
          </div>
        )}

        {step === 5 && currentPrice && (
          <PredictionDisplay {...generatePredictions(currentPrice, selectedSymbol, selectedAssetType)} />
        )}
      </main>
    </div>
  );
};

export default Index;
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { StockSelector } from '@/components/StockSelector';
import { CryptoSelector } from '@/components/CryptoSelector';
import { AssetSelector } from '@/components/AssetSelector';
import { PredictionDisplay } from '@/components/PredictionDisplay';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { LoginPage } from '@/components/auth/LoginPage';
import { PriceDataFetcher } from '@/components/prediction/PriceDataFetcher';
import { generatePredictions } from '@/components/prediction/PredictionGenerator';

const Index = () => {
  const [session, setSession] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [selectedAssetType, setSelectedAssetType] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

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
    setStep(5);
  };

  if (!session) {
    return <LoginPage />;
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

        {step === 5 && selectedSymbol && currentPrice && (
          <PredictionDisplay
            {...generatePredictions(currentPrice, selectedSymbol, selectedAssetType)}
          />
        )}
      </main>
    </div>
  );
};

export default Index;

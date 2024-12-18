import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { StockSelector } from '@/components/StockSelector';
import { CryptoSelector } from '@/components/CryptoSelector';
import { AssetSelector } from '@/components/AssetSelector';
import { PredictionDisplay } from '@/components/PredictionDisplay';
import { Button } from '@/components/ui/button';
import { LogOut, TrendingUp, Globe, Award } from 'lucide-react';
import { LoginPage } from '@/components/auth/LoginPage';
import { PriceDataFetcher } from '@/components/prediction/PriceDataFetcher';
import { generatePredictions } from '@/components/prediction/PredictionGenerator';
import { PredictionLimitAlert } from '@/components/prediction/PredictionLimitAlert';
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [session, setSession] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [selectedAssetType, setSelectedAssetType] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const { toast } = useToast();

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

  const handleSymbolSelect = async (symbol: string) => {
    if (session?.user) {
      const { count } = await supabase
        .from('user_predictions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

      if (count !== null && count >= 2) {
        setShowLimitAlert(true);
        return;
      }

      // Insert the prediction
      const { error } = await supabase
        .from('user_predictions')
        .insert([{ user_id: session.user.id, symbol }]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to save prediction. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }

    setSelectedSymbol(symbol);
    setStep(5);
  };

  if (!session) {
    return <LoginPage />;
  }

  const renderFeatures = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 px-4">
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all">
        <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <TrendingUp className="h-6 w-6 text-purple-600" />
        </div>
        <h3 className="text-xl font-montserrat font-semibold mb-2">Smart Predictions</h3>
        <p className="text-gray-600">Advanced AI algorithms for accurate market predictions</p>
      </div>
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all">
        <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <Globe className="h-6 w-6 text-purple-600" />
        </div>
        <h3 className="text-xl font-montserrat font-semibold mb-2">Global Markets</h3>
        <p className="text-gray-600">Access predictions for markets worldwide</p>
      </div>
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all">
        <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <Award className="h-6 w-6 text-purple-600" />
        </div>
        <h3 className="text-xl font-montserrat font-semibold mb-2">Expert Analysis</h3>
        <p className="text-gray-600">Professional-grade market insights</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9b87f5] via-[#7E69AB] to-[#D6BCFA]">
      {showLimitAlert && (
        <PredictionLimitAlert 
          userId={session.user.id} 
          onClose={() => setShowLimitAlert(false)} 
        />
      )}
      
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 text-white py-6 px-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-montserrat font-bold">
            Market Prediction AI
          </h1>
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/20"
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
          <div className="space-y-8">
            <div className="text-center text-white mb-12">
              <h2 className="text-4xl font-montserrat font-bold mb-4">
                Welcome to Smart Market Predictions
              </h2>
              <p className="text-xl opacity-90">
                Choose your investment category and get AI-powered insights
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-montserrat font-semibold mb-6 text-center text-white">
                Select Asset Type
              </h2>
              <AssetSelector onSelect={handleAssetTypeSelect} />
            </div>
            {renderFeatures()}
          </div>
        )}

        {step === 2 && selectedAssetType === 'Stocks' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-montserrat font-semibold mb-6 text-center text-white">
              Select Market
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['US', 'EU', 'ASIA'].map((market) => (
                <button
                  key={market}
                  onClick={() => handleMarketSelect(market)}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  <h3 className="text-xl font-montserrat font-semibold text-gray-800">{market}</h3>
                  <p className="text-gray-600 mt-2">{market} Market</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && selectedMarket && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
            <h2 className="text-2xl font-montserrat font-semibold p-6 text-center text-white">
              Select Stock from {selectedMarket} Market
            </h2>
            <StockSelector onSelect={handleSymbolSelect} market={selectedMarket} />
          </div>
        )}

        {step === 4 && selectedAssetType === 'Crypto' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
            <h2 className="text-2xl font-montserrat font-semibold p-6 text-center text-white">
              Select Cryptocurrency
            </h2>
            <CryptoSelector onSelect={handleSymbolSelect} />
          </div>
        )}

        {step === 5 && selectedSymbol && currentPrice && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
            <PredictionDisplay
              {...generatePredictions(currentPrice, selectedSymbol, selectedAssetType)}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { StockSelector } from '@/components/StockSelector';
import { CryptoSelector } from '@/components/CryptoSelector';
import { AssetSelector } from '@/components/AssetSelector';
import { PredictionDisplay } from '@/components/PredictionDisplay';
import { LoginPage } from '@/components/auth/LoginPage';
import { PriceDataFetcher } from '@/components/prediction/PriceDataFetcher';
import { generatePredictions } from '@/components/prediction/PredictionGenerator';
import { PredictionLimitAlert } from '@/components/prediction/PredictionLimitAlert';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { Features } from '@/components/home/Features';
import { Header } from '@/components/home/Header';
import { Welcome } from '@/components/home/Welcome';

const Index = () => {
  const [session, setSession] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [selectedAssetType, setSelectedAssetType] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (!currentSession) {
        handleSignOut();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (_event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
      
      if (_event === 'SIGNED_OUT') {
        setSession(null);
        setStep(1);
        setSelectedAssetType('');
        setSelectedMarket('');
        setSelectedSymbol('');
        setCurrentPrice(null);
        navigate('/');
      }

      setSession(currentSession);
      
      if (!currentSession) {
        handleSignOut();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
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
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to continue.",
        variant: "destructive",
      });
      handleSignOut();
      return;
    }

    try {
      const { count } = await supabase
        .from('user_predictions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

      if (count !== null && count >= 2) {
        setShowLimitAlert(true);
        return;
      }

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

      setSelectedSymbol(symbol);
      setStep(5);
    } catch (error) {
      console.error('Error handling symbol selection:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!session) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#3B82F6]">
      {showLimitAlert && (
        <PredictionLimitAlert 
          userId={session.user.id} 
          onClose={() => setShowLimitAlert(false)} 
        />
      )}
      
      <Header onSignOut={handleSignOut} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <PriceDataFetcher
          step={step}
          selectedSymbol={selectedSymbol}
          selectedAssetType={selectedAssetType}
          setCurrentPrice={setCurrentPrice}
        />

        {step === 1 && (
          <div className="space-y-8">
            <Welcome />
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-montserrat font-semibold mb-6 text-center text-white">
                Select Asset Type
              </h2>
              <AssetSelector onSelect={handleAssetTypeSelect} />
            </div>
            <Features />
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
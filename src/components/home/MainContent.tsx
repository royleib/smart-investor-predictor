import { useState } from 'react';
import { AssetSelector } from '@/components/AssetSelector';
import { StockSelector } from '@/components/StockSelector';
import { CryptoSelector } from '@/components/CryptoSelector';
import { PredictionDisplay } from '@/components/PredictionDisplay';
import { PriceDataFetcher } from '@/components/prediction/PriceDataFetcher';
import { PredictionLimitAlert } from '@/components/prediction/PredictionLimitAlert';
import { generatePredictions } from '@/components/prediction/PredictionGenerator';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Welcome } from '@/components/home/Welcome';
import { type Language } from "@/utils/i18n";

interface MainContentProps {
  step: number;
  setStep: (step: number) => void;
  session: any;
  lang: Language;
}

export const MainContent = ({ step, setStep, session, lang }: MainContentProps) => {
  const [selectedAssetType, setSelectedAssetType] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const { toast } = useToast();

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

  return (
    <>
      {showLimitAlert && (
        <PredictionLimitAlert 
          userId={session.user.id} 
          onClose={() => setShowLimitAlert(false)} 
        />
      )}
      
      <PriceDataFetcher
        step={step}
        selectedSymbol={selectedSymbol}
        selectedAssetType={selectedAssetType}
        setCurrentPrice={setCurrentPrice}
      />

      {step === 1 && (
        <div className="space-y-8">
          <Welcome lang={lang} />
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-montserrat font-semibold mb-6 text-center text-gray-900">
              Select Asset Type
            </h2>
            <AssetSelector onSelect={handleAssetTypeSelect} />
          </div>
        </div>
      )}

      {step === 2 && selectedAssetType === 'Stocks' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-montserrat font-semibold mb-6 text-center text-gray-900">
            Select Market
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['US', 'EU', 'ASIA'].map((market) => (
              <button
                key={market}
                onClick={() => handleMarketSelect(market)}
                className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transform hover:scale-[1.01] transition-all border border-gray-200"
              >
                <h3 className="text-xl font-montserrat font-semibold text-gray-900">{market}</h3>
                <p className="text-gray-600 mt-2">{market} Market</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && selectedMarket && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-2xl font-montserrat font-semibold p-6 text-center text-gray-900">
            Select Stock from {selectedMarket} Market
          </h2>
          <StockSelector onSelect={handleSymbolSelect} market={selectedMarket} />
        </div>
      )}

      {step === 4 && selectedAssetType === 'Crypto' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-2xl font-montserrat font-semibold p-6 text-center text-gray-900">
            Select Cryptocurrency
          </h2>
          <CryptoSelector onSelect={handleSymbolSelect} />
        </div>
      )}

      {step === 5 && selectedSymbol && currentPrice && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <PredictionDisplay
            {...generatePredictions(currentPrice, selectedSymbol, selectedAssetType)}
          />
        </div>
      )}
    </>
  );
};
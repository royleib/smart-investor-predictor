import { AssetSelector } from '@/components/AssetSelector';
import { StockSelector } from '@/components/StockSelector';
import { CryptoSelector } from '@/components/CryptoSelector';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { translations, type Language } from "@/utils/i18n";

interface AssetSelectionStepsProps {
  step: number;
  selectedAssetType: string;
  selectedMarket: string;
  setSelectedAssetType: (type: string) => void;
  setSelectedMarket: (market: string) => void;
  setSelectedSymbol: (symbol: string) => void;
  setStep: (step: number) => void;
  session: any;
  lang: Language;
}

export const AssetSelectionSteps = ({
  step,
  selectedAssetType,
  selectedMarket,
  setSelectedAssetType,
  setSelectedMarket,
  setSelectedSymbol,
  setStep,
  session,
  lang
}: AssetSelectionStepsProps) => {
  const { toast } = useToast();
  const t = translations[lang];

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
        toast({
          title: t.error || "Error",
          description: t.limitReached || "You've reached the prediction limit.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('user_predictions')
        .insert([{ user_id: session.user.id, symbol }]);

      if (error) {
        toast({
          title: t.error || "Error",
          description: t.failedToSavePrediction || "Failed to save prediction. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setSelectedSymbol(symbol);
      setStep(5);
    } catch (error) {
      console.error('Error handling symbol selection:', error);
      toast({
        title: t.error || "Error",
        description: t.unexpectedError || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {step === 1 && (
        <div className="space-y-6 sm:space-y-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-montserrat font-semibold mb-6 text-center text-gray-900">
              {t.selectAssetType}
            </h2>
            <AssetSelector onSelect={handleAssetTypeSelect} lang={lang} />
          </div>
        </div>
      )}

      {step === 2 && selectedAssetType === 'Stocks' && (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-montserrat font-semibold mb-6 text-center text-gray-900">
            {t.selectMarket}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {['US', 'EU', 'ASIA'].map((market) => (
              <button
                key={market}
                onClick={() => handleMarketSelect(market)}
                className="bg-gray-50 p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transform hover:scale-[1.01] transition-all border border-gray-200"
              >
                <h3 className="text-lg sm:text-xl font-montserrat font-semibold text-gray-900">{market}</h3>
                <p className="text-sm sm:text-base text-gray-600 mt-2">{t[market.toLowerCase() as keyof typeof t] || `${market} Market`}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && selectedMarket && (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl sm:text-2xl font-montserrat font-semibold p-4 sm:p-6 text-center text-gray-900">
            {t.selectStock} {selectedMarket}
          </h2>
          <StockSelector onSelect={handleSymbolSelect} market={selectedMarket} />
        </div>
      )}

      {step === 4 && selectedAssetType === 'Crypto' && (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl sm:text-2xl font-montserrat font-semibold p-4 sm:p-6 text-center text-gray-900">
            {t.selectCrypto}
          </h2>
          <CryptoSelector onSelect={handleSymbolSelect} />
        </div>
      )}
    </>
  );
};
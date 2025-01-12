import { AssetSelector } from '@/components/AssetSelector';
import { StockSelector } from '@/components/StockSelector';
import { CryptoSelector } from '@/components/CryptoSelector';
import { ETFSelector } from '@/components/ETFSelector';
import { AIETFSelector } from '@/components/AIETFSelector';
import { IndicesSelector } from '@/components/IndicesSelector';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { translations, type Language } from "@/utils/i18n";
import { useState } from 'react';
import { PredictionLimitAlert } from '../prediction/PredictionLimitAlert';

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
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAssetTypeSelect = (type: string) => {
    setSelectedAssetType(type);
    if (type === 'Crypto' || type === 'ETFs' || type === 'AI_ETFs' || type === 'Indices') {
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
    setSelectedSymbol(symbol);
    setStep(5);
  };

  return (
    <>
      {showLimitAlert && (
        <PredictionLimitAlert 
          userId={session?.user?.id} 
          onClose={() => setShowLimitAlert(false)} 
        />
      )}

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
                disabled={isLoading}
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

      {step === 4 && selectedAssetType === 'ETFs' && (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl sm:text-2xl font-montserrat font-semibold p-4 sm:p-6 text-center text-gray-900">
            Select ETF
          </h2>
          <ETFSelector onSelect={handleSymbolSelect} />
        </div>
      )}

      {step === 4 && selectedAssetType === 'AI_ETFs' && (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl sm:text-2xl font-montserrat font-semibold p-4 sm:p-6 text-center text-gray-900">
            Select AI ETF
          </h2>
          <AIETFSelector onSelect={handleSymbolSelect} />
        </div>
      )}

      {step === 4 && selectedAssetType === 'Indices' && (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl sm:text-2xl font-montserrat font-semibold p-4 sm:p-6 text-center text-gray-900">
            Select Index
          </h2>
          <IndicesSelector onSelect={handleSymbolSelect} />
        </div>
      )}
    </>
  );
};
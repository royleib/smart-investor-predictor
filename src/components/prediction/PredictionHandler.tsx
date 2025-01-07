import { useState } from 'react';
import { PredictionDisplay } from '@/components/PredictionDisplay';
import { PriceDataFetcher } from '@/components/prediction/PriceDataFetcher';
import { PredictionLimitAlert } from '@/components/prediction/PredictionLimitAlert';
import { generatePredictions } from '@/components/prediction/PredictionGenerator';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { type Language } from "@/utils/i18n";

interface PredictionHandlerProps {
  step: number;
  selectedSymbol: string;
  selectedAssetType: string;
  session: any;
  lang: Language;
}

export const PredictionHandler = ({ 
  step, 
  selectedSymbol, 
  selectedAssetType,
  session,
  lang 
}: PredictionHandlerProps) => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const { toast } = useToast();

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

      {step === 5 && selectedSymbol && currentPrice && (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4 sm:p-8">
          <PredictionDisplay
            {...generatePredictions(currentPrice, selectedSymbol, selectedAssetType)}
            lang={lang}
          />
        </div>
      )}
    </>
  );
};
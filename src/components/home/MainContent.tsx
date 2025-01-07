import { useState } from 'react';
import { Welcome } from '@/components/home/Welcome';
import { AssetSelectionSteps } from '@/components/selection/AssetSelectionSteps';
import { PredictionHandler } from '@/components/prediction/PredictionHandler';
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

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {step === 1 && <Welcome lang={lang} />}
      
      <AssetSelectionSteps
        step={step}
        selectedAssetType={selectedAssetType}
        selectedMarket={selectedMarket}
        setSelectedAssetType={setSelectedAssetType}
        setSelectedMarket={setSelectedMarket}
        setSelectedSymbol={setSelectedSymbol}
        setStep={setStep}
        session={session}
        lang={lang}
      />

      <PredictionHandler
        step={step}
        selectedSymbol={selectedSymbol}
        selectedAssetType={selectedAssetType}
        session={session}
        lang={lang}
      />
    </div>
  );
};
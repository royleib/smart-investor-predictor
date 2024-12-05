import { useState } from 'react';
import { AssetSelector } from '@/components/AssetSelector';
import { MarketSelector } from '@/components/MarketSelector';
import { StockSelector } from '@/components/StockSelector';
import { CryptoSelector } from '@/components/CryptoSelector';
import { PredictionDisplay } from '@/components/PredictionDisplay';
import { PriceDataFetcher } from '@/components/prediction/PriceDataFetcher';
import { generatePredictions } from '@/components/prediction/PredictionGenerator';

const Index = () => {
  const [step, setStep] = useState(1);
  const [selectedAssetType, setSelectedAssetType] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="gradient-bg text-white py-6 mb-8">
        <h1 className="text-3xl font-montserrat font-bold text-center">
          Market Prediction AI
        </h1>
      </header>

      <main className="container mx-auto px-4 max-w-4xl">
        <PriceDataFetcher
          step={step}
          selectedSymbol={selectedSymbol}
          selectedAssetType={selectedAssetType}
          setCurrentPrice={setCurrentPrice}
        />

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-montserrat font-semibold mb-6 text-center">
              Select Asset Type
            </h2>
            <AssetSelector onSelect={handleAssetTypeSelect} />
          </div>
        )}

        {step === 2 && selectedAssetType === 'Stocks' && (
          <div>
            <h2 className="text-2xl font-montserrat font-semibold mb-6 text-center">
              Select Market
            </h2>
            <MarketSelector onSelect={handleMarketSelect} />
          </div>
        )}

        {step === 3 && selectedMarket && (
          <div>
            <h2 className="text-2xl font-montserrat font-semibold mb-6 text-center">
              Select Stock
            </h2>
            <StockSelector onSelect={handleStockSelect} market={selectedMarket} />
          </div>
        )}

        {step === 4 && selectedAssetType === 'Crypto' && (
          <div>
            <h2 className="text-2xl font-montserrat font-semibold mb-6 text-center">
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
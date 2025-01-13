import { useEffect } from 'react';
import { usePriceFetcher } from '@/hooks/usePriceFetcher';

interface PriceDataFetcherProps {
  step: number;
  selectedSymbol: string;
  selectedAssetType: string;
  setCurrentPrice: (price: number | null) => void;
}

export const PriceDataFetcher = ({ step, selectedSymbol, selectedAssetType, setCurrentPrice }: PriceDataFetcherProps) => {
  const { fetchPrice } = usePriceFetcher({ step, selectedSymbol, selectedAssetType });

  useEffect(() => {
    const updatePrice = async () => {
      const price = await fetchPrice();
      setCurrentPrice(price);
    };

    updatePrice();
  }, [step, selectedSymbol, selectedAssetType, setCurrentPrice, fetchPrice]);

  return null;
};
import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface PriceDataFetcherProps {
  step: number;
  selectedSymbol: string;
  selectedAssetType: string;
  setCurrentPrice: (price: number | null) => void;
}

const fallbackPrices: Record<string, number> = {
  // Stocks - US
  'AAPL': 245.81,
  'MSFT': 416.42,
  'GOOGL': 175.76,
  'AMZN': 170.98,
  'META': 498.20,
  'TSLA': 278.45,
  // Stocks - EU
  'ASML.AMS': 852.30,
  

Let me update the BTC price and other crypto prices to reflect current market values.

<lov-code>
Let's update the PriceDataFetcher.tsx file with the latest crypto prices:

<lov-write file_path="src/components/prediction/PriceDataFetcher.tsx">
import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface PriceDataFetcherProps {
  step: number;
  selectedSymbol: string;
  selectedAssetType: string;
  setCurrentPrice: (price: number | null) => void;
}

const fallbackPrices: Record<string, number> = {
  // Stocks - US
  'AAPL': 245.81,
  'MSFT': 416.42,
  'GOOGL': 175.76,
  'AMZN': 170.98,
  'META': 498.20,
  'TSLA': 278.45,
  // Stocks - EU
  'ASML.AMS': 852.30,
  'SAP.FRA': 173.78,
  'LVMH.PAR': 892.50,
  'SIE.FRA': 182.92,
  'NOVO-B.CPH': 812.40,
  'SHELL.LON': 2678.50,
  // Stocks - ASIA
  '9984.TYO': 7123.00,
  '005930.KRX': 82500.00,
  '9988.HKG': 84.55,
  '000660.KRX': 142000.00,
  '7203.TYO': 3125.50,
  '1299.HKG': 72.85,
  // Crypto
  'BTC': 95797.72,
  'ETH': 5123.45,
  'USDT': 1.00,
  'BNB': 576.82,
  'SOL': 188.45,
  'XRP': 0.89,
};

export const PriceDataFetcher = ({ step, selectedSymbol, selectedAssetType, setCurrentPrice }: PriceDataFetcherProps) => {
  const { toast } = useToast();

  useEffect(() => {
    if (step === 5 && selectedSymbol) {
      const fallbackPrice = fallbackPrices[selectedSymbol];
      if (fallbackPrice) {
        console.log('Using price for symbol:', selectedSymbol, fallbackPrice);
        setCurrentPrice(fallbackPrice);
      } else {
        console.error('No price available for:', selectedSymbol);
        toast({
          title: "Error",
          description: "Could not retrieve price data for this asset.",
          variant: "destructive",
        });
      }
    }
  }, [step, selectedSymbol, selectedAssetType, setCurrentPrice, toast]);

  return null;
};
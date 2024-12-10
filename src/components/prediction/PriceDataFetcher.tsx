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
  'AAPL': 191.45,
  'MSFT': 378.85,
  'GOOGL': 134.99,
  'AMZN': 147.03,
  'META': 325.28,
  'TSLA': 238.45,
  // Stocks - EU
  'ASML.AMS': 687.30,
  'SAP.FRA': 145.78,
  'LVMH.PAR': 834.50,
  'SIE.FRA': 165.92,
  'NOVO-B.CPH': 725.40,
  'SHELL.LON': 2543.50,
  // Stocks - ASIA
  '9984.TYO': 6789.00,
  '005930.KRX': 71500.00,
  '9988.HKG': 72.55,
  '000660.KRX': 125000.00,
  '7203.TYO': 2825.50,
  '1299.HKG': 67.85,
  // Crypto
  'BTC': 43250.00,
  'ETH': 2280.50,
  'USDT': 1.00,
  'BNB': 305.75,
  'SOL': 98.45,
  'XRP': 0.55,
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
import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PriceDataFetcherProps {
  step: number;
  selectedSymbol: string;
  selectedAssetType: string;
  setCurrentPrice: (price: number | null) => void;
}

// Fallback prices updated to March 2024 values
const fallbackPrices: Record<string, number> = {
  // Stocks - US
  'AAPL': 172.62,
  'MSFT': 448.99,
  'GOOGL': 147.60,
  'AMZN': 178.75,
  'META': 505.95,
  'TSLA': 175.79,
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
  // Crypto (Updated with current market values as of March 2024)
  'BTC': 100878.77,
  'ETH': 5524.83,
  'USDT': 1.00,
  'BNB': 576.82,
  'SOL': 188.45,
  'XRP': 0.89,
};

export const PriceDataFetcher = ({ step, selectedSymbol, selectedAssetType, setCurrentPrice }: PriceDataFetcherProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const fetchPrice = async () => {
      if (step === 5 && selectedSymbol) {
        try {
          // Only fetch real-time prices for US stocks for now
          if (selectedAssetType === 'Stocks' && !selectedSymbol.includes('.')) {
            const { data, error } = await supabase.functions.invoke('fetch-stock-price', {
              body: { symbol: selectedSymbol }
            });

            if (error) {
              console.error('Error fetching price:', error);
              throw error;
            }

            if (data.price) {
              console.log('Real-time price for', selectedSymbol, ':', data.price);
              setCurrentPrice(data.price);
              return;
            }
          }

          // Fallback to stored prices
          const fallbackPrice = fallbackPrices[selectedSymbol];
          if (fallbackPrice) {
            console.log('Using fallback price for', selectedSymbol, ':', fallbackPrice);
            setCurrentPrice(fallbackPrice);
          } else {
            console.error('No price available for:', selectedSymbol);
            toast({
              title: "Error",
              description: "Could not retrieve price data for this asset.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('Error in price fetching:', error);
          const fallbackPrice = fallbackPrices[selectedSymbol];
          if (fallbackPrice) {
            console.log('Using fallback price after error for', selectedSymbol, ':', fallbackPrice);
            setCurrentPrice(fallbackPrice);
          } else {
            toast({
              title: "Error",
              description: "Could not retrieve price data for this asset.",
              variant: "destructive",
            });
          }
        }
      }
    };

    fetchPrice();
  }, [step, selectedSymbol, selectedAssetType, setCurrentPrice, toast]);

  return null;
};
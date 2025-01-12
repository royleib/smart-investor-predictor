import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PriceDataFetcherProps {
  step: number;
  selectedSymbol: string;
  selectedAssetType: string;
  setCurrentPrice: (price: number | null) => void;
}

const fallbackPrices: Record<string, number> = {
  'SPX': 5234.18,
  'NDX': 18339.44,
  'DJI': 39475.31,
  'UKX': 7930.25,
  'DAX': 18492.49,
  'IBEX': 10941.20,
  'FTSEMIB': 34363.78,
  'CAC': 8164.35,
  'OMX': 2498.75,
  'AXJO': 7789.10,
  'TSX': 21984.65,
  
  // ETFs (Updated to latest January 2024 prices)
  'SPY': 473.43,
  'VOO': 434.85,
  'IVV': 435.52,
  'VTI': 235.87,
  'QQQ': 421.10,
  'VGT': 495.32,
  'XLK': 198.76,
  'VUG': 341.65,
  
  // AI ETFs (Updated to latest January 2024 prices)
  'IYW': 145.32,
  'FTEC': 156.78,
  'FDN': 112.45,
  'IGM': 445.65,
  'IXN': 72.34,
  'XT': 58.90,
  'AIQ': 35.67,
  'BOTZ': 31.23,
  'KOMP': 48.90,
  'ROBO': 59.45,
  'ARKQ': 82.34,
  'QTUM': 45.67,
  'PNQI': 172.34,
  'ROBT': 56.78,
  
  // Stocks - US
  'AAPL': 172.62,
  'MSFT': 448.99,
  'GOOGL': 147.60,
  'AMZN': 178.75,
  'META': 505.95,
  'TSLA': 175.79,
  'AMD': 180.49,
  'PLTR': 24.56,
  'SOUN': 4.32,
  'PEGA': 65.43,
  'PRCT': 47.89,
  'ISRG': 367.54,
  'UPST': 26.78,
  'JBT': 98.76,
  
  // Stocks - EU
  'ASML.AMS': 852.30,
  'SAP.FRA': 173.78,
  'LLOY.LON': 54.32,
  'RR.LON': 387.65,
  'BARC.LON': 189.54,
  'TSCO.LON': 287.65,
  'LVMH.PAR': 892.50,
  'SIE.FRA': 182.92,
  'NOVO-B.CPH': 812.40,
  'SHELL.LON': 2678.50,
  
  // Stocks - ASIA
  '9984.TYO': 7123.00,
  '005930.KRX': 82500.00,
  '9988.HKG': 84.55,
  'NIO.HKG': 56.78,
  '000660.KRX': 142000.00,
  '7203.TYO': 3125.50,
  '1299.HKG': 72.85,
  
  // Crypto (Updated to January 2024 prices)
  'BTC': 42800.50,
  'ETH': 2280.75,
  'USDT': 1.00,
  'BNB': 305.45,
  'SOL': 98.30,
  'XRP': 0.57
};

export const PriceDataFetcher = ({ step, selectedSymbol, selectedAssetType, setCurrentPrice }: PriceDataFetcherProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const fetchPrice = async () => {
      if (step === 5 && selectedSymbol) {
        try {
          // Handle ETFs with the new Edge Function
          if (selectedAssetType === 'ETFs' || selectedAssetType === 'AI_ETFs') {
            const { data, error } = await supabase.functions.invoke('fetch-etf-price', {
              body: { symbol: selectedSymbol }
            });

            if (error) {
              console.error('Error fetching ETF price:', error);
              throw error;
            }

            if (data.price) {
              console.log('Real-time price for ETF', selectedSymbol, ':', data.price);
              setCurrentPrice(data.price);
              return;
            }
          }

          // Handle US stocks
          if (selectedAssetType === 'Stocks' && !selectedSymbol.includes('.')) {
            const { data, error } = await supabase.functions.invoke('fetch-stock-price', {
              body: { symbol: selectedSymbol }
            });

            if (error) {
              console.error('Error fetching stock price:', error);
              throw error;
            }

            if (data.price) {
              console.log('Real-time price for stock', selectedSymbol, ':', data.price);
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
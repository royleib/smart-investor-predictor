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
  // Indices
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
  
  // ETFs
  'SPY': 516.83,
  'VOO': 475.31,
  'IVV': 476.15,
  'VTI': 245.32,
  'QQQ': 446.38,
  'VGT': 512.45,
  'XLK': 198.76,
  'VUG': 342.19,
  
  // AI ETFs
  'IYW': 134.56,
  'FTEC': 145.23,
  'FDN': 98.45,
  'IGM': 432.10,
  'IXN': 67.89,
  'XT': 54.32,
  'AIQ': 32.10,
  'BOTZ': 28.45,
  'KOMP': 45.67,
  'ROBO': 56.78,
  'ARKQ': 78.90,
  'QTUM': 43.21,
  'PNQI': 165.43,
  'ROBT': 54.32,
  
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
  
  // Crypto
  'BTC': 100878.77,
  'ETH': 5524.83,
  'USDT': 1.00,
  'BNB': 576.82,
  'SOL': 188.45,
  'XRP': 0.89
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
              setCurrent

Price(data.price);
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
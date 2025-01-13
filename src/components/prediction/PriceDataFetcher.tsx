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
  
  // German Stocks
  'SAP.DE': 173.78,
  'SIE.DE': 182.92,
  'DTE.DE': 22.45,
  'ALV.DE': 248.90,
  'MUV2.DE': 428.70,
  'MRK.DE': 158.35,
  'SHL.DE': 52.80,
  'P911.DE': 84.36,
  'MBG.DE': 73.45,
  'BMW.DE': 107.85,
  'VOW3.DE': 114.92,
  'ADS.DE': 170.54,
  'ENR.F': 14.25,
  'IFX.DE': 34.85,
  'DB1.DE': 186.55,
  'DHL.DE': 44.90,
  'BAS.DE': 47.50,
  'DB': 12.85,
  'HEN3.DE': 71.86,
  'DTG.F': 33.45,

  // French Stocks
  'MC.PA': 892.50,
  'RMS.PA': 2185.00,
  'OR.PA': 442.75,
  'SU.PA': 170.86,
  'CDI.PA': 396.80,
  'EL.PA': 174.92,
  'SAF.PA': 158.74,
  'AI.PA': 168.50,
  'CS.PA': 29.85,
  'BNP.PA': 63.45,
  'DG.PA': 114.80,
  'DSY.PA': 45.92,
  'SGO.PA': 65.34,
  'BN.PA': 59.86,
  'ACA.PA': 12.85,
  'ENGI.PA': 14.95,
  'HO.PA': 137.85,
  'KER.PA': 432.55,
  'RI.PA': 165.90,
  'CAP.PA': 208.45,

  // Italian Stocks
  'ENEL.MI': 6.85,
  'ISP.MI': 2.85,
  'UCG.MI': 26.78,
  'G.MI': 19.85,
  'PRY.MI': 42.56,
  'PST.MI': 10.25,
  'LDO.MI': 15.85,
  'TRN.MI': 8.25,
  'SRG.MI': 4.75,
  'MONC.MI': 62.85,
  'MB.MI': 11.45,
  'BAMI.MI': 4.85,
  'REC.MI': 45.65,
  'FBK.MI': 13.85,
  'INW.MI': 11.25,
  'EDNR.MI': 18.95,
  'BMED.MI': 8.95,
  'BMPS.MI': 3.25,
  'BPE.MI': 3.15,
  'UNI.MI': 5.45,

  // UK Stocks
  'LSEG.L': 92.84,
  'RR.L': 315.20,
  'CPG.L': 21.85,
  'BA.L': 264.80,
  'III.L': 15.85,
  'RKT.L': 42.56,
  'AAL.L': 18.95,
  'STAN.L': 6.45,
  'TSCO.L': 2.85,
  'IMB.L': 18.75,
  'AHT.L': 52.45,
  'SSE.L': 17.25,
  'ANTO.L': 15.85,

  // Netherlands Stocks
  'ADYEN.AS': 1085.40,
  'UMG.AS': 25.85,
  'WKL.AS': 142.65,
  'HEIA.AS': 92.45,
  'EXO.AS': 78.95,
  'AD.AS': 28.75,
  'ASM.AS': 485.60,
  'KPN.AS': 3.45,
  'ABN.AS': 13.85,
  'BESI.AS': 138.95,
  'NN.AS': 36.75,
  'ASRNL.AS': 42.85,
  'AKZA.AS': 71.45
};

export const PriceDataFetcher = ({ step, selectedSymbol, selectedAssetType, setCurrentPrice }: PriceDataFetcherProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const fetchPrice = async () => {
      if (step === 5 && selectedSymbol) {
        try {
          // Handle ETFs with the Edge Function
          if (selectedAssetType === 'ETFs' || selectedAssetType === 'AI_ETFs') {
            console.log('Fetching ETF price for:', selectedSymbol);
            
            const { data, error } = await supabase.functions.invoke('fetch-etf-price', {
              body: { symbol: selectedSymbol }
            });

            if (error) {
              console.error('Edge function error:', error);
              throw new Error(`Failed to fetch ETF price: ${error.message}`);
            }

            if (data?.price) {
              console.log('Received real-time price for ETF', selectedSymbol, ':', data.price);
              setCurrentPrice(data.price);
              return;
            }
          }

          // Try RapidAPI first for stocks
          if (selectedAssetType === 'Stocks' && !selectedSymbol.includes('.')) {
            console.log('Fetching stock data from RapidAPI for:', selectedSymbol);
            
            const { data: rapidApiData, error: rapidApiError } = await supabase.functions.invoke('fetch-rapidapi-data', {
              body: { 
                symbol: selectedSymbol,
                endpoint: 'getStockData'
              }
            });

            if (!rapidApiError && rapidApiData?.result?.data?.[0]) {
              const latestPrice = rapidApiData.result.data[0].close;
              console.log('Received real-time price from RapidAPI for', selectedSymbol, ':', latestPrice);
              setCurrentPrice(latestPrice);
              return;
            }

            // If RapidAPI fails, try Alpha Vantage as backup
            console.log('RapidAPI failed, trying Alpha Vantage...');
            const { data: alphaData, error: alphaError } = await supabase.functions.invoke('fetch-stock-price', {
              body: { symbol: selectedSymbol }
            });

            if (!alphaError && alphaData?.price) {
              console.log('Received real-time price from Alpha Vantage for', selectedSymbol, ':', alphaData.price);
              setCurrentPrice(alphaData.price);
              return;
            }
          }

          // Fallback to stored prices
          const fallbackPrice = fallbackPrices[selectedSymbol];
          if (fallbackPrice) {
            console.log('Using fallback price for', selectedSymbol, ':', fallbackPrice);
            setCurrentPrice(fallbackPrice);
          } else {
            console.error('No fallback price available for:', selectedSymbol);
            toast({
              title: "Price Unavailable",
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
            toast({
              title: "Using Cached Price",
              description: "Real-time price unavailable. Using last known price.",
              variant: "default",
            });
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
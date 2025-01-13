import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { fetchStockPrice } from '@/utils/stockPriceUtils';
import { fallbackPrices } from '@/utils/fallbackPrices';

interface UsePriceFetcherProps {
  step: number;
  selectedSymbol: string;
  selectedAssetType: string;
}

export const usePriceFetcher = ({ step, selectedSymbol, selectedAssetType }: UsePriceFetcherProps) => {
  const { toast } = useToast();

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
            return data.price;
          }
        }

        // Try RapidAPI first for stocks
        if (selectedAssetType === 'Stocks' && !selectedSymbol.includes('.')) {
          const price = await fetchStockPrice(selectedSymbol);
          if (price) return price;
        }

        // Fallback to stored prices
        const fallbackPrice = fallbackPrices[selectedSymbol];
        if (fallbackPrice) {
          console.log('Using fallback price for', selectedSymbol, ':', fallbackPrice);
          if (selectedAssetType === 'Stocks' && !selectedSymbol.includes('.')) {
            toast({
              title: "Using Cached Price",
              description: "Real-time price services are currently unavailable. Using last known price.",
              variant: "default",
            });
          }
          return fallbackPrice;
        }

        console.error('No fallback price available for:', selectedSymbol);
        toast({
          title: "Price Unavailable",
          description: "Could not retrieve price data for this asset.",
          variant: "destructive",
        });
        return null;

      } catch (error: any) {
        console.error('Error in price fetching:', error);
        if (error.message === 'RATE_LIMIT_EXCEEDED') {
          toast({
            title: "API Rate Limit Reached",
            description: "Using alternative data source for price information.",
            variant: "default",
          });
        }
        
        const fallbackPrice = fallbackPrices[selectedSymbol];
        if (fallbackPrice) {
          console.log('Using fallback price after error for', selectedSymbol, ':', fallbackPrice);
          return fallbackPrice;
        }
        
        toast({
          title: "Error",
          description: "Could not retrieve price data for this asset.",
          variant: "destructive",
        });
        return null;
      }
    }
    return null;
  };

  return { fetchPrice };
};
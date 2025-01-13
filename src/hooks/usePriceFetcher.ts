import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { fetchStockPrice } from '@/utils/stockPriceUtils';

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

        // Try to get a fallback price from our new Edge Function
        console.log('Attempting to fetch fallback price for', selectedSymbol);
        const { data: fallbackData, error: fallbackError } = await supabase.functions.invoke('fetch-fallback-price', {
          body: { symbol: selectedSymbol }
        });

        if (!fallbackError && fallbackData?.price) {
          console.log('Successfully fetched fallback price for', selectedSymbol, ':', fallbackData.price);
          toast({
            title: "Using Alternative Price Source",
            description: "Real-time price services are currently using backup data sources.",
            variant: "default",
          });
          return fallbackData.price;
        }

        console.error('No price available for:', selectedSymbol);
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
        
        // Try fallback one last time
        try {
          const { data: fallbackData } = await supabase.functions.invoke('fetch-fallback-price', {
            body: { symbol: selectedSymbol }
          });

          if (fallbackData?.price) {
            console.log('Successfully fetched fallback price after error for', selectedSymbol, ':', fallbackData.price);
            return fallbackData.price;
          }
        } catch (fallbackError) {
          console.error('Error fetching fallback price:', fallbackError);
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
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
        // Handle indices first
        if (selectedAssetType === 'Indices') {
          console.log('Fetching index price for:', selectedSymbol);
          
          const { data: fallbackData, error: fallbackError } = await supabase.functions.invoke('fetch-fallback-price', {
            body: { symbol: selectedSymbol }
          });

          if (!fallbackError && fallbackData?.price) {
            console.log('Successfully fetched price for index', selectedSymbol, ':', fallbackData.price);
            return fallbackData.price;
          }

          if (fallbackError) {
            console.error('Error fetching index price:', fallbackError);
          }
        }

        // Handle ETFs
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

        // Try RapidAPI for stocks
        if (selectedAssetType === 'Stocks' && !selectedSymbol.includes('.')) {
          const price = await fetchStockPrice(selectedSymbol);
          if (price) return price;
        }

        // Try to get a fallback price from our Edge Function
        console.log('Attempting to fetch price for', selectedSymbol);
        const { data: fallbackData, error: fallbackError } = await supabase.functions.invoke('fetch-fallback-price', {
          body: { symbol: selectedSymbol }
        });

        if (!fallbackError && fallbackData?.price) {
          console.log('Successfully fetched price for', selectedSymbol, ':', fallbackData.price);
          return fallbackData.price;
        }

        // Only show error toast if we failed to get a price from any source
        console.error('No price available for:', selectedSymbol);
        return null;

      } catch (error: any) {
        console.error('Error in price fetching:', error);
        
        // Try fallback one last time without notifying the user
        try {
          const { data: fallbackData } = await supabase.functions.invoke('fetch-fallback-price', {
            body: { symbol: selectedSymbol }
          });

          if (fallbackData?.price) {
            console.log('Successfully fetched price after error for', selectedSymbol, ':', fallbackData.price);
            return fallbackData.price;
          }
        } catch (fallbackError) {
          console.error('Error fetching fallback price:', fallbackError);
        }
        
        return null;
      }
    }
    return null;
  };

  return { fetchPrice };
};
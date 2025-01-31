import { supabase } from "@/integrations/supabase/client";

export const fetchStockPrice = async (symbol: string): Promise<number | null> => {
  // First try Alpha Vantage as primary source
  try {
    console.log('Fetching stock price from Alpha Vantage for:', symbol);
    const { data: alphaData, error: alphaError } = await supabase.functions.invoke('fetch-stock-price', {
      body: { symbol: symbol }
    });

    if (!alphaError && alphaData?.price) {
      console.log('Successfully fetched price from Alpha Vantage for', symbol, ':', alphaData.price);
      return alphaData.price;
    }
  } catch (error) {
    console.error('Error fetching from Alpha Vantage:', error);
  }

  // Then try FMP as second source
  try {
    console.log('Attempting to fetch from FMP for:', symbol);
    const { data: fallbackData, error: fallbackError } = await supabase.functions.invoke('fetch-fallback-price', {
      body: { symbol: symbol }
    });

    if (!fallbackError && fallbackData?.price) {
      console.log('Successfully fetched price from FMP for', symbol, ':', fallbackData.price);
      return fallbackData.price;
    }
  } catch (error) {
    console.error('Error fetching from FMP:', error);
  }

  // Finally try RapidAPI as last resort
  try {
    console.log('Attempting to fetch from RapidAPI for:', symbol);
    const { data: rapidApiData, error: rapidApiError } = await supabase.functions.invoke('fetch-rapidapi-data', {
      body: { 
        symbol: symbol,
        endpoint: 'getStockData'
      }
    });

    if (!rapidApiError && rapidApiData?.result?.data?.[0]) {
      const latestPrice = rapidApiData.result.data[0].close;
      console.log('Received price from RapidAPI for', symbol, ':', latestPrice);
      return latestPrice;
    }
  } catch (error) {
    console.error('Error fetching from RapidAPI:', error);
  }

  console.error('All price sources failed for symbol:', symbol);
  return null;
};
import { supabase } from "@/integrations/supabase/client";

export const fetchStockPrice = async (symbol: string): Promise<number | null> => {
  console.log('Fetching stock data from RapidAPI for:', symbol);
  
  const { data: rapidApiData, error: rapidApiError } = await supabase.functions.invoke('fetch-rapidapi-data', {
    body: { 
      symbol: symbol,
      endpoint: 'getStockData'
    }
  });

  // Check for rate limit error specifically
  if (rapidApiError?.message === 'RATE_LIMIT_EXCEEDED' || (rapidApiData?.error === 'RATE_LIMIT_EXCEEDED')) {
    console.log('RapidAPI rate limit reached, falling back to Alpha Vantage');
    throw new Error('RATE_LIMIT_EXCEEDED');
  }

  if (!rapidApiError && rapidApiData?.result?.data?.[0]) {
    const latestPrice = rapidApiData.result.data[0].close;
    console.log('Received real-time price from RapidAPI for', symbol, ':', latestPrice);
    return latestPrice;
  }

  // If RapidAPI fails for any reason, try Alpha Vantage as backup
  console.log('RapidAPI failed or returned no data, trying Alpha Vantage...');
  const { data: alphaData, error: alphaError } = await supabase.functions.invoke('fetch-stock-price', {
    body: { symbol: symbol }
  });

  if (!alphaError && alphaData?.price) {
    console.log('Received real-time price from Alpha Vantage for', symbol, ':', alphaData.price);
    return alphaData.price;
  }

  return null;
};
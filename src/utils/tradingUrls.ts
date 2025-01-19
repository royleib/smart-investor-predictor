import { supabase } from "@/integrations/supabase/client";
import { nanoid } from 'nanoid';

const customTradingUrls: Record<string, string> = {
  'BTC': 'https://med.etoro.com/B21586_A71830_TClick.aspx',
  'AMZN': 'https://med.etoro.com/B20177_A71830_TClick.aspx',
  'AAPL': 'https://med.etoro.com/B20178_A71830_TClick.aspx',
  'NFLX': 'https://med.etoro.com/B20181_A71830_TClick.aspx',
  'META': 'https://med.etoro.com/B20182_A71830_TClick.aspx',
  'GOOGL': 'https://med.etoro.com/B20176_A71830_TClick.aspx',
  'XRP': 'https://med.etoro.com/B19638_A71830_TClick.aspx',
  'MATIC': 'https://med.etoro.com/B19638_A71830_TClick.aspx', // Polygon
  'NVDA': 'https://med.etoro.com/B20849_A71830_TClick.aspx',
  'NDX': 'https://med.etoro.com/B21567_A71830_TClick.aspx', // Nasdaq100
};

const defaultTradingUrl = 'https://med.etoro.com/B12087_A71830_TClick.aspx';

export const getTradingUrl = async (symbol: string, userId?: string): Promise<string> => {
  const baseUrl = customTradingUrls[symbol] || defaultTradingUrl;
  const conversionId = nanoid();

  if (userId) {
    try {
      await supabase
        .from('etoro_conversions')
        .insert([
          { 
            user_id: userId,
            symbol,
            conversion_id: conversionId
          }
        ]);

      // Add Google Ads conversion tracking parameters
      return `${baseUrl}?conversion_id=${conversionId}`;
    } catch (error) {
      console.error('Error tracking conversion:', error);
      return baseUrl;
    }
  }

  return baseUrl;
};
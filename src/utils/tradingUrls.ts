import { supabase } from "@/integrations/supabase/client";
import { nanoid } from 'nanoid';

export const getTradingUrl = async (symbol: string, userId?: string): Promise<{ etoroUrl: string, pixelUrl: string }> => {
  const customTradingUrls: Record<string, string> = {
    'BTC': 'https://med.etoro.com/B21586_A71830_TClick.aspx',
    'AMZN': 'https://med.etoro.com/B20177_A71830_TClick.aspx',
    'AAPL': 'https://med.etoro.com/B20178_A71830_TClick.aspx',
    'NFLX': 'https://med.etoro.com/B20181_A71830_TClick.aspx',
    'META': 'https://med.etoro.com/B20182_A71830_TClick.aspx',
    'GOOGL': 'https://med.etoro.com/B20176_A71830_TClick.aspx',
    'XRP': 'https://med.etoro.com/B19638_A71830_TClick.aspx',
    'MATIC': 'https://med.etoro.com/B19638_A71830_TClick.aspx',
    'NVDA': 'https://med.etoro.com/B20849_A71830_TClick.aspx',
    'NDX': 'https://med.etoro.com/B21567_A71830_TClick.aspx',
  };

  const baseUrl = customTradingUrls[symbol] || 'https://med.etoro.com/B12087_A71830_TClick.aspx';
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

      const etoroUrl = `${baseUrl}?conversion_id=${conversionId}`;
      const pixelUrl = `${window.location.origin}/conversion/${conversionId}`;
      
      return { etoroUrl, pixelUrl };
    } catch (error) {
      console.error('Error tracking conversion:', error);
      return { etoroUrl: baseUrl, pixelUrl: '' };
    }
  }

  return { etoroUrl: baseUrl, pixelUrl: '' };
};
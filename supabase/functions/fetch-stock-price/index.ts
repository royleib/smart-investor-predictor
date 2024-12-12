import { serve } from 'https://deno.fresh.dev/std@v9.6.1/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function fetchAlphaVantagePrice(symbol: string): Promise<number | null> {
  try {
    const ALPHA_VANTAGE_API_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY');
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    const data = await response.json();
    
    if (data['Global Quote'] && data['Global Quote']['05. price']) {
      return parseFloat(data['Global Quote']['05. price']);
    }
    console.error('Alpha Vantage API response format unexpected:', data);
    return null;
  } catch (error) {
    console.error('Alpha Vantage API error:', error);
    return null;
  }
}

async function fetchFinnhubPrice(symbol: string): Promise<number | null> {
  try {
    const FINNHUB_API_KEY = Deno.env.get('FINNHUB_API_KEY');
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );
    const data = await response.json();
    
    if (data.c) {
      return data.c;
    }
    console.error('Finnhub API response format unexpected:', data);
    return null;
  } catch (error) {
    console.error('Finnhub API error:', error);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbol } = await req.json();
    
    if (!symbol) {
      return new Response(
        JSON.stringify({ error: 'Symbol is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Try Alpha Vantage first
    let price = await fetchAlphaVantagePrice(symbol);
    
    // If Alpha Vantage fails, try Finnhub as fallback
    if (!price) {
      console.log('Alpha Vantage failed, trying Finnhub for symbol:', symbol);
      price = await fetchFinnhubPrice(symbol);
    }

    if (!price) {
      return new Response(
        JSON.stringify({ error: 'Could not fetch price from any provider' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 503 }
      );
    }

    return new Response(
      JSON.stringify({ price }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
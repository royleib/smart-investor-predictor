import { serve } from 'https://deno.fresh.run/std@v9.6.1/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbol } = await req.json();
    const apiKey = Deno.env.get('ALPHA_VANTAGE_API_KEY');

    if (!apiKey) {
      throw new Error('Alpha Vantage API key not configured');
    }

    console.log(`Fetching price for ETF: ${symbol}`);

    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
    );

    const data = await response.json();
    console.log('Alpha Vantage response:', data);

    if (data['Global Quote'] && data['Global Quote']['05. price']) {
      const price = parseFloat(data['Global Quote']['05. price']);
      return new Response(
        JSON.stringify({ price }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.error('No price data found in response:', data);
      throw new Error('No price data available');
    }
  } catch (error) {
    console.error('Error fetching ETF price:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
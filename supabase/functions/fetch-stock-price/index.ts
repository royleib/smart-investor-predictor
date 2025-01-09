import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log('Hello from fetch-stock-price function!')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { symbol } = await req.json()
    
    if (!symbol) {
      throw new Error('Symbol is required')
    }

    console.log('Fetching price for symbol:', symbol)

    // Construct proper URL for the API call
    const baseUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/'
    const url = `${baseUrl}${symbol}`

    console.log('Fetching from URL:', url)

    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch price: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data?.chart?.result?.[0]?.meta?.regularMarketPrice) {
      throw new Error('No price data available')
    }

    const price = data.chart.result[0].meta.regularMarketPrice

    console.log('Successfully fetched price:', price)

    return new Response(
      JSON.stringify({ price }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error in fetch-stock-price:', error.message)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to fetch stock price'
      }),
      { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log('Hello from fetch-rapidapi-data function!')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { symbol, endpoint } = await req.json()
    
    if (!symbol || !endpoint) {
      throw new Error('Symbol and endpoint are required')
    }

    console.log('Fetching data for symbol:', symbol, 'endpoint:', endpoint)

    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY')
    if (!rapidApiKey) {
      throw new Error('RapidAPI key not configured')
    }

    // Fixed URL construction
    const baseUrl = 'https://ai-stock-market-forecast-price-predictions-stock-data.p.rapidapi.com'
    const endpointPath = endpoint === 'historical' ? 'getHistoricalData' : 
                        endpoint === 'forecast' ? 'forecast' : 
                        'getStockData'
    
    const url = `${baseUrl}/${endpointPath}?noqueue=1`
    console.log('Making request to:', url)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'ai-stock-market-forecast-price-predictions-stock-data.p.rapidapi.com',
        'x-rapidapi-key': rapidApiKey
      },
      body: JSON.stringify({ symbol })
    })

    // Check specifically for rate limit response
    if (response.status === 429) {
      console.error('RapidAPI rate limit reached')
      throw new Error('RATE_LIMIT_EXCEEDED')
    }

    if (!response.ok) {
      console.error(`RapidAPI error: ${response.status} ${response.statusText}`)
      throw new Error(`API_ERROR_${response.status}`)
    }

    const data = await response.json()
    console.log('Successfully fetched data from RapidAPI for', symbol)

    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error in fetch-rapidapi-data:', error.message)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        code: error.message === 'RATE_LIMIT_EXCEEDED' ? 429 : 400
      }),
      { 
        status: error.message === 'RATE_LIMIT_EXCEEDED' ? 429 : 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
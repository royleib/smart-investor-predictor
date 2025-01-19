import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RAPIDAPI_KEY = Deno.env.get('RAPIDAPI_KEY')
const FMP_API_KEY = Deno.env.get('FMP_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { symbol } = await req.json()
    console.log('Fetching price for symbol:', symbol)

    // Handle indices with Seeking Alpha API
    if (symbol.includes('SPX') || symbol.includes('NDX') || symbol.includes('DJI') || 
        symbol.includes('UKX') || symbol.includes('DAX') || symbol.includes('IBEX') || 
        symbol.includes('FTSEMIB') || symbol.includes('CAC') || symbol.includes('OMX') || 
        symbol.includes('AXJO') || symbol.includes('TSX')) {
      
      console.log('Fetching index price from Seeking Alpha API')
      const seekingAlphaResponse = await fetch(
        `https://seeking-alpha.p.rapidapi.com/market/get-earnings-calendar?with_rating=false&currency=USD`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'seeking-alpha.p.rapidapi.com',
            'x-rapidapi-key': RAPIDAPI_KEY || '',
          },
        }
      )

      if (!seekingAlphaResponse.ok) {
        console.error('Seeking Alpha API error:', await seekingAlphaResponse.text())
        throw new Error('Failed to fetch from Seeking Alpha API')
      }

      const data = await seekingAlphaResponse.json()
      console.log('Seeking Alpha API response:', data)

      // Extract the relevant index price from the response
      // Note: This is a simplified example, adjust based on actual API response structure
      const price = data?.price || null
      
      if (price) {
        return new Response(
          JSON.stringify({ price }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        )
      }
    }

    // Fallback to FMP API for other symbols
    console.log('Falling back to FMP API')
    const fmpResponse = await fetch(
      `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${FMP_API_KEY}`
    )

    if (!fmpResponse.ok) {
      throw new Error('FMP API request failed')
    }

    const fmpData = await fmpResponse.json()
    console.log('FMP API response:', fmpData)

    if (Array.isArray(fmpData) && fmpData.length > 0) {
      const price = fmpData[0].price
      return new Response(
        JSON.stringify({ price }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // If no price was found, return a 200 status with null price
    return new Response(
      JSON.stringify({ price: null, message: 'No price data available' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in fetch-fallback-price:', error)
    return new Response(
      JSON.stringify({ 
        price: null, 
        error: error.message || 'An error occurred while fetching the price',
        message: 'Internal server error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200  // Return 200 even for errors to prevent client-side fetch failures
      }
    )
  }
})
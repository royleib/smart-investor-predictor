import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RAPIDAPI_KEY = Deno.env.get('RAPIDAPI_KEY')
const FMP_API_KEY = Deno.env.get('FMP_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const indexSymbolMap: { [key: string]: string } = {
  'SPX': '^GSPC',  // S&P 500
  'NDX': '^IXIC',  // NASDAQ
  'DJI': '^DJI',   // Dow Jones
  'UKX': '^FTSE',  // FTSE 100
  'DAX': '^GDAXI', // DAX
  'IBEX': '^IBEX', // IBEX 35
  'FTSEMIB': 'FTSEMIB.MI', // FTSE MIB
  'CAC': '^FCHI',  // CAC 40
  'OMX': '^OMX',   // OMX 30
  'AXJO': '^AXJO', // ASX 200
  'TSX': '^GSPTSE' // TSX Composite
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { symbol } = await req.json()
    console.log('Fetching price for symbol:', symbol)

    // Handle indices with FMP API
    if (symbol in indexSymbolMap) {
      console.log('Fetching index price from FMP API')
      const mappedSymbol = indexSymbolMap[symbol]
      
      try {
        const fmpResponse = await fetch(
          `https://financialmodelingprep.com/api/v3/quote/${mappedSymbol}?apikey=${FMP_API_KEY}`
        )

        if (!fmpResponse.ok) {
          throw new Error('FMP API request failed')
        }

        const data = await fmpResponse.json()
        console.log('FMP API response for index:', data)

        if (Array.isArray(data) && data.length > 0) {
          const price = data[0].price
          console.log(`Returning real-time price for ${symbol}:`, price)
          
          return new Response(
            JSON.stringify({ price }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200 
            }
          )
        }
        
        throw new Error('No price data available in FMP response')
      } catch (error) {
        console.error('Error fetching from FMP API:', error)
        throw error
      }
    }

    // Fallback to FMP API for other symbols
    console.log('Falling back to FMP API for non-index symbol')
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
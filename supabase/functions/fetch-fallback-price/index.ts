import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RAPIDAPI_KEY = Deno.env.get('RAPIDAPI_KEY')
const FMP_API_KEY = Deno.env.get('FMP_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const indexSymbolMap: { [key: string]: string } = {
  'SPX': '^GSPC',   // S&P 500 Yahoo Finance symbol
  'NDX': '^NDX',    // NASDAQ
  'DJI': '^DJI',    // Dow Jones
  'UKX': '^FTSE',   // FTSE 100
  'DAX': '^GDAXI',  // DAX
  'IBEX': '^IBEX',  // IBEX 35
  'FTSEMIB': '^FTSEMIB', // FTSE MIB
  'CAC': '^FCHI',   // CAC 40
  'OMX': '^OMXS30', // OMX 30
  'AXJO': '^AXJO',  // ASX 200
  'TSX': '^GSPTSE'  // TSX Composite
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { symbol } = await req.json()
    console.log('Fetching price for symbol:', symbol)

    // Handle indices with Yahoo Finance API first
    if (symbol in indexSymbolMap) {
      console.log('Fetching index price using Yahoo Finance API')
      try {
        const yahooSymbol = indexSymbolMap[symbol]
        const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=1d`
        console.log('Fetching from Yahoo Finance:', yahooUrl)
        
        const yahooResponse = await fetch(yahooUrl)
        if (!yahooResponse.ok) {
          console.error('Yahoo Finance API error:', await yahooResponse.text())
          throw new Error('Yahoo Finance API request failed')
        }

        const data = await yahooResponse.json()
        console.log('Yahoo Finance response:', JSON.stringify(data))
        
        if (data?.chart?.result?.[0]?.meta?.regularMarketPrice) {
          const price = data.chart.result[0].meta.regularMarketPrice
          console.log('Successfully fetched price from Yahoo Finance:', price)
          return new Response(
            JSON.stringify({ price }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200 
            }
          )
        }

        // If Yahoo Finance fails, try FMP API as backup
        console.log('Yahoo Finance returned no valid data, trying FMP API')
        const fmpResponse = await fetch(
          `https://financialmodelingprep.com/api/v3/quote/${indexSymbolMap[symbol]}?apikey=${FMP_API_KEY}`
        )

        if (fmpResponse.ok) {
          const fmpData = await fmpResponse.json()
          console.log('FMP API response:', JSON.stringify(fmpData))

          if (Array.isArray(fmpData) && fmpData.length > 0 && typeof fmpData[0].price === 'number') {
            const price = fmpData[0].price
            console.log(`Successfully fetched price from FMP for ${symbol}:`, price)
            return new Response(
              JSON.stringify({ price }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200 
              }
            )
          }
        }
      } catch (error) {
        console.error('Error fetching index price:', error)
      }
    }

    // Fallback to FMP API for other symbols
    console.log('Using FMP API for non-index symbol or as fallback')
    const fmpResponse = await fetch(
      `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${FMP_API_KEY}`
    )

    if (!fmpResponse.ok) {
      throw new Error('FMP API request failed')
    }

    const fmpData = await fmpResponse.json()
    console.log('FMP API response:', JSON.stringify(fmpData))

    if (Array.isArray(fmpData) && fmpData.length > 0 && typeof fmpData[0].price === 'number') {
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
      JSON.stringify({ price: null, message: 'No valid price data available' }),
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
        status: 200
      }
    )
  }
})
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RAPIDAPI_KEY = Deno.env.get('RAPIDAPI_KEY')
const FMP_API_KEY = Deno.env.get('FMP_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const indexSymbolMap: { [key: string]: string } = {
  'SPX': '^SPX',    // S&P 500
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

    // Handle indices with FMP API first (more reliable for indices)
    if (symbol in indexSymbolMap) {
      console.log('Fetching index price using FMP API')
      try {
        const fmpResponse = await fetch(
          `https://financialmodelingprep.com/api/v3/quote/${indexSymbolMap[symbol]}?apikey=${FMP_API_KEY}`
        )

        if (!fmpResponse.ok) {
          console.error('FMP API error:', await fmpResponse.text())
          throw new Error(`FMP API request failed with status ${fmpResponse.status}`)
        }

        const data = await fmpResponse.json()
        console.log('FMP API response:', JSON.stringify(data))

        if (Array.isArray(data) && data.length > 0 && typeof data[0].price === 'number') {
          const price = data[0].price
          console.log(`Successfully fetched price for ${symbol}:`, price)
          return new Response(
            JSON.stringify({ price }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200 
            }
          )
        }

        // If FMP API doesn't return valid data, try Investing4 API as backup
        console.log('FMP API returned no valid data, trying Investing4 API')
        const investing4Response = await fetch(
          'https://investing4.p.rapidapi.com/indices/get-details',
          {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'x-rapidapi-host': 'investing4.p.rapidapi.com',
              'x-rapidapi-key': RAPIDAPI_KEY || '',
            },
            body: JSON.stringify({
              symbol: indexSymbolMap[symbol],
              lang: 'en'
            })
          }
        )

        if (!investing4Response.ok) {
          console.error('Investing4 API error:', await investing4Response.text())
          throw new Error('Investing4 API request failed')
        }

        const investing4Data = await investing4Response.json()
        console.log('Investing4 API response:', JSON.stringify(investing4Data))

        if (investing4Data && typeof investing4Data.price === 'string') {
          const price = parseFloat(investing4Data.price.replace(/,/g, ''))
          if (!isNaN(price)) {
            console.log(`Successfully fetched price from Investing4 for ${symbol}:`, price)
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
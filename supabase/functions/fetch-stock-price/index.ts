import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

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

    // For German stocks, try Financial Modeling Prep first
    if (symbol.endsWith('.DE') || symbol === 'DB') {
      const fmpApiKey = Deno.env.get('FMP_API_KEY')
      if (!fmpApiKey) {
        throw new Error('Financial Modeling Prep API key not configured')
      }

      // For German stocks on XETRA, we need to use the correct exchange
      const baseSymbol = symbol === 'DB' ? 'DB' : symbol.split('.')[0]
      const fmpSymbol = `${baseSymbol}.XETRA`
      const fmpUrl = `https://financialmodelingprep.com/api/v3/quote/${fmpSymbol}?apikey=${fmpApiKey}`
      console.log('Fetching from FMP URL for German stock:', fmpSymbol)

      try {
        const fmpResponse = await fetch(fmpUrl)
        console.log('FMP API Response status:', fmpResponse.status)
        
        if (fmpResponse.ok) {
          const fmpData = await fmpResponse.json()
          console.log('FMP API Response data:', JSON.stringify(fmpData))
          
          if (Array.isArray(fmpData) && fmpData.length > 0) {
            const price = fmpData[0].price
            if (price) {
              console.log('Successfully fetched German stock price from FMP:', price)
              return new Response(
                JSON.stringify({ price }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              )
            }
          }
          console.log('FMP API returned invalid data format:', JSON.stringify(fmpData))
        } else {
          console.log('FMP API request failed with status:', fmpResponse.status)
          const errorText = await fmpResponse.text()
          console.log('FMP API error response:', errorText)
        }
      } catch (error) {
        console.error('Error fetching from FMP API:', error)
      }

      // Try alternative FMP endpoint with different symbol format
      try {
        const altFmpSymbol = `${baseSymbol}.DE`
        const altFmpUrl = `https://financialmodelingprep.com/api/v3/quote/${altFmpSymbol}?apikey=${fmpApiKey}`
        console.log('Trying alternative FMP URL:', altFmpSymbol)
        
        const altResponse = await fetch(altFmpUrl)
        if (altResponse.ok) {
          const altData = await altResponse.json()
          console.log('Alternative FMP response:', JSON.stringify(altData))
          
          if (Array.isArray(altData) && altData.length > 0 && altData[0].price) {
            const price = altData[0].price
            console.log('Successfully fetched German stock price from alternative FMP endpoint:', price)
            return new Response(
              JSON.stringify({ price }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }
      } catch (error) {
        console.error('Error fetching from alternative FMP endpoint:', error)
      }
      
      console.log('FMP API attempts failed, trying Yahoo Finance...')
    }

    // Try Yahoo Finance as backup for German stocks
    if (symbol.endsWith('.DE')) {
      try {
        const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`
        console.log('Fetching from Yahoo Finance URL:', yahooUrl)
        
        const yahooResponse = await fetch(yahooUrl)
        if (yahooResponse.ok) {
          const yahooData = await yahooResponse.json()
          if (yahooData?.chart?.result?.[0]?.meta?.regularMarketPrice) {
            const price = yahooData.chart.result[0].meta.regularMarketPrice
            console.log('Successfully fetched German stock price from Yahoo Finance:', price)
            return new Response(
              JSON.stringify({ price }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }
      } catch (error) {
        console.error('Error fetching from Yahoo Finance:', error)
      }
    }

    // Use Alpha Vantage as final fallback
    const apiKey = Deno.env.get('ALPHA_VANTAGE_API_KEY')
    if (!apiKey) {
      throw new Error('Alpha Vantage API key not configured')
    }

    let alphaVantageSymbol = symbol
    if (symbol.includes('.')) {
      const [base, exchange] = symbol.split('.')
      switch (exchange) {
        case 'DE': // German stocks
          alphaVantageSymbol = `${base}.DEX`
          break
        case 'PA': // Paris stocks
          alphaVantageSymbol = `${base}.PAR`
          break
        case 'MI': // Milan stocks
          alphaVantageSymbol = `${base}.MIL`
          break
        case 'AS': // Amsterdam stocks
          alphaVantageSymbol = `${base}.AMS`
          break
        case 'L': // London stocks
          alphaVantageSymbol = `${base}.LON`
          break
        default:
          alphaVantageSymbol = symbol
      }
    }

    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${alphaVantageSymbol}&apikey=${apiKey}`
    console.log('Fetching from Alpha Vantage URL:', url)

    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Alpha Vantage API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Alpha Vantage response:', JSON.stringify(data))
    
    if (data['Global Quote'] && data['Global Quote']['05. price']) {
      const price = parseFloat(data['Global Quote']['05. price'])
      console.log('Successfully fetched price from Alpha Vantage:', price)
      
      return new Response(
        JSON.stringify({ price }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    throw new Error('No price data available from any source')

  } catch (error) {
    console.error('Error in fetch-stock-price:', error.message)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to fetch stock price',
        symbol: symbol
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
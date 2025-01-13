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

      // For German stocks, try real-time quote endpoint first
      const baseSymbol = symbol === 'DB' ? 'DB' : symbol.split('.')[0]
      
      // Try real-time quote endpoint first
      try {
        const rtQuoteUrl = `https://financialmodelingprep.com/api/v3/quote-short/${baseSymbol}.DE?apikey=${fmpApiKey}`
        console.log('Fetching real-time quote from FMP:', rtQuoteUrl)
        
        const rtResponse = await fetch(rtQuoteUrl)
        if (rtResponse.ok) {
          const rtData = await rtResponse.json()
          console.log('Real-time quote response:', JSON.stringify(rtData))
          
          if (Array.isArray(rtData) && rtData.length > 0 && rtData[0].price) {
            const price = rtData[0].price
            console.log('Successfully fetched real-time German stock price:', price)
            return new Response(
              JSON.stringify({ price }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }
      } catch (error) {
        console.error('Error fetching real-time quote:', error)
      }

      // Try historical data endpoint as backup
      try {
        const histUrl = `https://financialmodelingprep.com/api/v3/historical-price-full/${baseSymbol}.DE?apikey=${fmpApiKey}&serietype=line`
        console.log('Trying historical data endpoint:', histUrl)
        
        const histResponse = await fetch(histUrl)
        if (histResponse.ok) {
          const histData = await histResponse.json()
          console.log('Historical data response:', JSON.stringify(histData))
          
          if (histData.historical && histData.historical.length > 0) {
            const price = histData.historical[0].close
            console.log('Successfully fetched latest historical price:', price)
            return new Response(
              JSON.stringify({ price }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }
      } catch (error) {
        console.error('Error fetching historical data:', error)
      }

      // Try Yahoo Finance as backup
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
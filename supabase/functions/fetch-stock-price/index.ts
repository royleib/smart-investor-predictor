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

    // Get Alpha Vantage API key from environment
    const apiKey = Deno.env.get('ALPHA_VANTAGE_API_KEY')
    if (!apiKey) {
      throw new Error('Alpha Vantage API key not configured')
    }

    // Construct Alpha Vantage API URL
    // Note: For European stocks, we need to handle different exchanges
    let alphaVantageSymbol = symbol
    if (symbol.includes('.')) {
      // Handle European market symbols
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
    
    // Check if we got a valid price from Alpha Vantage
    if (data['Global Quote'] && data['Global Quote']['05. price']) {
      const price = parseFloat(data['Global Quote']['05. price'])
      console.log('Successfully fetched price from Alpha Vantage:', price)
      
      return new Response(
        JSON.stringify({ price }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // If we didn't get a valid price, try Yahoo Finance as fallback
    console.log('No price from Alpha Vantage, trying Yahoo Finance...')
    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`
    const yahooResponse = await fetch(yahooUrl)
    
    if (!yahooResponse.ok) {
      throw new Error('Failed to fetch price from all sources')
    }

    const yahooData = await yahooResponse.json()
    
    if (!yahooData?.chart?.result?.[0]?.meta?.regularMarketPrice) {
      throw new Error('No price data available from any source')
    }

    const yahooPrice = yahooData.chart.result[0].meta.regularMarketPrice
    console.log('Successfully fetched price from Yahoo Finance:', yahooPrice)

    return new Response(
      JSON.stringify({ price: yahooPrice }),
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
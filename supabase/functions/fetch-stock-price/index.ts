import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

console.log('Hello from fetch-stock-price function!')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        'Access-Control-Max-Age': '86400'
      }
    })
  }

  try {
    const { symbol } = await req.json()
    
    if (!symbol) {
      return new Response(
        JSON.stringify({ error: 'Symbol is required' }),
        { 
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      )
    }

    console.log('Fetching price for symbol:', symbol)

    // For German stocks, try Financial Modeling Prep first
    if (symbol.endsWith('.DE') || symbol === 'DB') {
      const fmpApiKey = Deno.env.get('FMP_API_KEY')
      if (!fmpApiKey) {
        throw new Error('Financial Modeling Prep API key not configured')
      }

      const baseSymbol = symbol === 'DB' ? 'DB' : symbol.split('.')[0]
      console.log('Processing German stock:', baseSymbol)
      
      // Try XETRA exchange with detailed error logging
      try {
        const xetraUrl = `https://financialmodelingprep.com/api/v3/quote/${baseSymbol}.XETRA?apikey=${fmpApiKey}`
        console.log('Fetching from XETRA:', xetraUrl)
        
        const xetraResponse = await fetch(xetraUrl)
        if (!xetraResponse.ok) {
          console.error('XETRA response not OK:', await xetraResponse.text())
          throw new Error('XETRA response not OK')
        }
        
        const xetraData = await xetraResponse.json()
        console.log('XETRA response:', JSON.stringify(xetraData))
        
        if (Array.isArray(xetraData) && xetraData.length > 0 && xetraData[0].price) {
          const price = xetraData[0].price
          console.log('Successfully fetched XETRA price:', price)
          return new Response(
            JSON.stringify({ price }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      } catch (error) {
        console.error('Error fetching from XETRA:', error)
      }

      // Try real-time quote endpoint with detailed error logging
      try {
        const rtQuoteUrl = `https://financialmodelingprep.com/api/v3/quote-short/${baseSymbol}.DE?apikey=${fmpApiKey}`
        console.log('Fetching real-time quote:', rtQuoteUrl)
        
        const rtResponse = await fetch(rtQuoteUrl)
        if (!rtResponse.ok) {
          console.error('Real-time quote response not OK:', await rtResponse.text())
          throw new Error('Real-time quote response not OK')
        }
        
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
      } catch (error) {
        console.error('Error fetching real-time quote:', error)
      }

      // Try Yahoo Finance with detailed error logging
      try {
        const yahooSymbol = symbol === 'DB' ? 'DBK.DE' : symbol
        const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=1d`
        console.log('Fetching from Yahoo Finance:', yahooUrl)
        
        const yahooResponse = await fetch(yahooUrl)
        if (!yahooResponse.ok) {
          console.error('Yahoo Finance response not OK:', await yahooResponse.text())
          throw new Error('Yahoo Finance response not OK')
        }
        
        const yahooData = await yahooResponse.json()
        console.log('Yahoo Finance response:', JSON.stringify(yahooData))
        
        if (yahooData?.chart?.result?.[0]?.meta?.regularMarketPrice) {
          const price = yahooData.chart.result[0].meta.regularMarketPrice
          console.log('Successfully fetched price from Yahoo Finance:', price)
          return new Response(
            JSON.stringify({ price }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      } catch (error) {
        console.error('Error fetching from Yahoo Finance:', error)
      }
    }

    // Use Alpha Vantage as final fallback with better error handling
    const apiKey = Deno.env.get('ALPHA_VANTAGE_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Alpha Vantage API key not configured' }),
        { 
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      )
    }

    let alphaVantageSymbol = symbol
    if (symbol.includes('.')) {
      const [base, exchange] = symbol.split('.')
      switch (exchange) {
        case 'DE':
          alphaVantageSymbol = `${base}.DEX`
          break
        case 'PA':
          alphaVantageSymbol = `${base}.PAR`
          break
        case 'MI':
          alphaVantageSymbol = `${base}.MIL`
          break
        case 'AS':
          alphaVantageSymbol = `${base}.AMS`
          break
        case 'L':
          alphaVantageSymbol = `${base}.LON`
          break
        default:
          alphaVantageSymbol = symbol
      }
    }

    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${alphaVantageSymbol}&apikey=${apiKey}`
    console.log('Fetching from Alpha Vantage:', url)

    const response = await fetch(url)
    if (!response.ok) {
      console.error('Alpha Vantage response not OK:', await response.text())
      return new Response(
        JSON.stringify({ error: 'Alpha Vantage API error' }),
        { 
          status: response.status,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      )
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

    return new Response(
      JSON.stringify({ error: 'No price data available from any source' }),
      { 
        status: 404,
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
        error: error.message || 'Failed to fetch stock price',
        symbol: symbol
      }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log('Hello from fetch-fallback-price function!')

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

    console.log('Fetching fallback price for symbol:', symbol)

    // Try Yahoo Finance first
    try {
      const yahooSymbol = symbol.includes('.DE') ? symbol : 
                         symbol === 'SAP' ? 'SAP.DE' :
                         symbol === 'DB' ? 'DBK.DE' :
                         symbol
      
      const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=1d`
      console.log('Fetching from Yahoo Finance:', yahooUrl)
      
      const yahooResponse = await fetch(yahooUrl)
      if (yahooResponse.ok) {
        const yahooData = await yahooResponse.json()
        
        if (yahooData?.chart?.result?.[0]?.meta?.regularMarketPrice) {
          const price = yahooData.chart.result[0].meta.regularMarketPrice
          console.log('Successfully fetched price from Yahoo Finance:', price)
          return new Response(
            JSON.stringify({ price }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }
    } catch (error) {
      console.error('Error fetching from Yahoo Finance:', error)
    }

    // Try CoinGecko for cryptocurrencies
    if (['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP'].includes(symbol)) {
      try {
        const coinId = {
          'BTC': 'bitcoin',
          'ETH': 'ethereum',
          'USDT': 'tether',
          'BNB': 'binancecoin',
          'SOL': 'solana',
          'XRP': 'ripple'
        }[symbol]

        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
        console.log('Fetching from CoinGecko:', url)
        
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          if (data[coinId]?.usd) {
            const price = parseFloat(data[coinId].usd)
            console.log('Successfully fetched price from CoinGecko:', price)
            // Ensure we return the full price value without any decimal manipulation
            return new Response(
              JSON.stringify({ price: price }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }
      } catch (error) {
        console.error('Error fetching from CoinGecko:', error)
      }
    }

    // If all attempts fail, throw an error
    throw new Error('Could not fetch price from any source')

  } catch (error) {
    console.error('Error in fetch-fallback-price:', error.message)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to fetch fallback price',
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
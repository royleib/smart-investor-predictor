import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log('Hello from fetch-fallback-price function!')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { symbol } = await req.json()
    
    if (!symbol) {
      throw new Error('Symbol is required')
    }

    console.log('Fetching fallback price for symbol:', symbol)

    // Handle cryptocurrencies first with CoinGecko
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

        // Try CoinGecko first
        const cgUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
        console.log('Fetching from CoinGecko:', cgUrl)
        
        const cgResponse = await fetch(cgUrl)
        if (cgResponse.ok) {
          const cgData = await cgResponse.json()
          if (cgData[coinId]?.usd) {
            const price = Number(cgData[coinId].usd)
            console.log('Successfully fetched price from CoinGecko:', price)
            return new Response(
              JSON.stringify({ price }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }

        // If CoinGecko fails, try Binance API as fallback for crypto
        const binanceSymbol = symbol === 'BTC' ? 'BTCUSDT' : 
                            symbol === 'ETH' ? 'ETHUSDT' :
                            symbol === 'BNB' ? 'BNBUSDT' :
                            symbol === 'SOL' ? 'SOLUSDT' :
                            symbol === 'XRP' ? 'XRPUSDT' : null

        if (binanceSymbol) {
          const binanceUrl = `https://api.binance.com/api/v3/ticker/price?symbol=${binanceSymbol}`
          console.log('Fetching from Binance:', binanceUrl)
          
          const binanceResponse = await fetch(binanceUrl)
          if (binanceResponse.ok) {
            const binanceData = await binanceResponse.json()
            if (binanceData?.price) {
              const price = Number(binanceData.price)
              console.log('Successfully fetched price from Binance:', price)
              return new Response(
                JSON.stringify({ price }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              )
            }
          }
        }
      } catch (error) {
        console.error('Error fetching crypto price:', error)
      }
    }

    // For EU/German stocks, try multiple sources
    if (symbol.includes('.DE') || symbol === 'SAP' || symbol === 'DB') {
      try {
        // Try Financial Modeling Prep first
        const fmpApiKey = Deno.env.get('FMP_API_KEY')
        if (fmpApiKey) {
          const baseSymbol = symbol === 'DB' ? 'DB' : symbol.replace('.DE', '')
          console.log('Processing German stock:', baseSymbol)
          
          const xetraUrl = `https://financialmodelingprep.com/api/v3/quote/${baseSymbol}.XETRA?apikey=${fmpApiKey}`
          console.log('Fetching from FMP XETRA:', xetraUrl)
          
          const xetraResponse = await fetch(xetraUrl)
          if (xetraResponse.ok) {
            const xetraData = await xetraResponse.json()
            if (Array.isArray(xetraData) && xetraData.length > 0 && xetraData[0].price) {
              const price = Number(xetraData[0].price)
              console.log('Successfully fetched XETRA price:', price)
              return new Response(
                JSON.stringify({ price }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              )
            }
          }
        }
      } catch (error) {
        console.error('Error fetching from FMP:', error)
      }
    }

    // Try Yahoo Finance as a final fallback for all assets
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
          const price = Number(yahooData.chart.result[0].meta.regularMarketPrice)
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
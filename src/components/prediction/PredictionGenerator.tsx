interface Prediction {
  period: string;
  price: number;
  probability: number;
  trend: 'up' | 'down';
}

interface PredictionData {
  symbol: string;
  currentPrice: number;
  predictions: Prediction[];
  explanation: string;
}

export const generatePredictions = (basePrice: number, selectedSymbol: string, selectedAssetType: string): PredictionData => {
  const getRandomTrend = () => Math.random() > 0.5 ? 'up' as const : 'down' as const;
  
  const getExplanation = () => {
    if (selectedAssetType === 'Crypto') {
      return `Analysis for ${selectedSymbol}: The cryptocurrency market shows ${getRandomTrend() === 'up' ? 'positive' : 'negative'} momentum. 
      Key factors include: regulatory developments in major markets, institutional adoption trends, network activity metrics, and overall market sentiment. 
      Technical indicators suggest ${getRandomTrend() === 'up' ? 'potential breakthrough of resistance levels' : 'testing of support levels'}. 
      Consider market volatility and global economic factors affecting digital assets.`;
    } else {
      return `Analysis for ${selectedSymbol}: Based on comprehensive market research including:
      1. Financial Performance: Recent ${getRandomTrend() === 'up' ? 'strong' : 'mixed'} quarterly results
      2. Industry Trends: ${getRandomTrend() === 'up' ? 'Growing' : 'Challenging'} market conditions
      3. Economic Indicators: Impact of interest rates and inflation
      4. Technical Analysis: ${getRandomTrend() === 'up' ? 'Bullish' : 'Bearish'} momentum indicators
      5. Market Sentiment: ${getRandomTrend() === 'up' ? 'Positive' : 'Cautious'} institutional investor outlook`;
    }
  };

  const predictions = [
    {
      period: '1 Week',
      price: basePrice * (1 + (Math.random() * 0.04 - 0.02)), // ±2%
      probability: 0.75 + (Math.random() * 0.1),
      trend: getRandomTrend()
    },
    {
      period: '1 Month',
      price: basePrice * (1 + (Math.random() * 0.08 - 0.04)), // ±4%
      probability: 0.65 + (Math.random() * 0.1),
      trend: getRandomTrend()
    },
    {
      period: '6 Months',
      price: basePrice * (1 + (Math.random() * 0.16 - 0.08)), // ±8%
      probability: 0.55 + (Math.random() * 0.1),
      trend: getRandomTrend()
    },
    {
      period: '1 Year',
      price: basePrice * (1 + (Math.random() * 0.24 - 0.12)), // ±12%
      probability: 0.45 + (Math.random() * 0.1),
      trend: getRandomTrend()
    }
  ];

  return {
    symbol: selectedSymbol,
    currentPrice: basePrice,
    predictions,
    explanation: getExplanation()
  };
};
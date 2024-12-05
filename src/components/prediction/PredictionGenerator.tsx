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
  const calculateTrend = (predictedPrice: number, currentPrice: number): 'up' | 'down' => {
    return predictedPrice > currentPrice ? 'up' : 'down';
  };
  
  const getExplanation = () => {
    if (selectedAssetType === 'Crypto') {
      return `Analysis for ${selectedSymbol}: The cryptocurrency market shows mixed signals based on: 
      1. Market Sentiment: ${Math.random() > 0.5 ? 'Positive momentum in DeFi adoption' : 'Regulatory concerns affecting market confidence'}
      2. Technical Analysis: Key resistance and support levels suggest potential ${Math.random() > 0.5 ? 'breakthrough' : 'consolidation'}
      3. On-Chain Metrics: ${Math.random() > 0.5 ? 'Increasing' : 'Decreasing'} network activity and wallet addresses
      4. Institutional Interest: ${Math.random() > 0.5 ? 'Growing institutional adoption' : 'Cautious institutional stance'}
      5. Market Correlation: Impact of broader crypto market trends and Bitcoin dominance`;
    } else {
      return `Analysis for ${selectedSymbol}: Based on comprehensive market research including:
      1. Financial Performance: Recent ${Math.random() > 0.5 ? 'strong' : 'mixed'} quarterly results
      2. Industry Trends: ${Math.random() > 0.5 ? 'Growing' : 'Challenging'} market conditions
      3. Economic Indicators: Impact of interest rates and inflation
      4. Technical Analysis: Multiple timeframe analysis shows ${Math.random() > 0.5 ? 'bullish' : 'bearish'} momentum
      5. Market Position: ${Math.random() > 0.5 ? 'Expanding' : 'Defending'} market share in key segments`;
    }
  };

  // Generate predictions with properly calculated trends
  const generatePrediction = (period: string, percentageRange: number): Prediction => {
    const randomFactor = (Math.random() * 2 - 1) * percentageRange; // Random between -range and +range
    const predictedPrice = basePrice * (1 + randomFactor);
    
    return {
      period,
      price: predictedPrice,
      probability: 0.45 + (Math.random() * 0.3), // Between 0.45 and 0.75
      trend: calculateTrend(predictedPrice, basePrice)
    };
  };

  const predictions = [
    generatePrediction('1 Week', 0.02),    // ±2%
    generatePrediction('1 Month', 0.04),   // ±4%
    generatePrediction('6 Months', 0.08),  // ±8%
    generatePrediction('1 Year', 0.12)     // ±12%
  ];

  return {
    symbol: selectedSymbol,
    currentPrice: basePrice,
    predictions,
    explanation: getExplanation()
  };
};
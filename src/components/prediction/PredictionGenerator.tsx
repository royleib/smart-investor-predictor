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
      return `Comprehensive Analysis for ${selectedSymbol}:

1. Market Sentiment: ${Math.random() > 0.5 ? 
  'Current market sentiment shows strong institutional adoption and increasing retail interest. Major financial institutions are expanding their crypto offerings, suggesting growing mainstream acceptance.' : 
  'Market sentiment reflects cautious positioning due to regulatory developments and macro-economic factors. Institutional investors are showing strategic accumulation patterns.'}

2. Technical Analysis: ${Math.random() > 0.5 ?
  'Price action shows a strong support level formation with decreasing selling pressure. Key moving averages indicate potential trend reversal with positive momentum building.' :
  'Technical indicators suggest a period of consolidation with key resistance levels being tested. Volume patterns indicate accumulation phase near support zones.'}

3. On-Chain Metrics: ${Math.random() > 0.5 ?
  'Network activity shows healthy growth with increasing active addresses and transaction volumes. Mining metrics indicate strong network security and growing adoption.' :
  'Chain analysis reveals steady accumulation by long-term holders, while exchange outflows suggest reduced selling pressure.'}

4. Institutional Interest: ${Math.random() > 0.5 ?
  'Major financial institutions are launching new crypto investment products, indicating growing institutional confidence in the asset class.' :
  'Institutional holdings show steady accumulation patterns, with increased interest in crypto as a portfolio diversification tool.'}

5. Market Integration: ${Math.random() > 0.5 ?
  'Growing integration with traditional finance through ETFs and payment systems suggests potential for increased adoption and value appreciation.' :
  'Development of institutional-grade infrastructure and custody solutions is creating a more robust market environment.'}`;
    } else {
      return `Detailed Analysis for ${selectedSymbol}:

1. Financial Performance: ${Math.random() > 0.5 ?
  'Recent quarterly results exceeded market expectations, showing strong revenue growth and improving profit margins. Cash flow generation remains robust with healthy balance sheet metrics.' :
  'Company demonstrates solid operational execution with strategic cost management and market share gains. Investment in growth initiatives shows promising early results.'}

2. Industry Position: ${Math.random() > 0.5 ?
  'Company maintains leading market position with expanding competitive advantages. Recent product launches and innovation pipeline suggest strong growth potential.' :
  'Strategic acquisitions and partnerships are strengthening market presence. Investment in R&D is driving product innovation and market expansion.'}

3. Economic Context: ${Math.random() > 0.5 ?
  'Current macroeconomic conditions, including interest rate trends and inflation data, suggest a favorable environment for sector growth.' :
  'Company shows resilience to economic headwinds through diversified revenue streams and strong pricing power.'}

4. Technical Factors: ${Math.random() > 0.5 ?
  'Price action shows strong momentum with key technical indicators suggesting continued upward trend. Volume patterns support price movement.' :
  'Technical analysis indicates potential breakout from consolidation phase with improving market breadth.'}

5. Growth Catalysts: ${Math.random() > 0.5 ?
  'Upcoming product launches and market expansion plans provide multiple growth vectors. International market penetration shows promising early results.' :
  'Strategic initiatives in digital transformation and market expansion are expected to drive future growth.'}`;
    }
  };

  const generatePrediction = (period: string, percentageRange: number): Prediction => {
    const randomFactor = (Math.random() * 2 - 1) * percentageRange;
    const predictedPrice = basePrice * (1 + randomFactor);
    
    // Updated probability generation to be between 0.75 and 0.95
    const probability = 0.75 + (Math.random() * 0.20);
    
    return {
      period,
      price: predictedPrice,
      probability,
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
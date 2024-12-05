import { useEffect } from 'react';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";

interface PriceDataFetcherProps {
  step: number;
  selectedSymbol: string;
  selectedAssetType: string;
  setCurrentPrice: (price: number | null) => void;
}

const ALPHA_VANTAGE_API_KEY = 'XLLX4SPDO7AUDSG3';

// Fallback prices moved from Index.tsx
const fallbackPrices: Record<string, number> = {
  // Stocks - US
  'AAPL': 191.45,
  'MSFT': 378.85,
  'GOOGL': 134.99,
  'AMZN': 147.03,
  'META': 325.28,
  'TSLA': 238.45,
  // Stocks - EU
  'ASML.AMS': 687.30,
  'SAP.FRA': 145.78,
  'LVMH.PAR': 834.50,
  'SIE.FRA': 165.92,
  'NOVO-B.CPH': 725.40,
  'SHELL.LON': 2543.50,
  // Stocks - ASIA
  '9984.TYO': 6789.00,
  '005930.KRX': 71500.00,
  '9988.HKG': 72.55,
  '000660.KRX': 125000.00,
  '7203.TYO': 2825.50,
  '1299.HKG': 67.85,
  // Crypto
  'BTC': 43250.00,
  'ETH': 2280.50,
  'USDT': 1.00,
  'BNB': 305.75,
  'SOL': 98.45,
  'XRP': 0.55,
};

export const fetchPrice = async (symbol: string, assetType: string) => {
  console.log('Fetching price for:', symbol, 'Type:', assetType);
  
  try {
    if (assetType === 'Crypto') {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'CURRENCY_EXCHANGE_RATE',
          from_currency: symbol,
          to_currency: 'USD',
          apikey: ALPHA_VANTAGE_API_KEY
        }
      });
      
      console.log('Crypto API Response:', response.data);
      
      if (response.data['Realtime Currency Exchange Rate'] && 
          response.data['Realtime Currency Exchange Rate']['5. Exchange Rate']) {
        return parseFloat(response.data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
      }
      throw new Error('Invalid crypto price data received');
    } else {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol,
          apikey: ALPHA_VANTAGE_API_KEY
        }
      });
      
      console.log('Stock API Response:', response.data);
      
      if (response.data['Global Quote'] && response.data['Global Quote']['05. price']) {
        return parseFloat(response.data['Global Quote']['05. price']);
      }
      throw new Error('Invalid stock price data received');
    }
  } catch (error) {
    console.error('Error fetching price:', error);
    throw error;
  }
};

export const PriceDataFetcher = ({ step, selectedSymbol, selectedAssetType, setCurrentPrice }: PriceDataFetcherProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const getPriceData = async () => {
      if (step === 5 && selectedSymbol) {
        try {
          const price = await fetchPrice(selectedSymbol, selectedAssetType);
          console.log('Setting current price to:', price);
          setCurrentPrice(price);
        } catch (error) {
          console.error('Error in price fetch:', error);
          toast({
            title: "Using fallback price data",
            description: "Could not fetch real-time price. Using recent historical data.",
            variant: "default",
          });
          
          const fallbackPrice = fallbackPrices[selectedSymbol];
          if (fallbackPrice) {
            console.log('Using fallback price:', fallbackPrice);
            setCurrentPrice(fallbackPrice);
          } else {
            console.error('No fallback price available for:', selectedSymbol);
            toast({
              title: "Error",
              description: "Could not retrieve price data for this asset.",
              variant: "destructive",
            });
          }
        }
      }
    };

    getPriceData();
  }, [step, selectedSymbol, selectedAssetType, setCurrentPrice, toast]);

  return null;
};

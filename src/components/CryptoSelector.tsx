import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Bitcoin } from 'lucide-react';

const cryptos = [
  { symbol: 'BTC', name: 'Bitcoin', description: 'Digital Gold' },
  { symbol: 'ETH', name: 'Ethereum', description: 'Smart Contract Platform' },
  { symbol: 'USDT', name: 'Tether', description: 'Stablecoin' },
  { symbol: 'BNB', name: 'Binance Coin', description: 'Exchange Token' },
  { symbol: 'SOL', name: 'Solana', description: 'High-Performance Blockchain' },
  { symbol: 'XRP', name: 'XRP', description: 'Payment Protocol' },
];

interface CryptoSelectorProps {
  onSelect: (symbol: string) => void;
}

export const CryptoSelector = ({ onSelect }: CryptoSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {cryptos.map((crypto) => (
        <Card 
          key={crypto.symbol}
          className="cursor-pointer bg-white/80 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all hover:scale-105"
          onClick={() => onSelect(crypto.symbol)}
        >
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <Bitcoin className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-montserrat font-semibold text-gray-800">{crypto.name}</h3>
              <p className="text-sm text-gray-600">{crypto.symbol} - {crypto.description}</p>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
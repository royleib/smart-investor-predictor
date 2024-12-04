import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from 'lucide-react';

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
    <div className="space-y-4 p-4">
      {cryptos.map((crypto) => (
        <Card 
          key={crypto.symbol}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onSelect(crypto.symbol)}
        >
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="text-xl font-montserrat font-semibold">{crypto.name}</h3>
              <p className="text-sm text-gray-500">{crypto.symbol} - {crypto.description}</p>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
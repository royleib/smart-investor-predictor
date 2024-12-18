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
          className="cursor-pointer bg-white border-[#E2E8F0] hover:shadow-md transition-all hover:scale-[1.02]"
          onClick={() => onSelect(crypto.symbol)}
        >
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 bg-[#F8FAFC] rounded-full flex items-center justify-center mr-4">
              <Bitcoin className="h-6 w-6 text-[#475569]" />
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-montserrat font-semibold text-[#334155]">{crypto.name}</h3>
              <p className="text-sm text-[#64748B]">{crypto.symbol} - {crypto.description}</p>
            </div>
            <ChevronRight className="h-6 w-6 text-[#94A3B8]" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
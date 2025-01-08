import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, LineChart } from 'lucide-react';

const etfs = [
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', description: 'S&P 500 Index Fund' },
  { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', description: 'S&P 500 Index Fund' },
  { symbol: 'IVV', name: 'iShares Core S&P 500 ETF', description: 'S&P 500 Index Fund' },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', description: 'Total US Market' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', description: 'NASDAQ 100 Index Fund' },
  { symbol: 'VGT', name: 'Vanguard Information Technology ETF', description: 'Tech Sector' },
  { symbol: 'XLK', name: 'Technology Select Sector SPDR', description: 'Tech Sector' },
  { symbol: 'VUG', name: 'Vanguard Growth ETF', description: 'Growth Stocks' }
];

interface ETFSelectorProps {
  onSelect: (symbol: string) => void;
}

export const ETFSelector = ({ onSelect }: ETFSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {etfs.map((etf) => (
        <Card 
          key={etf.symbol}
          className="cursor-pointer bg-white/80 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all hover:scale-105"
          onClick={() => onSelect(etf.symbol)}
        >
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <LineChart className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-montserrat font-semibold text-gray-800">{etf.name}</h3>
              <p className="text-sm text-gray-600">{etf.symbol} - {etf.description}</p>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, TrendingUp } from 'lucide-react';

const stocksByMarket = {
  US: [
    { symbol: 'AAPL', name: 'Apple Inc.', description: 'Technology' },
    { symbol: 'MSFT', name: 'Microsoft', description: 'Technology' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', description: 'Technology' },
    { symbol: 'AMZN', name: 'Amazon.com', description: 'Consumer Cyclical' },
    { symbol: 'META', name: 'Meta Platforms', description: 'Technology' },
    { symbol: 'TSLA', name: 'Tesla Inc.', description: 'Automotive' },
  ],
  EU: [
    { symbol: 'ASML.AMS', name: 'ASML Holding', description: 'Semiconductor Equipment' },
    { symbol: 'SAP.FRA', name: 'SAP SE', description: 'Enterprise Software' },
    { symbol: 'LVMH.PAR', name: 'LVMH', description: 'Luxury Goods' },
    { symbol: 'SIE.FRA', name: 'Siemens AG', description: 'Industrial Technology' },
    { symbol: 'NOVO-B.CPH', name: 'Novo Nordisk', description: 'Healthcare' },
    { symbol: 'SHELL.LON', name: 'Shell PLC', description: 'Energy' },
  ],
  ASIA: [
    { symbol: '9984.TYO', name: 'SoftBank Group', description: 'Technology Investment' },
    { symbol: '005930.KRX', name: 'Samsung Electronics', description: 'Technology' },
    { symbol: '9988.HKG', name: 'Alibaba Group', description: 'E-commerce' },
    { symbol: '000660.KRX', name: 'SK Hynix', description: 'Semiconductors' },
    { symbol: '7203.TYO', name: 'Toyota Motor', description: 'Automotive' },
    { symbol: '1299.HKG', name: 'AIA Group', description: 'Insurance' },
  ]
};

interface StockSelectorProps {
  onSelect: (symbol: string) => void;
  market: string;
}

export const StockSelector = ({ onSelect, market }: StockSelectorProps) => {
  const stocks = stocksByMarket[market as keyof typeof stocksByMarket] || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {stocks.map((stock) => (
        <Card 
          key={stock.symbol}
          className="cursor-pointer bg-white/80 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all hover:scale-105"
          onClick={() => onSelect(stock.symbol)}
        >
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-montserrat font-semibold text-gray-800">{stock.name}</h3>
              <p className="text-sm text-gray-600">{stock.symbol} - {stock.description}</p>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
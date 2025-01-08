import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, TrendingUp } from 'lucide-react';

const indices = [
  // US Indices
  { symbol: 'SPX', name: 'S&P 500', description: 'US Large Cap' },
  { symbol: 'NDX', name: 'NASDAQ 100', description: 'US Tech' },
  { symbol: 'DJI', name: 'Dow Jones', description: 'US Blue Chips' },
  // European Indices
  { symbol: 'UKX', name: 'FTSE 100', description: 'UK Blue Chips' },
  { symbol: 'DAX', name: 'DAX 40', description: 'German Blue Chips' },
  { symbol: 'IBEX', name: 'IBEX 35', description: 'Spanish Blue Chips' },
  { symbol: 'FTSEMIB', name: 'FTSE MIB', description: 'Italian Blue Chips' },
  { symbol: 'CAC', name: 'CAC 40', description: 'French Blue Chips' },
  { symbol: 'OMX', name: 'OMX 30', description: 'Nordic Blue Chips' },
  // Other Global Indices
  { symbol: 'AXJO', name: 'ASX 200', description: 'Australian Blue Chips' },
  { symbol: 'TSX', name: 'TSX Composite', description: 'Canadian Blue Chips' }
];

interface IndicesSelectorProps {
  onSelect: (symbol: string) => void;
}

export const IndicesSelector = ({ onSelect }: IndicesSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {indices.map((index) => (
        <Card 
          key={index.symbol}
          className="cursor-pointer bg-white/80 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all hover:scale-105"
          onClick={() => onSelect(index.symbol)}
        >
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-montserrat font-semibold text-gray-800">{index.name}</h3>
              <p className="text-sm text-gray-600">{index.symbol} - {index.description}</p>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

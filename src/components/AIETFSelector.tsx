import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Cpu } from 'lucide-react';

const aiEtfs = [
  { symbol: 'IYW', name: 'iShares U.S. Technology ETF', description: 'Tech & AI Exposure' },
  { symbol: 'FTEC', name: 'Fidelity MSCI Information Tech', description: 'Tech & AI Sector' },
  { symbol: 'FDN', name: 'First Trust Dow Jones Internet', description: 'Internet & AI' },
  { symbol: 'IGM', name: 'iShares Expanded Tech Sector ETF', description: 'Extended Tech' },
  { symbol: 'IXN', name: 'iShares Global Tech ETF', description: 'Global Tech' },
  { symbol: 'XT', name: 'iShares Exponential Technologies', description: 'Emerging Tech' },
  { symbol: 'AIQ', name: 'Global X Artificial Intelligence', description: 'Pure AI Play' },
  { symbol: 'BOTZ', name: 'Global X Robotics & AI ETF', description: 'Robotics & AI' },
  { symbol: 'KOMP', name: 'SPDR S&P Kensho New Economies', description: 'Innovation Tech' },
  { symbol: 'ROBO', name: 'ROBO Global Robotics and Auto', description: 'Robotics' },
  { symbol: 'ARKQ', name: 'ARK Autonomous Tech & Robot', description: 'Autonomous Tech' },
  { symbol: 'QTUM', name: 'Defiance Quantum ETF', description: 'Quantum Computing' },
  { symbol: 'PNQI', name: 'Invesco NASDAQ Internet ETF', description: 'Internet Innovation' },
  { symbol: 'ROBT', name: 'First Trust Nasdaq AI and Rob', description: 'AI & Robotics' }
];

interface AIETFSelectorProps {
  onSelect: (symbol: string) => void;
}

export const AIETFSelector = ({ onSelect }: AIETFSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {aiEtfs.map((etf) => (
        <Card 
          key={etf.symbol}
          className="cursor-pointer bg-white/80 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all hover:scale-105"
          onClick={() => onSelect(etf.symbol)}
        >
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <Cpu className="h-6 w-6 text-purple-600" />
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
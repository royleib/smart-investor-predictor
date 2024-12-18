import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Briefcase, Bitcoin, LineChart, DollarSign } from 'lucide-react';
import { motion } from "framer-motion";

const assetTypes = [
  { id: 'Stocks', name: 'Stocks', icon: Briefcase, description: 'Trade company shares' },
  { id: 'Crypto', name: 'Cryptocurrency', icon: Bitcoin, description: 'Digital assets' },
  { id: 'ETFs', name: 'ETFs', icon: LineChart, description: 'Exchange-traded funds' },
  { id: 'Forex', name: 'Forex', icon: DollarSign, description: 'Currency exchange' }
];

interface AssetSelectorProps {
  onSelect: (type: string) => void;
}

export const AssetSelector = ({ onSelect }: AssetSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {assetTypes.map((type, index) => (
        <motion.div
          key={type.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card 
            className="cursor-pointer glass-effect hover-lift"
            onClick={() => onSelect(type.id)}
          >
            <CardContent className="flex items-center p-6">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <type.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-montserrat font-semibold text-slate-800">{type.name}</h3>
                <p className="text-slate-600">{type.description}</p>
              </div>
              <ChevronRight className="h-6 w-6 text-blue-500" />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
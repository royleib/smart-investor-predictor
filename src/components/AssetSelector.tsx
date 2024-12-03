import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from 'lucide-react';

const assetTypes = ['Stocks', 'Crypto', 'ETFs', 'Forex'];

interface AssetSelectorProps {
  onSelect: (type: string) => void;
}

export const AssetSelector = ({ onSelect }: AssetSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {assetTypes.map((type) => (
        <Card 
          key={type}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onSelect(type)}
        >
          <CardContent className="flex items-center justify-between p-6">
            <span className="text-xl font-montserrat font-semibold">{type}</span>
            <ChevronRight className="h-6 w-6 text-gray-400" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
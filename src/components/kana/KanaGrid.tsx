
import React, { useState } from 'react';
import KanaCard from './KanaCard';
import { KanaCharacter, KanaType } from '@/types/kana';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface KanaGridProps {
  kanaList: KanaCharacter[];
  className?: string;
}

const KanaGrid: React.FC<KanaGridProps> = ({ kanaList, className }) => {
  const [selectedType, setSelectedType] = useState<KanaType | 'all'>('all');
  const [expandedKana, setExpandedKana] = useState<string | null>(null);

  // Filter kana by selected type
  const filteredKana = selectedType === 'all' 
    ? kanaList 
    : kanaList.filter(kana => kana.type === selectedType);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex justify-center mb-6">
        <RadioGroup
          className="flex space-x-4"
          defaultValue="all"
          onValueChange={(value) => setSelectedType(value as KanaType | 'all')}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all">All</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hiragana" id="hiragana" />
            <Label htmlFor="hiragana">Hiragana</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="katakana" id="katakana" />
            <Label htmlFor="katakana">Katakana</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredKana.map((kana) => (
          <KanaCard
            key={kana.id}
            kana={kana}
            showDetails={expandedKana === kana.id}
            onShowDetails={() => {
              if (expandedKana === kana.id) {
                setExpandedKana(null);
              } else {
                setExpandedKana(kana.id);
              }
            }}
            onPractice={() => {
              // Will implement in the next component
              console.log(`Practice ${kana.character}`);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default KanaGrid;

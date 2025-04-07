
import React, { useEffect, useState } from 'react';
import { KanaCharacter, UserKanaProgress } from '@/types/kana';
import { kanaService } from '@/services/kanaModules';
import JapaneseCharacter from '../ui/JapaneseCharacter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { cn } from '@/lib/utils';

interface KanaGridProps {
  kanaList: KanaCharacter[];
  userProgress: UserKanaProgress[];
}

const KanaGrid: React.FC<KanaGridProps> = ({ kanaList, userProgress }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [filteredKana, setFilteredKana] = useState<KanaCharacter[]>(kanaList);

  useEffect(() => {
    // Filter kana based on the active tab
    if (activeTab === 'all') {
      setFilteredKana(kanaList);
    } else {
      setFilteredKana(kanaList.filter(kana => kana.type === activeTab));
    }
  }, [activeTab, kanaList]);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="hiragana">Hiragana</TabsTrigger>
          <TabsTrigger value="katakana">Katakana</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-5 gap-4">
        {filteredKana.map(kana => {
          const progress = userProgress.find(p => p.character_id === kana.id);
          const proficiency = progress ? progress.proficiency : 0;

          return (
            <div 
              key={kana.id} 
              className={cn(
                "aspect-square flex flex-col items-center justify-center rounded-lg border text-center",
                proficiency >= 90 ? "border-green-300 bg-green-50" :
                proficiency >= 70 ? "border-blue-300 bg-blue-50" :
                proficiency >= 40 ? "border-yellow-300 bg-yellow-50" :
                proficiency > 0 ? "border-red-300 bg-red-50" : 
                "border-gray-200 bg-gray-50"
              )}
            >
              <div className="text-xl">{kana.character}</div>
              <div className="text-xs mt-1">
                {proficiency > 0 ? `${proficiency}%` : "New"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanaGrid;

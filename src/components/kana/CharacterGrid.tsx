
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { KanaCharacter, KanaType, UserKanaProgress } from '@/types/kana';
import { kanaService } from '@/services/kanaService';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Box, Dot, Info } from 'lucide-react';

interface CharacterGridProps {
  kanaType: KanaType;
}

const CharacterGrid: React.FC<CharacterGridProps> = ({ kanaType }) => {
  const { user } = useAuth();
  const [kanaList, setKanaList] = useState<KanaCharacter[]>([]);
  const [userProgress, setUserProgress] = useState<UserKanaProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupBy, setGroupBy] = useState<'consonant' | 'vowel'>('consonant');

  useEffect(() => {
    const loadKana = async () => {
      setLoading(true);
      const allKana = kanaService.getKanaByType(kanaType);
      setKanaList(allKana);
      
      if (user) {
        const progress = await kanaService.getUserKanaProgress(user.id);
        setUserProgress(progress);
      }
      
      setLoading(false);
    };

    loadKana();
  }, [kanaType, user]);

  // Helper to get proficiency level for a kana character
  const getCharacterProficiency = (characterId: string): number => {
    if (!userProgress.length) return 0;
    
    const characterProgress = userProgress.find(p => p.character_id === characterId);
    return characterProgress ? characterProgress.proficiency : 0;
  };

  // Helper to get mastery level for a kana character
  const getCharacterMastery = (characterId: string): number => {
    if (!userProgress.length) return 0;
    
    const characterProgress = userProgress.find(p => p.character_id === characterId);
    return characterProgress ? characterProgress.mastery_level : 0;
  };

  // Helper to determine if a character is due for review
  const isCharacterDueForReview = (characterId: string): boolean => {
    if (!userProgress.length) return false;
    
    const characterProgress = userProgress.find(p => p.character_id === characterId);
    if (!characterProgress) return false;
    
    const now = new Date();
    return characterProgress.review_due <= now;
  };

  // Group kana by consonant rows (a, ka, sa, etc.)
  const kanaByConsonant: Record<string, KanaCharacter[]> = {};
  
  kanaList.forEach(kana => {
    // Extract consonant group from romaji
    let group = 'vowels';
    
    if (kana.romaji.length > 1 && !['a', 'i', 'u', 'e', 'o'].includes(kana.romaji)) {
      if (kana.romaji.startsWith('ch')) {
        group = 'ch';
      } else if (kana.romaji.startsWith('sh')) {
        group = 'sh';
      } else if (kana.romaji.startsWith('ts')) {
        group = 'ts';
      } else {
        group = kana.romaji[0];
      }
    }
    
    if (!kanaByConsonant[group]) {
      kanaByConsonant[group] = [];
    }
    
    kanaByConsonant[group].push(kana);
  });

  // Group kana by vowel sounds (a, i, u, e, o)
  const kanaByVowel: Record<string, KanaCharacter[]> = {
    'a': [],
    'i': [],
    'u': [],
    'e': [],
    'o': []
  };
  
  kanaList.forEach(kana => {
    const lastChar = kana.romaji.slice(-1);
    if (['a', 'i', 'u', 'e', 'o'].includes(lastChar)) {
      kanaByVowel[lastChar].push(kana);
    } else {
      // Special cases like 'n'
      if (!kanaByVowel['special']) {
        kanaByVowel['special'] = [];
      }
      kanaByVowel['special'].push(kana);
    }
  });

  // Get proficiency color class based on level
  const getProficiencyColorClass = (proficiency: number, mastery: number): string => {
    if (mastery >= 3) return 'bg-green-500';
    if (mastery >= 1) return 'bg-blue-400';
    if (proficiency >= 80) return 'bg-green-400';
    if (proficiency >= 60) return 'bg-yellow-400';
    if (proficiency >= 40) return 'bg-orange-400';
    if (proficiency >= 20) return 'bg-red-300';
    return 'bg-gray-200';
  };

  return (
    <div>
      <Tabs defaultValue="consonant" className="mb-4">
        <TabsList className="w-full flex">
          <TabsTrigger value="consonant" className="flex-1" onClick={() => setGroupBy('consonant')}>
            Group by Consonant
          </TabsTrigger>
          <TabsTrigger value="vowel" className="flex-1" onClick={() => setGroupBy('vowel')}>
            Group by Vowel
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {groupBy === 'consonant' ? (
        <div className="space-y-6">
          {Object.entries(kanaByConsonant).map(([group, characters]) => (
            <Card key={group}>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-3 capitalize">
                  {group === 'vowels' ? 'Vowels' : `${group} Group`}
                </h3>
                <div className="grid grid-cols-5 sm:grid-cols-5 gap-3">
                  {characters.map((kana) => {
                    const proficiency = getCharacterProficiency(kana.id);
                    const mastery = getCharacterMastery(kana.id);
                    const isDueForReview = isCharacterDueForReview(kana.id);
                    
                    return (
                      <TooltipProvider key={kana.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className={`relative flex flex-col items-center justify-center p-3 border rounded-lg ${
                                isDueForReview ? 'border-blue-400 shadow-sm' : 'border-gray-200'
                              }`}
                            >
                              {isDueForReview && (
                                <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3">
                                  <Dot className="text-blue-500 h-6 w-6" />
                                </div>
                              )}
                              <div className="text-2xl mb-1">{kana.character}</div>
                              <div className="text-xs text-gray-500">{kana.romaji}</div>
                              <div className="mt-2 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${getProficiencyColorClass(proficiency, mastery)}`}
                                  style={{ width: `${Math.max(proficiency, 5)}%` }}
                                />
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <p><strong>Character:</strong> {kana.character}</p>
                              <p><strong>Romaji:</strong> {kana.romaji}</p>
                              <p><strong>Proficiency:</strong> {proficiency}%</p>
                              {mastery > 0 && (
                                <p><strong>Mastery Level:</strong> {mastery}</p>
                              )}
                              {kana.examples && kana.examples.length > 0 && (
                                <div className="mt-1">
                                  <p><strong>Example:</strong></p>
                                  <p>{kana.examples[0].word} ({kana.examples[0].romaji})</p>
                                  <p>{kana.examples[0].meaning}</p>
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(kanaByVowel).map(([vowel, characters]) => (
            characters.length > 0 && (
              <Card key={vowel}>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-3 capitalize">
                    {vowel === 'special' ? 'Special' : `${vowel.toUpperCase()} Vowel Group`}
                  </h3>
                  <div className="grid grid-cols-5 sm:grid-cols-5 gap-3">
                    {characters.map((kana) => {
                      const proficiency = getCharacterProficiency(kana.id);
                      const mastery = getCharacterMastery(kana.id);
                      const isDueForReview = isCharacterDueForReview(kana.id);
                      
                      return (
                        <TooltipProvider key={kana.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div 
                                className={`relative flex flex-col items-center justify-center p-3 border rounded-lg ${
                                  isDueForReview ? 'border-blue-400 shadow-sm' : 'border-gray-200'
                                }`}
                              >
                                {isDueForReview && (
                                  <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3">
                                    <Dot className="text-blue-500 h-6 w-6" />
                                  </div>
                                )}
                                <div className="text-2xl mb-1">{kana.character}</div>
                                <div className="text-xs text-gray-500">{kana.romaji}</div>
                                <div className="mt-2 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${getProficiencyColorClass(proficiency, mastery)}`}
                                    style={{ width: `${Math.max(proficiency, 5)}%` }}
                                  />
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-sm">
                                <p><strong>Character:</strong> {kana.character}</p>
                                <p><strong>Romaji:</strong> {kana.romaji}</p>
                                <p><strong>Proficiency:</strong> {proficiency}%</p>
                                {mastery > 0 && (
                                  <p><strong>Mastery Level:</strong> {mastery}</p>
                                )}
                                {kana.examples && kana.examples.length > 0 && (
                                  <div className="mt-1">
                                    <p><strong>Example:</strong></p>
                                    <p>{kana.examples[0].word} ({kana.examples[0].romaji})</p>
                                    <p>{kana.examples[0].meaning}</p>
                                  </div>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterGrid;

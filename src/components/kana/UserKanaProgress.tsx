import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TraditionalProgressIndicator from '@/components/ui/TraditionalProgressIndicator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { KanaCharacter } from '@/types/kana';
import { characterProgressService } from '@/services/characterProgressService';
import { kanaService } from '@/services/kanaService';

import type { UserKanaProgress as UserKanaProgressType } from '@/types/kana';

interface KanaProgressGridProps {
  kanaType: 'hiragana' | 'katakana';
  className?: string;
}

const UserKanaProgressGrid: React.FC<KanaProgressGridProps> = ({ 
  kanaType,
  className 
}) => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<Map<string, UserKanaProgressType>>(new Map());
  const [kanaCharacters, setKanaCharacters] = useState<KanaCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupedCharacters, setGroupedCharacters] = useState<{[key: string]: KanaCharacter[]}>({});
  
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const progress = await characterProgressService.getCharacterProgress(user.id);
        const progressMap = new Map();
        progress.forEach(p => {
          progressMap.set(p.character_id, p);
        });
        setProgressData(progressMap);
        
        const characters = kanaService.getKanaByType(kanaType);
        setKanaCharacters(characters);
        
        // Group characters by consonant group
        const grouped: {[key: string]: KanaCharacter[]} = {};
        characters.forEach(char => {
          const parts = char.id.split('-');
          const group = parts.length > 1 ? parts[1] : 'special';
          if (!grouped[group]) {
            grouped[group] = [];
          }
          grouped[group].push(char);
        });
        
        setGroupedCharacters(grouped);
      } catch (error) {
        console.error("Error fetching kana progress:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProgress();
  }, [user, kanaType]);
  
  const getCharacterProgress = (characterId: string): number => {
    const progress = progressData.get(characterId);
    return progress ? progress.proficiency : 0;
  };
  
  const getCharacterMasteryLevel = (characterId: string): number => {
    const progress = progressData.get(characterId);
    return progress ? progress.mastery_level : 0;
  };
  
  const getSortedGroups = (): string[] => {
    const order = ['vowels', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w', 'g', 'z', 'd', 'b', 'p', 'special', 'combinations'];
    const availableGroups = Object.keys(groupedCharacters);
    return order.filter(group => availableGroups.includes(group));
  };
  
  const getGroupTitle = (group: string): string => {
    const titles: {[key: string]: string} = {
      'vowels': 'Vowels',
      'k': 'K-Row',
      's': 'S-Row',
      't': 'T-Row',
      'n': 'N-Row',
      'h': 'H-Row',
      'm': 'M-Row',
      'y': 'Y-Row',
      'r': 'R-Row',
      'w': 'W-Row',
      'g': 'G-Row',
      'z': 'Z-Row',
      'd': 'D-Row',
      'b': 'B-Row',
      'p': 'P-Row',
      'special': 'Special Characters',
      'combinations': 'Combinations'
    };
    
    return titles[group] || group.charAt(0).toUpperCase() + group.slice(1);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo"></div>
      </div>
    );
  }
  
  return (
    <div className={`space-y-6 ${className}`}>
      {getSortedGroups().map(group => (
        <div key={group} className="space-y-3">
          <h3 className="text-sm font-medium text-indigo">{getGroupTitle(group)}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {groupedCharacters[group]?.map(char => (
              <TooltipProvider key={char.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="overflow-hidden cursor-help hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center">
                          <div className="text-2xl font-japanese mb-2">{char.character}</div>
                          <div className="text-sm mb-3 text-muted-foreground">{char.romaji}</div>
                          <TraditionalProgressIndicator 
                            progress={getCharacterProgress(char.id)}
                            size="sm"
                            showPercentage={false}
                            masteryLevel={getCharacterMasteryLevel(char.id)}
                            showMasteryBadge={getCharacterMasteryLevel(char.id) > 0}
                            type={kanaType}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      <p className="font-semibold">{char.character} ({char.romaji})</p>
                      <p>Progress: {getCharacterProgress(char.id)}%</p>
                      <p>Practice count: {progressData.get(char.id)?.total_practice_count || 0}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      ))}
      
      {kanaCharacters.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No {kanaType} characters found.
        </div>
      )}
    </div>
  );
};

interface UserKanaProgressProps {
  kanaType?: 'hiragana' | 'katakana';
}

const UserKanaProgress: React.FC<UserKanaProgressProps> = ({ kanaType }) => {
  const [activeTab, setActiveTab] = useState<string>(kanaType || 'hiragana');
  const { user } = useAuth();
  const [stats, setStats] = useState<{
    hiragana: { learned: number, total: number, avgProficiency: number },
    katakana: { learned: number, total: number, avgProficiency: number }
  }>({
    hiragana: { learned: 0, total: 0, avgProficiency: 0 },
    katakana: { learned: 0, total: 0, avgProficiency: 0 }
  });
  
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        const allProgress = await characterProgressService.getCharacterProgress(user.id);
        const hiraganaChars = kanaService.getKanaByType('hiragana');
        const katakanaChars = kanaService.getKanaByType('katakana');
        
        const hiraganaProgress = allProgress.filter(p => 
          hiraganaChars.some(c => c.id === p.character_id)
        );
        const hiraganaLearned = hiraganaProgress.filter(p => p.proficiency > 0).length;
        const hiraganaAvg = hiraganaProgress.length > 0 
          ? hiraganaProgress.reduce((sum, p) => sum + p.proficiency, 0) / hiraganaProgress.length 
          : 0;
        
        const katakanaProgress = allProgress.filter(p => 
          katakanaChars.some(c => c.id === p.character_id)
        );
        const katakanaLearned = katakanaProgress.filter(p => p.proficiency > 0).length;
        const katakanaAvg = katakanaProgress.length > 0 
          ? katakanaProgress.reduce((sum, p) => sum + p.proficiency, 0) / katakanaProgress.length 
          : 0;
        
        setStats({
          hiragana: { 
            learned: hiraganaLearned, 
            total: hiraganaChars.length, 
            avgProficiency: hiraganaAvg 
          },
          katakana: { 
            learned: katakanaLearned, 
            total: katakanaChars.length, 
            avgProficiency: katakanaAvg 
          }
        });
      } catch (error) {
        console.error("Error fetching kana stats:", error);
      }
    };
    
    fetchStats();
  }, [user]);

  // If a specific kanaType is provided, show only that type
  if (kanaType) {
    return (
      <div className="space-y-6">
        <Card className="bg-indigo/5 border-indigo/10">
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">{kanaType === 'hiragana' ? 'Hiragana' : 'Katakana'} Progress</p>
              <div className="flex items-baseline gap-1">
                <span className={`text-xl font-semibold ${kanaType === 'hiragana' ? 'text-indigo' : 'text-vermilion'}`}>
                  {kanaType === 'hiragana' ? stats.hiragana.learned : stats.katakana.learned}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {kanaType === 'hiragana' ? stats.hiragana.total : stats.katakana.total} learned
                </span>
              </div>
              <TraditionalProgressIndicator 
                progress={kanaType === 'hiragana' 
                  ? (stats.hiragana.learned / Math.max(1, stats.hiragana.total)) * 100
                  : (stats.katakana.learned / Math.max(1, stats.katakana.total)) * 100
                }
                size="sm"
                type={kanaType}
              />
            </div>
          </CardContent>
        </Card>
        
        <UserKanaProgressGrid kanaType={kanaType} />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card className="bg-indigo/5 border-indigo/10">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Hiragana Progress</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-semibold text-indigo">{stats.hiragana.learned}</span>
                <span className="text-sm text-muted-foreground">/ {stats.hiragana.total} learned</span>
              </div>
              <TraditionalProgressIndicator 
                progress={(stats.hiragana.learned / Math.max(1, stats.hiragana.total)) * 100}
                size="sm"
                type="hiragana"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Katakana Progress</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-semibold text-vermilion">{stats.katakana.learned}</span>
                <span className="text-sm text-muted-foreground">/ {stats.katakana.total} learned</span>
              </div>
              <TraditionalProgressIndicator 
                progress={(stats.katakana.learned / Math.max(1, stats.katakana.total)) * 100}
                size="sm"
                type="katakana"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs 
        defaultValue="hiragana" 
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="hiragana" className="text-matcha">
            Hiragana
          </TabsTrigger>
          <TabsTrigger value="katakana" className="text-vermilion">
            Katakana
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="hiragana" className="animate-fade-in">
          <UserKanaProgressGrid kanaType="hiragana" />
        </TabsContent>
        
        <TabsContent value="katakana" className="animate-fade-in">
          <UserKanaProgressGrid kanaType="katakana" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserKanaProgress;

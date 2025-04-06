
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { KanaCharacter } from '@/types/kana';
import { kanaProgressService } from '@/services/kanaProgressService';
import { kanaService } from '@/services/kanaService';

// Import the type with a different name to avoid naming conflict
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
        // Fetch user progress data
        const progress = await kanaProgressService.getUserProgressAll(user.id);
        setProgressData(progress);
        
        // Get kana characters by type
        const characters = kanaService.getKanaByType(kanaType);
        setKanaCharacters(characters);
        
        // Group characters by consonant group
        const grouped: {[key: string]: KanaCharacter[]} = {};
        characters.forEach(char => {
          // Extract the consonant group from the character ID
          // Example: "hiragana-k-a" -> "k" is the consonant group
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
    // Define order for consonant groups
    const order = ['vowels', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w', 'g', 'z', 'd', 'b', 'p', 'special', 'combinations'];
    
    // Get all groups that exist in our data
    const availableGroups = Object.keys(groupedCharacters);
    
    // Sort based on predefined order
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
              <Card key={char.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-japanese mb-2">{char.character}</div>
                    <div className="text-sm mb-3 text-muted-foreground">{char.romaji}</div>
                    <ProgressIndicator 
                      progress={getCharacterProgress(char.id)}
                      size="sm"
                      showPercentage={false}
                      color={kanaType === 'hiragana' ? 'bg-matcha' : 'bg-vermilion'}
                      masteryLevel={getCharacterMasteryLevel(char.id)}
                      showMasteryBadge={getCharacterMasteryLevel(char.id) > 0}
                    />
                  </div>
                </CardContent>
              </Card>
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

const UserKanaProgress: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('hiragana');
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
        const hiraganaStats = await kanaProgressService.getKanaProficiencyStats(user.id, 'hiragana');
        const katakanaStats = await kanaProgressService.getKanaProficiencyStats(user.id, 'katakana');
        
        setStats({
          hiragana: { 
            learned: hiraganaStats.learned, 
            total: hiraganaStats.total, 
            avgProficiency: hiraganaStats.averageProficiency 
          },
          katakana: { 
            learned: katakanaStats.learned, 
            total: katakanaStats.total, 
            avgProficiency: katakanaStats.averageProficiency 
          }
        });
      } catch (error) {
        console.error("Error fetching kana stats:", error);
      }
    };
    
    fetchStats();
  }, [user]);
  
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
              <ProgressIndicator 
                progress={(stats.hiragana.learned / Math.max(1, stats.hiragana.total)) * 100}
                size="sm"
                color="bg-matcha"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Katakana Progress</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-semibold text-vermilion">{stats.katakana.learned}</span>
                <span className="text-sm text-muted-foreground">/ {stats.katakana.total} learned</span>
              </div>
              <ProgressIndicator 
                progress={(stats.katakana.learned / Math.max(1, stats.katakana.total)) * 100}
                size="sm"
                color="bg-vermilion"
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

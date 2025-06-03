import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { KanaCharacter } from '@/types/kana';
import { characterProgressService } from '@/services/characterProgressService';
import { kanaService } from '@/services/kanaService';
import { supabase } from '@/integrations/supabase/client';
import TraditionalBackground from '@/components/ui/TraditionalAtmosphere';
import TraditionalHeader from '@/components/ui/TraditionalHeader';
import TraditionalProgressIndicator from '@/components/ui/TraditionalProgressIndicator';
import { TraditionalCard } from '@/components/ui/TraditionalAtmosphere';
import { cn } from '@/lib/utils';

interface EnhancedUserKanaProgress {
  id: string;
  user_id: string;
  character_id: string;
  proficiency: number;
  mastery_level: number;
  confidence_score: number;
  total_practice_count: number;
  correct_count: number;
  mistake_count: number;
  average_response_time: number;
  sessions_practiced: number;
  first_seen_at: string;
  last_seen_at: string;
  created_at: string;
  updated_at: string;
}

interface KanaProgressGridProps {
  kanaType: 'hiragana' | 'katakana';
  className?: string;
}

const EnhancedKanaProgressGrid: React.FC<KanaProgressGridProps> = ({ 
  kanaType,
  className 
}) => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<Map<string, EnhancedUserKanaProgress>>(new Map());
  const [kanaCharacters, setKanaCharacters] = useState<KanaCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupedCharacters, setGroupedCharacters] = useState<{[key: string]: KanaCharacter[]}>({});
  
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Get all characters from database
        const { data: dbCharacters, error: dbError } = await supabase
          .from('kana_characters')
          .select('*')
          .eq('type', kanaType);

        if (dbError) throw dbError;

        // Get local characters as fallback
        const localCharacters = kanaService.getKanaByType(kanaType);
        
        // Merge database and local data
        const mergedCharacters: KanaCharacter[] = [];
        const seenIds = new Set<string>();

        // Add database characters first
        if (dbCharacters) {
          dbCharacters.forEach(dbChar => {
            mergedCharacters.push({
              id: dbChar.id,
              character: dbChar.character,
              romaji: dbChar.romaji,
              type: dbChar.type as 'hiragana' | 'katakana',
              group: dbChar.character_group || 'basic',
              strokeOrder: []
            });
            seenIds.add(dbChar.id);
          });
        }

        // Add local characters that don't exist in database
        localCharacters.forEach(localChar => {
          if (!seenIds.has(localChar.id)) {
            mergedCharacters.push(localChar);
          }
        });

        setKanaCharacters(mergedCharacters);
        
        // Get progress data
        const rawProgress = await characterProgressService.getCharacterProgress(user.id);
        
        // Transform to enhanced format
        const enhancedProgress: EnhancedUserKanaProgress[] = rawProgress.map(p => ({
          ...p,
          confidence_score: 85, // Default value
          average_response_time: 2.5, // Default value
          sessions_practiced: Math.floor(p.total_practice_count / 5), // Estimate
          first_seen_at: p.created_at,
          last_seen_at: p.updated_at,
        }));

        const progressMap = new Map();
        enhancedProgress.forEach(p => {
          progressMap.set(p.character_id, p);
        });
        setProgressData(progressMap);
        
        // Group characters
        const grouped: {[key: string]: KanaCharacter[]} = {};
        mergedCharacters.forEach(char => {
          const group = char.group || 'basic';
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
    const order = ['basic', 'vowels', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w', 'g', 'z', 'd', 'b', 'p', 'special', 'combinations'];
    const availableGroups = Object.keys(groupedCharacters);
    return order.filter(group => availableGroups.includes(group));
  };
  
  const getGroupTitle = (group: string): string => {
    const titles: {[key: string]: string} = {
      'basic': '基本',
      'vowels': '母音',
      'k': 'か行',
      's': 'さ行',
      't': 'た行',
      'n': 'な行',
      'h': 'は行',
      'm': 'ま行',
      'y': 'や行',
      'r': 'ら行',
      'w': 'わ行',
      'g': 'が行',
      'z': 'ざ行',
      'd': 'だ行',
      'b': 'ば行',
      'p': 'ぱ行',
      'special': '特殊',
      'combinations': '組合せ'
    };
    
    return titles[group] || group;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-wood-light border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className={cn('space-y-8', className)}>
      {getSortedGroups().map(group => (
        <div key={group} className="space-y-4">
          <h3 className="text-lg font-traditional text-wood-light border-b border-wood-light/30 pb-2">
            {getGroupTitle(group)}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {groupedCharacters[group]?.map(char => (
              <TraditionalCard key={char.id} className="p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="text-3xl font-traditional mb-2 text-wood-light">{char.character}</div>
                  <div className="text-sm mb-3 text-paper-warm/80">{char.romaji}</div>
                  <TraditionalProgressIndicator 
                    progress={getCharacterProgress(char.id)}
                    size="sm"
                    showPercentage={false}
                    masteryLevel={getCharacterMasteryLevel(char.id)}
                    showMasteryBadge={getCharacterMasteryLevel(char.id) > 0}
                    type={kanaType}
                  />
                </div>
              </TraditionalCard>
            ))}
          </div>
        </div>
      ))}
      
      {kanaCharacters.length === 0 && (
        <div className="text-center py-12 text-wood-light/60 font-traditional">
          {kanaType}文字が見つかりません。
        </div>
      )}
    </div>
  );
};

const EnhancedProgress: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('hiragana');
  const { user } = useAuth();
  const [stats, setStats] = useState<{
    hiragana: { learned: number, total: number, avgProficiency: number },
    katakana: { learned: number, total: number, avgProficiency: number },
    overall: { streak: number, mastered: number, proficiency: number }
  }>({
    hiragana: { learned: 0, total: 0, avgProficiency: 0 },
    katakana: { learned: 0, total: 0, avgProficiency: 0 },
    overall: { streak: 7, mastered: 45, proficiency: 73 }
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
        
        const totalMastered = allProgress.filter(p => p.proficiency >= 90).length;
        const overallProficiency = allProgress.length > 0 
          ? allProgress.reduce((sum, p) => sum + p.proficiency, 0) / allProgress.length 
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
          },
          overall: { 
            streak: 7, // Mock data
            mastered: totalMastered, 
            proficiency: Math.round(overallProficiency) 
          }
        });
      } catch (error) {
        console.error("Error fetching kana stats:", error);
      }
    };
    
    fetchStats();
  }, [user]);
  
  return (
    <TraditionalBackground>
      <div className="max-w-6xl mx-auto p-6">
        <TraditionalHeader 
          stats={stats.overall}
          showStats={true}
        />
        
        <TraditionalCard className="p-8 mb-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <p className="text-xs text-wood-light/60 font-traditional">ひらがな進捗</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-wood-light font-traditional">
                  {stats.hiragana.learned}
                </span>
                <span className="text-sm text-paper-warm/60">/ {stats.hiragana.total} 学習済み</span>
              </div>
              <TraditionalProgressIndicator 
                progress={(stats.hiragana.learned / Math.max(1, stats.hiragana.total)) * 100}
                size="sm"
                type="hiragana"
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-wood-light/60 font-traditional">カタカナ進捗</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-wood-light font-traditional">
                  {stats.katakana.learned}
                </span>
                <span className="text-sm text-paper-warm/60">/ {stats.katakana.total} 学習済み</span>
              </div>
              <TraditionalProgressIndicator 
                progress={(stats.katakana.learned / Math.max(1, stats.katakana.total)) * 100}
                size="sm"
                type="katakana"
              />
            </div>
          </div>
        </TraditionalCard>
        
        <Tabs 
          defaultValue="hiragana" 
          onValueChange={setActiveTab}
          value={activeTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-8 bg-wood-grain border border-wood-light/30">
            <TabsTrigger 
              value="hiragana" 
              className="font-traditional data-[state=active]:bg-wood-light data-[state=active]:text-gion-night"
            >
              ひらがな
            </TabsTrigger>
            <TabsTrigger 
              value="katakana" 
              className="font-traditional data-[state=active]:bg-wood-light data-[state=active]:text-gion-night"
            >
              カタカナ
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="hiragana" className="animate-fade-in">
            <TraditionalCard className="p-8">
              <EnhancedKanaProgressGrid kanaType="hiragana" />
            </TraditionalCard>
          </TabsContent>
          
          <TabsContent value="katakana" className="animate-fade-in">
            <TraditionalCard className="p-8">
              <EnhancedKanaProgressGrid kanaType="katakana" />
            </TraditionalCard>
          </TabsContent>
        </Tabs>
      </div>
    </TraditionalBackground>
  );
};

export default EnhancedProgress;

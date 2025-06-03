
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
          correct_count: Math.floor(p.total_practice_count * 0.7), // Estimate
          mistake_count: Math.floor(p.total_practice_count * 0.3), // Estimate
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
        
        // Group characters by type
        const grouped: {[key: string]: KanaCharacter[]} = {
          'basic': mergedCharacters
        };
        
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
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-wood-light border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className={cn('space-y-8', className)}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
        {kanaCharacters.map(char => (
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
      
      {kanaCharacters.length === 0 && (
        <div className="text-center py-12 text-wood-light/60">
          No {kanaType} characters found.
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
        
        <Card className="bg-glass-wood backdrop-blur-traditional border-2 border-wood-light/40 shadow-traditional mb-8">
          <CardHeader>
            <CardTitle className="text-wood-light font-traditional">Learning Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-xs text-wood-light/60">Hiragana Progress</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-wood-light">
                    {stats.hiragana.learned}
                  </span>
                  <span className="text-sm text-paper-warm/60">/ {stats.hiragana.total} learned</span>
                </div>
                <TraditionalProgressIndicator 
                  progress={(stats.hiragana.learned / Math.max(1, stats.hiragana.total)) * 100}
                  size="sm"
                  type="hiragana"
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs text-wood-light/60">Katakana Progress</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-wood-light">
                    {stats.katakana.learned}
                  </span>
                  <span className="text-sm text-paper-warm/60">/ {stats.katakana.total} learned</span>
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
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-8 bg-wood-grain border border-wood-light/30">
            <TabsTrigger 
              value="hiragana" 
              className="font-traditional data-[state=active]:bg-wood-light data-[state=active]:text-gion-night"
            >
              Hiragana
            </TabsTrigger>
            <TabsTrigger 
              value="katakana" 
              className="font-traditional data-[state=active]:bg-wood-light data-[state=active]:text-gion-night"
            >
              Katakana
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="hiragana" className="animate-fade-in">
            <Card className="bg-glass-wood backdrop-blur-traditional border-2 border-wood-light/40 shadow-traditional">
              <CardContent className="p-8">
                <EnhancedKanaProgressGrid kanaType="hiragana" />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="katakana" className="animate-fade-in">
            <Card className="bg-glass-wood backdrop-blur-traditional border-2 border-wood-light/40 shadow-traditional">
              <CardContent className="p-8">
                <EnhancedKanaProgressGrid kanaType="katakana" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TraditionalBackground>
  );
};

export default EnhancedProgress;

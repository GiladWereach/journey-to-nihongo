import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { KanaCharacter } from '@/types/kana';
import { characterProgressService } from '@/services/characterProgressService';
import { kanaService } from '@/services/kanaService';
import { enhancedCharacterProgressService, MasteryStats } from '@/services/enhancedCharacterProgressService';
import TraditionalBackground from '@/components/ui/TraditionalAtmosphere';
import TraditionalHeader from '@/components/ui/TraditionalHeader';
import TraditionalProgressIndicator from '@/components/ui/TraditionalProgressIndicator';
import { TraditionalCard } from '@/components/ui/TraditionalAtmosphere';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Clock, Brain } from 'lucide-react';
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
  const [progressData, setProgressData] = useState<Map<string, any>>(new Map());
  const [kanaCharacters, setKanaCharacters] = useState<KanaCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupedCharacters, setGroupedCharacters] = useState<{[key: string]: KanaCharacter[]}>({});
  
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Get local characters
        const localCharacters = kanaService.getKanaByType(kanaType);
        setKanaCharacters(localCharacters);
        
        // Get progress data
        const rawProgress = await characterProgressService.getCharacterProgress(user.id);
        
        const progressMap = new Map();
        rawProgress.forEach(p => {
          progressMap.set(p.character_id, {
            ...p,
            confidence_score: p.confidence_score || 0,
            average_response_time: p.average_response_time || 0,
            sessions_practiced: p.sessions_practiced || 0
          });
        });
        setProgressData(progressMap);
        
        // Group characters by consonant group
        const grouped: {[key: string]: KanaCharacter[]} = {};
        localCharacters.forEach(char => {
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
      'vowels': 'Vowels (あいうえお)',
      'k': 'K-Row (かきくけこ)',
      's': 'S-Row (さしすせそ)',
      't': 'T-Row (たちつてと)',
      'n': 'N-Row (なにぬねの)',
      'h': 'H-Row (はひふへほ)',
      'm': 'M-Row (まみむめも)',
      'y': 'Y-Row (やゆよ)',
      'r': 'R-Row (らりるれろ)',
      'w': 'W-Row (わを)',
      'g': 'G-Row (がぎぐげご)',
      'z': 'Z-Row (ざじずぜぞ)',
      'd': 'D-Row (だぢづでど)',
      'b': 'B-Row (ばびぶべぼ)',
      'p': 'P-Row (ぱぴぷぺぽ)',
      'special': 'Special Characters',
      'combinations': 'Combinations'
    };
    
    return titles[group] || group.charAt(0).toUpperCase() + group.slice(1);
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
          <h3 className="text-lg font-semibold text-wood-light font-traditional">
            {getGroupTitle(group)}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
            {groupedCharacters[group]?.map(char => (
              <TooltipProvider key={char.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TraditionalCard className="p-4 cursor-help hover:bg-wood-light/5 transition-colors">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className="text-3xl font-traditional text-wood-light">{char.character}</div>
                        <div className="text-sm text-paper-warm/80 font-traditional">{char.romaji}</div>
                        <TraditionalProgressIndicator 
                          progress={getCharacterProgress(char.id)}
                          size="sm"
                          showPercentage={false}
                          masteryLevel={getCharacterMasteryLevel(char.id)}
                          showMasteryBadge={true}
                          type={kanaType}
                        />
                      </div>
                    </TraditionalCard>
                  </TooltipTrigger>
                  <TooltipContent className="bg-wood-grain border-wood-light/40 text-paper-warm font-traditional">
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
        <div className="text-center py-12 text-wood-light/60">
          No {kanaType} characters found.
        </div>
      )}
    </div>
  );
};

const InsightsTab: React.FC<{ kanaType: 'hiragana' | 'katakana' }> = ({ kanaType }) => {
  const { user } = useAuth();
  const [masteryStats, setMasteryStats] = useState<MasteryStats>({
    new: 0, learning: 0, familiar: 0, practiced: 0, reliable: 0, mastered: 0, total: 0, averageConfidence: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      enhancedCharacterProgressService.calculateMasteryStats(user.id, kanaType)
        .then(stats => {
          setMasteryStats(stats);
          setLoading(false);
        });
    }
  }, [user, kanaType]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-wood-light border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <TraditionalCard className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-wood-light" />
            <h3 className="text-lg font-semibold text-wood-light font-traditional">Mastery Distribution</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: 'New', count: masteryStats.new, color: 'bg-green-100' },
              { label: 'Learning', count: masteryStats.learning, color: 'bg-gray-200' },
              { label: 'Familiar', count: masteryStats.familiar, color: 'bg-pink-100' },
              { label: 'Practiced', count: masteryStats.practiced, color: 'bg-blue-100' },
              { label: 'Reliable', count: masteryStats.reliable, color: 'bg-amber-100' },
              { label: 'Mastered', count: masteryStats.mastered, color: 'bg-gray-800' }
            ].map(({ label, count, color }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-sm text-wood-light/80 font-traditional">{label}</span>
                <Badge className={`${color} text-gion-night font-traditional`}>
                  {count}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </TraditionalCard>

      <TraditionalCard className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-wood-light" />
            <h3 className="text-lg font-semibold text-wood-light font-traditional">Overall Progress</h3>
          </div>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-wood-light font-traditional">
                {masteryStats.total > 0 ? Math.round((masteryStats.mastered / masteryStats.total) * 100) : 0}%
              </div>
              <div className="text-sm text-paper-warm/60 font-traditional">Characters Mastered</div>
            </div>
            <TraditionalProgressIndicator 
              progress={masteryStats.total > 0 ? (masteryStats.mastered / masteryStats.total) * 100 : 0}
              size="lg"
              type={kanaType}
            />
          </div>
        </div>
      </TraditionalCard>

      <TraditionalCard className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-wood-light" />
            <h3 className="text-lg font-semibold text-wood-light font-traditional">Confidence</h3>
          </div>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-wood-light font-traditional">
                {masteryStats.averageConfidence}%
              </div>
              <div className="text-sm text-paper-warm/60 font-traditional">Average Confidence</div>
            </div>
            <TraditionalProgressIndicator 
              progress={masteryStats.averageConfidence}
              size="lg"
              type={kanaType}
            />
          </div>
        </div>
      </TraditionalCard>
    </div>
  );
};

const EnhancedProgress: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('hiragana');
  const [viewMode, setViewMode] = useState<'grid' | 'insights'>('grid');
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
            streak: 7,
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
                <p className="text-xs text-wood-light/60 font-traditional">Hiragana Progress</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-wood-light font-traditional">
                    {stats.hiragana.learned}
                  </span>
                  <span className="text-sm text-paper-warm/60 font-traditional">/ {stats.hiragana.total} learned</span>
                </div>
                <TraditionalProgressIndicator 
                  progress={(stats.hiragana.learned / Math.max(1, stats.hiragana.total)) * 100}
                  size="sm"
                  type="hiragana"
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs text-wood-light/60 font-traditional">Katakana Progress</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-wood-light font-traditional">
                    {stats.katakana.learned}
                  </span>
                  <span className="text-sm text-paper-warm/60 font-traditional">/ {stats.katakana.total} learned</span>
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
          <div className="flex justify-between items-center mb-8">
            <TabsList className="grid grid-cols-2 bg-wood-grain border border-wood-light/30">
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

            <TabsList className="grid grid-cols-2 bg-wood-grain border border-wood-light/30">
              <TabsTrigger 
                value="grid" 
                onClick={() => setViewMode('grid')}
                className="font-traditional data-[state=active]:bg-wood-light data-[state=active]:text-gion-night"
              >
                Characters
              </TabsTrigger>
              <TabsTrigger 
                value="insights" 
                onClick={() => setViewMode('insights')}
                className="font-traditional data-[state=active]:bg-wood-light data-[state=active]:text-gion-night"
              >
                Insights
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="hiragana" className="animate-fade-in">
            <Card className="bg-glass-wood backdrop-blur-traditional border-2 border-wood-light/40 shadow-traditional">
              <CardContent className="p-8">
                {viewMode === 'grid' ? (
                  <EnhancedKanaProgressGrid kanaType="hiragana" />
                ) : (
                  <InsightsTab kanaType="hiragana" />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="katakana" className="animate-fade-in">
            <Card className="bg-glass-wood backdrop-blur-traditional border-2 border-wood-light/40 shadow-traditional">
              <CardContent className="p-8">
                {viewMode === 'grid' ? (
                  <EnhancedKanaProgressGrid kanaType="katakana" />
                ) : (
                  <InsightsTab kanaType="katakana" />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TraditionalBackground>
  );
};

export default EnhancedProgress;

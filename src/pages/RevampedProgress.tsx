
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  Award,
  ChevronUp,
  Target,
  BarChart3
} from 'lucide-react';
import { characterProgressService } from '@/services/characterProgressService';
import { kanaService } from '@/services/kanaService';
import { cn } from '@/lib/utils';
import { TraditionalBackground, TraditionalCard } from '@/components/ui/TraditionalAtmosphere';
import TraditionalHeader from '@/components/ui/TraditionalHeader';
import TraditionalProgressIndicator from '@/components/ui/TraditionalProgressIndicator';

interface CharacterProgress {
  character: string;
  romaji: string;
  status: 'new' | 'learning' | 'learned';
  proficiency: number;
  id: string;
}

interface ProgressStats {
  totalLearned: number;
  totalCharacters: number;
  accuracy: number;
  streak: number;
  weeklyProgress: boolean[];
  overallProficiency: number;
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}

const RevampedProgress: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [stats, setStats] = useState<ProgressStats>({
    totalLearned: 0,
    totalCharacters: 92,
    accuracy: 0,
    streak: 0,
    weeklyProgress: [false, false, false, false, false, false, false],
    overallProficiency: 0,
    currentLevel: 'Beginner'
  });
  const [nextCharacters, setNextCharacters] = useState<CharacterProgress[]>([]);
  const [hiraganaProgress, setHiraganaProgress] = useState(0);
  const [katakanaProgress, setKatakanaProgress] = useState(0);

  useEffect(() => {
    if (user) {
      fetchProgressData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchProgressData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get all character progress
      const allProgress = await characterProgressService.getUserProgress(user.id);
      const hiraganaChars = kanaService.getKanaByType('hiragana');
      const katakanaChars = kanaService.getKanaByType('katakana');
      
      // Calculate basic stats
      const learnedCount = allProgress.filter(p => p.proficiency >= 50).length;
      const avgAccuracy = allProgress.length > 0 
        ? Math.round(allProgress.reduce((sum, p) => sum + p.proficiency, 0) / allProgress.length)
        : 0;
      
      // Calculate hiragana and katakana progress
      const hiraganaProgressData = allProgress.filter(p => 
        hiraganaChars.some(c => c.id === p.character_id)
      );
      const katakanaProgressData = allProgress.filter(p => 
        katakanaChars.some(c => c.id === p.character_id)
      );
      
      const hiraganaPercent = hiraganaChars.length > 0 
        ? Math.round((hiraganaProgressData.filter(p => p.proficiency >= 50).length / hiraganaChars.length) * 100)
        : 0;
      const katakanaPercent = katakanaChars.length > 0 
        ? Math.round((katakanaProgressData.filter(p => p.proficiency >= 50).length / katakanaChars.length) * 100)
        : 0;

      setHiraganaProgress(hiraganaPercent);
      setKatakanaProgress(katakanaPercent);
      
      // Determine current level
      let currentLevel: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner';
      if (avgAccuracy >= 70) currentLevel = 'Advanced';
      else if (avgAccuracy >= 40) currentLevel = 'Intermediate';
      
      // Get next characters to practice (mix of new and review)
      const allKana = [...hiraganaChars, ...katakanaChars];
      const nextChars: CharacterProgress[] = [];
      
      // Add some characters that need practice
      for (const kana of allKana.slice(0, 8)) {
        const progress = allProgress.find(p => p.character_id === kana.id);
        const proficiency = progress?.proficiency || 0;
        
        let status: 'new' | 'learning' | 'learned' = 'new';
        if (proficiency >= 70) status = 'learned';
        else if (proficiency > 0) status = 'learning';
        
        nextChars.push({
          character: kana.character,
          romaji: kana.romaji,
          status,
          proficiency,
          id: kana.id
        });
      }
      
      setNextCharacters(nextChars);
      setStats({
        totalLearned: learnedCount,
        totalCharacters: 92,
        accuracy: avgAccuracy,
        streak: 7, // Mock data - could be calculated from sessions
        weeklyProgress: [true, true, false, true, true, true, false], // Mock data
        overallProficiency: avgAccuracy,
        currentLevel
      });
      
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'border-lantern-amber text-lantern-amber';
      case 'learning': return 'border-lantern-warm text-lantern-warm';
      case 'learned': return 'border-wood-light text-wood-light';
      default: return 'border-paper-warm/40 text-paper-warm/60';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return '○';
      case 'learning': return '◐';
      case 'learned': return '●';
      default: return '○';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-lantern-amber/20 text-lantern-amber border-lantern-amber/40';
      case 'Intermediate': return 'bg-lantern-warm/20 text-lantern-warm border-lantern-warm/40';
      case 'Advanced': return 'bg-wood-light/20 text-wood-light border-wood-light/40';
      default: return 'bg-paper-warm/10 text-paper-warm/60 border-paper-warm/20';
    }
  };

  if (!user) {
    return (
      <TraditionalBackground>
        <div className="min-h-screen flex items-center justify-center p-4">
          <TraditionalCard className="max-w-md w-full p-8">
            <div className="text-center">
              <BookOpen className="mx-auto h-12 w-12 text-wood-light mb-4" />
              <h2 className="text-2xl font-traditional font-bold text-paper-warm mb-2">
                Track Your Progress
              </h2>
              <p className="text-paper-warm/70 mb-6 font-traditional">
                Sign in to see your Japanese learning journey
              </p>
              <Button 
                onClick={() => navigate('/auth')} 
                className="w-full traditional-button"
              >
                Sign In
              </Button>
            </div>
          </TraditionalCard>
        </div>
      </TraditionalBackground>
    );
  }

  if (loading) {
    return (
      <TraditionalBackground>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-wood-light border-t-transparent rounded-full animate-spin"></div>
        </div>
      </TraditionalBackground>
    );
  }

  return (
    <TraditionalBackground>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          {/* Traditional Header */}
          <TraditionalHeader 
            showStats={true}
            stats={{
              streak: stats.streak,
              mastered: stats.totalLearned,
              proficiency: stats.accuracy
            }}
          />

          {/* Three-Column Hero Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column: Learning Path */}
            <TraditionalCard className="p-6">
              <h2 className="text-xl font-traditional font-semibold text-paper-warm mb-6 flex items-center">
                <Target className="mr-2 h-5 w-5 text-wood-light" />
                Your Learning Path
              </h2>
              
              <div className="space-y-6">
                {/* Hiragana Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-traditional font-medium text-paper-warm">ひらがな Hiragana</span>
                    <span className="text-sm text-paper-warm/70 font-traditional">{hiraganaProgress}%</span>
                  </div>
                  <TraditionalProgressIndicator 
                    progress={hiraganaProgress}
                    type="hiragana"
                    size="md"
                  />
                </div>

                {/* Katakana Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-traditional font-medium text-paper-warm">カタカナ Katakana</span>
                    <span className="text-sm text-paper-warm/70 font-traditional">{katakanaProgress}%</span>
                  </div>
                  <TraditionalProgressIndicator 
                    progress={katakanaProgress}
                    type="katakana"
                    size="md"
                  />
                </div>

                {/* Basic Kanji (Future) */}
                <div className="opacity-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-traditional font-medium text-paper-warm">漢字 Basic Kanji</span>
                    <span className="text-sm text-paper-warm/70 font-traditional">0%</span>
                  </div>
                  <TraditionalProgressIndicator 
                    progress={0}
                    size="md"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-wood-grain/50 backdrop-blur-md border border-wood-light/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-traditional font-medium text-paper-warm/80">Current Level</span>
                  <Badge className={getLevelColor(stats.currentLevel)}>
                    {stats.currentLevel}
                  </Badge>
                </div>
                <p className="text-sm text-paper-warm/60 font-traditional">
                  {stats.currentLevel === 'Beginner' && "Just getting started! Focus on basic characters."}
                  {stats.currentLevel === 'Intermediate' && "Making good progress! Keep practicing regularly."}
                  {stats.currentLevel === 'Advanced' && "Excellent work! You're mastering the fundamentals."}
                </p>
              </div>

              <Button 
                onClick={() => navigate('/quiz')} 
                className="w-full mt-6 traditional-button"
              >
                <Play className="mr-2 h-4 w-4" />
                Continue Learning
              </Button>
            </TraditionalCard>

            {/* Center Column: Today's Focus */}
            <TraditionalCard className="p-6">
              <h2 className="text-xl font-traditional font-semibold text-paper-warm mb-6 flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-wood-light" />
                Today's Practice
              </h2>

              <div className="grid grid-cols-4 gap-3 mb-6">
                {nextCharacters.map((char, index) => (
                  <div
                    key={char.id}
                    className="aspect-square bg-wood-grain/30 backdrop-blur-sm border-2 border-wood-light/20 flex flex-col items-center justify-center p-2 hover:border-wood-light/40 transition-all cursor-pointer"
                  >
                    <div className="text-2xl font-traditional font-bold text-paper-warm mb-1">{char.character}</div>
                    <div className="text-xs text-paper-warm/60 mb-1 font-traditional">{char.romaji}</div>
                    <div className={cn("text-xs font-traditional", getStatusColor(char.status))}>
                      {getStatusIcon(char.status)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-wood-grain/30 backdrop-blur-sm border border-wood-light/20">
                  <span className="text-sm font-traditional font-medium text-paper-warm/80">Next Focus</span>
                  <span className="text-sm text-wood-light font-traditional">Practice basic characters</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-wood-grain/30 backdrop-blur-sm border border-wood-light/20">
                  <span className="text-sm font-traditional font-medium text-paper-warm/80">Daily Goal</span>
                  <span className="text-sm text-lantern-warm font-traditional">15 minutes</span>
                </div>
              </div>

              <Button 
                onClick={() => navigate('/quiz')} 
                className="w-full mt-6 traditional-button"
              >
                <Play className="mr-2 h-4 w-4" />
                Start Practice Session
              </Button>

              <Button 
                onClick={() => navigate('/quick-quiz')} 
                className="w-full mt-3 bg-wood-grain/50 border-wood-light/40 text-paper-warm hover:bg-wood-grain/70 hover:border-wood-light/60"
              >
                Quick 5-Minute Review
              </Button>
            </TraditionalCard>

            {/* Right Column: Quick Stats */}
            <TraditionalCard className="p-6">
              <h2 className="text-xl font-traditional font-semibold text-paper-warm mb-6 flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-wood-light" />
                Quick Stats
              </h2>

              <div className="space-y-6">
                {/* Streak */}
                <div className="text-center p-4 bg-wood-grain/30 backdrop-blur-sm border border-lantern-amber/40">
                  <div className="text-3xl mb-2">🔥</div>
                  <div className="text-2xl font-traditional font-bold text-lantern-amber">{stats.streak} days</div>
                  <div className="text-sm text-paper-warm/60 font-traditional">Current Streak</div>
                </div>

                {/* Progress Summary */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-paper-warm/70 font-traditional">Characters Learned</span>
                    <span className="font-traditional font-semibold text-paper-warm">{stats.totalLearned}/{stats.totalCharacters}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-paper-warm/70 font-traditional">Average Accuracy</span>
                    <span className="font-traditional font-semibold text-paper-warm">{stats.accuracy}%</span>
                  </div>
                </div>

                {/* Weekly Progress */}
                <div>
                  <div className="text-sm text-paper-warm/70 mb-2 font-traditional">This Week</div>
                  <div className="flex space-x-1 mb-2">
                    {stats.weeklyProgress.map((active, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex-1 h-8 border border-wood-light/20",
                          active ? "bg-wood-light/30" : "bg-wood-grain/20"
                        )}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-paper-warm/50 text-center font-traditional">
                    {stats.weeklyProgress.filter(Boolean).length}/7 days
                  </div>
                </div>
              </div>

              <Button 
                className="w-full mt-6 bg-wood-grain/50 border-wood-light/40 text-paper-warm hover:bg-wood-grain/70 hover:border-wood-light/60"
                onClick={() => setShowDetails(!showDetails)}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                View Detailed Progress
              </Button>

              <Button 
                className="w-full mt-3 bg-wood-grain/50 border-wood-light/40 text-paper-warm hover:bg-wood-grain/70 hover:border-wood-light/60"
                onClick={() => navigate('/kana-learning')}
              >
                <Award className="mr-2 h-4 w-4" />
                Kana Learning
              </Button>
            </TraditionalCard>
          </div>

          {/* Expandable Details Section */}
          {showDetails && (
            <TraditionalCard className="p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-traditional font-semibold text-paper-warm">Detailed Progress</h2>
                <Button
                  className="bg-wood-grain/50 border-wood-light/40 text-paper-warm hover:bg-wood-grain/70"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>

              <Tabs defaultValue="characters" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-wood-grain/30 border-wood-light/40">
                  <TabsTrigger value="characters" className="font-traditional text-paper-warm data-[state=active]:bg-wood-light/20">Characters</TabsTrigger>
                  <TabsTrigger value="timeline" className="font-traditional text-paper-warm data-[state=active]:bg-wood-light/20">Timeline</TabsTrigger>
                  <TabsTrigger value="achievements" className="font-traditional text-paper-warm data-[state=active]:bg-wood-light/20">Progress</TabsTrigger>
                </TabsList>

                <TabsContent value="characters" className="space-y-4">
                  <div className="grid grid-cols-8 sm:grid-cols-12 gap-2">
                    {nextCharacters.concat(
                      Array.from({ length: 24 }, (_, i) => ({
                        character: '○',
                        romaji: '',
                        status: 'new' as const,
                        proficiency: 0,
                        id: `placeholder-${i}`
                      }))
                    ).slice(0, 32).map((char, index) => (
                      <div
                        key={char.id}
                        className={cn(
                          "aspect-square border-2 flex flex-col items-center justify-center text-xs font-traditional",
                          char.character === '○' 
                            ? "bg-wood-grain/20 border-wood-light/20 text-paper-warm/40"
                            : cn("bg-wood-grain/30 backdrop-blur-sm", getStatusColor(char.status))
                        )}
                      >
                        <div className="font-medium">{char.character}</div>
                        {char.romaji && <div className="text-xs opacity-70">{char.romaji}</div>}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm font-traditional">
                    <div className="flex items-center space-x-1">
                      <span className="text-lantern-amber">○</span>
                      <span className="text-paper-warm/70">New</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-lantern-warm">◐</span>
                      <span className="text-paper-warm/70">Learning</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-wood-light">●</span>
                      <span className="text-paper-warm/70">Learned</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-4">
                  <div className="text-center py-8 text-paper-warm/50">
                    <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p className="font-traditional">Practice timeline will appear here as you continue learning</p>
                  </div>
                </TabsContent>

                <TabsContent value="achievements" className="space-y-4">
                  <div className="text-center py-8 text-paper-warm/50">
                    <Award className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p className="font-traditional">Progress tracking will show detailed analytics</p>
                  </div>
                </TabsContent>
              </Tabs>
            </TraditionalCard>
          )}
        </div>
      </div>
    </TraditionalBackground>
  );
};

export default RevampedProgress;

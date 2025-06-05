
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
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
  ChevronDown,
  ChevronUp,
  Target,
  BarChart3
} from 'lucide-react';
import { characterProgressService } from '@/services/characterProgressService';
import { kanaService } from '@/services/kanaService';
import { cn } from '@/lib/utils';

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
      case 'new': return 'bg-red-100 text-red-700 border-red-200';
      case 'learning': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'learned': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return '🔴';
      case 'learning': return '🟡';
      case 'learned': return '🟢';
      default: return '⚪';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Intermediate': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Advanced': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-indigo-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Track Your Progress</h2>
            <p className="text-gray-600 mb-6">Sign in to see your Japanese learning journey</p>
            <Button onClick={() => navigate('/auth')} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Japanese Journey</h1>
          <p className="text-gray-600">Keep building your skills one character at a time</p>
        </div>

        {/* Three-Column Hero Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column: Learning Path */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Target className="mr-2 h-5 w-5 text-indigo-600" />
                Your Learning Path
              </h2>
              
              <div className="space-y-6">
                {/* Hiragana Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700">Hiragana</span>
                    <span className="text-sm text-gray-500">{hiraganaProgress}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={cn(
                            "w-3 h-3 rounded-full",
                            step <= Math.ceil(hiraganaProgress / 25) 
                              ? "bg-indigo-600" 
                              : "bg-gray-200"
                          )}
                        />
                      ))}
                    </div>
                    <Progress value={hiraganaProgress} className="flex-1 h-2" />
                  </div>
                </div>

                {/* Katakana Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700">Katakana</span>
                    <span className="text-sm text-gray-500">{katakanaProgress}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={cn(
                            "w-3 h-3 rounded-full",
                            step <= Math.ceil(katakanaProgress / 25) 
                              ? "bg-indigo-600" 
                              : "bg-gray-200"
                          )}
                        />
                      ))}
                    </div>
                    <Progress value={katakanaProgress} className="flex-1 h-2" />
                  </div>
                </div>

                {/* Basic Kanji (Future) */}
                <div className="opacity-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700">Basic Kanji</span>
                    <span className="text-sm text-gray-500">0%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div key={step} className="w-3 h-3 rounded-full bg-gray-200" />
                      ))}
                    </div>
                    <Progress value={0} className="flex-1 h-2" />
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Current Level</span>
                  <Badge className={getLevelColor(stats.currentLevel)}>
                    {stats.currentLevel}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {stats.currentLevel === 'Beginner' && "Just getting started! Focus on basic characters."}
                  {stats.currentLevel === 'Intermediate' && "Making good progress! Keep practicing regularly."}
                  {stats.currentLevel === 'Advanced' && "Excellent work! You're mastering the fundamentals."}
                </p>
              </div>

              <Button 
                onClick={() => navigate('/practice')} 
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700"
              >
                <Play className="mr-2 h-4 w-4" />
                Continue Learning
              </Button>
            </CardContent>
          </Card>

          {/* Center Column: Today's Focus */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-indigo-600" />
                Today's Practice
              </h2>

              <div className="grid grid-cols-4 gap-3 mb-6">
                {nextCharacters.map((char, index) => (
                  <div
                    key={char.id}
                    className="aspect-square bg-white rounded-lg border-2 border-gray-100 flex flex-col items-center justify-center p-2 hover:border-indigo-200 transition-colors cursor-pointer"
                  >
                    <div className="text-2xl font-bold mb-1">{char.character}</div>
                    <div className="text-xs text-gray-500 mb-1">{char.romaji}</div>
                    <div className="text-xs">{getStatusIcon(char.status)}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Next Focus</span>
                  <span className="text-sm text-blue-600">Practice basic characters</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Daily Goal</span>
                  <span className="text-sm text-green-600">15 minutes</span>
                </div>
              </div>

              <Button 
                onClick={() => navigate('/quiz')} 
                className="w-full mt-6 bg-green-600 hover:bg-green-700"
              >
                <Play className="mr-2 h-4 w-4" />
                Start Practice Session
              </Button>

              <Button 
                onClick={() => navigate('/quick-quiz')} 
                variant="outline" 
                className="w-full mt-3"
              >
                Quick 5-Minute Review
              </Button>
            </CardContent>
          </Card>

          {/* Right Column: Quick Stats */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-indigo-600" />
                Quick Stats
              </h2>

              <div className="space-y-6">
                {/* Streak */}
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl mb-2">🔥</div>
                  <div className="text-2xl font-bold text-orange-600">{stats.streak} days</div>
                  <div className="text-sm text-gray-600">Current Streak</div>
                </div>

                {/* Progress Summary */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Characters Learned</span>
                    <span className="font-semibold">{stats.totalLearned}/{stats.totalCharacters}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Accuracy</span>
                    <span className="font-semibold">{stats.accuracy}%</span>
                  </div>
                </div>

                {/* Weekly Progress */}
                <div>
                  <div className="text-sm text-gray-600 mb-2">This Week</div>
                  <div className="flex space-x-1 mb-2">
                    {stats.weeklyProgress.map((active, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex-1 h-8 rounded",
                          active ? "bg-green-500" : "bg-gray-200"
                        )}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    {stats.weeklyProgress.filter(Boolean).length}/7 days
                  </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-6"
                onClick={() => setShowDetails(!showDetails)}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                View Detailed Progress
              </Button>

              <Button 
                variant="outline" 
                className="w-full mt-3"
                onClick={() => navigate('/achievements')}
              >
                <Award className="mr-2 h-4 w-4" />
                Achievements
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Expandable Details Section */}
        {showDetails && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Detailed Progress</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>

              <Tabs defaultValue="characters" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="characters">Characters</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
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
                          "aspect-square rounded-lg flex flex-col items-center justify-center text-xs border-2",
                          char.character === '○' 
                            ? "bg-gray-50 border-gray-200 text-gray-400"
                            : getStatusColor(char.status)
                        )}
                      >
                        <div className="font-medium">{char.character}</div>
                        {char.romaji && <div className="text-xs opacity-70">{char.romaji}</div>}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <span>🔴</span>
                      <span>New</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>🟡</span>
                      <span>Learning</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>🟢</span>
                      <span>Learned</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-4">
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>Practice timeline will appear here as you continue learning</p>
                  </div>
                </TabsContent>

                <TabsContent value="achievements" className="space-y-4">
                  <div className="text-center py-8 text-gray-500">
                    <Award className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>Achievements will unlock as you progress</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RevampedProgress;

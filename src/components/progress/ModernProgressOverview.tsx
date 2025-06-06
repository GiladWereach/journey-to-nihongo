
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, Calendar, Award, BookOpen, Zap } from 'lucide-react';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { useSessionCleanup } from '@/hooks/useSessionCleanup';

interface ModernProgressOverviewProps {
  hiraganaStats: {
    level0: number;
    level1: number;
    level2: number;
    level3Plus: number;
    total: number;
  };
  katakanaStats: {
    level0: number;
    level1: number;
    level2: number;
    level3Plus: number;
    total: number;
  };
  streakData: {
    currentStreak: number;
    longestStreak: number;
    lastPracticeDate: Date | null;
  };
  timelineData: Array<{
    date: string;
    charactersStudied: number;
    averageProficiency: number;
  }>;
  overallProgress: {
    hiragana: number;
    katakana: number;
    basic_kanji: number;
    grammar: number;
  };
  loading: boolean;
}

const ModernProgressOverview: React.FC<ModernProgressOverviewProps> = ({
  hiraganaStats,
  katakanaStats,
  streakData,
  timelineData,
  overallProgress,
  loading
}) => {
  // Use the cleanup hook
  useSessionCleanup();

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo"></div>
      </div>
    );
  }

  // Determine current learning stage
  const determineCurrentStage = (): 'beginner' | 'intermediate' | 'advanced' => {
    const averageProgress = (
      overallProgress.hiragana + 
      overallProgress.katakana + 
      overallProgress.basic_kanji + 
      overallProgress.grammar
    ) / 4;
    
    if (averageProgress < 30) return 'beginner';
    if (averageProgress < 70) return 'intermediate';
    return 'advanced';
  };

  const currentStage = determineCurrentStage();
  const isActiveToday = streakData.lastPracticeDate && 
    new Date(streakData.lastPracticeDate).toDateString() === new Date().toDateString();

  return (
    <div className="space-y-6">
      {/* Learning Streak and Focus Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Learning Streak Card */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-vermilion/10 to-vermilion/5 border-vermilion/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-xl font-semibold text-vermilion">
                <Zap className="mr-2 h-5 w-5" />
                Learning Streak
                {isActiveToday && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Active Today
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="text-center">
                  <div className="text-3xl font-bold text-vermilion mb-1">
                    {streakData.currentStreak}
                  </div>
                  <div className="text-sm text-gray-600">Current</div>
                  <div className="text-xs text-gray-500">days</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-700 mb-1">
                    {streakData.longestStreak}
                  </div>
                  <div className="text-sm text-gray-600">Longest</div>
                  <div className="text-xs text-gray-500">days</div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    {streakData.lastPracticeDate ? 'Today' : 'Never'}
                  </div>
                  <div className="text-sm text-gray-600">Last Practice</div>
                </div>
              </div>
              
              {/* Streak Visualization */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Goal: 30 days</span>
                  <span>{Math.round((streakData.currentStreak / 30) * 100)}%</span>
                </div>
                <ProgressIndicator 
                  progress={Math.min(100, (streakData.currentStreak / 30) * 100)} 
                  color="bg-vermilion" 
                  size="sm"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Learning Focus Card */}
        <div className="lg:col-span-1">
          <Card className="bg-gradient-to-br from-indigo/10 to-indigo/5 border-indigo/20 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-xl font-semibold text-indigo">
                <TrendingUp className="mr-2 h-5 w-5" />
                Learning Focus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Hiragana</span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(overallProgress.hiragana)}%
                    </span>
                  </div>
                  <ProgressIndicator 
                    progress={overallProgress.hiragana} 
                    color="bg-matcha" 
                    size="sm"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Katakana</span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(overallProgress.katakana)}%
                    </span>
                  </div>
                  <ProgressIndicator 
                    progress={overallProgress.katakana} 
                    color="bg-vermilion" 
                    size="sm"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Basic Kanji</span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(overallProgress.basic_kanji)}%
                    </span>
                  </div>
                  <ProgressIndicator 
                    progress={overallProgress.basic_kanji} 
                    color="bg-indigo" 
                    size="sm"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Grammar</span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(overallProgress.grammar)}%
                    </span>
                  </div>
                  <ProgressIndicator 
                    progress={overallProgress.grammar} 
                    color="bg-amber-500" 
                    size="sm"
                  />
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium mb-2">Today's Priority</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {overallProgress.hiragana < 50 
                      ? "Hiragana Practice" 
                      : overallProgress.katakana < 50 
                      ? "Katakana Practice"
                      : "Basic Kanji Study"}
                  </span>
                  <span className="text-xs px-2 py-1 bg-matcha/10 text-matcha rounded-full">
                    Recommended
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Learning Path Progress */}
      <Card className="bg-gradient-to-r from-gion-night/5 to-lantern-warm/5 border-wood-grain/20">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-semibold text-gion-night">
            <Target className="mr-2 h-5 w-5" />
            Learning Path Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Hiragana Recognition */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-vermilion/10 flex items-center justify-center">
                  <span className="text-vermilion font-bold">あ</span>
                </div>
                <div>
                  <h3 className="font-semibold text-vermilion">Hiragana Recognition</h3>
                  <p className="text-sm text-gray-600">Learn all hiragana characters through multiple choice and speed quizzes</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-vermilion">{Math.round(overallProgress.hiragana)}%</div>
                <div className="text-xs text-gray-500">Progress</div>
              </div>
            </div>

            {/* Katakana Recognition */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-matcha/10 flex items-center justify-center">
                  <span className="text-matcha font-bold">ア</span>
                </div>
                <div>
                  <h3 className="font-semibold text-matcha">Katakana Recognition</h3>
                  <p className="text-sm text-gray-600">Master katakana characters with interactive exercises</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-matcha">{Math.round(overallProgress.katakana)}%</div>
                <div className="text-xs text-gray-500">Progress</div>
              </div>
            </div>

            {/* Basic Kanji (Coming Soon) */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 opacity-60">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 font-bold">漢</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500">Basic Kanji</h3>
                  <p className="text-sm text-gray-500">Essential kanji characters for daily use</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 px-2 py-1 bg-gray-200 rounded">Coming Soon</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Calendar className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {timelineData.slice(-5).map((day, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="text-sm font-medium">{day.date}</div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{day.charactersStudied}</div>
                    <div className="text-xs text-gray-500">characters</div>
                  </div>
                </div>
              ))}
              {timelineData.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <BookOpen className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">No recent activity</p>
                  <p className="text-xs">Start practicing to see your progress here!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mastery Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Award className="mr-2 h-5 w-5" />
              Mastery Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Hiragana Distribution */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-matcha">Hiragana</span>
                  <span className="text-xs text-gray-500">
                    {hiraganaStats.level3Plus}/{hiraganaStats.total} mastered
                  </span>
                </div>
                <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="bg-red-400" 
                    style={{ width: `${(hiraganaStats.level0 / Math.max(hiraganaStats.total, 1)) * 100}%` }}
                  />
                  <div 
                    className="bg-yellow-400" 
                    style={{ width: `${(hiraganaStats.level1 / Math.max(hiraganaStats.total, 1)) * 100}%` }}
                  />
                  <div 
                    className="bg-blue-400" 
                    style={{ width: `${(hiraganaStats.level2 / Math.max(hiraganaStats.total, 1)) * 100}%` }}
                  />
                  <div 
                    className="bg-green-400" 
                    style={{ width: `${(hiraganaStats.level3Plus / Math.max(hiraganaStats.total, 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Katakana Distribution */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-vermilion">Katakana</span>
                  <span className="text-xs text-gray-500">
                    {katakanaStats.level3Plus}/{katakanaStats.total} mastered
                  </span>
                </div>
                <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="bg-red-400" 
                    style={{ width: `${(katakanaStats.level0 / Math.max(katakanaStats.total, 1)) * 100}%` }}
                  />
                  <div 
                    className="bg-yellow-400" 
                    style={{ width: `${(katakanaStats.level1 / Math.max(katakanaStats.total, 1)) * 100}%` }}
                  />
                  <div 
                    className="bg-blue-400" 
                    style={{ width: `${(katakanaStats.level2 / Math.max(katakanaStats.total, 1)) * 100}%` }}
                  />
                  <div 
                    className="bg-green-400" 
                    style={{ width: `${(katakanaStats.level3Plus / Math.max(katakanaStats.total, 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-400 rounded mr-1"></div>
                  <span>New</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-400 rounded mr-1"></div>
                  <span>Learning</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-400 rounded mr-1"></div>
                  <span>Good</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded mr-1"></div>
                  <span>Mastered</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModernProgressOverview;


import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Target, Calendar, Award, TrendingUp, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import TraditionalBackground from '@/components/ui/TraditionalAtmosphere';
import { characterProgressService } from '@/services/characterProgressService';
import { kanaService } from '@/services/kanaService';
import { UserKanaProgress as UserKanaProgressType } from '@/types/kana';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';

const Progress: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<UserKanaProgressType[]>([]);
  const [hiragana, setHiragana] = useState<any[]>([]);
  const [katakana, setKatakana] = useState<any[]>([]);
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    lastPracticeDate: null as Date | null,
  });
  const [overallStats, setOverallStats] = useState({
    hiraganaProgress: 0,
    katakanaProgress: 0,
    totalCharactersLearned: 0,
    totalPracticeTime: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);

        // Fetch kana data
        const [hiraganaData, katakanaData] = await Promise.all([
          kanaService.getKanaByType('hiragana'),
          kanaService.getKanaByType('katakana')
        ]);
        setHiragana(hiraganaData);
        setKatakana(katakanaData);

        // Fetch user progress
        const progressData = await characterProgressService.getUserProgress(user.id);
        setUserProgress(progressData);

        // Calculate progress stats
        const hiraganaProgress = progressData.filter(p => 
          hiraganaData.some(h => h.id === p.character_id)
        );
        const katakanaProgress = progressData.filter(p => 
          katakanaData.some(k => k.id === p.character_id)
        );

        const hiraganaAvg = hiraganaProgress.length > 0 
          ? hiraganaProgress.reduce((sum, p) => sum + p.proficiency, 0) / hiraganaProgress.length 
          : 0;
        const katakanaAvg = katakanaProgress.length > 0 
          ? katakanaProgress.reduce((sum, p) => sum + p.proficiency, 0) / katakanaProgress.length 
          : 0;

        setOverallStats({
          hiraganaProgress: hiraganaAvg,
          katakanaProgress: katakanaAvg,
          totalCharactersLearned: progressData.filter(p => p.proficiency > 0).length,
          totalPracticeTime: progressData.reduce((sum, p) => sum + p.total_practice_count, 0)
        });

        // Fetch streak data
        const { data: sessions } = await supabase
          .from('kana_learning_sessions')
          .select('start_time, streak')
          .eq('user_id', user.id)
          .eq('completed', true)
          .order('start_time', { ascending: false })
          .limit(10);

        if (sessions && sessions.length > 0) {
          const currentStreak = Math.max(...sessions.map(s => s.streak || 0));
          setStreakData({
            currentStreak,
            longestStreak: currentStreak,
            lastPracticeDate: new Date(sessions[0].start_time)
          });
        }

      } catch (error) {
        console.error('Error fetching progress data:', error);
        toast({
          title: "Error loading progress",
          description: "Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  if (!user) {
    return (
      <TraditionalBackground>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="bg-white/95 backdrop-blur-sm border-wood-grain/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Sign in to View Progress</h3>
              <p className="text-gray-600 mb-6">Create an account to track your Japanese learning journey.</p>
              <Link to="/auth">
                <Button className="bg-indigo hover:bg-indigo/90">
                  Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </TraditionalBackground>
    );
  }

  if (isLoading) {
    return (
      <TraditionalBackground>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo"></div>
          </div>
        </div>
      </TraditionalBackground>
    );
  }

  const getMostPracticed = () => {
    return userProgress
      .filter(p => p.total_practice_count > 0)
      .sort((a, b) => b.total_practice_count - a.total_practice_count)
      .slice(0, 5);
  };

  const getNeedsWork = () => {
    return userProgress
      .filter(p => p.proficiency > 0 && p.proficiency < 70)
      .sort((a, b) => a.proficiency - b.proficiency)
      .slice(0, 5);
  };

  return (
    <TraditionalBackground>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            asChild
            className="mb-4 text-wood-light hover:text-lantern-warm font-traditional"
          >
            <Link to="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-wood-grain/20 mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-traditional text-gion-night text-center">
              Your Learning Journey
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Learning Streak Card */}
        <Card className="bg-gradient-to-br from-vermilion/10 to-vermilion/5 border-vermilion/20 mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl font-traditional text-vermilion">
              <Zap className="mr-2 h-5 w-5" />
              Learning Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-vermilion mb-1">
                  {streakData.currentStreak}
                </div>
                <div className="text-sm text-gray-600">Current Streak</div>
                <div className="text-xs text-gray-500">days</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-700 mb-1">
                  {streakData.longestStreak}
                </div>
                <div className="text-sm text-gray-600">Best Streak</div>
                <div className="text-xs text-gray-500">days</div>
              </div>
              
              <div className="text-center">
                <div className="text-sm font-medium text-gray-700 mb-1">
                  {streakData.lastPracticeDate 
                    ? new Date(streakData.lastPracticeDate).toLocaleDateString() 
                    : 'Never'}
                </div>
                <div className="text-sm text-gray-600">Last Practice</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Hiragana Progress */}
          <Card className="bg-gradient-to-br from-matcha/10 to-matcha/5 border-matcha/20">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-traditional text-matcha">
                <JapaneseCharacter character="あ" size="sm" color="text-matcha" className="mr-2" />
                Hiragana Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-matcha mb-2">
                  {Math.round(overallStats.hiraganaProgress)}%
                </div>
                <ProgressIndicator 
                  progress={overallStats.hiraganaProgress} 
                  color="bg-matcha" 
                  size="lg"
                />
              </div>
              
              <div className="grid grid-cols-5 gap-2 mt-4">
                {hiragana.slice(0, 10).map(kana => {
                  const progress = userProgress.find(p => p.character_id === kana.id);
                  const proficiency = progress ? progress.proficiency : 0;
                  
                  return (
                    <div 
                      key={kana.id} 
                      className={`aspect-square flex flex-col items-center justify-center rounded-lg border text-center ${
                        proficiency >= 70 ? "border-green-300 bg-green-50" :
                        proficiency >= 40 ? "border-yellow-300 bg-yellow-50" :
                        proficiency > 0 ? "border-red-300 bg-red-50" : 
                        "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="text-lg font-traditional">{kana.character}</div>
                      <div className="text-xs mt-1">
                        {proficiency > 0 ? `${proficiency}%` : "New"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Katakana Progress */}
          <Card className="bg-gradient-to-br from-vermilion/10 to-vermilion/5 border-vermilion/20">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-traditional text-vermilion">
                <JapaneseCharacter character="ア" size="sm" color="text-vermilion" className="mr-2" />
                Katakana Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-vermilion mb-2">
                  {Math.round(overallStats.katakanaProgress)}%
                </div>
                <ProgressIndicator 
                  progress={overallStats.katakanaProgress} 
                  color="bg-vermilion" 
                  size="lg"
                />
              </div>
              
              <div className="grid grid-cols-5 gap-2 mt-4">
                {katakana.slice(0, 10).map(kana => {
                  const progress = userProgress.find(p => p.character_id === kana.id);
                  const proficiency = progress ? progress.proficiency : 0;
                  
                  return (
                    <div 
                      key={kana.id} 
                      className={`aspect-square flex flex-col items-center justify-center rounded-lg border text-center ${
                        proficiency >= 70 ? "border-green-300 bg-green-50" :
                        proficiency >= 40 ? "border-yellow-300 bg-yellow-50" :
                        proficiency > 0 ? "border-red-300 bg-red-50" : 
                        "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="text-lg font-traditional">{kana.character}</div>
                      <div className="text-xs mt-1">
                        {proficiency > 0 ? `${proficiency}%` : "New"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Character Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Practiced */}
          <Card className="bg-white/95 backdrop-blur-sm border-wood-grain/20">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-traditional text-gion-night">
                <Award className="mr-2 h-5 w-5" />
                Most Practiced
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getMostPracticed().map(progress => {
                  const kana = [...hiragana, ...katakana].find(k => k.id === progress.character_id);
                  if (!kana) return null;
                  
                  return (
                    <div key={progress.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-white border rounded-full h-10 w-10 flex items-center justify-center">
                          <span className="text-lg font-traditional">{kana.character}</span>
                        </div>
                        <div>
                          <div className="font-medium">{kana.romaji}</div>
                          <div className="text-xs text-gray-500">{kana.type}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{progress.total_practice_count} times</div>
                        <div className="text-xs text-gray-500">{progress.proficiency}% mastery</div>
                      </div>
                    </div>
                  );
                })}
                
                {getMostPracticed().length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <BookOpen className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">Start practicing to see your progress!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Needs Work */}
          <Card className="bg-white/95 backdrop-blur-sm border-wood-grain/20">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-traditional text-gion-night">
                <Target className="mr-2 h-5 w-5" />
                Focus Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getNeedsWork().map(progress => {
                  const kana = [...hiragana, ...katakana].find(k => k.id === progress.character_id);
                  if (!kana) return null;
                  
                  return (
                    <div key={progress.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-red-50 border border-red-200 rounded-full h-10 w-10 flex items-center justify-center">
                          <span className="text-lg font-traditional">{kana.character}</span>
                        </div>
                        <div>
                          <div className="font-medium">{kana.romaji}</div>
                          <div className="text-xs text-gray-500">{kana.type}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-red-500">{progress.proficiency}%</div>
                        <div className="text-xs text-gray-500">needs practice</div>
                      </div>
                    </div>
                  );
                })}
                
                {getNeedsWork().length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <TrendingUp className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">Great job! No weak areas found.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white/95 backdrop-blur-sm border-wood-grain/20 mt-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-matcha hover:bg-matcha/90 text-white">
                <Link to="/quiz">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Take Quiz
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="border-wood-grain text-gion-night hover:bg-wood-grain/10">
                <Link to="/dashboard">
                  <Calendar className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TraditionalBackground>
  );
};

export default Progress;

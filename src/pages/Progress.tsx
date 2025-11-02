
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Calendar, Award, TrendingUp, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TraditionalBackground, TraditionalCard } from '@/components/ui/TraditionalAtmosphere';
import TraditionalHeader from '@/components/ui/TraditionalHeader';
import { characterProgressService } from '@/services/characterProgressService';
import { kanaService } from '@/services/kanaService';
import { UserKanaProgress as UserKanaProgressType } from '@/types/kana';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import TraditionalProgressIndicator from '@/components/ui/TraditionalProgressIndicator';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import { progressPageViewed, useAuth, useToast, setOverallStats, setStreakData, ate, toast, fetchData, toLocaleDateString, getMostPracticed, getNeedsWork } from '@/lib/analytics-generated';

// Track progress_page_viewed
progressPageViewed();
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
          <TraditionalCard className="p-8 text-center">
            <h3 className="text-xl font-traditional text-paper-warm mb-4">Sign in to View Progress</h3>
            <p className="text-wood-light/80 mb-6">Create an account to track your Japanese learning journey.</p>
            <Link to="/auth">
              <Button className="bg-vermilion hover:bg-vermilion/90 text-paper-warm font-traditional">
                Sign In
              </Button>
            </Link>
          </TraditionalCard>
        </div>
      </TraditionalBackground>
    );
  }

  if (isLoading) {
    return (
      <TraditionalBackground>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lantern-warm"></div>
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
        <TraditionalHeader 
          showStats={true}
          stats={{
            streak: streakData.currentStreak,
            mastered: overallStats.totalCharactersLearned,
            proficiency: Math.round((overallStats.hiraganaProgress + overallStats.katakanaProgress) / 2)
          }}
        />

        <div className="mb-6">
          <Button
            variant="ghost"
            asChild
            className="mb-4 text-paper-warm hover:text-lantern-warm font-traditional bg-wood-grain/20 border border-wood-light/40"
          >
            <Link to="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {/* Learning Streak Card */}
        <TraditionalCard className="mb-8 bg-gradient-to-br from-vermilion/20 to-vermilion/10 border-vermilion/40">
          <div className="p-8">
            <div className="flex items-center mb-6">
              <Zap className="mr-3 h-6 w-6 text-lantern-warm" />
              <h2 className="text-2xl font-traditional text-paper-warm">Learning Streak</h2>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-5xl font-bold text-lantern-warm mb-2">
                  {streakData.currentStreak}
                </div>
                <div className="text-sm text-paper-warm/80 font-traditional">Current Streak</div>
                <div className="text-xs text-paper-warm/60">days</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-semibold text-paper-warm/90 mb-2">
                  {streakData.longestStreak}
                </div>
                <div className="text-sm text-paper-warm/80 font-traditional">Best Streak</div>
                <div className="text-xs text-paper-warm/60">days</div>
              </div>
              
              <div className="text-center">
                <div className="text-sm font-medium text-paper-warm/90 mb-2">
                  {streakData.lastPracticeDate 
                    ? new Date(streakData.lastPracticeDate).toLocaleDateString() 
                    : 'Never'}
                </div>
                <div className="text-sm text-paper-warm/80 font-traditional">Last Practice</div>
              </div>
            </div>
          </div>
        </TraditionalCard>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Hiragana Progress */}
          <TraditionalCard className="bg-gradient-to-br from-matcha/20 to-matcha/10 border-matcha/40">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <JapaneseCharacter character="あ" size="sm" color="text-lantern-warm" className="mr-3" />
                <h3 className="text-xl font-traditional text-paper-warm">Hiragana Progress</h3>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-lantern-warm mb-4">
                  {Math.round(overallStats.hiraganaProgress)}%
                </div>
                <TraditionalProgressIndicator 
                  progress={overallStats.hiraganaProgress} 
                  size="lg"
                  type="hiragana"
                />
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {hiragana.slice(0, 10).map(kana => {
                  const progress = userProgress.find(p => p.character_id === kana.id);
                  const proficiency = progress ? progress.proficiency : 0;
                  
                  return (
                    <div 
                      key={kana.id} 
                      className={`aspect-square flex flex-col items-center justify-center border border-wood-light/40 text-center transition-all duration-300 ${
                        proficiency >= 70 ? "bg-matcha/20 border-matcha/60" :
                        proficiency >= 40 ? "bg-lantern-warm/20 border-lantern-warm/60" :
                        proficiency > 0 ? "bg-vermilion/20 border-vermilion/60" : 
                        "bg-wood-grain/20 border-wood-light/40"
                      }`}
                    >
                      <div className="text-lg font-traditional text-paper-warm">{kana.character}</div>
                      <div className="text-xs mt-1 text-paper-warm/70">
                        {proficiency > 0 ? `${proficiency}%` : "New"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TraditionalCard>

          {/* Katakana Progress */}
          <TraditionalCard className="bg-gradient-to-br from-vermilion/20 to-vermilion/10 border-vermilion/40">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <JapaneseCharacter character="ア" size="sm" color="text-lantern-warm" className="mr-3" />
                <h3 className="text-xl font-traditional text-paper-warm">Katakana Progress</h3>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-lantern-warm mb-4">
                  {Math.round(overallStats.katakanaProgress)}%
                </div>
                <TraditionalProgressIndicator 
                  progress={overallStats.katakanaProgress} 
                  size="lg"
                  type="katakana"
                />
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {katakana.slice(0, 10).map(kana => {
                  const progress = userProgress.find(p => p.character_id === kana.id);
                  const proficiency = progress ? progress.proficiency : 0;
                  
                  return (
                    <div 
                      key={kana.id} 
                      className={`aspect-square flex flex-col items-center justify-center border border-wood-light/40 text-center transition-all duration-300 ${
                        proficiency >= 70 ? "bg-matcha/20 border-matcha/60" :
                        proficiency >= 40 ? "bg-lantern-warm/20 border-lantern-warm/60" :
                        proficiency > 0 ? "bg-vermilion/20 border-vermilion/60" : 
                        "bg-wood-grain/20 border-wood-light/40"
                      }`}
                    >
                      <div className="text-lg font-traditional text-paper-warm">{kana.character}</div>
                      <div className="text-xs mt-1 text-paper-warm/70">
                        {proficiency > 0 ? `${proficiency}%` : "New"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TraditionalCard>
        </div>

        {/* Character Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Practiced */}
          <TraditionalCard>
            <div className="p-8">
              <div className="flex items-center mb-6">
                <Award className="mr-3 h-5 w-5 text-lantern-warm" />
                <h3 className="text-lg font-traditional text-paper-warm">Most Practiced</h3>
              </div>
              
              <div className="space-y-3">
                {getMostPracticed().map(progress => {
                  const kana = [...hiragana, ...katakana].find(k => k.id === progress.character_id);
                  if (!kana) return null;
                  
                  return (
                    <div key={progress.id} className="flex items-center justify-between p-3 bg-wood-grain/10 border border-wood-light/30">
                      <div className="flex items-center gap-3">
                        <div className="bg-wood-grain/20 border border-wood-light/40 h-10 w-10 flex items-center justify-center">
                          <span className="text-lg font-traditional text-paper-warm">{kana.character}</span>
                        </div>
                        <div>
                          <div className="font-medium text-paper-warm font-traditional">{kana.romaji}</div>
                          <div className="text-xs text-paper-warm/60">{kana.type}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-lantern-warm">{progress.total_practice_count} times</div>
                        <div className="text-xs text-paper-warm/70">{progress.proficiency}% mastery</div>
                      </div>
                    </div>
                  );
                })}
                
                {getMostPracticed().length === 0 && (
                  <div className="text-center py-6 text-paper-warm/60">
                    <BookOpen className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm font-traditional">Start practicing to see your progress!</p>
                  </div>
                )}
              </div>
            </div>
          </TraditionalCard>

          {/* Focus Areas */}
          <TraditionalCard>
            <div className="p-8">
              <div className="flex items-center mb-6">
                <TrendingUp className="mr-3 h-5 w-5 text-lantern-warm" />
                <h3 className="text-lg font-traditional text-paper-warm">Focus Areas</h3>
              </div>
              
              <div className="space-y-3">
                {getNeedsWork().map(progress => {
                  const kana = [...hiragana, ...katakana].find(k => k.id === progress.character_id);
                  if (!kana) return null;
                  
                  return (
                    <div key={progress.id} className="flex items-center justify-between p-3 bg-wood-grain/10 border border-wood-light/30">
                      <div className="flex items-center gap-3">
                        <div className="bg-vermilion/20 border border-vermilion/40 h-10 w-10 flex items-center justify-center">
                          <span className="text-lg font-traditional text-paper-warm">{kana.character}</span>
                        </div>
                        <div>
                          <div className="font-medium text-paper-warm font-traditional">{kana.romaji}</div>
                          <div className="text-xs text-paper-warm/60">{kana.type}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-vermilion">{progress.proficiency}%</div>
                        <div className="text-xs text-paper-warm/70">needs practice</div>
                      </div>
                    </div>
                  );
                })}
                
                {getNeedsWork().length === 0 && (
                  <div className="text-center py-6 text-paper-warm/60">
                    <TrendingUp className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm font-traditional">Great job! No weak areas found.</p>
                  </div>
                )}
              </div>
            </div>
          </TraditionalCard>
        </div>

        {/* Quick Actions */}
        <TraditionalCard className="mt-8">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-matcha hover:bg-matcha/90 text-paper-warm font-traditional">
                <Link to="/quiz">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Take Quiz
                </Link>
              </Button>
              
              <Button asChild className="bg-wood-grain/20 border border-wood-light/40 text-paper-warm hover:bg-wood-grain/30 font-traditional">
                <Link to="/dashboard">
                  <Calendar className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </TraditionalCard>
      </div>
    </TraditionalBackground>
  );
};

export default Progress;

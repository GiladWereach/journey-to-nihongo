
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle, Settings, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import TraditionalBackground from '@/components/ui/TraditionalAtmosphere';
import UserKanaProgress from '@/components/kana/UserKanaProgress';
import { characterProgressService } from '@/services/characterProgressService';
import { kanaService } from '@/services/kanaService';
import { UserKanaProgress as UserKanaProgressType } from '@/types/kana';
import { useSessionCleanup } from '@/hooks/useSessionCleanup';
import { useToast } from '@/hooks/use-toast';
import AbandonedSessionsFixer from '@/components/admin/AbandonedSessionsFixer';
import ProgressRepairTools from '@/components/progress/ProgressRepairTools';
import { supabase } from '@/integrations/supabase/client';
import ModernProgressOverview from '@/components/progress/ModernProgressOverview';

const RevampedProgress: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [userProgress, setUserProgress] = useState<UserKanaProgressType[]>([]);
  const [hiragana, setHiragana] = useState<any[]>([]);
  const [katakana, setKatakana] = useState<any[]>([]);
  const [overallProgress, setOverallProgress] = useState({
    all: 0,
    hiragana: 0,
    katakana: 0,
  });
  const [hiraganaStats, setHiraganaStats] = useState({
    level0: 0,
    level1: 0,
    level2: 0,
    level3Plus: 0,
    total: 0,
  });
  const [katakanaStats, setKatakanaStats] = useState({
    level0: 0,
    level1: 0,
    level2: 0,
    level3Plus: 0,
    total: 0,
  });
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    lastPracticeDate: null as Date | null,
  });
  const [timelineData, setTimelineData] = useState<
    Array<{
      date: string;
      charactersStudied: number;
      averageProficiency: number;
    }>
  >([]);
  const [overallLearningProgress, setOverallLearningProgress] = useState({
    hiragana: 0,
    katakana: 0,
    basic_kanji: 0,
    grammar: 0,
  });
  const [hasIncompleteData, setHasIncompleteData] = useState(false);
  const [showRepairTools, setShowRepairTools] = useState(false);

  // Use the cleanup hook to fix abandoned sessions when viewing progress
  useSessionCleanup();

  useEffect(() => {
    const fetchKana = async () => {
      const hiraganaData = await kanaService.getKanaByType('hiragana');
      const katakanaData = await kanaService.getKanaByType('katakana');
      setHiragana(hiraganaData);
      setKatakana(katakanaData);
    };

    fetchKana();
  }, []);

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!user) return;

      setIsLoadingProgress(true);
      try {
        // Check for incomplete sessions
        const { data: incompleteSessions, error: sessionError } = await supabase
          .from('kana_learning_sessions')
          .select('id')
          .eq('user_id', user.id)
          .eq('completed', false);

        if (sessionError) {
          console.error('Error checking sessions:', sessionError);
        } else if (incompleteSessions && incompleteSessions.length > 0) {
          setHasIncompleteData(true);
          setShowRepairTools(true);
        }

        const progressData = await characterProgressService.getUserProgress(user.id);
        setUserProgress(progressData);

        // Calculate progress only if we have character data
        if (hiragana.length > 0 && katakana.length > 0) {
          const hiraganaProgress = progressData.filter((p) =>
            hiragana.some((k) => k.id === p.character_id)
          );
          const katakanaProgress = progressData.filter((p) =>
            katakana.some((k) => k.id === p.character_id)
          );

          const overallHiragana =
            hiragana.length > 0
              ? hiraganaProgress.reduce((sum, p) => sum + p.proficiency, 0) / hiragana.length
              : 0;
          const overallKatakana =
            katakana.length > 0
              ? katakanaProgress.reduce((sum, p) => sum + p.proficiency, 0) / katakana.length
              : 0;

          setOverallProgress({
            all: (overallHiragana + overallKatakana) / 2,
            hiragana: overallHiragana,
            katakana: overallKatakana,
          });

          // Calculate mastery stats
          const hiraganaStatsData = calculateMasteryStats(hiraganaProgress);
          const katakanaStatsData = calculateMasteryStats(katakanaProgress);

          setHiraganaStats(hiraganaStatsData);
          setKatakanaStats(katakanaStatsData);

          // Set learning progress based on actual data
          setOverallLearningProgress({
            hiragana: overallHiragana,
            katakana: overallKatakana,
            basic_kanji: 0, // TODO: Implement when kanji learning is added
            grammar: 0, // TODO: Implement when grammar learning is added
          });
        }

        // Fetch streak data
        const streak = await fetchStreakData(user.id);
        setStreakData(streak);

        // Generate timeline data based on actual sessions
        const timeline = await generateTimelineData(user.id);
        setTimelineData(timeline);
      } catch (error) {
        console.error('Error fetching user progress:', error);
        toast({
          title: "Error loading progress",
          description: "There was an issue loading your progress data.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProgress(false);
      }
    };

    if (user && hiragana.length > 0 && katakana.length > 0) {
      fetchUserProgress();
    }
  }, [user, hiragana, katakana, toast]);

  const calculateMasteryStats = (progress: UserKanaProgressType[]) => {
    const level0 = progress.filter((p) => p.proficiency < 25).length;
    const level1 = progress.filter((p) => p.proficiency >= 25 && p.proficiency < 50).length;
    const level2 = progress.filter((p) => p.proficiency >= 50 && p.proficiency < 75).length;
    const level3Plus = progress.filter((p) => p.proficiency >= 75).length;
    const total = progress.length;

    return {
      level0,
      level1,
      level2,
      level3Plus,
      total,
    };
  };

  const fetchStreakData = async (userId: string) => {
    try {
      const { data: sessions, error } = await supabase
        .from('kana_learning_sessions')
        .select('start_time, streak')
        .eq('user_id', userId)
        .eq('completed', true)
        .order('start_time', { ascending: false })
        .limit(30);

      if (error) throw error;

      // Calculate streak based on consecutive days with sessions
      let currentStreak = 0;
      let longestStreak = 0;
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      if (sessions && sessions.length > 0) {
        const sessionDates = [...new Set(sessions.map(s => new Date(s.start_time).toDateString()))];
        
        // Calculate current streak
        for (let i = 0; i < sessionDates.length; i++) {
          const sessionDate = sessionDates[i];
          if (i === 0 && (sessionDate === today || sessionDate === yesterday)) {
            currentStreak = 1;
          } else if (sessionDates[i - 1] && 
                     new Date(sessionDates[i - 1]).getTime() - new Date(sessionDate).getTime() === 86400000) {
            currentStreak++;
          } else {
            break;
          }
        }

        // Calculate longest streak (simplified)
        longestStreak = Math.max(...sessions.map(s => s.streak || 0));
      }

      return {
        currentStreak,
        longestStreak,
        lastPracticeDate: sessions && sessions.length > 0 ? new Date(sessions[0].start_time) : null,
      };
    } catch (error) {
      console.error('Error fetching streak data:', error);
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastPracticeDate: null,
      };
    }
  };

  const generateTimelineData = async (userId: string) => {
    try {
      const { data: sessions, error } = await supabase
        .from('kana_learning_sessions')
        .select('start_time, questions_answered, accuracy')
        .eq('user_id', userId)
        .eq('completed', true)
        .gte('start_time', new Date(Date.now() - 7 * 86400000).toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;

      const timelineMap = new Map();
      
      // Group sessions by date
      sessions?.forEach(session => {
        const date = new Date(session.start_time).toLocaleDateString();
        if (!timelineMap.has(date)) {
          timelineMap.set(date, {
            date,
            charactersStudied: 0,
            averageProficiency: 0,
            sessions: []
          });
        }
        timelineMap.get(date).sessions.push(session);
        timelineMap.get(date).charactersStudied += session.questions_answered || 0;
      });

      // Calculate averages
      const timelineArray = Array.from(timelineMap.values()).map(day => ({
        date: day.date,
        charactersStudied: day.charactersStudied,
        averageProficiency: day.sessions.reduce((sum: number, s: any) => sum + (s.accuracy || 0), 0) / day.sessions.length
      }));

      // Fill in missing days with zeros
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(Date.now() - i * 86400000);
        const dateString = date.toLocaleDateString();
        const existingData = timelineArray.find(d => d.date === dateString);
        data.push(existingData || {
          date: dateString,
          charactersStudied: 0,
          averageProficiency: 0
        });
      }

      return data;
    } catch (error) {
      console.error('Error generating timeline data:', error);
      return [];
    }
  };

  const handleRepairComplete = () => {
    setShowRepairTools(false);
    setHasIncompleteData(false);
    // Refresh the data
    window.location.reload();
  };

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

        {showRepairTools && (
          <div className="mb-6">
            <ProgressRepairTools onRepairComplete={handleRepairComplete} />
          </div>
        )}

        {hasIncompleteData && !showRepairTools && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <div className="flex-1">
                  <h4 className="font-medium text-amber-800">Data Quality Issue Detected</h4>
                  <p className="text-sm text-amber-700">
                    Some quiz sessions weren't properly completed. This may affect your progress statistics.
                  </p>
                </div>
                <Button
                  onClick={() => setShowRepairTools(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  size="sm"
                >
                  <Wrench className="h-4 w-4 mr-1" />
                  Fix Issues
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-white/95 backdrop-blur-sm border-wood-grain/20">
          <CardHeader>
            <CardTitle className="text-2xl font-traditional text-gion-night">
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-wood-grain/10">
                <TabsTrigger value="overview" className="font-traditional">Overview</TabsTrigger>
                <TabsTrigger value="characters" className="font-traditional">Characters</TabsTrigger>
                <TabsTrigger value="admin" className="font-traditional">
                  <Settings className="h-4 w-4 mr-1" />
                  Admin
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <ModernProgressOverview
                  hiraganaStats={hiraganaStats}
                  katakanaStats={katakanaStats}
                  streakData={streakData}
                  timelineData={timelineData}
                  overallProgress={overallLearningProgress}
                  loading={isLoadingProgress}
                />
              </TabsContent>
              
              <TabsContent value="characters" className="mt-6">
                <UserKanaProgress />
              </TabsContent>
              
              <TabsContent value="admin" className="mt-6">
                <div className="space-y-6">
                  <AbandonedSessionsFixer />
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Progress Data Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Character Progress Records:</p>
                          <p className="text-muted-foreground">{userProgress.length} entries</p>
                        </div>
                        <div>
                          <p className="font-medium">Overall Progress:</p>
                          <p className="text-muted-foreground">{overallProgress.all.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="font-medium">Hiragana Progress:</p>
                          <p className="text-muted-foreground">{overallProgress.hiragana.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="font-medium">Katakana Progress:</p>
                          <p className="text-muted-foreground">{overallProgress.katakana.toFixed(1)}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </TraditionalBackground>
  );
};

export default RevampedProgress;

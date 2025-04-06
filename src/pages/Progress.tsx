
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { BarChart2, Menu, RefreshCw } from 'lucide-react';
import PrimaryNavigation from '@/components/layout/PrimaryNavigation';
import UserKanaProgress from '@/components/kana/UserKanaProgress';
import { kanaProgressService } from '@/services/kanaProgressService';
import { kanaService } from '@/services/kanaService';
import ProgressStats from '@/components/progress/ProgressStats';
import ProgressOverview from '@/components/progress/ProgressOverview';
import StudySessionsList from '@/components/progress/StudySessionsList';
import StudyHabitsCard from '@/components/progress/StudyHabitsCard';
import { progressTrackingService } from '@/services/progressTrackingService';
import { KanaType } from '@/types/kana';
import { supabaseClient } from '@/lib/supabase';

const Progress: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [studySessions, setStudySessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    lastPracticeDate: null
  });
  const [timelineData, setTimelineData] = useState([]);
  const [hiraganaStats, setHiraganaStats] = useState({
    level0: 0,
    level1: 0,
    level2: 0,
    level3Plus: 0,
    total: 0
  });
  const [katakanaStats, setKatakanaStats] = useState({
    level0: 0,
    level1: 0,
    level2: 0,
    level3Plus: 0,
    total: 0
  });
  const [overallProgress, setOverallProgress] = useState({
    hiragana: 0,
    katakana: 0,
    basic_kanji: 10,
    grammar: 5
  });
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [studyHabits, setStudyHabits] = useState({
    timeDistribution: {
      morning: 25,
      afternoon: 30,
      evening: 40,
      night: 5
    },
    averageSessionDuration: 15,
    frequencyPerWeek: 4.2
  });
  const [userSettings, setUserSettings] = useState({
    dailyGoalMinutes: 15,
    weeklyGoalDays: 5
  });
  
  // This is the key function that fetches progress data
  const fetchProgressData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      console.log("Fetching progress data for user:", user.id);
      
      // Fetch streak data
      const streak = await progressTrackingService.getLearningStreak(user.id);
      console.log("Streak data:", streak);
      setStreakData(streak);
      
      // Fetch study sessions
      const sessions = await progressTrackingService.getAllStudySessions(user.id);
      console.log("Study sessions:", sessions);
      setStudySessions(sessions);
      
      // Calculate total study time
      const studyTime = await progressTrackingService.calculateTotalStudyTime(user.id, 7);
      console.log("Total study time:", studyTime);
      setTotalStudyTime(studyTime);
      
      // Get progress timeline
      const timeline = await progressTrackingService.getProgressTimeline(user.id, 14);
      console.log("Timeline data:", timeline);
      setTimelineData(timeline);
      
      // Get hiragana mastery distribution
      const hiraganaDistribution = await kanaProgressService.getMasteryDistribution(user.id, 'hiragana');
      const hiraganaTotal = kanaService.getKanaByType('hiragana').length;
      console.log("Hiragana distribution:", hiraganaDistribution, "Total:", hiraganaTotal);
      setHiraganaStats({
        ...hiraganaDistribution,
        total: hiraganaTotal
      });
      
      // Get katakana mastery distribution
      const katakanaDistribution = await kanaProgressService.getMasteryDistribution(user.id, 'katakana');
      const katakanaTotal = kanaService.getKanaByType('katakana').length;
      console.log("Katakana distribution:", katakanaDistribution, "Total:", katakanaTotal);
      setKatakanaStats({
        ...katakanaDistribution,
        total: katakanaTotal
      });
      
      // Calculate overall proficiency
      const hiraganaProgress = await kanaService.calculateOverallProficiency(user.id, 'hiragana');
      const katakanaProgress = await kanaService.calculateOverallProficiency(user.id, 'katakana');
      console.log("Overall proficiency - Hiragana:", hiraganaProgress, "Katakana:", katakanaProgress);
      
      setOverallProgress({
        hiragana: hiraganaProgress,
        katakana: katakanaProgress,
        basic_kanji: 10,
        grammar: 5
      });
      
      // Fetch user settings
      const { data: settingsData, error: settingsError } = await supabaseClient
        .from('user_settings')
        .select('daily_goal_minutes, weekly_goal_days')
        .eq('id', user.id)
        .single();
        
      if (!settingsError && settingsData) {
        console.log("User settings:", settingsData);
        setUserSettings({
          dailyGoalMinutes: settingsData.daily_goal_minutes || 15,
          weeklyGoalDays: settingsData.weekly_goal_days || 5
        });
      } else if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Error fetching user settings:', settingsError);
      }
      
      // Calculate study habits data
      const studyHabitsData = await progressTrackingService.analyzeStudyHabits(user.id);
      if (studyHabitsData) {
        console.log("Study habits:", studyHabitsData);
        setStudyHabits(studyHabitsData);
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch progress data on initial load and whenever user changes
  useEffect(() => {
    if (!user) return;
    fetchProgressData();
    
    // Also refresh data every 2 minutes if the page is kept open
    const intervalId = setInterval(fetchProgressData, 120000);
    
    return () => clearInterval(intervalId);
  }, [user]);
  
  // Force navigation to login if not authenticated
  if (!user) {
    navigate('/auth');
    return null;
  }
  
  const learnedCharacters = hiraganaStats.level1 + hiraganaStats.level2 + hiraganaStats.level3Plus + 
                           katakanaStats.level1 + katakanaStats.level2 + katakanaStats.level3Plus;

  // Add a refresh button handler
  const handleRefresh = () => {
    fetchProgressData();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 px-4 bg-softgray/30">
        <div className="max-w-7xl mx-auto flex">
          <div className="hidden md:block w-64 mr-8">
            <div className="sticky top-24">
              <PrimaryNavigation />
              
              <div className="mt-8 p-4 bg-white rounded-lg shadow">
                <h3 className="font-semibold text-indigo mb-2">Quick Access</h3>
                <ul className="space-y-2">
                  <li>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      size="sm"
                      onClick={() => setActiveTab('overview')}
                    >
                      Overview
                    </Button>
                  </li>
                  <li>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      size="sm"
                      onClick={() => setActiveTab('kana')}
                    >
                      Kana Progress
                    </Button>
                  </li>
                  <li>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      size="sm"
                      onClick={() => setActiveTab('habits')}
                    >
                      Study Habits
                    </Button>
                  </li>
                  <li>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      size="sm"
                      onClick={() => navigate('/writing-practice')}
                    >
                      Writing Practice
                    </Button>
                  </li>
                  <li>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      size="sm"
                      onClick={() => navigate('/quick-quiz')}
                    >
                      Quick Quiz
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="md:hidden fixed bottom-4 right-4 z-40">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" className="rounded-full w-12 h-12 bg-indigo hover:bg-indigo/90">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[280px]">
                <div className="py-4">
                  <h2 className="text-lg font-bold text-indigo mb-4 flex items-center">
                    <BarChart2 className="mr-2 h-5 w-5" />
                    Navigation
                  </h2>
                  <PrimaryNavigation />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="flex-1">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-indigo mb-2">Your Progress</h1>
                <p className="text-gray-600">
                  Track your Japanese learning journey and see how far you've come.
                </p>
              </div>
              <Button 
                onClick={handleRefresh} 
                variant="outline"
                className="flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Data
              </Button>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="kana">Kana Progress</TabsTrigger>
                <TabsTrigger value="habits">Study Habits</TabsTrigger>
                <TabsTrigger value="study-sessions">Study Sessions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="animate-fade-in">
                <ProgressStats 
                  totalStudyTime={totalStudyTime}
                  totalSessions={studySessions.length}
                  learnedCharacters={learnedCharacters}
                  currentStreak={streakData.currentStreak}
                  longestStreak={streakData.longestStreak}
                />
                
                <ProgressOverview 
                  hiraganaStats={hiraganaStats}
                  katakanaStats={katakanaStats}
                  streakData={streakData}
                  timelineData={timelineData}
                  overallProgress={overallProgress}
                  loading={loading}
                />
              </TabsContent>
              
              <TabsContent value="kana" className="animate-fade-in">
                <UserKanaProgress />
              </TabsContent>
              
              <TabsContent value="habits" className="animate-fade-in">
                <StudyHabitsCard 
                  timeDistribution={studyHabits.timeDistribution}
                  dailyGoalMinutes={userSettings.dailyGoalMinutes}
                  weeklyGoalDays={userSettings.weeklyGoalDays}
                  averageSessionDuration={studyHabits.averageSessionDuration}
                  currentStreak={streakData.currentStreak}
                  frequencyPerWeek={studyHabits.frequencyPerWeek}
                  className="mb-8"
                />
              </TabsContent>
              
              <TabsContent value="study-sessions" className="animate-fade-in">
                <StudySessionsList 
                  studySessions={studySessions}
                  loading={loading}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Progress;

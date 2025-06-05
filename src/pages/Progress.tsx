import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Award, TrendingUp, Clock, Target, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProgressStatsTab from '@/components/progress/tabs/ProgressStatsTab';
import ProgressOverview from '@/components/progress/ProgressOverview';
import { characterProgressService } from '@/services/characterProgressService';
import { kanaService } from '@/services/kanaService';
import { UserKanaProgress } from '@/types/kana';

const Progress: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [userProgress, setUserProgress] = useState<UserKanaProgress[]>([]);
  const [hiragana, setHiragana] = useState<any[]>([]);
  const [katakana, setKatakana] = useState<any[]>([]);
  const [allKana, setAllKana] = useState<any[]>([]);
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

  useEffect(() => {
    const fetchKana = async () => {
      const hiraganaData = await kanaService.getKanaByType('hiragana');
      const katakanaData = await kanaService.getKanaByType('katakana');
      setHiragana(hiraganaData);
      setKatakana(katakanaData);
      setAllKana([...hiraganaData, ...katakanaData]);
    };

    fetchKana();
  }, []);

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!user) return;

      setIsLoadingProgress(true);
      try {
        const progressData = await characterProgressService.getUserProgress(user.id);
        setUserProgress(progressData);

        // Calculate overall progress
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

        // Fetch streak data
        const streak = await fetchStreakData(user.id);
        setStreakData(streak);

        // Mock timeline data
        const timeline = generateMockTimelineData();
        setTimelineData(timeline);

        // Mock overall learning progress
        const learningProgress = generateMockLearningProgress();
        setOverallLearningProgress(learningProgress);
      } catch (error) {
        console.error('Error fetching user progress:', error);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    if (user && hiragana.length > 0 && katakana.length > 0) {
      fetchUserProgress();
    }
  }, [user, hiragana, katakana]);

  const calculateMasteryStats = (progress: UserKanaProgress[]) => {
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
    // Mock streak data
    return {
      currentStreak: 5,
      longestStreak: 12,
      lastPracticeDate: new Date(),
    };
  };

  const generateMockTimelineData = () => {
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toLocaleDateString();
      data.push({
        date: dateString,
        charactersStudied: Math.floor(Math.random() * 10),
        averageProficiency: Math.floor(Math.random() * 100),
      });
    }
    return data;
  };

  const generateMockLearningProgress = () => {
    return {
      hiragana: Math.floor(Math.random() * 100),
      katakana: Math.floor(Math.random() * 100),
      basic_kanji: Math.floor(Math.random() * 100),
      grammar: Math.floor(Math.random() * 100),
    };
  };

  const calculateProficiencyLevel = (proficiency: number) => {
    if (proficiency >= 90) return 'mastered';
    if (proficiency >= 70) return 'advanced';
    if (proficiency >= 40) return 'intermediate';
    return 'beginner';
  };

  const calculateMasteryPercentage = (type: 'hiragana' | 'katakana' | 'all') => {
    let masteredCount = 0;
    let totalCount = 0;

    if (type === 'hiragana' || type === 'all') {
      masteredCount += userProgress.filter((p) =>
        hiragana.some((k) => k.id === p.character_id && p.proficiency >= 90)
      ).length;
      totalCount += hiragana.length;
    }

    if (type === 'katakana' || type === 'all') {
      masteredCount += userProgress.filter((p) =>
        katakana.some((k) => k.id === p.character_id && p.proficiency >= 90)
      ).length;
      totalCount += katakana.length;
    }

    return totalCount > 0 ? (masteredCount / totalCount) * 100 : 0;
  };

  const getMostChallenging = () => {
    return [...userProgress]
      .sort((a, b) => a.mistake_count - b.mistake_count)
      .slice(0, 5);
  };

  const getMostPracticed = () => {
    return [...userProgress]
      .sort((a, b) => b.total_practice_count - a.total_practice_count)
      .slice(0, 5);
  };

  const getMostRecentlyPracticed = () => {
    return [...userProgress]
      .sort(
        (a, b) =>
          new Date(b.last_practiced).getTime() - new Date(a.last_practiced).getTime()
      )
      .slice(0, 5);
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Learning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <ProgressOverview
                hiraganaStats={hiraganaStats}
                katakanaStats={katakanaStats}
                streakData={streakData}
                timelineData={timelineData}
                overallProgress={overallLearningProgress}
                loading={isLoadingProgress}
              />
            </TabsContent>
            <TabsContent value="stats">
              <ProgressStatsTab
                user={user}
                isLoadingProgress={isLoadingProgress}
                userProgress={userProgress}
                hiragana={hiragana}
                katakana={katakana}
                allKana={allKana}
                overallProgress={{
                  all: overallProgress.all,
                  hiragana: overallProgress.hiragana,
                  katakana: overallProgress.katakana,
                }}
                calculateProficiencyLevel={calculateProficiencyLevel}
                calculateMasteryPercentage={calculateMasteryPercentage}
                getMostChallenging={getMostChallenging}
                getMostPracticed={getMostPracticed}
                getMostRecentlyPracticed={getMostRecentlyPracticed}
                setActiveTab={setActiveTab}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Progress;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import LearningStreakCard from '@/components/progress/LearningStreakCard';
import MasteryDistributionCard from '@/components/progress/MasteryDistributionCard';
import ProgressTimelineCard from '@/components/progress/ProgressTimelineCard';
import LearningPathProgress from '@/components/progress/LearningPathProgress';

interface ProgressOverviewProps {
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

const ProgressOverview: React.FC<ProgressOverviewProps> = ({
  hiraganaStats,
  katakanaStats,
  streakData,
  timelineData,
  overallProgress,
  loading
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo"></div>
      </div>
    );
  }

  return (
    <>
      <LearningStreakCard 
        currentStreak={streakData.currentStreak}
        longestStreak={streakData.longestStreak}
        lastPracticeDate={streakData.lastPracticeDate}
        className="mb-8"
      />
      
      <LearningPathProgress
        hiraganaProgress={overallProgress.hiragana}
        katakanaProgress={overallProgress.katakana}
        basicKanjiProgress={overallProgress.basic_kanji}
        grammarProgress={overallProgress.grammar}
        className="mb-8"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <MasteryDistributionCard 
          hiragana={hiraganaStats}
          katakana={katakanaStats}
        />
        
        <ProgressTimelineCard data={timelineData} />
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Hiragana</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(overallProgress.hiragana)}%
                </span>
              </div>
              <ProgressIndicator progress={overallProgress.hiragana} color="bg-matcha" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Katakana</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(overallProgress.katakana)}%
                </span>
              </div>
              <ProgressIndicator progress={overallProgress.katakana} color="bg-vermilion" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Basic Kanji</span>
                <span className="text-sm text-muted-foreground">
                  {overallProgress.basic_kanji}%
                </span>
              </div>
              <ProgressIndicator progress={overallProgress.basic_kanji} color="bg-indigo" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Grammar</span>
                <span className="text-sm text-muted-foreground">
                  {overallProgress.grammar}%
                </span>
              </div>
              <ProgressIndicator progress={overallProgress.grammar} color="bg-amber-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ProgressOverview;

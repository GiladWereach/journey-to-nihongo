
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import LearningStreakCard from '@/components/progress/LearningStreakCard';
import MasteryDistributionCard from '@/components/progress/MasteryDistributionCard';
import ProgressTimelineCard from '@/components/progress/ProgressTimelineCard';
import LearningPathProgress from '@/components/progress/LearningPathProgress';
import TeachingMechanismsCard from '@/components/progress/TeachingMechanismsCard';
import LearningFlowCard from '@/components/progress/LearningFlowCard';
import { Separator } from '@/components/ui/separator';

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

  // Determine current learning stage based on progress
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LearningStreakCard 
            currentStreak={streakData.currentStreak}
            longestStreak={streakData.longestStreak}
            lastPracticeDate={streakData.lastPracticeDate}
          />
        </div>
        
        <div className="lg:col-span-1">
          <Card className="bg-white h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-xl font-semibold">
                <TrendingUp className="mr-2 h-5 w-5" />
                Learning Focus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
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
                  <div className="flex justify-between mb-1">
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
                  <div className="flex justify-between mb-1">
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
                  <div className="flex justify-between mb-1">
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
              
              <div className="mt-4 pt-4 border-t border-gray-100">
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
      
      <LearningPathProgress
        hiraganaProgress={overallProgress.hiragana}
        katakanaProgress={overallProgress.katakana}
        basicKanjiProgress={overallProgress.basic_kanji}
        grammarProgress={overallProgress.grammar}
        className="bg-white"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeachingMechanismsCard currentStage={currentStage} className="bg-white" />
        <LearningFlowCard 
          className="bg-white"
          currentLearningSessions={2}
          reviewsDueToday={15}
          recommendedSessionTime={20}
          lastReviewDate={streakData.lastPracticeDate}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MasteryDistributionCard 
          hiragana={hiraganaStats}
          katakana={katakanaStats}
        />
        
        <ProgressTimelineCard data={timelineData} />
      </div>
    </div>
  );
};

export default ProgressOverview;

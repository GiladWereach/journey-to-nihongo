import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { characterProgressService } from '@/services/characterProgressService';
import KanaGrid from '@/components/kana/KanaGrid';
import { Book, PenTool, BookOpen, BarChart, GraduationCap, Bookmark, Zap } from 'lucide-react';
import ProgressHeader from '@/components/progress/ProgressHeader';
import IntroTab from '@/components/progress/tabs/IntroTab';
import PracticeSelectionTab from '@/components/progress/tabs/PracticeSelectionTab';
import PracticeSessionTab from '@/components/progress/tabs/PracticeSessionTab';
import ProgressStatsTab from '@/components/progress/tabs/ProgressStatsTab';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import { KanaType, PracticeResult, UserKanaProgress } from '@/types/kana';
import { cn } from '@/lib/utils';

const KanaLearning = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('intro');
  const [selectedKanaType, setSelectedKanaType] = useState<KanaType | 'all'>('all');
  const [practiceMode, setPracticeMode] = useState<'selection' | 'practice' | 'results'>('selection');
  const [practiceType, setPracticeType] = useState<'recognition' | 'matching'>('recognition');
  const [practiceResults, setPracticeResults] = useState<PracticeResult | null>(null);
  const [userProgress, setUserProgress] = useState<UserKanaProgress[]>([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [overallProgress, setOverallProgress] = useState({
    all: 0,
    hiragana: 0,
    katakana: 0
  });

  const navigate = useNavigate();

  // Load user progress
  useEffect(() => {
    if (user) {
      try {
        setIsLoadingProgress(true);
        characterProgressService.getUserProgress(user.id).then((progress) => {
          setUserProgress(progress);
          setIsLoadingProgress(false);
        }).catch((error) => {
          console.error('Error loading user progress:', error);
          setIsLoadingProgress(false);
        });
      } catch (error) {
        console.error('Error loading user progress:', error);
        setIsLoadingProgress(false);
      }
    }
  }, [user]);

  // Calculate overall progress
  useEffect(() => {
    const loadProgressData = async () => {
      if (user) {
        try {
          const allProgress = await characterProgressService.calculateOverallProficiency(user.id, 'all');
          const hiraganaProgress = await characterProgressService.calculateOverallProficiency(user.id, 'hiragana');
          const katakanaProgress = await characterProgressService.calculateOverallProficiency(user.id, 'katakana');
          
          setOverallProgress({
            all: allProgress,
            hiragana: hiraganaProgress,
            katakana: katakanaProgress
          });
        } catch (error) {
          console.error('Error calculating progress:', error);
        }
      }
    };
    
    loadProgressData();
  }, [user, userProgress]);

  const calculateProficiencyLevel = (proficiency: number) => {
    if (proficiency >= 90) return 'mastered';
    if (proficiency >= 70) return 'advanced';
    if (proficiency >= 40) return 'intermediate';
    return 'beginner';
  };

  const calculateMasteryPercentage = (type: KanaType | 'all') => {
    if (!userProgress.length) return 0;
    
    const relevantProgress = userProgress.filter(progress => {
      if (type === 'all') return true;
      return progress.character_id.startsWith(type);
    });
    
    if (relevantProgress.length === 0) return 0;
    
    const masteredChars = relevantProgress.filter(progress => progress.proficiency >= 90).length;
    return (masteredChars / relevantProgress.length) * 100;
  };

  const getMostChallenging = () => {
    if (!userProgress.length) return [];
    
    return [...userProgress]
      .filter(progress => progress.total_practice_count > 0)
      .sort((a, b) => a.proficiency - b.proficiency)
      .slice(0, 5);
  };

  const getMostPracticed = () => {
    if (!userProgress.length) return [];
    
    return [...userProgress]
      .sort((a, b) => b.total_practice_count - a.total_practice_count)
      .slice(0, 5);
  };

  const getMostRecentlyPracticed = () => {
    if (!userProgress.length) return [];
    
    return [...userProgress]
      .sort((a, b) => {
        const dateA = typeof a.last_practiced === 'string' ? new Date(a.last_practiced).getTime() : a.last_practiced instanceof Date ? a.last_practiced.getTime() : 0;
        const dateB = typeof b.last_practiced === 'string' ? new Date(b.last_practiced).getTime() : b.last_practiced instanceof Date ? b.last_practiced.getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5);
  };

  const handlePracticeStart = (type: KanaType | 'all', mode: 'recognition' | 'matching') => {
    setSelectedKanaType(type);
    setPracticeType(mode);
    setPracticeMode('practice');
    setActiveTab('practice');
  };

  const handlePracticeComplete = async (results: PracticeResult) => {
    setPracticeResults(results);
    setPracticeMode('results');
    
    if (user && results.characterResults.length > 0) {
      for (const result of results.characterResults) {
        await characterProgressService.updateProgress(user.id, result.character, result.correct);
      }
      
      const updatedProgress = await characterProgressService.getUserProgress(user.id);
      setUserProgress(updatedProgress);
    }
  };

  const handlePracticeCancel = () => {
    setPracticeMode('selection');
  };

  const handlePracticeSimilar = () => {
    setPracticeMode('practice');
  };

  const handlePracticeAgain = () => {
    setPracticeMode('practice');
  };

  const handleFinishPractice = () => {
    setPracticeMode('selection');
  };

  const handleQuickQuizStart = (kanaType: KanaType) => {
    navigate('/quick-quiz', {
      state: {
        fromKanaLearning: true,
        kanaType
      }
    });
  };

  const renderProgressIndicator = (type: KanaType | 'all') => {
    const progress = type === 'all' ? overallProgress.all : 
                   type === 'hiragana' ? overallProgress.hiragana : 
                   type === 'katakana' ? overallProgress.katakana : 0;
    
    return (
      <ProgressIndicator
        progress={progress}
        size="sm"
        color={type === 'hiragana' ? 'bg-matcha' : type === 'katakana' ? 'bg-vermilion' : 'bg-indigo'}
      />
    );
  };

  return (
    <div className="container mx-auto px-4">
      <ProgressHeader user={user} />
      
      <div className="pt-16 pb-6">
        <Tabs
          defaultValue="intro"
          className="max-w-5xl mx-auto"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          <TabsList className={cn("grid grid-cols-4 mb-6 sticky top-16 z-40 bg-background/95 backdrop-blur-sm shadow-sm p-1 rounded-lg max-w-md mx-auto")}>
            <TabsTrigger value="intro" className="flex items-center gap-2 rounded-md">
              <BookOpen size={16} />
              Intro
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex items-center gap-2 rounded-md">
              <Book size={16} />
              Learn
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-2 rounded-md">
              <PenTool size={16} />
              Practice
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2 rounded-md">
              <BarChart size={16} />
              Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="intro" className="space-y-6">
            <IntroTab />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <JapaneseCharacter character="あ" size="sm" color="text-matcha" />
                  <JapaneseCharacter character="ア" size="sm" color="text-vermilion" />
                  Your Progress
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-matcha/10 to-matcha/5 rounded-lg border border-matcha/20">
                    <span className="font-medium">Hiragana</span>
                    <div className="flex items-center gap-2">
                      {renderProgressIndicator('hiragana')}
                      <span className="text-sm text-muted-foreground">
                        {Math.round(overallProgress.hiragana)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-vermilion/10 to-vermilion/5 rounded-lg border border-vermilion/20">
                    <span className="font-medium">Katakana</span>
                    <div className="flex items-center gap-2">
                      <JapaneseCharacter character="ア" size="sm" color="text-vermilion" />
                      {renderProgressIndicator('katakana')}
                      <span className="text-sm text-muted-foreground">
                        {Math.round(overallProgress.katakana)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Quick Actions</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handlePracticeStart('hiragana', 'recognition')}
                    className="h-auto flex-col gap-2 p-4"
                  >
                    <GraduationCap size={20} />
                    <span className="text-sm">Learn Hiragana</span>
                  </Button>
                  
                  <Button
                    onClick={() => handlePracticeStart('katakana', 'recognition')}
                    className="h-auto flex-col gap-2 p-4"
                    variant="outline"
                  >
                    <Bookmark size={20} />
                    <span className="text-sm">Learn Katakana</span>
                  </Button>
                  
                  <Link to="/quiz">
                    <Button
                      className="w-full h-auto flex-col gap-2 p-4"
                      variant="outline"
                    >
                      <Book size={20} />
                      <span className="text-sm">Full Quiz</span>
                    </Button>
                  </Link>
                  
                  <Link to="/quick-quiz">
                    <Button
                      className="w-full h-auto flex-col gap-2 p-4"
                    >
                      <Zap size={20} />
                      <span className="text-sm">Quick Quiz</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="learn" className="space-y-6">
            <KanaGrid />
          </TabsContent>

          <TabsContent value="practice" className="space-y-6">
            {practiceMode === 'selection' ? (
              <PracticeSelectionTab onPracticeStart={handlePracticeStart} />
            ) : (
              <PracticeSessionTab
                practiceMode={practiceMode}
                practiceType={practiceType}
                selectedKanaType={selectedKanaType}
                practiceResults={practiceResults}
                onPracticeComplete={handlePracticeComplete}
                onPracticeCancel={handlePracticeCancel}
                onPracticeSimilar={handlePracticeSimilar}
                onPracticeAgain={handlePracticeAgain}
                onFinishPractice={handleFinishPractice}
              />
            )}
          </TabsContent>

          <TabsContent value="stats" className={cn("space-y-6")}>
            <ProgressStatsTab
              userProgress={userProgress}
              overallProgress={overallProgress}
              isLoadingProgress={isLoadingProgress}
              getMostChallenging={getMostChallenging}
              getMostPracticed={getMostPracticed}
              getMostRecentlyPracticed={getMostRecentlyPracticed}
              calculateProficiencyLevel={calculateProficiencyLevel}
              calculateMasteryPercentage={calculateMasteryPercentage}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default KanaLearning;

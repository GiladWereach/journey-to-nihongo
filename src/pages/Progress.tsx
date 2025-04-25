
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { kanaService } from '@/services/kanaModules';
import KanaGrid from '@/components/kana/KanaGrid';
import { KanaType, UserKanaProgress, PracticeResult } from '@/types/kana';
import { Book, PenTool, BookOpen, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProgressHeader from '@/components/progress/ProgressHeader';
import IntroTab from '@/components/progress/tabs/IntroTab';
import PracticeSelectionTab from '@/components/progress/tabs/PracticeSelectionTab';
import PracticeSessionTab from '@/components/progress/tabs/PracticeSessionTab';
import ProgressStatsTab from '@/components/progress/tabs/ProgressStatsTab';
import ProgressIndicator from '@/components/ui/ProgressIndicator';

const Progress = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('intro');
  const [selectedKanaType, setSelectedKanaType] = useState<KanaType | 'all'>('all');
  const [practiceMode, setPracticeMode] = useState<'selection' | 'practice' | 'results'>('selection');
  const [practiceType, setPracticeType] = useState<'recognition' | 'matching'>('recognition');
  const [practiceResults, setPracticeResults] = useState<PracticeResult | null>(null);
  const [userProgress, setUserProgress] = useState<UserKanaProgress[]>([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [overallProgress, setOverallProgress] = useState<{
    all: number;
    hiragana: number;
    katakana: number;
  }>({ all: 0, hiragana: 0, katakana: 0 });

  const hiragana = kanaService.getKanaByType('hiragana');
  const katakana = kanaService.getKanaByType('katakana');
  const allKana = kanaService.getAllKana();

  const navigate = useNavigate();

  // Load user progress
  useEffect(() => {
    if (user) {
      try {
        setIsLoadingProgress(true);
        kanaService.getUserKanaProgress(user.id)
          .then(progress => {
            setUserProgress(progress);
            setIsLoadingProgress(false);
          })
          .catch(error => {
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
          const allProgress = await kanaService.calculateOverallProficiency(user.id, 'all');
          const hiraganaProgress = await kanaService.calculateOverallProficiency(user.id, 'hiragana');
          const katakanaProgress = await kanaService.calculateOverallProficiency(user.id, 'katakana');
          
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

  const calculateProficiencyLevel = (proficiency: number): 'beginner' | 'intermediate' | 'advanced' | 'mastered' => {
    if (proficiency >= 90) return 'mastered';
    if (proficiency >= 70) return 'advanced';
    if (proficiency >= 40) return 'intermediate';
    return 'beginner';
  };

  const calculateMasteryPercentage = (type: KanaType | 'all'): number => {
    if (!userProgress.length) return 0;
    
    let relevantKana;
    if (type === 'all') {
      relevantKana = allKana;
    } else {
      relevantKana = type === 'hiragana' ? hiragana : katakana;
    }
    
    const relevantProgress = userProgress.filter(progress => 
      relevantKana.some(kana => kana.id === progress.character_id)
    );
    
    if (relevantProgress.length === 0) return 0;
    
    const masteredChars = relevantProgress.filter(progress => progress.proficiency >= 90).length;
    return (masteredChars / relevantProgress.length) * 100;
  };

  const getMostChallenging = (): UserKanaProgress[] => {
    if (!userProgress.length) return [];
    
    return [...userProgress]
      .filter(progress => progress.total_practice_count > 0)
      .sort((a, b) => a.proficiency - b.proficiency)
      .slice(0, 5);
  };

  const getMostPracticed = (): UserKanaProgress[] => {
    if (!userProgress.length) return [];
    
    return [...userProgress]
      .sort((a, b) => b.total_practice_count - a.total_practice_count)
      .slice(0, 5);
  };

  const getMostRecentlyPracticed = () => {
    if (!userProgress.length) return [];
    
    return [...userProgress]
      .sort((a, b) => {
        const dateA = typeof a.last_practiced === 'string' 
          ? new Date(a.last_practiced).getTime() 
          : a.last_practiced instanceof Date 
            ? a.last_practiced.getTime() 
            : 0;
        
        const dateB = typeof b.last_practiced === 'string' 
          ? new Date(b.last_practiced).getTime() 
          : b.last_practiced instanceof Date 
            ? b.last_practiced.getTime() 
            : 0;
        
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
      const practiceResults = results.characterResults.map(result => {
        const kanaChar = kanaService.getAllKana().find(k => k.character === result.character);
        if (!kanaChar) return null;
        
        return {
          characterId: kanaChar.id,
          correct: result.correct,
          timestamp: new Date()
        };
      }).filter(Boolean) as Array<{ characterId: string; correct: boolean; timestamp: Date }>;
      
      for (const result of practiceResults) {
        await kanaService.updateProgressFromResults(user.id, result.characterId, result.correct);
      }
      
      const updatedProgress = await kanaService.getUserKanaProgress(user.id);
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
    const progress = type === 'all' 
      ? overallProgress.all
      : type === 'hiragana' 
        ? overallProgress.hiragana 
        : type === 'katakana' 
          ? overallProgress.katakana
          : 0;
    
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
          <TabsList className="grid grid-cols-4 mb-6 sticky top-16 z-40 bg-background/95 backdrop-blur-sm shadow-sm p-1 rounded-lg max-w-md mx-auto">
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
            <TabsTrigger value="progress" className="flex items-center gap-2 rounded-md">
              <BarChart size={16} />
              Progress
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="intro" className="space-y-6 animate-fade-in">
            <IntroTab 
              user={user} 
              setActiveTab={setActiveTab} 
              renderProgressIndicator={renderProgressIndicator}
            />
          </TabsContent>
          
          <TabsContent value="learn" className="space-y-4">
            <KanaGrid 
              kanaList={allKana} 
              userProgress={userProgress}
            />
          </TabsContent>
          
          <TabsContent value="practice" className="space-y-6">
            {practiceMode === 'selection' ? (
              <PracticeSelectionTab 
                onPracticeStart={handlePracticeStart}
                onQuickQuizStart={handleQuickQuizStart}
              />
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
          
          <TabsContent value="progress" className="space-y-8">
            <ProgressStatsTab
              user={user}
              isLoadingProgress={isLoadingProgress}
              userProgress={userProgress}
              hiragana={hiragana}
              katakana={katakana}
              allKana={allKana}
              overallProgress={overallProgress}
              calculateProficiencyLevel={calculateProficiencyLevel}
              calculateMasteryPercentage={calculateMasteryPercentage}
              getMostChallenging={getMostChallenging}
              getMostPracticed={getMostPracticed}
              getMostRecentlyPracticed={getMostRecentlyPracticed}
              setActiveTab={setActiveTab}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Progress;

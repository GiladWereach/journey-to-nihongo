import React, { useState, useEffect, useCallback } from 'react';
import { KanaType, KanaCharacter } from '@/types/kana';
import { Button } from '@/components/ui/button';
import { kanaService } from '@/services/kanaService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';

interface QuizInterfaceProps {
  kanaType: KanaType | 'all';
  onComplete: (correct: number, total: number) => void;
  onCancel: () => void;
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({ kanaType, onComplete, onCancel }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [kanaList, setKanaList] = useState<KanaCharacter[]>([]);
  const [currentKanaIndex, setCurrentKanaIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedKanaType, setSelectedKanaType] = useState<KanaType | 'all'>(kanaType);

  const getKanaByType = useCallback((type: KanaType | 'all'): KanaCharacter[] => {
    if (type === 'all') {
      return kanaService.getAllKana();
    }
    return kanaService.getKanaByType(type);
  }, []);

  const getRandomKana = useCallback(() => {
    const kana = getKanaByType(selectedKanaType);
    return kana.sort(() => Math.random() - 0.5);
  }, [getKanaByType, selectedKanaType]);

  useEffect(() => {
    const fetchUserProgress = async () => {
      setIsLoading(true);
      try {
        if (user) {
          const progress = await kanaService.getUserKanaProgress(user.id);
          setUserProgress(progress);
        }
      } catch (error) {
        console.error('Error fetching user progress:', error);
        toast({
          title: "Error",
          description: "Failed to load progress data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProgress();
  }, [user, toast]);

  useEffect(() => {
    setKanaList(getPrioritizedKana());
  }, [getPrioritizedKana]);

  useEffect(() => {
    if (kanaList.length > 0) {
      generateOptions();
    }
  }, [kanaList, currentKanaIndex]);

  const generateOptions = useCallback(() => {
    if (kanaList.length === 0) return;

    const correctRomaji = kanaList[currentKanaIndex].romaji;
    let newOptions = [correctRomaji];

    const allKana = getKanaByType(selectedKanaType);
    const romajiPool = [...new Set(allKana.map(k => k.romaji))].filter(r => r !== correctRomaji);

    while (newOptions.length < 4 && romajiPool.length > 0) {
      const randomIndex = Math.floor(Math.random() * romajiPool.length);
      const selectedRomaji = romajiPool[randomIndex];

      if (!newOptions.includes(selectedRomaji)) {
        newOptions.push(selectedRomaji);
      }

      romajiPool.splice(randomIndex, 1);
    }

    newOptions = newOptions.sort(() => Math.random() - 0.5);
    setOptions(newOptions);
  }, [kanaList, currentKanaIndex, selectedKanaType, getKanaByType]);

  // Update reference from total_practice_count to match our interface
  const getPrioritizedKana = useCallback(() => {
    if (userProgress.length === 0) return getRandomKana();
    
    // First, get characters with low proficiency or that need review
    const allKana = getKanaByType(selectedKanaType);
    const lowProficiencyKana = allKana
      .filter(kana => {
        const progress = userProgress.find(p => p.character_id === kana.id);
        
        // Filter based on selected kana type
        if (selectedKanaType !== 'all' && kana.type !== selectedKanaType) return false;
        
        // Prioritize characters with low proficiency
        return !progress || progress.proficiency < 70;
      })
      .sort((a, b) => {
        const progressA = userProgress.find(p => p.character_id === a.id);
        const progressB = userProgress.find(p => p.character_id === b.id);
        
        const practiceA = progressA ? progressA.total_practice_count : 0;
        const practiceB = progressB ? progressB.total_practice_count : 0;
        
        // Sort by practice count (less practiced first)
        return practiceA - practiceB;
      });
    
    // If we have enough low proficiency kana, use them
    if (lowProficiencyKana.length >= 5) {
      return lowProficiencyKana.slice(0, 10);
    }
    
    // Otherwise, supplement with random kana
    const randomKana = getRandomKana();
    const combinedKana = [...lowProficiencyKana, ...randomKana]
      .slice(0, 10)
      .sort(() => Math.random() - 0.5);
    
    return combinedKana;
  }, [userProgress, selectedKanaType, getRandomKana, getKanaByType]);

  const handleAnswer = (selectedRomaji: string) => {
    const kanaItem = kanaList[currentKanaIndex];
    const isCorrectSelection = selectedRomaji === kanaItem.romaji;
    setIsCorrect(isCorrectSelection);

    if (isCorrectSelection) {
      setCorrectCount(correctCount + 1);
    }
  };

  const handleNext = () => {
    setIsCorrect(null);

    if (currentKanaIndex < kanaList.length - 1) {
      setCurrentKanaIndex(currentKanaIndex + 1);
    } else {
      onComplete(correctCount, kanaList.length);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-32">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo"></div>
    </div>;
  }

  if (!kanaList || kanaList.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">No Kana Available</h2>
        <p className="text-gray-600 mb-4">
          It seems you have mastered all the kana in this category.
        </p>
        <Button onClick={onCancel}>Go Back</Button>
      </div>
    );
  }

  const kanaItem = kanaList[currentKanaIndex];

  return (
    <div className="space-y-6">
      <div className="mb-4 flex justify-between items-center">
        <Button variant="outline" onClick={onCancel} size="sm">
          Cancel
        </Button>

        <div className="text-center">
          <JapaneseCharacter
            character={kanaItem.character}
            size="lg"
            color={kanaType === 'hiragana' ? 'text-matcha' : kanaType === 'katakana' ? 'text-vermilion' : 'text-indigo'}
            animated={false}
            className="mx-auto mb-2"
          />
          <p className="text-gray-500">
            {currentKanaIndex + 1} / {kanaList.length}
          </p>
        </div>

        <div></div>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {options.map((option, index) => (
          <Button
            key={index}
            onClick={() => handleAnswer(option)}
            disabled={isCorrect !== null}
            className={`transition-all duration-200 border-2 ${
              isCorrect === true && option === kanaItem.romaji
                ? 'bg-green-500 hover:bg-green-700 text-white border-green-600'
                : isCorrect === false && option === kanaItem.romaji
                  ? 'bg-red-500 hover:bg-red-700 text-white border-red-600'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:hover:bg-indigo-700 dark:text-indigo-100 border-indigo-200 dark:border-indigo-700'
                }`}
          >
            {option}
          </Button>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <Button
          onClick={handleNext}
          className="bg-indigo hover:bg-indigo/90"
          disabled={isCorrect === null}
        >
          Next Question
        </Button>
      </div>
    </div>
  );
};

export default QuizInterface;

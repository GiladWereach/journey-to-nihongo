
import React, { useState, useEffect, useCallback } from 'react';
import { KanaType } from '@/types/kana';
import { Button } from '@/components/ui/button';
import { kanaService } from '@/services/kanaService';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseClient } from '@/lib/supabase';
import { calculateNextReviewDate } from '@/lib/utils';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';

export interface PracticeResult {
  correct: number;
  incorrect: number;
  total: number;
  kanaType: KanaType | 'all';
  practiceType: 'recognition' | 'matching';
  accuracy: number;
  totalQuestions: number; 
  correctAnswers: number;
  characterResults: Array<{
    character: string;
    correct: boolean;
  }>;
}

interface KanaPracticeProps {
  kanaType: KanaType | 'all';
  practiceType: 'recognition' | 'matching';
  onComplete: (results: PracticeResult) => void;
  onCancel: () => void;
}

const KanaPractice: React.FC<KanaPracticeProps> = ({ kanaType, practiceType, onComplete, onCancel }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [kanaList, setKanaList] = useState(getKanaByType(kanaType));
  const [currentKanaIndex, setCurrentKanaIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [practiceHistory, setPracticeHistory] = useState<boolean[]>([]);
  const [characterResults, setCharacterResults] = useState<Array<{character: string, correct: boolean}>>([]);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to get kana by type
  function getKanaByType(type: KanaType | 'all') {
    if (type === 'all') {
      return kanaService.getAllKana();
    }
    return kanaService.getKanaByType(type);
  }

  // Helper function to get random kana
  function getRandomKana(type: KanaType | 'all') {
    const kanaArray = getKanaByType(type);
    return kanaArray[Math.floor(Math.random() * kanaArray.length)];
  }

  useEffect(() => {
    if (user) {
      supabaseClient
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', user.id)
        .then(result => {
          if (result.data) {
            setUserProgress(result.data);
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let newKanaList = getKanaByType(kanaType);
    
    // Filter out kana that the user has mastered
    if (user && userProgress.length > 0) {
      newKanaList = newKanaList.filter(kana => {
        const progress = userProgress.find((p: any) => p.character_id === kana.id);
        return !progress || progress.proficiency < 100;
      });
    }

    // Shuffle the list
    newKanaList = [...newKanaList].sort(() => Math.random() - 0.5);
    setKanaList(newKanaList);
  }, [kanaType, user, userProgress]);

  useEffect(() => {
    if (kanaList.length > 0) {
      generateOptions();
    }
  }, [kanaList, currentKanaIndex]);

  const generateOptions = useCallback(() => {
    if (kanaList.length === 0) return;

    const correctRomaji = kanaList[currentKanaIndex].romaji;
    let newOptions = [correctRomaji];

    while (newOptions.length < 4) {
      const randomKana = getRandomKana(kanaType);
      if (randomKana && !newOptions.includes(randomKana.romaji)) {
        newOptions.push(randomKana.romaji);
      }
    }

    // Shuffle the options
    newOptions = newOptions.sort(() => Math.random() - 0.5);
    setOptions(newOptions);
  }, [kanaList, currentKanaIndex, kanaType]);

  const handleAnswer = async (selectedRomaji: string) => {
    const kanaItem = kanaList[currentKanaIndex];
    const isCorrectSelection = selectedRomaji === kanaItem.romaji;
    setIsCorrect(isCorrectSelection);
    setPracticeHistory([...practiceHistory, isCorrectSelection]);
    
    // Update character results
    setCharacterResults([
      ...characterResults,
      { character: kanaItem.character, correct: isCorrectSelection }
    ]);

    if (isCorrectSelection) {
      setCorrectCount(correctCount + 1);
      toast({
        title: "Correct!",
        description: `Great job! ${kanaItem.character} is ${kanaItem.romaji}.`,
      });
    } else {
      setIncorrectCount(incorrectCount + 1);
      toast({
        title: "Incorrect",
        description: `Not quite! ${kanaItem.character} is ${kanaItem.romaji}.`,
        variant: "destructive",
      });
    }

    // Update user progress in Supabase
    if (user) {
      try {
        await updateUserProgress(isCorrectSelection, kanaItem);
      } catch (error) {
        console.error('Error updating user progress:', error);
        toast({
          title: "Error",
          description: "Failed to save progress. Please try again.",
          variant: "destructive",
        });
      }
    }

    // Move to the next kana after a delay
    setTimeout(() => {
      setIsCorrect(null);
      if (currentKanaIndex < kanaList.length - 1) {
        setCurrentKanaIndex(currentKanaIndex + 1);
      } else {
        // Practice completed
        const total = kanaList.length;
        const correct = correctCount + (isCorrectSelection ? 1 : 0);
        const incorrect = incorrectCount + (isCorrectSelection ? 0 : 1);
        const accuracy = total > 0 ? (correct / total) * 100 : 0;
        
        const results: PracticeResult = {
          correct,
          incorrect,
          total,
          kanaType,
          practiceType,
          accuracy,
          totalQuestions: total,
          correctAnswers: correct,
          characterResults: [
            ...characterResults,
            { character: kanaItem.character, correct: isCorrectSelection }
          ],
        };
        onComplete(results);
      }
    }, 750);
  };

  const updateUserProgress = async (isCorrect: boolean, kanaItem: any) => {
    if (!user) return;

    const existingProgress = userProgress.find((p: any) => p.character_id === kanaItem.id);

    if (existingProgress) {
      // Update existing progress
      const updatedMistakeCount = isCorrect
        ? existingProgress.mistake_count
        : existingProgress.mistake_count + 1;

      const updatedTotalPracticeCount = existingProgress.total_practice_count + 1;

      // Calculate new proficiency (simplified example)
      const successRate = (updatedTotalPracticeCount - updatedMistakeCount) / updatedTotalPracticeCount;
      const newProficiency = Math.round(successRate * 100);

      // Update the progress
      await supabaseClient
        .from('user_kana_progress')
        .update({
          proficiency: newProficiency,
          mistake_count: updatedMistakeCount,
          total_practice_count: updatedTotalPracticeCount,
          last_practiced: new Date().toISOString(),
          review_due: calculateNextReviewDate(newProficiency).toISOString()
        })
        .eq('id', existingProgress.id);
    } else {
      // Create new progress entry
      await supabaseClient
        .from('user_kana_progress')
        .insert({
          user_id: user.id,
          character_id: kanaItem.id,
          proficiency: isCorrect ? 100 : 0,
          mistake_count: isCorrect ? 0 : 1,
          total_practice_count: 1,
          last_practiced: new Date().toISOString(),
          review_due: calculateNextReviewDate(isCorrect ? 100 : 0).toISOString()
        });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
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
      <div className="text-center">
        <div className="text-5xl font-bold japanese-text">
          {kanaItem.character}
        </div>
        <p className="text-gray-500">
          {currentKanaIndex + 1} / {kanaList.length}
        </p>
      </div>

      {practiceType === 'recognition' && (
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={isCorrect !== null}
              className={`transition-all duration-200 ${isCorrect === true && option === kanaItem.romaji
                ? 'bg-green-500 hover:bg-green-700 text-white'
                : isCorrect === false && option === kanaItem.romaji
                  ? 'bg-red-500 hover:bg-red-700 text-white'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:hover:bg-indigo-700 dark:text-indigo-100'
                }`}
            >
              {option}
            </Button>
          ))}
        </div>
      )}

      {practiceType === 'matching' && (
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={isCorrect !== null}
              className={`transition-all duration-200 ${isCorrect === true && option === kanaItem.romaji
                ? 'bg-green-500 hover:bg-green-700 text-white'
                : isCorrect === false && option === kanaItem.romaji
                  ? 'bg-red-500 hover:bg-red-700 text-white'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:hover:bg-indigo-700 dark:text-indigo-100'
                }`}
            >
              {option}
            </Button>
          ))}
        </div>
      )}

      {isCorrect !== null && (
        <div className="text-center">
          {isCorrect ? (
            <p className="text-green-500 font-semibold">Correct!</p>
          ) : (
            <p className="text-red-500 font-semibold">Incorrect. The correct answer was {kanaItem.romaji}.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default KanaPractice;

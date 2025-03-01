import React, { useState, useEffect, useCallback } from 'react';
import { KanaType, KanaCharacter } from '@/types/kana';
import { Button } from '@/components/ui/button';
import { kanaService } from '@/services/kanaService';
import { useToast } from '@/hooks/use-toast';
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

// Constants for our spaced repetition system
const MASTERY_CONSECUTIVE_CORRECT = 8; // Consecutive correct answers needed
const INITIAL_INTERVAL_DAYS = 3; // Initial interval after mastering (days)
const INITIAL_INTERVAL_PRACTICES = 8; // Alternative interval measure (# of practices)
const INTERVAL_MULTIPLIER = 1.5; // Multiplier for each subsequent interval
const MISTAKE_PENALTY = 2; // How many percentage points to reduce for mistakes

const KanaPractice: React.FC<KanaPracticeProps> = ({ kanaType, practiceType, onComplete, onCancel }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [kanaList, setKanaList] = useState<KanaCharacter[]>([]);
  const [currentKanaIndex, setCurrentKanaIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [practiceHistory, setPracticeHistory] = useState<boolean[]>([]);
  const [characterResults, setCharacterResults] = useState<Array<{character: string, correct: boolean}>>([]);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{
    show: boolean;
    isCorrect: boolean;
    message: string;
    mnemonic: string;
  }>({ show: false, isCorrect: false, message: '', mnemonic: '' });
  const [showNextButton, setShowNextButton] = useState(false);

  function getKanaByType(type: KanaType | 'all'): KanaCharacter[] {
    if (type === 'all') {
      return kanaService.getAllKana();
    }
    return kanaService.getKanaByType(type);
  }

  useEffect(() => {
    const fetchUserProgress = async () => {
      setIsLoading(true);
      try {
        if (user) {
          const { data, error } = await supabaseClient
            .from('user_kana_progress')
            .select('*')
            .eq('user_id', user.id);
          
          if (error) {
            throw error;
          }
          
          if (data) {
            setUserProgress(data);
          }
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
    let newKanaList = getKanaByType(kanaType);
    
    if (user && userProgress.length > 0) {
      const now = new Date();
      
      // Filter out characters that are in "disappearance" phase and not due for review
      const availableKana = newKanaList.filter(kana => {
        const progress = userProgress.find((p: any) => p.character_id === kana.id);
        
        // If no progress or mastery_level is 0, always include
        if (!progress || !progress.mastery_level) return true;
        
        // If character is in mastery phase, only include if review_due date has passed
        return new Date(progress.review_due) <= now;
      });
      
      // If we have at least some available characters, use them
      if (availableKana.length > 0) {
        newKanaList = availableKana;
      }
      
      // Sort characters by priority (review_due first, then low proficiency)
      newKanaList = newKanaList.sort((a, b) => {
        const progressA = userProgress.find((p: any) => p.character_id === a.id);
        const progressB = userProgress.find((p: any) => p.character_id === b.id);
        
        // If one has review_due and the other doesn't, prioritize the one with review_due
        if (progressA?.review_due && !progressB?.review_due) return -1;
        if (!progressA?.review_due && progressB?.review_due) return 1;
        
        // If both have review_due, compare the dates
        if (progressA?.review_due && progressB?.review_due) {
          return new Date(progressA.review_due).getTime() - new Date(progressB.review_due).getTime();
        }
        
        // Otherwise sort by proficiency
        const proficiencyA = progressA ? progressA.proficiency : 0;
        const proficiencyB = progressB ? progressB.proficiency : 0;
        
        return proficiencyA - proficiencyB;
      });
    }
    
    // Add some randomization while still prioritizing due reviews and lower proficiency characters
    newKanaList = weightedRandomSelection(newKanaList, userProgress);
    
    // Limit to 10 characters for practice
    const practiceSetSize = 10;
    if (newKanaList.length > practiceSetSize) {
      newKanaList = newKanaList.slice(0, practiceSetSize);
    }
    
    setKanaList(newKanaList);
  }, [kanaType, user, userProgress]);

  // Function to select characters with weighted randomization based on proficiency
  const weightedRandomSelection = (kanaList: KanaCharacter[], userProgress: any[]) => {
    // If no progress data, return randomly shuffled list
    if (!userProgress.length) {
      return [...kanaList].sort(() => Math.random() - 0.5);
    }
    
    // Calculate weights for each character
    const weightedList = kanaList.map(kana => {
      const progress = userProgress.find((p: any) => p.character_id === kana.id);
      
      // Characters due for review get highest weight
      if (progress && new Date(progress.review_due) <= new Date()) {
        return { kana, weight: 1.0 }; // Highest weight for due reviews
      }
      
      const proficiency = progress ? progress.proficiency : 0;
      // Lower proficiency = higher weight
      let weight = 0.5;
      
      if (proficiency < 30) {
        weight = 0.8; // High weight for beginners
      } else if (proficiency < 60) {
        weight = 0.6; // Medium weight for intermediate
      } else if (proficiency < 90) {
        weight = 0.4; // Lower weight for advanced
      } else {
        weight = 0.2; // Lowest weight for mastered characters
      }
      
      return { kana, weight };
    });
    
    // Fisher-Yates shuffle with weighted randomization
    const result: KanaCharacter[] = [];
    const shuffled = [...weightedList];
    
    while (shuffled.length > 0) {
      let totalWeight = shuffled.reduce((sum, item) => sum + item.weight, 0);
      let randomWeight = Math.random() * totalWeight;
      let cumulativeWeight = 0;
      
      for (let i = 0; i < shuffled.length; i++) {
        cumulativeWeight += shuffled[i].weight;
        if (randomWeight <= cumulativeWeight) {
          result.push(shuffled[i].kana);
          shuffled.splice(i, 1);
          break;
        }
      }
    }
    
    return result;
  };

  useEffect(() => {
    if (kanaList.length > 0) {
      generateOptions();
    }
  }, [kanaList, currentKanaIndex]);

  const generateOptions = useCallback(() => {
    if (kanaList.length === 0) return;

    const correctRomaji = kanaList[currentKanaIndex].romaji;
    let newOptions = [correctRomaji];

    const allKana = getKanaByType(kanaType);
    
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
  }, [kanaList, currentKanaIndex, kanaType]);

  const generateMnemonic = (kanaItem: KanaCharacter) => {
    if (kanaItem.mnemonic) {
      return kanaItem.mnemonic;
    }

    const simple = {
      a: "Looks like an 'a' with a roof",
      i: "Two short vertical lines, like 'i' without the dot",
      u: "Resembles a horseshoe or 'u' shape",
      e: "Similar to a backward '3', forming an 'e'",
      o: "Circular shape, like the letter 'o'",
      ka: "Looks like a 'k' with an extra line",
      sa: "Three horizontal strokes, think 's' for 'sa'",
      ta: "Cross shape, like 't' in 'ta'",
      na: "Like an 'n' with an extra mark",
      ma: "Three vertical lines, 'm' has three legs in cursive",
      ya: "Resembles a 'y' shape",
      ra: "Like an 'r' with a loop",
      wa: "Circle with a tail, like 'w' in cursive",
      ga: "Like 'ka' with extra dots (voiced 'k' becomes 'g')",
      za: "Like 'sa' with extra marks (voiced 's' becomes 'z')",
      da: "Like 'ta' with extra marks (voiced 't' becomes 'd')",
      ba: "Like 'ha' with a marker (voiced 'h' becomes 'b')",
      pa: "Like 'ha' with a circle marker ('h' with more force becomes 'p')",
      ja: "Like 'sha' with extra marks (voiced 'sh' becomes 'j')"
    };

    return simple[kanaItem.romaji as keyof typeof simple] || 
      `Think of the shape as ${kanaItem.character} for "${kanaItem.romaji}"`;
  };

  const calculateNextReviewInterval = (masteryLevel: number) => {
    // Base interval in days
    let intervalDays = INITIAL_INTERVAL_DAYS;
    
    // Apply multiplier based on mastery level
    // masteryLevel 0 = learning, 1 = first disappearance, 2 = second disappearance, etc.
    if (masteryLevel > 0) {
      for (let i = 1; i < masteryLevel; i++) {
        intervalDays *= INTERVAL_MULTIPLIER;
      }
    }
    
    const now = new Date();
    const nextReview = new Date(now);
    nextReview.setDate(now.getDate() + Math.round(intervalDays));
    
    return nextReview;
  };

  const handleAnswer = async (selectedRomaji: string) => {
    const kanaItem = kanaList[currentKanaIndex];
    const isCorrectSelection = selectedRomaji === kanaItem.romaji;
    setIsCorrect(isCorrectSelection);
    setPracticeHistory([...practiceHistory, isCorrectSelection]);
    
    setCharacterResults([
      ...characterResults,
      { character: kanaItem.character, correct: isCorrectSelection }
    ]);

    if (isCorrectSelection) {
      setCorrectCount(correctCount + 1);
      setFeedback({
        show: true,
        isCorrect: true,
        message: `Great job! ${kanaItem.character} is ${kanaItem.romaji}.`,
        mnemonic: generateMnemonic(kanaItem)
      });
    } else {
      setIncorrectCount(incorrectCount + 1);
      setFeedback({
        show: true,
        isCorrect: false,
        message: `Not quite! ${kanaItem.character} is ${kanaItem.romaji}.`,
        mnemonic: generateMnemonic(kanaItem)
      });
    }

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

    setShowNextButton(true);
  };

  const handleNext = () => {
    setIsCorrect(null);
    setFeedback(prev => ({ ...prev, show: false }));
    setShowNextButton(false);
    
    if (currentKanaIndex < kanaList.length - 1) {
      setCurrentKanaIndex(currentKanaIndex + 1);
    } else {
      const total = kanaList.length;
      const correct = correctCount;
      const incorrect = incorrectCount;
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
        characterResults: characterResults,
      };
      onComplete(results);
    }
  };

  const updateUserProgress = async (isCorrect: boolean, kanaItem: KanaCharacter) => {
    if (!user) return;

    const existingProgress = userProgress.find((p: any) => p.character_id === kanaItem.id);

    if (existingProgress) {
      // Update mistake count and total practice count
      const updatedMistakeCount = isCorrect ? 
        existingProgress.mistake_count : 
        existingProgress.mistake_count + 1;
      const updatedTotalPracticeCount = existingProgress.total_practice_count + 1;
      
      // Update consecutive correct answers
      let consecutiveCorrect = isCorrect ? 
        (existingProgress.consecutive_correct || 0) + 1 : 
        0; // Reset to 0 on mistake
      
      // Check if we need to advance mastery level
      let masteryLevel = existingProgress.mastery_level || 0;
      let newReviewDue = new Date(existingProgress.review_due || new Date());
      
      // If consecutive correct reaches threshold and not already in mastery
      if (consecutiveCorrect >= MASTERY_CONSECUTIVE_CORRECT && masteryLevel === 0) {
        masteryLevel = 1; // First disappearance phase
        newReviewDue = calculateNextReviewInterval(masteryLevel);
      } 
      // If already in mastery and correctly answered during a review
      else if (masteryLevel > 0 && isCorrect && new Date(existingProgress.review_due) <= new Date()) {
        masteryLevel += 1; // Advance to next mastery level
        newReviewDue = calculateNextReviewInterval(masteryLevel);
        consecutiveCorrect = 0; // Reset counter after advancing mastery level
      }
      // If mistake during review of mastered character
      else if (masteryLevel > 0 && !isCorrect && new Date(existingProgress.review_due) <= new Date()) {
        masteryLevel = Math.max(masteryLevel - 1, 0); // Drop one mastery level, but not below 0
        newReviewDue = calculateNextReviewInterval(masteryLevel);
        consecutiveCorrect = 0;
      }
      
      // Calculate new proficiency
      let newProficiency = existingProgress.proficiency;
      
      if (isCorrect) {
        // Small boost for correct answers based on current proficiency
        const boost = Math.max(10 - Math.floor(newProficiency / 10), 2);
        newProficiency = Math.min(newProficiency + boost, 100);
      } else {
        // Larger penalty for mistakes, especially if proficiency is high
        const penalty = MISTAKE_PENALTY + Math.floor(newProficiency / 25); // Higher penalty for more advanced characters
        newProficiency = Math.max(newProficiency - penalty, 0);
        
        // Additional penalty for consecutive mistakes
        if (updatedMistakeCount > 1 && updatedMistakeCount % 3 === 0) {
          newProficiency = Math.max(newProficiency - 5, 0); // Extra penalty for repeated mistakes
        }
      }
      
      // Update the database
      await supabaseClient
        .from('user_kana_progress')
        .update({
          proficiency: newProficiency,
          mistake_count: updatedMistakeCount,
          total_practice_count: updatedTotalPracticeCount,
          consecutive_correct: consecutiveCorrect,
          mastery_level: masteryLevel,
          last_practiced: new Date().toISOString(),
          review_due: newReviewDue.toISOString()
        })
        .eq('id', existingProgress.id);
    } else {
      // First time encountering this character
      const initialProficiency = isCorrect ? 30 : 10; // Starting point based on first attempt
      
      await supabaseClient
        .from('user_kana_progress')
        .insert({
          user_id: user.id,
          character_id: kanaItem.id,
          proficiency: initialProficiency,
          mistake_count: isCorrect ? 0 : 1,
          total_practice_count: 1,
          consecutive_correct: isCorrect ? 1 : 0,
          mastery_level: 0, // Start at learning phase
          last_practiced: new Date().toISOString(),
          review_due: new Date().toISOString() // Immediately available for practice
        });
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

      {feedback.show && (
        <div className={`my-4 p-3 rounded-lg animate-fade-in max-w-md mx-auto ${
          feedback.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
        }`}>
          <p className={`font-semibold text-sm ${
            feedback.isCorrect ? 'text-green-600' : 'text-amber-600'
          }`}>
            {feedback.message}
          </p>
          <div className="mt-1 text-xs text-gray-700">
            <p><strong>Memory Tip:</strong> {feedback.mnemonic}</p>
            {kanaItem.examples && kanaItem.examples.length > 0 && (
              <p className="mt-1">
                <strong>Example:</strong> {kanaItem.examples[0].word} 
                ({kanaItem.examples[0].romaji}) - {kanaItem.examples[0].meaning}
              </p>
            )}
          </div>
        </div>
      )}

      {showNextButton && (
        <div className="flex justify-center mt-4">
          <Button 
            onClick={handleNext}
            className="bg-indigo hover:bg-indigo/90"
          >
            Next Question
          </Button>
        </div>
      )}
    </div>
  );
};

export default KanaPractice;

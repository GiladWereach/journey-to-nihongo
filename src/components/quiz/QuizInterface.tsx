import React, { useState, useEffect, useCallback, useRef } from 'react';
import { KanaType, KanaCharacter } from '@/types/kana';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { kanaService } from '@/services/kanaService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import { QuizCharacterSet, QuizSettings, QuizSessionStats, CharacterResult } from '@/types/quiz';
import { Check, X } from 'lucide-react';

interface QuizInterfaceProps {
  kanaType: KanaType | 'all';
  characterSets?: QuizCharacterSet[];
  settings?: QuizSettings;
  onComplete?: (correct: number, total: number) => void;
  onCancel?: () => void;
  onEndQuiz?: (results: QuizSessionStats) => void;
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({ 
  kanaType, 
  characterSets,
  settings = { speedMode: false, audioFeedback: true, showBasicOnly: false, showPreviouslyLearned: true, showTroubleCharacters: false, characterSize: 'large' },
  onComplete, 
  onCancel,
  onEndQuiz
}) => {
  const handleCompletion = useCallback((correct: number, total: number, characterResults: Array<{character: string, correct: boolean}>) => {
    if (onEndQuiz) {
      const formattedResults: CharacterResult[] = characterResults.map((res, index) => ({
        characterId: `char-${index}`,
        character: res.character,
        romaji: '',
        isCorrect: res.correct,
        attemptCount: 1
      }));
      
      const results: QuizSessionStats = {
        startTime: new Date(),
        endTime: new Date(),
        totalAttempts: total,
        correctCount: correct,
        incorrectCount: total - correct,
        currentStreak: 0,
        longestStreak: currentStreak > longestStreak ? currentStreak : longestStreak,
        accuracy: Math.round((correct / total) * 100),
        characterResults: formattedResults
      };
      onEndQuiz(results);
    } else if (onComplete) {
      onComplete(correct, total);
    }
  }, [onComplete, onEndQuiz]);

  const { user } = useAuth();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [kanaList, setKanaList] = useState<KanaCharacter[]>([]);
  const [currentKanaIndex, setCurrentKanaIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedKanaType, setSelectedKanaType] = useState<KanaType | 'all'>(kanaType);
  const [characterResults, setCharacterResults] = useState<Array<{character: string, correct: boolean}>>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [feedback, setFeedback] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

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

  const getPrioritizedKana = useCallback(() => {
    if (characterSets && characterSets.length > 0) {
      const allCharacters = characterSets.flatMap(set => set.characters);
      const kanaCharacters = allCharacters.map(char => {
        return {
          id: char.id,
          character: char.character,
          romaji: char.romaji,
          type: char.type as KanaType,
          stroke_count: 0,
          stroke_order: [],
          group: char.group || ''
        } as KanaCharacter;
      });
      return kanaCharacters.sort(() => Math.random() - 0.5);
    }

    if (userProgress.length === 0) return getRandomKana();
    
    const allKana = getKanaByType(selectedKanaType);
    const lowProficiencyKana = allKana
      .filter(kana => {
        const progress = userProgress.find(p => p.character_id === kana.id);
        
        if (selectedKanaType !== 'all' && kana.type !== selectedKanaType) return false;
        
        return !progress || progress.proficiency < 70;
      })
      .sort((a, b) => {
        const progressA = userProgress.find(p => p.character_id === a.id);
        const progressB = userProgress.find(p => p.character_id === b.id);
        
        const practiceA = progressA ? progressA.total_practice_count : 0;
        const practiceB = progressB ? progressB.total_practice_count : 0;
        
        return practiceA - practiceB;
      });
    
    if (lowProficiencyKana.length >= 5) {
      return lowProficiencyKana.slice(0, 10);
    }
    
    const randomKana = getRandomKana();
    const combinedKana = [...lowProficiencyKana, ...randomKana]
      .slice(0, 10)
      .sort(() => Math.random() - 0.5);
    
    return combinedKana;
  }, [userProgress, selectedKanaType, getRandomKana, getKanaByType, characterSets]);

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
      if (settings.speedMode && inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [kanaList, currentKanaIndex, settings.speedMode]);

  useEffect(() => {
    if (isCorrect !== null && settings.audioFeedback) {
      const sound = new Audio(isCorrect ? '/sounds/correct.mp3' : '/sounds/incorrect.mp3');
      sound.play().catch(e => console.error('Error playing sound:', e));
    }
  }, [isCorrect, settings.audioFeedback]);

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
    setUserInput('');
    setFeedback({ show: false, message: '' });
  }, [kanaList, currentKanaIndex, selectedKanaType, getKanaByType]);

  const checkAnswer = (selectedRomaji: string) => {
    const kanaItem = kanaList[currentKanaIndex];
    const isCorrectSelection = selectedRomaji.toLowerCase().trim() === kanaItem.romaji.toLowerCase();
    setIsCorrect(isCorrectSelection);

    setCharacterResults([
      ...characterResults,
      { character: kanaItem.character, correct: isCorrectSelection }
    ]);

    if (isCorrectSelection) {
      setCorrectCount(correctCount + 1);
      setCurrentStreak(currentStreak + 1);
      if (currentStreak + 1 > longestStreak) {
        setLongestStreak(currentStreak + 1);
      }
      
      if (settings.speedMode) {
        setFeedback({ 
          show: true, 
          message: "Correct!" 
        });
        
        setTimeout(() => {
          handleNext();
        }, 500);
      }
    } else {
      setCurrentStreak(0);
      setFeedback({ 
        show: true, 
        message: `Incorrect. The correct answer is "${kanaItem.romaji}".` 
      });
    }
  };

  const handleMultipleChoiceAnswer = (selectedRomaji: string) => {
    checkAnswer(selectedRomaji);
  };

  const handleTypeAnswer = () => {
    checkAnswer(userInput);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
    
    if (settings.speedMode && kanaList.length && 
        value.toLowerCase().trim() === kanaList[currentKanaIndex].romaji.toLowerCase()) {
      checkAnswer(value);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userInput.trim()) {
      handleTypeAnswer();
    }
  };

  const handleNext = () => {
    setIsCorrect(null);
    setFeedback({ show: false, message: '' });
    setUserInput('');

    if (currentKanaIndex < kanaList.length - 1) {
      setCurrentKanaIndex(currentKanaIndex + 1);
      
      setTimeout(() => {
        if (settings.speedMode && inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
    } else {
      handleCompletion(correctCount, kanaList.length, characterResults);
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

      {settings.speedMode ? (
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500 mb-2">Type the romaji for this character:</p>
            <div className="w-full flex space-x-2">
              <Input 
                ref={inputRef}
                type="text" 
                value={userInput} 
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                placeholder="Type romaji here..."
                disabled={isCorrect !== null}
                className="flex-1"
                autoComplete="off"
                autoFocus
              />
              <Button 
                onClick={handleTypeAnswer} 
                disabled={!userInput.trim() || isCorrect !== null}
              >
                Check
              </Button>
            </div>
          </div>
          
          {feedback.show && (
            <div className={`p-3 rounded-md text-center ${
              isCorrect ? 'bg-green-50 border border-green-200 text-green-700' : 
              'bg-red-50 border border-red-200 text-red-700'
            }`}>
              <div className="flex items-center justify-center gap-2">
                {isCorrect ? 
                  <Check className="h-4 w-4" /> : 
                  <X className="h-4 w-4" />
                }
                <p>{feedback.message}</p>
              </div>
            </div>
          )}
          
          {isCorrect === false && (
            <div className="text-center">
              <Button onClick={handleNext}>
                Next Question
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleMultipleChoiceAnswer(option)}
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
      )}
    </div>
  );
};

export default QuizInterface;

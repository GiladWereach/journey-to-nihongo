
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Check, X, Pause, Play, SkipForward, AlertTriangle } from 'lucide-react';
import { KanaType, QuizCharacterSet, QuizSettings, QuizCharacter, QuizSessionStats, CharacterResult } from '@/types/quiz';
import { quizService } from '@/services/quizService';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';

interface QuizInterfaceProps {
  kanaType: KanaType;
  characterSets: QuizCharacterSet[];
  settings: QuizSettings;
  onEndQuiz: (results: QuizSessionStats) => void;
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({ 
  kanaType, 
  characterSets,
  settings,
  onEndQuiz 
}) => {
  const { user } = useAuth();
  const [quizCharacters, setQuizCharacters] = useState<QuizCharacter[]>([]);
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [showHint, setShowHint] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sessionStats, setSessionStats] = useState<QuizSessionStats>({
    startTime: new Date(),
    endTime: null,
    totalAttempts: 0,
    correctCount: 0,
    incorrectCount: 0,
    currentStreak: 0,
    longestStreak: 0,
    accuracy: 0,
    characterResults: [],
  });
  
  const [pendingProgressUpdates, setPendingProgressUpdates] = useState<Array<{
    characterId: string;
    isCorrect: boolean;
  }>>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const correctAudioRef = useRef<HTMLAudioElement>(null);
  const incorrectAudioRef = useRef<HTMLAudioElement>(null);
  
  const updateTimerRef = useRef<number | null>(null);
  
  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        const allCharacters = characterSets.flatMap(set => set.characters);
        
        let filteredCharacters = [...allCharacters];
        
        if (settings.showBasicOnly) {
          filteredCharacters = filteredCharacters.filter(char => !char.isDakuten && !char.isHandakuten);
        }
        
        if (user) {
          const userProgress = await quizService.getUserKanaProgress(user.id, kanaType);
          
          if (!settings.showPreviouslyLearned) {
            filteredCharacters = filteredCharacters.filter(char => {
              const progress = userProgress.find(p => p.character_id === char.id);
              return !progress || progress.total_practice_count === 0;
            });
          }
          
          if (settings.showTroubleCharacters) {
            filteredCharacters.sort((a, b) => {
              const progressA = userProgress.find(p => p.character_id === a.id);
              const progressB = userProgress.find(p => p.character_id === b.id);
              
              const accuracyA = progressA ? progressA.proficiency : 100;
              const accuracyB = progressB ? progressB.proficiency : 100;
              
              return accuracyA - accuracyB;
            });
          }
        }
        
        if (filteredCharacters.length === 0) {
          filteredCharacters = allCharacters;
        }
        
        for (let i = filteredCharacters.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [filteredCharacters[i], filteredCharacters[j]] = [filteredCharacters[j], filteredCharacters[i]];
        }
        
        setQuizCharacters(filteredCharacters);
        
        setSessionStats({
          startTime: new Date(),
          endTime: null,
          totalAttempts: 0,
          correctCount: 0,
          incorrectCount: 0,
          currentStreak: 0,
          longestStreak: 0,
          accuracy: 0,
          characterResults: [],
        });
        
        if (inputRef.current) {
          inputRef.current.focus();
        }
      } catch (error) {
        console.error('Error initializing quiz:', error);
      }
    };
    
    initializeQuiz();
    
    if (user) {
      const batchUpdateProgress = async () => {
        if (pendingProgressUpdates.length > 0) {
          console.log(`Batch updating ${pendingProgressUpdates.length} progress items`);
          
          const updates = [...pendingProgressUpdates];
          setPendingProgressUpdates([]);
          
          try {
            await Promise.all(updates.map(update => 
              quizService.updateKanaProgress(user.id, update.characterId, update.isCorrect)
            ));
          } catch (error) {
            console.error('Error batch updating progress:', error);
            setPendingProgressUpdates(prev => [...prev, ...updates]);
          }
        }
      };
      
      updateTimerRef.current = window.setInterval(batchUpdateProgress, 5000);
      
      return () => {
        if (updateTimerRef.current) {
          clearInterval(updateTimerRef.current);
        }
        
        batchUpdateProgress();
      };
    }
  }, [kanaType, characterSets, settings, user]);
  
  useEffect(() => {
    if (!isPaused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isPaused, currentCharacterIndex, feedback]);
  
  const currentCharacter = quizCharacters[currentCharacterIndex];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    setInput(newInput);
    
    if (settings.speedMode && currentCharacter && !isPaused && !isTransitioning) {
      const userAnswer = newInput.trim().toLowerCase();
      const correctAnswer = currentCharacter.romaji.toLowerCase();
      
      if (userAnswer === correctAnswer) {
        handleCorrectAnswer();
        return;
      }
      
      if (userAnswer.length === correctAnswer.length && userAnswer !== correctAnswer) {
        handleWrongAnswer();
        return;
      }
      
      if (userAnswer.length > correctAnswer.length) {
        handleWrongAnswer();
        return;
      }
      
      if (userAnswer.length >= 2 && !correctAnswer.startsWith(userAnswer)) {
        handleWrongAnswer();
        return;
      }
    }
  };
  
  const handleCorrectAnswer = () => {
    if (!currentCharacter || isPaused || isTransitioning) return;
    
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    
    const newStats = { ...sessionStats };
    newStats.totalAttempts++;
    newStats.correctCount++;
    newStats.currentStreak++;
    
    if (newStats.currentStreak > newStats.longestStreak) {
      newStats.longestStreak = newStats.currentStreak;
    }
    
    if (settings.audioFeedback && correctAudioRef.current) {
      correctAudioRef.current.play().catch(err => console.error('Failed to play audio:', err));
    }
    
    // Create a new character result for this answer
    const newResult: CharacterResult = {
      characterId: currentCharacter.id,
      character: currentCharacter.character,
      romaji: currentCharacter.romaji,
      isCorrect: true,
      attemptCount: newAttemptCount,
    };
    
    // Add the result to our session stats
    newStats.characterResults = [...newStats.characterResults, newResult];
    
    if (user) {
      setPendingProgressUpdates(prev => [...prev, {
        characterId: currentCharacter.id,
        isCorrect: true
      }]);
    }
    
    newStats.accuracy = Math.round((newStats.correctCount / (newStats.correctCount + newStats.incorrectCount)) * 100);
    setSessionStats(newStats);
    setFeedback('correct');
    setIsTransitioning(true);
    
    setTimeout(() => {
      setInput('');
      setFeedback('none');
      setShowHint(false);
      setAttemptCount(0);
      moveToNextCharacter();
      setIsTransitioning(false);
      
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 250);
  };
  
  const handleWrongAnswer = () => {
    if (!currentCharacter || isPaused || isTransitioning) return;
    
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    
    const newStats = { ...sessionStats };
    newStats.totalAttempts++;
    newStats.incorrectCount++;
    newStats.currentStreak = 0;
    
    if (settings.audioFeedback && incorrectAudioRef.current) {
      incorrectAudioRef.current.play().catch(err => console.error('Failed to play audio:', err));
    }
    
    setFeedback('incorrect');
    
    if (settings.speedMode && newAttemptCount >= 3) {
      setShowHint(true);
      setIsTransitioning(true);
      
      // Create a new character result for this answer
      const newResult: CharacterResult = {
        characterId: currentCharacter.id,
        character: currentCharacter.character,
        romaji: currentCharacter.romaji,
        isCorrect: false,
        attemptCount: newAttemptCount,
      };
      
      // Add the result to our session stats
      newStats.characterResults = [...newStats.characterResults, newResult];
      
      if (user) {
        setPendingProgressUpdates(prev => [...prev, {
          characterId: currentCharacter.id,
          isCorrect: false
        }]);
      }
      
      setTimeout(() => {
        setInput('');
        setFeedback('none');
        setShowHint(false);
        setAttemptCount(0);
        moveToNextCharacter();
        setIsTransitioning(false);
        
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 1500);
    } else if (!settings.speedMode && newAttemptCount >= 3) {
      setShowHint(true);
      setIsTransitioning(true);
      
      // Create a new character result for this answer
      const newResult: CharacterResult = {
        characterId: currentCharacter.id,
        character: currentCharacter.character,
        romaji: currentCharacter.romaji,
        isCorrect: false,
        attemptCount: newAttemptCount,
      };
      
      // Add the result to our session stats
      newStats.characterResults = [...newStats.characterResults, newResult];
      
      if (user) {
        setPendingProgressUpdates(prev => [...prev, {
          characterId: currentCharacter.id,
          isCorrect: false
        }]);
      }
      
      setTimeout(() => {
        setInput('');
        setFeedback('none');
        setShowHint(false);
        setAttemptCount(0);
        moveToNextCharacter();
        setIsTransitioning(false);
        
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 1500);
    } else {
      setTimeout(() => {
        setInput('');
        setFeedback('none');
        
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 500);
    }
    
    newStats.accuracy = Math.round((newStats.correctCount / (newStats.correctCount + newStats.incorrectCount)) * 100);
    setSessionStats(newStats);
  };
  
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!currentCharacter || input.trim() === '' || isPaused || isTransitioning) return;
    
    const userAnswer = input.trim().toLowerCase();
    const correctAnswer = currentCharacter.romaji.toLowerCase();
    const isCorrect = userAnswer === correctAnswer;
    
    if (isCorrect) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }
  };
  
  const moveToNextCharacter = () => {
    if (currentCharacterIndex >= quizCharacters.length - 1) {
      // We've gone through all the characters, end the quiz
      handleEndQuiz();
      return;
    }
    
    const nextIndex = currentCharacterIndex + 1;
    setCurrentCharacterIndex(nextIndex);
  };
  
  const handleEndQuiz = async () => {
    const endTime = new Date();
    const finalStats = {
      ...sessionStats,
      endTime,
      durationSeconds: Math.round((endTime.getTime() - sessionStats.startTime.getTime()) / 1000),
    };
    
    // Make sure accuracy is calculated correctly
    finalStats.accuracy = Math.round((finalStats.correctCount / Math.max(finalStats.correctCount + finalStats.incorrectCount, 1)) * 100);
    
    if (user && pendingProgressUpdates.length > 0) {
      try {
        await Promise.all(pendingProgressUpdates.map(update => 
          quizService.updateKanaProgress(user.id, update.characterId, update.isCorrect)
        ));
        
        setPendingProgressUpdates([]);
      } catch (error) {
        console.error('Error updating progress before ending quiz:', error);
      }
    }
    
    if (updateTimerRef.current) {
      clearInterval(updateTimerRef.current);
    }
    
    if (user) {
      try {
        await quizService.recordQuizSession(user.id, {
          kanaType,
          characterIds: quizCharacters.map(char => char.id),
          startTime: sessionStats.startTime,
          endTime,
          correctCount: finalStats.correctCount,
          totalAttempts: finalStats.totalAttempts,
          streak: finalStats.currentStreak
        });
      } catch (error) {
        console.error('Error recording quiz session:', error);
      }
    }
    
    console.log("Ending quiz with results:", finalStats);
    onEndQuiz(finalStats);
  };
  
  const togglePause = () => {
    setIsPaused(!isPaused);
    
    if (isPaused && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };
  
  const characterSizeMap = {
    small: 'md',
    medium: 'lg',
    large: 'xl',
  } as const;
  
  const getSimilarCharacters = () => {
    if (!currentCharacter) return [];
    
    return quizCharacters
      .filter(char => 
        char.id !== currentCharacter.id && 
        (char.romaji[0] === currentCharacter.romaji[0] || 
         Math.abs(char.romaji.length - currentCharacter.romaji.length) <= 1)
      )
      .slice(0, 3);
  };
  
  if (!currentCharacter || quizCharacters.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={togglePause}
            className="text-xs sm:text-sm"
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <span className="text-xs sm:text-sm text-muted-foreground">
              {sessionStats.correctCount} / {quizCharacters.length}
            </span>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleEndQuiz}
          className="text-vermilion text-xs sm:text-sm border-vermilion/50 hover:bg-vermilion/10"
        >
          End Quiz
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <Card className={`overflow-hidden border-2 transition-colors duration-150 ${
          feedback === 'correct' ? 'border-matcha bg-matcha/5' : 
          feedback === 'incorrect' ? 'border-vermilion bg-vermilion/5' : 
          kanaType === 'hiragana' ? 'border-matcha/40' : 'border-vermilion/40'
        }`}>
          <CardContent className="pt-4 pb-4 sm:pt-6 sm:pb-6">
            <div className="flex flex-col items-center">
              <div className="flex justify-center items-center mb-4 sm:mb-6 relative">
                <div className="absolute top-0 -mt-8 sm:-mt-10 w-full max-w-xs">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-indigo">{sessionStats.correctCount} correct</span>
                    <span className="text-muted-foreground">{Math.round((sessionStats.correctCount / Math.max(sessionStats.correctCount + sessionStats.incorrectCount, 1)) * 100)}% accuracy</span>
                  </div>
                  <Progress 
                    value={(sessionStats.currentStreak / 10) * 100} 
                    className={`h-1 bg-gray-100 ${kanaType === 'hiragana' ? 'bg-matcha' : 'bg-vermilion'}`}
                  />
                </div>
                
                <div className={`flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 rounded-full transition-colors ${
                  feedback === 'correct' ? 'bg-matcha/10' : 
                  feedback === 'incorrect' ? 'bg-vermilion/10' : 
                  kanaType === 'hiragana' ? 'bg-matcha/5' : 'bg-vermilion/5'
                }`}>
                  <JapaneseCharacter 
                    character={currentCharacter.character} 
                    size={characterSizeMap[settings.characterSize] || 'xl'} 
                    color={feedback === 'correct' ? 'text-matcha' : 
                           feedback === 'incorrect' ? 'text-vermilion' : 
                           kanaType === 'hiragana' ? 'text-matcha' : 'text-vermilion'}
                  />
                </div>
                
                {feedback !== 'none' && (
                  <div className="absolute top-0 right-0 -mt-4 -mr-4">
                    {feedback === 'correct' ? (
                      <div className="bg-matcha text-white rounded-full p-1 sm:p-2">
                        <Check size={16} className="sm:w-5 sm:h-5" />
                      </div>
                    ) : (
                      <div className="bg-vermilion text-white rounded-full p-1 sm:p-2">
                        <X size={16} className="sm:w-5 sm:h-5" />
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {sessionStats.currentStreak > 0 && (
                <div className="mb-3 sm:mb-4">
                  <span className="text-xs sm:text-sm font-medium text-indigo">
                    Streak: {sessionStats.currentStreak}
                    {sessionStats.currentStreak >= 5 && ' 🔥'}
                  </span>
                </div>
              )}
              
              {showHint && (
                <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-indigo/5 border border-indigo/20 rounded-md w-full max-w-md">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <AlertTriangle size={14} className="text-indigo sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">The correct answer is:</span>
                  </div>
                  <div className="flex justify-center items-center gap-2 sm:gap-4">
                    <span className="text-base sm:text-lg font-bold japanese-text">{currentCharacter.character}</span>
                    <span className="text-base sm:text-lg">=</span>
                    <span className="text-base sm:text-lg font-bold">{currentCharacter.romaji}</span>
                  </div>
                  
                  {getSimilarCharacters().length > 0 && (
                    <div className="mt-1 sm:mt-2 pt-1 sm:pt-2 border-t border-indigo/10">
                      <span className="text-2xs sm:text-xs text-muted-foreground">Similar characters:</span>
                      <div className="flex justify-center gap-3 sm:gap-4 mt-1">
                        {getSimilarCharacters().map(char => (
                          <div key={char.id} className="text-center">
                            <div className="text-sm sm:text-md japanese-text">{char.character}</div>
                            <div className="text-2xs sm:text-xs">{char.romaji}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="w-full max-w-md">
                <div className="flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter romaji..."
                    value={input}
                    onChange={handleInputChange}
                    className={`text-center text-base sm:text-lg ${isPaused || isTransitioning ? 'bg-gray-100' : ''} 
                      border-2 ${kanaType === 'hiragana' ? 'focus:border-matcha' : 'focus:border-vermilion'}`}
                    disabled={isPaused || showHint || isTransitioning}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                  
                  {!settings.speedMode && (
                    <Button 
                      type="submit" 
                      disabled={isPaused || showHint || input.trim() === '' || isTransitioning}
                      className={kanaType === 'hiragana' ? 'bg-matcha hover:bg-matcha/90' : 'bg-vermilion hover:bg-vermilion/90'}
                    >
                      Check
                    </Button>
                  )}
                </div>
              </form>
              
              {!settings.speedMode && attemptCount > 0 && attemptCount < 3 && feedback === 'none' && (
                <div className="mt-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Attempt {attemptCount + 1} of 3
                  </span>
                </div>
              )}
              
              <div className="mt-3 sm:mt-4 flex justify-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (isTransitioning) return;
                    setIsTransitioning(true);
                    setInput('');
                    setFeedback('none');
                    setShowHint(false);
                    setAttemptCount(0);
                    
                    setTimeout(() => {
                      moveToNextCharacter();
                      setIsTransitioning(false);
                    }, 100);
                  }}
                  disabled={isPaused || isTransitioning}
                  className="text-xs sm:text-sm border-indigo/30 hover:bg-indigo/5"
                >
                  <SkipForward size={14} className="mr-1 sm:w-4 sm:h-4" />
                  Skip
                </Button>
              </div>
              
              {settings.speedMode && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Speed Mode: Type the correct romaji to advance automatically
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <audio ref={correctAudioRef} src="/sounds/correct.mp3" className="hidden" />
      <audio ref={incorrectAudioRef} src="/sounds/incorrect.mp3" className="hidden" />
    </div>
  );
};

export default QuizInterface;

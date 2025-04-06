import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Check, X, Pause, Play, SkipForward, AlertTriangle } from 'lucide-react';
import { KanaType, QuizCharacterSet, QuizSettings, QuizCharacter, QuizSessionStats } from '@/types/quiz';
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
  
  const inputRef = useRef<HTMLInputElement>(null);
  const correctAudioRef = useRef<HTMLAudioElement>(null);
  const incorrectAudioRef = useRef<HTMLAudioElement>(null);
  
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
    
    if (settings.speedMode && currentCharacter && !isPaused) {
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
  
  const handleCorrectAnswer = async () => {
    if (!currentCharacter || isPaused) return;
    
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
    
    newStats.characterResults.push({
      characterId: currentCharacter.id,
      character: currentCharacter.character,
      romaji: currentCharacter.romaji,
      isCorrect: true,
      attemptCount: newAttemptCount,
    });
    
    if (user) {
      try {
        await quizService.updateKanaProgress(user.id, currentCharacter.id, true);
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
    
    newStats.accuracy = Math.round((newStats.correctCount / newStats.totalAttempts) * 100);
    setSessionStats(newStats);
    setFeedback('correct');
    
    setTimeout(() => {
      setInput('');
      setFeedback('none');
      setShowHint(false);
      setAttemptCount(0);
      moveToNextCharacter();
      
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 250);
  };
  
  const handleWrongAnswer = async () => {
    if (!currentCharacter || isPaused) return;
    
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
      
      newStats.characterResults.push({
        characterId: currentCharacter.id,
        character: currentCharacter.character,
        romaji: currentCharacter.romaji,
        isCorrect: false,
        attemptCount: newAttemptCount,
      });
      
      if (user) {
        try {
          await quizService.updateKanaProgress(user.id, currentCharacter.id, false);
        } catch (error) {
          console.error('Error updating progress:', error);
        }
      }
      
      setTimeout(() => {
        setInput('');
        setFeedback('none');
        setShowHint(false);
        setAttemptCount(0);
        moveToNextCharacter();
        
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 1500);
    } else if (!settings.speedMode && newAttemptCount >= 3) {
      setShowHint(true);
      
      newStats.characterResults.push({
        characterId: currentCharacter.id,
        character: currentCharacter.character,
        romaji: currentCharacter.romaji,
        isCorrect: false,
        attemptCount: newAttemptCount,
      });
      
      if (user) {
        try {
          await quizService.updateKanaProgress(user.id, currentCharacter.id, false);
        } catch (error) {
          console.error('Error updating progress:', error);
        }
      }
      
      setTimeout(() => {
        setInput('');
        setFeedback('none');
        setShowHint(false);
        setAttemptCount(0);
        moveToNextCharacter();
        
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
    
    newStats.accuracy = Math.round((newStats.correctCount / newStats.totalAttempts) * 100);
    setSessionStats(newStats);
  };
  
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!currentCharacter || input.trim() === '' || isPaused) return;
    
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
    const nextIndex = (currentCharacterIndex + 1) % quizCharacters.length;
    setCurrentCharacterIndex(nextIndex);
  };
  
  const handleEndQuiz = async () => {
    const endTime = new Date();
    const finalStats = {
      ...sessionStats,
      endTime,
      durationSeconds: Math.round((endTime.getTime() - sessionStats.startTime.getTime()) / 1000),
    };
    
    if (user) {
      try {
        await quizService.recordQuizSession(user.id, {
          kanaType,
          characterIds: quizCharacters.map(char => char.id),
          startTime: sessionStats.startTime,
          endTime,
          correctCount: sessionStats.correctCount,
          totalAttempts: sessionStats.totalAttempts,
          streak: sessionStats.currentStreak
        });
      } catch (error) {
        console.error('Error recording quiz session:', error);
      }
    }
    
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
          className="text-red-500 text-xs sm:text-sm"
        >
          End Quiz
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <Card className={`overflow-hidden ${feedback === 'correct' ? 'border-green-500 bg-green-50' : feedback === 'incorrect' ? 'border-red-500 bg-red-50' : ''}`}>
          <CardContent className="pt-4 pb-4 sm:pt-6 sm:pb-6">
            <div className="flex flex-col items-center">
              <div className="flex justify-center items-center mb-4 sm:mb-6 relative">
                <div className="absolute top-0 -mt-8 sm:-mt-10 w-full max-w-xs">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span>{sessionStats.correctCount} correct</span>
                    <span>{Math.round((sessionStats.correctCount / Math.max(sessionStats.totalAttempts, 1)) * 100)}% accuracy</span>
                  </div>
                  <Progress value={sessionStats.currentStreak} max={10} className="h-1" />
                </div>
                
                <div className={`flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 rounded-full ${feedback === 'correct' ? 'bg-green-100' : feedback === 'incorrect' ? 'bg-red-100' : 'bg-muted'}`}>
                  <JapaneseCharacter 
                    character={currentCharacter.character} 
                    size={characterSizeMap[settings.characterSize] || 'xl'} 
                    color={feedback === 'correct' ? 'text-green-600' : feedback === 'incorrect' ? 'text-red-600' : kanaType === 'hiragana' ? 'text-matcha' : 'text-vermilion'}
                  />
                </div>
                
                {feedback !== 'none' && (
                  <div className="absolute top-0 right-0 -mt-4 -mr-4">
                    {feedback === 'correct' ? (
                      <div className="bg-green-500 text-white rounded-full p-1 sm:p-2">
                        <Check size={16} className="sm:w-5 sm:h-5" />
                      </div>
                    ) : (
                      <div className="bg-red-500 text-white rounded-full p-1 sm:p-2">
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
                <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-amber-50 border border-amber-200 rounded-md w-full max-w-md">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <AlertTriangle size={14} className="text-amber-500 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">The correct answer is:</span>
                  </div>
                  <div className="flex justify-center items-center gap-2 sm:gap-4">
                    <span className="text-base sm:text-lg font-bold">{currentCharacter.character}</span>
                    <span className="text-base sm:text-lg">=</span>
                    <span className="text-base sm:text-lg font-bold">{currentCharacter.romaji}</span>
                  </div>
                  
                  {getSimilarCharacters().length > 0 && (
                    <div className="mt-1 sm:mt-2 pt-1 sm:pt-2 border-t border-amber-200">
                      <span className="text-2xs sm:text-xs text-muted-foreground">Similar characters:</span>
                      <div className="flex justify-center gap-3 sm:gap-4 mt-1">
                        {getSimilarCharacters().map(char => (
                          <div key={char.id} className="text-center">
                            <div className="text-sm sm:text-md">{char.character}</div>
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
                    className={`text-center text-base sm:text-lg ${isPaused ? 'bg-gray-100' : ''}`}
                    disabled={isPaused || showHint}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                  
                  {!settings.speedMode && (
                    <Button 
                      type="submit" 
                      disabled={isPaused || showHint || input.trim() === ''}
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
                    setInput('');
                    setFeedback('none');
                    setShowHint(false);
                    setAttemptCount(0);
                    moveToNextCharacter();
                  }}
                  disabled={isPaused}
                  className="text-xs sm:text-sm"
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

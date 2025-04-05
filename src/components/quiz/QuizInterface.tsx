
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
  
  // Initialize quiz with characters from selected sets
  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        // Merge all characters from selected sets
        const allCharacters = characterSets.flatMap(set => set.characters);
        
        // Filter based on settings if needed
        let filteredCharacters = [...allCharacters];
        
        if (settings.showBasicOnly) {
          filteredCharacters = filteredCharacters.filter(char => !char.isDakuten && !char.isHandakuten);
        }
        
        // Apply user-specific filters if logged in
        if (user) {
          const userProgress = await quizService.getUserKanaProgress(user.id, kanaType);
          
          if (!settings.showPreviouslyLearned) {
            filteredCharacters = filteredCharacters.filter(char => {
              const progress = userProgress.find(p => p.character_id === char.id);
              return !progress || progress.total_practice_count === 0;
            });
          }
          
          if (settings.showTroubleCharacters) {
            // Prioritize characters with low accuracy
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
          // If no characters match filters, use all characters
          filteredCharacters = allCharacters;
        }
        
        // Randomize character order using Fisher-Yates shuffle
        for (let i = filteredCharacters.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [filteredCharacters[i], filteredCharacters[j]] = [filteredCharacters[j], filteredCharacters[i]];
        }
        
        setQuizCharacters(filteredCharacters);
        
        // Initialize session stats
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
        
        // Focus input field
        if (inputRef.current) {
          inputRef.current.focus();
        }
      } catch (error) {
        console.error('Error initializing quiz:', error);
      }
    };
    
    initializeQuiz();
  }, [kanaType, characterSets, settings, user]);
  
  // Current character being tested
  const currentCharacter = quizCharacters[currentCharacterIndex];
  
  // Handle user input submission
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!currentCharacter || input.trim() === '' || isPaused) return;
    
    const userAnswer = input.trim().toLowerCase();
    const correctAnswer = currentCharacter.romaji.toLowerCase();
    const isCorrect = userAnswer === correctAnswer;
    
    // Update attempt count
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    
    // Update session stats
    const newStats = { ...sessionStats };
    newStats.totalAttempts++;
    
    if (isCorrect) {
      // Correct answer
      setFeedback('correct');
      newStats.correctCount++;
      newStats.currentStreak++;
      
      if (newStats.currentStreak > newStats.longestStreak) {
        newStats.longestStreak = newStats.currentStreak;
      }
      
      // Play correct sound
      if (settings.audioFeedback && correctAudioRef.current) {
        correctAudioRef.current.play().catch(err => console.error('Failed to play audio:', err));
      }
      
      // Update character results
      newStats.characterResults.push({
        characterId: currentCharacter.id,
        character: currentCharacter.character,
        romaji: currentCharacter.romaji,
        isCorrect: true,
        attemptCount: newAttemptCount,
      });
      
      // Update user progress if signed in
      if (user) {
        try {
          await quizService.updateKanaProgress(user.id, currentCharacter.id, true);
        } catch (error) {
          console.error('Error updating progress:', error);
        }
      }
      
      // Reset state and move to next character after delay
      setTimeout(() => {
        setInput('');
        setFeedback('none');
        setShowHint(false);
        setAttemptCount(0);
        moveToNextCharacter();
        
        // Focus input field
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 1000);
    } else {
      // Incorrect answer
      setFeedback('incorrect');
      newStats.incorrectCount++;
      newStats.currentStreak = 0;
      
      // Play incorrect sound
      if (settings.audioFeedback && incorrectAudioRef.current) {
        incorrectAudioRef.current.play().catch(err => console.error('Failed to play audio:', err));
      }
      
      // Show hint after 3 incorrect attempts
      if (newAttemptCount >= 3) {
        setShowHint(true);
        
        // Update character results
        newStats.characterResults.push({
          characterId: currentCharacter.id,
          character: currentCharacter.character,
          romaji: currentCharacter.romaji,
          isCorrect: false,
          attemptCount: newAttemptCount,
        });
        
        // Update user progress if signed in
        if (user) {
          try {
            await quizService.updateKanaProgress(user.id, currentCharacter.id, false);
          } catch (error) {
            console.error('Error updating progress:', error);
          }
        }
        
        // Move to next character after showing hint
        setTimeout(() => {
          setInput('');
          setFeedback('none');
          setShowHint(false);
          setAttemptCount(0);
          moveToNextCharacter();
          
          // Focus input field
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 3000);
      } else {
        // Reset input for another attempt
        setTimeout(() => {
          setInput('');
          setFeedback('none');
          
          // Focus input field
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 1000);
      }
    }
    
    // Calculate accuracy
    newStats.accuracy = Math.round((newStats.correctCount / newStats.totalAttempts) * 100);
    setSessionStats(newStats);
  };
  
  // Move to next character
  const moveToNextCharacter = () => {
    const nextIndex = (currentCharacterIndex + 1) % quizCharacters.length;
    setCurrentCharacterIndex(nextIndex);
  };
  
  // Handle end quiz
  const handleEndQuiz = () => {
    const endTime = new Date();
    const finalStats = {
      ...sessionStats,
      endTime,
      durationSeconds: Math.round((endTime.getTime() - sessionStats.startTime.getTime()) / 1000),
    };
    
    onEndQuiz(finalStats);
  };
  
  // Handle pause/resume
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  // Character size mapping
  const characterSizeMap = {
    small: 'md',
    medium: 'lg',
    large: 'xl',
  } as const;
  
  // Get similar characters for hints
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
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={togglePause}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm font-medium">Set:</span>
            <span className="text-sm text-muted-foreground">{characterSets.map(s => s.name).join(', ')}</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm font-medium">Progress:</span>
            <span className="text-sm text-muted-foreground">
              {sessionStats.totalAttempts} attempted
            </span>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleEndQuiz}
          className="text-red-500"
        >
          End Quiz
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <Card className={`overflow-hidden ${feedback === 'correct' ? 'border-green-500 bg-green-50' : feedback === 'incorrect' ? 'border-red-500 bg-red-50' : ''}`}>
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col items-center">
              <div className="flex justify-center items-center mb-6 relative">
                {/* Quiz progress */}
                <div className="absolute top-0 -mt-10 w-full max-w-xs">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span>{sessionStats.correctCount} correct</span>
                    <span>{Math.round((sessionStats.correctCount / Math.max(sessionStats.totalAttempts, 1)) * 100)}% accuracy</span>
                  </div>
                  <Progress value={sessionStats.correctCount} max={Math.max(sessionStats.totalAttempts, 1)} className="h-1" />
                </div>
                
                {/* Character display */}
                <div className={`flex items-center justify-center w-40 h-40 rounded-full ${feedback === 'correct' ? 'bg-green-100' : feedback === 'incorrect' ? 'bg-red-100' : 'bg-muted'}`}>
                  <JapaneseCharacter 
                    character={currentCharacter.character} 
                    size={characterSizeMap[settings.characterSize] || 'xl'} 
                    color={feedback === 'correct' ? 'text-green-600' : feedback === 'incorrect' ? 'text-red-600' : kanaType === 'hiragana' ? 'text-matcha' : 'text-vermilion'}
                  />
                </div>
                
                {/* Feedback icon */}
                {feedback !== 'none' && (
                  <div className="absolute top-0 right-0 -mt-4 -mr-4">
                    {feedback === 'correct' ? (
                      <div className="bg-green-500 text-white rounded-full p-2">
                        <Check size={20} />
                      </div>
                    ) : (
                      <div className="bg-red-500 text-white rounded-full p-2">
                        <X size={20} />
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Streak indicator */}
              {sessionStats.currentStreak > 0 && (
                <div className="mb-4">
                  <span className="text-sm font-medium text-indigo">
                    Current streak: {sessionStats.currentStreak}
                    {sessionStats.currentStreak >= 5 && ' 🔥'}
                  </span>
                </div>
              )}
              
              {/* Hint display */}
              {showHint && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md w-full max-w-md">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} className="text-amber-500" />
                    <span className="text-sm font-medium">The correct answer is:</span>
                  </div>
                  <div className="flex justify-center items-center gap-4">
                    <span className="text-lg font-bold">{currentCharacter.character}</span>
                    <span className="text-lg">=</span>
                    <span className="text-lg font-bold">{currentCharacter.romaji}</span>
                  </div>
                  
                  {getSimilarCharacters().length > 0 && (
                    <div className="mt-2 pt-2 border-t border-amber-200">
                      <span className="text-xs text-muted-foreground">Similar characters:</span>
                      <div className="flex justify-center gap-4 mt-1">
                        {getSimilarCharacters().map(char => (
                          <div key={char.id} className="text-center">
                            <div className="text-md">{char.character}</div>
                            <div className="text-xs">{char.romaji}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Input form */}
              <form onSubmit={handleSubmit} className="w-full max-w-md">
                <div className="flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter romaji..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className={`text-center text-lg ${isPaused ? 'bg-gray-100' : ''}`}
                    disabled={isPaused || showHint}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                  <Button 
                    type="submit" 
                    disabled={isPaused || showHint || input.trim() === ''}
                  >
                    Check
                  </Button>
                </div>
              </form>
              
              {attemptCount > 0 && attemptCount < 3 && feedback === 'none' && (
                <div className="mt-2">
                  <span className="text-sm text-muted-foreground">
                    Attempt {attemptCount + 1} of 3
                  </span>
                </div>
              )}
              
              <div className="mt-4 flex justify-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Skip current character
                    setInput('');
                    setFeedback('none');
                    setShowHint(false);
                    setAttemptCount(0);
                    moveToNextCharacter();
                  }}
                  disabled={isPaused}
                >
                  <SkipForward size={16} className="mr-1" />
                  Skip
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Hidden audio elements for feedback sounds */}
      <audio ref={correctAudioRef} src="/sounds/correct.mp3" className="hidden" />
      <audio ref={incorrectAudioRef} src="/sounds/incorrect.mp3" className="hidden" />
    </div>
  );
};

export default QuizInterface;

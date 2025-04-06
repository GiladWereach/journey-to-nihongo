
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KanaCharacter, KanaType, PracticeResult } from '@/types/kana';
import { kanaService } from '@/services/kanaService';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PracticeInterfaceProps {
  kanaType: KanaType;
  practiceType: 'recognition' | 'matching';
  characterSize?: number;
  characterCount?: number;
  onComplete: (results: PracticeResult) => void;
  onCancel: () => void;
}

const PracticeInterface: React.FC<PracticeInterfaceProps> = ({
  kanaType,
  practiceType,
  characterSize = 50,
  characterCount = 10,
  onComplete,
  onCancel
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [kanaList, setKanaList] = useState<KanaCharacter[]>([]);
  const [selectedKana, setSelectedKana] = useState<KanaCharacter[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [results, setResults] = useState<{ character: string; correct: boolean }[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date>(new Date());

  // Load the complete kana list based on the selected type
  useEffect(() => {
    const loadKana = async () => {
      const allKana = kanaService.getKanaByType(kanaType);
      setKanaList(allKana);
      
      // Select random characters for practice
      const selected = selectRandomKana(allKana, characterCount);
      setSelectedKana(selected);
    };

    loadKana();
    setSessionStartTime(new Date());
  }, [kanaType, characterCount]);

  // Helper function to select random kana characters
  const selectRandomKana = (kanaArray: KanaCharacter[], count: number): KanaCharacter[] => {
    if (kanaArray.length <= count) return [...kanaArray];
    
    const selected: KanaCharacter[] = [];
    const tempArray = [...kanaArray];
    
    while (selected.length < count && tempArray.length > 0) {
      const randomIndex = Math.floor(Math.random() * tempArray.length);
      selected.push(tempArray[randomIndex]);
      tempArray.splice(randomIndex, 1);
    }
    
    return selected;
  };

  // Handle user answer checking
  const checkAnswer = useCallback(() => {
    if (currentIndex >= selectedKana.length) return;
    
    const currentKana = selectedKana[currentIndex];
    const isAnswerCorrect = userInput.toLowerCase() === currentKana.romaji.toLowerCase();
    
    setIsCorrect(isAnswerCorrect);
    setAnswered(true);
    
    // Add to results
    setResults(prev => [
      ...prev,
      {
        character: currentKana.character,
        correct: isAnswerCorrect
      }
    ]);

    // Update user progress in the database
    if (user) {
      const timestamp = new Date();
      kanaService.updateKanaProgress(user.id, currentKana.id, isAnswerCorrect);
    }

    // Play sound based on correct/incorrect
    playFeedbackSound(isAnswerCorrect);
    
    // Show visual feedback and then advance after a delay
    setTimeout(() => {
      nextQuestion();
    }, 1500);
  }, [currentIndex, selectedKana, userInput, user]);

  // Handle keydown events to submit with Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !answered && userInput) {
        checkAnswer();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [checkAnswer, answered, userInput]);

  // Move to the next question
  const nextQuestion = () => {
    if (currentIndex >= selectedKana.length - 1) {
      // End of practice session
      finishPractice();
    } else {
      setCurrentIndex(currentIndex + 1);
      setUserInput('');
      setAnswered(false);
    }
  };

  // Play audio feedback for correct/incorrect answers
  const playFeedbackSound = (correct: boolean) => {
    const audio = new Audio(correct ? '/sounds/correct.mp3' : '/sounds/incorrect.mp3');
    audio.play().catch(error => console.log('Error playing sound:', error));
  };

  // Complete the practice session and show results
  const finishPractice = () => {
    const correctAnswers = results.filter(r => r.correct).length;
    const totalQuestions = results.length;
    const accuracy = (correctAnswers / totalQuestions) * 100;
    
    const finalResults: PracticeResult = {
      correct: correctAnswers,
      incorrect: totalQuestions - correctAnswers,
      total: totalQuestions,
      kanaType,
      practiceType,
      accuracy,
      totalQuestions,
      correctAnswers,
      characterResults: results
    };
    
    onComplete(finalResults);
  };

  // Early cancel button handler
  const handleCancel = () => {
    if (results.length > 0) {
      // Confirm if any questions have been answered
      if (window.confirm('Do you want to end this practice session? Your progress will be saved.')) {
        finishPractice();
      }
    } else {
      onCancel();
    }
  };

  // Main practice UI
  if (selectedKana.length === 0) {
    return (
      <Card className="w-full max-w-xl mx-auto my-8">
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Loading practice session...</p>
        </CardContent>
      </Card>
    );
  }

  const currentKana = selectedKana[currentIndex];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <CardTitle className="text-xl">
              Practice {kanaType === 'hiragana' ? 'Hiragana' : 'Katakana'}
            </CardTitle>
            <div className="w-20 text-right">
              {currentIndex + 1}/{selectedKana.length}
            </div>
          </div>
          <CardDescription className="text-center">
            {practiceType === 'recognition' 
              ? 'Write the romaji (Latin alphabet) for each character' 
              : 'Match the kana to its correct romaji'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          <div 
            className={cn(
              "flex justify-center items-center py-8",
              answered && (isCorrect ? "bg-green-50" : "bg-red-50"),
              "rounded-lg transition-colors"
            )}
          >
            <div 
              className="text-center" 
              style={{ fontSize: `${characterSize * 2}px` }}
            >
              {currentKana.character}
            </div>
          </div>
          
          {/* Input for recognition mode */}
          {practiceType === 'recognition' && (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  className={cn(
                    "w-full p-4 text-center text-xl rounded-lg border",
                    answered && (isCorrect 
                      ? "border-green-400 bg-green-50" 
                      : "border-red-400 bg-red-50")
                  )}
                  value={userInput}
                  onChange={(e) => !answered && setUserInput(e.target.value)}
                  disabled={answered}
                  placeholder="Type romaji here"
                  autoFocus
                />
                
                {answered && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isCorrect ? (
                      <Check className="h-6 w-6 text-green-500" />
                    ) : (
                      <X className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              
              {answered && !isCorrect && (
                <div className="text-center text-red-500">
                  Correct answer: <span className="font-bold">{currentKana.romaji}</span>
                </div>
              )}
              
              <Button 
                className="w-full" 
                onClick={checkAnswer} 
                disabled={answered || !userInput}
              >
                Check Answer
              </Button>
            </div>
          )}
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-indigo h-2.5 rounded-full" 
              style={{ width: `${((currentIndex + (answered ? 1 : 0)) / selectedKana.length) * 100}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PracticeInterface;

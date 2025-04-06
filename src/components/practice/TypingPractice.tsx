
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { KanaType, KanaCharacter, PracticeResult } from '@/types/kana';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import { kanaService } from '@/services/kanaService';
import { Check, X } from 'lucide-react';

interface TypingPracticeProps {
  kanaType: KanaType;
  characterCount: number;
  onComplete: (results: PracticeResult) => void;
  onCancel: () => void;
}

const TypingPractice: React.FC<TypingPracticeProps> = ({
  kanaType,
  characterCount,
  onComplete,
  onCancel,
}) => {
  const [characters, setCharacters] = useState<KanaCharacter[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [results, setResults] = useState<Array<{character: string; correct: boolean}>>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Load characters on component mount
  useEffect(() => {
    const allKana = kanaService.getKanaByType(kanaType);
    // Shuffle and take the requested number of characters
    const shuffled = [...allKana].sort(() => Math.random() - 0.5);
    setCharacters(shuffled.slice(0, characterCount));
  }, [kanaType, characterCount]);

  // Focus the input field when the component mounts or the current character changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex]);

  // Play sound effect when answer is correct/incorrect
  useEffect(() => {
    if (isCorrect !== null) {
      const sound = new Audio(isCorrect ? '/sounds/correct.mp3' : '/sounds/incorrect.mp3');
      sound.play().catch(e => console.error('Error playing sound:', e));
    }
  }, [isCorrect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
    
    // Auto-check if the input matches the romaji
    if (characters.length && value.toLowerCase().trim() === characters[currentIndex].romaji.toLowerCase()) {
      checkAnswer();
    }
  };

  const checkAnswer = () => {
    if (!userInput.trim() || !characters.length) return;
    
    const currentChar = characters[currentIndex];
    const isAnswerCorrect = userInput.toLowerCase().trim() === currentChar.romaji.toLowerCase();
    
    setIsCorrect(isAnswerCorrect);
    setResults([...results, { character: currentChar.character, correct: isAnswerCorrect }]);
    
    if (isAnswerCorrect) {
      setCorrectCount(prev => prev + 1);
      setFeedback('Correct!');
      
      // Move to next character automatically after a short delay
      setTimeout(() => {
        moveToNext();
      }, 800);
    } else {
      setFeedback(`Incorrect. The correct answer is "${currentChar.romaji}".`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userInput.trim()) {
      checkAnswer();
    }
  };

  const moveToNext = () => {
    if (currentIndex < characters.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserInput('');
      setIsCorrect(null);
      setFeedback('');
      
      // Ensure input is focused
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
    } else {
      // Practice completed
      const practiceResult: PracticeResult = {
        accuracy: (correctCount / characters.length) * 100,
        totalQuestions: characters.length,
        correctAnswers: correctCount,
        characterResults: results,
        // Add the required properties for PracticeResult type
        correct: correctCount,
        incorrect: characters.length - correctCount,
        total: characters.length,
        kanaType: kanaType,
        practiceType: 'typing'
      };
      onComplete(practiceResult);
    }
  };

  if (!characters.length) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo"></div>
      </div>
    );
  }

  const currentChar = characters[currentIndex];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-500">Typing Practice</p>
              <p className="text-xs text-gray-400">
                {currentIndex + 1} of {characters.length}
              </p>
            </div>
            
            <div className="w-16"></div> {/* Spacer for alignment */}
          </div>
          
          <div className="flex flex-col items-center justify-center py-6">
            <JapaneseCharacter
              character={currentChar.character}
              size="xl"
              color={kanaType === 'hiragana' ? 'text-matcha' : 'text-vermilion'}
              animated={false}
              className="mb-6"
            />
            
            <div className="w-full space-y-4">
              <p className="text-center text-sm">Type the romaji for this character:</p>
              
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type romaji here..."
                  className="flex-1"
                  disabled={isCorrect !== null}
                  autoComplete="off"
                  autoFocus
                />
                
                <Button 
                  onClick={checkAnswer}
                  disabled={!userInput.trim() || isCorrect !== null}
                >
                  Check
                </Button>
              </div>
              
              {feedback && (
                <div className={`p-3 rounded-md text-center ${
                  isCorrect ? 'bg-green-50 border border-green-200 text-green-700' : 
                  isCorrect === false ? 'bg-red-50 border border-red-200 text-red-700' : ''
                }`}>
                  <div className="flex items-center justify-center gap-2">
                    {isCorrect !== null && (
                      isCorrect ? 
                        <Check className="h-4 w-4" /> : 
                        <X className="h-4 w-4" />
                    )}
                    <p>{feedback}</p>
                  </div>
                </div>
              )}
              
              {isCorrect === false && (
                <div className="flex justify-center">
                  <Button onClick={moveToNext}>
                    Next Character
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex justify-between text-xs text-gray-500">
              <div>Correct: {correctCount}</div>
              <div>Remaining: {characters.length - currentIndex - 1}</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TypingPractice;

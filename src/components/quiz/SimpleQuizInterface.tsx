import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import { KanaType } from '@/types/kana';
import { hiraganaCharacters } from '@/data/hiraganaData';
import { katakanaCharacters } from '@/data/katakanaData';

interface SimpleQuizInterfaceProps {
  kanaType: KanaType;
  onEndQuiz: () => void;
}

const SimpleQuizInterface: React.FC<SimpleQuizInterfaceProps> = ({ 
  kanaType, 
  onEndQuiz 
}) => {
  const [currentCharacter, setCurrentCharacter] = useState<any>(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const characters = kanaType === 'hiragana' ? hiraganaCharacters : katakanaCharacters;

  const getRandomCharacter = () => {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters[randomIndex];
  };

  useEffect(() => {
    setCurrentCharacter(getRandomCharacter());
  }, [kanaType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentCharacter || !userInput.trim()) return;

    const isCorrect = userInput.trim().toLowerCase() === currentCharacter.romaji.toLowerCase();
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    // Auto-advance after showing feedback
    setTimeout(() => {
      setCurrentCharacter(getRandomCharacter());
      setUserInput('');
      setFeedback(null);
    }, 1500);
  };

  if (!currentCharacter) return null;

  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Stats */}
      <div className="flex justify-center gap-8 text-center">
        <div>
          <div className="text-2xl font-bold text-indigo">{score.correct}</div>
          <div className="text-sm text-gray-600">Correct</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-600">{score.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-matcha">{accuracy}%</div>
          <div className="text-sm text-gray-600">Accuracy</div>
        </div>
      </div>

      {/* Main Quiz Card */}
      <Card className="p-8">
        <CardContent className="text-center space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-600">
              What is the romaji for this character?
            </h3>
            
            <div className="py-8">
              <JapaneseCharacter 
                character={currentCharacter.character}
                size="xl"
                color={kanaType === 'hiragana' ? 'text-matcha' : 'text-vermilion'}
                className="text-8xl"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type the romaji..."
              className="text-center text-xl py-3"
              disabled={feedback !== null}
              autoFocus
            />
            
            {feedback === null && (
              <Button 
                type="submit" 
                className="w-full py-3 text-lg"
                disabled={!userInput.trim()}
              >
                Submit
              </Button>
            )}
          </form>

          {/* Feedback */}
          {feedback && (
            <div className={`p-4 rounded-lg ${
              feedback === 'correct' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {feedback === 'correct' ? (
                <div className="space-y-2">
                  <div className="text-lg font-semibold">✅ Correct!</div>
                  <div>{currentCharacter.character} = {currentCharacter.romaji}</div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-lg font-semibold">❌ Incorrect</div>
                  <div>{currentCharacter.character} = {currentCharacter.romaji}</div>
                  <div className="text-sm">You typed: {userInput}</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* End Quiz Button */}
      <div className="text-center">
        <Button variant="outline" onClick={onEndQuiz}>
          End Quiz
        </Button>
      </div>
    </div>
  );
};

export default SimpleQuizInterface;

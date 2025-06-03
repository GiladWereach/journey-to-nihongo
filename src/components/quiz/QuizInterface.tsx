
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { KanaType, QuizCharacter, CharacterResult, QuizSessionStats } from '@/types/quiz';
import { kanaService } from '@/services/kanaService';
import { hiraganaCharacters } from '@/data/hiraganaData';
import { katakanaCharacters } from '@/data/katakanaData';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import { cn } from '@/lib/utils';

interface QuizInterfaceProps {
  kanaType: KanaType;
  onComplete: (stats: QuizSessionStats) => void;
  onCancel: () => void;
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({ kanaType, onComplete, onCancel }) => {
  const [currentCharacter, setCurrentCharacter] = useState<QuizCharacter | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [sessionStats, setSessionStats] = useState<QuizSessionStats>({
    startTime: new Date(),
    endTime: null,
    totalAttempts: 0,
    correctCount: 0,
    incorrectCount: 0,
    currentStreak: 0,
    longestStreak: 0,
    accuracy: 0,
    characterResults: []
  });

  const characters = kanaType === 'hiragana' ? hiraganaCharacters : katakanaCharacters;

  const getRandomCharacter = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const char = characters[randomIndex];
    return {
      id: char.id,
      character: char.character,
      romaji: char.romaji,
      type: kanaType,
      quizMode: 'recognition' as const
    };
  }, [characters, kanaType]);

  const generateOptions = useCallback((correctRomaji: string) => {
    const allRomaji = [...new Set(characters.map(c => c.romaji))];
    const incorrectOptions = allRomaji.filter(r => r !== correctRomaji);
    
    const shuffledIncorrect = incorrectOptions.sort(() => Math.random() - 0.5);
    const selectedIncorrect = shuffledIncorrect.slice(0, 3);
    
    const allOptions = [correctRomaji, ...selectedIncorrect];
    return allOptions.sort(() => Math.random() - 0.5);
  }, [characters]);

  useEffect(() => {
    const char = getRandomCharacter();
    setCurrentCharacter(char);
    setOptions(generateOptions(char.romaji));
  }, [getRandomCharacter, generateOptions]);

  const handleAnswer = (answer: string) => {
    if (!currentCharacter || selectedAnswer) return;

    setSelectedAnswer(answer);
    const correct = answer === currentCharacter.romaji;
    setIsCorrect(correct);

    const newResult: CharacterResult = {
      characterId: currentCharacter.id,
      character: currentCharacter.character,
      romaji: currentCharacter.romaji,
      isCorrect: correct,
      attemptCount: 1
    };

    setSessionStats(prev => {
      const newStreak = correct ? prev.currentStreak + 1 : 0;
      const newStats = {
        ...prev,
        totalAttempts: prev.totalAttempts + 1,
        correctCount: correct ? prev.correctCount + 1 : prev.correctCount,
        incorrectCount: correct ? prev.incorrectCount : prev.incorrectCount + 1,
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        characterResults: [...prev.characterResults, newResult]
      };
      
      newStats.accuracy = newStats.totalAttempts > 0 
        ? Math.round((newStats.correctCount / newStats.totalAttempts) * 100)
        : 0;

      return newStats;
    });

    // Auto-advance after 1.5 seconds
    setTimeout(() => {
      const nextChar = getRandomCharacter();
      setCurrentCharacter(nextChar);
      setOptions(generateOptions(nextChar.romaji));
      setSelectedAnswer(null);
      setIsCorrect(null);
    }, 1500);
  };

  const handleEndQuiz = () => {
    const finalStats = {
      ...sessionStats,
      endTime: new Date(),
      durationSeconds: Math.round((new Date().getTime() - sessionStats.startTime.getTime()) / 1000)
    };
    onComplete(finalStats);
  };

  if (!currentCharacter) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">
              {kanaType === 'hiragana' ? 'Hiragana' : 'Katakana'} Quiz
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleEndQuiz}>
              End Quiz
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{sessionStats.correctCount}</div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{sessionStats.incorrectCount}</div>
              <div className="text-xs text-muted-foreground">Incorrect</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{sessionStats.accuracy}%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{sessionStats.currentStreak}</div>
              <div className="text-xs text-muted-foreground">Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardContent className="text-center py-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg text-muted-foreground">What is the romaji for:</h3>
            <JapaneseCharacter 
              character={currentCharacter.character}
              size="xl"
              color={kanaType === 'hiragana' ? 'text-matcha' : 'text-vermilion'}
              className="text-6xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {options.map((option) => (
              <Button
                key={option}
                variant="outline"
                className={cn(
                  "h-12 text-lg transition-all duration-200",
                  selectedAnswer === option && isCorrect === true && "bg-green-100 border-green-400 text-green-700",
                  selectedAnswer === option && isCorrect === false && "bg-red-100 border-red-400 text-red-700",
                  selectedAnswer && option === currentCharacter.romaji && selectedAnswer !== option && "bg-green-100 border-green-400 text-green-700"
                )}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
              >
                {option}
              </Button>
            ))}
          </div>

          {/* Feedback */}
          {selectedAnswer && (
            <div className={cn(
              "p-4 rounded-lg animate-fade-in",
              isCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            )}>
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg font-semibold">
                  {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
                </span>
              </div>
              <div className="text-sm mt-1">
                {currentCharacter.character} = {currentCharacter.romaji}
                {!isCorrect && ` (You selected: ${selectedAnswer})`}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancel Button */}
      <div className="text-center">
        <Button variant="ghost" onClick={onCancel} className="text-muted-foreground">
          Back to Setup
        </Button>
      </div>
    </div>
  );
};

export default QuizInterface;

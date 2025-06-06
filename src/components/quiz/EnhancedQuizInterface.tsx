
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TraditionalCard } from '@/components/ui/TraditionalAtmosphere';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import TraditionalProgressIndicator from '@/components/ui/TraditionalProgressIndicator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { kanaService } from '@/services/kanaService';
import { characterProgressService } from '@/services/characterProgressService';
import { quizSessionService, QuizSession } from '@/services/quizSessionService';
import { KanaType, KanaCharacter } from '@/types/kana';

interface EnhancedQuizInterfaceProps {
  kanaType: KanaType;
  onEndQuiz: () => void;
  session: QuizSession | null;
}

const EnhancedQuizInterface: React.FC<EnhancedQuizInterfaceProps> = ({
  kanaType,
  onEndQuiz,
  session
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [characters, setCharacters] = useState<KanaCharacter[]>([]);
  const [currentCharacter, setCurrentCharacter] = useState<KanaCharacter | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load characters
  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const kanaData = await kanaService.getKanaByType(kanaType);
        setCharacters(kanaData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading characters:', error);
        toast({
          title: "Error",
          description: "Failed to load quiz questions.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    loadCharacters();
  }, [kanaType, toast]);

  // Generate new question
  const generateQuestion = useCallback(() => {
    if (characters.length === 0) return;

    const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
    setCurrentCharacter(randomCharacter);
    setUserInput('');
    setIsCorrect(null);
    setShowResult(false);
  }, [characters]);

  // Initialize first question
  useEffect(() => {
    if (characters.length > 0) {
      generateQuestion();
    }
  }, [characters, generateQuestion]);

  const checkAnswer = useCallback(async (answer: string) => {
    if (!currentCharacter || !user || showResult) return;

    const userAnswer = answer.toLowerCase().trim();
    const correctAnswer = currentCharacter.romaji.toLowerCase();
    const correct = userAnswer === correctAnswer;
    
    setIsCorrect(correct);
    setShowResult(true);

    // Update session
    if (session) {
      await quizSessionService.updateSession(
        session.id,
        questionCount + 1,
        correctCount + (correct ? 1 : 0)
      );
    }

    // Update progress
    await characterProgressService.updateProgress(
      user.id,
      currentCharacter.id,
      correct
    );

    // Update counters
    setQuestionCount(prev => prev + 1);
    if (correct) {
      setCorrectCount(prev => prev + 1);
      setCurrentStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
    } else {
      setCurrentStreak(0);
    }

    // Auto-advance after 2 seconds
    setTimeout(() => {
      generateQuestion();
    }, 2000);
  }, [currentCharacter, user, showResult, session, questionCount, correctCount, generateQuestion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() && !showResult) {
      checkAnswer(userInput);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
    
    // Auto-check when user types the correct length (most romaji are 1-3 characters)
    if (value.trim().length >= 1 && currentCharacter && !showResult) {
      const correctAnswer = currentCharacter.romaji.toLowerCase();
      if (value.toLowerCase().trim() === correctAnswer) {
        checkAnswer(value);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userInput.trim() && !showResult) {
      checkAnswer(userInput);
    }
  };

  const handleFinishQuiz = () => {
    onEndQuiz();
  };

  if (isLoading) {
    return (
      <TraditionalCard>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lantern-warm mx-auto mb-4"></div>
          <p className="text-paper-warm font-traditional">Loading quiz questions...</p>
        </div>
      </TraditionalCard>
    );
  }

  if (!currentCharacter) {
    return (
      <TraditionalCard>
        <div className="p-8 text-center">
          <p className="text-paper-warm font-traditional">No questions available for this kana type.</p>
          <Button 
            onClick={onEndQuiz}
            className="mt-4 bg-vermilion hover:bg-vermilion/90 text-paper-warm font-traditional"
          >
            Back to Setup
          </Button>
        </div>
      </TraditionalCard>
    );
  }

  const accuracy = questionCount > 0 ? Math.round((correctCount / questionCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Progress Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 text-sm">
          <span className="text-paper-warm font-traditional">Question {questionCount + 1}</span>
          <span className="text-paper-warm font-traditional">•</span>
          <span className="text-paper-warm font-traditional">{kanaType.charAt(0).toUpperCase() + kanaType.slice(1)} Quiz</span>
        </div>
        <Button
          variant="ghost"
          onClick={handleFinishQuiz}
          className="text-paper-warm hover:text-lantern-warm font-traditional bg-wood-grain/20 border border-wood-light/40"
        >
          End Quiz
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <TraditionalProgressIndicator 
          progress={Math.min(questionCount * 10, 100)} 
          size="lg"
          type={kanaType}
        />
      </div>

      {/* Main Quiz Card */}
      <TraditionalCard className="bg-gradient-to-br from-paper-warm/95 to-paper-aged/95">
        <div className="p-12 text-center">
          {/* Character Display */}
          <div className="mb-8">
            <JapaneseCharacter 
              character={currentCharacter.character} 
              size="xl" 
              color="text-gion-night"
              animated={true}
            />
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-traditional text-gion-night mb-4">
              Type the romaji for this character
            </h2>
            <p className="text-wood-medium font-traditional">
              Enter the pronunciation below
            </p>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="max-w-xs mx-auto mb-6">
              <Input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={showResult}
                placeholder="Type romaji here..."
                className={`text-center text-2xl font-traditional transition-all duration-300 ${
                  showResult
                    ? isCorrect
                      ? 'bg-matcha/20 border-matcha text-matcha font-bold'
                      : 'bg-vermilion/20 border-vermilion text-vermilion font-bold'
                    : 'bg-paper-warm border-wood-light text-gion-night focus:border-lantern-warm focus:bg-white'
                }`}
                autoFocus
              />
            </div>

            {/* Submit Button */}
            {!showResult && (
              <Button
                type="submit"
                disabled={!userInput.trim()}
                className="bg-lantern-warm hover:bg-lantern-amber text-gion-night font-traditional px-8 py-3"
              >
                Submit Answer
              </Button>
            )}
          </form>

          {/* Result Feedback */}
          {showResult && (
            <div className="mb-6">
              {isCorrect ? (
                <div className="text-matcha font-traditional text-xl mb-4">
                  ✓ Correct! Well done!
                </div>
              ) : (
                <div className="text-vermilion font-traditional text-xl mb-4">
                  ✗ Incorrect. The answer is "{currentCharacter.romaji}"
                  <br />
                  <span className="text-lg">You entered: "{userInput}"</span>
                </div>
              )}
              
              <p className="text-wood-medium font-traditional text-sm">
                Next question in 2 seconds...
              </p>
            </div>
          )}
        </div>
      </TraditionalCard>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-4">
        <TraditionalCard className="bg-wood-grain/20 border-wood-light/40">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-paper-warm">{accuracy}%</div>
            <div className="text-xs text-paper-warm/70 tracking-wider uppercase mt-1 font-traditional">
              Accuracy
            </div>
          </div>
        </TraditionalCard>

        <TraditionalCard className="bg-wood-grain/20 border-wood-light/40">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-paper-warm">{maxStreak}</div>
            <div className="text-xs text-paper-warm/70 tracking-wider uppercase mt-1 font-traditional">
              Max Streak
            </div>
          </div>
        </TraditionalCard>

        <TraditionalCard className="bg-wood-grain/20 border-wood-light/40">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-paper-warm">{questionCount}</div>
            <div className="text-xs text-paper-warm/70 tracking-wider uppercase mt-1 font-traditional">
              Questions
            </div>
          </div>
        </TraditionalCard>
      </div>
    </div>
  );
};

export default EnhancedQuizInterface;

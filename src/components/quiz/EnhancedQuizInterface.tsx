
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
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
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
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

    // Generate wrong answers
    const wrongAnswers = characters
      .filter(char => char.romaji !== randomCharacter.romaji)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(char => char.romaji);

    // Mix with correct answer and shuffle
    const allOptions = [randomCharacter.romaji, ...wrongAnswers].sort(() => 0.5 - Math.random());
    setOptions(allOptions);

    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowResult(false);
  }, [characters]);

  // Initialize first question
  useEffect(() => {
    if (characters.length > 0) {
      generateQuestion();
    }
  }, [characters, generateQuestion]);

  const handleAnswerSelect = async (answer: string) => {
    if (selectedAnswer || !currentCharacter || !user) return;

    setSelectedAnswer(answer);
    const correct = answer === currentCharacter.romaji;
    setIsCorrect(correct);
    setShowResult(true);

    // Update session - fix: provide all required parameters
    if (session) {
      await quizSessionService.updateSession(session.id, {
        questions_answered: questionCount + 1,
        correct_answers: correctCount + (correct ? 1 : 0)
      });
    }

    // Update progress - fix: pass correct as boolean, not string
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
  };

  const handleNextQuestion = () => {
    generateQuestion();
  };

  const handleFinishQuiz = () => {
    onEndQuiz();
  };

  if (isLoading) {
    return (
      <TraditionalCard>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lantern-warm mx-auto mb-4"></div>
          <p className="text-wood-light font-traditional">Loading quiz questions...</p>
        </div>
      </TraditionalCard>
    );
  }

  if (!currentCharacter) {
    return (
      <TraditionalCard>
        <div className="p-8 text-center">
          <p className="text-wood-light font-traditional">No questions available for this kana type.</p>
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
          <span className="text-wood-light font-traditional">Question {questionCount + 1}</span>
          <span className="text-wood-light font-traditional">•</span>
          <span className="text-wood-light font-traditional">{kanaType.charAt(0).toUpperCase() + kanaType.slice(1)} Quiz</span>
        </div>
        <Button
          variant="ghost"
          onClick={handleFinishQuiz}
          className="text-wood-light hover:text-lantern-warm font-traditional bg-wood-grain/20 border border-wood-light/40"
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
              What is the romaji for this character?
            </h2>
            <p className="text-wood-medium font-traditional">
              Choose the correct pronunciation below
            </p>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
            {options.map((option, index) => {
              let buttonClass = "p-4 text-lg font-traditional border-2 transition-all duration-300 ";
              
              if (showResult) {
                if (option === currentCharacter.romaji) {
                  buttonClass += "bg-matcha/20 border-matcha text-matcha border-matcha/60";
                } else if (option === selectedAnswer) {
                  buttonClass += "bg-vermilion/20 border-vermilion text-vermilion border-vermilion/60";
                } else {
                  buttonClass += "bg-wood-grain/10 border-wood-light/40 text-wood-medium opacity-50";
                }
              } else {
                buttonClass += "bg-wood-grain/20 border-wood-light/40 text-gion-night hover:bg-wood-grain/30 hover:border-wood-light";
              }

              return (
                <Button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  {option}
                </Button>
              );
            })}
          </div>

          {/* Result Feedback */}
          {showResult && (
            <div className="mb-6">
              {isCorrect ? (
                <div className="text-matcha font-traditional text-lg">
                  ✓ Correct! Well done!
                </div>
              ) : (
                <div className="text-vermilion font-traditional text-lg">
                  ✗ Incorrect. The answer is "{currentCharacter.romaji}"
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          {showResult ? (
            <Button
              onClick={handleNextQuestion}
              className="bg-lantern-warm hover:bg-lantern-amber text-gion-night font-traditional px-8 py-3"
            >
              Next Question
            </Button>
          ) : (
            <Button
              className="bg-wood-grain/30 border border-wood-light/40 text-wood-medium font-traditional px-8 py-3"
              disabled
            >
              Submit Answer
            </Button>
          )}
        </div>
      </TraditionalCard>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-4">
        <TraditionalCard className="bg-wood-grain/20 border-wood-light/40">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-wood-light">{accuracy}%</div>
            <div className="text-xs text-paper-warm/60 tracking-wider uppercase mt-1 font-traditional">
              Accuracy
            </div>
          </div>
        </TraditionalCard>

        <TraditionalCard className="bg-wood-grain/20 border-wood-light/40">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-wood-light">{maxStreak}</div>
            <div className="text-xs text-paper-warm/60 tracking-wider uppercase mt-1 font-traditional">
              Max Streak
            </div>
          </div>
        </TraditionalCard>

        <TraditionalCard className="bg-wood-grain/20 border-wood-light/40">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-wood-light">{questionCount}</div>
            <div className="text-xs text-paper-warm/60 tracking-wider uppercase mt-1 font-traditional">
              Remaining
            </div>
          </div>
        </TraditionalCard>
      </div>
    </div>
  );
};

export default EnhancedQuizInterface;

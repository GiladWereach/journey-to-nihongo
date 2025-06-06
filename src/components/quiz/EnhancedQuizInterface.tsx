
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, RotateCcw, Trophy, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { kanaService } from '@/services/kanaService';
import { Kana, KanaType } from '@/types/kana';
import { useAuth } from '@/contexts/AuthContext';
import { useQuizProgress } from '@/hooks/useQuizProgress';
import { QuizSession, quizSessionService } from '@/services/quizSessionService';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';

interface EnhancedQuizInterfaceProps {
  kanaType: KanaType;
  onEndQuiz: () => void;
  session: QuizSession | null;
}

interface QuizQuestion {
  character: Kana;
  options: string[];
  correctAnswer: string;
}

interface QuizResult {
  character: string;
  romaji: string;
  userAnswer: string;
  correct: boolean;
  timeSpent: number;
  characterId: string;
}

const EnhancedQuizInterface: React.FC<EnhancedQuizInterfaceProps> = ({
  kanaType,
  onEndQuiz,
  session
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { updateProgress } = useQuizProgress();
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const sessionRef = useRef(session);
  sessionRef.current = session;

  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        const kanaData = await kanaService.getKanaByType(kanaType);
        const shuffledKana = [...kanaData].sort(() => Math.random() - 0.5);
        const selectedKana = shuffledKana.slice(0, 10);

        const quizQuestions: QuizQuestion[] = selectedKana.map(kana => {
          const allKana = kanaData.filter(k => k.id !== kana.id);
          const wrongAnswers = allKana
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(k => k.romaji);
          
          const options = [kana.romaji, ...wrongAnswers].sort(() => Math.random() - 0.5);
          
          return {
            character: kana,
            options,
            correctAnswer: kana.romaji
          };
        });

        setQuestions(quizQuestions);
        setQuestionStartTime(Date.now());
      } catch (error) {
        console.error('Error initializing quiz:', error);
        toast({
          title: "Error",
          description: "Failed to load quiz questions. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeQuiz();
  }, [kanaType, toast]);

  // Update session progress whenever score changes
  useEffect(() => {
    const updateSessionProgress = async () => {
      if (sessionRef.current && user) {
        const questionsAnswered = quizResults.length;
        const correctAnswers = score;
        
        await quizSessionService.updateSession(
          sessionRef.current.id, 
          questionsAnswered, 
          correctAnswers
        );
      }
    };

    if (quizResults.length > 0) {
      updateSessionProgress();
    }
  }, [score, quizResults.length, user]);

  const handleAnswerSubmit = (answer: string) => {
    if (!answer || showResult) return;

    const currentQuestion = questions[currentQuestionIndex];
    const correct = answer === currentQuestion.correctAnswer;
    const timeSpent = Date.now() - questionStartTime;

    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(score + 1);
      setStreak(streak + 1);
      setMaxStreak(Math.max(maxStreak, streak + 1));
    } else {
      setStreak(0);
    }

    // Record the result
    const result: QuizResult = {
      character: currentQuestion.character.character,
      romaji: currentQuestion.correctAnswer,
      userAnswer: answer,
      correct,
      timeSpent,
      characterId: currentQuestion.character.id
    };

    setQuizResults(prev => [...prev, result]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowResult(false);
      setQuestionStartTime(Date.now());
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = async () => {
    if (isQuizComplete) return;
    
    setIsQuizComplete(true);
    
    try {
      // Update character progress
      if (user && quizResults.length > 0) {
        const sessionId = sessionRef.current?.id || 'unknown';
        await updateProgress(quizResults, sessionId);
      }

      // End the quiz session
      if (sessionRef.current) {
        console.log('Completing quiz session:', sessionRef.current.id);
        await quizSessionService.endSession(sessionRef.current.id);
      }

      // Show completion message
      const accuracy = Math.round((score / questions.length) * 100);
      toast({
        title: "Quiz Complete!",
        description: `You scored ${score}/${questions.length} (${accuracy}%) with a max streak of ${maxStreak}`,
      });

      // End the quiz
      onEndQuiz();
    } catch (error) {
      console.error('Error completing quiz:', error);
      toast({
        title: "Quiz completed with issues",
        description: "Your quiz is done but there may have been issues saving your progress.",
        variant: "destructive",
      });
      onEndQuiz();
    }
  };

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      if (!isQuizComplete && sessionRef.current) {
        // Force complete session if component unmounts before quiz is finished
        quizSessionService.forceCompleteSession(
          sessionRef.current.id,
          quizResults.length,
          score
        );
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">No questions available for this kana type.</p>
        <Button onClick={onEndQuiz}>Return to Setup</Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + (showResult ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress and Stats Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Badge>
          <Badge variant="outline" className="text-sm">
            Score: {score}/{questions.length}
          </Badge>
          <Badge variant="outline" className="text-sm flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Streak: {streak}
          </Badge>
        </div>
        <div className="text-sm text-gray-600">
          {kanaType === 'hiragana' ? 'ひらがな' : 'カタカナ'} Quiz
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-indigo h-2 rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Card */}
      <Card className="bg-gradient-to-br from-indigo/5 to-purple/5">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Character Display */}
            <div className="flex justify-center">
              <JapaneseCharacter 
                character={currentQuestion.character.character}
                size="xl"
                color="text-gion-night"
              />
            </div>

            {/* Question */}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                What is the romaji for this character?
              </h3>
              <p className="text-gray-600">
                Choose the correct pronunciation below
              </p>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={
                    showResult
                      ? option === currentQuestion.correctAnswer
                        ? "default"
                        : option === selectedAnswer
                        ? "destructive"
                        : "outline"
                      : selectedAnswer === option
                      ? "default"
                      : "outline"
                  }
                  className={cn(
                    "h-12 text-lg font-medium transition-all",
                    showResult && option === currentQuestion.correctAnswer && "bg-green-500 hover:bg-green-600",
                    showResult && option === selectedAnswer && option !== currentQuestion.correctAnswer && "bg-red-500 hover:bg-red-600"
                  )}
                  onClick={() => !showResult && setSelectedAnswer(option)}
                  disabled={showResult}
                >
                  {option}
                </Button>
              ))}
            </div>

            {/* Submit/Next Button */}
            <div className="pt-4">
              {!showResult ? (
                <Button
                  onClick={() => handleAnswerSubmit(selectedAnswer)}
                  disabled={!selectedAnswer}
                  className="bg-indigo hover:bg-indigo/90 px-8"
                  size="lg"
                >
                  Submit Answer
                </Button>
              ) : (
                <div className="space-y-4">
                  {/* Result Feedback */}
                  <div className={cn(
                    "flex items-center justify-center gap-2 text-lg font-semibold",
                    isCorrect ? "text-green-600" : "text-red-600"
                  )}>
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="h-6 w-6" />
                        Correct!
                      </>
                    ) : (
                      <>
                        <XCircle className="h-6 w-6" />
                        Incorrect
                      </>
                    )}
                  </div>

                  {!isCorrect && (
                    <p className="text-gray-600">
                      The correct answer is: <strong>{currentQuestion.correctAnswer}</strong>
                    </p>
                  )}

                  {/* Next Button */}
                  <Button
                    onClick={handleNextQuestion}
                    className="bg-indigo hover:bg-indigo/90 px-8"
                    size="lg"
                  >
                    {currentQuestionIndex < questions.length - 1 ? (
                      "Next Question"
                    ) : (
                      <>
                        <Trophy className="mr-2 h-4 w-4" />
                        Complete Quiz
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="flex justify-center gap-6 text-sm text-gray-600">
        <div className="text-center">
          <div className="font-semibold">Accuracy</div>
          <div>{quizResults.length > 0 ? Math.round((score / quizResults.length) * 100) : 0}%</div>
        </div>
        <div className="text-center">
          <div className="font-semibold">Max Streak</div>
          <div>{maxStreak}</div>
        </div>
        <div className="text-center">
          <div className="font-semibold">Remaining</div>
          <div>{questions.length - currentQuestionIndex - (showResult ? 1 : 0)}</div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedQuizInterface;

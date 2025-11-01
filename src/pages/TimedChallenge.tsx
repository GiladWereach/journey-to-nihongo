
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Timer, Trophy, ArrowLeft, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { KanaType, QuizCharacter } from '@/types/quiz';
import { hiraganaCharacters } from '@/data/hiraganaData';
import { katakanaCharacters } from '@/data/katakanaData';
import { timedChallengeDashboardNavigated, timedChallengeGameReset, timedChallengeAnswerSubmitted, timedChallengeGameStarted, timedChallengeTypeSelected, timedChallengeNavigationClicked, timedChallengeRestarted, timedChallengeStarted, useAuth, useNavigate, useToast, endGame, random, generateQuestions, setResult, toast, toString } from '@/lib/analytics-generated';

// Track timed_challenge_dashboard_navigated
timedChallengeDashboardNavigated();
// Track timed_challenge_game_reset
timedChallengeGameReset();
// Track timed_challenge_answer_submitted
timedChallengeAnswerSubmitted();
// Track timed_challenge_game_started
timedChallengeGameStarted();
// Track timed_challenge_type_selected
timedChallengeTypeSelected();
// Track timed_challenge_type_selected
timedChallengeTypeSelected();
// Track timed_challenge_navigation_clicked
timedChallengeNavigationClicked();
// Track timed_challenge_navigation_clicked
timedChallengeNavigationClicked();
// Track timed_challenge_restarted
timedChallengeRestarted();
// Track timed_challenge_answer_submitted
timedChallengeAnswerSubmitted();
// Track timed_challenge_started
timedChallengeStarted();
interface ChallengeResult {
  score: number;
  timeRemaining: number;
  accuracy: number;
  totalQuestions: number;
}

const TimedChallenge = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [gameState, setGameState] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [selectedType, setSelectedType] = useState<KanaType>('hiragana');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [timeLimit, setTimeLimit] = useState(60);
  const [currentTime, setCurrentTime] = useState(60);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questions, setQuestions] = useState<QuizCharacter[]>([]);
  const [currentChar, setCurrentChar] = useState<QuizCharacter | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [userAnswers, setUserAnswers] = useState<boolean[]>([]);
  const [result, setResult] = useState<ChallengeResult | null>(null);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState === 'playing' && currentTime > 0) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameState, currentTime]);

  const generateQuestions = () => {
    const kanaData = selectedType === 'hiragana' ? hiraganaCharacters : katakanaCharacters;
    
    // Create quiz characters with required properties
    const quizChars: QuizCharacter[] = kanaData.map(kana => ({
      id: kana.id,
      character: kana.character,
      romaji: kana.romaji,
      type: selectedType,
      stroke_count: kana.stroke_count || 1,
      stroke_order: kana.stroke_order || []
    }));
    
    const questionCount = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;
    const selectedQuestions = [...quizChars]
      .sort(() => Math.random() - 0.5)
      .slice(0, questionCount);
    
    setQuestions(selectedQuestions);
    setTotalQuestions(selectedQuestions.length);
    setCurrentQuestion(0);
    setUserAnswers([]);
    generateQuestion(selectedQuestions, 0);
  };

  const generateQuestion = (questionSet: QuizCharacter[], index: number) => {
    if (index >= questionSet.length) {
      endGame();
      return;
    }

    const question = questionSet[index];
    setCurrentChar(question);
    setCorrectAnswer(question.romaji);

    // Generate 3 wrong answers
    const allKana = selectedType === 'hiragana' ? hiraganaCharacters : katakanaCharacters;
    const wrongAnswers = allKana
      .filter(k => k.romaji !== question.romaji)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(k => k.romaji);

    const allOptions = [question.romaji, ...wrongAnswers].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  };

  const handleAnswer = (selectedAnswer: string) => {
    const isCorrect = selectedAnswer === correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setUserAnswers(prev => [...prev, isCorrect]);

    const nextQuestion = currentQuestion + 1;
    setCurrentQuestion(nextQuestion);
    
    if (nextQuestion < questions.length) {
      setTimeout(() => {
        generateQuestion(questions, nextQuestion);
      }, 500);
    } else {
      endGame();
    }
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentTime(timeLimit);
    setScore(0);
    generateQuestions();
  };

  const endGame = () => {
    setGameState('finished');
    
    const correctAnswers = userAnswers.filter(answer => answer).length;
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    
    setResult({
      score: correctAnswers,
      timeRemaining: currentTime,
      accuracy: Math.round(accuracy),
      totalQuestions
    });

    toast({
      title: "Challenge Complete!",
      description: `You scored ${correctAnswers}/${totalQuestions} with ${Math.round(accuracy)}% accuracy!`,
    });
  };

  const resetGame = () => {
    setGameState('setup');
    setScore(0);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setResult(null);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p>Please sign in to play the Timed Challenge.</p>
            <Button onClick={() => navigate('/auth')} className="mt-4">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      {gameState === 'setup' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6" />
              Timed Challenge
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Character Type</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={selectedType === 'hiragana' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('hiragana')}
                >
                  Hiragana
                </Button>
                <Button
                  variant={selectedType === 'katakana' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('katakana')}
                >
                  Katakana
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Difficulty</h3>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={difficulty === 'easy' ? 'default' : 'outline'}
                  onClick={() => {
                    setDifficulty('easy');
                    setTimeLimit(90);
                  }}
                >
                  Easy (10Q)
                </Button>
                <Button
                  variant={difficulty === 'medium' ? 'default' : 'outline'}
                  onClick={() => {
                    setDifficulty('medium');
                    setTimeLimit(60);
                  }}
                >
                  Medium (15Q)
                </Button>
                <Button
                  variant={difficulty === 'hard' ? 'default' : 'outline'}
                  onClick={() => {
                    setDifficulty('hard');
                    setTimeLimit(45);
                  }}
                >
                  Hard (20Q)
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Time Limit: {timeLimit} seconds
              </p>
              <Button onClick={startGame} size="lg">
                Start Challenge
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {gameState === 'playing' && currentChar && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                <span className="font-mono text-lg">
                  {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <Badge variant="secondary">
                {currentQuestion + 1} / {totalQuestions}
              </Badge>
            </div>
            <Progress value={(currentTime / timeLimit) * 100} className="mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold mb-4 text-indigo">
                {currentChar.character}
              </div>
              <p className="text-muted-foreground">What is the romaji for this character?</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-12 text-lg"
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </Button>
              ))}
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Score: {score} / {currentQuestion}
            </div>
          </CardContent>
        </Card>
      )}

      {gameState === 'finished' && result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6" />
              Challenge Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-indigo">{result.score}</div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{result.accuracy}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Time remaining: {result.timeRemaining} seconds
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={resetGame} variant="outline">
                  Play Again
                </Button>
                <Button onClick={() => navigate('/dashboard')}>
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TimedChallenge;

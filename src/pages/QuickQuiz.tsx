
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Home, RotateCcw } from 'lucide-react';
import SimpleQuizSetup from '@/components/quiz/SimpleQuizSetup';
import SimpleQuizInterface from '@/components/quiz/SimpleQuizInterface';
import { KanaType } from '@/types/quiz';
import { quizSessionService, QuizSession } from '@/services/quizSessionService';
import { quickQuizPageViewed, quickQuizGoHomeButtonClicked, quickQuizRestartButtonClicked } from '@/lib/analytics-generated';
import { quickQuizHomeButtonClicked, quickQuizRestartButtonClicked } from '@/lib/analytics-generated';

// Track quick_quiz_restart_button_clicked
quickQuizRestartButtonClicked();
// Track quick_quiz_home_button_clicked
quickQuizHomeButtonClicked();
// Track quick_quiz_restart_button_clicked
quickQuizRestartButtonClicked();
// Track quick_quiz_go_home_button_clicked
quickQuizGoHomeButtonClicked();
// Track quick_quiz_page_viewed
quickQuizPageViewed();
const QuickQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const [quizStarted, setQuizStarted] = useState(false);
  const [kanaType, setKanaType] = useState<KanaType>('hiragana');
  const [session, setSession] = useState<QuizSession | null>(null);

  // Clean up abandoned sessions
  useEffect(() => {
    if (user) {
      quizSessionService.cleanupAbandonedSessions(user.id);
    }
  }, [user]);
  
  // Handle component unmount to complete the session
  useEffect(() => {
    return () => {
      if (session && !session.completed) {
        quizSessionService.endSession(session.id);
      }
    };
  }, [session]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }

    if (location.state?.fromKanaLearning && location.state?.kanaType) {
      setKanaType(location.state.kanaType);
      setQuizStarted(true);
    }
  }, [user, navigate, location.state]);

  const handleStartQuiz = async (type: KanaType) => {
    if (user) {
      const newSession = await quizSessionService.startSession(user.id, type);
      setSession(newSession);
    }
    
    setKanaType(type);
    setQuizStarted(true);
  };

  const handleEndQuiz = async () => {
    if (session) {
      await quizSessionService.endSession(session.id);
      toast({
        title: "Quiz completed",
        description: "Your progress has been saved",
      });
      setSession(null);
    }
    setQuizStarted(false);
  };

  const handleGoHome = () => {
    // Make sure to complete the session before navigating away
    if (session && !session.completed) {
      quizSessionService.endSession(session.id);
    }
    navigate('/dashboard');
  };

  const handleRestartQuiz = async () => {
    if (session) {
      await quizSessionService.endSession(session.id);
      setSession(null);
    }
    setQuizStarted(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleGoHome}
          className="mb-4"
        >
          <Home className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Kana Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          {!quizStarted ? (
            <SimpleQuizSetup onStartQuiz={handleStartQuiz} />
          ) : (
            <SimpleQuizInterface
              kanaType={kanaType}
              onEndQuiz={handleEndQuiz}
              session={session}
            />
          )}
        </CardContent>
      </Card>

      {quizStarted && (
        <div className="mt-4 text-center">
          <Button variant="secondary" onClick={handleRestartQuiz}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Restart Quiz
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuickQuiz;

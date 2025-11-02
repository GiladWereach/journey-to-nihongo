import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SimpleQuizSetup from '@/components/quiz/SimpleQuizSetup';
import SimpleQuizInterface from '@/components/quiz/SimpleQuizInterface';
import { TraditionalBackground, TraditionalCard } from '@/components/ui/TraditionalAtmosphere';
import { KanaType } from '@/types/kana';
import { QuizSession, quizSessionService } from '@/services/quizSessionService';
import { useToast } from '@/hooks/use-toast';
import { quizPageViewed } from '@/lib/analytics-generated';

// Track quiz_page_viewed
quizPageViewed();
const Quiz: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedKanaType, setSelectedKanaType] = useState<KanaType>('hiragana');
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null);

  // Cleanup any incomplete sessions when component mounts
  useEffect(() => {
    if (user) {
      quizSessionService.cleanupAbandonedSessions(user.id);
    }
  }, [user]);

  // Cleanup session when component unmounts or page is refreshed
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentSession && user) {
        // Force complete the session if page is being closed
        quizSessionService.forceCompleteSession(
          currentSession.id, 
          currentSession.questions_answered, 
          currentSession.correct_answers
        );
      }
    };

    const handleUnload = () => {
      if (currentSession && user) {
        // Force complete the session
        quizSessionService.endSession(currentSession.id);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
      
      // Final cleanup when component unmounts
      if (currentSession && user) {
        quizSessionService.endSession(currentSession.id);
      }
    };
  }, [currentSession, user]);

  const handleStartQuiz = async (kanaType: KanaType) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to start a quiz.",
        variant: "destructive",
      });
      return;
    }

    setSelectedKanaType(kanaType);
    
    // Start a new session
    const session = await quizSessionService.startSession(user.id, kanaType);
    if (session) {
      setCurrentSession(session);
      setQuizStarted(true);
      console.log('Quiz session started:', session.id);
    } else {
      toast({
        title: "Error",
        description: "Failed to start quiz session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEndQuiz = async () => {
    if (currentSession) {
      console.log('Ending quiz session:', currentSession.id);
      const success = await quizSessionService.endSession(currentSession.id);
      if (success) {
        console.log('Quiz session ended successfully');
        toast({
          title: "Quiz completed",
          description: "Your progress has been saved.",
        });
      } else {
        console.error('Failed to end quiz session');
        toast({
          title: "Warning",
          description: "Quiz completed but there was an issue saving the session.",
          variant: "destructive",
        });
      }
    }
    
    setQuizStarted(false);
    setCurrentSession(null);
  };

  if (!user) {
    return (
      <TraditionalBackground>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <TraditionalCard className="p-8 text-center">
            <h3 className="text-xl font-traditional text-paper-warm mb-4">Sign in to Take Quiz</h3>
            <p className="text-wood-light/80 mb-6 font-traditional">Create an account to track your progress and take quizzes.</p>
            <Link to="/auth">
              <Button className="bg-vermilion hover:bg-vermilion/90 text-paper-warm font-traditional">
                Sign In
              </Button>
            </Link>
          </TraditionalCard>
        </div>
      </TraditionalBackground>
    );
  }

  return (
    <TraditionalBackground>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            asChild
            className="mb-4 text-paper-warm hover:text-lantern-warm font-traditional bg-wood-grain/20 border border-wood-light/40"
          >
            <Link to="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <TraditionalCard>
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-traditional text-paper-warm mb-2 tracking-wide">
                {quizStarted ? 'Kana Quiz' : 'Choose Your Quiz'}
              </h1>
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-lantern-warm to-transparent mx-auto"></div>
            </div>
            
            {!quizStarted ? (
              <SimpleQuizSetup onStartQuiz={handleStartQuiz} />
            ) : (
              <SimpleQuizInterface
                kanaType={selectedKanaType}
                onEndQuiz={handleEndQuiz}
                session={currentSession}
              />
            )}
          </div>
        </TraditionalCard>
      </div>
    </TraditionalBackground>
  );
};

export default Quiz;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SimpleQuizSetup from '@/components/quiz/SimpleQuizSetup';
import SimpleQuizInterface from '@/components/quiz/SimpleQuizInterface';
import { KanaType } from '@/types/kana';
import { quizSessionService, QuizSession } from '@/services/quizSessionService';
import TraditionalBackground from '@/components/ui/TraditionalAtmosphere';

const Quiz: React.FC = () => {
  const { user } = useAuth();
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [selectedKanaType, setSelectedKanaType] = useState<KanaType>('hiragana');
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null);

  const handleStartQuiz = async (kanaType: KanaType) => {
    setSelectedKanaType(kanaType);
    
    if (user) {
      const session = await quizSessionService.startSession(user.id, kanaType);
      setCurrentSession(session);
    }
    
    setIsQuizActive(true);
  };

  const handleEndQuiz = async () => {
    if (currentSession) {
      await quizSessionService.endSession(currentSession.id);
      setCurrentSession(null);
    }
    setIsQuizActive(false);
  };

  return (
    <TraditionalBackground>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-glass-wood backdrop-blur-traditional border-b-2 border-wood-light/40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-traditional font-bold text-paper-warm tracking-tight">
                Nihongo Journey
              </span>
            </Link>
            
            <div className="flex items-center gap-4">
              {user ? (
                <Button variant="outline" size="sm" asChild className="bg-wood-grain border-wood-light/40 text-wood-light hover:bg-wood-light hover:text-gion-night font-traditional">
                  <Link to="/profile">Profile</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" asChild className="bg-wood-grain border-wood-light/40 text-wood-light hover:bg-wood-light hover:text-gion-night font-traditional">
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 pb-6">
        <div className="container mx-auto px-4 max-w-4xl">
          {!isQuizActive ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                <Button variant="ghost" size="sm" asChild className="text-wood-light hover:text-lantern-warm font-traditional">
                  <Link to="/" className="flex items-center gap-1">
                    <ArrowLeft size={16} />
                    Back to Home
                  </Link>
                </Button>
              </div>
              
              <div className="text-center py-8">
                <h1 className="text-3xl font-traditional font-bold text-paper-warm mb-4 tracking-wide">
                  Master Japanese Characters
                </h1>
                <p className="text-lg text-wood-light/80 mb-8 font-traditional">
                  Practice Hiragana and Katakana with our endless quiz system
                </p>
              </div>
              
              <SimpleQuizSetup onStartQuiz={handleStartQuiz} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleEndQuiz}
                  className="flex items-center gap-1 bg-wood-grain border-wood-light/40 text-wood-light hover:bg-wood-light hover:text-gion-night font-traditional"
                >
                  <ArrowLeft size={16} />
                  Back to Setup
                </Button>
                <h2 className="text-xl font-traditional font-bold text-paper-warm tracking-wide">
                  {selectedKanaType === 'hiragana' ? 'Hiragana' : 'Katakana'} Quiz
                </h2>
                <div className="w-20"></div>
              </div>
              
              <SimpleQuizInterface 
                kanaType={selectedKanaType}
                onEndQuiz={handleEndQuiz}
                session={currentSession}
              />
            </div>
          )}
        </div>
      </div>
    </TraditionalBackground>
  );
};

export default Quiz;

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Book, ArrowLeft, Settings, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuizSetup from '@/components/quiz/QuizSetup';
import QuizInterface from '@/components/quiz/QuizInterface';
import QuizResults from '@/components/quiz/QuizResults';
import { KanaType, QuizCharacterSet, QuizSettings, QuizSessionStats } from '@/types/quiz';
import { quizService } from '@/services/quizService';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const QuickQuiz: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>('setup');
  const [quizState, setQuizState] = useState<'setup' | 'active' | 'results'>('setup');
  const [selectedKanaType, setSelectedKanaType] = useState<KanaType>('hiragana');
  const [selectedSets, setSelectedSets] = useState<QuizCharacterSet[]>([]);
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    showBasicOnly: false,
    showPreviouslyLearned: true,
    showTroubleCharacters: false,
    characterSize: 'large',
    audioFeedback: true,
    speedMode: true,
  });
  const [quizResults, setQuizResults] = useState<QuizSessionStats | null>(null);
  const [userStats, setUserStats] = useState<{
    longestStreak: number;
    totalCorrect: number;
    totalQuizzes: number;
  }>({
    longestStreak: 0,
    totalCorrect: 0,
    totalQuizzes: 0
  });

  useEffect(() => {
    if (location.state?.fromKanaLearning) {
      setSelectedKanaType(location.state.kanaType || 'hiragana');
    }
  }, [location]);

  useEffect(() => {
    const loadUserStats = async () => {
      if (user) {
        try {
          const recentSessions = await quizService.getRecentQuizSessions(user.id, 20);
          if (recentSessions.length > 0) {
            let longestStreak = 0;
            let totalCorrect = 0;
            recentSessions.forEach(session => {
              if (session.streak && session.streak > longestStreak) {
                longestStreak = session.streak;
              }
              if (session.accuracy) {
                const correctCount = Math.round((session.accuracy / 100) * session.characters_studied.length);
                totalCorrect += correctCount;
              }
            });
            setUserStats({
              longestStreak,
              totalCorrect,
              totalQuizzes: recentSessions.length
            });
          }
        } catch (error) {
          console.error('Error loading user quiz stats:', error);
        }
      }
    };
    loadUserStats();
  }, [user]);

  const handleStartQuiz = (kanaType: KanaType, characterSets: QuizCharacterSet[], settings: QuizSettings) => {
    settings.speedMode = true;
    setSelectedKanaType(kanaType);
    setSelectedSets(characterSets);
    setQuizSettings(settings);
    setQuizState('active');
    setActiveTab('quiz');
  };

  const handleEndQuiz = async (results: QuizSessionStats) => {
    setQuizResults(results);
    setQuizState('results');
    setActiveTab('results');
    
    toast({
      title: "Quiz Complete!",
      description: `You scored ${results.accuracy}% accuracy with ${results.correctCount} correct answers.`,
    });
    
    if (user) {
      setUserStats(prev => ({
        longestStreak: Math.max(prev.longestStreak, results.longestStreak),
        totalCorrect: prev.totalCorrect + results.correctCount,
        totalQuizzes: prev.totalQuizzes + 1
      }));
    }
  };

  const handleReturnToSetup = () => {
    setQuizState('setup');
    setActiveTab('setup');
  };

  return (
    <div className="container mx-auto px-4">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-montserrat font-bold text-indigo tracking-tight">
                Nihongo Journey
              </span>
            </Link>
            
            <div className="flex items-center space-x-2 overflow-x-auto hide-scrollbar">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                asChild
              >
                <Link to="/kana-learning">
                  <Book size={16} />
                  Kana
                </Link>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 bg-indigo/10 text-indigo font-medium"
                asChild
              >
                <Link to="/quick-quiz">
                  Quick Quiz
                </Link>
              </Button>
            </div>

            {user ? (
              <Link to="/dashboard">
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      <div className="pt-16 pb-6">
        <Tabs 
          defaultValue="setup" 
          className="max-w-5xl mx-auto"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          <TabsList className="mb-6 sticky top-16 z-40 bg-background/95 backdrop-blur-sm shadow-sm p-1 rounded-lg max-w-md mx-auto">
            <TabsTrigger 
              value="setup" 
              className="flex items-center gap-2 rounded-md"
              disabled={quizState === 'active'}
            >
              Setup
            </TabsTrigger>
            <TabsTrigger 
              value="quiz" 
              className="flex items-center gap-2 rounded-md"
              disabled={quizState !== 'active'}
            >
              Quiz
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              className="flex items-center gap-2 rounded-md"
              disabled={quizState !== 'results'}
            >
              Results
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup" className="space-y-6 animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <ArrowLeft size={16} />
                    Back
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold text-center text-indigo">Quick Quiz</h1>
                <div className="opacity-0">
                  <Button variant="ghost" size="sm">
                    <Settings size={16} />
                  </Button>
                </div>
              </div>
              
              {user && userStats.totalQuizzes > 0 && (
                <div className="mb-6 p-4 bg-indigo/5 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Your Quiz Stats</h3>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <div>
                      <span className="font-semibold text-indigo">{userStats.totalQuizzes}</span> quizzes taken
                    </div>
                    <div>
                      <span className="font-semibold text-indigo">{userStats.totalCorrect}</span> correct answers
                    </div>
                    <div>
                      <span className="font-semibold text-indigo">{userStats.longestStreak}</span> longest streak
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mb-6 p-4 bg-indigo/5 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Quick Quiz Mode</h3>
                <div className="flex items-center space-x-4 mb-2">
                  <Zap size={18} className="text-indigo" />
                  <div>
                    <p className="text-sm font-medium">Speed Typing Mode</p>
                    <p className="text-xs text-muted-foreground">
                      Type the romaji for each character. Correct answers will automatically advance to the next question.
                    </p>
                  </div>
                </div>
              </div>
              
              <QuizSetup onStartQuiz={handleStartQuiz} />
            </div>
          </TabsContent>
          
          <TabsContent value="quiz" className="space-y-6">
            {quizState === 'active' && (
              <QuizInterface 
                kanaType={selectedKanaType}
                characterSets={selectedSets}
                settings={quizSettings}
                onEndQuiz={handleEndQuiz}
                onCancel={handleReturnToSetup}
              />
            )}
          </TabsContent>
          
          <TabsContent value="results" className="space-y-6">
            {quizState === 'results' && quizResults && (
              <QuizResults 
                results={quizResults}
                onReturnToSetup={handleReturnToSetup}
                onRestartQuiz={() => {
                  setQuizState('active');
                  setActiveTab('quiz');
                }}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QuickQuiz;

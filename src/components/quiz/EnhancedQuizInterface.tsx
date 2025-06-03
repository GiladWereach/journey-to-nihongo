import React, { useState, useEffect, useRef } from 'react';
import { TraditionalCard } from '@/components/ui/TraditionalAtmosphere';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import { KanaType } from '@/types/kana';
import { hiraganaCharacters } from '@/data/hiraganaData';
import { katakanaCharacters } from '@/data/katakanaData';
import { useAuth } from '@/contexts/AuthContext';
import { quizSessionService, QuizSession } from '@/services/quizSessionService';
import { enhancedCharacterProgressService, PracticeMetrics } from '@/services/enhancedCharacterProgressService';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Target } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface EnhancedQuizInterfaceProps {
  kanaType: KanaType;
  onEndQuiz: () => void;
  session: QuizSession | null;
}

interface CharacterWithMastery {
  id: string;
  character: string;
  romaji: string;
  masteryLevel: number;
  confidenceScore: number;
}

interface SessionStats {
  totalTime: number;
  totalSubmittedCharacters: number;
  averageTimePerCharacter: number;
  fastestResponse: number;
  slowestResponse: number;
  submittedAnswersTime: number;
}

const EnhancedQuizInterface: React.FC<EnhancedQuizInterfaceProps> = ({ 
  kanaType, 
  onEndQuiz,
  session
}) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [currentCharacter, setCurrentCharacter] = useState<CharacterWithMastery | null>(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalTime: 0,
    totalSubmittedCharacters: 0,
    averageTimePerCharacter: 0,
    fastestResponse: Infinity,
    slowestResponse: 0,
    submittedAnswersTime: 0
  });
  const [masteryStats, setMasteryStats] = useState({
    new: 0, learning: 0, familiar: 0, practiced: 0, reliable: 0, mastered: 0, total: 0, averageConfidence: 0
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number>(0);
  const sessionStartRef = useRef<number>(Date.now());

  const characters = kanaType === 'hiragana' ? hiraganaCharacters : katakanaCharacters;

  // Load mastery stats
  useEffect(() => {
    if (user) {
      enhancedCharacterProgressService.calculateMasteryStats(user.id, kanaType)
        .then(stats => setMasteryStats(stats));
    }
  }, [user, kanaType, score]);

  const getNextCharacter = async () => {
    if (!user) {
      // Fallback to random selection if no user
      const randomIndex = Math.floor(Math.random() * characters.length);
      const char = characters[randomIndex];
      setCurrentCharacter({
        ...char,
        masteryLevel: 0,
        confidenceScore: 0
      });
      return;
    }

    try {
      const availableCharacterIds = characters.map(char => char.id);
      const selectedCharacterId = await enhancedCharacterProgressService.selectNextCharacter(
        user.id, 
        availableCharacterIds,
        session?.id || 'quiz-session'
      );
      
      const selectedChar = characters.find(char => char.id === selectedCharacterId);
      if (selectedChar) {
        // Get current progress for display
        const progress = await enhancedCharacterProgressService.getEnhancedCharacterProgress(
          user.id, 
          [selectedCharacterId]
        );
        
        const charProgress = progress[0];
        setCurrentCharacter({
          ...selectedChar,
          masteryLevel: charProgress?.mastery_level || 0,
          confidenceScore: charProgress?.confidence_score || 0
        });
        
        // Start timing for this character
        startTimeRef.current = Date.now();
      }
    } catch (error) {
      console.error('Error getting next character:', error);
      // Fallback to random selection
      const randomIndex = Math.floor(Math.random() * characters.length);
      const char = characters[randomIndex];
      setCurrentCharacter({
        ...char,
        masteryLevel: 0,
        confidenceScore: 0
      });
      startTimeRef.current = Date.now();
    }
  };

  useEffect(() => {
    getNextCharacter();
  }, [kanaType, user]);

  // Focus input whenever currentCharacter changes
  useEffect(() => {
    if (currentCharacter && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentCharacter]);

  const updateSessionStats = (responseTime: number) => {
    setSessionStats(prev => {
      const totalTime = Date.now() - sessionStartRef.current;
      const totalSubmittedCharacters = prev.totalSubmittedCharacters + 1;
      const submittedAnswersTime = prev.submittedAnswersTime + responseTime;
      
      return {
        totalTime,
        totalSubmittedCharacters,
        averageTimePerCharacter: totalSubmittedCharacters > 0 ? submittedAnswersTime / totalSubmittedCharacters : 0,
        fastestResponse: Math.min(prev.fastestResponse === Infinity ? responseTime : prev.fastestResponse, responseTime),
        slowestResponse: Math.max(prev.slowestResponse, responseTime),
        submittedAnswersTime
      };
    });
  };

  const processAnswer = async (isCorrect: boolean, inputValue: string) => {
    if (isProcessing || !currentCharacter) return;
    
    setIsProcessing(true);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    // Only measure time for submitted answers
    const responseTime = Date.now() - startTimeRef.current;
    updateSessionStats(responseTime);
    
    const newScore = {
      correct: score.correct + (isCorrect ? 1 : 0),
      total: score.total + 1
    };
    setScore(newScore);

    // Update enhanced progress if user is logged in
    if (user && session) {
      const metrics: PracticeMetrics = {
        responseTime,
        isCorrect,
        sessionId: session.id,
        characterId: currentCharacter.id,
        timestamp: new Date()
      };
      
      await enhancedCharacterProgressService.updateCharacterProgressEnhanced(
        user.id, 
        currentCharacter.id, 
        metrics
      );
      
      await quizSessionService.updateSession(session.id, newScore.total, newScore.correct);
    }

    // Faster feedback - much shorter duration for smoother experience
    const feedbackDuration = isCorrect ? 150 : 400;
    
    setTimeout(async () => {
      await getNextCharacter();
      setUserInput('');
      setFeedback(null);
      setIsProcessing(false);
    }, feedbackDuration);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);

    // Auto-submit on correct answer (immediate feedback)
    if (currentCharacter && value.trim().toLowerCase() === currentCharacter.romaji.toLowerCase()) {
      processAnswer(true, value);
    }
    
    // Auto-submit on wrong answer if the input length equals or exceeds the correct answer length
    // This provides immediate feedback for wrong answers without requiring manual submission
    if (currentCharacter && value.trim().length >= currentCharacter.romaji.length && 
        value.trim().toLowerCase() !== currentCharacter.romaji.toLowerCase()) {
      processAnswer(false, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentCharacter || !userInput.trim() || isProcessing) return;

    const isCorrect = userInput.trim().toLowerCase() === currentCharacter.romaji.toLowerCase();
    processAnswer(isCorrect, userInput);
  };

  const getMasteryLevelName = (level: number): string => {
    const levels = ['New', 'Learning', 'Familiar', 'Practiced', 'Reliable', 'Mastered'];
    return levels[level] || 'Unknown';
  };

  const getMasteryLevelColor = (level: number): string => {
    const colors = [
      'bg-green-100',     // New - light green
      'bg-gray-200',      // Learning - greyish  
      'bg-pink-100',      // Familiar - pink
      'bg-blue-100',      // Practiced - blueish
      'bg-amber-100',     // Reliable - light brown
      'bg-gray-800'       // Mastered - black
    ];
    return colors[level] || 'bg-gray-200';
  };

  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  if (!currentCharacter) return null;

  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  // Compact Stats Component for Mobile
  const CompactStatsSection = () => (
    <div className="space-y-3">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="bg-glass-wood backdrop-blur-traditional border border-wood-light/40 p-2">
          <div className="text-lg font-bold text-lantern-amber font-traditional">{score.correct}</div>
          <div className="text-xs text-wood-light/80 font-traditional">Correct</div>
        </div>
        <div className="bg-glass-wood backdrop-blur-traditional border border-wood-light/40 p-2">
          <div className="text-lg font-bold text-matcha font-traditional">{accuracy}%</div>
          <div className="text-xs text-wood-light/80 font-traditional">Accuracy</div>
        </div>
      </div>

      {/* Session Performance Stats */}
      {sessionStats.totalSubmittedCharacters > 0 && (
        <TraditionalCard className="p-2">
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div>
              <div className="font-semibold text-lantern-amber font-traditional">
                {(sessionStats.averageTimePerCharacter / 1000).toFixed(1)}s
              </div>
              <div className="text-wood-light/70 font-traditional">Avg</div>
            </div>
            <div>
              <div className="font-semibold text-lantern-warm font-traditional">
                {(sessionStats.fastestResponse / 1000).toFixed(1)}s
              </div>
              <div className="text-wood-light/70 font-traditional">Fast</div>
            </div>
          </div>
        </TraditionalCard>
      )}

      {/* Compact Mastery Progress */}
      <TraditionalCard className="p-2">
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-wood-light font-traditional">Progress</span>
            <span className="text-wood-light/70 font-traditional">
              {masteryStats.total > 0 ? Math.round((masteryStats.mastered / masteryStats.total) * 100) : 0}%
            </span>
          </div>
          <div className="bg-gion-night/60 border border-wood-light/30 h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-wood-medium via-wood-light to-gold h-full transition-all duration-1000"
              style={{ width: `${masteryStats.total > 0 ? (masteryStats.mastered / masteryStats.total) * 100 : 0}%` }}
            />
          </div>
        </div>
      </TraditionalCard>
    </div>
  );

  // Desktop Stats Component (original design)
  const DesktopStatsSection = () => (
    <div className="space-y-6">
      {/* Enhanced Stats Section with Traditional Styling */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
        <div className="bg-glass-wood backdrop-blur-traditional border border-wood-light/40 p-3">
          <div className="text-2xl font-bold text-lantern-amber font-traditional">{score.correct}</div>
          <div className="text-sm text-wood-light/80 font-traditional">Correct</div>
        </div>
        <div className="bg-glass-wood backdrop-blur-traditional border border-wood-light/40 p-3">
          <div className="text-2xl font-bold text-wood-light font-traditional">{score.total}</div>
          <div className="text-sm text-wood-light/80 font-traditional">Total</div>
        </div>
        <div className="bg-glass-wood backdrop-blur-traditional border border-wood-light/40 p-3">
          <div className="text-2xl font-bold text-matcha font-traditional">{accuracy}%</div>
          <div className="text-sm text-wood-light/80 font-traditional">Accuracy</div>
        </div>
        <div className="bg-glass-wood backdrop-blur-traditional border border-wood-light/40 p-3">
          <div className="text-lg font-bold text-lantern-warm flex items-center justify-center gap-1 font-traditional">
            <Clock className="h-4 w-4" />
            {formatTime(sessionStats.submittedAnswersTime)}
          </div>
          <div className="text-sm text-wood-light/80 font-traditional">Active Time</div>
        </div>
        <div className="bg-glass-wood backdrop-blur-traditional border border-wood-light/40 p-3">
          <div className="text-lg font-bold text-vermilion flex items-center justify-center gap-1 font-traditional">
            <Target className="h-4 w-4" />
            {sessionStats.totalSubmittedCharacters}
          </div>
          <div className="text-sm text-wood-light/80 font-traditional">Submitted</div>
        </div>
      </div>

      {/* Session Performance Stats */}
      {sessionStats.totalSubmittedCharacters > 0 && (
        <TraditionalCard className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-semibold text-lantern-amber font-traditional">
                {(sessionStats.averageTimePerCharacter / 1000).toFixed(1)}s
              </div>
              <div className="text-wood-light/70 font-traditional">Avg Time</div>
            </div>
            <div>
              <div className="font-semibold text-lantern-warm font-traditional">
                {(sessionStats.fastestResponse / 1000).toFixed(1)}s
              </div>
              <div className="text-wood-light/70 font-traditional">Fastest</div>
            </div>
            <div>
              <div className="font-semibold text-vermilion font-traditional">
                {(sessionStats.slowestResponse / 1000).toFixed(1)}s
              </div>
              <div className="text-wood-light/70 font-traditional">Slowest</div>
            </div>
          </div>
        </TraditionalCard>
      )}

      {/* Mastery Progress Overview */}
      <TraditionalCard className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-wood-light font-traditional">Overall Progress</span>
            <span className="text-sm text-wood-light/70 font-traditional">
              {masteryStats.total > 0 ? Math.round((masteryStats.mastered / masteryStats.total) * 100) : 0}% Mastered
            </span>
          </div>
          <div className="bg-gion-night/60 border border-wood-light/30 h-2 rounded-none overflow-hidden">
            <div 
              className="bg-gradient-to-r from-wood-medium via-wood-light to-gold h-full transition-all duration-1000"
              style={{ width: `${masteryStats.total > 0 ? (masteryStats.mastered / masteryStats.total) * 100 : 0}%` }}
            />
          </div>
          <div className="grid grid-cols-6 gap-1 text-xs">
            <div className="text-center">
              <div className="text-lantern-amber font-traditional">{masteryStats.new}</div>
              <div className="text-wood-light/60 font-traditional">New</div>
            </div>
            <div className="text-center">
              <div className="text-wood-light/80 font-traditional">{masteryStats.learning}</div>
              <div className="text-wood-light/60 font-traditional">Learning</div>
            </div>
            <div className="text-center">
              <div className="text-vermilion font-traditional">{masteryStats.familiar}</div>
              <div className="text-wood-light/60 font-traditional">Familiar</div>
            </div>
            <div className="text-center">
              <div className="text-lantern-warm font-traditional">{masteryStats.practiced}</div>
              <div className="text-wood-light/60 font-traditional">Practiced</div>
            </div>
            <div className="text-center">
              <div className="text-gold font-traditional">{masteryStats.reliable}</div>
              <div className="text-wood-light/60 font-traditional">Reliable</div>
            </div>
            <div className="text-center">
              <div className="text-paper-warm font-traditional">{masteryStats.mastered}</div>
              <div className="text-wood-light/60 font-traditional">Mastered</div>
            </div>
          </div>
        </div>
      </TraditionalCard>
    </div>
  );

  // Main Quiz Component
  const QuizSection = () => (
    <TraditionalCard className="p-4 md:p-6">
      <div className="text-center space-y-4 md:space-y-6">
        <div className="space-y-2 md:space-y-3">
          <div className="flex justify-center items-center gap-2 flex-wrap">
            <h3 className="text-sm md:text-base font-medium text-wood-light font-traditional">
              What is the romaji?
            </h3>
            {user && (
              <Badge 
                className={`${getMasteryLevelColor(currentCharacter.masteryLevel)} text-gion-night font-traditional text-xs`}
                variant="secondary"
              >
                {getMasteryLevelName(currentCharacter.masteryLevel)}
              </Badge>
            )}
          </div>
          
          <div className="py-4 md:py-6 relative">
            <JapaneseCharacter 
              character={currentCharacter.character}
              size="xl"
              color={kanaType === 'hiragana' ? 'text-matcha' : 'text-vermilion'}
              className="text-5xl md:text-6xl lg:text-8xl"
            />
            {user && currentCharacter.confidenceScore > 0 && (
              <div className="absolute bottom-0 right-1/2 transform translate-x-1/2">
                <div className="text-xs text-wood-light/60 font-traditional">
                  Confidence: {currentCharacter.confidenceScore}%
                </div>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <Input
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type the romaji..."
            className="text-center text-base md:text-lg py-2 md:py-3 bg-glass-wood border-wood-light/40 text-paper-warm placeholder:text-wood-light/50 font-traditional"
            disabled={feedback !== null || isProcessing}
            autoFocus
          />
          
          {feedback === null && !isProcessing && userInput.trim().length < (currentCharacter.romaji.length) && (
            <Button 
              type="submit" 
              className="w-full py-2 md:py-3 text-sm md:text-base bg-wood-grain border-wood-light/40 text-wood-light hover:bg-wood-light hover:text-gion-night font-traditional"
              disabled={!userInput.trim()}
            >
              Submit
            </Button>
          )}
        </form>

        {/* Enhanced Feedback */}
        {feedback && (
          <div className={`p-3 md:p-4 transition-all duration-200 border-2 ${
            feedback === 'correct' 
              ? 'bg-glass-wood border-lantern-amber/60 text-lantern-warm' 
              : 'bg-glass-wood border-vermilion/60 text-vermilion'
          }`}>
            {feedback === 'correct' ? (
              <div className="space-y-1 md:space-y-2">
                <div className="text-sm md:text-base font-semibold font-traditional">✅ Correct!</div>
                <div className="font-traditional text-sm md:text-base">{currentCharacter.character} = {currentCharacter.romaji}</div>
                {user && (
                  <div className="text-xs md:text-sm font-traditional">
                    Response time: {((Date.now() - startTimeRef.current) / 1000).toFixed(1)}s
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1 md:space-y-2">
                <div className="text-sm md:text-base font-semibold font-traditional">❌ Incorrect</div>
                <div className="font-traditional text-sm md:text-base">{currentCharacter.character} = {currentCharacter.romaji}</div>
                <div className="text-xs md:text-sm font-traditional">You typed: {userInput}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </TraditionalCard>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Mobile Layout: Side by side */}
      <div className="flex flex-col lg:block">
        {/* Mobile: Main quiz and compact stats side by side */}
        <div className="flex flex-col md:flex-row lg:hidden gap-4 mb-4">
          {/* Main Quiz Section - Priority above fold */}
          <div className="flex-1 md:flex-[2]">
            <QuizSection />
          </div>
          
          {/* Compact Stats Section - Sidebar */}
          <div className="w-full md:w-64 md:flex-shrink-0">
            <CompactStatsSection />
          </div>
        </div>

        {/* Desktop Layout: Original stacked design */}
        <div className="hidden lg:block space-y-6">
          <DesktopStatsSection />
          <QuizSection />
        </div>

        {/* End Quiz Button - Always at bottom */}
        <div className="text-center mt-4">
          <Button 
            variant="outline" 
            onClick={onEndQuiz} 
            disabled={isProcessing}
            className="bg-wood-grain border-wood-light/40 text-wood-light hover:bg-wood-light hover:text-gion-night font-traditional"
          >
            End Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedQuizInterface;

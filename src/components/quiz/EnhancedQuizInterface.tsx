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
import { Clock, Target, TrendingUp } from 'lucide-react';
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

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Main Quiz Content - Takes up most of the space */}
      <div className="flex-1 min-w-0">
        <TraditionalCard className="h-full flex flex-col justify-center p-6 lg:p-8">
          <div className="text-center space-y-6 lg:space-y-8">
            {/* Question Header */}
            <div className="space-y-3">
              <div className="flex justify-center items-center gap-3 flex-wrap">
                <h3 className="text-lg lg:text-xl font-medium text-wood-light font-traditional">
                  What is the romaji?
                </h3>
                {user && (
                  <Badge 
                    className={`${getMasteryLevelColor(currentCharacter.masteryLevel)} text-gion-night font-traditional`}
                    variant="secondary"
                  >
                    {getMasteryLevelName(currentCharacter.masteryLevel)}
                  </Badge>
                )}
              </div>
              
              {/* Large Character Display */}
              <div className="py-8 lg:py-12 relative">
                <JapaneseCharacter 
                  character={currentCharacter.character}
                  size="xl"
                  color={kanaType === 'hiragana' ? 'text-matcha' : 'text-vermilion'}
                  className="text-8xl lg:text-9xl xl:text-[12rem]"
                />
                {user && currentCharacter.confidenceScore > 0 && (
                  <div className="absolute bottom-0 right-1/2 transform translate-x-1/2">
                    <div className="text-sm text-wood-light/60 font-traditional">
                      Confidence: {currentCharacter.confidenceScore}%
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input Section */}
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
              <Input
                ref={inputRef}
                value={userInput}
                onChange={handleInputChange}
                placeholder="Type the romaji..."
                className="text-center text-xl lg:text-2xl py-4 bg-glass-wood border-wood-light/40 text-paper-warm placeholder:text-wood-light/50 font-traditional"
                disabled={feedback !== null || isProcessing}
                autoFocus
              />
              
              {feedback === null && !isProcessing && userInput.trim().length < (currentCharacter.romaji.length) && (
                <Button 
                  type="submit" 
                  className="w-full py-4 text-lg bg-wood-grain border-wood-light/40 text-wood-light hover:bg-wood-light hover:text-gion-night font-traditional"
                  disabled={!userInput.trim()}
                >
                  Submit
                </Button>
              )}
            </form>

            {/* Feedback Section */}
            {feedback && (
              <div className={`p-4 lg:p-6 transition-all duration-200 border-2 max-w-md mx-auto ${
                feedback === 'correct' 
                  ? 'bg-glass-wood border-lantern-amber/60 text-lantern-warm' 
                  : 'bg-glass-wood border-vermilion/60 text-vermilion'
              }`}>
                {feedback === 'correct' ? (
                  <div className="space-y-2">
                    <div className="text-lg font-semibold font-traditional">✅ Correct!</div>
                    <div className="font-traditional text-lg">{currentCharacter.character} = {currentCharacter.romaji}</div>
                    {user && (
                      <div className="text-sm font-traditional">
                        Response time: {((Date.now() - startTimeRef.current) / 1000).toFixed(1)}s
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-lg font-semibold font-traditional">❌ Incorrect</div>
                    <div className="font-traditional text-lg">{currentCharacter.character} = {currentCharacter.romaji}</div>
                    <div className="text-sm font-traditional">You typed: {userInput}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </TraditionalCard>
      </div>

      {/* Sidebar with Stats and Progress */}
      <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 space-y-4">
        {/* Quick Stats */}
        <TraditionalCard className="p-4">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-wood-light font-traditional flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Session Stats
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-glass-wood backdrop-blur-traditional border border-wood-light/40">
                <div className="text-2xl font-bold text-lantern-amber font-traditional">{score.correct}</div>
                <div className="text-sm text-wood-light/80 font-traditional">Correct</div>
              </div>
              <div className="text-center p-3 bg-glass-wood backdrop-blur-traditional border border-wood-light/40">
                <div className="text-2xl font-bold text-matcha font-traditional">{accuracy}%</div>
                <div className="text-sm text-wood-light/80 font-traditional">Accuracy</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-wood-light/70 font-traditional">Total Answered</span>
                <span className="text-wood-light font-traditional">{score.total}</span>
              </div>
              {sessionStats.totalSubmittedCharacters > 0 && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-wood-light/70 font-traditional">Avg Time</span>
                    <span className="text-wood-light font-traditional">
                      {(sessionStats.averageTimePerCharacter / 1000).toFixed(1)}s
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-wood-light/70 font-traditional">Fastest</span>
                    <span className="text-lantern-warm font-traditional">
                      {(sessionStats.fastestResponse / 1000).toFixed(1)}s
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </TraditionalCard>

        {/* Overall Progress */}
        <TraditionalCard className="p-4">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-wood-light font-traditional">
              Overall Progress
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-wood-light/70 font-traditional">Mastery Progress</span>
                <span className="text-sm text-wood-light font-traditional">
                  {masteryStats.total > 0 ? Math.round((masteryStats.mastered / masteryStats.total) * 100) : 0}%
                </span>
              </div>
              
              <div className="bg-gion-night/60 border border-wood-light/30 h-2 rounded-none overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-wood-medium via-wood-light to-gold h-full transition-all duration-1000"
                  style={{ width: `${masteryStats.total > 0 ? (masteryStats.mastered / masteryStats.total) * 100 : 0}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-lantern-amber font-traditional font-semibold">{masteryStats.new}</div>
                  <div className="text-wood-light/60 font-traditional">New</div>
                </div>
                <div className="text-center">
                  <div className="text-vermilion font-traditional font-semibold">{masteryStats.learning + masteryStats.familiar}</div>
                  <div className="text-wood-light/60 font-traditional">Learning</div>
                </div>
                <div className="text-center">
                  <div className="text-gold font-traditional font-semibold">{masteryStats.mastered}</div>
                  <div className="text-wood-light/60 font-traditional">Mastered</div>
                </div>
              </div>
            </div>
          </div>
        </TraditionalCard>

        {/* Session Timer */}
        {sessionStats.totalSubmittedCharacters > 0 && (
          <TraditionalCard className="p-4">
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-wood-light font-traditional flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Session Time
              </h4>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-wood-light/70 font-traditional">Active Time</span>
                  <span className="text-lantern-warm font-traditional">
                    {formatTime(sessionStats.submittedAnswersTime)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-wood-light/70 font-traditional">Characters/min</span>
                  <span className="text-wood-light font-traditional">
                    {sessionStats.submittedAnswersTime > 0 ? 
                      Math.round((sessionStats.totalSubmittedCharacters * 60000) / sessionStats.submittedAnswersTime) : 0}
                  </span>
                </div>
              </div>
            </div>
          </TraditionalCard>
        )}

        {/* End Quiz Button */}
        <Button 
          variant="outline" 
          onClick={onEndQuiz} 
          disabled={isProcessing}
          className="w-full py-3 bg-wood-grain border-wood-light/40 text-wood-light hover:bg-wood-light hover:text-gion-night font-traditional"
        >
          End Quiz
        </Button>
      </div>
    </div>
  );
};

export default EnhancedQuizInterface;

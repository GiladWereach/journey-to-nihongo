
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Enhanced Stats Section with Session Info */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-indigo">{score.correct}</div>
          <div className="text-sm text-gray-600">Correct</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-600">{score.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-matcha">{accuracy}%</div>
          <div className="text-sm text-gray-600">Accuracy</div>
        </div>
        <div>
          <div className="text-lg font-bold text-blue-600 flex items-center justify-center gap-1">
            <Clock className="h-4 w-4" />
            {formatTime(sessionStats.submittedAnswersTime)}
          </div>
          <div className="text-sm text-gray-600">Active Time</div>
        </div>
        <div>
          <div className="text-lg font-bold text-purple-600 flex items-center justify-center gap-1">
            <Target className="h-4 w-4" />
            {sessionStats.totalSubmittedCharacters}
          </div>
          <div className="text-sm text-gray-600">Submitted</div>
        </div>
      </div>

      {/* Session Performance Stats */}
      {sessionStats.totalSubmittedCharacters > 0 && (
        <Card className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-semibold text-green-600">
                {(sessionStats.averageTimePerCharacter / 1000).toFixed(1)}s
              </div>
              <div className="text-gray-600">Avg Time</div>
            </div>
            <div>
              <div className="font-semibold text-blue-600">
                {(sessionStats.fastestResponse / 1000).toFixed(1)}s
              </div>
              <div className="text-gray-600">Fastest</div>
            </div>
            <div>
              <div className="font-semibold text-orange-600">
                {(sessionStats.slowestResponse / 1000).toFixed(1)}s
              </div>
              <div className="text-gray-600">Slowest</div>
            </div>
          </div>
        </Card>
      )}

      {/* Mastery Progress Overview */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-gray-600">
              {masteryStats.total > 0 ? Math.round((masteryStats.mastered / masteryStats.total) * 100) : 0}% Mastered
            </span>
          </div>
          <Progress 
            value={masteryStats.total > 0 ? (masteryStats.mastered / masteryStats.total) * 100 : 0} 
            className="h-2"
          />
          <div className="grid grid-cols-6 gap-1 text-xs">
            <div className="text-center">
              <div className="text-green-600">{masteryStats.new}</div>
              <div>New</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500">{masteryStats.learning}</div>
              <div>Learning</div>
            </div>
            <div className="text-center">
              <div className="text-pink-500">{masteryStats.familiar}</div>
              <div>Familiar</div>
            </div>
            <div className="text-center">
              <div className="text-blue-500">{masteryStats.practiced}</div>
              <div>Practiced</div>
            </div>
            <div className="text-center">
              <div className="text-amber-600">{masteryStats.reliable}</div>
              <div>Reliable</div>
            </div>
            <div className="text-center">
              <div className="text-gray-800">{masteryStats.mastered}</div>
              <div>Mastered</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Enhanced Quiz Card */}
      <Card className="p-8">
        <CardContent className="text-center space-y-8">
          <div className="space-y-4">
            <div className="flex justify-center items-center gap-2">
              <h3 className="text-lg font-medium text-gray-600">
                What is the romaji for this character?
              </h3>
              {user && (
                <Badge 
                  className={`${getMasteryLevelColor(currentCharacter.masteryLevel)} text-gray-800`}
                  variant="secondary"
                >
                  {getMasteryLevelName(currentCharacter.masteryLevel)}
                </Badge>
              )}
            </div>
            
            <div className="py-8 relative">
              <JapaneseCharacter 
                character={currentCharacter.character}
                size="xl"
                color={kanaType === 'hiragana' ? 'text-matcha' : 'text-vermilion'}
                className="text-8xl"
              />
              {user && currentCharacter.confidenceScore > 0 && (
                <div className="absolute bottom-0 right-1/2 transform translate-x-1/2">
                  <div className="text-xs text-gray-500">
                    Confidence: {currentCharacter.confidenceScore}%
                  </div>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              placeholder="Type the romaji..."
              className="text-center text-xl py-3"
              disabled={feedback !== null || isProcessing}
              autoFocus
            />
            
            {feedback === null && !isProcessing && userInput.trim().length < (currentCharacter.romaji.length) && (
              <Button 
                type="submit" 
                className="w-full py-3 text-lg"
                disabled={!userInput.trim()}
              >
                Submit
              </Button>
            )}
          </form>

          {/* Enhanced Feedback */}
          {feedback && (
            <div className={`p-4 rounded-lg transition-all duration-200 ${
              feedback === 'correct' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {feedback === 'correct' ? (
                <div className="space-y-2">
                  <div className="text-lg font-semibold">✅ Correct!</div>
                  <div>{currentCharacter.character} = {currentCharacter.romaji}</div>
                  {user && (
                    <div className="text-sm">
                      Response time: {((Date.now() - startTimeRef.current) / 1000).toFixed(1)}s
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-lg font-semibold">❌ Incorrect</div>
                  <div>{currentCharacter.character} = {currentCharacter.romaji}</div>
                  <div className="text-sm">You typed: {userInput}</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* End Quiz Button */}
      <div className="text-center">
        <Button variant="outline" onClick={onEndQuiz} disabled={isProcessing}>
          End Quiz
        </Button>
      </div>
    </div>
  );
};

export default EnhancedQuizInterface;

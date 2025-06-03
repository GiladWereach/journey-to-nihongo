
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
  const [masteryStats, setMasteryStats] = useState({
    new: 0, learning: 0, familiar: 0, practiced: 0, reliable: 0, mastered: 0, total: 0, averageConfidence: 0
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number>(0);

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
        
        // Start timing
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

  const processAnswer = async (isCorrect: boolean, inputValue: string) => {
    if (isProcessing || !currentCharacter) return;
    
    setIsProcessing(true);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    const responseTime = Date.now() - startTimeRef.current;
    
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

    // Auto-advance after showing feedback
    const feedbackDuration = isCorrect ? 400 : 1000;
    
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

    // Check if the input matches the correct answer (case insensitive)
    if (currentCharacter && value.trim().toLowerCase() === currentCharacter.romaji.toLowerCase()) {
      processAnswer(true, value);
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
      'bg-gray-500',      // New
      'bg-red-500',       // Learning
      'bg-orange-500',    // Familiar
      'bg-yellow-500',    // Practiced
      'bg-blue-500',      // Reliable
      'bg-green-500'      // Mastered
    ];
    return colors[level] || 'bg-gray-500';
  };

  if (!currentCharacter) return null;

  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Enhanced Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
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
          <div className="text-2xl font-bold text-vermilion">{masteryStats.mastered}</div>
          <div className="text-sm text-gray-600">Mastered</div>
        </div>
      </div>

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
              <div className="text-gray-500">{masteryStats.new}</div>
              <div>New</div>
            </div>
            <div className="text-center">
              <div className="text-red-500">{masteryStats.learning}</div>
              <div>Learning</div>
            </div>
            <div className="text-center">
              <div className="text-orange-500">{masteryStats.familiar}</div>
              <div>Familiar</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-500">{masteryStats.practiced}</div>
              <div>Practiced</div>
            </div>
            <div className="text-center">
              <div className="text-blue-500">{masteryStats.reliable}</div>
              <div>Reliable</div>
            </div>
            <div className="text-center">
              <div className="text-green-500">{masteryStats.mastered}</div>
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
                  className={`${getMasteryLevelColor(currentCharacter.masteryLevel)} text-white`}
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
            
            {feedback === null && !isProcessing && (
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
            <div className={`p-4 rounded-lg transition-all duration-300 ${
              feedback === 'correct' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
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

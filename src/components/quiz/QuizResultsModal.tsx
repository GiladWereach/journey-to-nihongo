
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Target, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizResult {
  character: string;
  romaji: string;
  userAnswer: string;
  correct: boolean;
  timeSpent: number;
}

interface QuizResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: QuizResult[];
  totalTime: number;
  accuracy: number;
  onRetryWeak?: () => void;
  onContinue?: () => void;
}

const QuizResultsModal: React.FC<QuizResultsModalProps> = ({
  isOpen,
  onClose,
  results,
  totalTime,
  accuracy,
  onRetryWeak,
  onContinue
}) => {
  const correctAnswers = results.filter(r => r.correct).length;
  const averageTime = totalTime / results.length;
  const weakCharacters = results.filter(r => !r.correct);

  const getAccuracyColor = (acc: number) => {
    if (acc >= 90) return 'text-green-600 bg-green-50';
    if (acc >= 70) return 'text-blue-600 bg-blue-50';
    if (acc >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getPerformanceMessage = (acc: number) => {
    if (acc >= 90) return 'Excellent work! 🎉';
    if (acc >= 70) return 'Great job! 👏';
    if (acc >= 50) return 'Good effort! 👍';
    return 'Keep practicing! 💪';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Quiz Complete!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className={cn('text-3xl font-bold mb-2', getAccuracyColor(accuracy))}>
                  {accuracy}%
                </div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
                <div className="text-xs mt-1">{correctAnswers}/{results.length} correct</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-blue-500 mr-1" />
                  <span className="text-2xl font-bold">{(averageTime / 1000).toFixed(1)}s</span>
                </div>
                <div className="text-sm text-muted-foreground">Avg Time</div>
                <div className="text-xs mt-1">Total: {(totalTime / 1000).toFixed(1)}s</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-1" />
                  <span className="text-2xl font-bold">{Math.max(0, Math.round((accuracy - 50) / 10))}</span>
                </div>
                <div className="text-sm text-muted-foreground">Progress Points</div>
                <div className="text-xs mt-1">Earned this session</div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Message */}
          <div className={cn('p-4 rounded-lg text-center font-semibold', getAccuracyColor(accuracy))}>
            {getPerformanceMessage(accuracy)}
          </div>

          {/* Incorrect Answers */}
          {weakCharacters.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Characters to Review ({weakCharacters.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {weakCharacters.map((result, index) => (
                    <div
                      key={index}
                      className="p-3 border border-red-200 bg-red-50 rounded-lg text-center"
                    >
                      <div className="text-2xl mb-1">{result.character}</div>
                      <div className="text-sm text-muted-foreground">{result.romaji}</div>
                      <div className="text-xs text-red-600 mt-1">
                        Your answer: {result.userAnswer || 'No answer'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Results */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Detailed Results</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-center justify-between p-2 rounded border',
                      result.correct 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-red-200 bg-red-50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{result.character}</span>
                      <span className="text-sm">{result.romaji}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={result.correct ? 'default' : 'destructive'}>
                        {result.correct ? 'Correct' : 'Wrong'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {(result.timeSpent / 1000).toFixed(1)}s
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {weakCharacters.length > 0 && onRetryWeak && (
              <Button 
                onClick={onRetryWeak}
                variant="outline"
                className="flex-1"
              >
                Practice Weak Characters ({weakCharacters.length})
              </Button>
            )}
            
            {onContinue && (
              <Button 
                onClick={onContinue}
                className="flex-1"
              >
                Continue Learning
              </Button>
            )}
            
            <Button 
              onClick={onClose}
              variant={onContinue ? "outline" : "default"}
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizResultsModal;

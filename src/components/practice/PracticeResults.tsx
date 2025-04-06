
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PracticeResult } from '@/types/kana';
import { ArrowLeft, BarChart, Check, RotateCcw, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PracticeResultsProps {
  results: PracticeResult;
  onReturn: () => void;
}

const PracticeResults: React.FC<PracticeResultsProps> = ({ results, onReturn }) => {
  // Calculate performance metrics
  const accuracy = results.accuracy;
  const correctCount = results.correctAnswers;
  const totalCount = results.totalQuestions;
  
  // Get performance feedback message
  const getPerformanceFeedback = () => {
    if (accuracy >= 90) return "Excellent! You've mastered these characters.";
    if (accuracy >= 70) return "Great job! You're making good progress.";
    if (accuracy >= 50) return "Good effort! Keep practicing to improve.";
    return "Keep practicing. These characters need more attention.";
  };
  
  // Get color based on accuracy
  const getAccuracyColor = () => {
    if (accuracy >= 90) return "text-green-500";
    if (accuracy >= 70) return "text-blue-500";
    if (accuracy >= 50) return "text-yellow-500";
    return "text-red-500";
  };
  
  // Get characters that were incorrect
  const incorrectCharacters = results.characterResults.filter(result => !result.correct);
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl text-center">Practice Results</CardTitle>
          <CardDescription className="text-center">
            You answered {correctCount} out of {totalCount} questions correctly
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Accuracy display */}
          <div className="text-center">
            <div className="text-sm font-medium mb-1">Accuracy</div>
            <div className={`text-4xl font-bold ${getAccuracyColor()}`}>
              {Math.round(accuracy)}%
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {getPerformanceFeedback()}
            </div>
          </div>
          
          {/* Results visualization */}
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3">Character Results</h3>
            
            <div className="grid grid-cols-5 gap-2">
              {results.characterResults.map((result, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "flex flex-col items-center justify-center p-2 border rounded",
                    result.correct ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                  )}
                >
                  <div className="text-xl mb-1">{result.character}</div>
                  <div className="flex items-center justify-center">
                    {result.correct ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Improvement suggestions */}
          {incorrectCharacters.length > 0 && (
            <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Focus on These Characters</h3>
              <p className="text-xs text-gray-600 mb-3">
                These characters need more practice:
              </p>
              
              <div className="flex flex-wrap gap-2">
                {incorrectCharacters.map((result, index) => (
                  <div 
                    key={index} 
                    className="px-3 py-2 bg-white border border-amber-300 rounded text-lg"
                  >
                    {result.character}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onReturn}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Learning
          </Button>
          
          <Button 
            onClick={onReturn} 
            className="flex items-center gap-1"
          >
            <RotateCcw className="h-4 w-4" />
            Practice Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PracticeResults;

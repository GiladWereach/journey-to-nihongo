
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Repeat, 
  Home, 
  Award, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2
} from 'lucide-react';
import { QuizSessionStats } from '@/types/quiz';
import { Progress } from '@/components/ui/progress';

interface QuizResultsProps {
  results: QuizSessionStats;
  onReturnToSetup: () => void;
  onRestartQuiz: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ 
  results,
  onReturnToSetup,
  onRestartQuiz
}) => {
  // Calculate minutes and seconds from duration
  const minutes = Math.floor((results.durationSeconds || 0) / 60);
  const seconds = (results.durationSeconds || 0) % 60;
  
  // Calculate statistics
  const uniqueCharacters = [...new Set(results.characterResults.map(r => r.character))].length;
  const incorrectCharacters = results.characterResults.filter(r => !r.correct);
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-indigo">Quiz Results</h1>
        <p className="text-muted-foreground">
          You completed your practice session!
        </p>
      </div>
      
      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center text-center p-4 bg-muted/40 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <BarChart className="h-8 w-8 text-indigo mb-2" />
                </div>
                <h3 className="text-4xl font-bold text-indigo mb-1">{results.accuracy}%</h3>
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <Progress 
                  value={results.accuracy} 
                  max={100}
                  className="h-2 mt-2 w-full max-w-32"
                />
              </div>
              
              <div className="flex flex-col items-center text-center p-4 bg-muted/40 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                </div>
                <h3 className="text-4xl font-bold text-green-600 mb-1">{results.longestStreak}</h3>
                <p className="text-sm text-muted-foreground">Longest Streak</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="flex flex-col items-center text-center p-3 bg-muted/20 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 mb-1" />
                <h4 className="text-2xl font-bold">{results.correctCount}</h4>
                <p className="text-xs text-muted-foreground">Correct</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-3 bg-muted/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500 mb-1" />
                <h4 className="text-2xl font-bold">{results.incorrectCount}</h4>
                <p className="text-xs text-muted-foreground">Incorrect</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-3 bg-muted/20 rounded-lg">
                <Award className="h-5 w-5 text-amber-500 mb-1" />
                <h4 className="text-2xl font-bold">{uniqueCharacters}</h4>
                <p className="text-xs text-muted-foreground">Characters</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-3 bg-muted/20 rounded-lg">
                <Clock className="h-5 w-5 text-blue-500 mb-1" />
                <h4 className="text-2xl font-bold">{minutes}:{seconds.toString().padStart(2, '0')}</h4>
                <p className="text-xs text-muted-foreground">Duration</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {incorrectCharacters.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Characters to Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {incorrectCharacters.map((result, index) => (
                  <div 
                    key={`${result.character}-${index}`} 
                    className="flex flex-col items-center p-3 border rounded-lg"
                  >
                    <div className="text-2xl mb-1">{result.character}</div>
                    <div className="text-sm font-medium">{result.romaji}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onReturnToSetup}
        >
          <Home size={16} />
          Back to Setup
        </Button>
        
        <Button
          className="flex items-center gap-2 bg-indigo hover:bg-indigo/90"
          onClick={onRestartQuiz}
        >
          <Repeat size={16} />
          Practice Again
        </Button>
      </div>
    </div>
  );
};

export default QuizResults;

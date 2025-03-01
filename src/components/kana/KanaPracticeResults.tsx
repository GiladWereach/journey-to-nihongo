
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, RotateCcw, Home, BarChart } from "lucide-react";
import { PracticeResult } from '@/types/kana';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { cn } from '@/lib/utils';

interface KanaPracticeResultsProps {
  results: PracticeResult;
  onPracticeSimilar: () => void;
  onPracticeAgain: () => void;
  onFinish: () => void;
}

const KanaPracticeResults: React.FC<KanaPracticeResultsProps> = ({
  results,
  onPracticeSimilar,
  onPracticeAgain,
  onFinish
}) => {
  // Get characters with mistakes
  const mistakes = results.characterResults.filter(result => !result.correct);
  
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Practice Results</CardTitle>
          <CardDescription className="text-center">
            You completed {results.totalQuestions} questions with {results.correctAnswers} correct answers
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="border rounded-lg p-6 bg-gray-50">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold">Accuracy</h3>
              <div className="text-4xl font-bold text-indigo mt-2">
                {results.accuracy.toFixed(0)}%
              </div>
            </div>
            
            <ProgressIndicator 
              progress={results.accuracy} 
              size="md"
              color={cn(
                results.accuracy >= 80 ? "bg-green-500" : 
                results.accuracy >= 60 ? "bg-yellow-500" : 
                "bg-red-500"
              )}
              showTicks
              animated={results.accuracy >= 90}
              proficiencyLevel={
                results.accuracy >= 90 ? "mastered" :
                results.accuracy >= 70 ? "advanced" :
                results.accuracy >= 50 ? "intermediate" :
                "beginner"
              }
            />
            
            <div className="mt-4 text-center text-sm text-gray-600">
              {results.accuracy >= 90 ? (
                "Excellent! You've mastered these characters."
              ) : results.accuracy >= 80 ? (
                "Great job! You're doing well with these characters."
              ) : results.accuracy >= 60 ? (
                "Good progress, but there's room for improvement."
              ) : (
                "Keep practicing. These characters need more attention."
              )}
            </div>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Character Results</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {results.characterResults.map((result, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "border rounded-md p-3 flex flex-col items-center",
                    result.correct ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                  )}
                >
                  <div className="text-2xl mb-1">{result.character}</div>
                  <div className="flex items-center text-sm">
                    {result.correct ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-green-600">Correct</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-600 mr-1" />
                        <span className="text-red-600">Incorrect</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {mistakes.length > 0 && (
            <div className="border rounded-lg p-6 bg-amber-50 border-amber-200">
              <h3 className="text-lg font-semibold mb-2">Practice Suggestions</h3>
              <p className="mb-4">
                Consider spending more time on these characters that you found challenging:
              </p>
              <div className="flex flex-wrap gap-2">
                {mistakes.map((mistake, index) => (
                  <span key={index} className="text-lg px-3 py-1 bg-white border border-amber-300 rounded-md">
                    {mistake.character}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
          <Button 
            variant="outline" 
            className="border-indigo text-indigo hover:bg-indigo/10 flex items-center gap-2"
            onClick={onFinish}
          >
            <Home size={16} />
            <span>Return to Learning</span>
          </Button>
          
          <div className="flex gap-3">
            {mistakes.length > 0 && (
              <Button 
                className="bg-amber-500 hover:bg-amber-600 flex items-center gap-2"
                onClick={onPracticeSimilar}
              >
                <RotateCcw size={16} />
                <span>Practice Similar Characters</span>
              </Button>
            )}
            
            <Button 
              className="bg-indigo hover:bg-indigo/90 flex items-center gap-2"
              onClick={onPracticeAgain}
            >
              <RotateCcw size={16} />
              <span>Practice Again</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default KanaPracticeResults;

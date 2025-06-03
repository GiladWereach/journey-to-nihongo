
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { assessmentQuestions } from '@/data/assessmentQuestions';

interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

const Assessment: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / assessmentQuestions.length) * 100;

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = async () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setAnswers(newAnswers);

    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      // Assessment completed
      setIsCompleted(true);
      setShowResult(true);
      
      // Calculate score
      const score = newAnswers.reduce((acc, answer, index) => {
        return acc + (answer === assessmentQuestions[index].correctAnswer ? 1 : 0);
      }, 0);

      const percentage = Math.round((score / assessmentQuestions.length) * 100);

      if (user) {
        try {
          // Update user profile with assessment completion
          const { error } = await supabase
            .from('profiles')
            .update({
              learning_level: percentage >= 80 ? 'intermediate' : percentage >= 60 ? 'beginner-plus' : 'beginner'
            })
            .eq('id', user.id);

          if (error) {
            console.error('Error updating profile:', error);
          }
        } catch (error) {
          console.error('Error in assessment completion:', error);
        }
      }

      toast({
        title: "Assessment completed!",
        description: `You scored ${score}/${assessmentQuestions.length} (${percentage}%)`,
        variant: "default",
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1] ?? null);
    }
  };

  const calculateResults = () => {
    const score = answers.reduce((acc, answer, index) => {
      return acc + (answer === assessmentQuestions[index].correctAnswer ? 1 : 0);
    }, 0);
    
    const percentage = Math.round((score / assessmentQuestions.length) * 100);
    let level = 'beginner';
    
    if (percentage >= 80) level = 'intermediate';
    else if (percentage >= 60) level = 'beginner-plus';
    
    return { score, percentage, level };
  };

  if (showResult) {
    const results = calculateResults();
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-softgray">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-indigo">Assessment Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-indigo">{results.score}/{assessmentQuestions.length}</div>
                <div className="text-lg text-gray-600">{results.percentage}% Correct</div>
                <div className="text-lg font-medium">Level: <span className="text-matcha">{results.level}</span></div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">What's Next?</h3>
                <p className="text-gray-600">
                  Based on your results, we recommend starting with our structured learning path.
                </p>
              </div>
              
              <div className="space-y-2">
                <Button onClick={() => navigate('/learn')} className="w-full">
                  Start Learning
                </Button>
                <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-softgray">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <div className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {assessmentQuestions.length}
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className="w-full text-left justify-start h-auto p-4"
                  onClick={() => handleAnswerSelect(index)}
                >
                  <span className="mr-3 font-semibold">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={selectedAnswer === null}
            >
              {currentQuestionIndex === assessmentQuestions.length - 1 ? 'Complete' : 'Next'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;

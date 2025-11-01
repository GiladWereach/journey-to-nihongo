import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { assessmentQuestions, AssessmentQuestion } from '@/data/assessmentQuestions';
import { supabase } from '@/integrations/supabase/client';
import { assessmentFailed, assessmentCompleted, assessmentQuestionAnswered, assessmentStarted, useAuth, useNavigate, useToast, completeAssessment, update, toast } from '@/lib/analytics-generated';

// Track assessment_failed
assessmentFailed();
// Track assessment_completed
assessmentCompleted();
// Track assessment_question_answered
assessmentQuestionAnswered();
// Track assessment_started
assessmentStarted();
const Assessment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeAssessment();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const completeAssessment = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Calculate score
      let score = 0;
      answers.forEach((answer, index) => {
        const question = assessmentQuestions[index];
        if (answer === question.correctAnswer) {
          score++;
        }
      });
      
      const percentage = (score / assessmentQuestions.length) * 100;
      
      // Update user profile with assessment completion
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          learning_level: percentage >= 80 ? 'intermediate' : percentage >= 50 ? 'beginner' : 'absolute_beginner'
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
      }

      setIsComplete(true);
      
      toast({
        title: "Assessment Complete!",
        description: `You scored ${score}/${assessmentQuestions.length} (${Math.round(percentage)}%)`,
      });
      
    } catch (error) {
      console.error('Error completing assessment:', error);
      toast({
        title: "Error",
        description: "Failed to complete assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestionData = assessmentQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;

  if (isComplete) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>Your learning path has been customized based on your responses.</p>
            <Button onClick={() => navigate('/dashboard')} size="lg">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestionData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Question {currentQuestion + 1} of {assessmentQuestions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{currentQuestionData.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {currentQuestionData.options.map((option, index) => (
              <Button
                key={index}
                variant={answers[currentQuestion] === option.value ? "default" : "outline"}
                className="w-full text-left justify-start h-auto p-4"
                onClick={() => handleAnswer(option.value)}
              >
                <div>
                  <div className="font-medium">{option.text}</div>
                </div>
              </Button>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion]}
            >
              {currentQuestion === assessmentQuestions.length - 1 ? 'Complete' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Assessment;

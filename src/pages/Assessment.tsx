
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Import our new components
import AssessmentQuestion from '@/components/assessment/AssessmentQuestion';
import AssessmentProgress from '@/components/assessment/AssessmentProgress';
import AssessmentNavigation from '@/components/assessment/AssessmentNavigation';
import { assessmentQuestions } from '@/data/assessmentQuestions';
import { submitAssessment } from '@/services/assessmentService';

const Assessment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const currentQuestion = assessmentQuestions[currentStep];
  const isLastStep = currentStep === assessmentQuestions.length - 1;
  
  const handleSelectOption = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };
  
  const handleNext = () => {
    if (currentStep < assessmentQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const isOptionSelected = () => {
    return answers[currentQuestion?.id] !== undefined;
  };
  
  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be signed in to save assessment results.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const now = new Date().toISOString();
      
      // Create a validated study session for the assessment
      const { error: sessionError } = await supabase
        .from('study_sessions')
        .insert({
          user_id: user.id,
          module: 'assessment',
          topics: ['initial-assessment'],
          duration_minutes: 5,
          session_date: now,
          start_time: now,
          completed: true,
          completion_validated: true,
          validation_timestamp: now
        });
        
      if (sessionError) throw sessionError;
      
      await submitAssessment(user, answers);
      
      toast({
        title: 'Assessment Complete',
        description: 'Your learning plan is being customized based on your responses.',
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error submitting assessment:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your assessment results. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSubmitting) {
    return (
      <LoadingSpinner
        size="lg"
        color="text-indigo"
        label="Saving your preferences..."
        fullPage={true}
        educational={true}
      />
    );
  }
  
  return (
    <div className="min-h-screen pt-20 px-4 bg-softgray">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <JapaneseCharacter character="評価" size="md" color="text-indigo" />
          <h1 className="text-3xl font-bold text-indigo">Japanese Skill Assessment</h1>
        </div>
        
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <CardTitle>Question {currentStep + 1} of {assessmentQuestions.length}</CardTitle>
            <CardDescription>
              Help us understand your current knowledge and goals
            </CardDescription>
            <AssessmentProgress 
              currentStep={currentStep} 
              totalSteps={assessmentQuestions.length} 
            />
          </CardHeader>
          
          <CardContent className="pb-6">
            <AssessmentQuestion
              question={currentQuestion.question}
              options={currentQuestion.options}
              selectedValue={answers[currentQuestion.id]}
              onSelect={handleSelectOption}
            />
          </CardContent>
          
          <CardFooter>
            <AssessmentNavigation
              currentStep={currentStep}
              totalSteps={assessmentQuestions.length}
              isLastStep={isLastStep}
              canGoNext={isOptionSelected()}
              isSubmitting={isSubmitting}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          </CardFooter>
        </Card>
        
        <div className="text-center mb-8">
          <Button 
            variant="link" 
            onClick={() => navigate('/dashboard')}
            className="text-gray-500"
          >
            Skip assessment for now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;

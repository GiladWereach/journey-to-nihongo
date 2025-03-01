
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

interface AssessmentQuestion {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
    value: string;
  }[];
  category: 'level' | 'goal' | 'time' | 'knowledge';
}

const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 1,
    question: 'What is your current level of Japanese?',
    options: [
      { id: 'level-1', text: 'Complete beginner with no knowledge', value: 'beginner' },
      { id: 'level-2', text: 'Know some basic phrases and greetings', value: 'elementary' },
      { id: 'level-3', text: 'Can have simple conversations', value: 'intermediate' },
      { id: 'level-4', text: 'Can read, write and speak with some fluency', value: 'advanced' }
    ],
    category: 'level'
  },
  {
    id: 2,
    question: 'What is your main goal for learning Japanese?',
    options: [
      { id: 'goal-1', text: 'Basic communication for travel', value: 'travel' },
      { id: 'goal-2', text: 'Reading manga, watching anime without subtitles', value: 'culture' },
      { id: 'goal-3', text: 'Business communication', value: 'business' },
      { id: 'goal-4', text: 'Academic purposes or passing JLPT', value: 'academic' },
      { id: 'goal-5', text: 'General interest in the language', value: 'general' }
    ],
    category: 'goal'
  },
  {
    id: 3,
    question: 'How much time can you dedicate to learning each day?',
    options: [
      { id: 'time-1', text: '5-15 minutes', value: '10' },
      { id: 'time-2', text: '15-30 minutes', value: '20' },
      { id: 'time-3', text: '30-60 minutes', value: '45' },
      { id: 'time-4', text: 'More than 60 minutes', value: '75' }
    ],
    category: 'time'
  },
  {
    id: 4,
    question: 'Do you have any prior knowledge of Japanese writing systems?',
    options: [
      { id: 'knowledge-1', text: 'None at all', value: 'none' },
      { id: 'knowledge-2', text: 'I know some hiragana', value: 'hiragana' },
      { id: 'knowledge-3', text: 'I know hiragana and some katakana', value: 'hiragana_katakana' },
      { id: 'knowledge-4', text: 'I know hiragana, katakana and some kanji', value: 'basic_kanji' }
    ],
    category: 'knowledge'
  }
];

const Assessment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const currentQuestion = assessmentQuestions[currentStep];
  const progress = ((currentStep + 1) / assessmentQuestions.length) * 100;
  
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
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Process the answers to get learning preferences
      const knowledgeLevel = assessmentQuestions
        .find(q => q.category === 'level')
        ?.options.find(o => o.value === answers[1])?.value || 'beginner';
        
      const learningGoal = assessmentQuestions
        .find(q => q.category === 'goal')
        ?.options.find(o => o.value === answers[2])?.value || 'general';
        
      const dailyGoalMinutes = parseInt(
        assessmentQuestions
          .find(q => q.category === 'time')
          ?.options.find(o => o.value === answers[3])?.value || '15'
      );
      
      const priorKnowledge = assessmentQuestions
        .find(q => q.category === 'knowledge')
        ?.options.find(o => o.value === answers[4])?.value || 'none';
      
      // Update profile with assessment results
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          display_name: user.user_metadata?.name || 'User',
          learning_level: knowledgeLevel,
          learning_goal: learningGoal,
          daily_goal_minutes: dailyGoalMinutes,
        })
        .eq('id', user.id);
        
      if (profileError) throw profileError;
      
      // Update settings with prior knowledge
      const { error: settingsError } = await supabase
        .from('user_settings')
        .update({
          prior_knowledge: priorKnowledge,
          preferred_study_time: 'anytime',
          notifications_enabled: true,
          display_furigana: true
        })
        .eq('id', user.id);
        
      if (settingsError) throw settingsError;
      
      // Create a study session for the assessment completion
      await supabase
        .from('study_sessions')
        .insert({
          user_id: user.id,
          module: 'assessment',
          topics: ['initial-assessment'],
          duration_minutes: 5,
          session_date: new Date().toISOString(),
          completed: true
        });
      
      toast({
        title: 'Assessment Complete',
        description: 'Your learning plan is being customized based on your responses.',
      });
      
      // Navigate to dashboard with success message
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
            <Progress value={progress} className="mt-2" />
          </CardHeader>
          
          <CardContent className="pb-6">
            <h2 className="text-xl font-medium mb-4">{currentQuestion?.question}</h2>
            
            <RadioGroup 
              value={answers[currentQuestion?.id]}
              onValueChange={handleSelectOption}
              className="space-y-3"
            >
              {currentQuestion?.options.map((option) => (
                <div 
                  key={option.id} 
                  className="flex items-center space-x-2 p-3 rounded-md border border-gray-200 hover:border-indigo transition-colors"
                >
                  <RadioGroupItem value={option.value} id={option.id} className="text-indigo" />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">{option.text}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            
            <Button
              type="button"
              onClick={handleNext}
              disabled={!isOptionSelected() || isSubmitting}
              className="bg-indigo hover:bg-indigo/90 flex items-center"
            >
              {currentStep === assessmentQuestions.length - 1 ? (
                isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-1 h-4 w-4" />
                    Complete Assessment
                  </>
                )
              ) : (
                <>
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
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

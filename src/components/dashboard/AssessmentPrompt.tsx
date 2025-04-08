
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AssessmentPromptProps {
  show: boolean;
}

const AssessmentPrompt: React.FC<AssessmentPromptProps> = ({ show }) => {
  const navigate = useNavigate();
  
  if (!show) return null;
  
  return (
    <div className="w-full max-w-4xl mb-8 bg-vermilion/10 border border-vermilion/20 rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-vermilion mb-2">Complete Your Assessment</h2>
          <p className="text-gray-700">Take a quick assessment to help us personalize your learning experience.</p>
        </div>
        <Button 
          className="bg-vermilion hover:bg-vermilion/90 whitespace-nowrap shadow-sm"
          onClick={() => navigate('/assessment')}
        >
          Start Assessment
        </Button>
      </div>
    </div>
  );
};

export default AssessmentPrompt;

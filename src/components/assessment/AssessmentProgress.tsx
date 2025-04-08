
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface AssessmentProgressProps {
  currentStep: number;
  totalSteps: number;
}

const AssessmentProgress: React.FC<AssessmentProgressProps> = ({ 
  currentStep, 
  totalSteps 
}) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <Progress value={progress} className="mt-2" />
  );
};

export default AssessmentProgress;


import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

interface AssessmentNavigationProps {
  currentStep: number;
  totalSteps: number;
  isLastStep: boolean;
  canGoNext: boolean;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const AssessmentNavigation: React.FC<AssessmentNavigationProps> = ({
  currentStep,
  totalSteps,
  isLastStep,
  canGoNext,
  isSubmitting,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="flex justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 0}
        className="flex items-center"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Previous
      </Button>
      
      <Button
        type="button"
        onClick={onNext}
        disabled={!canGoNext || isSubmitting}
        className="bg-indigo hover:bg-indigo/90 flex items-center"
      >
        {isLastStep ? (
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
    </div>
  );
};

export default AssessmentNavigation;

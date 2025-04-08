
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ContinueLearningData } from '@/types/dashboard';

interface RecommendedNextStepsProps {
  showAssessmentPrompt: boolean;
  recommendedNextModule: ContinueLearningData | null;
}

const RecommendedNextSteps: React.FC<RecommendedNextStepsProps> = ({
  showAssessmentPrompt,
  recommendedNextModule
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10 hover:shadow-lg transition-all">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-indigo mb-6">Recommended Next Steps</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`${showAssessmentPrompt ? 'bg-vermilion/5 border-vermilion/10' : 'bg-indigo/5 border-indigo/10'} p-6 rounded-lg border flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all`}>
            <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 shadow-sm ${showAssessmentPrompt ? 'bg-vermilion/10 text-vermilion' : 'bg-indigo/10 text-indigo'}`}>1</div>
            <h3 className="font-semibold mb-2">Complete Assessment</h3>
            <p className="text-sm text-gray-600 mb-5">Fine-tune your learning path</p>
            <Button 
              className={`mt-auto ${showAssessmentPrompt ? 'bg-vermilion hover:bg-vermilion/90 shadow-sm' : 'bg-gray-200'}`}
              onClick={() => navigate('/assessment')}
              disabled={!showAssessmentPrompt}
            >
              {showAssessmentPrompt ? 'Start Assessment' : 'Completed'}
            </Button>
          </div>
          
          {recommendedNextModule && (
            <div className="bg-matcha/5 p-6 rounded-lg border border-matcha/10 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all">
              <div className="h-12 w-12 bg-matcha/10 rounded-full flex items-center justify-center text-matcha mb-4 shadow-sm">2</div>
              <h3 className="font-semibold mb-2">{recommendedNextModule.title}</h3>
              <p className="text-sm text-gray-600 mb-5">{recommendedNextModule.description}</p>
              <Button 
                className="mt-auto bg-matcha hover:bg-matcha/90 shadow-sm"
                onClick={() => navigate(recommendedNextModule.route)}
              >
                Start Learning
              </Button>
            </div>
          )}
          
          <div className="bg-indigo/5 p-6 rounded-lg border border-indigo/10 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all">
            <div className="h-12 w-12 bg-indigo/10 rounded-full flex items-center justify-center text-indigo mb-4 shadow-sm">3</div>
            <h3 className="font-semibold mb-2">Practice Daily</h3>
            <p className="text-sm text-gray-600 mb-5">Keep your skills sharp with regular practice</p>
            <Button 
              className="mt-auto bg-indigo hover:bg-indigo/90 shadow-sm"
              onClick={() => navigate('/practice')}
            >
              Practice Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendedNextSteps;

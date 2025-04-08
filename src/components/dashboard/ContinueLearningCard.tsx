
import React from 'react';
import { Button } from '@/components/ui/button';
import { CirclePlay } from 'lucide-react';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { ContinueLearningData } from '@/types/dashboard';

interface ContinueLearningCardProps {
  continueLearning: ContinueLearningData | null;
  onContinue: (path: string) => void;
}

const ContinueLearningCard: React.FC<ContinueLearningCardProps> = ({ 
  continueLearning, 
  onContinue 
}) => {
  if (!continueLearning) return null;
  
  return (
    <div className="w-full max-w-4xl mb-10 bg-indigo/10 border border-indigo/20 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-indigo flex items-center">
            <CirclePlay className="mr-2 h-5 w-5" />
            Continue Learning
          </h2>
          {continueLearning.lastActive && (
            <span className="text-sm text-gray-600 bg-white/50 px-3 py-1 rounded-full">Last active: {continueLearning.lastActive}</span>
          )}
        </div>
        
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex flex-col md:flex-row gap-5 items-center">
            <div className="flex-grow">
              <div className="flex items-center mb-1">
                {continueLearning.japaneseTitle && (
                  <span className="text-2xl font-japanese mr-2">{continueLearning.japaneseTitle}</span>
                )}
                <h3 className="text-lg font-semibold">{continueLearning.title}</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">{continueLearning.description}</p>
              <ProgressIndicator 
                progress={continueLearning.progress} 
                size="sm" 
                color="bg-indigo" 
              />
            </div>
            <Button
              className="bg-indigo hover:bg-indigo/90 whitespace-nowrap shadow-sm"
              onClick={() => onContinue(continueLearning.route)}
            >
              Continue Learning
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContinueLearningCard;

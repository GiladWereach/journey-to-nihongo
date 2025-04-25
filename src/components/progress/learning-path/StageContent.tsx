
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LearningStage } from '@/types/progress';
import StageFeatures from './StageFeatures';
import StageProgress from './StageProgress';

interface StageContentProps {
  stage: LearningStage;
}

const StageContent: React.FC<StageContentProps> = ({ stage }) => {
  return (
    <div className={cn(
      "ml-4 w-full",
      stage.current ? "pb-5" : "pb-0"
    )}>
      <h3 className={cn(
        "text-base font-semibold leading-tight",
        stage.completed ? "text-matcha" : 
        stage.current ? "text-vermilion" :
        "text-gray-700"
      )}>
        {stage.title}
      </h3>
      <p className="text-gray-500 mt-1 text-sm">{stage.description}</p>
      
      {stage.features && stage.features.length > 0 && (stage.current || stage.completed) && (
        <StageFeatures features={stage.features} />
      )}
      
      {stage.current && stage.progress > 0 && (
        <StageProgress progress={stage.progress} stageId={stage.id} />
      )}

      {stage.completed && (
        <div className="mt-1 text-xs text-matcha flex items-center">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          <span>Completed</span>
        </div>
      )}

      {!stage.completed && !stage.current && stage.id !== 'hiragana' && (
        <div className="mt-1 text-xs text-gray-400">
          Complete previous stage to unlock
        </div>
      )}
    </div>
  );
};

export default StageContent;

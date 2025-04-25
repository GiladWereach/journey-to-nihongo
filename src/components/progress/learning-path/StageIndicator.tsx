
import React from 'react';
import { Circle, CheckCircle2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StageIndicatorProps {
  completed: boolean;
  current: boolean;
  index: number;
  currentStageIndex: number;
}

const StageIndicator: React.FC<StageIndicatorProps> = ({ 
  completed, 
  current, 
  index, 
  currentStageIndex 
}) => {
  return (
    <div className="relative flex-shrink-0">
      {completed ? (
        <CheckCircle2 className="h-[22px] w-[22px] text-matcha bg-white rounded-full z-10 relative" />
      ) : current ? (
        <MapPin className="h-[22px] w-[22px] text-vermilion bg-white rounded-full z-10 relative" />
      ) : (
        <Circle className={cn(
          "h-[22px] w-[22px] bg-white rounded-full z-10 relative",
          index <= currentStageIndex ? "text-gray-400" : "text-gray-200"
        )} />
      )}
    </div>
  );
};

export default StageIndicator;

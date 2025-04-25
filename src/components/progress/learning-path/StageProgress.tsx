
import React from 'react';
import { cn } from '@/lib/utils';

interface StageProgressProps {
  progress: number;
  stageId: string;
}

const StageProgress: React.FC<StageProgressProps> = ({ progress, stageId }) => {
  return (
    <div className="mt-3 pl-0">
      <div className="flex justify-between items-center text-xs mb-1">
        <span className="text-gray-600 font-medium">Progress</span>
        <span className="text-gray-600">{Math.round(progress)}%</span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full", 
            stageId === 'hiragana' ? "bg-matcha" :
            stageId === 'katakana' ? "bg-vermilion" :
            stageId === 'basic-kanji' ? "bg-indigo" :
            "bg-amber-500"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default StageProgress;

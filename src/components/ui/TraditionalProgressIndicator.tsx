
import React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TraditionalProgressIndicatorProps {
  progress: number;
  masteryLevel?: number;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  showMasteryBadge?: boolean;
  type?: 'hiragana' | 'katakana';
  className?: string;
}

const TraditionalProgressIndicator: React.FC<TraditionalProgressIndicatorProps> = ({
  progress,
  masteryLevel = 0,
  size = 'md',
  showPercentage = true,
  showMasteryBadge = false,
  type = 'hiragana',
  className
}) => {
  const getMasteryLevelName = (level: number): string => {
    const levels = ['New', 'Learning', 'Familiar', 'Practiced', 'Reliable', 'Mastered'];
    return levels[level] || 'Unknown';
  };

  const getMasteryLevelColor = (level: number): string => {
    const colors = [
      'bg-green-100 text-gion-night',     // New - light green
      'bg-gray-200 text-gion-night',      // Learning - greyish  
      'bg-pink-100 text-gion-night',      // Familiar - pink
      'bg-blue-100 text-gion-night',      // Practiced - blueish
      'bg-amber-100 text-gion-night',     // Reliable - light brown
      'bg-gray-800 text-paper-warm'       // Mastered - black
    ];
    return colors[level] || 'bg-gray-200 text-gion-night';
  };

  const getMasteryDescription = (level: number): string => {
    const descriptions = [
      'Just starting to learn this character',
      'Beginning to recognize the character',
      'Becoming familiar with the character',
      'Practiced and getting confident',
      'Reliable recognition most of the time',
      'Fully mastered this character'
    ];
    return descriptions[level] || 'Unknown mastery level';
  };

  const getProgressBarColor = (): string => {
    if (type === 'hiragana') {
      return 'bg-gradient-to-r from-matcha to-matcha/80';
    } else if (type === 'katakana') {
      return 'bg-gradient-to-r from-vermilion to-vermilion/80';
    }
    return 'bg-gradient-to-r from-wood-medium to-wood-light';
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Progress Bar */}
      <div className="space-y-1">
        <div className={cn(
          'bg-wood-grain border border-wood-light/30 rounded-none overflow-hidden',
          sizeClasses[size]
        )}>
          <div 
            className={cn(
              'h-full transition-all duration-500 ease-out',
              getProgressBarColor()
            )}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
        
        {showPercentage && (
          <div className="text-xs text-wood-light/60 text-center font-traditional">
            {Math.round(progress)}%
          </div>
        )}
      </div>

      {/* Mastery Badge with Tooltip */}
      {showMasteryBadge && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(
                'inline-flex items-center px-2 py-1 text-xs font-traditional border border-wood-light/40',
                getMasteryLevelColor(masteryLevel),
                'cursor-help'
              )}>
                {getMasteryLevelName(masteryLevel)}
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-wood-grain border-wood-light/40 text-paper-warm font-traditional">
              <p className="max-w-48">{getMasteryDescription(masteryLevel)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default TraditionalProgressIndicator;

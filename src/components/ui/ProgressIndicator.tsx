
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  progress: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  showPercentage?: boolean;
  label?: string;
  showLabel?: boolean;
  animated?: boolean;
  showTicks?: boolean;
  tickCount?: number;
  proficiencyLevel?: 'beginner' | 'intermediate' | 'advanced' | 'mastered';
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  size = 'md',
  color = 'bg-vermilion',
  className,
  showPercentage = false,
  label,
  showLabel = true,
  animated = false,
  showTicks = false,
  tickCount = 5,
  proficiencyLevel,
}) => {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  // Get appropriate color based on proficiency level if not explicitly provided
  const getColorByProficiency = () => {
    if (color !== 'bg-vermilion') return color;
    
    if (proficiencyLevel === 'mastered' || normalizedProgress >= 90) return 'bg-green-500';
    if (proficiencyLevel === 'advanced' || normalizedProgress >= 70) return 'bg-blue-500';
    if (proficiencyLevel === 'intermediate' || normalizedProgress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const progressColor = proficiencyLevel ? getColorByProficiency() : color;

  // Calculate the proficiency level if not provided
  const calculateProficiencyLevel = () => {
    if (proficiencyLevel) return proficiencyLevel;
    if (normalizedProgress >= 90) return 'mastered';
    if (normalizedProgress >= 70) return 'advanced';
    if (normalizedProgress >= 40) return 'intermediate';
    return 'beginner';
  };

  const level = calculateProficiencyLevel();

  // Generate ticks
  const renderTicks = () => {
    if (!showTicks) return null;
    
    const ticks = [];
    for (let i = 1; i < tickCount; i++) {
      const position = (i / tickCount) * 100;
      ticks.push(
        <div 
          key={i}
          className="absolute top-0 bottom-0 w-px bg-gray-200"
          style={{ left: `${position}%` }}
        />
      );
    }
    return ticks;
  };

  const proficiencyLabels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    mastered: 'Mastered',
  };

  return (
    <div className={cn('w-full space-y-1', className)}>
      {(label || showPercentage || (showLabel && proficiencyLevel)) && (
        <div className="flex justify-between items-center text-sm">
          {label && <span className="font-medium">{label}</span>}
          <div className="flex items-center gap-2">
            {showLabel && proficiencyLevel && (
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full',
                level === 'mastered' ? 'bg-green-100 text-green-800' :
                level === 'advanced' ? 'bg-blue-100 text-blue-800' :
                level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              )}>
                {proficiencyLabels[level]}
              </span>
            )}
            {showPercentage && <span className="text-muted-foreground">{normalizedProgress}%</span>}
          </div>
        </div>
      )}
      <div className={cn('w-full bg-gray-100 rounded-full overflow-hidden relative', sizeClasses[size])}>
        {renderTicks()}
        <div 
          className={cn(
            'transition-all duration-500 rounded-full', 
            progressColor,
            animated && 'animate-pulse'
          )} 
          style={{ width: `${normalizedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressIndicator;

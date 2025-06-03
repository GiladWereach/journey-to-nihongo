
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
  showMilestones?: boolean;
  milestones?: number[];
  glowOnCompletion?: boolean;
  characterDisplay?: string;
  showCharacter?: boolean;
  masteryLevel?: number; // New prop for mastery level
  showMasteryBadge?: boolean; // Whether to show mastery badge
  isAnimated?: boolean; // New prop to control animation
  showCompletionCelebration?: boolean; // New prop to show completion celebration
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  size = 'md',
  color = 'bg-gradient-to-r from-green-200 to-green-300',
  className,
  showPercentage = false,
  label,
  showLabel = true,
  animated = false,
  showTicks = false,
  tickCount = 5,
  proficiencyLevel,
  showMilestones = false,
  milestones = [25, 50, 75, 100],
  glowOnCompletion = false,
  characterDisplay,
  showCharacter = false,
  masteryLevel = 0,
  showMasteryBadge = false,
  isAnimated = false,
  showCompletionCelebration = false,
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
    if (color !== 'bg-gradient-to-r from-green-200 to-green-300') return color;
    
    if (masteryLevel > 0) {
      switch (masteryLevel) {
        case 1: return 'bg-gradient-to-r from-gray-300 to-gray-400'; // Learning
        case 2: return 'bg-gradient-to-r from-pink-200 to-pink-300'; // Familiar
        case 3: return 'bg-gradient-to-r from-blue-200 to-blue-300'; // Practiced
        case 4: return 'bg-gradient-to-r from-amber-200 to-amber-300'; // Reliable
        case 5: return 'bg-gradient-to-r from-gray-700 to-gray-800'; // Mastered
        default: return 'bg-gradient-to-r from-green-200 to-green-300'; // New
      }
    }
    
    if (proficiencyLevel === 'mastered' || normalizedProgress >= 90) return 'bg-gradient-to-r from-gray-700 to-gray-800';
    if (proficiencyLevel === 'advanced' || normalizedProgress >= 70) return 'bg-gradient-to-r from-blue-200 to-blue-300';
    if (proficiencyLevel === 'intermediate' || normalizedProgress >= 40) return 'bg-gradient-to-r from-pink-200 to-pink-300';
    return 'bg-gradient-to-r from-gray-300 to-gray-400';
  };

  const progressColor = proficiencyLevel || masteryLevel > 0 ? getColorByProficiency() : color;

  // Calculate the proficiency level if not provided
  const calculateProficiencyLevel = () => {
    if (proficiencyLevel) return proficiencyLevel;
    if (masteryLevel > 0) return 'mastered';
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

  // Generate milestone markers
  const renderMilestones = () => {
    if (!showMilestones) return null;
    
    return milestones.map((milestone, index) => (
      <div 
        key={index}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border",
          normalizedProgress >= milestone 
            ? 'bg-white border-current' 
            : 'bg-gray-200 border-gray-300'
        )}
        style={{ 
          left: `${milestone}%`, 
          transform: 'translate(-50%, -50%)',
          zIndex: 10
        }}
      />
    ));
  };

  const proficiencyLabels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    mastered: masteryLevel > 0 ? `Mastered (Level ${masteryLevel})` : 'Mastered',
  };

  return (
    <div className={cn('w-full space-y-1', className)}>
      {(label || showPercentage || (showLabel && (proficiencyLevel || masteryLevel > 0)) || showCharacter) && (
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            {showCharacter && characterDisplay && (
              <span className="text-lg font-japanese">{characterDisplay}</span>
            )}
            {label && <span className="font-medium">{label}</span>}
          </div>
          <div className="flex items-center gap-2">
            {showLabel && (proficiencyLevel || masteryLevel > 0) && (
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full',
                masteryLevel === 5 ? 'bg-gray-800 text-white' :
                masteryLevel === 4 ? 'bg-amber-100 text-amber-800' :
                masteryLevel === 3 ? 'bg-blue-100 text-blue-800' :
                masteryLevel === 2 ? 'bg-pink-100 text-pink-800' :
                masteryLevel === 1 ? 'bg-gray-100 text-gray-800' :
                'bg-green-100 text-green-800'
              )}>
                {masteryLevel > 0 ? `Level ${masteryLevel}` : proficiencyLabels[level]}
              </span>
            )}
            {showPercentage && <span className="text-sm text-muted-foreground">{normalizedProgress}%</span>}
          </div>
        </div>
      )}
      <div className={cn(
        'w-full bg-gray-100 rounded-full overflow-hidden relative', 
        sizeClasses[size],
        glowOnCompletion && (normalizedProgress >= 100 || masteryLevel > 0) && 'shadow-glow'
      )}>
        {renderTicks()}
        {renderMilestones()}
        <div 
          className={cn(
            'transition-all duration-500 rounded-full', 
            progressColor,
            animated && 'animate-pulse',
            isAnimated && 'animate-progress',
            glowOnCompletion && (normalizedProgress >= 100 || masteryLevel > 0) && 'animate-glow'
          )} 
          style={{ width: `${normalizedProgress}%` }}
        />
      </div>
      
      {/* Mastery badge */}
      {showMasteryBadge && masteryLevel > 0 && (
        <div className="text-xs text-center mt-1">
          <span className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
            masteryLevel === 1 ? "bg-gray-100 text-gray-800" :
            masteryLevel === 2 ? "bg-pink-100 text-pink-800" :
            masteryLevel === 3 ? "bg-blue-100 text-blue-800" :
            masteryLevel === 4 ? "bg-amber-100 text-amber-800" :
            masteryLevel >= 5 ? "bg-gray-800 text-white" : ""
          )}>
            {masteryLevel === 1 && "⭐"} 
            {masteryLevel === 2 && "⭐⭐"}
            {masteryLevel >= 3 && "⭐⭐⭐"}
            {` Level ${masteryLevel}`}
          </span>
        </div>
      )}
      
      {/* Optional animated celebration for completed progress */}
      {(showCompletionCelebration || glowOnCompletion) && (normalizedProgress >= 100 || masteryLevel > 0) && (
        <div className="text-xs text-center text-green-600 animate-bounce mt-1">
          {masteryLevel > 0 ? "✨ Mastered! ✨" : "✨ Completed! ✨"}
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;

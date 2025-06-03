
import React from 'react';
import { cn } from '@/lib/utils';

interface TraditionalProgressIndicatorProps {
  progress: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showPercentage?: boolean;
  label?: string;
  showLabel?: boolean;
  animated?: boolean;
  masteryLevel?: number;
  showMasteryBadge?: boolean;
  characterDisplay?: string;
  showCharacter?: boolean;
  type?: 'hiragana' | 'katakana' | 'kanji' | 'default';
}

const TraditionalProgressIndicator: React.FC<TraditionalProgressIndicatorProps> = ({
  progress,
  size = 'md',
  className,
  showPercentage = false,
  label,
  showLabel = true,
  animated = false,
  masteryLevel = 0,
  showMasteryBadge = false,
  characterDisplay,
  showCharacter = false,
  type = 'default'
}) => {
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const getProgressColor = () => {
    if (masteryLevel > 0) {
      switch (masteryLevel) {
        case 1: return 'from-wood-medium to-wood-light';
        case 2: return 'from-wood-light to-lantern-warm';
        case 3: return 'from-lantern-warm to-lantern-glow';
        case 4: return 'from-lantern-glow to-gold';
        case 5: return 'from-gold to-yellow-400';
        default: return 'from-wood-medium to-wood-light';
      }
    }
    
    switch (type) {
      case 'hiragana': return 'from-wood-medium to-wood-light';
      case 'katakana': return 'from-lantern-warm to-lantern-glow';
      case 'kanji': return 'from-gold to-yellow-400';
      default: return 'from-wood-medium via-wood-light to-gold';
    }
  };

  const getMasteryLabel = () => {
    if (masteryLevel === 0) return null;
    
    const labels = {
      1: '学習中', // Learning
      2: '慣れ親しむ', // Familiar
      3: '練習済み', // Practiced
      4: '信頼できる', // Reliable
      5: '習得済み' // Mastered
    };
    
    return labels[masteryLevel as keyof typeof labels] || '学習中';
  };

  return (
    <div className={cn('w-full space-y-2', className)}>
      {(label || showPercentage || showLabel || showCharacter) && (
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            {showCharacter && characterDisplay && (
              <span className="text-lg font-traditional text-wood-light">{characterDisplay}</span>
            )}
            {label && <span className="font-medium text-wood-light">{label}</span>}
          </div>
          <div className="flex items-center gap-2">
            {showLabel && masteryLevel > 0 && (
              <span className="text-xs px-2 py-1 bg-wood-grain text-wood-light rounded-none border border-wood-light/30">
                {getMasteryLabel()}
              </span>
            )}
            {showPercentage && (
              <span className="text-sm text-wood-light/80 font-traditional">
                {normalizedProgress}%
              </span>
            )}
          </div>
        </div>
      )}
      
      <div className={cn(
        'w-full bg-black/60 border border-wood-light/30 overflow-hidden relative',
        sizeClasses[size]
      )}>
        {/* Inner shadow */}
        <div className="absolute inset-0 shadow-inner bg-gradient-to-b from-black/20 to-transparent" />
        
        {/* Progress fill */}
        <div 
          className={cn(
            'h-full transition-all duration-1000 relative',
            `bg-gradient-to-r ${getProgressColor()}`,
            animated && 'animate-pulse'
          )}
          style={{ width: `${normalizedProgress}%` }}
        >
          {/* Glow effect */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-progress-glow"
            style={{ 
              animation: normalizedProgress > 0 ? 'progress-glow 4s ease-in-out infinite' : 'none'
            }}
          />
          
          {/* Inner highlight */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      </div>
      
      {/* Mastery badge */}
      {showMasteryBadge && masteryLevel > 0 && (
        <div className="text-xs text-center mt-2">
          <span className="inline-flex items-center px-3 py-1 bg-wood-grain text-wood-light border border-wood-light/30 font-traditional">
            {'★'.repeat(Math.min(masteryLevel, 5))} {getMasteryLabel()}
          </span>
        </div>
      )}
      
      {/* Completion celebration */}
      {normalizedProgress >= 100 && (
        <div className="text-xs text-center text-gold animate-bounce mt-1 font-traditional">
          ✨ 完了! ✨
        </div>
      )}
    </div>
  );
};

export default TraditionalProgressIndicator;

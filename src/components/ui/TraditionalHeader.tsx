
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface TraditionalHeaderProps {
  className?: string;
  showStats?: boolean;
  stats?: {
    streak?: number;
    mastered?: number;
    proficiency?: number;
  };
}

const TraditionalHeader: React.FC<TraditionalHeaderProps> = ({
  className,
  showStats = true,
  stats = { streak: 0, mastered: 0, proficiency: 0 }
}) => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <header className={cn(
      'bg-glass-wood backdrop-blur-traditional border-2 border-wood-light/40',
      'shadow-traditional p-8 mb-8 relative overflow-hidden',
      className
    )}>
      {/* Traditional lattice pattern */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(90deg, 
              transparent 0px, 
              rgba(139, 69, 19, 0.1) 1px, 
              rgba(139, 69, 19, 0.1) 2px, 
              transparent 3px, 
              transparent 15px),
            repeating-linear-gradient(0deg, 
              transparent 0px, 
              rgba(139, 69, 19, 0.1) 1px, 
              rgba(139, 69, 19, 0.1) 2px, 
              transparent 3px, 
              transparent 15px)
          `
        }}
      />

      <div className="relative z-10 flex justify-between items-center">
        <div>
          <Link to="/dashboard" className="block">
            <div className="font-traditional text-3xl font-semibold text-paper-warm tracking-wide">
              Nihongo Journey
            </div>
            <div className="text-wood-light text-sm font-normal mt-2 tracking-widest uppercase">
              Elegant Learning Experience
            </div>
          </Link>
        </div>

        {showStats && user && (
          <div className="flex gap-6 items-center">
            <div className="text-center bg-wood-grain backdrop-blur-md p-4 border border-wood-light/40 shadow-wood">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-wood-light to-transparent" />
              <div className="text-xl font-semibold text-wood-light">
                {stats.streak}
              </div>
              <div className="text-xs text-paper-warm/60 tracking-wider uppercase mt-1">
                Day Streak
              </div>
            </div>

            <div className="text-center bg-wood-grain backdrop-blur-md p-4 border border-wood-light/40 shadow-wood">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-wood-light to-transparent" />
              <div className="text-xl font-semibold text-wood-light">
                {stats.mastered}
              </div>
              <div className="text-xs text-paper-warm/60 tracking-wider uppercase mt-1">
                Characters Mastered
              </div>
            </div>

            <div className="text-center bg-wood-grain backdrop-blur-md p-4 border border-wood-light/40 shadow-wood">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-wood-light to-transparent" />
              <div className="text-xl font-semibold text-wood-light">
                {stats.proficiency}%
              </div>
              <div className="text-xs text-paper-warm/60 tracking-wider uppercase mt-1">
                Proficiency
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default TraditionalHeader;

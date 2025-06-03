
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

  const convertToJapaneseNumber = (num: number): string => {
    const japaneseNums = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const tensNums = ['', '十', '二十', '三十', '四十', '五十', '六十', '七十', '八十', '九十'];
    
    if (num === 0) return japaneseNums[0];
    if (num < 10) return japaneseNums[num];
    if (num < 100) {
      const tens = Math.floor(num / 10);
      const ones = num % 10;
      return tensNums[tens] + (ones > 0 ? japaneseNums[ones] : '');
    }
    
    // For larger numbers, fallback to Arabic numerals
    return num.toString();
  };

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
              日本語の旅
            </div>
            <div className="text-wood-light text-sm font-normal mt-2 tracking-widest uppercase">
              Nihongo Journey - 優雅な学習
            </div>
          </Link>
        </div>

        {showStats && user && (
          <div className="flex gap-6 items-center">
            <div className="text-center bg-wood-grain backdrop-blur-md p-4 border border-wood-light/40 shadow-wood">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-wood-light to-transparent" />
              <div className="text-xl font-semibold text-wood-light font-traditional">
                {convertToJapaneseNumber(stats.streak)}
              </div>
              <div className="text-xs text-paper-warm/60 tracking-wider uppercase mt-1">
                Days of Grace
              </div>
            </div>

            <div className="text-center bg-wood-grain backdrop-blur-md p-4 border border-wood-light/40 shadow-wood">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-wood-light to-transparent" />
              <div className="text-xl font-semibold text-wood-light font-traditional">
                {convertToJapaneseNumber(stats.mastered)}
              </div>
              <div className="text-xs text-paper-warm/60 tracking-wider uppercase mt-1">
                Characters Mastered
              </div>
            </div>

            <div className="text-center bg-wood-grain backdrop-blur-md p-4 border border-wood-light/40 shadow-wood">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-wood-light to-transparent" />
              <div className="text-xl font-semibold text-wood-light font-traditional">
                {convertToJapaneseNumber(stats.proficiency)}
              </div>
              <div className="text-xs text-paper-warm/60 tracking-wider uppercase mt-1">
                Refinement %
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Decorative notification */}
      <div className="absolute top-4 right-4 bg-wood-grain text-wood-light px-3 py-2 text-xs border border-wood-light/40 backdrop-blur-md font-traditional">
        🏮 夜の学習時間
      </div>
    </header>
  );
};

export default TraditionalHeader;

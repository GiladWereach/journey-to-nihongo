
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface JapaneseCharacterProps {
  character: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  animated?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const JapaneseCharacter: React.FC<JapaneseCharacterProps> = ({
  character,
  size = 'md',
  color = 'text-indigo',
  animated = true,
  className,
  style,
}) => {
  const charRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: 'text-3xl',
    md: 'text-5xl',
    lg: 'text-7xl',
    xl: 'text-9xl',
  };

  useEffect(() => {
    if (animated && charRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-scale-in');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      
      observer.observe(charRef.current);
      
      return () => {
        if (charRef.current) observer.unobserve(charRef.current);
      };
    }
  }, [animated]);

  return (
    <div 
      ref={charRef}
      className={cn(
        'japanese-text font-semibold flex items-center justify-center opacity-0',
        sizeClasses[size],
        color,
        'transition-all duration-500 ease-out',
        className
      )}
      style={style}
    >
      {character}
    </div>
  );
};

export default JapaneseCharacter;

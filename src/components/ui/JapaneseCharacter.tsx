
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
  animated = false, // Default to false to prevent flickering
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
      // Make sure the element is visible before animation
      charRef.current.style.opacity = '1';
      
      // Add the animation class with a slight delay to ensure it's visible first
      setTimeout(() => {
        if (charRef.current) {
          charRef.current.classList.add('animate-scale-in');
        }
      }, 50);
      
      // For intersection observer functionality (for elements that come into view later)
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (entry.target instanceof HTMLElement) {
                entry.target.style.opacity = '1';
                entry.target.classList.add('animate-scale-in');
              }
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
        'japanese-text font-semibold flex items-center justify-center',
        sizeClasses[size],
        color,
        'transition-all duration-500 ease-out',
        // Only apply opacity-0 if explicitly animated, otherwise always visible
        animated ? 'opacity-0' : 'opacity-100',
        className
      )}
      style={{
        willChange: 'opacity, transform',
        ...style
      }}
    >
      {character}
    </div>
  );
};

export default JapaneseCharacter;

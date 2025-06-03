
import React from 'react';
import { cn } from '@/lib/utils';

interface PaperLanternProps {
  className?: string;
  delay?: number;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

export const PaperLantern: React.FC<PaperLanternProps> = ({ 
  className, 
  delay = 0,
  size = 'md',
  style
}) => {
  const sizeClasses = {
    sm: 'w-3 h-4',
    md: 'w-5 h-7',
    lg: 'w-6 h-9'
  };

  return (
    <div 
      className={cn(
        'absolute pointer-events-none rounded-full',
        'bg-gradient-to-b from-lantern-glow via-lantern-warm to-lantern-amber',
        'shadow-lantern animate-lantern-glow',
        sizeClasses[size],
        className
      )}
      style={{
        animationDelay: `${delay}s`,
        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        boxShadow: '0 0 15px rgba(255, 220, 150, 0.4), inset 0 -3px 6px rgba(0, 0, 0, 0.2)',
        ...style
      }}
    >
      <div 
        className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-wood-dark rounded-sm"
        style={{ width: '75%', height: '2px' }}
      />
    </div>
  );
};

interface FloatingLanternsProps {
  count?: number;
  className?: string;
}

export const FloatingLanterns: React.FC<FloatingLanternsProps> = ({ 
  count = 5, 
  className 
}) => {
  const lanterns = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${15 + (i * 15)}%`,
    top: `${45 + (Math.random() * 30)}px`,
    delay: i * 2,
    size: Math.random() > 0.5 ? 'md' : 'sm' as 'sm' | 'md'
  }));

  return (
    <div className={cn('fixed inset-0 pointer-events-none z-10', className)}>
      {lanterns.map(lantern => (
        <PaperLantern
          key={lantern.id}
          className="animate-float"
          style={{
            left: lantern.left,
            top: lantern.top,
            animationDelay: `${lantern.delay}s`
          }}
          delay={lantern.delay}
          size={lantern.size}
        />
      ))}
    </div>
  );
};

interface TraditionalBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export const TraditionalBackground: React.FC<TraditionalBackgroundProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn('min-h-screen bg-gion-night relative overflow-x-hidden', className)}>
      {/* Street stones texture */}
      <div 
        className="fixed inset-0 opacity-60 pointer-events-none z-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, 
              transparent, 
              transparent 20px, 
              rgba(100, 100, 100, 0.03) 20px, 
              rgba(100, 100, 100, 0.03) 22px),
            repeating-linear-gradient(-45deg, 
              transparent, 
              transparent 25px, 
              rgba(80, 80, 80, 0.02) 25px, 
              rgba(80, 80, 80, 0.02) 27px)
          `
        }}
      />
      
      {/* Wood grain pattern overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 40%, rgba(139, 69, 19, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(139, 69, 19, 0.08) 0%, transparent 40%),
            repeating-linear-gradient(90deg, 
              transparent 0px, 
              rgba(139, 69, 19, 0.02) 1px, 
              transparent 2px, 
              transparent 60px)
          `
        }}
      />
      
      <FloatingLanterns />
      {children}
    </div>
  );
};

interface TraditionalCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const TraditionalCard: React.FC<TraditionalCardProps> = ({
  children,
  className,
  hover = true,
  onClick
}) => {
  return (
    <div 
      className={cn(
        'relative bg-glass-wood backdrop-blur-traditional',
        'border-2 border-wood-light/40 shadow-traditional',
        'transition-all duration-500 cursor-pointer overflow-hidden',
        hover && 'hover:shadow-wood hover:border-wood-light hover:-translate-y-2 hover:scale-[1.01]',
        className
      )}
      onClick={onClick}
    >
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
      
      {/* Inner frame */}
      <div className="absolute inset-4 border border-wood-light/20 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Light sweep effect on hover */}
      <div 
        className="absolute inset-0 opacity-0 transition-opacity duration-500 hover:opacity-100 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(196, 164, 119, 0.1), transparent)',
          transform: 'translateX(-100%)',
          animation: hover ? 'light-sweep 0.8s ease' : 'none'
        }}
      />
    </div>
  );
};

export default TraditionalBackground;

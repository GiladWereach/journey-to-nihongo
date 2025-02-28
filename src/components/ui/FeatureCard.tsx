
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  delay = 0,
  className,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.classList.add('animate-scale-in');
                entry.target.classList.remove('opacity-0');
              }, delay);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      
      observer.observe(cardRef.current);
      
      return () => {
        if (cardRef.current) observer.unobserve(cardRef.current);
      };
    }
  }, [delay]);

  return (
    <div 
      ref={cardRef}
      className={cn(
        'flex flex-col p-6 rounded-2xl transition-all duration-300 opacity-0',
        'hover:shadow-elevated hover:-translate-y-1 bg-white',
        'border border-gray-100',
        className
      )}
    >
      <div className="mb-4 text-vermilion p-3 rounded-full w-fit bg-vermilion/5">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-indigo mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-sm">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;

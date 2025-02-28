
import React from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon,
  delay = 0
}) => {
  const { isDark } = useDarkMode();
  
  return (
    <div 
      className={cn(
        "p-6 rounded-2xl card-hover",
        isDark ? "bg-white/10 backdrop-blur-sm" : "bg-white shadow-lg",
        "animate-fade-in opacity-0"
      )}
      style={{ 
        animationDelay: `${delay}ms`, 
        animationFillMode: 'forwards' 
      }}
    >
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center mb-4",
        isDark ? "bg-vermilion/20 text-vermilion" : "bg-vermilion/10 text-vermilion"
      )}>
        {icon}
      </div>
      <h3 className={cn(
        "text-xl font-bold mb-2",
        isDark ? "text-white" : "text-indigo"
      )}>{title}</h3>
      <p className={cn(
        isDark ? "text-gray-300" : "text-gray-600"
      )}>{description}</p>
    </div>
  );
};

export default FeatureCard;

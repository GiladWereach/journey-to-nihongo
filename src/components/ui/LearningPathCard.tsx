import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import ProgressIndicator from './ProgressIndicator';
import JapaneseCharacter from './JapaneseCharacter';

interface LearningPathCardProps {
  title: string;
  japaneseTitle?: string;
  description: string;
  progress?: number;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isFeatured?: boolean;
}

const LearningPathCard: React.FC<LearningPathCardProps> = ({
  title,
  japaneseTitle,
  description,
  progress = 0,
  icon,
  className,
  onClick,
  isFeatured = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-slide-up');
              entry.target.classList.remove('opacity-0');
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
  }, []);

  return (
    <Card 
      ref={cardRef}
      className={cn(
        'opacity-0 overflow-hidden transition-all duration-300 h-full',
        isFeatured ? 'border-vermilion shadow-elevated' : 'hover:shadow-elevated',
        'hover:-translate-y-1 cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="space-y-1">
        {japaneseTitle && (
          <div className="flex justify-start mb-2">
            <JapaneseCharacter 
              character={japaneseTitle} 
              size="sm" 
              color={isFeatured ? "text-vermilion" : "text-matcha"}
              animated={false}
              className="opacity-100"
            />
          </div>
        )}
        <div className="flex items-start gap-4">
          {icon && <div className="mt-1">{icon}</div>}
          <div>
            <CardTitle className={cn(
              isFeatured ? "text-indigo" : "text-indigo"
            )}>
              {title}
            </CardTitle>
            <CardDescription className="mt-2 line-clamp-2">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {progress > 0 && (
          <div className="mt-2">
            <ProgressIndicator 
              progress={progress} 
              size="sm" 
              color={isFeatured ? "bg-vermilion" : "bg-matcha"}
              showPercentage 
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant={isFeatured ? "default" : "outline"} 
          className={cn(
            "w-full transition-all",
            isFeatured ? "bg-vermilion hover:bg-vermilion/90" : "text-indigo border-indigo hover:bg-indigo hover:text-white"
          )}
          onClick={onClick}
        >
          {progress > 0 ? "Continue Learning" : "Start Learning"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LearningPathCard;

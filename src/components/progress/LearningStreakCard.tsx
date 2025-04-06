
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Award, Calendar } from 'lucide-react';

interface LearningStreakCardProps {
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: Date | null;
  className?: string;
}

const LearningStreakCard: React.FC<LearningStreakCardProps> = ({
  currentStreak,
  longestStreak,
  lastPracticeDate,
  className
}) => {
  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };
  
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="h-5 w-5 text-vermilion" />
          <h3 className="text-lg font-semibold">Learning Streak</h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-softgray/30 p-3 rounded-lg flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="h-4 w-4 text-vermilion" />
              <span className="text-sm text-muted-foreground">Current</span>
            </div>
            <span className="text-2xl font-bold">{currentStreak}</span>
            <span className="text-xs text-muted-foreground">days</span>
          </div>
          
          <div className="bg-softgray/30 p-3 rounded-lg flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-4 w-4 text-indigo" />
              <span className="text-sm text-muted-foreground">Longest</span>
            </div>
            <span className="text-2xl font-bold">{longestStreak}</span>
            <span className="text-xs text-muted-foreground">days</span>
          </div>
          
          <div className="col-span-2 sm:col-span-1 bg-softgray/30 p-3 rounded-lg flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-muted-foreground">Last Practice</span>
            </div>
            <span className="text-lg font-medium">{formatDate(lastPracticeDate)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningStreakCard;

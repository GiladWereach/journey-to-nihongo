
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Clock, BookOpen, Award } from 'lucide-react';

interface ProgressStatsProps {
  totalStudyTime: number;
  totalSessions: number;
  learnedCharacters: number;
  currentStreak: number;
  longestStreak: number;
}

const ProgressStats: React.FC<ProgressStatsProps> = ({
  totalStudyTime,
  totalSessions,
  learnedCharacters,
  currentStreak,
  longestStreak
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            Total Study Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStudyTime} minutes</div>
          <p className="text-xs text-muted-foreground mt-1">
            Across {totalSessions} sessions
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
            <BookOpen className="mr-2 h-4 w-4" />
            Characters Learned
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {learnedCharacters}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Characters in progress or mastered
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
            <Award className="mr-2 h-4 w-4" />
            Learning Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentStreak} days</div>
          <p className="text-xs text-muted-foreground mt-1">
            Longest: {longestStreak} days
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressStats;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Clock, 
  Calendar, 
  ArrowUpRight, 
  Flame, 
  BrainCircuit,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface StudySessionDistribution {
  morning: number; // 5am-12pm
  afternoon: number; // 12pm-5pm
  evening: number; // 5pm-10pm
  night: number; // 10pm-5am
}

interface StudyHabitsCardProps {
  timeDistribution: StudySessionDistribution;
  dailyGoalMinutes: number;
  weeklyGoalDays: number;
  averageSessionDuration: number;
  currentStreak: number;
  frequencyPerWeek: number;
  className?: string;
}

const StudyHabitsCard: React.FC<StudyHabitsCardProps> = ({
  timeDistribution,
  dailyGoalMinutes,
  weeklyGoalDays,
  averageSessionDuration,
  currentStreak,
  frequencyPerWeek,
  className
}) => {
  // Find the peak study time
  const peakStudyTime = Object.entries(timeDistribution).reduce(
    (max, [key, value]) => value > max.value ? { time: key, value } : max,
    { time: 'none', value: 0 }
  );
  
  // Calculate adherence to daily goal
  const dailyGoalAdherence = Math.min(100, (averageSessionDuration / dailyGoalMinutes) * 100);
  
  // Calculate adherence to weekly frequency goal
  const weeklyFrequencyAdherence = Math.min(100, (frequencyPerWeek / weeklyGoalDays) * 100);
  
  // Get optimal study time recommendation
  const getOptimalTimeRecommendation = () => {
    if (peakStudyTime.time === 'morning') {
      return "Morning (5am-12pm)";
    } else if (peakStudyTime.time === 'afternoon') {
      return "Afternoon (12pm-5pm)";
    } else if (peakStudyTime.time === 'evening') {
      return "Evening (5pm-10pm)";
    } else if (peakStudyTime.time === 'night') {
      return "Night (10pm-5am)";
    }
    return "Not enough data";
  };
  
  // Generate consistency score (0-100)
  const consistencyScore = (
    (Math.min(currentStreak, 7) / 7) * 40 + // 40% based on current streak (max 7 days)
    (weeklyFrequencyAdherence / 100) * 30 + // 30% based on weekly frequency
    (dailyGoalAdherence / 100) * 30 // 30% based on daily time goal
  );
  
  // Get message based on consistency score
  const getConsistencyMessage = () => {
    if (consistencyScore >= 90) return "Excellent consistency!";
    if (consistencyScore >= 70) return "Good study habits";
    if (consistencyScore >= 50) return "Developing consistency";
    if (consistencyScore >= 30) return "Building habits";
    return "Getting started";
  };
  
  // Get icon based on consistency score
  const getConsistencyIcon = () => {
    if (consistencyScore >= 70) return <ThumbsUp className="h-4 w-4 text-green-500" />;
    if (consistencyScore >= 40) return <BrainCircuit className="h-4 w-4 text-amber-500" />;
    return <AlertCircle className="h-4 w-4 text-vermilion" />;
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5 text-indigo" />
          Study Habits Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-indigo/5 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-indigo mb-2">Consistency Score</h3>
            <div className="flex items-end justify-between mb-2">
              <div>
                <span className="text-2xl font-bold">{Math.round(consistencyScore)}/100</span>
              </div>
              <span className="flex items-center text-sm font-medium text-gray-600">
                {getConsistencyIcon()}
                <span className="ml-1">{getConsistencyMessage()}</span>
              </span>
            </div>
            <Progress value={consistencyScore} className="h-1.5" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center">
                <Clock className="h-3 w-3 mr-1" /> 
                Peak Study Time
              </p>
              <div className="flex items-center">
                <span className="text-base font-semibold">{getOptimalTimeRecommendation()}</span>
                <ArrowUpRight className="ml-1 h-3 w-3 text-green-500" />
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center">
                <Calendar className="h-3 w-3 mr-1" /> 
                Weekly Frequency
              </p>
              <div className="flex items-center">
                <span className="text-base font-semibold">{frequencyPerWeek.toFixed(1)} days/week</span>
                {frequencyPerWeek >= weeklyGoalDays ? (
                  <ThumbsUp className="ml-1 h-3 w-3 text-green-500" />
                ) : (
                  <span className="ml-1 text-xs text-amber-600">Goal: {weeklyGoalDays} days</span>
                )}
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center">
                <Clock className="h-3 w-3 mr-1" /> 
                Avg. Session Length
              </p>
              <div className="flex items-center">
                <span className="text-base font-semibold">{Math.round(averageSessionDuration)} min</span>
                {averageSessionDuration >= dailyGoalMinutes ? (
                  <ThumbsUp className="ml-1 h-3 w-3 text-green-500" />
                ) : (
                  <span className="ml-1 text-xs text-amber-600">Goal: {dailyGoalMinutes} min</span>
                )}
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center">
                <Flame className="h-3 w-3 mr-1" /> 
                Current Streak
              </p>
              <div className="flex items-center">
                <span className="text-base font-semibold">{currentStreak} days</span>
                {currentStreak >= 5 && (
                  <Flame className="ml-1 h-3 w-3 text-vermilion" />
                )}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Study Time Distribution</h3>
            <div className="grid grid-cols-4 gap-1 text-xs text-center">
              <div className="space-y-1">
                <div className="h-16 bg-gray-100 rounded-md relative overflow-hidden">
                  <div 
                    className="absolute bottom-0 w-full bg-blue-400"
                    style={{ height: `${(timeDistribution.morning / 100) * 100}%` }}
                  ></div>
                </div>
                <span>Morning</span>
              </div>
              <div className="space-y-1">
                <div className="h-16 bg-gray-100 rounded-md relative overflow-hidden">
                  <div 
                    className="absolute bottom-0 w-full bg-yellow-400"
                    style={{ height: `${(timeDistribution.afternoon / 100) * 100}%` }}
                  ></div>
                </div>
                <span>Afternoon</span>
              </div>
              <div className="space-y-1">
                <div className="h-16 bg-gray-100 rounded-md relative overflow-hidden">
                  <div 
                    className="absolute bottom-0 w-full bg-indigo"
                    style={{ height: `${(timeDistribution.evening / 100) * 100}%` }}
                  ></div>
                </div>
                <span>Evening</span>
              </div>
              <div className="space-y-1">
                <div className="h-16 bg-gray-100 rounded-md relative overflow-hidden">
                  <div 
                    className="absolute bottom-0 w-full bg-violet-400"
                    style={{ height: `${(timeDistribution.night / 100) * 100}%` }}
                  ></div>
                </div>
                <span>Night</span>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
            <p className="flex items-center mb-1">
              <BrainCircuit className="h-3 w-3 mr-1 text-indigo" />
              Recommendation: Consider studying during your peak productivity time ({getOptimalTimeRecommendation()}).
            </p>
            <p className="flex items-center">
              <Calendar className="h-3 w-3 mr-1 text-indigo" />
              Aim for {weeklyGoalDays} days per week for optimal language retention.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyHabitsCard;

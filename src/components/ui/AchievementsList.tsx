
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Award } from 'lucide-react';

const AchievementsList = () => {
  // Placeholder achievements for now
  const achievements = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first kana practice session',
      icon: '🎯',
      earned: false
    },
    {
      id: '2', 
      title: 'Streak Master',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      earned: false
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                achievement.earned ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <span className="text-2xl">{achievement.icon}</span>
              <div className="flex-1">
                <h4 className="font-medium">{achievement.title}</h4>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>
              {achievement.earned && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Earned
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsList;


import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Award, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { achievementEarned, achievementViewed, useAuth } from '@/lib/analytics-generated';
import { achievementEarned, achievementViewed, useAuth } from '@/lib/analytics-generated';
const Achievements = () => {
  // Track achievement_earned
  achievementEarned();
  // Track achievement_viewed
  achievementViewed();
  // Track achievement_earned
  achievementEarned();
  // Track achievement_viewed
  achievementViewed();
  const { user } = useAuth();

  // Placeholder achievements for now
  const achievements = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first kana practice session',
      icon: '🎯',
      earned: false,
      progress: 0,
      total: 1
    },
    {
      id: '2', 
      title: 'Streak Master',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      earned: false,
      progress: 0,
      total: 7
    },
    {
      id: '3',
      title: 'Hiragana Master',
      description: 'Master all basic hiragana characters',
      icon: '🇯🇵',
      earned: false,
      progress: 0,
      total: 46
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/dashboard">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            Your Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    achievement.earned ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <span className="text-3xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <h4 className="text-lg font-medium">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                    <div className="text-xs text-gray-500">
                      Progress: {achievement.progress}/{achievement.total}
                    </div>
                  </div>
                  {achievement.earned ? (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      <Award className="mr-1 h-3 w-3" />
                      Earned
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      In Progress
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Sign in to track your achievements</p>
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Achievements;

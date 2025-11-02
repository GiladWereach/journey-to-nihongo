
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Target, TrendingUp, Calendar, Play, BarChart3 } from 'lucide-react';
import { useUserProgress } from '@/hooks/useUserProgress';
import { characterProgressService } from '@/services/characterProgressService';
import { quizSessionService } from '@/services/quizSessionService';
import { supabase } from '@/integrations/supabase/client';
import { dashboardPageViewed, useAuth, useUserProgress, setStats, fetchDashboardData, toLocaleDateString } from '@/lib/analytics-generated';

// Track dashboard_page_viewed
dashboardPageViewed();
interface DashboardStats {
  totalCharactersLearned: number;
  currentStreak: number;
  totalSessions: number;
  averageAccuracy: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { progress, loading } = useUserProgress();
  const [stats, setStats] = useState<DashboardStats>({
    totalCharactersLearned: 0,
    currentStreak: 0,
    totalSessions: 0,
    averageAccuracy: 0
  });
  const [recentSessions, setRecentSessions] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // Get user progress data
        const progressData = await characterProgressService.getCharacterProgress(user.id);
        const charactersLearned = progressData.filter(p => p.proficiency > 0).length;

        // Get recent quiz sessions
        const sessions = await quizSessionService.getUserSessions(user.id, 5);
        setRecentSessions(sessions);

        // Calculate average accuracy
        const completedSessions = sessions.filter(s => s.completed);
        const avgAccuracy = completedSessions.length > 0
          ? completedSessions.reduce((sum, s) => sum + s.accuracy, 0) / completedSessions.length
          : 0;

        setStats({
          totalCharactersLearned: charactersLearned,
          currentStreak: 0, // We'll implement streak tracking later
          totalSessions: sessions.length,
          averageAccuracy: Math.round(avgAccuracy)
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-softgray">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-softgray">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-indigo">Welcome back!</h1>
            <p className="text-gray-600">Continue your Japanese learning journey</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-8 w-8 text-matcha" />
                  <div>
                    <div className="text-2xl font-bold">{stats.totalCharactersLearned}</div>
                    <div className="text-sm text-gray-500">Characters Learned</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-8 w-8 text-vermilion" />
                  <div>
                    <div className="text-2xl font-bold">{stats.currentStreak}</div>
                    <div className="text-sm text-gray-500">Day Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Target className="h-8 w-8 text-indigo" />
                  <div>
                    <div className="text-2xl font-bold">{stats.totalSessions}</div>
                    <div className="text-sm text-gray-500">Quiz Sessions</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-amber-500" />
                  <div>
                    <div className="text-2xl font-bold">{stats.averageAccuracy}%</div>
                    <div className="text-sm text-gray-500">Average Accuracy</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-matcha" />
                  Start Quiz
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Practice Hiragana and Katakana with our endless quiz system</p>
                <Button asChild className="w-full">
                  <Link to="/quiz">Start Quiz</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-vermilion" />
                  Kana Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Learn Japanese characters with structured lessons</p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/kana-learning">Learn Kana</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-indigo" />
                  View Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Track your learning progress and achievements</p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/progress">View Progress</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Sessions */}
          {recentSessions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Quiz Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={session.kana_type === 'hiragana' ? 'default' : 'secondary'}>
                          {session.kana_type}
                        </Badge>
                        <div>
                          <div className="font-medium">
                            {session.correct_answers}/{session.questions_answered} correct
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(session.start_time).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{session.accuracy}% accuracy</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progress Overview */}
          {progress && (
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Hiragana</span>
                      <span>{progress.hiragana_learned}/46</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-matcha rounded-full transition-all duration-300"
                        style={{ width: `${(progress.hiragana_learned / 46) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Katakana</span>
                      <span>{progress.katakana_learned}/46</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-vermilion rounded-full transition-all duration-300"
                        style={{ width: `${(progress.katakana_learned / 46) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

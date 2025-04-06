
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { BarChart2, Menu, Clock, PieChart, Award } from 'lucide-react';
import PrimaryNavigation from '@/components/layout/PrimaryNavigation';
import UserKanaProgress from '@/components/kana/UserKanaProgress';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { supabase } from '@/integrations/supabase/client';

interface StudySession {
  id: string;
  user_id: string;
  module: string;
  topics: string[];
  duration_minutes: number;
  session_date: string;
  completed: boolean;
  performance_score?: number;
  created_at?: string;
}

const Progress: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchStudySessions = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('study_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setStudySessions(data || []);
      } catch (error: any) {
        console.error('Error fetching study sessions:', error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudySessions();
  }, [user]);
  
  if (!user) {
    navigate('/auth');
    return null;
  }
  
  // Calculate study statistics
  const totalStudyTime = studySessions.reduce((sum, session) => sum + session.duration_minutes, 0);
  const totalSessions = studySessions.length;
  const avgSessionDuration = totalSessions > 0 ? totalStudyTime / totalSessions : 0;
  const sessionsByModule = studySessions.reduce((acc, session) => {
    acc[session.module] = (acc[session.module] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 px-4 bg-softgray/30">
        <div className="max-w-7xl mx-auto flex">
          {/* Sidebar Navigation for Desktop */}
          <div className="hidden md:block w-64 mr-8">
            <div className="sticky top-24">
              <PrimaryNavigation />
              
              <div className="mt-8 p-4 bg-white rounded-lg shadow">
                <h3 className="font-semibold text-indigo mb-2">Quick Access</h3>
                <ul className="space-y-2">
                  <li>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      size="sm"
                      onClick={() => setActiveTab('overview')}
                    >
                      Overview
                    </Button>
                  </li>
                  <li>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      size="sm"
                      onClick={() => setActiveTab('kana')}
                    >
                      Kana Progress
                    </Button>
                  </li>
                  <li>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      size="sm"
                      onClick={() => navigate('/achievements')}
                    >
                      Achievements
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden fixed bottom-4 right-4 z-40">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" className="rounded-full w-12 h-12 bg-indigo hover:bg-indigo/90">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[280px]">
                <div className="py-4">
                  <h2 className="text-lg font-bold text-indigo mb-4 flex items-center">
                    <BarChart2 className="mr-2 h-5 w-5" />
                    Navigation
                  </h2>
                  <PrimaryNavigation />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-indigo mb-2">Your Progress</h1>
              <p className="text-gray-600">
                Track your Japanese learning journey and see how far you've come.
              </p>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="kana">Kana Progress</TabsTrigger>
                <TabsTrigger value="study-sessions">Study Sessions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="animate-fade-in">
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
                        <PieChart className="mr-2 h-4 w-4" />
                        Average Session
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{avgSessionDuration.toFixed(1)} minutes</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Per study session
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
                        <Award className="mr-2 h-4 w-4" />
                        Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3 unlocked</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-xs"
                          onClick={() => navigate('/achievements')}
                        >
                          View all achievements
                        </Button>
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Learning Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Hiragana</span>
                          <span className="text-sm text-muted-foreground">75%</span>
                        </div>
                        <ProgressIndicator progress={75} color="bg-matcha" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Katakana</span>
                          <span className="text-sm text-muted-foreground">40%</span>
                        </div>
                        <ProgressIndicator progress={40} color="bg-vermilion" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Basic Kanji</span>
                          <span className="text-sm text-muted-foreground">10%</span>
                        </div>
                        <ProgressIndicator progress={10} color="bg-indigo" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Grammar</span>
                          <span className="text-sm text-muted-foreground">5%</span>
                        </div>
                        <ProgressIndicator progress={5} color="bg-amber-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="kana" className="animate-fade-in">
                <UserKanaProgress />
              </TabsContent>
              
              <TabsContent value="study-sessions" className="animate-fade-in">
                <Card>
                  <CardHeader>
                    <CardTitle>Study History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo"></div>
                      </div>
                    ) : studySessions.length > 0 ? (
                      <div className="space-y-4">
                        {studySessions.map(session => (
                          <div key={session.id} className="border-b pb-4">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">{session.module}</span>
                              <span className="text-sm text-muted-foreground">
                                {new Date(session.created_at || '').toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                {session.topics.join(', ')}
                              </span>
                              <span className="text-sm">{session.duration_minutes} minutes</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No study sessions recorded yet.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Progress;

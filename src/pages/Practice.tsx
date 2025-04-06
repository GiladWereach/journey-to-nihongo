
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Dumbbell, 
  Menu, 
  BookOpen, 
  Pen, 
  Clock, 
  GamepadIcon, 
  Bookmark, 
  Zap, 
  Star, 
  Repeat, 
  History,
  CircleCheck
} from 'lucide-react';
import PrimaryNavigation from '@/components/layout/PrimaryNavigation';
import { kanaProgressService } from '@/services/kanaProgressService';
import { quizService } from '@/services/quizService';
import { useToast } from '@/hooks/use-toast';

interface PracticeCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
  featured?: boolean;
  badgeText?: string;
  completed?: boolean;
}

const PracticeCard: React.FC<PracticeCardProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick,
  featured = false,
  badgeText,
  completed = false
}) => {
  return (
    <Card 
      className={`overflow-hidden transition-all hover:shadow-md ${
        featured ? 'border-indigo' : completed ? 'border-green-400' : ''
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-start">
          <div className={`p-3 rounded-lg ${
            featured ? 'bg-indigo text-white' : 
            completed ? 'bg-green-100 text-green-600' :
            'bg-indigo/10 text-indigo'
          } mr-4`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold">{title}</h3>
              {badgeText && (
                <Badge variant="outline" className="ml-2 text-xs bg-indigo/5">
                  {badgeText}
                </Badge>
              )}
              {completed && (
                <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-600 border-green-200">
                  <CircleCheck className="mr-1 h-3 w-3" />
                  Completed
                </Badge>
              )}
            </div>
            <p className="text-gray-600 mb-4">{description}</p>
            <Button 
              onClick={onClick}
              className={featured ? 'bg-indigo hover:bg-indigo/90' : ''}
            >
              Start Practice
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface RecentActivityProps {
  title: string;
  type: string;
  date: string;
  accuracy: number;
  onClick: () => void;
}

const RecentActivity: React.FC<RecentActivityProps> = ({
  title,
  type,
  date,
  accuracy,
  onClick
}) => {
  return (
    <div 
      className="border rounded-lg p-3 flex items-center hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="p-2 rounded-md bg-indigo/10 text-indigo mr-3">
        {type === 'quiz' && <GamepadIcon className="h-5 w-5" />}
        {type === 'writing' && <Pen className="h-5 w-5" />}
        {type === 'timed' && <Clock className="h-5 w-5" />}
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-sm">{title}</h4>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-sm font-medium">Accuracy</span>
        <span className={`text-xs font-medium ${
          accuracy >= 80 ? 'text-green-600' :
          accuracy >= 60 ? 'text-amber-600' :
          'text-red-600'
        }`}>
          {accuracy}%
        </span>
      </div>
    </div>
  );
};

const Practice: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [hiraganaStats, setHiraganaStats] = useState({ learned: 0, total: 0, avgProficiency: 0 });
  const [katakanaStats, setKatakanaStats] = useState({ learned: 0, total: 0, avgProficiency: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Fetch recent quiz sessions
        const sessions = await quizService.getRecentQuizSessions(user.id, 5);
        setRecentSessions(sessions);
        
        // Fetch kana statistics
        const hStats = await kanaProgressService.getKanaProficiencyStats(user.id, 'hiragana');
        const kStats = await kanaProgressService.getKanaProficiencyStats(user.id, 'katakana');
        
        setHiraganaStats(hStats);
        setKatakanaStats(kStats);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to load your practice data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, toast]);
  
  if (!user) {
    navigate('/auth');
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

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
                <h3 className="font-semibold text-indigo mb-3">Learning Statistics</h3>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Hiragana</span>
                      <span className="text-sm text-gray-500">
                        {hiraganaStats.learned}/{hiraganaStats.total} learned
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-matcha h-2.5 rounded-full" 
                        style={{ width: `${(hiraganaStats.learned / Math.max(hiraganaStats.total, 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Katakana</span>
                      <span className="text-sm text-gray-500">
                        {katakanaStats.learned}/{katakanaStats.total} learned
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-vermilion h-2.5 rounded-full" 
                        style={{ width: `${(katakanaStats.learned / Math.max(katakanaStats.total, 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    size="sm"
                    onClick={() => navigate('/quick-quiz')}
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Quick Quiz
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    size="sm"
                    onClick={() => navigate('/kana-learning')}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Kana Practice
                  </Button>
                </div>
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
                    <Dumbbell className="mr-2 h-5 w-5" />
                    Navigation
                  </h2>
                  <PrimaryNavigation />
                  
                  <div className="mt-6 space-y-2 border-t pt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Quick Access</h3>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      size="sm"
                      onClick={() => navigate('/quick-quiz')}
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Quick Quiz
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      size="sm"
                      onClick={() => navigate('/kana-learning')}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Kana Practice
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-indigo mb-2">Practice Hub</h1>
              <p className="text-gray-600">
                Choose a practice activity to reinforce your learning and build your skills.
              </p>
            </div>
            
            <Tabs defaultValue="activities" className="mb-8">
              <TabsList>
                <TabsTrigger value="activities">Practice Activities</TabsTrigger>
                <TabsTrigger value="recent">Recent Practice</TabsTrigger>
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
              </TabsList>
              
              <TabsContent value="activities" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <PracticeCard
                    title="Quick Quiz"
                    description="Test your knowledge with a quick quiz on hiragana, katakana, or both."
                    icon={GamepadIcon}
                    onClick={() => navigate('/quick-quiz')}
                    featured={true}
                    badgeText="Popular"
                  />
                  
                  <PracticeCard
                    title="Writing Practice"
                    description="Practice writing hiragana and katakana characters with stroke order guidance."
                    icon={Pen}
                    onClick={() => navigate('/writing-practice')}
                    badgeText="Coming Soon"
                  />
                  
                  <PracticeCard
                    title="Timed Challenge"
                    description="Race against the clock to identify as many characters as you can."
                    icon={Clock}
                    onClick={() => navigate('/timed-challenge')}
                    badgeText="Coming Soon"
                  />
                  
                  <PracticeCard
                    title="Vocabulary Drill"
                    description="Reinforce your vocabulary knowledge with targeted practice."
                    icon={BookOpen}
                    onClick={() => navigate('/vocabulary-drill')}
                    badgeText="Coming Soon"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="recent">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-indigo border-t-transparent rounded-full"></div>
                  </div>
                ) : recentSessions.length > 0 ? (
                  <div className="space-y-3">
                    {recentSessions.map((session, index) => (
                      <RecentActivity
                        key={index}
                        title={`${session.kana_type.charAt(0).toUpperCase() + session.kana_type.slice(1)} Quiz`}
                        type="quiz"
                        date={formatDate(session.start_time)}
                        accuracy={session.accuracy || 0}
                        onClick={() => navigate('/quick-quiz', { 
                          state: { kanaType: session.kana_type } 
                        })}
                      />
                    ))}
                    
                    <div className="flex justify-center mt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/progress')}
                        className="flex items-center"
                      >
                        <History className="mr-2 h-4 w-4" />
                        View Full History
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-lg bg-gray-50">
                    <div className="mb-3 text-gray-400">
                      <History className="h-10 w-10 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Recent Activity</h3>
                    <p className="text-gray-500 mb-4">
                      You haven't completed any practice sessions yet.
                    </p>
                    <Button onClick={() => navigate('/quick-quiz')}>
                      Start Practicing Now
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="recommended">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hiraganaStats.learned < hiraganaStats.total * 0.5 && (
                    <PracticeCard
                      title="Hiragana Basics"
                      description="Continue learning the foundational hiragana characters."
                      icon={Star}
                      onClick={() => navigate('/kana-learning', { state: { kanaType: 'hiragana' } })}
                      featured={true}
                    />
                  )}
                  
                  {katakanaStats.learned < katakanaStats.total * 0.3 && hiraganaStats.learned > hiraganaStats.total * 0.6 && (
                    <PracticeCard
                      title="Katakana Introduction"
                      description="Start learning katakana characters after your hiragana progress."
                      icon={Bookmark}
                      onClick={() => navigate('/kana-learning', { state: { kanaType: 'katakana' } })}
                      featured={false}
                    />
                  )}
                  
                  {hiraganaStats.avgProficiency > 60 && (
                    <PracticeCard
                      title="Hiragana Review"
                      description="Strengthen your hiragana knowledge with a comprehensive review."
                      icon={Repeat}
                      onClick={() => navigate('/quick-quiz', { state: { kanaType: 'hiragana' } })}
                      featured={false}
                    />
                  )}
                  
                  {katakanaStats.avgProficiency > 60 && (
                    <PracticeCard
                      title="Katakana Review"
                      description="Strengthen your katakana knowledge with a comprehensive review."
                      icon={Repeat}
                      onClick={() => navigate('/quick-quiz', { state: { kanaType: 'katakana' } })}
                      featured={false}
                    />
                  )}
                  
                  {/* If we don't have enough recommendations based on progress */}
                  {hiraganaStats.learned < 5 && katakanaStats.learned < 5 && (
                    <PracticeCard
                      title="First Characters Quiz"
                      description="Start with a basic quiz to learn your first Japanese characters."
                      icon={Zap}
                      onClick={() => navigate('/quick-quiz', { state: { kanaType: 'hiragana' } })}
                      featured={true}
                    />
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Practice;

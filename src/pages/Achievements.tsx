
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import { Award, ArrowLeft, Medal, Trophy, BadgeCheck, Star, AlertCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { Achievement, UserAchievement } from '@/types/achievements';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { achievementService } from '@/services/achievementService';

// Map of icon names to Lucide icon components
const achievementIcons: Record<string, React.ReactNode> = {
  'award': <Award className="h-6 w-6" />,
  'trophy': <Trophy className="h-6 w-6" />,
  'medal': <Medal className="h-6 w-6" />,
  'badge': <Badge className="h-6 w-6" />,
  'badge-check': <BadgeCheck className="h-6 w-6" />,
  'star': <Star className="h-6 w-6" />,
};

const AchievementCard = ({ 
  achievement, 
  earned = false, 
  earnedAt = '' 
}: { 
  achievement: Achievement; 
  earned?: boolean; 
  earnedAt?: string;
}) => {
  return (
    <Card className={`overflow-hidden transition-all ${earned ? 'border-indigo' : 'opacity-70'}`}>
      <CardHeader className={`pb-2 ${earned ? 'bg-indigo/10' : 'bg-gray-100'}`}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{achievement.title}</CardTitle>
          <div className={`p-2 rounded-full ${earned ? 'bg-indigo text-white' : 'bg-gray-200 text-gray-500'}`}>
            {achievementIcons[achievement.icon] || <AlertCircle className="h-6 w-6" />}
          </div>
        </div>
        <CardDescription>{achievement.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-sm text-gray-500 mb-2">
          <strong>Requirements:</strong> {achievement.requirements}
        </div>
        <div className="flex justify-between items-center">
          <Badge variant={earned ? "default" : "outline"} className={earned ? "bg-indigo hover:bg-indigo/90" : ""}>
            {achievement.points} points
          </Badge>
          {earned && earnedAt && (
            <span className="text-xs text-gray-500">
              Earned on {new Date(earnedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const AchievementsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Calculate total points earned
  const totalPoints = userAchievements.reduce((total, userAchievement) => {
    const achievement = achievements.find(a => a.id === userAchievement.achievement_id);
    return total + (achievement?.points || 0);
  }, 0);

  // Get user achievement for a specific achievement
  const getUserAchievement = (achievementId: string) => {
    return userAchievements.find(ua => ua.achievement_id === achievementId);
  };
  
  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch all achievements
        const achievementsData = await achievementService.getAllAchievements();
        
        // Fetch user's earned achievements
        const userAchievementsData = await achievementService.getUserAchievements(user.id);
        
        setAchievements(achievementsData);
        setUserAchievements(userAchievementsData);
      } catch (error: any) {
        console.error('Error fetching achievements:', error.message);
        toast({
          title: 'Error',
          description: 'Failed to load achievements',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAchievements();
  }, [user, toast]);
  
  // Filter achievements based on active tab
  const filteredAchievements = achievements.filter(achievement => {
    if (activeTab === "all") return true;
    if (activeTab === "earned") 
      return userAchievements.some(ua => ua.achievement_id === achievement.id);
    if (activeTab === "unearned") 
      return !userAchievements.some(ua => ua.achievement_id === achievement.id);
    return achievement.category === activeTab;
  });
  
  // Get unique categories from achievements
  const categories = [...new Set(achievements.map(a => a.category))];
  
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 px-4 flex justify-center">
          <div className="flex flex-col items-center mt-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading achievements...</p>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 px-4 bg-softgray/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col">
            <div className="mb-6">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-indigo hover:text-indigo/80 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </button>
            </div>
            
            <div className="flex items-center space-x-3 mb-8">
              <JapaneseCharacter character="実績" size="md" color="text-indigo" />
              <h1 className="text-3xl font-bold text-indigo">Achievements</h1>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                  <div className="bg-indigo/10 border border-indigo/20 rounded-lg p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 bg-indigo/30 rounded-full flex items-center justify-center mb-2">
                      <Trophy className="h-6 w-6 text-indigo" />
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{userAchievements.length}</h3>
                    <p className="text-gray-600">Achievements Earned</p>
                  </div>
                  
                  <div className="bg-vermilion/10 border border-vermilion/20 rounded-lg p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 bg-vermilion/30 rounded-full flex items-center justify-center mb-2">
                      <Medal className="h-6 w-6 text-vermilion" />
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{totalPoints}</h3>
                    <p className="text-gray-600">Total Points</p>
                  </div>
                  
                  <div className="bg-matcha/10 border border-matcha/20 rounded-lg p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 bg-matcha/30 rounded-full flex items-center justify-center mb-2">
                      <BadgeCheck className="h-6 w-6 text-matcha" />
                    </div>
                    <h3 className="text-xl font-semibold mb-1">
                      {Math.round((userAchievements.length / achievements.length) * 100)}%
                    </h3>
                    <p className="text-gray-600">Completion Rate</p>
                  </div>
                </div>
                
                <Tabs defaultValue="all" onValueChange={setActiveTab}>
                  <TabsList className="mb-6 grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="earned">Earned</TabsTrigger>
                    <TabsTrigger value="unearned">Unearned</TabsTrigger>
                    {categories.map(category => (
                      <TabsTrigger key={category} value={category} className="capitalize">
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {/* All tabs share the same content with different filtering */}
                  <TabsContent value={activeTab} className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredAchievements.length > 0 ? (
                        filteredAchievements.map(achievement => {
                          const userAchievement = getUserAchievement(achievement.id);
                          return (
                            <AchievementCard 
                              key={achievement.id} 
                              achievement={achievement} 
                              earned={Boolean(userAchievement)}
                              earnedAt={userAchievement?.earned_at || ''}
                            />
                          );
                        })
                      ) : (
                        <div className="col-span-full text-center py-10">
                          <p className="text-gray-500">No achievements found in this category.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AchievementsPage;

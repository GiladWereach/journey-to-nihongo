
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Award, Trophy, Medal, BadgeCheck, Star, Badge, ChevronRight } from 'lucide-react';
import { Achievement, UserAchievement } from '@/types/achievements';
import { achievementService } from '@/services/achievementService';
import { Button } from '@/components/ui/button';

// Map of icon names to Lucide icon components
const achievementIcons: Record<string, React.ReactNode> = {
  'award': <Award className="h-5 w-5" />,
  'trophy': <Trophy className="h-5 w-5" />,
  'medal': <Medal className="h-5 w-5" />,
  'badge': <Badge className="h-5 w-5" />,
  'badge-check': <BadgeCheck className="h-5 w-5" />,
  'star': <Star className="h-5 w-5" />,
};

interface AchievementsListProps {
  limit?: number;
  showViewAll?: boolean;
}

const AchievementsList = ({ limit = 3, showViewAll = true }: AchievementsListProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recentAchievements, setRecentAchievements] = useState<UserAchievement[]>([]);
  
  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const userAchievements = await achievementService.getUserAchievements(user.id);
        
        // Sort by earned_at (most recent first) and limit
        const sorted = userAchievements
          .filter(a => a.earned_at) // Only include achievements with earned_at property
          .sort((a, b) => {
            const dateA = a.earned_at ? new Date(a.earned_at).getTime() : 0;
            const dateB = b.earned_at ? new Date(b.earned_at).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, limit);
          
        setRecentAchievements(sorted as UserAchievement[]);
      } catch (error) {
        console.error('Error fetching recent achievements:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAchievements();
  }, [user, limit]);
  
  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo border-t-transparent"></div>
      </div>
    );
  }
  
  if (recentAchievements.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 mb-4">You haven't earned any achievements yet.</p>
        <Button variant="outline" onClick={() => navigate('/achievements')}>
          View Available Achievements
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <ul className="space-y-3">
        {recentAchievements.map((userAchievement) => (
          <li 
            key={userAchievement.id} 
            className="bg-softgray/30 rounded-lg p-3 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-indigo/20 flex items-center justify-center text-indigo">
                {userAchievement.achievement && achievementIcons[userAchievement.achievement.icon]}
              </div>
              <div>
                <h4 className="font-medium">{userAchievement.achievement?.title}</h4>
                <p className="text-sm text-gray-600">
                  {userAchievement.earned_at && (
                    <>Earned on {new Date(userAchievement.earned_at).toLocaleDateString()}</>
                  )}
                </p>
              </div>
            </div>
            <div className="hidden sm:block text-sm text-gray-500">
              {userAchievement.achievement?.points} points
            </div>
          </li>
        ))}
      </ul>
      
      {showViewAll && (
        <div className="mt-4 text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/achievements')}
            className="text-indigo hover:text-indigo/80 hover:bg-indigo/10"
          >
            View All Achievements
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default AchievementsList;

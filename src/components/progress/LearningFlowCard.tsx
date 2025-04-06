
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Check, Clock3, GitBranch, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseClient } from '@/lib/supabase';

interface LearningFlowCardProps {
  className?: string;
  currentLearningSessions?: number;
  reviewsDueToday?: number;
  recommendedSessionTime?: number;
  lastReviewDate?: Date | null;
}

const LearningFlowCard: React.FC<LearningFlowCardProps> = ({
  className,
}) => {
  const { user } = useAuth();
  const [currentLearningSessions, setCurrentLearningSessions] = useState(2);
  const [reviewsDueToday, setReviewsDueToday] = useState(15);
  const [recommendedSessionTime, setRecommendedSessionTime] = useState(20);
  const [lastReviewDate, setLastReviewDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch actual learning flow data from database
  useEffect(() => {
    if (!user) return;

    const fetchLearningFlowData = async () => {
      setIsLoading(true);
      try {
        // Get active learning sessions
        const { data: activeSessions, error: sessionsError } = await supabaseClient
          .from('kana_learning_sessions')
          .select('*')
          .eq('user_id', user.id)
          .eq('completed', false)
          .order('created_at', { ascending: false });
          
        if (sessionsError) throw sessionsError;
        
        // Get reviews due today
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        
        const { data: dueReviews, error: reviewsError } = await supabaseClient
          .from('user_kana_progress')
          .select('*')
          .eq('user_id', user.id)
          .lte('review_due', today.toISOString())
          .order('review_due', { ascending: true });
          
        if (reviewsError) throw reviewsError;
        
        // Get last review session
        const { data: lastSession, error: lastSessionError } = await supabaseClient
          .from('kana_learning_sessions')
          .select('*')
          .eq('user_id', user.id)
          .eq('completed', true)
          .order('end_time', { ascending: false })
          .limit(1)
          .single();
          
        if (lastSessionError && lastSessionError.code !== 'PGRST116') {
          console.error('Error fetching last session:', lastSessionError);
        }
        
        // Calculate recommended session time based on user's history and due reviews
        let recommendedTime = 20; // Default
        if (dueReviews && dueReviews.length > 0) {
          // More due reviews = longer recommended session
          recommendedTime = Math.min(30, 15 + Math.floor(dueReviews.length / 5) * 5);
        }
        
        // Update state with actual data
        setCurrentLearningSessions(activeSessions?.length || 0);
        setReviewsDueToday(dueReviews?.length || 0);
        setRecommendedSessionTime(recommendedTime);
        setLastReviewDate(lastSession ? new Date(lastSession.end_time) : null);
        
      } catch (error) {
        console.error('Error fetching learning flow data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLearningFlowData();
  }, [user]);

  // Calculate days since last review
  const daysSinceLastReview = lastReviewDate 
    ? Math.floor((new Date().getTime() - new Date(lastReviewDate).getTime()) / (1000 * 3600 * 24))
    : null;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl font-semibold">
          <Activity className="mr-2 h-5 w-5 text-vermilion" />
          Learning Flow Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-md"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {/* Active Learning Sessions */}
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center mb-2">
                <GitBranch className="h-4 w-4 text-indigo mr-2" />
                <h4 className="text-sm font-medium">Active Learning</h4>
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-indigo">{currentLearningSessions}</span>
                <span className="text-xs text-gray-500 ml-2">active sessions</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Focus on completing your active learning modules
              </p>
            </div>
            
            {/* Due Reviews */}
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center mb-2">
                <RefreshCw className="h-4 w-4 text-vermilion mr-2" />
                <h4 className="text-sm font-medium">Due Reviews</h4>
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-vermilion">{reviewsDueToday}</span>
                <span className="text-xs text-gray-500 ml-2">items due today</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Review these items to maintain your memory
              </p>
            </div>
            
            {/* Recommended Session */}
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center mb-2">
                <Clock3 className="h-4 w-4 text-matcha mr-2" />
                <h4 className="text-sm font-medium">Recommended Session</h4>
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-matcha">{recommendedSessionTime}</span>
                <span className="text-xs text-gray-500 ml-2">minutes</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Optimal study duration for today
              </p>
            </div>
            
            {/* Last Review */}
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center mb-2">
                <Check className="h-4 w-4 text-amber-500 mr-2" />
                <h4 className="text-sm font-medium">Last Review</h4>
              </div>
              <div className="flex items-baseline">
                {lastReviewDate ? (
                  <>
                    <span className="text-2xl font-bold text-amber-500">{daysSinceLastReview}</span>
                    <span className="text-xs text-gray-500 ml-2">days ago</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">No reviews yet</span>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {daysSinceLastReview !== null && daysSinceLastReview > 3 
                  ? "Time to resume your studies!"
                  : "Keep up the good work!"}
              </p>
            </div>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-indigo/5 rounded-md border border-indigo/10">
          <h4 className="text-sm font-medium mb-1 text-indigo">Personalized Study Plan</h4>
          <p className="text-xs text-gray-700">
            Based on your learning patterns, we recommend focusing on {reviewsDueToday > 10 ? 'review of previously learned characters' : 'learning new characters'} 
            {' '}{new Date().getHours() < 12 ? 'in the morning' : new Date().getHours() < 18 ? 'in the afternoon' : 'in the evening'} 
            for optimal retention.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningFlowCard;

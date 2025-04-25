
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import { Profile, UserSettings } from '@/types/kana';
import { kanaProgressService } from '@/services/kanaProgressService';
import { useUserProgress } from '@/hooks/useUserProgress';
import { StudySession, ContinueLearningData } from '@/types/dashboard';

// Import dashboard components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import DashboardMainContent from '@/components/dashboard/DashboardMainContent';

// Import utility functions
import { 
  calculateStreak, 
  calculateTotalStudyTimeInPastWeek,
  determineRecommendedNextModule,
  findLastActiveModule
} from '@/utils/dashboardUtils';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [hiraganaStats, setHiraganaStats] = useState({ learned: 0, total: 0, avgProficiency: 0 });
  const [katakanaStats, setKatakanaStats] = useState({ learned: 0, total: 0, avgProficiency: 0 });
  const { toast } = useToast();
  const { progress: userProgress, loading: progressLoading } = useUserProgress();
  
  const totalStudyTime = calculateTotalStudyTimeInPastWeek(studySessions);
  
  // Check if we have assessment completion in study sessions even if userProgress doesn't reflect it
  const [assessmentCompleted, setAssessmentCompleted] = useState<boolean>(false);
  
  useEffect(() => {
    // Update from userProgress when available
    if (userProgress) {
      setAssessmentCompleted(userProgress.assessment_completed);
    }
  }, [userProgress]);
  
  const handleModuleNavigation = (path: string, isReady: boolean = true) => {
    if (!assessmentCompleted && path !== '/assessment') {
      toast({
        title: "Assessment Required",
        description: "Please complete the assessment first to personalize your learning journey.",
        variant: "default",
      });
      navigate('/assessment');
      return;
    }
    
    if (isReady) {
      navigate(path);
    } else {
      toast({
        title: "Coming Soon",
        description: "This learning module will be available soon!",
        variant: "default",
      });
    }
  };
  
  useEffect(() => {
    const getProfile = async () => {
      if (!user) return;
      
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        setProfile(profileData as Profile);
        
        const { data: settingsData, error: settingsError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (settingsError) throw settingsError;
        setSettings(settingsData as UserSettings);
        
        // Fetch study sessions
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('study_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (sessionsError) throw sessionsError;
        setStudySessions(sessionsData || []);
        
        // Check if there's an assessment session that's completed
        if (sessionsData && sessionsData.length > 0) {
          const hasCompletedAssessment = sessionsData.some(
            session => session.module === 'assessment' && session.completed === true
          );
          
          if (hasCompletedAssessment) {
            setAssessmentCompleted(true);
          }
        }
        
        // Get kana progress statistics
        if (user.id) {
          const hiraganaProgressStats = await kanaProgressService.getKanaProficiencyStats(
            user.id,
            'hiragana'
          );
          setHiraganaStats(hiraganaProgressStats);
          
          const katakanaProgressStats = await kanaProgressService.getKanaProficiencyStats(
            user.id,
            'katakana'
          );
          setKatakanaStats(katakanaProgressStats);
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error.message);
        toast({
          title: 'Error fetching profile',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    getProfile();
  }, [user, toast]);
  
  if (loading || progressLoading) {
    return <DashboardSkeleton />;
  }
  
  // Update to use our assessmentCompleted state which considers both sources
  const showAssessmentPrompt = !assessmentCompleted;
  
  // Calculate recommended next module based on progress
  const recommendedNextModule = determineRecommendedNextModule(
    profile, 
    settings,
    hiraganaStats,
    katakanaStats,
    showAssessmentPrompt
  );
  
  // Find last active module for continue learning
  const continueLearning = findLastActiveModule(
    studySessions,
    hiraganaStats,
    katakanaStats
  );
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 px-4 bg-softgray/30">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader />
          
          {profile && (
            <DashboardMainContent
              profile={profile}
              settings={settings}
              studySessions={studySessions}
              showAssessmentPrompt={showAssessmentPrompt}
              continueLearning={continueLearning}
              hiraganaStats={hiraganaStats}
              katakanaStats={katakanaStats}
              signOut={signOut}
              handleModuleNavigation={handleModuleNavigation}
              recommendedNextModule={recommendedNextModule}
              calculateStreak={() => calculateStreak(studySessions)}
              totalStudyTime={totalStudyTime}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;


import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import Navbar from '@/components/layout/Navbar';
import { Profile, UserSettings } from '@/types/kana';
import { kanaProgressService } from '@/services/kanaProgressService';
import { StudySession, ContinueLearningData } from '@/types/dashboard';

// Import the new component sections
import ProfileCard from '@/components/dashboard/ProfileCard';
import ProgressOverview from '@/components/dashboard/ProgressOverview';
import ContinueLearningCard from '@/components/dashboard/ContinueLearningCard';
import AssessmentPrompt from '@/components/dashboard/AssessmentPrompt';
import QuickPracticeSection from '@/components/dashboard/QuickPracticeSection';
import LearningModulesSection from '@/components/dashboard/LearningModulesSection';
import RecommendedNextSteps from '@/components/dashboard/RecommendedNextSteps';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssessmentPrompt, setShowAssessmentPrompt] = useState(false);
  const [continueLearning, setContinueLearning] = useState<ContinueLearningData | null>(null);
  const [hiraganaStats, setHiraganaStats] = useState({ learned: 0, total: 0, avgProficiency: 0 });
  const [katakanaStats, setKatakanaStats] = useState({ learned: 0, total: 0, avgProficiency: 0 });
  const { toast } = useToast();
  
  const totalStudyTime = studySessions
    .filter(session => {
      const sessionDate = new Date(session.created_at || '');
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return sessionDate >= oneWeekAgo;
    })
    .reduce((sum, session) => {
      return sum + session.duration_minutes;
    }, 0);
  
  const calculateStreak = () => {
    if (studySessions.length === 0) return 0;
    
    const sortedSessions = [...studySessions].sort((a, b) => 
      new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
    );
    
    const uniqueDates = new Set(
      sortedSessions.map(session => 
        new Date(session.created_at || '').toISOString().split('T')[0]
      )
    );
    
    const dateArray = Array.from(uniqueDates);
    
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (dateArray[0] !== today && dateArray[0] !== yesterday) {
      return 0;
    }
    
    let streak = 1;
    for (let i = 1; i < dateArray.length; i++) {
      const current = new Date(dateArray[i-1]);
      const prev = new Date(dateArray[i]);
      
      const diffDays = Math.round((current.getTime() - prev.getTime()) / 86400000);
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const determineRecommendedNextModule = () => {
    if (!profile || !settings) return null;

    if (showAssessmentPrompt) {
      return {
        title: "Complete Assessment",
        description: "Take a quick assessment to personalize your learning experience.",
        progress: 0,
        route: "/assessment",
        japaneseTitle: "アセスメント",
      };
    }
    
    // If user hasn't started or completed hiragana
    if (hiraganaStats.learned < hiraganaStats.total * 0.9) {
      return {
        title: "Hiragana Mastery",
        description: "Continue learning the hiragana characters.",
        progress: (hiraganaStats.learned / hiraganaStats.total) * 100,
        route: "/kana-learning",
        japaneseTitle: "ひらがな",
      };
    }
    
    // If user has completed hiragana but not katakana
    if (hiraganaStats.learned >= hiraganaStats.total * 0.9 && 
        katakanaStats.learned < katakanaStats.total * 0.9) {
      return {
        title: "Katakana Essentials",
        description: "Start learning katakana characters.",
        progress: (katakanaStats.learned / katakanaStats.total) * 100,
        route: "/kana-learning?type=katakana",
        japaneseTitle: "カタカナ",
      };
    }
    
    // If user has completed both hiragana and katakana
    if (hiraganaStats.learned >= hiraganaStats.total * 0.9 && 
        katakanaStats.learned >= katakanaStats.total * 0.9) {
      return {
        title: "Basic Kanji",
        description: "Start learning essential kanji characters.",
        progress: 0,
        route: "/kanji-basics",
        japaneseTitle: "漢字",
      };
    }
    
    return {
      title: "Hiragana Mastery",
      description: "Learn all 46 basic hiragana characters.",
      progress: 0,
      route: "/kana-learning",
      japaneseTitle: "ひらがな",
    };
  };
  
  const findLastActiveModule = () => {
    if (studySessions.length === 0) return null;
    
    // Get the most recent study session
    const recentSession = [...studySessions].sort((a, b) => 
      new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
    )[0];
    
    let moduleData: ContinueLearningData | null = null;
    
    // Parse created_at to a formatted string
    const lastActiveDate = recentSession.created_at 
      ? new Date(recentSession.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'Recently';
    
    // Map the module to a title and route
    switch (recentSession.module) {
      case 'hiragana':
        moduleData = {
          title: "Hiragana Mastery",
          description: "Continue your hiragana learning journey.",
          progress: (hiraganaStats.learned / hiraganaStats.total) * 100,
          route: "/kana-learning",
          japaneseTitle: "ひらがな",
          lastActive: lastActiveDate
        };
        break;
      case 'katakana':
        moduleData = {
          title: "Katakana Essentials",
          description: "Continue your katakana learning journey.",
          progress: (katakanaStats.learned / katakanaStats.total) * 100,
          route: "/kana-learning?type=katakana",
          japaneseTitle: "カタカナ",
          lastActive: lastActiveDate
        };
        break;
      case 'quiz':
        moduleData = {
          title: "Quick Quiz",
          description: "Continue practicing with quick quizzes.",
          progress: 100,
          route: "/quick-quiz",
          lastActive: lastActiveDate
        };
        break;
      case 'assessment':
        moduleData = {
          title: "Assessment",
          description: "Continue your Japanese proficiency assessment.",
          progress: recentSession.completed ? 100 : 50,
          route: "/assessment",
          lastActive: lastActiveDate
        };
        break;
      default:
        // If we can't determine the module, recommend hiragana as default
        moduleData = {
          title: "Hiragana Mastery",
          description: "Learn the Japanese hiragana characters.",
          progress: (hiraganaStats.learned / hiraganaStats.total) * 100,
          route: "/kana-learning",
          japaneseTitle: "ひらがな",
        };
    }
    
    return moduleData;
  };
  
  const handleModuleNavigation = (path: string, isReady: boolean = true) => {
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
        
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('study_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (sessionsError) throw sessionsError;
        setStudySessions(sessionsData || []);
        
        // Improved assessment completion check
        const hasCompletedAssessment = (sessionsData || []).some(
          session => session.module === 'assessment' && session.completed === true
        );
        
        // Only show assessment prompt if user hasn't completed it
        setShowAssessmentPrompt(!hasCompletedAssessment);
        
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
  
  useEffect(() => {
    // Determine what module to continue learning
    if (!loading && profile) {
      const lastModule = findLastActiveModule();
      setContinueLearning(lastModule);
    }
  }, [loading, profile, hiraganaStats, katakanaStats, studySessions]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center">
        <div className="flex flex-col items-center mt-36">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  const recommendedNextModule = determineRecommendedNextModule();
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 px-4 bg-softgray/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-3 mb-8">
              <JapaneseCharacter character="ようこそ" size="md" color="text-indigo" />
              <h1 className="text-3xl font-bold text-indigo">Welcome Back!</h1>
            </div>
            
            <AssessmentPrompt show={showAssessmentPrompt} />
            
            <ContinueLearningCard 
              continueLearning={continueLearning} 
              onContinue={handleModuleNavigation} 
            />
            
            <QuickPracticeSection onNavigate={handleModuleNavigation} />
            
            {profile && (
              <div className="w-full max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="md:col-span-1">
                    <ProfileCard profile={profile} signOut={signOut} />
                  </div>
                  
                  <div className="md:col-span-2">
                    <ProgressOverview 
                      profile={profile} 
                      studySessions={studySessions}
                      calculateStreak={calculateStreak}
                      totalStudyTime={totalStudyTime}
                    />
                  </div>
                </div>
                
                <LearningModulesSection 
                  profile={profile}
                  hiraganaStats={hiraganaStats}
                  katakanaStats={katakanaStats}
                  settings={settings}
                  onNavigate={handleModuleNavigation}
                />
                
                <RecommendedNextSteps 
                  showAssessmentPrompt={showAssessmentPrompt}
                  recommendedNextModule={recommendedNextModule}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

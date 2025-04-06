
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import LearningPathCard from '@/components/ui/LearningPathCard';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { Edit, Calendar, Award, BookOpen, BarChart2, CirclePlay, StarHalf, Book } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { Profile, UserSettings } from '@/types/kana';
import { kanaProgressService } from '@/services/kanaProgressService';

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
  updated_at?: string;
}

interface ContinueLearningData {
  title: string;
  description: string;
  progress: number;
  route: string;
  japaneseTitle?: string;
  lastActive?: string;
}

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
        
        const hasCompletedAssessment = (sessionsData || []).some(
          session => session.module === 'assessment' && session.completed
        );
        
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
            
            {showAssessmentPrompt && (
              <div className="w-full max-w-4xl mb-8 bg-vermilion/10 border border-vermilion/20 rounded-xl p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-vermilion mb-2">Complete Your Assessment</h2>
                    <p className="text-gray-700">Take a quick assessment to help us personalize your learning experience.</p>
                  </div>
                  <Button 
                    className="bg-vermilion hover:bg-vermilion/90 whitespace-nowrap"
                    onClick={() => navigate('/assessment')}
                  >
                    Start Assessment
                  </Button>
                </div>
              </div>
            )}
            
            {/* New Continue Learning Section */}
            {continueLearning && (
              <div className="w-full max-w-4xl mb-8 bg-indigo/10 border border-indigo/20 rounded-xl p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-indigo flex items-center">
                      <CirclePlay className="mr-2 h-5 w-5" />
                      Continue Learning
                    </h2>
                    {continueLearning.lastActive && (
                      <span className="text-sm text-gray-500">Last active: {continueLearning.lastActive}</span>
                    )}
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                      <div className="flex-grow">
                        <div className="flex items-center">
                          {continueLearning.japaneseTitle && (
                            <span className="text-2xl font-japanese mr-2">{continueLearning.japaneseTitle}</span>
                          )}
                          <h3 className="text-lg font-semibold">{continueLearning.title}</h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{continueLearning.description}</p>
                        <ProgressIndicator 
                          progress={continueLearning.progress} 
                          size="sm" 
                          color="bg-indigo" 
                        />
                      </div>
                      <Button
                        className="bg-indigo hover:bg-indigo/90 whitespace-nowrap"
                        onClick={() => handleModuleNavigation(continueLearning.route)}
                      >
                        Continue Learning
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Quick Practice Section */}
            <div className="w-full max-w-4xl mb-8">
              <h2 className="text-xl font-semibold text-indigo mb-4 flex items-center">
                <StarHalf className="mr-2 h-5 w-5" />
                Quick Practice
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleModuleNavigation('/quick-quiz', true)}
                >
                  <h3 className="font-semibold mb-2 flex items-center">
                    <CirclePlay className="mr-2 h-4 w-4 text-vermilion" />
                    Kana Quiz
                  </h3>
                  <p className="text-sm text-gray-600">Test your knowledge with a quick kana recognition quiz.</p>
                </div>
                
                <div 
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleModuleNavigation('/kana-learning', true)}
                >
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Book className="mr-2 h-4 w-4 text-matcha" />
                    Hiragana Review
                  </h3>
                  <p className="text-sm text-gray-600">Review hiragana characters you've already learned.</p>
                </div>
                
                <div 
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleModuleNavigation('/kana-learning?type=katakana', true)}
                >
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Book className="mr-2 h-4 w-4 text-indigo" />
                    Katakana Review
                  </h3>
                  <p className="text-sm text-gray-600">Review katakana characters you've already learned.</p>
                </div>
              </div>
            </div>
            
            {profile && (
              <div className="w-full max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="md:col-span-1 bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 flex flex-col items-center text-center">
                      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo to-vermilion/70 flex items-center justify-center text-white text-2xl font-bold mb-4">
                        {profile.full_name?.charAt(0) || profile.username?.charAt(0) || 'U'}
                      </div>
                      <h2 className="text-xl font-semibold">{profile.full_name || 'Learner'}</h2>
                      <p className="text-gray-600 mb-4">@{profile.username}</p>
                      
                      <div className="grid grid-cols-2 gap-2 w-full mb-4">
                        <div className="bg-softgray/50 p-2 rounded">
                          <p className="text-xs text-gray-500">Level</p>
                          <p className="font-medium">{profile.learning_level || 'Beginner'}</p>
                        </div>
                        <div className="bg-softgray/50 p-2 rounded">
                          <p className="text-xs text-gray-500">Goal</p>
                          <p className="font-medium">{profile.daily_goal_minutes} min/day</p>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-indigo hover:bg-indigo/90 mb-2 flex items-center justify-center"
                        onClick={() => navigate('/edit-profile')}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full border-red-500 text-red-500 hover:bg-red-50"
                        onClick={signOut}
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                      <h2 className="text-2xl font-bold text-indigo mb-4 flex items-center">
                        <BarChart2 className="mr-2 h-5 w-5 text-indigo" />
                        Your Progress
                      </h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div className="bg-softgray/30 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-800">Weekly Study Time</h3>
                            <span className="text-xl font-bold text-indigo">{totalStudyTime} min</span>
                          </div>
                          <ProgressIndicator 
                            progress={Math.min(100, (totalStudyTime / (profile.daily_goal_minutes * 7)) * 100)} 
                            size="md" 
                            color="bg-matcha" 
                          />
                          <p className="text-sm text-gray-600 mt-2">
                            {totalStudyTime >= (profile.daily_goal_minutes * 7) 
                              ? 'Great job! You met your weekly goal.'
                              : `Goal: ${profile.daily_goal_minutes * 7} minutes per week`}
                          </p>
                        </div>
                        
                        <div className="bg-softgray/30 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-800">Study Streak</h3>
                            <div className="flex items-center">
                              <span className="text-xl font-bold text-vermilion mr-1">{calculateStreak()}</span>
                              <span className="text-gray-600">days</span>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            {Array.from({ length: 7 }).map((_, index) => (
                              <div
                                key={index}
                                className={`h-8 flex-1 rounded ${
                                  index < calculateStreak() ? 'bg-vermilion' : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            {calculateStreak() > 0 
                              ? `You've studied ${calculateStreak()} days in a row!` 
                              : 'Start your streak by studying today!'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                          onClick={() => navigate('/progress')}
                          className="flex-1 bg-softgray hover:bg-softgray/80 text-gray-800"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          View Detailed Progress
                        </Button>
                        <Button
                          onClick={() => navigate('/achievements')}
                          className="flex-1 bg-softgray hover:bg-softgray/80 text-gray-800"
                        >
                          <Award className="mr-2 h-4 w-4" />
                          Achievements
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-indigo mb-4 flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-indigo" />
                      Learning Modules
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <LearningPathCard
                        title="Hiragana Mastery"
                        japaneseTitle="ひらがな"
                        description="Learn all 46 basic hiragana characters with proper stroke order and pronunciation."
                        progress={(hiraganaStats.learned / hiraganaStats.total) * 100}
                        isFeatured={profile.learning_level === 'beginner'}
                        onClick={() => handleModuleNavigation('/kana-learning', true)}
                      />
                      
                      <LearningPathCard
                        title="Katakana Essentials"
                        japaneseTitle="カタカナ"
                        description="Master the katakana syllabary used for foreign words and emphasis."
                        progress={(katakanaStats.learned / katakanaStats.total) * 100}
                        onClick={() => handleModuleNavigation('/kana-learning?type=katakana', true)}
                      />
                      
                      <LearningPathCard
                        title="Basic Kanji"
                        japaneseTitle="漢字"
                        description="Learn your first 100 essential kanji characters with readings and example words."
                        progress={settings?.prior_knowledge === 'basic_kanji' ? 30 : 0}
                        onClick={() => handleModuleNavigation('/kanji-basics')}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Recommended Next Steps */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-indigo mb-6">Recommended Next Steps</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className={`${showAssessmentPrompt ? 'bg-vermilion/5 border-vermilion/10' : 'bg-indigo/5 border-indigo/10'} p-6 rounded-lg border flex flex-col items-center text-center`}>
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 ${showAssessmentPrompt ? 'bg-vermilion/10 text-vermilion' : 'bg-indigo/10 text-indigo'}`}>1</div>
                        <h3 className="font-semibold mb-2">Complete Assessment</h3>
                        <p className="text-sm text-gray-600 mb-4">Fine-tune your learning path</p>
                        <Button 
                          className={`mt-auto ${showAssessmentPrompt ? 'bg-vermilion hover:bg-vermilion/90' : 'bg-gray-200'}`}
                          onClick={() => navigate('/assessment')}
                          disabled={!showAssessmentPrompt}
                        >
                          {showAssessmentPrompt ? 'Start Assessment' : 'Completed'}
                        </Button>
                      </div>
                      
                      {recommendedNextModule && (
                        <div className="bg-matcha/5 p-6 rounded-lg border border-matcha/10 flex flex-col items-center text-center">
                          <div className="h-12 w-12 bg-matcha/10 rounded-full flex items-center justify-center text-matcha mb-4">2</div>
                          <h3 className="font-semibold mb-2">{recommendedNextModule.title}</h3>
                          <p className="text-sm text-gray-600 mb-4">{recommendedNextModule.description}</p>
                          <Button 
                            className="mt-auto bg-matcha hover:bg-matcha/90"
                            onClick={() => handleModuleNavigation(recommendedNextModule.route)}
                          >
                            Start Learning
                          </Button>
                        </div>
                      )}
                      
                      <div className="bg-indigo/5 p-6 rounded-lg border border-indigo/10 flex flex-col items-center text-center">
                        <div className="h-12 w-12 bg-indigo/10 rounded-full flex items-center justify-center text-indigo mb-4">3</div>
                        <h3 className="font-semibold mb-2">Practice Daily</h3>
                        <p className="text-sm text-gray-600 mb-4">Keep your skills sharp with regular practice</p>
                        <Button 
                          className="mt-auto bg-indigo hover:bg-indigo/90"
                          onClick={() => navigate('/practice')}
                        >
                          Practice Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

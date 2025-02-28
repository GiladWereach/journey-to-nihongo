
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';

interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  full_name: string;
  learning_level: string;
  learning_goal: string;
  daily_goal_minutes: number;
}

interface ProfileSettings {
  preferred_study_time: string;
  notifications_enabled: boolean;
  display_furigana: boolean;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<ProfileSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const getProfile = async () => {
      if (!user) return;
      
      try {
        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        setProfile(profileData);
        
        // Get user settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('profile_settings')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (settingsError) throw settingsError;
        setSettings(settingsData);
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
  
  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 flex justify-center">
        <div className="flex flex-col items-center mt-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center space-x-3 mb-8">
            <JapaneseCharacter character="ようこそ" size="md" color="text-indigo" />
            <h1 className="text-3xl font-bold text-indigo">Welcome Back!</h1>
          </div>
          
          {profile && (
            <div className="w-full max-w-4xl">
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="md:flex">
                  <div className="md:flex-shrink-0 bg-indigo/10 flex items-center justify-center md:w-48 p-8">
                    <div className="h-32 w-32 rounded-full bg-gradient-to-br from-indigo to-vermilion/70 flex items-center justify-center text-white text-4xl font-bold">
                      {profile.full_name?.charAt(0) || profile.username?.charAt(0) || 'U'}
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-indigo font-semibold">Your Profile</div>
                    <h2 className="mt-1 text-xl font-semibold">{profile.full_name || 'Learner'}</h2>
                    <p className="mt-2 text-gray-600">@{profile.username}</p>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Learning Level</p>
                        <p className="font-medium">{profile.learning_level || 'Beginner'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Daily Goal</p>
                        <p className="font-medium">{profile.daily_goal_minutes} minutes</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Learning Goal</p>
                        <p className="font-medium">{profile.learning_goal || 'General'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Preferred Study Time</p>
                        <p className="font-medium">{settings?.preferred_study_time || 'Anytime'}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button className="bg-indigo hover:bg-indigo/90">Edit Profile</Button>
                      <Button 
                        variant="outline" 
                        className="border-red-500 text-red-500 hover:bg-red-50"
                        onClick={signOut}
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-indigo mb-4">Get Started with Your Journey</h2>
                  <p className="text-gray-600 mb-6">
                    Complete your profile and start learning Japanese today. Here are some recommended steps:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-indigo/5 p-6 rounded-lg border border-indigo/10 flex flex-col items-center text-center">
                      <div className="h-12 w-12 bg-indigo/10 rounded-full flex items-center justify-center text-indigo mb-4">1</div>
                      <h3 className="font-semibold mb-2">Take Assessment</h3>
                      <p className="text-sm text-gray-600 mb-4">Find out your current Japanese level</p>
                      <Button className="mt-auto bg-indigo hover:bg-indigo/90">Start Assessment</Button>
                    </div>
                    
                    <div className="bg-indigo/5 p-6 rounded-lg border border-indigo/10 flex flex-col items-center text-center">
                      <div className="h-12 w-12 bg-indigo/10 rounded-full flex items-center justify-center text-indigo mb-4">2</div>
                      <h3 className="font-semibold mb-2">Set Goals</h3>
                      <p className="text-sm text-gray-600 mb-4">Define your learning objectives</p>
                      <Button className="mt-auto bg-indigo hover:bg-indigo/90">Set Your Goals</Button>
                    </div>
                    
                    <div className="bg-indigo/5 p-6 rounded-lg border border-indigo/10 flex flex-col items-center text-center">
                      <div className="h-12 w-12 bg-indigo/10 rounded-full flex items-center justify-center text-indigo mb-4">3</div>
                      <h3 className="font-semibold mb-2">Begin Learning</h3>
                      <p className="text-sm text-gray-600 mb-4">Start with our beginner lessons</p>
                      <Button className="mt-auto bg-vermilion hover:bg-vermilion/90">Start Learning</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

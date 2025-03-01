import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import { ArrowLeft, Save, User } from 'lucide-react';
import { Profile, UserSettings } from '@/types/kana';

interface ProfileFormData {
  username: string;
  display_name: string;
  avatar_url: string;
  learning_level: string;
  learning_goal: string;
  daily_goal_minutes: number;
}

interface SettingsFormData {
  preferred_study_time: string;
  notifications_enabled: boolean;
  display_furigana: boolean;
}

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profileData, setProfileData] = useState<ProfileFormData>({
    username: '',
    display_name: '',
    avatar_url: '',
    learning_level: 'beginner',
    learning_goal: 'general',
    daily_goal_minutes: 15,
  });
  
  const [settingsData, setSettingsData] = useState<SettingsFormData>({
    preferred_study_time: 'anytime',
    notifications_enabled: true,
    display_furigana: true,
  });
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        // Fetch profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        
        // Fetch settings data
        const { data: settings, error: settingsError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (settingsError) throw settingsError;

        console.log('Profile data:', profile);
        console.log('Settings data:', settings);
        
        // Update state with fetched data
        setProfileData({
          username: profile.username || '',
          display_name: profile.display_name || '',
          avatar_url: profile.avatar_url || '',
          learning_level: profile.learning_level || 'beginner',
          learning_goal: profile.learning_goal || 'general',
          daily_goal_minutes: profile.daily_goal_minutes || 15,
        });
        
        setSettingsData({
          preferred_study_time: settings.preferred_study_time || 'anytime',
          notifications_enabled: settings.notifications_enabled !== false,
          display_furigana: settings.display_furigana !== false,
        });
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your profile data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, toast]);
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSettingChange = (name: string, value: any) => {
    setSettingsData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSliderChange = (value: number[]) => {
    setProfileData(prev => ({ ...prev, daily_goal_minutes: value[0] }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: profileData.username,
          display_name: profileData.display_name,
          avatar_url: profileData.avatar_url,
          learning_level: profileData.learning_level,
          learning_goal: profileData.learning_goal,
          daily_goal_minutes: profileData.daily_goal_minutes,
        })
        .eq('id', user.id);
        
      if (profileError) throw profileError;
      
      // Update settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .update({
          preferred_study_time: settingsData.preferred_study_time,
          notifications_enabled: settingsData.notifications_enabled,
          display_furigana: settingsData.display_furigana,
        })
        .eq('id', user.id);
        
      if (settingsError) throw settingsError;
      
      toast({
        title: 'Success',
        description: 'Your profile has been updated.',
      });
      
      // Navigate back to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
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
      <div className="max-w-3xl mx-auto">
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
          <JapaneseCharacter character="プロフィール" size="md" color="text-indigo" />
          <h1 className="text-3xl font-bold text-indigo">Edit Profile</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <User className="mr-2 h-5 w-5 text-indigo" />
                Personal Information
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    name="display_name"
                    value={profileData.display_name}
                    onChange={handleProfileChange}
                    placeholder="Your display name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={profileData.username}
                    onChange={handleProfileChange}
                    placeholder="Your username"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="avatar_url">Profile Picture URL</Label>
                <Input
                  id="avatar_url"
                  name="avatar_url"
                  value={profileData.avatar_url}
                  onChange={handleProfileChange}
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className="text-sm text-gray-500">Enter a URL for your profile picture.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Learning Preferences</h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="learning_level">Learning Level</Label>
                <Select
                  onValueChange={(value) => handleSelectChange('learning_level', value)}
                  defaultValue={profileData.learning_level}
                >
                  <SelectTrigger id="learning_level">
                    <SelectValue placeholder="Select your learning level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner - No prior knowledge</SelectItem>
                    <SelectItem value="elementary">Elementary - Some basic knowledge</SelectItem>
                    <SelectItem value="intermediate">Intermediate - Conversational skills</SelectItem>
                    <SelectItem value="advanced">Advanced - Fluent communication</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="learning_goal">Learning Goal</Label>
                <Select
                  onValueChange={(value) => handleSelectChange('learning_goal', value)}
                  defaultValue={profileData.learning_goal}
                >
                  <SelectTrigger id="learning_goal">
                    <SelectValue placeholder="Select your primary goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Japanese</SelectItem>
                    <SelectItem value="travel">Travel & Basic Conversation</SelectItem>
                    <SelectItem value="business">Business Japanese</SelectItem>
                    <SelectItem value="academic">Academic & JLPT Preparation</SelectItem>
                    <SelectItem value="culture">Cultural Understanding (Anime, Manga, etc.)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="daily_goal">Daily Goal (minutes): {profileData.daily_goal_minutes}</Label>
                <Slider
                  id="daily_goal"
                  min={5}
                  max={120}
                  step={5}
                  defaultValue={[profileData.daily_goal_minutes]}
                  onValueChange={handleSliderChange}
                  className="py-4"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>5 min</span>
                  <span>60 min</span>
                  <span>120 min</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preferred_study_time">Preferred Study Time</Label>
                <Select
                  onValueChange={(value) => handleSettingChange('preferred_study_time', value)}
                  defaultValue={settingsData.preferred_study_time}
                >
                  <SelectTrigger id="preferred_study_time">
                    <SelectValue placeholder="When do you prefer to study?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anytime">Anytime</SelectItem>
                    <SelectItem value="morning">Morning (5AM - 12PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                    <SelectItem value="evening">Evening (5PM - 10PM)</SelectItem>
                    <SelectItem value="night">Late Night (10PM - 5AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">App Settings</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications_enabled">Notifications</Label>
                  <p className="text-sm text-gray-500">Receive reminders and updates</p>
                </div>
                <Switch
                  id="notifications_enabled"
                  checked={settingsData.notifications_enabled}
                  onCheckedChange={(value) => handleSettingChange('notifications_enabled', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="display_furigana">Display Furigana</Label>
                  <p className="text-sm text-gray-500">Show reading aids above kanji</p>
                </div>
                <Switch
                  id="display_furigana"
                  checked={settingsData.display_furigana}
                  onCheckedChange={(value) => handleSettingChange('display_furigana', value)}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo hover:bg-indigo/90" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

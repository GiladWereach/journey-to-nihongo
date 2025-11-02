
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { showStrokeOrderToggled, quizAutoAdvanceToggled, displayFuriganaToggled, profileSettingsUpdated, useAuth, useNavigate, useToast, loadProfile, loadSettings, single, setProfile, setSettings, upsert, ate, toISOString, toast } from '@/lib/analytics-generated';

// Track show_stroke_order_toggled
showStrokeOrderToggled();
// Track quiz_auto_advance_toggled
quizAutoAdvanceToggled();
// Track display_furigana_toggled
displayFuriganaToggled();
// Track profile_settings_updated
profileSettingsUpdated();
const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    display_name: '',
    learning_level: '',
    learning_goal: ''
  });
  const [settings, setSettings] = useState({
    theme: 'light',
    display_furigana: true,
    quiz_auto_advance: true,
    show_stroke_order: false
  });

  useEffect(() => {
    if (user) {
      loadProfile();
      loadSettings();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          display_name: data.display_name || '',
          learning_level: data.learning_level || '',
          learning_goal: data.learning_goal || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading settings:', error);
        return;
      }

      if (data) {
        setSettings({
          theme: data.theme || 'light',
          display_furigana: data.display_furigana ?? true,
          quiz_auto_advance: data.quiz_auto_advance ?? true,
          show_stroke_order: data.show_stroke_order ?? false
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      // Update settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .upsert({
          id: user.id,
          ...settings,
          updated_at: new Date().toISOString()
        });

      if (settingsError) throw settingsError;

      toast({
        title: "Profile Updated",
        description: "Your profile and settings have been saved successfully.",
      });

      navigate('/profile');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button
        variant="ghost"
        onClick={() => navigate('/profile')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Profile
      </Button>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                value={profile.display_name}
                onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                placeholder="Enter your display name"
              />
            </div>

            <div>
              <Label htmlFor="learning_level">Current Level</Label>
              <Select
                value={profile.learning_level}
                onValueChange={(value) => setProfile({ ...profile, learning_level: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your current level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="absolute_beginner">Absolute Beginner</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="learning_goal">Learning Goal</Label>
              <Select
                value={profile.learning_goal}
                onValueChange={(value) => setProfile({ ...profile, learning_goal: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your learning goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual Learning</SelectItem>
                  <SelectItem value="travel">Travel to Japan</SelectItem>
                  <SelectItem value="business">Business/Work</SelectItem>
                  <SelectItem value="academic">Academic Study</SelectItem>
                  <SelectItem value="culture">Cultural Interest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={settings.theme}
                onValueChange={(value) => setSettings({ ...settings, theme: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="display_furigana">Display Furigana</Label>
              <Button
                variant={settings.display_furigana ? "default" : "outline"}
                size="sm"
                onClick={() => setSettings({ ...settings, display_furigana: !settings.display_furigana })}
              >
                {settings.display_furigana ? 'On' : 'Off'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="quiz_auto_advance">Quiz Auto Advance</Label>
              <Button
                variant={settings.quiz_auto_advance ? "default" : "outline"}
                size="sm"
                onClick={() => setSettings({ ...settings, quiz_auto_advance: !settings.quiz_auto_advance })}
              >
                {settings.quiz_auto_advance ? 'On' : 'Off'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show_stroke_order">Show Stroke Order</Label>
              <Button
                variant={settings.show_stroke_order ? "default" : "outline"}
                size="sm"
                onClick={() => setSettings({ ...settings, show_stroke_order: !settings.show_stroke_order })}
              >
                {settings.show_stroke_order ? 'On' : 'Off'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={loading} className="w-full">
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default EditProfile;

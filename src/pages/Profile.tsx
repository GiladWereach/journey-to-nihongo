
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Settings, LogOut } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import TraditionalBackground from '@/components/ui/TraditionalAtmosphere';
import { TraditionalCard } from '@/components/ui/TraditionalAtmosphere';

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <TraditionalBackground>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-glass-wood backdrop-blur-traditional border-b-2 border-wood-light/40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-traditional font-bold text-paper-warm tracking-tight">
                Nihongo Journey
              </span>
            </Link>
            
            <Button variant="outline" size="sm" asChild className="bg-wood-grain border-wood-light/40 text-wood-light hover:bg-wood-light hover:text-gion-night font-traditional">
              <Link to="/quiz">Quiz</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 pb-6">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="mb-4 text-wood-light hover:text-lantern-warm font-traditional">
              <Link to="/" className="flex items-center gap-1">
                <ArrowLeft size={16} />
                Back to Home
              </Link>
            </Button>
            
            <h1 className="text-2xl font-traditional font-bold text-paper-warm tracking-wide">Profile</h1>
          </div>

          <div className="space-y-6">
            <TraditionalCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-wood-light font-traditional">
                  <User size={20} />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-wood-light/60 font-traditional">Email</label>
                  <p className="text-lg text-wood-light font-traditional">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-wood-light/60 font-traditional">Member Since</label>
                  <p className="text-lg text-wood-light font-traditional">
                    {new Date(user.created_at || '').toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </TraditionalCard>

            <TraditionalCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-wood-light font-traditional">
                  <Settings size={20} />
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-wood-grain border-wood-light/40 text-wood-light hover:bg-wood-light hover:text-gion-night font-traditional"
                  asChild
                >
                  <Link to="/legacy/dashboard">
                    Access Legacy Features
                  </Link>
                </Button>
                
                <Button 
                  onClick={handleSignOut}
                  className="w-full justify-start bg-lantern-amber text-gion-night hover:bg-lantern-warm font-traditional border-2 border-wood-light/40"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </TraditionalCard>
          </div>
        </div>
      </div>
    </TraditionalBackground>
  );
};

export default Profile;

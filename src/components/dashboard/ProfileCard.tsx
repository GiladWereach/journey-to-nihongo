
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { Profile } from '@/types/kana';

interface ProfileCardProps {
  profile: Profile | null;
  signOut: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, signOut }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 flex flex-col items-center text-center">
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo to-vermilion/70 flex items-center justify-center text-white text-2xl font-bold mb-4">
          {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
        </div>
        <h2 className="text-xl font-semibold">{profile?.full_name || 'Learner'}</h2>
        <p className="text-gray-600 mb-4">@{profile?.username}</p>
        
        <div className="grid grid-cols-2 gap-2 w-full mb-4">
          <div className="bg-softgray/50 p-2 rounded">
            <p className="text-xs text-gray-500">Level</p>
            <p className="font-medium">{profile?.learning_level || 'Beginner'}</p>
          </div>
          <div className="bg-softgray/50 p-2 rounded">
            <p className="text-xs text-gray-500">Goal</p>
            <p className="font-medium">{profile?.daily_goal_minutes} min/day</p>
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
  );
};

export default ProfileCard;

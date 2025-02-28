
import React from 'react';
import { User } from '@supabase/supabase-js';
import { NavigateFunction } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface AuthButtonsProps {
  user: User | null;
  className?: string;
  navigate: NavigateFunction;
  onActionComplete?: () => void;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ 
  user, 
  className, 
  navigate, 
  onActionComplete 
}) => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    if (onActionComplete) onActionComplete();
  };

  return (
    <div className={cn("items-center space-x-4", className)}>
      {user ? (
        <Button 
          variant="outline" 
          className="border-indigo dark:border-white text-indigo dark:text-white hover:bg-indigo hover:text-white dark:hover:bg-white/20"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      ) : (
        <>
          <Button 
            variant="outline" 
            className="border-indigo dark:border-white text-indigo dark:text-white hover:bg-indigo hover:text-white dark:hover:bg-white/20"
            onClick={() => {
              navigate('/auth');
              if (onActionComplete) onActionComplete();
            }}
          >
            Log In
          </Button>
          <Button 
            className="bg-vermilion hover:bg-vermilion/90 text-white"
            onClick={() => {
              navigate('/auth', { state: { tab: 'register' } });
              if (onActionComplete) onActionComplete();
            }}
          >
            Sign Up
          </Button>
        </>
      )}
    </div>
  );
};

export default AuthButtons;

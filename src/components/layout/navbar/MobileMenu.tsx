
import React from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import AuthButtons from './AuthButtons';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: User | null;
  navigate: (path: string) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, setIsOpen, user, navigate }) => {
  const { signOut } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-indigo border-t shadow-lg z-40">
      <div className="container mx-auto px-4 py-4 space-y-4">
        {user ? (
          <>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-600 dark:text-gray-300"
              onClick={() => handleNavigation('/dashboard')}
            >
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-600 dark:text-gray-300"
              onClick={() => handleNavigation('/kana-learning')}
            >
              Kana Learning
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-600 dark:text-gray-300"
              onClick={() => handleNavigation('/quiz')}
            >
              Quiz Practice
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-600 dark:text-gray-300"
              onClick={() => handleNavigation('/progress')}
            >
              Progress
            </Button>
            <div className="border-t pt-4">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-600 dark:text-gray-300"
                onClick={() => handleNavigation('/profile')}
              >
                Profile
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-600"
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
              >
                Sign Out
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <Button 
              className="w-full"
              onClick={() => handleNavigation('/auth')}
            >
              Sign In
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;

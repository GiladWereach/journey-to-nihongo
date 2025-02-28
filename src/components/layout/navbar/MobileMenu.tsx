
import React from 'react';
import { User } from '@supabase/supabase-js';
import { NavigateFunction } from 'react-router-dom';
import { cn } from '@/lib/utils';
import NavLinks from './NavLinks';
import AuthButtons from './AuthButtons';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: User | null;
  navigate: NavigateFunction;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  setIsOpen, 
  user, 
  navigate 
}) => {
  const closeMenu = () => setIsOpen(false);

  return (
    <div
      className={cn(
        'md:hidden fixed left-0 right-0 bg-white shadow-lg transition-all duration-300 ease-in-out overflow-hidden',
        isOpen ? 'max-h-[500px] py-4' : 'max-h-0 py-0',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 space-y-4">
        <NavLinks 
          user={user} 
          className="flex flex-col space-y-4 space-x-0" 
          onClick={closeMenu} 
        />
        
        <div className="pt-4 pb-2 flex flex-col space-y-3">
          <AuthButtons 
            user={user} 
            className="w-full flex flex-col space-y-3 space-x-0" 
            navigate={navigate} 
            onActionComplete={closeMenu} 
          />
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;

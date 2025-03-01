
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface NavLinksProps {
  user: User | null;
  className?: string;
  onClick?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ user, className, onClick }) => {
  const [showLearningDropdown, setShowLearningDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const closeDropdowns = () => {
      setShowLearningDropdown(false);
    };
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLearningDropdown(false);
      }
    };
    
    document.addEventListener('closeDropdowns', closeDropdowns);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('closeDropdowns', closeDropdowns);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLearningClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      toast({
        title: "Login Required",
        description: "Please log in to access learning materials.",
        variant: "default",
      });
      navigate('/auth');
      if (onClick) onClick();
      return;
    }
    
    e.stopPropagation();
    setShowLearningDropdown(!showLearningDropdown);
  };

  const handleProtectedNavigation = (e: React.MouseEvent, path: string) => {
    if (!user) {
      e.preventDefault();
      toast({
        title: "Login Required",
        description: "Please log in to access this content.",
        variant: "default",
      });
      navigate('/auth');
      if (onClick) onClick();
      return;
    }
    
    navigate(path);
    setShowLearningDropdown(false);
    if (onClick) onClick();
  };
  
  return (
    <nav className={cn("items-center space-x-8", className)}>
      <div className="relative inline-block" ref={dropdownRef}>
        <button
          className="text-gray-600 dark:text-gray-300 hover:text-indigo dark:hover:text-white transition-colors duration-200 flex items-center"
          onClick={handleLearningClick}
          aria-expanded={showLearningDropdown}
          aria-haspopup="true"
        >
          Learning
          <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform", 
            showLearningDropdown && "transform rotate-180")} />
        </button>
        
        {showLearningDropdown && user && (
          <div 
            className="absolute left-0 mt-2 w-52 rounded-md shadow-lg bg-white dark:bg-indigo ring-1 ring-black ring-opacity-5 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-1" role="menu" aria-orientation="vertical">
              <Link
                to="/kana-learning"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-indigo/80"
                onClick={() => {
                  setShowLearningDropdown(false);
                  onClick && onClick();
                }}
                role="menuitem"
              >
                Kana Mastery
              </Link>
              <Link
                to="/kanji-basics"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-indigo/80"
                onClick={() => {
                  setShowLearningDropdown(false);
                  onClick && onClick();
                }}
                role="menuitem"
              >
                Kanji Basics
              </Link>
              <Link
                to="/grammar-essentials"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-indigo/80"
                onClick={() => {
                  setShowLearningDropdown(false);
                  onClick && onClick();
                }}
                role="menuitem"
              >
                Grammar Essentials
              </Link>
              <Link
                to="/conversation-practice"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-indigo/80"
                onClick={() => {
                  setShowLearningDropdown(false);
                  onClick && onClick();
                }}
                role="menuitem"
              >
                Conversation Practice
              </Link>
            </div>
          </div>
        )}
      </div>
      
      <Link
        to={user ? "/courses" : "/auth"}
        className="text-gray-600 dark:text-gray-300 hover:text-indigo dark:hover:text-white transition-colors duration-200"
        onClick={(e) => {
          if (!user) {
            e.preventDefault();
            toast({
              title: "Login Required",
              description: "Please log in to access courses.",
              variant: "default",
            });
            navigate('/auth');
          }
          onClick && onClick();
        }}
      >
        Courses
      </Link>
      <Link
        to={user ? "/resources" : "/auth"}
        className="text-gray-600 dark:text-gray-300 hover:text-indigo dark:hover:text-white transition-colors duration-200"
        onClick={(e) => {
          if (!user) {
            e.preventDefault();
            toast({
              title: "Login Required",
              description: "Please log in to access resources.",
              variant: "default",
            });
            navigate('/auth');
          }
          onClick && onClick();
        }}
      >
        Resources
      </Link>
      <Link
        to="/about"
        className="text-gray-600 dark:text-gray-300 hover:text-indigo dark:hover:text-white transition-colors duration-200"
        onClick={onClick}
      >
        About
      </Link>
      <Link
        to="/contact"
        className="text-gray-600 dark:text-gray-300 hover:text-indigo dark:hover:text-white transition-colors duration-200"
        onClick={onClick}
      >
        Contact
      </Link>
      {user && (
        <Link
          to="/dashboard"
          className="text-indigo dark:text-vermilion font-medium hover:text-vermilion dark:hover:text-vermilion/80 transition-colors duration-200"
          onClick={onClick}
        >
          Dashboard
        </Link>
      )}
    </nav>
  );
};

export default NavLinks;

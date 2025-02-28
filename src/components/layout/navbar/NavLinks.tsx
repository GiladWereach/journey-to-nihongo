import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface NavLinksProps {
  user: User | null;
  className?: string;
  onClick?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ user, className, onClick }) => {
  const [showLearningDropdown, setShowLearningDropdown] = useState(false);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const closeDropdowns = () => {
      setShowLearningDropdown(false);
    };
    
    document.addEventListener('closeDropdowns', closeDropdowns);
    
    return () => {
      document.removeEventListener('closeDropdowns', closeDropdowns);
    };
  }, []);
  
  return (
    <nav className={cn("items-center space-x-8", className)}>
      <div className="relative inline-block">
        <button
          className="text-gray-600 dark:text-gray-300 hover:text-indigo dark:hover:text-white transition-colors duration-200 flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            setShowLearningDropdown(!showLearningDropdown);
          }}
        >
          Learning
          <ChevronDown className="ml-1 h-4 w-4" />
        </button>
        
        {showLearningDropdown && (
          <div 
            className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-indigo/95 ring-1 ring-black ring-opacity-5 z-50"
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
              >
                Conversation Practice
              </Link>
            </div>
          </div>
        )}
      </div>
      
      <Link
        to="/courses"
        className="text-gray-600 dark:text-gray-300 hover:text-indigo dark:hover:text-white transition-colors duration-200"
        onClick={onClick}
      >
        Courses
      </Link>
      <Link
        to="/resources"
        className="text-gray-600 dark:text-gray-300 hover:text-indigo dark:hover:text-white transition-colors duration-200"
        onClick={onClick}
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

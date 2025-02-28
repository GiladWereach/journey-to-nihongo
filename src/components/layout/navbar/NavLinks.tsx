
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';

interface NavLinksProps {
  user: User | null;
  className?: string;
  onClick?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ user, className, onClick }) => {
  return (
    <nav className={cn("items-center space-x-8", className)}>
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

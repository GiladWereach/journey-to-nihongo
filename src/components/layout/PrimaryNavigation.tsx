
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, BookOpen, Dumbbell, BarChart2, Users } from 'lucide-react';

interface NavigationItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ 
  to, 
  icon: Icon, 
  label, 
  active, 
  onClick 
}) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
        active 
          ? "bg-indigo text-white" 
          : "text-gray-600 dark:text-gray-300 hover:bg-indigo/10 dark:hover:bg-indigo/20"
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
};

interface PrimaryNavigationProps {
  className?: string;
  onItemClick?: () => void;
}

const PrimaryNavigation: React.FC<PrimaryNavigationProps> = ({ 
  className,
  onItemClick
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Define the primary navigation items
  const navigationItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/learn', icon: BookOpen, label: 'Learn' },
    { to: '/practice', icon: Dumbbell, label: 'Practice' },
    { to: '/progress', icon: BarChart2, label: 'Progress' },
    // Future expansion: { to: '/community', icon: Users, label: 'Community' }
  ];
  
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return currentPath === '/dashboard';
    }
    return currentPath.startsWith(path);
  };
  
  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      {navigationItems.map((item) => (
        <NavigationItem
          key={item.to}
          to={item.to}
          icon={item.icon}
          label={item.label}
          active={isActive(item.to)}
          onClick={onItemClick}
        />
      ))}
    </nav>
  );
};

export default PrimaryNavigation;

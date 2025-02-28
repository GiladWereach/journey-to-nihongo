
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { cn } from '@/lib/utils';

interface DarkModeToggleProps {
  className?: string;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ className }) => {
  const { theme, toggleTheme } = useDarkMode();
  const isDark = theme === 'dark';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Sun size={16} className={cn('text-yellow-500', isDark && 'opacity-50')} />
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-indigo"
        aria-label="Toggle dark mode"
      />
      <Moon size={16} className={cn('text-indigo', !isDark && 'opacity-50')} />
    </div>
  );
};

export default DarkModeToggle;

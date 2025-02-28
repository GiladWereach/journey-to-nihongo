
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
      <Sun size={20} className={cn('text-yellow-500', isDark && 'opacity-40')} />
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        className={cn(
          "data-[state=checked]:bg-indigo dark:data-[state=checked]:bg-vermilion",
          "data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-700"
        )}
        aria-label="Toggle dark mode"
      />
      <Moon size={20} className={cn('text-indigo dark:text-vermilion', !isDark && 'opacity-40')} />
    </div>
  );
};

export default DarkModeToggle;

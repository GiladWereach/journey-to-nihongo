
import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import { kanaService } from '@/services/kanaService';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  label?: string;
  fullPage?: boolean;
  educational?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'text-indigo',
  className,
  label,
  fullPage = false,
  educational = false,
}) => {
  const [randomKana, setRandomKana] = useState<any>(null);
  const [counter, setCounter] = useState(0);
  
  // Size mappings
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  const spinnerSize = sizeMap[size];
  
  // Change kana every 3 seconds if educational mode is enabled
  useEffect(() => {
    if (!educational) return;
    
    const fetchRandomKana = () => {
      const allKana = kanaService.getAllKana();
      const randomIndex = Math.floor(Math.random() * allKana.length);
      setRandomKana(allKana[randomIndex]);
    };
    
    // Initially fetch a random kana
    fetchRandomKana();
    
    // Set up interval to change kana every 3 seconds
    const intervalId = setInterval(() => {
      fetchRandomKana();
      setCounter(prev => prev + 1);
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, [educational]);
  
  // If fullPage is true, center in viewport with educational content if enabled
  if (fullPage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader className={cn(spinnerSize, color, 'animate-spin', className)} />
        {label && <p className="mt-4 text-gray-600">{label}</p>}
        
        {educational && randomKana && (
          <div className="mt-8 mb-6 flex flex-col items-center max-w-sm text-center">
            <div className="mb-4">
              <JapaneseCharacter 
                character={randomKana.character} 
                size="lg" 
                animated={true}
              />
            </div>
            <p className="text-xl font-medium mt-2">{randomKana.romaji}</p>
            {randomKana.examples && randomKana.examples.length > 0 && (
              <div className="mt-3 text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                <p><span className="font-medium">Example:</span> {randomKana.examples[0].word}</p>
                <p><span className="font-medium">Meaning:</span> {randomKana.examples[0].meaning}</p>
                <p><span className="font-medium">Romaji:</span> {randomKana.examples[0].romaji}</p>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-4">Learn while you wait...</p>
          </div>
        )}
      </div>
    );
  }
  
  // Regular inline spinner (no educational content for inline spinners)
  return (
    <div className="flex flex-col items-center">
      <Loader className={cn(spinnerSize, color, 'animate-spin', className)} />
      {label && <p className="mt-2 text-sm text-gray-600">{label}</p>}
    </div>
  );
};

export default LoadingSpinner;

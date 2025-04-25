
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { KanaType } from '@/types/kana';

interface PracticeSelectionTabProps {
  onPracticeStart: (type: 'hiragana' | 'katakana' | 'all', mode: 'recognition' | 'matching') => void;
  onQuickQuizStart: (type: KanaType) => void;
}

const PracticeSelectionTab: React.FC<PracticeSelectionTabProps> = ({
  onPracticeStart,
  onQuickQuizStart
}) => {
  return (
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-semibold text-indigo">Practice Your Kana</h2>
      
      <div className="mb-8 mt-6">
        <h3 className="text-lg font-medium mb-3 text-indigo">Recognition Practice</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-4">
          <Button 
            onClick={() => onPracticeStart('hiragana', 'recognition')}
            className="h-auto py-5 bg-matcha hover:bg-matcha/90"
          >
            <div className="flex flex-col items-center">
              <span className="text-lg font-medium mb-2">Hiragana</span>
              <span className="text-3xl mb-3 japanese-text">あいう</span>
            </div>
          </Button>
          
          <Button 
            onClick={() => onPracticeStart('katakana', 'recognition')}
            className="h-auto py-5 bg-vermilion hover:bg-vermilion/90"
          >
            <div className="flex flex-col items-center">
              <span className="text-lg font-medium mb-2">Katakana</span>
              <span className="text-3xl mb-3 japanese-text">アイウ</span>
            </div>
          </Button>
          
          <Button 
            onClick={() => onPracticeStart('all', 'recognition')}
            className="h-auto py-5 bg-indigo hover:bg-indigo/90"
          >
            <div className="flex flex-col items-center">
              <span className="text-lg font-medium mb-2">Mixed</span>
              <span className="text-3xl mb-3 japanese-text">あア</span>
            </div>
          </Button>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3 text-indigo">Matching Practice</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-4">
          <Button 
            onClick={() => onPracticeStart('hiragana', 'matching')}
            className="h-auto py-5 bg-matcha hover:bg-matcha/90"
          >
            <div className="flex flex-col items-center">
              <span className="text-lg font-medium mb-2">Hiragana</span>
              <span className="text-3xl mb-3">あ=a</span>
            </div>
          </Button>
          
          <Button 
            onClick={() => onPracticeStart('katakana', 'matching')}
            className="h-auto py-5 bg-vermilion hover:bg-vermilion/90"
          >
            <div className="flex flex-col items-center">
              <span className="text-lg font-medium mb-2">Katakana</span>
              <span className="text-3xl mb-3">ア=a</span>
            </div>
          </Button>
          
          <Button 
            onClick={() => onPracticeStart('all', 'matching')}
            className="h-auto py-5 bg-indigo hover:bg-indigo/90"
          >
            <div className="flex flex-col items-center">
              <span className="text-lg font-medium mb-2">Mixed</span>
              <span className="text-3xl mb-3">あア=a</span>
            </div>
          </Button>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3 text-indigo">Quick Quiz</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-4">
          <Button 
            onClick={() => onQuickQuizStart('hiragana')}
            className="h-auto py-5 bg-matcha hover:bg-matcha/90 flex flex-col items-center space-y-2"
          >
            <div className="flex items-center gap-2">
              <Zap size={18} />
              <span className="text-lg font-medium">Hiragana Quiz</span>
            </div>
            <span className="text-sm opacity-80">Test your hiragana knowledge</span>
          </Button>
          
          <Button 
            onClick={() => onQuickQuizStart('katakana')}
            className="h-auto py-5 bg-vermilion hover:bg-vermilion/90 flex flex-col items-center space-y-2"
          >
            <div className="flex items-center gap-2">
              <Zap size={18} />
              <span className="text-lg font-medium">Katakana Quiz</span>
            </div>
            <span className="text-sm opacity-80">Test your katakana knowledge</span>
          </Button>
          
          <Button 
            onClick={() => onQuickQuizStart('all' as KanaType)}
            className="h-auto py-5 bg-indigo hover:bg-indigo/90 flex flex-col items-center space-y-2"
          >
            <div className="flex items-center gap-2">
              <Zap size={18} />
              <span className="text-lg font-medium">Mixed Quiz</span>
            </div>
            <span className="text-sm opacity-80">Challenge with both writing systems</span>
          </Button>
        </div>
      </div>
      
      <div className="mt-8 pt-4 border-t border-gray-100">
        <h3 className="text-lg font-medium mb-3 text-muted-foreground">Coming Soon</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto opacity-60">
          <Button 
            disabled
            className="h-auto py-4"
          >
            <div className="flex flex-col items-center">
              <span className="text-lg font-medium">Writing Practice</span>
            </div>
          </Button>
          
          <Button 
            disabled
            className="h-auto py-4"
          >
            <div className="flex flex-col items-center">
              <span className="text-lg font-medium">Word Formation</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PracticeSelectionTab;

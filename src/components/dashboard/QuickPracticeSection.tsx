
import React from 'react';
import { CirclePlay, Book } from 'lucide-react';
import { StarHalf } from 'lucide-react';

interface QuickPracticeSectionProps {
  onNavigate: (path: string, isReady: boolean) => void;
}

const QuickPracticeSection: React.FC<QuickPracticeSectionProps> = ({ onNavigate }) => {
  return (
    <div className="w-full max-w-4xl mb-8">
      <h2 className="text-xl font-semibold text-indigo mb-4 flex items-center">
        <StarHalf className="mr-2 h-5 w-5" />
        Quick Practice
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onNavigate('/quick-quiz', true)}
        >
          <h3 className="font-semibold mb-2 flex items-center">
            <CirclePlay className="mr-2 h-4 w-4 text-vermilion" />
            Kana Quiz
          </h3>
          <p className="text-sm text-gray-600">Test your knowledge with a quick kana recognition quiz.</p>
        </div>
        
        <div 
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onNavigate('/kana-learning', true)}
        >
          <h3 className="font-semibold mb-2 flex items-center">
            <Book className="mr-2 h-4 w-4 text-matcha" />
            Hiragana Review
          </h3>
          <p className="text-sm text-gray-600">Review hiragana characters you've already learned.</p>
        </div>
        
        <div 
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onNavigate('/kana-learning?type=katakana', true)}
        >
          <h3 className="font-semibold mb-2 flex items-center">
            <Book className="mr-2 h-4 w-4 text-indigo" />
            Katakana Review
          </h3>
          <p className="text-sm text-gray-600">Review katakana characters you've already learned.</p>
        </div>
      </div>
    </div>
  );
};

export default QuickPracticeSection;


import React from 'react';
import { Button } from '@/components/ui/button';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import { cn } from '@/lib/utils';

interface IntroTabProps {
  user: any;
  setActiveTab: (tab: string) => void;
  renderProgressIndicator: (type: 'hiragana' | 'katakana' | 'all') => React.ReactNode;
}

const IntroTab: React.FC<IntroTabProps> = ({
  user,
  setActiveTab,
  renderProgressIndicator
}) => {
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm border animate-fade-in">
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-4">
          <JapaneseCharacter character="あ" size="lg" color="text-matcha" animated />
          <JapaneseCharacter character="ア" size="lg" color="text-vermilion" animated />
        </div>
      </div>
      
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-indigo">
        Japanese Writing Systems
      </h1>
      
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h2 className="font-semibold text-xl mb-2 text-indigo">The Three Writing Systems</h2>
          <p className="mb-4">
            Japanese uses three writing systems: <strong>Hiragana</strong>, <strong>Katakana</strong>, and <strong>Kanji</strong>. 
            We'll start with learning Hiragana and Katakana, which are the phonetic alphabets.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-softgray/30 p-5 rounded-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <JapaneseCharacter character="あ" size="md" color="text-matcha" />
              <h3 className="text-lg font-medium text-matcha">Hiragana</h3>
            </div>
            <p className="text-sm mb-3">Used for native Japanese words and grammatical elements.</p>
            <p className="text-sm text-gray-600 mb-3">Example: <span className="japanese-text">あいうえお</span> (a-i-u-e-o)</p>
            
            {user && renderProgressIndicator('hiragana')}
          </div>
          
          <div className="bg-softgray/30 p-5 rounded-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <JapaneseCharacter character="ア" size="md" color="text-vermilion" />
              <h3 className="text-lg font-medium text-vermilion">Katakana</h3>
            </div>
            <p className="text-sm mb-3">Used for foreign words, emphasis, and technical terms.</p>
            <p className="text-sm text-gray-600 mb-3">Example: <span className="japanese-text">アイウエオ</span> (a-i-u-e-o)</p>
            
            {user && renderProgressIndicator('katakana')}
          </div>
        </div>
        
        <div className="text-center mt-8 pt-4 border-t border-gray-100">
          <p className="mb-4 text-sm text-gray-600">Ready to start learning? Navigate to the Learn tab to explore kana characters or jump straight to practice.</p>
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => setActiveTab('learn')}
              className="bg-indigo hover:bg-indigo/90"
            >
              Start Learning
            </Button>
            <Button 
              variant="outline"
              onClick={() => setActiveTab('practice')}
              className="text-indigo hover:bg-indigo/10 border-indigo/30"
            >
              Go to Practice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroTab;

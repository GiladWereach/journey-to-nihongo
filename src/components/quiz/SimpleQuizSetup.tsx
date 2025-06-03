
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TraditionalCard } from '@/components/ui/TraditionalAtmosphere';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import { KanaType } from '@/types/kana';

interface SimpleQuizSetupProps {
  onStartQuiz: (kanaType: KanaType) => void;
}

const SimpleQuizSetup: React.FC<SimpleQuizSetupProps> = ({ onStartQuiz }) => {
  const [selectedType, setSelectedType] = useState<KanaType>('hiragana');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <TraditionalCard className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-traditional font-bold text-paper-warm mb-2 tracking-wide">
            Choose Character Type
          </h2>
          <p className="text-wood-light/80 font-traditional">
            Select which Japanese writing system to practice
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedType('hiragana')}
              className={`p-6 border-2 transition-all duration-300 bg-glass-wood backdrop-blur-traditional ${
                selectedType === 'hiragana'
                  ? 'border-matcha shadow-wood bg-matcha/10'
                  : 'border-wood-light/40 hover:border-matcha/60 hover:shadow-traditional'
              }`}
            >
              <div className="text-center space-y-3">
                <JapaneseCharacter character="あ" size="lg" color="text-matcha" />
                <h3 className="text-lg font-semibold text-paper-warm font-traditional">Hiragana</h3>
                <p className="text-sm text-wood-light/80 font-traditional">
                  Curved, flowing characters for native Japanese words
                </p>
              </div>
            </button>

            <button
              onClick={() => setSelectedType('katakana')}
              className={`p-6 border-2 transition-all duration-300 bg-glass-wood backdrop-blur-traditional ${
                selectedType === 'katakana'
                  ? 'border-vermilion shadow-wood bg-vermilion/10'
                  : 'border-wood-light/40 hover:border-vermilion/60 hover:shadow-traditional'
              }`}
            >
              <div className="text-center space-y-3">
                <JapaneseCharacter character="ア" size="lg" color="text-vermilion" />
                <h3 className="text-lg font-semibold text-paper-warm font-traditional">Katakana</h3>
                <p className="text-sm text-wood-light/80 font-traditional">
                  Angular characters for foreign words and emphasis
                </p>
              </div>
            </button>
          </div>

          <div className="text-center pt-4">
            <Button 
              onClick={() => onStartQuiz(selectedType)}
              className="bg-wood-grain border-wood-light/40 text-wood-light hover:bg-wood-light hover:text-gion-night px-8 py-3 text-lg font-traditional tracking-wide transition-all duration-300"
            >
              Start {selectedType === 'hiragana' ? 'Hiragana' : 'Katakana'} Quiz
            </Button>
          </div>
        </div>
      </TraditionalCard>

      <TraditionalCard className="p-6 bg-glass-wood/80">
        <div className="text-center space-y-3">
          <h4 className="font-semibold text-lantern-amber font-traditional">How it works</h4>
          <p className="text-sm text-wood-light/80 font-traditional leading-relaxed">
            You'll see a Japanese character and need to type its romaji (English pronunciation). 
            The quiz continues endlessly, helping you build muscle memory and recognition speed with our adaptive learning system.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-matcha"></div>
              <span className="text-wood-light/70 font-traditional">Hiragana - Matcha Green</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-vermilion"></div>
              <span className="text-wood-light/70 font-traditional">Katakana - Vermilion Red</span>
            </div>
          </div>
        </div>
      </TraditionalCard>
    </div>
  );
};

export default SimpleQuizSetup;

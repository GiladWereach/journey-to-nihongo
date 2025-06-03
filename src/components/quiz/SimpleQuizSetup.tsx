
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import { KanaType } from '@/types/kana';

interface SimpleQuizSetupProps {
  onStartQuiz: (kanaType: KanaType) => void;
}

const SimpleQuizSetup: React.FC<SimpleQuizSetupProps> = ({ onStartQuiz }) => {
  const [selectedType, setSelectedType] = useState<KanaType>('hiragana');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Choose Character Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedType('hiragana')}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedType === 'hiragana'
                  ? 'border-matcha bg-matcha/10'
                  : 'border-gray-200 hover:border-matcha/50'
              }`}
            >
              <div className="text-center space-y-3">
                <JapaneseCharacter character="あ" size="lg" color="text-matcha" />
                <h3 className="text-lg font-semibold">Hiragana</h3>
                <p className="text-sm text-gray-600">
                  Curved, flowing characters for native Japanese words
                </p>
              </div>
            </button>

            <button
              onClick={() => setSelectedType('katakana')}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedType === 'katakana'
                  ? 'border-vermilion bg-vermilion/10'
                  : 'border-gray-200 hover:border-vermilion/50'
              }`}
            >
              <div className="text-center space-y-3">
                <JapaneseCharacter character="ア" size="lg" color="text-vermilion" />
                <h3 className="text-lg font-semibold">Katakana</h3>
                <p className="text-sm text-gray-600">
                  Angular characters for foreign words and emphasis
                </p>
              </div>
            </button>
          </div>

          <div className="text-center pt-4">
            <Button 
              onClick={() => onStartQuiz(selectedType)}
              className="bg-indigo hover:bg-indigo/90 text-white px-8 py-3 text-lg"
            >
              Start {selectedType === 'hiragana' ? 'Hiragana' : 'Katakana'} Quiz
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h4 className="font-semibold">How it works</h4>
            <p className="text-sm text-gray-600">
              You'll see a Japanese character and need to type its romaji (English pronunciation). 
              The quiz continues endlessly, helping you build muscle memory and recognition speed.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleQuizSetup;

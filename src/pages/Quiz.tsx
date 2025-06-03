
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SimpleQuizSetup from '@/components/quiz/SimpleQuizSetup';
import SimpleQuizInterface from '@/components/quiz/SimpleQuizInterface';
import { KanaType } from '@/types/kana';

const Quiz: React.FC = () => {
  const { user } = useAuth();
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [selectedKanaType, setSelectedKanaType] = useState<KanaType>('hiragana');

  const handleStartQuiz = (kanaType: KanaType) => {
    setSelectedKanaType(kanaType);
    setIsQuizActive(true);
  };

  const handleEndQuiz = () => {
    setIsQuizActive(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-softgray">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-montserrat font-bold text-indigo tracking-tight">
                Nihongo Journey
              </span>
            </Link>
            
            <div className="flex items-center gap-4">
              {user ? (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/profile">Profile</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 pb-6">
        <div className="container mx-auto px-4 max-w-4xl">
          {!isQuizActive ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/" className="flex items-center gap-1">
                    <ArrowLeft size={16} />
                    Back to Home
                  </Link>
                </Button>
              </div>
              
              <div className="text-center py-8">
                <h1 className="text-3xl font-bold text-indigo mb-4">
                  Master Japanese Characters
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Practice Hiragana and Katakana with our endless quiz system
                </p>
              </div>
              
              <SimpleQuizSetup onStartQuiz={handleStartQuiz} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleEndQuiz}
                  className="flex items-center gap-1"
                >
                  <ArrowLeft size={16} />
                  Back to Setup
                </Button>
                <h2 className="text-xl font-bold text-indigo">
                  {selectedKanaType === 'hiragana' ? 'Hiragana' : 'Katakana'} Quiz
                </h2>
                <div className="w-20"></div>
              </div>
              
              <SimpleQuizInterface 
                kanaType={selectedKanaType}
                onEndQuiz={handleEndQuiz}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;

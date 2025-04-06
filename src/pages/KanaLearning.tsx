import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Book, ArrowLeft, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { kanaService } from '@/services/kanaService';
import { KanaType, KanaCharacter, PracticeResult, KanaPracticeResult } from '@/types/kana';
import CharacterGrid from '@/components/kana/CharacterGrid';
import PracticeInterface from '@/components/practice/PracticeInterface';
import PracticeResults from '@/components/practice/PracticeResults';
import { useToast } from '@/hooks/use-toast';

const KanaLearning: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [kanaType, setKanaType] = useState<KanaType>('hiragana');
  const [kanaList, setKanaList] = useState<KanaCharacter[]>([]);
  const [practiceType, setPracticeType] = useState<'recognition' | 'matching'>('recognition');
  const [showPractice, setShowPractice] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [practiceResults, setPracticeResults] = useState<PracticeResult | null>(null);
  const [currentKanaType, setCurrentKanaType] = useState<KanaType>('hiragana');
  const [practiceCharSize, setPracticeCharSize] = useState<number>(50);
  const [practiceCharCount, setPracticeCharCount] = useState<number>(10);
  const [userProficiency, setUserProficiency] = useState<number>(0);

  useEffect(() => {
    const loadKana = async () => {
      setKanaList(kanaService.getKanaByType(kanaType));
      setCurrentKanaType(kanaType);
    };

    loadKana();
  }, [kanaType]);

  useEffect(() => {
    const loadUserProficiency = async () => {
      if (user) {
        const proficiency = await kanaService.calculateOverallProficiency(user.id, kanaType);
        setUserProficiency(proficiency);
      }
    };

    loadUserProficiency();
  }, [user, kanaType]);

  const handleKanaTypeChange = (type: KanaType) => {
    setKanaType(type);
    setCurrentKanaType(type);
    setShowResults(false);
  };

  const handlePracticeStart = () => {
    setShowPractice(true);
    setShowResults(false);
  };

  const handlePracticeCancel = () => {
    setShowPractice(false);
  };

  const handlePracticeComplete = (results: PracticeResult) => {
    if (!user) return;
    
    const practiceResults: KanaPracticeResult[] = results.characterResults.map(result => ({
      user_id: user.id,
      characterId: result.character,
      correct: result.correct,
      date: new Date(),
      kana_type: currentKanaType,
      correct_count: results.correct,
      incorrect_count: results.incorrect,
      total_questions: results.total,
      accuracy: results.accuracy,
      duration_seconds: 0
    }));
    
    kanaService.updateProgressFromResults(user.id, practiceResults);
    
    setShowResults(true);
    setPracticeResults(results);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-montserrat font-bold text-indigo tracking-tight">
                Nihongo Journey
              </span>
            </Link>
            
            <div className="flex items-center space-x-2 overflow-x-auto hide-scrollbar">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 bg-indigo/10 text-indigo font-medium"
                asChild
              >
                <Link to="/kana-learning">
                  Kana
                </Link>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                asChild
              >
                <Link to="/quick-quiz">
                  Quick Quiz
                </Link>
              </Button>
            </div>

            {user ? (
              <Link to="/dashboard">
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      <div className="pt-16 pb-6">
        <Tabs defaultValue="hiragana" className="max-w-5xl mx-auto">
          <TabsList className="mb-6 sticky top-16 z-40 bg-background/95 backdrop-blur-sm shadow-sm p-1 rounded-lg max-w-md mx-auto">
            <TabsTrigger value="hiragana" onClick={() => handleKanaTypeChange('hiragana')}>Hiragana</TabsTrigger>
            <TabsTrigger value="katakana" onClick={() => handleKanaTypeChange('katakana')}>Katakana</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hiragana" className="space-y-6 animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <ArrowLeft size={16} />
                    Back
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold text-center text-indigo">Hiragana</h1>
                <div className="opacity-0">
                  <Button variant="ghost" size="sm">
                    <Settings size={16} />
                  </Button>
                </div>
              </div>
              
              <div className="mb-6 p-4 bg-matcha/5 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Your Progress</h3>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Overall Proficiency: <span className="font-semibold text-matcha">{userProficiency}%</span>
                  </p>
                  <Link to="/quick-quiz" state={{ fromKanaLearning: true, kanaType: 'hiragana' }}>
                    <Button size="sm" variant="outline">
                      Test Yourself
                    </Button>
                  </Link>
                </div>
              </div>
              
              <CharacterGrid kanaType="hiragana" />
              
              <div className="mb-6 p-4 bg-matcha/5 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Practice Hiragana</h3>
                <p className="text-xs text-muted-foreground">
                  Practice recognizing and matching hiragana characters.
                </p>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="character-size" className="text-xs">Character Size</Label>
                    <Slider
                      id="character-size"
                      defaultValue={[50]}
                      max={100}
                      step={10}
                      onValueChange={(value) => setPracticeCharSize(value[0])}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="character-count" className="text-xs">Character Count</Label>
                    <Slider
                      id="character-count"
                      defaultValue={[10]}
                      max={50}
                      step={5}
                      onValueChange={(value) => setPracticeCharCount(value[0])}
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between">
                  <Button onClick={handlePracticeStart}>Start Practice</Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="katakana" className="space-y-6 animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <ArrowLeft size={16} />
                    Back
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold text-center text-vermilion">Katakana</h1>
                <div className="opacity-0">
                  <Button variant="ghost" size="sm">
                    <Settings size={16} />
                  </Button>
                </div>
              </div>
              
              <div className="mb-6 p-4 bg-vermilion/5 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Your Progress</h3>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Overall Proficiency: <span className="font-semibold text-vermilion">{userProficiency}%</span>
                  </p>
                  <Link to="/quick-quiz" state={{ fromKanaLearning: true, kanaType: 'katakana' }}>
                    <Button size="sm" variant="outline">
                      Test Yourself
                    </Button>
                  </Link>
                </div>
              </div>
              
              <CharacterGrid kanaType="katakana" />
              
              <div className="mb-6 p-4 bg-vermilion/5 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Practice Katakana</h3>
                <p className="text-xs text-muted-foreground">
                  Practice recognizing and matching katakana characters.
                </p>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="character-size" className="text-xs">Character Size</Label>
                    <Slider
                      id="character-size"
                      defaultValue={[50]}
                      max={100}
                      step={10}
                      onValueChange={(value) => setPracticeCharSize(value[0])}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="character-count" className="text-xs">Character Count</Label>
                    <Slider
                      id="character-count"
                      defaultValue={[10]}
                      max={50}
                      step={5}
                      onValueChange={(value) => setPracticeCharCount(value[0])}
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between">
                  <Button onClick={handlePracticeStart}>Start Practice</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {showPractice && (
          <PracticeInterface
            kanaType={kanaType}
            practiceType={practiceType}
            characterSize={practiceCharSize}
            characterCount={practiceCharCount}
            onComplete={handlePracticeComplete}
            onCancel={handlePracticeCancel}
          />
        )}
        
        {showResults && practiceResults && (
          <PracticeResults
            results={practiceResults}
            onReturn={() => setShowResults(false)}
          />
        )}
      </div>
    </div>
  );
};

export default KanaLearning;

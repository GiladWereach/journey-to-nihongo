import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';
import { kanaService } from '@/services/kanaService';
import KanaGrid from '@/components/kana/KanaGrid';
import KanaPractice, { PracticeResult } from '@/components/kana/KanaPractice';
import KanaPracticeResults from '@/components/kana/KanaPracticeResults';
import { KanaType, UserKanaProgress } from '@/types/kana';
import { Button } from '@/components/ui/button';
import { Book, PenTool, BookOpen, Activity, BarChart, Layers, ChevronLeft, GraduationCap, Bookmark } from 'lucide-react';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { Link } from 'react-router-dom';

const KanaLearning = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('learn');
  const [selectedKanaType, setSelectedKanaType] = useState<KanaType | 'all'>('all');
  const [practiceMode, setPracticeMode] = useState<'selection' | 'practice' | 'results'>('selection');
  const [practiceType, setPracticeType] = useState<'recognition' | 'matching'>('recognition');
  const [practiceResults, setPracticeResults] = useState<PracticeResult | null>(null);
  const [userProgress, setUserProgress] = useState<UserKanaProgress[]>([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);

  // Get kana data
  const hiragana = kanaService.getKanaByType('hiragana');
  const katakana = kanaService.getKanaByType('katakana');
  const allKana = kanaService.getAllKana();

  useEffect(() => {
    // Load user progress if user is logged in
    const loadUserProgress = async () => {
      if (user) {
        try {
          setIsLoadingProgress(true);
          const progress = await kanaService.getUserKanaProgress(user.id);
          setUserProgress(progress);
          setIsLoadingProgress(false);
        } catch (error) {
          console.error('Error loading user progress:', error);
          setIsLoadingProgress(false);
        }
      }
    };

    loadUserProgress();
  }, [user, toast]);

  // Calculate overall progress
  const calculateOverallProgress = (type: KanaType | 'all'): number => {
    if (!userProgress.length) return 0;
    
    let relevantKana;
    if (type === 'all') {
      relevantKana = allKana;
    } else {
      relevantKana = type === 'hiragana' ? hiragana : katakana;
    }
    
    // Find progress entries for relevant kana
    const relevantProgress = userProgress.filter(progress => 
      relevantKana.some(kana => kana.id === progress.characterId)
    );
    
    if (relevantProgress.length === 0) return 0;
    
    // Calculate average proficiency
    const totalProficiency = relevantProgress.reduce((sum, progress) => sum + progress.proficiency, 0);
    return totalProficiency / relevantProgress.length;
  };

  const handlePracticeStart = (type: KanaType | 'all', mode: 'recognition' | 'matching') => {
    setSelectedKanaType(type);
    setPracticeType(mode);
    setPracticeMode('practice');
  };

  const handlePracticeComplete = (results: PracticeResult) => {
    setPracticeResults(results);
    setPracticeMode('results');
  };

  const handlePracticeCancel = () => {
    setPracticeMode('selection');
    setActiveTab('practice');
  };

  const handlePracticeSimilar = () => {
    // For now, just restart with the same type
    // In a production app, we'd use the mistakes to generate a targeted practice session
    setPracticeMode('practice');
  };

  const handlePracticeAgain = () => {
    setPracticeMode('practice');
  };

  const handleFinishPractice = () => {
    setPracticeMode('selection');
    setActiveTab('practice');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Learning Module Navigation Bar */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md shadow-sm pb-2 border-b mb-6">
        <div className="flex items-center justify-between py-2">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-montserrat font-bold text-indigo tracking-tight">
              Nihongo Journey
            </span>
          </Link>
          
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 bg-indigo/10 text-indigo font-medium"
                asChild
              >
                <Link to="/kana-learning">
                  <Book size={16} />
                  Kana
                </Link>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "Kanji learning module is under development",
                  });
                }}
              >
                <GraduationCap size={16} />
                Kanji
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "Grammar module is under development",
                  });
                }}
              >
                <Bookmark size={16} />
                Grammar
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "Vocabulary module is under development",
                  });
                }}
              >
                <Layers size={16} />
                Vocabulary
              </Button>
            </div>
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
        
        <h1 className="text-2xl md:text-3xl font-bold my-2 text-indigo flex items-center gap-2 justify-center">
          <Book className="h-7 w-7" /> Kana Learning
        </h1>
      </div>
      
      <div className="max-w-4xl mx-auto mb-8 bg-softgray p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-3 text-indigo">Getting Started with Japanese Writing</h2>
        <p className="mb-4">
          Japanese uses three writing systems: Hiragana, Katakana, and Kanji. We'll start with learning Hiragana and Katakana, which are the phonetic alphabets used in Japanese.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded-md shadow-sm border">
            <h3 className="font-medium text-lg flex items-center gap-2 text-indigo mb-2">
              <Book size={18} /> Hiragana
            </h3>
            <p className="text-sm">Used for native Japanese words. This is the first writing system to learn.</p>
            
            {user && (
              <div className="mt-3">
                <ProgressIndicator 
                  progress={calculateOverallProgress('hiragana')} 
                  size="sm" 
                  color="bg-indigo" 
                  label="Your Progress" 
                  showPercentage 
                />
              </div>
            )}
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm border">
            <h3 className="font-medium text-lg flex items-center gap-2 text-indigo mb-2">
              <Book size={18} /> Katakana
            </h3>
            <p className="text-sm">Used for foreign words and emphasis. Similar to Hiragana but with different characters.</p>
            
            {user && (
              <div className="mt-3">
                <ProgressIndicator 
                  progress={calculateOverallProgress('katakana')} 
                  size="sm" 
                  color="bg-indigo" 
                  label="Your Progress" 
                  showPercentage 
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Tabs 
        defaultValue="learn" 
        className="max-w-6xl mx-auto"
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <TabsList className="grid grid-cols-3 mb-8 sticky top-0 z-30 bg-background shadow-md p-1 rounded-full max-w-md mx-auto">
          <TabsTrigger value="learn" className="flex items-center gap-2 rounded-full">
            <BookOpen size={16} /> Learn
          </TabsTrigger>
          <TabsTrigger value="practice" className="flex items-center gap-2 rounded-full">
            <PenTool size={16} /> Practice
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2 rounded-full">
            <Activity size={16} /> Progress
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="learn" className="space-y-8">
          <KanaGrid kanaList={allKana} />
        </TabsContent>
        
        <TabsContent value="practice" className="space-y-8">
          {practiceMode === 'selection' && (
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-semibold">Practice Your Kana</h2>
              <p className="max-w-2xl mx-auto">
                Select which set of characters you want to practice and a practice mode.
              </p>
              
              <div className="mb-8 mt-6">
                <h3 className="text-xl font-semibold mb-4">Recognition Practice</h3>
                <p className="max-w-2xl mx-auto mb-4 text-sm text-gray-600">
                  See a kana character and choose its correct pronunciation
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-4">
                  <Button 
                    onClick={() => handlePracticeStart('hiragana', 'recognition')}
                    className="h-auto py-6 bg-matcha hover:bg-matcha/90"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-semibold mb-2">Hiragana</span>
                      <span className="text-3xl mb-2">あいうえお</span>
                      <span className="text-sm">Recognition practice</span>
                    </div>
                  </Button>
                  
                  <Button 
                    onClick={() => handlePracticeStart('katakana', 'recognition')}
                    className="h-auto py-6 bg-vermilion hover:bg-vermilion/90"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-semibold mb-2">Katakana</span>
                      <span className="text-3xl mb-2">アイウエオ</span>
                      <span className="text-sm">Recognition practice</span>
                    </div>
                  </Button>
                  
                  <Button 
                    onClick={() => handlePracticeStart('all', 'recognition')}
                    className="h-auto py-6 bg-indigo hover:bg-indigo/90"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-semibold mb-2">Both</span>
                      <span className="text-3xl mb-2">あア</span>
                      <span className="text-sm">Mixed practice</span>
                    </div>
                  </Button>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Matching Practice</h3>
                <p className="max-w-2xl mx-auto mb-4 text-sm text-gray-600">
                  Match kana characters with their correct pronunciation
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-4">
                  <Button 
                    onClick={() => handlePracticeStart('hiragana', 'matching')}
                    className="h-auto py-6 bg-matcha hover:bg-matcha/90"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-semibold mb-2">Hiragana</span>
                      <span className="text-3xl mb-2">あ=a</span>
                      <span className="text-sm">Matching practice</span>
                    </div>
                  </Button>
                  
                  <Button 
                    onClick={() => handlePracticeStart('katakana', 'matching')}
                    className="h-auto py-6 bg-vermilion hover:bg-vermilion/90"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-semibold mb-2">Katakana</span>
                      <span className="text-3xl mb-2">ア=a</span>
                      <span className="text-sm">Matching practice</span>
                    </div>
                  </Button>
                  
                  <Button 
                    onClick={() => handlePracticeStart('all', 'matching')}
                    className="h-auto py-6 bg-indigo hover:bg-indigo/90"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-semibold mb-2">Both</span>
                      <span className="text-3xl mb-2">あア=a</span>
                      <span className="text-sm">Mixed matching</span>
                    </div>
                  </Button>
                </div>
              </div>
              
              <div className="mt-8 pt-4 border-t">
                <h3 className="text-xl font-semibold mb-4">Coming Soon</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto opacity-60">
                  <Button 
                    disabled
                    className="h-auto py-6"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-semibold mb-2">Writing Practice</span>
                      <span className="text-sm">Draw kana characters and get feedback</span>
                    </div>
                  </Button>
                  
                  <Button 
                    disabled
                    className="h-auto py-6"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-semibold mb-2">Word Formation</span>
                      <span className="text-sm">Create words from kana characters</span>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {practiceMode === 'practice' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handlePracticeCancel}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft size={16} /> Back to Selection
                </Button>
                <div className="text-right">
                  <h2 className="text-xl font-bold">
                    {practiceType === 'recognition' ? 'Recognition Practice' : 'Matching Practice'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedKanaType === 'hiragana' ? 'Hiragana' : 
                     selectedKanaType === 'katakana' ? 'Katakana' : 'Mixed Kana'}
                  </p>
                </div>
              </div>
              <KanaPractice 
                practiceType={practiceType}
                kanaType={selectedKanaType}
                onComplete={handlePracticeComplete}
                onCancel={handlePracticeCancel}
              />
            </>
          )}
          
          {practiceMode === 'results' && practiceResults && (
            <>
              <div className="flex justify-between items-center mb-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleFinishPractice}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft size={16} /> Back to Practice Menu
                </Button>
                <div className="text-right">
                  <h2 className="text-xl font-bold">Practice Results</h2>
                </div>
              </div>
              <KanaPracticeResults 
                results={practiceResults}
                onPracticeSimilar={handlePracticeSimilar}
                onPracticeAgain={handlePracticeAgain}
                onFinish={handleFinishPractice}
              />
            </>
          )}
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Your Progress</h2>
            
            {user ? (
              isLoadingProgress ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo"></div>
                </div>
              ) : userProgress.length > 0 ? (
                <div className="space-y-8">
                  <div className="bg-white p-6 rounded-lg shadow-md border">
                    <h3 className="text-xl font-medium mb-4 flex items-center justify-center gap-2">
                      <BarChart size={20} /> Overall Progress
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Hiragana</h4>
                        <div className="text-2xl font-bold text-matcha mb-2">
                          {calculateOverallProgress('hiragana').toFixed(0)}%
                        </div>
                        <ProgressIndicator 
                          progress={calculateOverallProgress('hiragana')} 
                          size="md" 
                          color="bg-matcha" 
                        />
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Katakana</h4>
                        <div className="text-2xl font-bold text-vermilion mb-2">
                          {calculateOverallProgress('katakana').toFixed(0)}%
                        </div>
                        <ProgressIndicator 
                          progress={calculateOverallProgress('katakana')} 
                          size="md" 
                          color="bg-vermilion" 
                        />
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">All Kana</h4>
                        <div className="text-2xl font-bold text-indigo mb-2">
                          {calculateOverallProgress('all').toFixed(0)}%
                        </div>
                        <ProgressIndicator 
                          progress={calculateOverallProgress('all')} 
                          size="md" 
                          color="bg-indigo" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md border text-left">
                    <h3 className="text-xl font-medium mb-4">Recently Practiced Characters</h3>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-2 text-left">Character</th>
                            <th className="px-4 py-2 text-left">Reading</th>
                            <th className="px-4 py-2 text-left">Proficiency</th>
                            <th className="px-4 py-2 text-left">Practices</th>
                            <th className="px-4 py-2 text-left">Mistakes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userProgress
                            .sort((a, b) => b.lastPracticed.getTime() - a.lastPracticed.getTime())
                            .slice(0, 5)
                            .map((progress) => {
                              const kana = allKana.find(k => k.id === progress.characterId);
                              if (!kana) return null;
                              
                              return (
                                <tr key={progress.characterId} className="border-b hover:bg-gray-50">
                                  <td className="px-4 py-3 text-xl">{kana.character}</td>
                                  <td className="px-4 py-3">{kana.romaji}</td>
                                  <td className="px-4 py-3">
                                    <ProgressIndicator 
                                      progress={progress.proficiency} 
                                      size="sm" 
                                      color={
                                        progress.proficiency >= 80 ? "bg-green-500" : 
                                        progress.proficiency >= 50 ? "bg-yellow-500" : 
                                        "bg-red-500"
                                      } 
                                      showPercentage 
                                    />
                                  </td>
                                  <td className="px-4 py-3">{progress.totalPracticeCount}</td>
                                  <td className="px-4 py-3">{progress.mistakeCount}</td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                    
                    {userProgress.length > 5 && (
                      <div className="mt-4 text-center">
                        <Button variant="outline">View All Characters</Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-md border">
                  <p className="mb-8">
                    Start practicing kana characters to see your progress here!
                  </p>
                  
                  <Button 
                    onClick={() => {
                      setActiveTab('practice');
                      setPracticeMode('selection');
                    }}
                    className="bg-indigo hover:bg-indigo/90"
                  >
                    Start Practicing
                  </Button>
                </div>
              )
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <p className="mb-4 text-amber-600">Sign in to track your progress</p>
                <p>
                  Create an account or sign in to save your learning progress and track your improvement over time.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KanaLearning;

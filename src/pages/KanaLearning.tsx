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
import { Book, PenTool, BookOpen, Activity, BarChart, Layers, ChevronLeft, GraduationCap, Bookmark, Calendar, Award, TrendingUp, Clock, Medal } from 'lucide-react';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { Link } from 'react-router-dom';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';

const KanaLearning = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('intro');
  const [selectedKanaType, setSelectedKanaType] = useState<KanaType | 'all'>('all');
  const [practiceMode, setPracticeMode] = useState<'selection' | 'practice' | 'results'>('selection');
  const [practiceType, setPracticeType] = useState<'recognition' | 'matching'>('recognition');
  const [practiceResults, setPracticeResults] = useState<PracticeResult | null>(null);
  const [userProgress, setUserProgress] = useState<UserKanaProgress[]>([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);

  const hiragana = kanaService.getKanaByType('hiragana');
  const katakana = kanaService.getKanaByType('katakana');
  const allKana = kanaService.getAllKana();

  useEffect(() => {
    if (user) {
      try {
        setIsLoadingProgress(true);
        kanaService.getUserKanaProgress(user.id)
          .then(progress => {
            setUserProgress(progress);
            setIsLoadingProgress(false);
          })
          .catch(error => {
            console.error('Error loading user progress:', error);
            setIsLoadingProgress(false);
          });
      } catch (error) {
        console.error('Error loading user progress:', error);
        setIsLoadingProgress(false);
      }
    }
  }, [user, toast]);

  const calculateOverallProgress = (type: KanaType | 'all'): number => {
    if (!userProgress.length) return 0;
    
    let relevantKana;
    if (type === 'all') {
      relevantKana = allKana;
    } else {
      relevantKana = type === 'hiragana' ? hiragana : katakana;
    }
    
    const relevantProgress = userProgress.filter(progress => 
      relevantKana.some(kana => kana.id === progress.character_id)
    );
    
    if (relevantProgress.length === 0) return 0;
    
    const totalProficiency = relevantProgress.reduce((sum, progress) => sum + progress.proficiency, 0);
    return totalProficiency / relevantProgress.length;
  };

  const calculateProficiencyLevel = (proficiency: number): 'beginner' | 'intermediate' | 'advanced' | 'mastered' => {
    if (proficiency >= 90) return 'mastered';
    if (proficiency >= 70) return 'advanced';
    if (proficiency >= 40) return 'intermediate';
    return 'beginner';
  };

  const calculateMasteryPercentage = (type: KanaType | 'all'): number => {
    if (!userProgress.length) return 0;
    
    let relevantKana;
    if (type === 'all') {
      relevantKana = allKana;
    } else {
      relevantKana = type === 'hiragana' ? hiragana : katakana;
    }
    
    const relevantProgress = userProgress.filter(progress => 
      relevantKana.some(kana => kana.id === progress.character_id)
    );
    
    if (relevantProgress.length === 0) return 0;
    
    const masteredChars = relevantProgress.filter(progress => progress.proficiency >= 90).length;
    return (masteredChars / relevantProgress.length) * 100;
  };

  const getMostChallenging = (): UserKanaProgress[] => {
    if (!userProgress.length) return [];
    
    return [...userProgress]
      .filter(progress => progress.total_practice_count > 0)
      .sort((a, b) => a.proficiency - b.proficiency)
      .slice(0, 5);
  };

  const getMostPracticed = (): UserKanaProgress[] => {
    if (!userProgress.length) return [];
    
    return [...userProgress]
      .sort((a, b) => b.total_practice_count - a.total_practice_count)
      .slice(0, 5);
  };

  const handlePracticeStart = (type: KanaType | 'all', mode: 'recognition' | 'matching') => {
    setSelectedKanaType(type);
    setPracticeType(mode);
    setPracticeMode('practice');
    setActiveTab('practice');
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
        <Tabs 
          defaultValue="intro" 
          className="max-w-5xl mx-auto"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          <TabsList className="grid grid-cols-4 mb-6 sticky top-16 z-40 bg-background/95 backdrop-blur-sm shadow-sm p-1 rounded-lg max-w-md mx-auto">
            <TabsTrigger value="intro" className="flex items-center gap-2 rounded-md">
              <BookOpen size={16} />
              Intro
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex items-center gap-2 rounded-md">
              <Book size={16} />
              Learn
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-2 rounded-md">
              <PenTool size={16} />
              Practice
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2 rounded-md">
              <BarChart size={16} />
              Progress
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="intro" className="space-y-6 animate-fade-in">
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm border">
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
                    
                    {user && (
                      <ProgressIndicator 
                        progress={calculateOverallProgress('hiragana')} 
                        size="sm" 
                        color="bg-matcha" 
                      />
                    )}
                  </div>
                  
                  <div className="bg-softgray/30 p-5 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <JapaneseCharacter character="ア" size="md" color="text-vermilion" />
                      <h3 className="text-lg font-medium text-vermilion">Katakana</h3>
                    </div>
                    <p className="text-sm mb-3">Used for foreign words, emphasis, and technical terms.</p>
                    <p className="text-sm text-gray-600 mb-3">Example: <span className="japanese-text">アイウエオ</span> (a-i-u-e-o)</p>
                    
                    {user && (
                      <ProgressIndicator 
                        progress={calculateOverallProgress('katakana')} 
                        size="sm" 
                        color="bg-vermilion" 
                      />
                    )}
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
                      onClick={() => {
                        setActiveTab('practice');
                        setPracticeMode('selection');
                      }}
                      className="text-indigo hover:bg-indigo/10 border-indigo/30"
                    >
                      Go to Practice
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="learn" className="space-y-4">
            <KanaGrid kanaList={allKana} />
          </TabsContent>
          
          <TabsContent value="practice" className="space-y-6">
            {practiceMode === 'selection' && (
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-semibold text-indigo">Practice Your Kana</h2>
                
                <div className="mb-8 mt-6">
                  <h3 className="text-lg font-medium mb-3 text-indigo">Recognition Practice</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-4">
                    <Button 
                      onClick={() => handlePracticeStart('hiragana', 'recognition')}
                      className="h-auto py-5 bg-matcha hover:bg-matcha/90"
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-medium mb-2">Hiragana</span>
                        <span className="text-3xl mb-3 japanese-text">あいう</span>
                      </div>
                    </Button>
                    
                    <Button 
                      onClick={() => handlePracticeStart('katakana', 'recognition')}
                      className="h-auto py-5 bg-vermilion hover:bg-vermilion/90"
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-medium mb-2">Katakana</span>
                        <span className="text-3xl mb-3 japanese-text">アイウ</span>
                      </div>
                    </Button>
                    
                    <Button 
                      onClick={() => handlePracticeStart('all', 'recognition')}
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
                      onClick={() => handlePracticeStart('hiragana', 'matching')}
                      className="h-auto py-5 bg-matcha hover:bg-matcha/90"
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-medium mb-2">Hiragana</span>
                        <span className="text-3xl mb-3">あ=a</span>
                      </div>
                    </Button>
                    
                    <Button 
                      onClick={() => handlePracticeStart('katakana', 'matching')}
                      className="h-auto py-5 bg-vermilion hover:bg-vermilion/90"
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-medium mb-2">Katakana</span>
                        <span className="text-3xl mb-3">ア=a</span>
                      </div>
                    </Button>
                    
                    <Button 
                      onClick={() => handlePracticeStart('all', 'matching')}
                      className="h-auto py-5 bg-indigo hover:bg-indigo/90"
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-medium mb-2">Mixed</span>
                        <span className="text-3xl mb-3">あア=a</span>
                      </div>
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
                    <ChevronLeft size={16} />
                  </Button>
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-indigo">
                      {practiceType === 'recognition' ? 'Recognition' : 'Matching'}
                    </h2>
                    <div className="flex items-center justify-center gap-2">
                      {selectedKanaType === 'hiragana' ? (
                        <JapaneseCharacter character="あ" size="sm" color="text-matcha" />
                      ) : selectedKanaType === 'katakana' ? (
                        <JapaneseCharacter character="ア" size="sm" color="text-vermilion" />
                      ) : (
                        <div className="flex items-center gap-1">
                          <JapaneseCharacter character="あ" size="sm" color="text-matcha" />
                          <JapaneseCharacter character="ア" size="sm" color="text-vermilion" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-10"></div>
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
                    <ChevronLeft size={16} />
                  </Button>
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-indigo">Results</h2>
                  </div>
                  <div className="w-10"></div>
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
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6 text-indigo text-center">Your Learning Progress</h2>
              
              {user ? (
                isLoadingProgress ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo"></div>
                  </div>
                ) : userProgress.length > 0 ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-indigo" />
                            <CardTitle className="text-lg">Overall Progress</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-indigo mb-2">
                            {calculateOverallProgress('all').toFixed(0)}%
                          </div>
                          <ProgressIndicator 
                            progress={calculateOverallProgress('all')} 
                            size="md" 
                            color="bg-indigo"
                            showTicks
                          />
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <CardTitle className="text-lg">Mastered Characters</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-green-600 mb-2">
                            {calculateMasteryPercentage('all').toFixed(0)}%
                          </div>
                          <ProgressIndicator 
                            progress={calculateMasteryPercentage('all')} 
                            size="md" 
                            color="bg-green-500"
                            showTicks
                          />
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-600" />
                            <CardTitle className="text-lg">Practice History</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            {userProgress.reduce((sum, item) => sum + item.total_practice_count, 0)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Total practice interactions
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <JapaneseCharacter character="あ" size="sm" color="text-matcha" />
                              <CardTitle className="text-lg text-matcha">Hiragana</CardTitle>
                            </div>
                            <span className="text-sm bg-matcha/10 text-matcha px-2 py-1 rounded-full">
                              {userProgress.filter(p => 
                                hiragana.some(k => k.id === p.character_id) && p.proficiency >= 90
                              ).length}/{hiragana.length} Mastered
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <ProgressIndicator 
                            progress={calculateOverallProgress('hiragana')} 
                            size="md" 
                            color="bg-matcha" 
                            showPercentage
                            showTicks
                            proficiencyLevel={calculateProficiencyLevel(calculateOverallProgress('hiragana'))}
                            showLabel
                          />
                          
                          <div className="grid grid-cols-5 gap-2 mt-4">
                            {hiragana.slice(0, 10).map(kana => {
                              const progress = userProgress.find(p => p.character_id === kana.id);
                              const proficiency = progress ? progress.proficiency : 0;
                              
                              return (
                                <div 
                                  key={kana.id} 
                                  className={cn(
                                    "aspect-square flex flex-col items-center justify-center rounded-lg border text-center",
                                    proficiency >= 90 ? "border-green-300 bg-green-50" :
                                    proficiency >= 70 ? "border-blue-300 bg-blue-50" :
                                    proficiency >= 40 ? "border-yellow-300 bg-yellow-50" :
                                    proficiency > 0 ? "border-red-300 bg-red-50" : 
                                    "border-gray-200 bg-gray-50"
                                  )}
                                >
                                  <div className="text-xl">{kana.character}</div>
                                  <div className="text-xs mt-1">
                                    {proficiency > 0 ? `${proficiency}%` : "New"}
                                  </div>
                                </div>
                              );
                            })}
                            {hiragana.length > 10 && (
                              <div className="aspect-square flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                                <span className="text-gray-400">+{hiragana.length - 10}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <JapaneseCharacter character="ア" size="sm" color="text-vermilion" />
                              <CardTitle className="text-lg text-vermilion">Katakana</CardTitle>
                            </div>
                            <span className="text-sm bg-vermilion/10 text-vermilion px-2 py-1 rounded-full">
                              {userProgress.filter(p => 
                                katakana.some(k => k.id === p.character_id) && p.proficiency >= 90
                              ).length}/{katakana.length} Mastered
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <ProgressIndicator 
                            progress={calculateOverallProgress('katakana')} 
                            size="md" 
                            color="bg-vermilion" 
                            showPercentage
                            showTicks
                            proficiencyLevel={calculateProficiencyLevel(calculateOverallProgress('katakana'))}
                            showLabel
                          />
                          
                          <div className="grid grid-cols-5 gap-2 mt-4">
                            {katakana.slice(0, 10).map(kana => {
                              const progress = userProgress.find(p => p.character_id === kana.id);
                              const proficiency = progress ? progress.proficiency : 0;
                              
                              return (
                                <div 
                                  key={kana.id} 
                                  className={cn(
                                    "aspect-square flex flex-col items-center justify-center rounded-lg border text-center",
                                    proficiency >= 90 ? "border-green-300 bg-green-50" :
                                    proficiency >= 70 ? "border-blue-300 bg-blue-50" :
                                    proficiency >= 40 ? "border-yellow-300 bg-yellow-50" :
                                    proficiency > 0 ? "border-red-300 bg-red-50" : 
                                    "border-gray-200 bg-gray-50"
                                  )}
                                >
                                  <div className="text-xl">{kana.character}</div>
                                  <div className="text-xs mt-1">
                                    {proficiency > 0 ? `${proficiency}%` : "New"}
                                  </div>
                                </div>
                              );
                            })}
                            {katakana.length > 10 && (
                              <div className="aspect-square flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                                <span className="text-gray-400">+{katakana.length - 10}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Medal className="h-5 w-5 text-amber-500" />
                            Most Practiced Characters
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {getMostPracticed().map(progress => {
                              const kana = allKana.find(k => k.id === progress.character_id);
                              if (!kana) return null;
                              
                              return (
                                <div key={progress.character_id} className="flex items-center gap-3">
                                  <div className="w-12 h-12 flex items-center justify-center text-2xl border rounded-lg">
                                    {kana.character}
                                  </div>
                                  <div className="flex-grow">
                                    <div className="flex justify-between">
                                      <span className="font-medium">{kana.romaji}</span>
                                      <span className="text-sm text-gray-500">
                                        {progress.total_practice_count} practices
                                      </span>
                                    </div>
                                    <ProgressIndicator
                                      progress={progress.proficiency}
                                      size="sm"
                                      proficiencyLevel={calculateProficiencyLevel(progress.proficiency)}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                            
                            {getMostPracticed().length === 0 && (
                              <div className="text-center py-6 text-gray-500">
                                No practice data yet
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Activity className="h-5 w-5 text-red-500" />
                            Most Challenging Characters
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {getMostChallenging().map(progress => {
                              const kana = allKana.find(k => k.id === progress.character_id);
                              if (!kana) return null;
                              
                              return (
                                <div key={progress.character_id} className="flex items-center gap-3">
                                  <div className="w-12 h-12 flex items-center justify-center text-2xl border rounded-lg">
                                    {kana.character}
                                  </div>
                                  <div className="flex-grow">
                                    <div className="flex justify-between">
                                      <span className="font-medium">{kana.romaji}</span>
                                      <span className="text-sm text-gray-500">
                                        {progress.mistake_count} mistakes
                                      </span>
                                    </div>
                                    <ProgressIndicator
                                      progress={progress.proficiency}
                                      size="sm"
                                      proficiencyLevel={calculateProficiencyLevel(progress.proficiency)}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                            
                            {getMostChallenging().length === 0 && (
                              <div className="text-center py-6 text-gray-500">
                                No challenge data yet
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-indigo" />
                          Recent Practice History
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="px-4 py-2 text-left">Character</th>
                                <th className="px-4 py-2 text-left">Reading</th>
                                <th className="px-4 py-2 text-left">Last Practiced</th>
                                <th className="px-4 py-2 text-left">Proficiency</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userProgress
                                .sort((a, b) => b.last_practiced.getTime() - a.last_practiced.getTime())
                                .slice(0, 5)
                                .map((progress) => {
                                  const kana = allKana.find(k => k.id === progress.character_id);
                                  if (!kana) return null;
                                  
                                  const formatTimeAgo = (date: Date) => {
                                    const now = new Date();
                                    const diffInMs = now.getTime() - date.getTime();
                                    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
                                    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
                                    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
                                    
                                    if (diffInDays > 0) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
                                    if (diffInHours > 0) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
                                    if (diffInMinutes > 0) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
                                    return 'Just now';
                                  };
                                  
                                  return (
                                    <tr key={progress.character_id} className="border-b hover:bg-gray-50">
                                      <td className="px-4 py-3 text-xl japanese-text">{kana.character}</td>
                                      <td className="px-4 py-3">{kana.romaji}</td>
                                      <td className="px-4 py-3 text-gray-500">{formatTimeAgo(progress.last_practiced)}</td>
                                      <td className="px-4 py-3 w-1/3">
                                        <ProgressIndicator 
                                          progress={progress.proficiency} 
                                          size="sm" 
                                          proficiencyLevel={calculateProficiencyLevel(progress.proficiency)}
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="text-center mt-8 pt-4">
                      <p className="mb-4 text-gray-600">Continue building your skills with more practice</p>
                      <Button 
                        onClick={() => {
                          setActiveTab('practice');
                          setPracticeMode('selection');
                        }}
                        className="bg-indigo hover:bg-indigo/90"
                      >
                        Start New Practice
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <p className="mb-8">Start practicing to see your progress here!</p>
                    
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
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <p className="mb-4 text-amber-600">Sign in to track your progress</p>
                  <p className="mb-4">
                    Create an account or sign in to save your learning progress.
                  </p>
                  <Link to="/auth">
                    <Button className="bg-indigo hover:bg-indigo/90">
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default KanaLearning;

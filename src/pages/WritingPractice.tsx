
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Pen, ArrowLeft } from 'lucide-react';
import { kanaService } from '@/services/kanaService';
import { KanaCharacter, KanaType } from '@/types/kana';
import { useToast } from '@/hooks/use-toast';
import PrimaryNavigation from '@/components/layout/PrimaryNavigation';
import WritingPracticeExercise from '@/components/kana/WritingPracticeExercise';
import { kanaProgressService } from '@/services/kanaProgressService';

const WritingPractice: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'setup' | 'practice'>('setup');
  const [kanaType, setKanaType] = useState<KanaType>('hiragana');
  const [characterCount, setCharacterCount] = useState<number>(5);
  const [practiceSet, setPracticeSet] = useState<KanaCharacter[]>([]);
  const [userProgress, setUserProgress] = useState<Map<string, any>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for state passed from other components
  useEffect(() => {
    if (location.state) {
      const { kanaType: stateKanaType } = location.state as { kanaType: KanaType };
      if (stateKanaType) {
        setKanaType(stateKanaType);
      }
    }
  }, [location]);
  
  // Fetch user progress
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const progress = await kanaProgressService.getUserProgressAll(user.id);
        setUserProgress(progress);
      } catch (error) {
        console.error('Error fetching user progress:', error);
        toast({
          title: "Error",
          description: "Failed to load your progress data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProgress();
  }, [user, toast]);
  
  const generatePracticeSet = () => {
    // Get all kana of the selected type
    const allKana = kanaService.getKanaByType(kanaType);
    
    // Create a weighted list based on user progress
    let weightedList: { kana: KanaCharacter, weight: number }[] = [];
    
    allKana.forEach(kana => {
      const progress = userProgress.get(kana.id);
      let weight = 1.0; // Default weight
      
      if (progress) {
        const proficiency = progress.proficiency || 0;
        
        // Prioritize characters with lower proficiency
        if (proficiency < 30) {
          weight = 3.0; // Much higher chance
        } else if (proficiency < 60) {
          weight = 2.0; // Higher chance
        } else if (proficiency < 90) {
          weight = 1.0; // Normal chance
        } else {
          weight = 0.5; // Lower chance if already proficient
        }
      } else {
        weight = 3.0; // Prioritize characters that haven't been practiced yet
      }
      
      weightedList.push({ kana, weight });
    });
    
    // Shuffle using weighted random selection
    const selectedSet: KanaCharacter[] = [];
    const tempList = [...weightedList];
    
    while (selectedSet.length < characterCount && tempList.length > 0) {
      const totalWeight = tempList.reduce((sum, item) => sum + item.weight, 0);
      let randomValue = Math.random() * totalWeight;
      let cumulativeWeight = 0;
      let selectedIndex = -1;
      
      for (let i = 0; i < tempList.length; i++) {
        cumulativeWeight += tempList[i].weight;
        if (randomValue <= cumulativeWeight) {
          selectedIndex = i;
          break;
        }
      }
      
      if (selectedIndex !== -1) {
        selectedSet.push(tempList[selectedIndex].kana);
        tempList.splice(selectedIndex, 1);
      }
    }
    
    setPracticeSet(selectedSet);
    setActiveTab('practice');
  };
  
  const handleComplete = () => {
    toast({
      title: "Practice Completed",
      description: "Great job! You've completed the writing practice session.",
    });
    
    setActiveTab('setup');
  };
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 px-4 bg-softgray/30">
        <div className="max-w-7xl mx-auto flex">
          {/* Sidebar Navigation for Desktop */}
          <div className="hidden md:block w-64 mr-8">
            <div className="sticky top-24">
              <PrimaryNavigation />
              
              <div className="mt-8 p-4 bg-white rounded-lg shadow">
                <h3 className="font-semibold text-indigo mb-3">Quick Access</h3>
                
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    size="sm"
                    onClick={() => navigate('/practice')}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Practice
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden fixed bottom-4 right-4 z-40">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" className="rounded-full w-12 h-12 bg-indigo hover:bg-indigo/90">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[280px]">
                <div className="py-4">
                  <h2 className="text-lg font-bold text-indigo mb-4">Navigation</h2>
                  <PrimaryNavigation />
                  
                  <div className="mt-6 space-y-2 border-t pt-4">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      size="sm"
                      onClick={() => navigate('/practice')}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Practice
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <Pen className="h-8 w-8 mr-2 text-indigo" />
                Writing Practice
              </h1>
              <p className="text-gray-600">
                Improve your Japanese writing skills by practicing character stroke order.
              </p>
            </div>
            
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'setup' | 'practice')}>
              <TabsContent value="setup" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Configure Your Practice Session</CardTitle>
                    <CardDescription>
                      Choose the character type and how many characters you want to practice.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Select Character Type</h3>
                      <div className="flex gap-4">
                        <Button 
                          variant={kanaType === 'hiragana' ? 'default' : 'outline'}
                          onClick={() => setKanaType('hiragana')}
                          className={kanaType === 'hiragana' ? 'bg-matcha hover:bg-matcha/90' : ''}
                        >
                          Hiragana
                        </Button>
                        <Button 
                          variant={kanaType === 'katakana' ? 'default' : 'outline'}
                          onClick={() => setKanaType('katakana')}
                          className={kanaType === 'katakana' ? 'bg-vermilion hover:bg-vermilion/90' : ''}
                        >
                          Katakana
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Number of Characters</h3>
                      <div className="flex gap-2">
                        {[5, 10, 15].map((count) => (
                          <Button 
                            key={count}
                            variant={characterCount === count ? 'default' : 'outline'}
                            onClick={() => setCharacterCount(count)}
                            className={characterCount === count ? 'bg-indigo hover:bg-indigo/90' : ''}
                          >
                            {count}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-indigo hover:bg-indigo/90"
                      onClick={generatePracticeSet}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Loading...' : 'Start Practice'}
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>About Writing Practice</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p>
                        Writing practice helps you master the stroke order and shape of Japanese characters.
                        Here's what to expect:
                      </p>
                      
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Each character will be shown with its stroke order</li>
                        <li>You'll practice writing each character twice</li>
                        <li>First attempt will be from memory</li>
                        <li>Second attempt will show the character as a reference</li>
                        <li>Your progress will be tracked to help focus on characters you need to practice more</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="practice">
                {practiceSet.length > 0 ? (
                  <Card>
                    <CardContent className="p-6">
                      <WritingPracticeExercise 
                        kanaList={practiceSet}
                        onComplete={handleComplete}
                        kanaType={kanaType}
                      />
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center py-8">
                    <Button onClick={() => setActiveTab('setup')}>
                      Configure Practice Session
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default WritingPractice;

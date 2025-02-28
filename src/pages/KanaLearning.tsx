
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';
import { kanaService } from '@/services/kanaService';
import KanaGrid from '@/components/kana/KanaGrid';
import { KanaType } from '@/types/kana';
import { Button } from '@/components/ui/button';
import { Book, PenTool, BookOpen, Activity } from 'lucide-react';

const KanaLearning = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('learn');
  const [selectedKanaType, setSelectedKanaType] = useState<KanaType | 'all'>('all');
  
  const hiragana = kanaService.getKanaByType('hiragana');
  const katakana = kanaService.getKanaByType('katakana');
  const allKana = kanaService.getAllKana();

  const handlePracticeStart = (type: KanaType | 'all') => {
    // To be implemented in Phase 2.2
    toast({
      title: "Coming Soon!",
      description: `Practice mode for ${type === 'all' ? 'all kana' : type} is coming soon.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo">Kana Learning</h1>
      
      <div className="max-w-4xl mx-auto mb-8 bg-softgray p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Getting Started with Japanese Writing</h2>
        <p className="mb-4">
          Japanese uses three writing systems: Hiragana, Katakana, and Kanji. We'll start with learning Hiragana and Katakana, which are the phonetic alphabets used in Japanese.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded-md shadow">
            <h3 className="font-medium text-lg flex items-center gap-2 text-indigo mb-2">
              <Book size={18} /> Hiragana
            </h3>
            <p className="text-sm">Used for native Japanese words. This is the first writing system to learn.</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow">
            <h3 className="font-medium text-lg flex items-center gap-2 text-indigo mb-2">
              <Book size={18} /> Katakana
            </h3>
            <p className="text-sm">Used for foreign words and emphasis. Similar to Hiragana but with different characters.</p>
          </div>
        </div>
      </div>

      <Tabs 
        defaultValue="learn" 
        className="max-w-6xl mx-auto"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="learn" className="flex items-center gap-2">
            <BookOpen size={16} /> Learn
          </TabsTrigger>
          <TabsTrigger value="practice" className="flex items-center gap-2">
            <PenTool size={16} /> Practice
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <Activity size={16} /> Progress
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="learn" className="space-y-8">
          <KanaGrid kanaList={allKana} />
        </TabsContent>
        
        <TabsContent value="practice" className="space-y-8">
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-semibold">Practice Your Kana</h2>
            <p className="max-w-2xl mx-auto">
              Select which set of characters you want to practice. You'll be shown characters and asked to identify them, write them, or match them with their sounds.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-8">
              <Button 
                onClick={() => handlePracticeStart('hiragana')}
                className="h-auto py-6 bg-matcha hover:bg-matcha/90"
              >
                <div className="flex flex-col items-center">
                  <span className="text-xl font-semibold mb-2">Hiragana</span>
                  <span className="text-3xl mb-2">あいうえお</span>
                  <span className="text-sm">46 characters</span>
                </div>
              </Button>
              
              <Button 
                onClick={() => handlePracticeStart('katakana')}
                className="h-auto py-6 bg-vermilion hover:bg-vermilion/90"
              >
                <div className="flex flex-col items-center">
                  <span className="text-xl font-semibold mb-2">Katakana</span>
                  <span className="text-3xl mb-2">アイウエオ</span>
                  <span className="text-sm">46 characters</span>
                </div>
              </Button>
              
              <Button 
                onClick={() => handlePracticeStart('all')}
                className="h-auto py-6 bg-indigo hover:bg-indigo/90"
              >
                <div className="flex flex-col items-center">
                  <span className="text-xl font-semibold mb-2">Both</span>
                  <span className="text-3xl mb-2">あア</span>
                  <span className="text-sm">92 characters</span>
                </div>
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Your Progress</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="mb-8">
                As you learn and practice kana characters, your progress will be tracked here.
                Start practicing to see your stats!
              </p>
              
              {user ? (
                <Button 
                  onClick={() => setActiveTab('practice')}
                  className="bg-indigo hover:bg-indigo/90"
                >
                  Start Practicing
                </Button>
              ) : (
                <p className="text-amber-600">Sign in to track your progress</p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KanaLearning;

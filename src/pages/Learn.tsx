
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { BookOpen, Menu } from 'lucide-react';
import PrimaryNavigation from '@/components/layout/PrimaryNavigation';
import LearningPathCard from '@/components/ui/LearningPathCard';

const Learn: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    navigate('/auth');
    return null;
  }

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
                <h3 className="font-semibold text-indigo mb-2">Learning Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      Grammar Guide
                    </Button>
                  </li>
                  <li>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      Character Reference
                    </Button>
                  </li>
                  <li>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      Practice Exercises
                    </Button>
                  </li>
                </ul>
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
                  <h2 className="text-lg font-bold text-indigo mb-4 flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Navigation
                  </h2>
                  <PrimaryNavigation />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-indigo mb-2">Learn Japanese</h1>
              <p className="text-gray-600">
                Select a learning path below to start or continue your Japanese language journey.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <LearningPathCard
                title="Hiragana Mastery"
                japaneseTitle="ひらがな"
                description="Learn all 46 basic hiragana characters with proper stroke order and pronunciation."
                progress={30}
                isFeatured={true}
                onClick={() => navigate('/kana-learning')}
              />
              
              <LearningPathCard
                title="Katakana Essentials"
                japaneseTitle="カタカナ"
                description="Master the katakana syllabary used for foreign words and emphasis."
                progress={15}
                onClick={() => navigate('/kana-learning?type=katakana')}
              />
              
              <LearningPathCard
                title="Basic Kanji"
                japaneseTitle="漢字"
                description="Learn your first 100 essential kanji characters with readings and example words."
                progress={0}
                onClick={() => navigate('/kanji-basics')}
              />
              
              <LearningPathCard
                title="Grammar Foundations"
                japaneseTitle="文法"
                description="Build a solid foundation with essential Japanese grammar patterns."
                progress={0}
                onClick={() => navigate('/grammar-basics')}
              />
              
              <LearningPathCard
                title="Vocabulary Builder"
                japaneseTitle="語彙"
                description="Expand your Japanese vocabulary with commonly used words and phrases."
                progress={0}
                onClick={() => navigate('/vocabulary')}
              />
              
              <LearningPathCard
                title="Conversation Skills"
                japaneseTitle="会話"
                description="Practice everyday conversations and speaking patterns."
                progress={0}
                onClick={() => navigate('/conversation')}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Learn;

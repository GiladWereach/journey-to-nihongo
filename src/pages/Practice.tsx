
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dumbbell, Menu, BookOpen, Pen, Clock, GamepadIcon } from 'lucide-react';
import PrimaryNavigation from '@/components/layout/PrimaryNavigation';

interface PracticeCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
  featured?: boolean;
}

const PracticeCard: React.FC<PracticeCardProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick,
  featured = false
}) => {
  return (
    <Card 
      className={`overflow-hidden transition-all hover:shadow-md ${
        featured ? 'border-indigo' : ''
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-start">
          <div className={`p-3 rounded-lg ${
            featured ? 'bg-indigo text-white' : 'bg-indigo/10 text-indigo'
          } mr-4`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 mb-4">{description}</p>
            <Button 
              onClick={onClick}
              className={featured ? 'bg-indigo hover:bg-indigo/90' : ''}
            >
              Start Practice
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Practice: React.FC = () => {
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
                <h3 className="font-semibold text-indigo mb-2">Quick Access</h3>
                <ul className="space-y-2">
                  <li>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      size="sm"
                      onClick={() => navigate('/quick-quiz')}
                    >
                      Quick Quiz
                    </Button>
                  </li>
                  <li>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      size="sm"
                      onClick={() => navigate('/kana-learning')}
                    >
                      Kana Practice
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
                    <Dumbbell className="mr-2 h-5 w-5" />
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
              <h1 className="text-3xl font-bold text-indigo mb-2">Practice Hub</h1>
              <p className="text-gray-600">
                Choose a practice activity to reinforce your learning and build your skills.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <PracticeCard
                title="Quick Quiz"
                description="Test your knowledge with a quick quiz on hiragana, katakana, or both."
                icon={GamepadIcon}
                onClick={() => navigate('/quick-quiz')}
                featured={true}
              />
              
              <PracticeCard
                title="Writing Practice"
                description="Practice writing hiragana and katakana characters with stroke order guidance."
                icon={Pen}
                onClick={() => navigate('/writing-practice')}
              />
              
              <PracticeCard
                title="Timed Challenge"
                description="Race against the clock to identify as many characters as you can."
                icon={Clock}
                onClick={() => navigate('/timed-challenge')}
              />
              
              <PracticeCard
                title="Vocabulary Drill"
                description="Reinforce your vocabulary knowledge with targeted practice."
                icon={BookOpen}
                onClick={() => navigate('/vocabulary-drill')}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Practice;

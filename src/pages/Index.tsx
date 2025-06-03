
import React from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Target, Repeat } from 'lucide-react';

const Index = () => {
  const { isDark } = useDarkMode();
  const { user } = useAuth();
  
  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-indigo/95' : 'bg-gradient-to-b from-white to-softgray'}`}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-xl font-montserrat font-bold text-indigo tracking-tight">
              Nihongo Journey
            </span>
            
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/quiz">Quiz</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/profile">Profile</Link>
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center space-y-8">
            <div className="flex justify-center mb-8">
              <div className="flex space-x-2">
                {['あ', 'ア', 'か', 'カ'].map((char, index) => (
                  <JapaneseCharacter 
                    key={index}
                    character={char}
                    size="xl"
                    color={index % 2 === 0 ? "text-matcha" : "text-vermilion"}
                    animated={true}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 200}ms` }}
                  />
                ))}
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-indigo mb-6">
              Master Japanese Characters
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
              Practice Hiragana and Katakana with our endless quiz system. 
              Start your journey to reading Japanese today.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                className="bg-indigo hover:bg-indigo/90 text-white px-8 py-6 text-lg rounded-full"
                asChild
              >
                <Link to="/quiz" className="flex items-center gap-2">
                  Start Quiz
                  <ArrowRight size={20} />
                </Link>
              </Button>
              
              {!user && (
                <Button 
                  variant="outline" 
                  className="border-indigo text-indigo hover:bg-indigo hover:text-white px-8 py-6 text-lg rounded-full"
                  asChild
                >
                  <Link to="/auth">Sign Up Free</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-center text-indigo mb-12">
            Simple, Effective Learning
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-indigo/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-indigo" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Feedback</h3>
              <p className="text-gray-600">
                Get immediate feedback on every answer. Learn from mistakes and build confidence quickly.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-matcha/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-matcha" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Focused Practice</h3>
              <p className="text-gray-600">
                Choose between Hiragana and Katakana. Focus on what you need to learn most.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-vermilion/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Repeat className="h-8 w-8 text-vermilion" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Endless Practice</h3>
              <p className="text-gray-600">
                Practice as long as you want. No limits, no restrictions. Just pure learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo to-indigo/90">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of learners mastering Japanese characters with our simple, effective approach.
          </p>
          
          <Button 
            className="bg-white text-indigo hover:bg-gray-100 px-8 py-6 text-lg rounded-full"
            asChild
          >
            <Link to="/quiz" className="flex items-center gap-2">
              Start Your First Quiz
              <ArrowRight size={20} />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 mb-4">
            © 2024 Nihongo Journey. Simplified for better learning.
          </p>
          {user && (
            <Link 
              to="/legacy/dashboard" 
              className="text-indigo hover:underline text-sm"
            >
              Access Legacy Features
            </Link>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Index;

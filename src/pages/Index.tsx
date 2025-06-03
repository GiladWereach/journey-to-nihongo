
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Play, BarChart, User, Target, Zap, TrendingUp } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-softgray via-white to-indigo/5">
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
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/progress">Progress</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/profile">Profile</Link>
                  </Button>
                </div>
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
      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold text-indigo mb-6">
              Master Japanese Characters
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Learn Hiragana and Katakana through endless practice with intelligent tracking that adapts to your learning pace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-indigo hover:bg-indigo/90 text-white px-8 py-4 text-lg" asChild>
                <Link to="/quiz">
                  <Play className="mr-2 h-5 w-5" />
                  Start Learning
                </Link>
              </Button>
              {user && (
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg" asChild>
                  <Link to="/progress">
                    <BarChart className="mr-2 h-5 w-5" />
                    View Progress
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Quick Access for Authenticated Users */}
        {user && (
          <section className="py-12 bg-white/50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">Continue Your Journey</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <Link to="/quiz">
                    <CardHeader className="text-center">
                      <Play className="mx-auto h-12 w-12 text-vermilion mb-4 group-hover:scale-110 transition-transform" />
                      <CardTitle>Endless Quiz</CardTitle>
                      <CardDescription>Practice with our adaptive quiz system that learns from your progress</CardDescription>
                    </CardHeader>
                  </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <Link to="/progress">
                    <CardHeader className="text-center">
                      <BarChart className="mx-auto h-12 w-12 text-matcha mb-4 group-hover:scale-110 transition-transform" />
                      <CardTitle>Detailed Progress</CardTitle>
                      <CardDescription>Track mastery levels, confidence scores, and learning insights</CardDescription>
                    </CardHeader>
                  </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <Link to="/profile">
                    <CardHeader className="text-center">
                      <User className="mx-auto h-12 w-12 text-indigo mb-4 group-hover:scale-110 transition-transform" />
                      <CardTitle>Profile & Settings</CardTitle>
                      <CardDescription>Manage your account and customize your learning experience</CardDescription>
                    </CardHeader>
                  </Link>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-16 bg-gradient-to-b from-white to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-indigo mb-4">Smart Learning Features</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our intelligent tracking system adapts to your learning style and pace
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Target className="h-8 w-8 text-vermilion" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Adaptive Selection</h3>
                <p className="text-gray-600">
                  Characters are intelligently selected based on your mastery level, confidence score, and review schedule
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Zap className="h-8 w-8 text-matcha" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-time Feedback</h3>
                <p className="text-gray-600">
                  Get instant feedback with response time tracking and confidence scoring for each character
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-indigo" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Progress Insights</h3>
                <p className="text-gray-600">
                  Detailed analytics show your learning journey with mastery distributions and performance trends
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-indigo mb-4">How It Works</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Simple, effective learning through spaced repetition and intelligent character selection
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-indigo text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 text-sm font-bold">1</div>
                      <div>
                        <h3 className="font-semibold mb-2">Choose Your Characters</h3>
                        <p className="text-gray-600">Start with Hiragana or Katakana - our system will intelligently select characters based on your progress</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-indigo text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 text-sm font-bold">2</div>
                      <div>
                        <h3 className="font-semibold mb-2">Practice Endlessly</h3>
                        <p className="text-gray-600">Type the romaji for each character - get instant feedback and track your response times</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-indigo text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 text-sm font-bold">3</div>
                      <div>
                        <h3 className="font-semibold mb-2">Master Through Repetition</h3>
                        <p className="text-gray-600">Characters you struggle with appear more often, while mastered ones are reviewed at optimal intervals</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-indigo/10 to-vermilion/10 rounded-lg p-8 text-center">
                  <div className="text-6xl mb-4">あ</div>
                  <div className="text-2xl text-gray-600 mb-4">→</div>
                  <div className="bg-white rounded px-4 py-2 text-lg">a</div>
                  <p className="text-sm text-gray-500 mt-4">Simple recognition practice builds muscle memory</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-indigo to-vermilion text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Master Japanese?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of learners who are mastering Hiragana and Katakana with our intelligent practice system
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg" asChild>
                <Link to="/quiz">
                  <Play className="mr-2 h-5 w-5" />
                  Start Your Journey
                </Link>
              </Button>
              {!user && (
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg bg-white text-indigo hover:bg-gray-100" asChild>
                  <Link to="/auth">
                    <User className="mr-2 h-5 w-5" />
                    Create Account
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <span className="text-2xl font-montserrat font-bold">Nihongo Journey</span>
          </div>
          <p className="text-gray-400">
            Master Japanese characters through intelligent practice and tracking
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

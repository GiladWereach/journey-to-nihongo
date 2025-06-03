
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Play, BarChart, User, Target, Zap, TrendingUp } from 'lucide-react';
import TraditionalBackground from '@/components/ui/TraditionalAtmosphere';
import { TraditionalCard } from '@/components/ui/TraditionalAtmosphere';

const Index = () => {
  const { user } = useAuth();

  return (
    <TraditionalBackground>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-glass-wood backdrop-blur-traditional border-b-2 border-wood-light/40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-traditional font-bold text-paper-warm tracking-tight">
                Nihongo Journey
              </span>
            </Link>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" asChild className="bg-wood-grain border-wood-light/40 text-wood-light hover:bg-wood-light hover:text-gion-night">
                    <Link to="/progress">Progress</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="bg-wood-grain border-wood-light/40 text-wood-light hover:bg-wood-light hover:text-gion-night">
                    <Link to="/profile">Profile</Link>
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" asChild className="bg-wood-grain border-wood-light/40 text-wood-light hover:bg-wood-light hover:text-gion-night">
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
            <h1 className="text-5xl font-traditional font-bold text-paper-warm mb-6 tracking-wide">
              Master Japanese Characters
            </h1>
            <p className="text-xl text-wood-light mb-8 max-w-2xl mx-auto font-traditional">
              Learn Hiragana and Katakana through endless practice with intelligent tracking that adapts to your learning pace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-wood-light text-gion-night hover:bg-wood-medium px-8 py-4 text-lg font-traditional border-2 border-wood-light/40" asChild>
                <Link to="/quiz">
                  <Play className="mr-2 h-5 w-5" />
                  Start Learning
                </Link>
              </Button>
              {user && (
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg bg-wood-grain border-wood-light/40 text-wood-light hover:bg-wood-light hover:text-gion-night font-traditional" asChild>
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
          <section className="py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-traditional font-bold text-center mb-8 text-paper-warm tracking-wide">Continue Your Journey</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <TraditionalCard className="p-6 cursor-pointer group">
                  <Link to="/quiz">
                    <CardHeader className="text-center">
                      <Play className="mx-auto h-12 w-12 text-lantern-warm mb-4 group-hover:scale-110 transition-transform" />
                      <CardTitle className="text-wood-light font-traditional">Endless Quiz</CardTitle>
                      <CardDescription className="text-paper-warm/70 font-traditional">Practice with our adaptive quiz system that learns from your progress</CardDescription>
                    </CardHeader>
                  </Link>
                </TraditionalCard>

                <TraditionalCard className="p-6 cursor-pointer group">
                  <Link to="/progress">
                    <CardHeader className="text-center">
                      <BarChart className="mx-auto h-12 w-12 text-lantern-glow mb-4 group-hover:scale-110 transition-transform" />
                      <CardTitle className="text-wood-light font-traditional">Detailed Progress</CardTitle>
                      <CardDescription className="text-paper-warm/70 font-traditional">Track mastery levels, confidence scores, and learning insights</CardDescription>
                    </CardHeader>
                  </Link>
                </TraditionalCard>

                <TraditionalCard className="p-6 cursor-pointer group">
                  <Link to="/profile">
                    <CardHeader className="text-center">
                      <User className="mx-auto h-12 w-12 text-wood-light mb-4 group-hover:scale-110 transition-transform" />
                      <CardTitle className="text-wood-light font-traditional">Profile & Settings</CardTitle>
                      <CardDescription className="text-paper-warm/70 font-traditional">Manage your account and customize your learning experience</CardDescription>
                    </CardHeader>
                  </Link>
                </TraditionalCard>
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-traditional font-bold text-paper-warm mb-4 tracking-wide">Smart Learning Features</h2>
              <p className="text-lg text-wood-light max-w-2xl mx-auto font-traditional">
                Our intelligent tracking system adapts to your learning style and pace
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center">
                <TraditionalCard className="p-6 mb-4">
                  <div className="flex items-center justify-center mb-4">
                    <Target className="h-8 w-8 text-lantern-warm" />
                  </div>
                </TraditionalCard>
                <h3 className="text-xl font-traditional font-semibold mb-3 text-wood-light">Adaptive Selection</h3>
                <p className="text-paper-warm/70 font-traditional">
                  Characters are intelligently selected based on your mastery level, confidence score, and review schedule
                </p>
              </div>
              
              <div className="text-center">
                <TraditionalCard className="p-6 mb-4">
                  <div className="flex items-center justify-center mb-4">
                    <Zap className="h-8 w-8 text-lantern-glow" />
                  </div>
                </TraditionalCard>
                <h3 className="text-xl font-traditional font-semibold mb-3 text-wood-light">Real-time Feedback</h3>
                <p className="text-paper-warm/70 font-traditional">
                  Get instant feedback with response time tracking and confidence scoring for each character
                </p>
              </div>
              
              <div className="text-center">
                <TraditionalCard className="p-6 mb-4">
                  <div className="flex items-center justify-center mb-4">
                    <TrendingUp className="h-8 w-8 text-wood-light" />
                  </div>
                </TraditionalCard>
                <h3 className="text-xl font-traditional font-semibold mb-3 text-wood-light">Progress Insights</h3>
                <p className="text-paper-warm/70 font-traditional">
                  Detailed analytics show your learning journey with mastery distributions and performance trends
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-traditional font-bold text-paper-warm mb-4 tracking-wide">How It Works</h2>
              <p className="text-lg text-wood-light max-w-2xl mx-auto font-traditional">
                Simple, effective learning through spaced repetition and intelligent character selection
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-wood-light text-gion-night rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 text-sm font-bold font-traditional">1</div>
                      <div>
                        <h3 className="font-traditional font-semibold mb-2 text-wood-light">Choose Your Characters</h3>
                        <p className="text-paper-warm/70 font-traditional">Start with Hiragana or Katakana - our system will intelligently select characters based on your progress</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-wood-light text-gion-night rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 text-sm font-bold font-traditional">2</div>
                      <div>
                        <h3 className="font-traditional font-semibold mb-2 text-wood-light">Practice Endlessly</h3>
                        <p className="text-paper-warm/70 font-traditional">Type the romaji for each character - get instant feedback and track your response times</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-wood-light text-gion-night rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 text-sm font-bold font-traditional">3</div>
                      <div>
                        <h3 className="font-traditional font-semibold mb-2 text-wood-light">Master Through Repetition</h3>
                        <p className="text-paper-warm/70 font-traditional">Characters you struggle with appear more often, while mastered ones are reviewed at optimal intervals</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <TraditionalCard className="p-8 text-center">
                  <div className="text-6xl mb-4 font-traditional text-wood-light">あ</div>
                  <div className="text-2xl text-wood-light/60 mb-4">→</div>
                  <div className="bg-wood-grain border border-wood-light/30 px-4 py-2 text-lg text-wood-light font-traditional">a</div>
                  <p className="text-sm text-paper-warm/60 mt-4 font-traditional">Simple recognition practice builds muscle memory</p>
                </TraditionalCard>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <TraditionalCard className="p-12 max-w-4xl mx-auto">
              <h2 className="text-4xl font-traditional font-bold mb-6 text-paper-warm tracking-wide">Ready to Master Japanese?</h2>
              <p className="text-xl mb-8 text-wood-light max-w-2xl mx-auto font-traditional">
                Join thousands of learners who are mastering Hiragana and Katakana with our intelligent practice system
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="px-8 py-4 text-lg bg-wood-light text-gion-night hover:bg-wood-medium font-traditional border-2 border-wood-light/40" asChild>
                  <Link to="/quiz">
                    <Play className="mr-2 h-5 w-5" />
                    Start Your Journey
                  </Link>
                </Button>
                {!user && (
                  <Button size="lg" variant="outline" className="px-8 py-4 text-lg bg-wood-grain border-wood-light/40 text-wood-light hover:bg-wood-light hover:text-gion-night font-traditional" asChild>
                    <Link to="/auth">
                      <User className="mr-2 h-5 w-5" />
                      Create Account
                    </Link>
                  </Button>
                )}
              </div>
            </TraditionalCard>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="py-8">
        <div className="container mx-auto px-4 text-center">
          <TraditionalCard className="p-6">
            <div className="mb-4">
              <span className="text-2xl font-traditional font-bold text-paper-warm tracking-wide">Nihongo Journey</span>
            </div>
            <p className="text-wood-light font-traditional">
              Master Japanese characters through intelligent practice and tracking
            </p>
          </TraditionalCard>
        </div>
      </footer>
    </TraditionalBackground>
  );
};

export default Index;

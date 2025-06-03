
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Hero from '@/components/ui/Hero';
import FeaturesSection from '@/components/sections/FeaturesSection';
import LearningPathSection from '@/components/sections/LearningPathSection';
import TestimonialSection from '@/components/sections/TestimonialSection';
import CtaSection from '@/components/sections/CtaSection';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Play, BarChart, User } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-softgray via-white to-indigo/5">
      <Navbar />
      
      <main>
        <Hero />

        {/* Quick Access Cards for Authenticated Users */}
        {user && (
          <section className="py-16 bg-white/50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Continue Your Journey</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <Link to="/quiz">
                    <CardHeader className="text-center">
                      <Play className="mx-auto h-12 w-12 text-vermilion mb-4" />
                      <CardTitle>Start Quiz</CardTitle>
                      <CardDescription>Practice with our adaptive quiz system</CardDescription>
                    </CardHeader>
                  </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <Link to="/progress">
                    <CardHeader className="text-center">
                      <BarChart className="mx-auto h-12 w-12 text-matcha mb-4" />
                      <CardTitle>View Progress</CardTitle>
                      <CardDescription>Track your learning journey and mastery</CardDescription>
                    </CardHeader>
                  </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <Link to="/legacy/kana-learning">
                    <CardHeader className="text-center">
                      <BookOpen className="mx-auto h-12 w-12 text-indigo mb-4" />
                      <CardTitle>Learn Kana</CardTitle>
                      <CardDescription>Study hiragana and katakana characters</CardDescription>
                    </CardHeader>
                  </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <Link to="/profile">
                    <CardHeader className="text-center">
                      <User className="mx-auto h-12 w-12 text-amber-500 mb-4" />
                      <CardTitle>Profile</CardTitle>
                      <CardDescription>Manage your account and settings</CardDescription>
                    </CardHeader>
                  </Link>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* Main Content Sections */}
        <FeaturesSection />
        <LearningPathSection />
        <TestimonialSection />
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;

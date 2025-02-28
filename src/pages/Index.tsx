
import React from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/ui/Hero';
import LearningPathSection from '@/components/sections/LearningPathSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import TestimonialSection from '@/components/sections/TestimonialSection';
import CtaSection from '@/components/sections/CtaSection';

const Index = () => {
  const { isDark } = useDarkMode();
  
  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-indigo/95' : 'bg-white'}`}>
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Learning Paths Section */}
      <LearningPathSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Testimonial Section */}
      <TestimonialSection />
      
      {/* CTA Section */}
      <CtaSection />
      
      <Footer />
    </div>
  );
};

export default Index;

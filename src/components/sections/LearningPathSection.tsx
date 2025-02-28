
import React from 'react';
import LearningPathCard from '@/components/ui/LearningPathCard';
import { Button } from '@/components/ui/button';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { cn } from '@/lib/utils';

const LearningPathSection = () => {
  const { isDark } = useDarkMode();
  
  return (
    <section className={cn(
      "py-20",
      isDark ? "bg-indigo/80" : "bg-softgray"
    )}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold mb-4",
            isDark ? "text-white" : "text-indigo"
          )}>Your Path to Japanese Fluency</h2>
          <p className={cn(
            "max-w-2xl mx-auto",
            isDark ? "text-gray-300" : "text-gray-600"
          )}>
            Choose your learning path based on your goals and interests. Each path is designed to build practical language skills.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LearningPathCard
            title="Kana Mastery"
            japaneseTitle="かな"
            description="Master Hiragana and Katakana, the foundation of Japanese writing, with our interactive approach."
            progress={75}
            isFeatured={true}
          />
          
          <LearningPathCard
            title="Kanji Foundations"
            japaneseTitle="漢字"
            description="Learn the most common Japanese characters with our innovative memory techniques and real-context examples."
            progress={30}
          />
          
          <LearningPathCard
            title="Everyday Conversations"
            japaneseTitle="会話"
            description="Build practical speaking skills for travel, business, and social interactions through immersive dialogue practice."
          />
          
          <LearningPathCard
            title="Grammar Essentials"
            japaneseTitle="文法"
            description="Understand the structure of Japanese with clear explanations and practical usage patterns."
          />
          
          <LearningPathCard
            title="Cultural Immersion"
            japaneseTitle="文化"
            description="Explore Japanese culture, traditions, and customs while building relevant vocabulary and expressions."
          />
          
          <LearningPathCard
            title="JLPT Preparation"
            japaneseTitle="試験"
            description="Structured preparation courses for all levels of the Japanese Language Proficiency Test (N5 to N1)."
          />
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" className={cn(
            isDark ? "border-white text-white hover:bg-white/20" : "border-indigo text-indigo hover:bg-indigo hover:text-white"
          )}>
            View All Learning Paths
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LearningPathSection;

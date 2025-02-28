
import React from 'react';
import FeatureCard from '@/components/ui/FeatureCard';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { cn } from '@/lib/utils';

const FeaturesSection = () => {
  const { isDark } = useDarkMode();
  
  return (
    <section className={cn("py-20", isDark ? "bg-indigo/90" : "bg-white")}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold mb-4",
            isDark ? "text-white" : "text-indigo"
          )}>The Nihongo Journey Difference</h2>
          <p className={cn(
            "max-w-2xl mx-auto",
            isDark ? "text-gray-300" : "text-gray-600"
          )}>
            Our scientifically-backed approach combines proven learning methods with engaging content to help you achieve real language proficiency.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            title="Adaptive Learning"
            description="Our system adjusts to your learning style, strengths, and progress to create a personalized learning experience."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 17 10 11 4 5"></polyline>
                <line x1="12" y1="19" x2="20" y2="19"></line>
              </svg>
            }
            delay={100}
          />
          
          <FeatureCard
            title="Spaced Repetition"
            description="Our intelligent review system presents material at optimal intervals for maximum retention and minimal forgetting."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            }
            delay={200}
          />
          
          <FeatureCard
            title="Cultural Context"
            description="Learn Japanese in the context of real cultural situations, enhancing both language skills and cultural understanding."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
              </svg>
            }
            delay={300}
          />
          
          <FeatureCard
            title="Immersive Audio"
            description="High-quality native speaker recordings and speech recognition technology for authentic pronunciation practice."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
            }
            delay={400}
          />
          
          <FeatureCard
            title="Visual Learning"
            description="Illustrations, animations, and visual mnemonics make complex concepts easier to understand and remember."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            }
            delay={500}
          />
          
          <FeatureCard
            title="Progress Tracking"
            description="Comprehensive analytics and progress tracking to help you understand your strengths and focus on areas that need improvement."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20v-6M6 20V10M18 20V4"></path>
              </svg>
            }
            delay={600}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

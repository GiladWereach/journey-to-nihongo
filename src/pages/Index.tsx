
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/ui/Hero';
import LearningPathCard from '@/components/ui/LearningPathCard';
import FeatureCard from '@/components/ui/FeatureCard';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Learning Paths Section */}
      <section className="py-20 bg-softgray">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo mb-4">Your Path to Japanese Fluency</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
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
            <Button variant="outline" className="border-indigo text-indigo hover:bg-indigo hover:text-white">
              View All Learning Paths
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo mb-4">The Nihongo Journey Difference</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
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
      
      {/* Testimonial Section */}
      <section className="py-20 bg-indigo text-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Learners Say</h2>
            <div className="w-20 h-1 bg-vermilion mx-auto"></div>
          </div>
          
          <div className="relative p-8 md:p-12 bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden">
            <svg className="absolute -top-6 -left-6 text-white/20" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.9999 9.5C11.9999 7.84 10.6599 6.5 8.99994 6.5H6.99994V8.5H8.99994C9.54994 8.5 9.99994 8.95 9.99994 9.5V11.5C9.99994 12.05 9.54994 12.5 8.99994 12.5H6.99994V14.5H8.99994C10.6599 14.5 11.9999 13.16 11.9999 11.5V9.5ZM17.9999 9.5C17.9999 7.84 16.6599 6.5 14.9999 6.5H12.9999V8.5H14.9999C15.5499 8.5 15.9999 8.95 15.9999 9.5V11.5C15.9999 12.05 15.5499 12.5 14.9999 12.5H12.9999V14.5H14.9999C16.6599 14.5 17.9999 13.16 17.9999 11.5V9.5Z" />
            </svg>
            
            <div className="text-center">
              <p className="text-lg md:text-xl italic mb-8">
                "Nihongo Journey transformed my approach to Japanese learning. Unlike other apps I've tried, it focuses on practical language skills and cultural context, not just memorization. After six months, I was able to have real conversations with native speakers."
              </p>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-vermilion/20 mb-4 flex items-center justify-center">
                  <span className="text-vermilion font-bold text-xl">AT</span>
                </div>
                <h4 className="text-lg font-semibold">Amanda T.</h4>
                <p className="text-white/70">JLPT N3 Certified</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <button className="w-3 h-3 rounded-full bg-white/30 mx-1 hover:bg-white/70 transition-colors"></button>
            <button className="w-3 h-3 rounded-full bg-white mx-1"></button>
            <button className="w-3 h-3 rounded-full bg-white/30 mx-1 hover:bg-white/70 transition-colors"></button>
            <button className="w-3 h-3 rounded-full bg-white/30 mx-1 hover:bg-white/70 transition-colors"></button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-washi-pattern opacity-10 z-0"></div>
        
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="bg-gradient-to-r from-indigo to-indigo/90 rounded-3xl p-10 md:p-16 text-white text-center">
            <div className="flex justify-center mb-8">
              <div className="flex">
                {['始', 'め', 'よ', 'う'].map((char, index) => (
                  <JapaneseCharacter 
                    key={index}
                    character={char} 
                    size="md" 
                    color={index === 0 ? "text-vermilion" : "text-white"}
                    animated={false}
                    className="opacity-100"
                  />
                ))}
              </div>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Start Your Japanese Journey Today</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are achieving their Japanese language goals with our comprehensive, adaptive approach.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-vermilion hover:bg-vermilion/90 text-white px-8 py-6 text-lg rounded-full">
                Sign Up Free
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-indigo px-8 py-6 text-lg rounded-full">
                Explore Plans
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;

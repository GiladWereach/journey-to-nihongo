
import React from 'react';
import { Button } from '@/components/ui/button';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';

const CtaSection = () => {
  return (
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
  );
};

export default CtaSection;

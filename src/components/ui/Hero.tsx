
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import JapaneseCharacter from './JapaneseCharacter';
import { cn } from '@/lib/utils';

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const opacity = Math.max(1 - scrollY / 500, 0);
      const translateY = scrollY * 0.3;
      
      heroRef.current.style.opacity = opacity.toString();
      heroRef.current.style.transform = `translateY(${translateY}px)`;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={heroRef}
      className={cn(
        'relative py-20 md:py-32 overflow-hidden transition-all duration-500',
        className
      )}
      style={{ opacity: 0, transform: 'translateY(0px)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white to-softgray z-[-1]" />
      
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center space-y-6 relative">
          <div className="flex justify-center mb-4">
            <div className="flex space-x-1 md:space-x-2">
              {['日', '本', '語', 'の', '旅'].map((char, index) => (
                <JapaneseCharacter 
                  key={index}
                  character={char}
                  size="lg"
                  color={index === 2 ? "text-vermilion" : "text-indigo"}
                  className={cn(
                    isVisible ? 'animate-fade-in opacity-100' : 'opacity-0',
                    'animation-delay-' + (index * 150)
                  )}
                  style={{ animationDelay: `${index * 150}ms` }}
                />
              ))}
            </div>
          </div>

          <h1 
            className={cn(
              "text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-indigo",
              isVisible ? 'animate-fade-in opacity-100' : 'opacity-0',
              'animation-delay-500'
            )}
            style={{ animationDelay: '500ms' }}
          >
            Nihongo Journey
          </h1>
          
          <p 
            className={cn(
              "text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto",
              isVisible ? 'animate-fade-in opacity-100' : 'opacity-0',
              'animation-delay-700'
            )}
            style={{ animationDelay: '700ms' }}
          >
            Master Japanese, Naturally.
          </p>
          
          <div 
            className={cn(
              "flex flex-col sm:flex-row justify-center gap-4 pt-6",
              isVisible ? 'animate-fade-in opacity-100' : 'opacity-0',
              'animation-delay-900'
            )}
            style={{ animationDelay: '900ms' }}
          >
            <Button 
              className="bg-vermilion hover:bg-vermilion/90 text-white px-8 py-6 rounded-full text-lg"
            >
              Start Your Journey
            </Button>
            <Button 
              variant="outline" 
              className="border-indigo text-indigo hover:bg-indigo hover:text-white px-8 py-6 rounded-full text-lg"
            >
              Explore Lessons
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

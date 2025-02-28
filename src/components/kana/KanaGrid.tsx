
import React, { useState, useRef, useEffect } from 'react';
import KanaCard from './KanaCard';
import { KanaCharacter, KanaGroup, KanaType } from '@/types/kana';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';

interface KanaGridProps {
  kanaList: KanaCharacter[];
  className?: string;
}

// Group kana by their first letter in romaji
const groupKanaBySection = (kanaList: KanaCharacter[]): Record<string, KanaCharacter[]> => {
  const groups: Record<string, KanaCharacter[]> = {};
  
  // Group by first letter of romaji (a, k, s, etc.)
  kanaList.forEach(kana => {
    const firstLetter = kana.romaji.charAt(0).toUpperCase();
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(kana);
  });
  
  return groups;
};

const KanaGrid: React.FC<KanaGridProps> = ({ kanaList, className }) => {
  const [selectedType, setSelectedType] = useState<KanaType | 'all'>('all');
  const [expandedKana, setExpandedKana] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Filter kana by selected type
  const filteredKana = selectedType === 'all' 
    ? kanaList 
    : kanaList.filter(kana => kana.type === selectedType);
  
  // Group kana by section
  const kanaGroups = groupKanaBySection(filteredKana);
  const sectionKeys = Object.keys(kanaGroups).sort();
  
  // Set initial active section
  useEffect(() => {
    if (sectionKeys.length > 0 && !activeSection) {
      setActiveSection(sectionKeys[0]);
    }
  }, [sectionKeys, activeSection]);
  
  // Scroll to section when clicked
  const scrollToSection = (section: string) => {
    setActiveSection(section);
    sectionRefs.current[section]?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };
  
  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      // Find the section that is currently in view
      for (const section of sectionKeys) {
        const element = sectionRefs.current[section];
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          if (top <= 150 && bottom > 0) {
            if (activeSection !== section) {
              setActiveSection(section);
            }
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionKeys, activeSection]);
  
  // Scroll to top button
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="sticky top-16 z-10 bg-background pt-4 pb-2 shadow-sm">
        <div className="flex justify-center mb-4">
          <RadioGroup
            className="flex space-x-4"
            defaultValue="all"
            onValueChange={(value) => setSelectedType(value as KanaType | 'all')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hiragana" id="hiragana" />
              <Label htmlFor="hiragana">Hiragana</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="katakana" id="katakana" />
              <Label htmlFor="katakana">Katakana</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Apple-style section navigator */}
        <div className="overflow-x-auto hide-scrollbar py-2">
          <div className="flex space-x-1 px-2 justify-center">
            {sectionKeys.map(section => (
              <Button
                key={section}
                variant={activeSection === section ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-full px-3 transition-all",
                  activeSection === section 
                    ? "bg-indigo text-white" 
                    : "text-muted-foreground hover:bg-indigo/10"
                )}
                onClick={() => scrollToSection(section)}
              >
                {section}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Kana sections */}
      {sectionKeys.map(section => (
        <div 
          key={section}
          ref={el => sectionRefs.current[section] = el}
          className="scroll-mt-32"
        >
          <div className="sticky top-28 z-10 bg-background/80 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-indigo mb-4 pt-2 pb-1 border-b border-indigo/20">
              {section}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
            {kanaGroups[section].map((kana) => (
              <KanaCard
                key={kana.id}
                kana={kana}
                showDetails={expandedKana === kana.id}
                onShowDetails={() => {
                  if (expandedKana === kana.id) {
                    setExpandedKana(null);
                  } else {
                    setExpandedKana(kana.id);
                  }
                }}
                onPractice={() => {
                  // Will implement in the next component
                  console.log(`Practice ${kana.character}`);
                }}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Scroll to top button */}
      <div className="fixed right-6 bottom-6">
        <Button 
          size="icon" 
          className="rounded-full bg-indigo hover:bg-indigo/90 shadow-lg"
          onClick={scrollToTop}
        >
          <ChevronUp size={22} />
        </Button>
      </div>
      
      {/* Add extra padding at the bottom for smoother scrolling */}
      <div className="h-20"></div>
    </div>
  );
};

export default KanaGrid;

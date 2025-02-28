
import React, { useState, useRef, useEffect } from 'react';
import KanaCard from './KanaCard';
import { KanaCharacter, KanaGroup, KanaType } from '@/types/kana';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronUp, Info, X } from 'lucide-react';

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
  const [showHelp, setShowHelp] = useState(false);
  const [showDock, setShowDock] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const gridRef = useRef<HTMLDivElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);
  
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
  
  // Update active section based on scroll position and control dock visibility
  useEffect(() => {
    const handleScroll = () => {
      if (!gridRef.current || !filterBarRef.current) return;
      
      // Check if filter bar is scrolled out of view to show dock
      const filterBarBottom = filterBarRef.current.getBoundingClientRect().bottom;
      
      // Show dock when filter bar is scrolled out of view
      if (filterBarBottom <= 0 && !showDock) {
        setShowDock(true);
      } else if (filterBarBottom > 0 && showDock) {
        setShowDock(false);
      }
      
      // Find the section that is currently in view
      for (const section of sectionKeys) {
        const element = sectionRefs.current[section];
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          if (top <= 180 && bottom > 0) {
            if (activeSection !== section) {
              setActiveSection(section);
            }
            break;
          }
        }
      }
    };
    
    // Initial call to set correct state on page load
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionKeys, activeSection, showDock]);
  
  // Scroll to top button
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={cn("space-y-6", className)} ref={gridRef}>
      <div className="sticky top-[53px] z-20 bg-background/95 backdrop-blur-sm pt-2 pb-1 border-b border-border/40" ref={filterBarRef}>
        <div className="flex justify-between items-center mb-2">
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
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowHelp(!showHelp)}
            className="text-muted-foreground hover:text-indigo transition-colors"
          >
            <Info size={18} />
          </Button>
        </div>
        
        {showHelp && (
          <div className="bg-muted/50 p-3 mb-3 rounded-md relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1 h-6 w-6" 
              onClick={() => setShowHelp(false)}
            >
              <X size={14} />
            </Button>
            <h3 className="text-sm font-medium mb-1">Navigation Help</h3>
            <p className="text-xs text-muted-foreground">
              • Click on section buttons below to navigate<br />
              • Click on any card to see pronunciation details
            </p>
          </div>
        )}
        
        {/* Section navigator visible at the top */}
        <div className="overflow-x-auto hide-scrollbar py-1 mt-1">
          <div className="flex space-x-1 px-2 justify-center">
            {sectionKeys.map(section => (
              <Button
                key={section}
                variant={activeSection === section ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-full px-3 py-1 h-7 text-sm transition-all",
                  activeSection === section 
                    ? "bg-indigo text-white" 
                    : "text-muted-foreground hover:bg-indigo/10 hover:text-indigo"
                )}
                onClick={() => scrollToSection(section)}
              >
                {section}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Dock navigation that appears when scrolling */}
      {showDock && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
          <div className="bg-background/95 backdrop-blur-lg shadow-lg rounded-full border border-border/40 py-2 px-3">
            <div className="flex space-x-1 items-center">
              {sectionKeys.map(section => (
                <Button
                  key={`dock-${section}`}
                  variant={activeSection === section ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "rounded-full w-8 h-8 p-0 min-w-0",
                    activeSection === section 
                      ? "bg-indigo text-white" 
                      : "text-muted-foreground hover:bg-indigo/10 hover:text-indigo"
                  )}
                  onClick={() => scrollToSection(section)}
                >
                  {section}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Kana sections */}
      {sectionKeys.map(section => (
        <div 
          key={section}
          ref={el => sectionRefs.current[section] = el}
          className="scroll-mt-40"
          id={`section-${section}`}
        >
          <div className="sticky top-[106px] z-10 bg-background/95 backdrop-blur-sm pb-1">
            <h2 className="text-2xl font-bold text-indigo border-b border-indigo/10 pb-1 mb-3">
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
          <ChevronUp size={20} />
        </Button>
      </div>
      
      {/* Add extra padding at the bottom for smoother scrolling */}
      <div className="h-20"></div>
    </div>
  );
};

export default KanaGrid;

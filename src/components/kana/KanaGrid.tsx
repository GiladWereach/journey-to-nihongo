
import React, { useState, useRef, useEffect } from 'react';
import KanaCard from './KanaCard';
import { KanaCharacter, KanaGroup, KanaType } from '@/types/kana';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronUp, Info } from 'lucide-react';

interface KanaGridProps {
  kanaList: KanaCharacter[];
  className?: string;
}

// Group kana by their first letter in romaji
const groupKanaBySection = (kanaList: KanaCharacter[]): Record<string, KanaCharacter[]> => {
  const groups: Record<string, KanaCharacter[]> = {};
  
  // Define section order to ensure B, D, J, P, V are included
  const sectionOrder = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
                        'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'Y', 'Z'];
  
  // Initialize empty groups for all sections
  sectionOrder.forEach(section => {
    groups[section] = [];
  });
  
  // Group by first letter of romaji
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
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Filter kana by selected type
  const filteredKana = selectedType === 'all' 
    ? kanaList 
    : kanaList.filter(kana => kana.type === selectedType);
  
  // Group kana by section
  const kanaGroups = groupKanaBySection(filteredKana);
  
  // Always display all section buttons, even for empty sections
  const allSections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
                       'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'Y', 'Z'];
  
  // Only show sections that have content
  const sectionKeys = allSections.filter(section => kanaGroups[section] && kanaGroups[section].length > 0);
  
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
      if (!gridRef.current) return;
      
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
    
    // Delay the initial check to ensure layout is properly calculated
    setTimeout(handleScroll, 100);
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Force multiple checks after layout stabilizes at different intervals
    const timers = [
      setTimeout(handleScroll, 300),
      setTimeout(handleScroll, 600),
      setTimeout(handleScroll, 1000),
    ];
    
    // Force a check when window is resized
    const handleResize = () => {
      setTimeout(handleScroll, 100);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [sectionKeys, activeSection]);
  
  // Scroll to top button
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={cn("space-y-6 relative", className)} ref={gridRef}>
      {/* Section navigation - positioned below the tabs but with higher z-index */}
      <div className="sticky top-[104px] z-30 bg-background/95 backdrop-blur-sm pt-2 pb-1 border-b border-border/40">
        <div className="overflow-x-auto hide-scrollbar py-1">
          <div className="flex space-x-1 px-2 justify-center">
            {allSections.map(section => {
              // Check if this section has any kana
              const hasContent = kanaGroups[section] && kanaGroups[section].length > 0;
              // If no content, gray it out
              return (
                <Button
                  key={section}
                  variant={activeSection === section ? "default" : "outline"}
                  size="sm"
                  disabled={!hasContent}
                  className={cn(
                    "rounded-full px-3 py-1 h-7 text-sm transition-all",
                    hasContent ? (
                      activeSection === section 
                        ? "bg-indigo text-white" 
                        : "text-muted-foreground hover:bg-indigo/10 hover:text-indigo"
                    ) : "opacity-40 cursor-not-allowed"
                  )}
                  onClick={() => hasContent && scrollToSection(section)}
                >
                  {section}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed floating filter panel - now positioned BELOW the nav */}
      <div className="fixed right-6 top-[160px] z-20 bg-background/95 backdrop-blur-lg rounded-xl shadow-lg border border-border/40 p-4 max-w-[220px] transition-all">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Filter Kana</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowHelp(!showHelp)}
              className="h-6 w-6 text-muted-foreground hover:text-indigo transition-colors"
            >
              <Info size={16} />
            </Button>
          </div>
          
          <RadioGroup
            className="flex flex-col space-y-2"
            defaultValue="all"
            onValueChange={(value) => setSelectedType(value as KanaType | 'all')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hiragana" id="hiragana" />
              <Label htmlFor="hiragana" className="flex items-center">
                <span className="bg-matcha text-white h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold mr-1.5">H</span>
                Hiragana
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="katakana" id="katakana" />
              <Label htmlFor="katakana" className="flex items-center">
                <span className="bg-vermilion text-white h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold mr-1.5">K</span>
                Katakana
              </Label>
            </div>
          </RadioGroup>
          
          {showHelp && (
            <div className="bg-muted/50 p-3 rounded-md text-xs text-muted-foreground">
              <h4 className="font-medium text-xs mb-1">Navigation Help</h4>
              <p className="mb-1">• Click section buttons to navigate</p>
              <p>• Click any card to see details</p>
            </div>
          )}
        </div>
      </div>

      {/* Kana sections */}
      {sectionKeys.map(section => (
        <div 
          key={section}
          ref={el => sectionRefs.current[section] = el}
          className="scroll-mt-[160px]" 
          id={`section-${section}`}
        >
          <div className="sticky top-[154px] z-20 bg-background/95 backdrop-blur-sm pb-1">
            <h2 className="text-2xl font-bold text-indigo border-b border-indigo/10 pb-1 mb-3">
              {section}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-8">
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

      {/* Scroll to top button - enhanced z-index and visibility */}
      <div className="fixed right-6 bottom-6 z-50 pointer-events-auto">
        <Button 
          size="icon" 
          className="rounded-full bg-indigo hover:bg-indigo/90 shadow-xl h-12 w-12"
          onClick={scrollToTop}
        >
          <ChevronUp size={24} />
        </Button>
      </div>
      
      {/* Add extra padding at the bottom for smoother scrolling */}
      <div className="h-20"></div>
    </div>
  );
};

export default KanaGrid;

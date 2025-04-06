
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, BrainCircuit, Lightbulb, Microscope } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface TeachingMechanismsCardProps {
  currentStage: 'beginner' | 'intermediate' | 'advanced';
  className?: string;
}

const TeachingMechanismsCard: React.FC<TeachingMechanismsCardProps> = ({
  currentStage,
  className
}) => {
  // Define the teaching mechanisms based on the learning stage
  const mechanisms = {
    beginner: [
      {
        icon: <BookOpen className="h-5 w-5 text-matcha" />,
        title: 'Shadow-and-Match System',
        description: 'Visualize correct pronunciation with audio playback and speech organ diagrams'
      },
      {
        icon: <Lightbulb className="h-5 w-5 text-amber-500" />,
        title: 'Formula-Slot Method',
        description: 'Learn template sentences with variable slots for flexible conversation'
      },
      {
        icon: <Microscope className="h-5 w-5 text-indigo" />,
        title: 'Contextual Character Learning',
        description: 'Learn characters within familiar vocabulary with memory aids'
      }
    ],
    intermediate: [
      {
        icon: <BookOpen className="h-5 w-5 text-matcha" />,
        title: 'Pattern Contrast Method',
        description: 'Compare similar patterns with contextual examples highlighting differences'
      },
      {
        icon: <Lightbulb className="h-5 w-5 text-amber-500" />,
        title: 'Dialogue Building System',
        description: 'Complete partial dialogues with multiple acceptable paths'
      },
      {
        icon: <BrainCircuit className="h-5 w-5 text-indigo" />,
        title: 'Supported Reading Method',
        description: 'Progressive text revelation with just-in-time vocabulary support'
      }
    ],
    advanced: [
      {
        icon: <BookOpen className="h-5 w-5 text-matcha" />,
        title: 'Expression Deconstruction',
        description: 'Analyze etymology and components of complex expressions'
      },
      {
        icon: <Lightbulb className="h-5 w-5 text-amber-500" />,
        title: 'Discourse Strategy Training',
        description: 'Learn topic transitions and negotiation frameworks for fluent conversation'
      },
      {
        icon: <BrainCircuit className="h-5 w-5 text-indigo" />,
        title: 'Authentic Materials Approach',
        description: 'Study with real-world materials with graduated scaffolding'
      }
    ]
  };

  // Determine the current learning stage mechanisms
  const currentMechanisms = mechanisms[currentStage];
  
  // Define stage-specific colors and titles
  const stageInfo = {
    beginner: {
      title: 'Beginner Learning Techniques',
      color: 'text-matcha'
    },
    intermediate: {
      title: 'Intermediate Learning Techniques',
      color: 'text-vermilion'
    },
    advanced: {
      title: 'Advanced Learning Techniques',
      color: 'text-indigo'
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl font-semibold">
          <BrainCircuit className={`mr-2 h-5 w-5 ${stageInfo[currentStage].color}`} />
          {stageInfo[currentStage].title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentMechanisms.map((mechanism, index) => (
            <div key={index} className="flex items-start">
              <div className="mt-0.5 mr-3">{mechanism.icon}</div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{mechanism.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{mechanism.description}</p>
                
                {/* Add simple progress indicator */}
                <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={
                      currentStage === 'beginner' ? "bg-matcha h-full rounded-full" :
                      currentStage === 'intermediate' ? "bg-vermilion h-full rounded-full" :
                      "bg-indigo h-full rounded-full"
                    }
                    style={{ 
                      width: `${index === 0 ? 75 : index === 1 ? 45 : 25}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Separator className="my-4" />
        
        <div className="bg-gray-50 p-3 rounded-md">
          <h4 className="text-sm font-medium mb-2">Learning Recommendation</h4>
          <p className="text-xs text-gray-600">
            {currentStage === 'beginner' 
              ? 'Focus on consistent practice with the Shadow-and-Match system to build a strong pronunciation foundation.' 
              : currentStage === 'intermediate'
              ? 'Expand your skills with the Pattern Contrast Method to master similar grammar patterns.'
              : 'Challenge yourself with the Authentic Materials Approach to reach native-like fluency.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeachingMechanismsCard;

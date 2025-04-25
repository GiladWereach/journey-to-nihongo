
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Feature {
  name: string;
  description: string;
  icon: string;
  available: boolean;
}

interface StageFeaturesProps {
  features: Feature[];
}

const StageFeatures: React.FC<StageFeaturesProps> = ({ features }) => {
  const renderFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'book-open':
        return <BookOpen className="h-4 w-4" />;
      case 'clock':
        return <Clock className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {features.map((feature, idx) => (
        <Badge 
          key={idx} 
          variant="outline"
          className={cn(
            "flex items-center gap-1 py-1",
            feature.available ? "bg-gray-50" : "bg-gray-50 opacity-60"
          )}
        >
          {renderFeatureIcon(feature.icon)}
          <span className="text-xs">{feature.name}</span>
          {!feature.available && (
            <span className="text-xs text-gray-400 ml-1">(Coming Soon)</span>
          )}
        </Badge>
      ))}
    </div>
  );
};

export default StageFeatures;

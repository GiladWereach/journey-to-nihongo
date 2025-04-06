
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, BookOpen, BarChart } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';

interface StudySession {
  id: string;
  user_id: string;
  module: string;
  topics: string[];
  duration_minutes: number;
  session_date: string;
  completed: boolean;
  performance_score?: number;
  created_at?: string;
}

interface StudySessionsListProps {
  studySessions: StudySession[];
  loading: boolean;
}

// Function to determine module color
const getModuleColor = (module: string): string => {
  switch (module.toLowerCase()) {
    case 'hiragana':
      return 'bg-matcha/10 text-matcha border-matcha/20';
    case 'katakana':
      return 'bg-vermilion/10 text-vermilion border-vermilion/20';
    case 'kanji':
      return 'bg-indigo/10 text-indigo border-indigo/20';
    case 'grammar':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'quiz':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'assessment':
      return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const StudySessionsList: React.FC<StudySessionsListProps> = ({
  studySessions,
  loading
}) => {
  const [displayLimit, setDisplayLimit] = useState(10);
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPP'); // Long date format
    } catch {
      return dateString;
    }
  };
  
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'p'); // Time format
    } catch {
      return '';
    }
  };
  
  const loadMore = () => {
    setDisplayLimit(prev => prev + 10);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="mr-2 h-5 w-5" />
          Study History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo"></div>
          </div>
        ) : studySessions.length > 0 ? (
          <div className="space-y-4">
            {studySessions.slice(0, displayLimit).map(session => (
              <div key={session.id} className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center">
                    <Badge className={`mr-2 ${getModuleColor(session.module)}`}>
                      {session.module}
                    </Badge>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-1 h-4 w-4" />
                            {formatDate(session.created_at || '')}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{formatTime(session.created_at || '')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center text-sm">
                      <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{session.duration_minutes} minutes</span>
                    </div>
                    {session.performance_score !== undefined && (
                      <div className="flex items-center text-sm">
                        <BarChart className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{Math.round(session.performance_score)}% score</span>
                      </div>
                    )}
                  </div>
                </div>
                {session.topics.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {session.topics.map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {studySessions.length > displayLimit && (
              <div className="text-center pt-2">
                <button 
                  onClick={loadMore}
                  className="text-indigo hover:text-indigo/80 text-sm font-medium"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
            <p>No study sessions recorded yet.</p>
            <p className="text-sm mt-1">Start learning to track your progress!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudySessionsList;
